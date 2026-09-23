import Link from "next/link";
import { cn } from "cn";
import { ArrowRightIcon, ClockIcon, EditIcon, FileIcon, HistoryIcon } from "@/components/icons";
import { Avatar } from "@/features/user/components/avatar";
import { NewNoteDialog } from "@/features/note/components/new-note-dialog";
import { VisibilityBadge } from "@/features/note/components/visibility-badge";
import { COMMITS, NOTES, REPO, USER } from "@/lib/mock/data";
import { esc } from "@/lib/utils";

/** 工作台 Overview —— 与 design.html 的 OwnerDash 一致 */
export default function DashboardPage() {
  const pub = NOTES.filter((n) => n.public).length;
  const priv = NOTES.length - pub;
  const dirtyNotes = NOTES.filter((n) => n.dirty);
  const recent = [...NOTES].sort((a, b) => b.ts - a.ts).slice(0, 6);
  const hero = recent[0]!;

  /** 数值配色直接挂在数据上：accent 卡片用品牌红，其余白色 */
  const stats = [
    { label: "全部笔记", value: NOTES.length, cls: "text-white" },
    { label: "已公开", value: pub, cls: "text-accent-400" },
    { label: "私密", value: priv, cls: "text-white" },
    { label: "本周提交", value: 9, cls: "text-white" },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 lg:px-8">
      {/* 欢迎区 */}
      <div className="anim-up">
        <h2 className="text-[22px] font-semibold tracking-tight text-white">欢迎回来，{USER.name}</h2>
        <p className="mt-1.5 text-[13.5px] text-ink-300">
          仓库{" "}
          <span className="font-mono text-zinc-400">
            {REPO.owner}/{REPO.repo}
          </span>{" "}
          · 分支 <span className="font-mono text-zinc-400">{REPO.branch}</span>
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <Link
            href={`/app/notes/${hero.path}`}
            className="flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-[13px] font-medium text-white transition-all hover:bg-accent-400 active:scale-[.97]"
          >
            <EditIcon className="h-4 w-4" />
            <span>继续编辑 · {esc(hero.title)}</span>
          </Link>
          <NewNoteDialog variant="outline" />
        </div>
      </div>

      {/* 待提交提醒 */}
      {dirtyNotes.length ? (
        <div className="mt-8 anim-up rounded-xl border border-amber/25 bg-amber/[0.05] p-4" style={{ animationDelay: ".08s" }}>
          <div className="mb-3 flex items-center gap-2.5">
            <span className="h-4 w-4 text-amber">
              <ClockIcon className="h-full w-full" />
            </span>
            <span className="text-[13px] font-medium text-amber">{dirtyNotes.length} 篇笔记有未提交的修改</span>
            <span className="ml-auto hidden font-mono text-[11.5px] text-amber/70 sm:inline">本地草稿 · 尚未写回 GitHub</span>
          </div>
          <div className="space-y-1.5">
            {dirtyNotes.map((n) => (
              <Link
                key={n.path}
                href={`/app/notes/${n.path}`}
                className="flex items-center gap-3 rounded-lg bg-black/20 px-3 py-2 transition hover:bg-black/40"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-amber" />
                <span className="truncate text-[13px] text-white">{esc(n.title)}</span>
                <span className="hidden truncate font-mono text-[11px] text-ink-400 sm:inline">{esc(n.path)}.md</span>
                <span className="ml-auto text-[12px] whitespace-nowrap text-amber">打开编辑器 →</span>
              </Link>
            ))}
          </div>
        </div>
      ) : null}

      {/* 统计卡 */}
      <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className="anim-up rounded-xl border border-ink-700/60 bg-ink-850/50 p-4"
            style={{ animationDelay: `${0.12 + i * 0.05}s` }}
          >
            <div className="text-[11.5px] text-ink-300">{s.label}</div>
            <div className={cn("mt-1.5 text-[26px] font-semibold tracking-tight", s.cls)}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* 最近编辑 + 最近提交 */}
      <div className="mt-8 grid gap-5 lg:grid-cols-5">
        <div className="overflow-hidden rounded-xl border border-ink-700/60 bg-ink-850/40 lg:col-span-3">
          <div className="flex items-center gap-2.5 border-b border-ink-700/50 px-5 py-3.5">
            <span className="h-4 w-4 text-ink-300">
              <EditIcon className="h-full w-full" />
            </span>
            <span className="text-[13.5px] font-medium text-white">最近编辑</span>
            <Link href="/app/notes" className="ml-auto flex items-center gap-1 text-[11.5px] text-ink-400 transition hover:text-white">
              全部 <ArrowRightIcon className="h-3 w-3" />
            </Link>
          </div>

          <div className="divide-y divide-ink-700/40">
            {recent.map((n) => (
              <Link
                key={n.path}
                href={`/app/notes/${n.path}`}
                className="group flex items-center gap-3.5 px-5 py-3.5 transition hover:bg-white/[0.025]"
              >
                <span className="relative shrink-0">
                  <span className="block grid h-8 w-8 place-items-center rounded-lg border border-ink-700/60 bg-white/[0.04] text-ink-300 transition-colors group-hover:text-accent-400">
                    <FileIcon className="h-3.5 w-3.5" />
                  </span>
                  {n.dirty ? <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber ring-2 ring-ink-850" /> : null}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="truncate text-[13.5px] font-medium text-white">{esc(n.title)}</span>
                    <VisibilityBadge isPublic={n.public} />
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-[11px] text-ink-400">
                    {REPO.rootPath}
                    {esc(n.path)}.md
                  </span>
                </span>

                <span className="hidden shrink-0 text-[11.5px] text-ink-400 sm:block">{n.updated}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-ink-700/60 bg-ink-850/40 lg:col-span-2">
          <div className="flex items-center gap-2.5 border-b border-ink-700/50 px-5 py-3.5">
            <span className="h-4 w-4 text-ink-300">
              <HistoryIcon className="h-full w-full" />
            </span>
            <span className="text-[13.5px] font-medium text-white">最近提交</span>
            <span className="ml-auto font-mono text-[11.5px] text-ink-400 transition">{REPO.branch}</span>
          </div>

          <div className="divide-y divide-ink-700/40">
            {COMMITS.slice(0, 5).map((c) => (
              <div key={c.sha} className="px-5 py-3.5 transition hover:bg-white/[0.02]">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                  <span className="truncate text-[12.5px] text-white">{esc(c.msg)}</span>
                </div>
                <div className="mt-1.5 flex items-center gap-2.5 font-mono text-[11px] text-ink-400">
                  <span className="text-accent-400">{c.sha}</span>
                  <span>{c.time}</span>
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="text-mint">+{c.add}</span>
                    <span className="text-accent-400">−{c.del}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
