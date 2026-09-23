import Link from "next/link";
import { cn } from "cn";
import { ArrowLeftIcon, DiffIcon, ExternalIcon, HistoryIcon } from "@/components/icons";
import { ToastButton } from "@/components/toast-buttons";
import { COMMITS, NOTES, REPO, findNote } from "@/lib/mock/data";
import { esc } from "@/lib/utils";

/** 版本历史视图 —— 与 design.html 的 OwnerHistory 一致 */
export function HistoryView({ notePath }: { notePath: string }) {
  const note = findNote(notePath) ?? NOTES[0]!;

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-8 lg:px-8">
      <Link
        href={`/app/notes/${note.path}`}
        className="mb-6 inline-flex items-center gap-1.5 text-[13px] text-ink-300 transition hover:text-white"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        返回编辑器
      </Link>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-[24px] font-semibold tracking-tight text-white">版本历史</h2>
          <p className="mt-2 font-mono text-[13px] text-ink-300">
            {REPO.rootPath}
            {esc(note.path)}.md
          </p>
        </div>
        <Link
          href={`/app/notes/${note.path}/compare`}
          className="flex items-center gap-2 rounded-lg border border-ink-700/60 bg-white/[0.03] px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-white/[0.06]"
        >
          <DiffIcon className="h-3.5 w-3.5" />
          对比版本
        </Link>
      </div>

      <div className="mt-8 overflow-hidden rounded-xl border border-ink-700/60 bg-ink-850/40">
        <div className="flex items-center gap-3 border-b border-ink-700/50 px-5 py-3">
          <span className="h-3.5 w-3.5 text-ink-400">
            <HistoryIcon className="h-full w-full" />
          </span>
          <span className="font-mono text-[12px] tracking-wider text-ink-400">COMMITS · {REPO.branch}</span>
          <span className="ml-auto text-[11.5px] text-ink-400">{COMMITS.length} 次提交</span>
        </div>

        <div className="divide-y divide-ink-700/40">
          {COMMITS.map((c, i) => (
            <div
              key={c.sha}
              className="group flex anim-up items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.025]"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="flex shrink-0 flex-col items-center gap-1">
                <span className={cn("h-2 w-2 rounded-full bg-ink-600", { "bg-accent": i === 0 })} />
                {i < COMMITS.length - 1 ? <span className="h-6 w-px bg-ink-700/60" /> : null}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[14px] font-medium text-white">{esc(c.msg)}</span>
                  {i === 0 ? (
                    <span className="rounded bg-accent px-1.5 py-[2px] text-[10px] font-semibold tracking-wide text-white">HEAD</span>
                  ) : null}
                </div>
                <div className="mt-1.5 flex items-center gap-3 font-mono text-[11.5px] text-ink-400">
                  <span className="text-accent-400">{c.sha}</span>
                  <span>{c.date}</span>
                  <span className="flex items-center gap-1">
                    <span className="text-mint">+{c.add}</span>
                    <span className="text-accent-400">−{c.del}</span>
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <span className="hidden text-[12px] text-ink-400 sm:block">{c.time}</span>
                <ToastButton
                  msg={`已打开 ${c.sha} 版本（原型演示）`}
                  className="rounded-lg border border-ink-700/60 px-3 py-1.5 text-[12px] text-ink-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  查看
                </ToastButton>
                <Link
                  href={`/app/notes/${note.path}/compare`}
                  className="rounded-lg border border-ink-700/60 px-3 py-1.5 text-[12px] text-ink-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  对比
                </Link>
                <ToastButton
                  msg="已跳转 GitHub（原型演示）"
                  title="在 GitHub 上查看"
                  className="grid h-7 w-7 place-items-center rounded-lg border border-ink-700/60 p-1.5 text-ink-300 transition-colors hover:bg-white/[0.06] hover:text-white"
                >
                  <ExternalIcon className="h-3.5 w-3.5" />
                </ToastButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
