"use client";

import { useRef } from "react";
import type { ReactNode } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@/components/icons";
import { cn } from "cn";
import type { Note } from "@/types/note";
import { NoteCard } from "@/features/note/components/note-card";

interface RowScrollerProps {
  title: string;
  notes: Note[];
  accent?: boolean;
  count?: boolean;
  base?: string;
  /** 卡片封面起始索引（避免多行封面重复） */
  offset?: number;
  className?: string;
  children?: ReactNode;
}

/** 横向滚动分类行 —— 与 design.html 的 VisitorRow 一致（含左右箭头） */
export function RowScroller({ title, notes, accent, count, base, offset = 0, className }: RowScrollerProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);

  if (!notes.length) return null;

  const scroll = (dir: number) => {
    const el = scrollerRef.current;
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.82), behavior: "smooth" });
  };

  return (
    <section className={cn("row-wrap relative mb-9 sm:mb-11", className)}>
      <div className="mb-3.5 flex items-baseline justify-between px-4 sm:px-8 lg:px-12">
        <h2 className="flex items-center gap-2.5 text-[17px] font-semibold tracking-tight text-white sm:text-[19px]">
          {accent ? <span className="h-[18px] w-[3px] rounded-full bg-accent" /> : null}
          {title}
        </h2>
        {count ? <span className="font-mono text-[12px] text-ink-400">{notes.length} 篇</span> : null}
      </div>

      <div className="relative">
        <button
          type="button"
          aria-label="向左滚动"
          onClick={() => scroll(-1)}
          className="row-arrow absolute top-1/2 left-1 z-40 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/70 p-2.5 text-white backdrop-blur-md sm:left-3"
        >
          <ChevronLeftIcon />
        </button>

        <div ref={scrollerRef} className="-my-5 no-scrollbar flex gap-3 overflow-x-auto scroll-smooth px-4 py-5 sm:px-8 lg:px-12">
          {notes.map((n, i) => (
            <NoteCard key={n.path} note={n} idx={i + offset} base={base} />
          ))}
        </div>

        <button
          type="button"
          aria-label="向右滚动"
          onClick={() => scroll(1)}
          className="row-arrow absolute top-1/2 right-1 z-40 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/10 bg-black/70 p-2.5 text-white backdrop-blur-md sm:right-3"
        >
          <ChevronRightIcon />
        </button>
      </div>
    </section>
  );
}
