"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogoIcon } from "@/components/icons";
import { toast } from "@/lib/toast";
import { USER } from "@/lib/mock/data";

/**
 * GitHub OAuth 登录页。
 * 当前为原型：模拟跳转动画后进入工作台。
 * 后端阶段：跳转 GitHub 授权页 → /auth/callback 换取 Token（仅服务端持有）。
 */
export function LoginView() {
  const router = useRouter();

  useEffect(() => {
    const t = setTimeout(() => {
      toast(`已通过 GitHub 登录 · ${USER.username}`);
      router.push("/app");
    }, 900);
    return () => clearTimeout(t);
  }, [router]);

  return (
    <div className="grid min-h-screen place-items-center bg-ink-950">
      <div className="flex flex-col items-center gap-5">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-accent text-white shadow-glow">
          <LogoIcon className="h-7 w-7" />
        </div>
        <div className="text-sm text-zinc-400">正在跳转 GitHub 授权…</div>
        <div className="h-1 w-44 overflow-hidden rounded-full bg-white/[0.06]">
          <div className="h-full w-1/2 animate-pulse bg-white/20" />
        </div>
      </div>
    </div>
  );
}
