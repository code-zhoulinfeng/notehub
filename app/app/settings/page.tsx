import Link from "next/link";
import { ExternalIcon, GithubIcon, SparkIcon } from "@/components/icons";
import { ToastButton } from "@/components/toast-buttons";
import { Avatar } from "@/features/user/components/avatar";
import { Input, Textarea } from "@/components/ui";
import { REPO, USER } from "@/lib/mock/data";
import { esc } from "@/lib/utils";

/** 设置（/app/settings）—— 仓库配置 / 公开形象 / 危险操作，与 design.html 的 OwnerSettings 一致 */
export default function SettingsPage() {
  const repoFields = [
    { l: "OWNER", v: REPO.owner },
    { l: "REPOSITORY", v: REPO.repo },
    { l: "BRANCH", v: REPO.branch },
    { l: "ROOT PATH", v: REPO.rootPath },
  ];

  return (
    <div className="mx-auto max-w-[900px] px-5 py-8 lg:px-8">
      <h2 className="text-[22px] font-semibold tracking-tight text-white">设置</h2>
      <p className="mt-1.5 text-[13.5px] text-ink-300">管理仓库连接与公开形象。</p>

      {/* 笔记仓库 */}
      <section className="mt-7 overflow-hidden rounded-xl border border-ink-700/60 bg-ink-850/40">
        <div className="flex items-center gap-3 border-b border-ink-700/50 px-5 py-3.5">
          <span className="h-4 w-4 text-accent-400">
            <GithubIcon className="h-full w-full" />
          </span>
          <h3 className="text-[14px] font-medium text-white">笔记仓库</h3>
          <span className="ml-auto flex items-center gap-1.5 text-[11.5px] text-mint">
            <span className="h-1.5 w-1.5 rounded-full bg-mint" />
            已连接
          </span>
        </div>

        <div className="grid gap-4 p-5 sm:grid-cols-2">
          {repoFields.map((f) => (
            <div key={f.l}>
              <label className="mb-2 block font-mono text-[10px] tracking-[0.14em] text-ink-400">{f.l}</label>
              <Input type="text" defaultValue={f.v} />
            </div>
          ))}

          <div className="flex flex-wrap items-center gap-2.5 pt-1 sm:col-span-2">
            <ToastButton
              msg="仓库配置已保存并校验通过"
              className="rounded-lg bg-accent px-4 py-2.5 text-[12.5px] font-medium text-white transition hover:bg-accent-400 active:scale-[.97]"
            >
              保存并校验
            </ToastButton>
            <ToastButton
              msg="权限校验通过：read / write"
              className="rounded-lg border border-ink-700/60 px-4 py-2.5 text-[12.5px] text-ink-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              验证权限
            </ToastButton>
            <span className="text-[11.5px] text-ink-400">上次校验：2 分钟前</span>
          </div>
        </div>
      </section>

      {/* 公开形象 */}
      <section className="mt-5 overflow-hidden rounded-xl border border-ink-700/60 bg-ink-850/40">
        <div className="flex items-center gap-3 border-b border-ink-700/50 px-5 py-3.5">
          <span className="h-4 w-4 text-accent-400">
            <SparkIcon className="h-full w-full" />
          </span>
          <h3 className="text-[14px] font-medium text-white">公开形象</h3>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-4">
            <Avatar size={52} />
            <div>
              <div className="text-[14.5px] font-medium text-white">{USER.name}</div>
              <div className="font-mono text-[12px] text-ink-400">@{USER.username}</div>
            </div>
            <ToastButton
              msg="头像由 GitHub 提供，不可单独修改"
              className="ml-auto rounded-lg border border-ink-700/60 px-3.5 py-2 text-[12.5px] text-ink-300 transition hover:bg-white/[0.05] hover:text-white"
            >
              更换头像
            </ToastButton>
          </div>

          <div className="mt-5">
            <label className="mb-2 block font-mono text-[10px] tracking-[0.14em] text-ink-400">BIO</label>
            <Textarea rows={3} defaultValue={USER.bio} />
          </div>

          <div className="mt-5 flex items-center justify-between rounded-lg border border-ink-700/60 bg-ink-950 p-4">
            <div>
              <div className="text-[13px] font-medium text-white">公开主页</div>
              <div className="mt-1 font-mono text-[11.5px] text-ink-400">notehub.dev/{USER.username}</div>
            </div>
            <Link
              href={`/${USER.username}`}
              className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-[12px] font-medium text-ink-950 transition hover:bg-zinc-200"
            >
              <ExternalIcon className="h-3.5 w-3.5" />
              访问
            </Link>
          </div>
        </div>
      </section>

      {/* 危险操作 */}
      <section className="mt-5 overflow-hidden rounded-xl border border-accent/25 bg-accent/[0.04]">
        <div className="border-b border-accent/20 px-5 py-3.5">
          <h3 className="text-[14px] font-medium text-white">危险操作</h3>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 p-5">
          <div>
            <div className="text-[13px] font-medium text-white">断开仓库连接</div>
            <div className="mt-1 text-[12px] text-ink-400">不会删除 GitHub 上的任何文件，仅解除 NoteHub 的关联。</div>
          </div>
          <ToastButton
            msg="已解除仓库连接（原型演示）"
            className="rounded-lg border border-accent/40 px-4 py-2.5 text-[12.5px] font-medium text-accent-400 transition hover:bg-accent/10"
          >
            断开连接
          </ToastButton>
        </div>
      </section>
    </div>
  );
}
