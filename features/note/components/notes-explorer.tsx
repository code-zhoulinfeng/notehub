"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EditIcon, FileIcon, HistoryIcon, SearchIcon, TrashIcon } from "@/components/icons";
import { NewNoteDialog } from "@/features/note/components/new-note-dialog";
import { VisibilityBadge } from "@/features/note/components/visibility-badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/lib/toast";
import { REPO } from "@/lib/mock/data";
import { cn } from "cn";
import { esc } from "@/lib/utils";
import type { Note } from "@/types/note";

const FILTERS = [
  ["all", "全部"],
  ["public", "公开"],
  ["private", "私密"],
  ["dirty", "待提交"],
] as const;

type FilterKey = (typeof FILTERS)[number][0];

interface NotesExplorerProps {
  notes: Note[];
}

/** 笔记列表主体（搜索 + 筛选 + 表格 + 行操作），与 design.html 的 OwnerNotes 一致 */
export function NotesExplorer({ notes }: NotesExplorerProps) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<FilterKey>("all");
  const [deleteTarget, setDeleteTarget] = useState<Note | null>(null);
  const router = useRouter();

  const list = useMemo(() => {
    const kw = q.trim().toLowerCase();
    return notes
      .filter((n) => {
        if (filter === "public") return n.public;
        if (filter === "private") return !n.public;
        if (filter === "dirty") return n.dirty;
        return true;
      })
      .filter((n) => !kw || n.title.toLowerCase().includes(kw) || n.path.toLowerCase().includes(kw))
      .sort((a, b) => b.ts - a.ts);
  }, [notes, q, filter]);

  return (
    <div className="mx-auto max-w-[1200px] px-5 py-8 lg:px-8">
      {/* 工具栏 */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative max-w-sm min-w-[200px] flex-1">
          <span className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-400">
            <SearchIcon className="h-full w-full" />
          </span>
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索标题或路径…"
            className="w-full rounded-lg border border-ink-700/60 bg-ink-850 py-2 pr-3 pl-9 text-[13px] text-zinc-200 transition-all placeholder:text-ink-400 focus:border-accent/40"
          />
        </div>

        <div className="flex items-center gap-1 rounded-lg border border-ink-700/60 bg-ink-850 p-1">
          {FILTERS.map(([k, l]) => (
            <button
              key={k}
              type="button"
              onClick={() => setFilter(k)}
              className={cn(
                "rounded-md px-3 py-1.5 text-[12.5px] transition-all",
                filter === k ? "bg-white/[0.08] text-white" : "text-ink-300 hover:text-zinc-200",
              )}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-[12px] text-ink-400 sm:block">
            {list.length} / {notes.length} 篇
          </span>
          <NewNoteDialog size="sm" />
        </div>
      </div>

      {/* 列表 */}
      <div className="overflow-hidden rounded-xl border border-ink-700/60 bg-ink-850/30">
        <div className="hidden grid-cols-[1fr_100px_100px_110px] gap-4 border-b border-ink-700/50 bg-white/[0.015] px-5 py-3 font-mono text-[11px] tracking-wider text-ink-400 md:grid">
          <span>笔记</span>
          <span>可见性</span>
          <span>更新时间</span>
          <span className="text-right">操作</span>
        </div>

        <div className="divide-y divide-ink-700/40">
          {list.length ? (
            list.map((n, i) => (
              <div
                key={n.path}
                className="group grid anim-up grid-cols-1 items-center gap-3 px-5 py-3.5 transition-all hover:bg-white/[0.025] md:grid-cols-[1fr_100px_100px_110px] md:gap-4"
                style={{ animationDelay: `${Math.min(i * 0.03, 0.28)}s` }}
              >
                <Link href={`/app/notes/${n.path}`} className="flex min-w-0 items-center gap-3">
                  <span className="relative shrink-0">
                    <span className="block grid h-7 w-7 place-items-center rounded-lg border border-ink-700/60 bg-white/[0.04] text-ink-300 transition-colors group-hover:text-accent-400">
                      <FileIcon className="h-3 w-3" />
                    </span>
                    {n.dirty ? <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-amber ring-2 ring-ink-950" /> : null}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[13.5px] font-medium text-white">{esc(n.title)}</span>
                    <span className="mt-0.5 block truncate font-mono text-[11px] text-ink-400">
                      {REPO.rootPath}
                      {esc(n.path)}.md
                    </span>
                  </span>
                </Link>

                <div className="hidden md:block">
                  <VisibilityBadge isPublic={n.public} />
                </div>

                <div className="hidden text-[11.5px] text-ink-400 md:block">{n.updated}</div>

                <div className="flex items-center justify-end gap-1 opacity-60 transition-opacity group-hover:opacity-100">
                  <Link
                    href={`/app/notes/${n.path}`}
                    title="编辑"
                    className="grid h-7 w-7 place-items-center rounded-md text-ink-300 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <EditIcon className="h-3.5 w-3.5" />
                  </Link>
                  <Link
                    href={`/app/notes/${n.path}/history`}
                    title="版本历史"
                    className="grid h-7 w-7 place-items-center rounded-md text-ink-300 transition hover:bg-white/[0.08] hover:text-white"
                  >
                    <HistoryIcon className="h-3.5 w-3.5" />
                  </Link>
                  <button
                    type="button"
                    title="删除"
                    onClick={() => setDeleteTarget(n)}
                    className="grid h-7 w-7 place-items-center rounded-md text-ink-300 transition hover:bg-accent/10 hover:text-accent-400"
                  >
                    <TrashIcon className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-xl bg-white/[0.03] text-ink-400">
                <SearchIcon className="h-5 w-5" />
              </div>
              <div className="text-sm text-zinc-400">没有匹配的笔记</div>
              <div className="mt-1.5 text-[12.5px] text-ink-400">换个关键词，或新建一篇</div>
            </div>
          )}
        </div>
      </div>

      {/* 删除确认弹窗 */}
      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent className="max-w-md">
          <div>
            <div className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-accent/12 p-2.5 text-accent-400">
                <TrashIcon className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <h3 className="text-[16px] font-semibold text-white">删除这篇笔记？</h3>
                <p className="mt-2 text-[13px] leading-relaxed text-zinc-400">
                  将从 GitHub 仓库中删除{" "}
                  <span className="font-mono text-white">
                    {REPO.rootPath}
                    {esc(deleteTarget?.path ?? "")}.md
                  </span>
                  。历史记录仍可通过 Git 找回。
                </p>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 rounded-lg border border-ink-700 px-4 py-2.5 text-[13px] text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  // 后端阶段：Server Action → 队列 → GitHub Contents API DELETE
                  toast("已删除并提交到 GitHub");
                  setDeleteTarget(null);
                  router.refresh();
                }}
                className="flex-1 rounded-lg bg-accent px-4 py-2.5 text-[13px] font-medium text-white transition hover:bg-accent-400 active:scale-[.97]"
              >
                确认删除
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
