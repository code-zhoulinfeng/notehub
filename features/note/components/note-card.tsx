import Link from "next/link";
import { PlayIcon, PlusIcon } from "@/components/icons";
import { VisibilityBadge } from "@/features/note/components/visibility-badge";
import { coverFor } from "@/lib/mock/data";
import { esc } from "@/lib/utils";
import type { Note } from "@/types/note";

interface NoteCardProps {
  note: Note;
  /** 卡片序号（封面编号 & 封面渐变种子） */
  idx: number;
  /** 卡片链接前缀，默认 /zhoulinfeng */
  base?: string;
}

/** 公开主页的海报式笔记卡片 —— 与 design.html 的 VisitorNoteCard 一致 */
export function NoteCard({ note, idx, base = "/zhoulinfeng" }: NoteCardProps) {
  return (
    <Link
      href={`${base}/${note.path}`}
      className="note-card group/card relative w-[260px] shrink-0 overflow-hidden rounded-xl border border-white/[0.06] bg-ink-850 sm:w-[300px]"
    >
      <div className="relative aspect-[16/10] overflow-hidden" style={{ background: coverFor(idx) }}>
        <div className="grid-noise absolute inset-0 opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

        <div className="absolute top-2.5 left-3">
          <VisibilityBadge isPublic />
        </div>

        <div className="absolute top-2.5 right-3 font-mono text-[10px] tracking-wider text-white/40">
          {String(idx + 1).padStart(2, "0")}
        </div>

        <div className="absolute right-0 bottom-0 left-0 p-3.5">
          <div className="line-clamp-2 text-[15.5px] leading-snug font-semibold text-white drop-shadow-lg">{note.title}</div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center gap-2.5 bg-black/60 opacity-0 transition-opacity duration-300 group-hover/card:opacity-100">
          <span className="grid h-10 w-10 scale-90 place-items-center rounded-full bg-white p-3 text-black transition-transform duration-300 group-hover/card:scale-100">
            <PlayIcon />
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full border-2 border-white/50 p-2 text-white transition hover:bg-white/15">
            <PlusIcon />
          </span>
        </div>
      </div>

      <div className="px-3.5 py-3">
        <div className="flex items-center gap-2 font-mono text-[11px] text-ink-400">
          <span className="text-ink-300">{note.updated}</span>
          <span>·</span>
          <span className="truncate">{esc(note.path)}.md</span>
        </div>
        <div className="card-desc">
          <p className="line-clamp-3 text-[12.5px] leading-relaxed text-zinc-400">{note.description}</p>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {note.tags.slice(0, 3).map((t) => (
              <span key={t} className="rounded bg-white/[0.06] px-1.5 py-[2px] font-mono text-[10px] text-zinc-400">
                #{esc(t)}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
