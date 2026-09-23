"use client";

import { createElement } from "react";
import { toast as notify } from "react-toastify";
import { cn } from "cn";

export type ToastType = "ok" | "warn" | "info";

const dotClass: Record<ToastType, string> = {
  ok: "bg-accent",
  warn: "bg-amber",
  info: "bg-white",
};

/** 全局 toast —— 可在任意（含服务端组件中嵌入的客户端组件）调用，底层为 react-toastify */
export function toast(msg: string, type: ToastType = "ok") {
  notify(
    createElement(
      "span",
      { className: "flex items-center gap-3" },
      createElement("span", {
        className: cn("h-1.5 w-1.5 shrink-0 rounded-full", dotClass[type]),
      }),
      createElement("span", null, msg),
    ),
    { className: "nf-toast" },
  );
}
