"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { HomeIcon, LogoIcon, NotesIcon } from "@/components/icons";
import { USER } from "@/lib/mock/data";

/** 访客顶部导航 —— 与 design.html 的 VisitorNav 一致（滚动后变实底） */
export function VisitorNav({ username = USER.username, name = USER.name }: { username?: string; name?: string }) {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const onScroll = () => {
      if (window.scrollY > 24) nav.classList.add("solid");
      else nav.classList.remove("solid");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header ref={navRef} className="nf-nav fixed top-0 right-0 left-0 z-50 h-[68px]">
      <div className="mx-auto flex h-full max-w-[1600px] items-center gap-6 px-4 sm:px-8 lg:px-12">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-white shadow-glow transition-transform group-hover:scale-105">
            <LogoIcon className="h-4 w-4" />
          </div>
          <span className="text-[18px] font-semibold tracking-tight text-white">NoteHub</span>
        </Link>

        <span className="hidden h-5 w-px bg-white/10 sm:block" />

        <Link href={`/${username}`} className="text-[14px] font-medium text-white transition hover:text-white/80">
          {name}
        </Link>

        <div className="ml-auto flex items-center gap-4">
          <Link
            href={`/${username}`}
            className="hidden items-center gap-1.5 text-[12.5px] text-zinc-400 transition hover:text-white sm:flex"
          >
            <NotesIcon className="h-3.5 w-3.5" />
            <span>全部笔记</span>
          </Link>
          <Link href="/" className="hidden items-center gap-1.5 text-[12.5px] text-zinc-400 transition hover:text-white sm:flex">
            <HomeIcon className="h-3.5 w-3.5" />
            <span>首页</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
