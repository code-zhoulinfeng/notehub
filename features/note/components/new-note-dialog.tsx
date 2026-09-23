"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BranchIcon, CheckIcon, CloseIcon, PlusIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input, Textarea } from "@/components/ui";
import { toast } from "@/lib/toast";
import { NOTES, REPO } from "@/lib/mock/data";
import { cn } from "cn";

const DEFAULT_CONTENT = `---
title: 新笔记
description: 
public: false
tags: []
---

# 新笔记

开始写点什么…`;

interface NewNoteDialogProps {
  /** 按钮风格：primary（accent 底） / outline（描边） */
  variant?: "primary" | "outline";
  size?: "sm" | "default";
}

/** 新建笔记弹窗 —— 与 design.html 的 new-note modal 一致 */
export function NewNoteDialog({ variant = "primary", size = "default" }: NewNoteDialogProps) {
  const [open, setOpen] = useState(false);
  const [path, setPath] = useState("");
  const router = useRouter();

  const submit = () => {
    const p = path.trim().replace(/^\/+|\.md$/g, "");
    if (!p) {
      toast("请填写文件路径", "warn");
      return;
    }
    if (NOTES.some((n) => n.path === p)) {
      toast("该路径已存在", "warn");
      return;
    }
    setOpen(false);
    setPath("");
    toast("笔记已创建 · 待提交到 GitHub");
    router.push(`/app/notes/${p}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant === "primary" ? "default" : "outline"}
          size={size === "sm" ? "sm" : "default"}
          className="active:scale-[.97]"
        >
          <PlusIcon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} />
          {size === "sm" ? "新建" : "新建笔记"}
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <span className="h-4 w-4 text-accent-400">
            <PlusIcon className="h-full w-full" />
          </span>
          <DialogTitle>新建笔记</DialogTitle>
          <DialogTrigger asChild>
            <button className="ml-auto h-4 w-4 text-ink-400 transition hover:text-white">
              <CloseIcon className="h-full w-full" />
            </button>
          </DialogTrigger>
        </DialogHeader>

        <div className="space-y-5">
          <div>
            <label className="mb-2 block font-mono text-[10.5px] tracking-[0.14em] text-ink-400">文件路径</label>
            <div className="flex items-center gap-2 rounded-lg border border-ink-700/60 bg-ink-950 px-3.5 py-2.5 transition-colors focus-within:border-accent/50">
              <span className="font-mono text-[13px] text-ink-400">{REPO.rootPath}</span>
              <input
                autoFocus
                type="text"
                placeholder="frontend/my-note"
                value={path}
                onChange={(e) => setPath(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                className="flex-1 bg-transparent font-mono text-[13.5px] text-white outline-none placeholder:text-ink-400"
              />
              <span className="font-mono text-[13px] text-ink-400">.md</span>
            </div>
            <p className="mt-2 text-[11.5px] text-ink-400">支持任意嵌套目录，会自动创建中间层级。</p>
          </div>
          <div>
            <label className="mb-2 block font-mono text-[10.5px] tracking-[0.14em] text-ink-400">初始内容</label>
            <Textarea rows={5} defaultValue={DEFAULT_CONTENT} id="new-note-content" />
          </div>
        </div>

        <DialogFooter>
          <DialogTrigger asChild>
            <Button variant="outline" className="border-ink-700 text-zinc-400 hover:text-white">
              取消
            </Button>
          </DialogTrigger>
          <Button className="ml-auto" onClick={submit}>
            <CheckIcon className="h-3.5 w-3.5" />
            创建并编辑
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
