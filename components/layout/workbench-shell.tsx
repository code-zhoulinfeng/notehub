"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { EyeIcon, FileIcon, HomeIcon, LogoIcon, LogoutIcon, SettingsIcon } from "@/components/icons";
import { Avatar } from "@/features/user/components/avatar";
import { toast } from "@/lib/toast";
import { NOTES, REPO, USER } from "@/lib/mock/data";
import { cn } from "cn";

const NAV = [
  { id: "dash", label: "工作台", href: "/app", icon: HomeIcon },
  { id: "notes", label: "笔记", href: "/app/notes", icon: FileIcon },
  { id: "settings", label: "设置", href: "/app/settings", icon: SettingsIcon },
] as const;

/** 根据路径判断当前导航高亮项 */
function activeNav(pathname: string): string {
  if (pathname === "/app") return "dash";
  if (pathname.startsWith("/app/notes")) return "notes";
  if (pathname.startsWith("/app/settings")) return "settings";
  return "dash";
}

/** 顶栏标题映射（与 design.html 各 OwnerShell 调用一致） */
function headerTitle(pathname: string): string {
  if (pathname === "/app") return "工作台";
  if (pathname === "/app/notes") return "全部笔记";
  if (pathname === "/app/settings") return "设置";
  if (pathname.endsWith("/history")) return "版本历史";
  if (pathname.endsWith("/compare")) return "版本对比";
  return "全部笔记";
}

/** 编辑器页是否为全屏（不带侧栏 chrome） */
function isEditorFullscreen(pathname: string): boolean {
  return /^\/app\/notes\/.+/.test(pathname) && !pathname.endsWith("/history") && !pathname.endsWith("/compare");
}

/**
 * Owner 工作台外壳 —— 与 design.html 的 OwnerShell 一致。
 * 编辑器路由（/app/notes/[...path]）为全屏模式，不渲染侧栏。
 */
export function WorkbenchShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/app";
  const router = useRouter();

  const pub = NOTES.filter((n) => n.public).length;
  const priv = NOTES.length - pub;
  const dirty = NOTES.filter((n) => n.dirty).length;

  if (isEditorFullscreen(pathname)) return <>{children}</>;

  const active = activeNav(pathname);

  return (
    <div className="flex min-h-screen bg-ink-950">
      {/* 侧边栏 */}
      <aside className="sticky top-0 hidden h-screen w-[240px] shrink-0 flex-col border-r border-ink-700/60 bg-ink-900/40 lg:flex">
        <Link href="/app" className="flex h-16 items-center gap-2.5 border-b border-ink-700/50 px-5 transition hover:bg-white/[0.02]">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-white">
            <LogoIcon className="h-[18px] w-[18px]" />
          </div>
          <span className="font-semibold tracking-tight">NoteHub</span>
          <span className="ml-auto font-mono text-[10px] tracking-wider text-ink-500">OWNER</span>
        </Link>

        <nav className="space-y-0.5 p-3">
          {NAV.map((n) => {
            const on = n.id === active;
            const Icon = n.icon;
            return (
              <Link
                key={n.id}
                href={n.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13.5px] transition-all",
                  on ? "side-active" : "text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-100",
                )}
              >
                <Icon className={cn("h-[18px] w-[18px] text-ink-300", { "text-accent-400": on })} />
                <span className={on ? "font-medium" : ""}>{n.label}</span>
                <span className="side-dot ml-auto h-1.5 w-1.5 rounded-full bg-accent opacity-0 transition-opacity" />
              </Link>
            );
          })}
        </nav>

        <div className="mt-2 px-4 py-4">
          <div className="mb-3 px-1 text-[10px] tracking-[0.16em] text-ink-500 uppercase">概览</div>
          <div className="space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 text-[12.5px]">
              <span className="text-ink-300">全部笔记</span>
              <span className="font-mono text-white">{NOTES.length}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 text-[12.5px]">
              <span className="flex items-center gap-1.5 text-ink-300">
                <span className="h-2 w-2 rounded-full bg-mint" />
                已公开
              </span>
              <span className="font-mono text-white">{pub}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2 text-[12.5px]">
              <span className="flex items-center gap-1.5 text-ink-300">
                <span className="h-2 w-2 rounded-full bg-ink-500" />
                私密
              </span>
              <span className="font-mono text-white">{priv}</span>
            </div>
            {dirty ? (
              <div className="flex items-center justify-between rounded-lg border border-amber/25 bg-amber/10 px-3 py-2 text-[12.5px]">
                <span className="flex items-center gap-1.5 text-amber">
                  <span className="h-2 w-2 rounded-full bg-amber" />
                  待提交
                </span>
                <span className="font-mono font-semibold text-amber">{dirty}</span>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-2 px-4">
          <div className="mb-3 px-1 text-[10px] tracking-[0.16em] text-ink-500 uppercase">仓库</div>
          <Link
            href="/app/settings"
            className="block rounded-lg border border-ink-700/60 bg-white/[0.02] px-3 py-2.5 transition hover:bg-white/[0.04]"
          >
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              <span className="truncate font-mono text-[12.5px] text-zinc-300">
                {REPO.owner}/{REPO.repo}
              </span>
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 font-mono text-[11px] text-ink-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-3 w-3"
              >
                <circle cx="7" cy="6" r="2.4" />
                <circle cx="7" cy="18" r="2.4" />
                <circle cx="17" cy="12" r="2.4" />
                <path d="M7 8.4v7.2M9.4 6h3.2a2 2 0 0 1 2 2v1.6" />
              </svg>
              <span>{REPO.branch}</span>
              <span className="text-ink-600">·</span>
              <span>{REPO.rootPath}</span>
            </div>
          </Link>
        </div>

        <div className="mt-auto border-t border-ink-700/50 p-3">
          <div className="group flex items-center gap-3 rounded-lg px-2 py-2 transition hover:bg-white/[0.03]">
            <Avatar size={30} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[12.5px] text-white">{USER.name}</div>
              <div className="truncate font-mono text-[10.5px] text-ink-400">@{USER.username}</div>
            </div>
            <button
              type="button"
              title="退出登录"
              onClick={() => {
                toast("已退出登录");
                router.push("/");
              }}
              className="h-4 w-4 text-ink-500 opacity-0 transition group-hover:opacity-100 hover:text-accent-400"
            >
              <LogoutIcon className="h-full w-full" />
            </button>
          </div>
        </div>
      </aside>

      {/* 主区 */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-ink-700/60 bg-ink-950/90 px-5 backdrop-blur-xl lg:px-8">
          <h1 className="text-[15px] font-medium text-white">{headerTitle(pathname)}</h1>

          <div className="ml-auto flex items-center gap-2.5">
            <div className="hidden items-center gap-2 rounded-lg border border-ink-700/60 bg-white/[0.025] px-3 py-1.5 font-mono text-[11.5px] text-ink-400 md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              <span className="text-zinc-400">同步正常</span>
            </div>
            <Link
              href={`/${USER.username}`}
              className="hidden items-center gap-1.5 rounded-lg border border-ink-700/60 px-3 py-1.5 text-[12px] text-ink-300 transition hover:bg-white/[0.04] hover:text-white sm:flex"
            >
              <EyeIcon className="h-3.5 w-3.5" />
              <span>以访客身份查看</span>
            </Link>
            <Avatar size={30} className="ring-1 ring-white/10" />
          </div>
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
