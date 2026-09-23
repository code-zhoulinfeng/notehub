import Link from "next/link";
import { EyeIcon, LayersIcon } from "@/components/icons";
import { EntryCard } from "@/features/landing/components/entry-card";

function LandingGlow() {
  return (
    <>
      <div className="pointer-events-none absolute -top-56 -left-52 h-180 w-180 rounded-full glow-accent" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-140 w-140 rounded-full glow-violet" />
    </>
  );
}

function LandingHeader() {
  return (
    <header className="relative z-20 mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="text-lg font-semibold tracking-tight">NoteHub</span>
      </Link>
    </header>
  );
}

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-ink-950">
      <LandingGlow />
      <LandingHeader />
      <section className="relative z-10 mx-auto max-w-7xl px-6 pt-16 pb-24">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          {/* Owner 入口 */}
          <EntryCard
            href="/login"
            icon={LayersIcon}
            eyebrow="Owner 视角"
            title="工作台"
            description="管理、编辑、提交。一个高效的工具型后台，看见全部笔记（公开 + 私密）。"
            features={["笔记列表、批量操作、状态查看", "Markdown 分屏编辑器 + 实时预览", "Commit 写回 GitHub · 版本历史"]}
            cta="用 GitHub 登录"
            variant="accent"
            animationDelay=".14s"
          />

          {/* Visitor 入口 */}
          <EntryCard
            href="/zhoulinfeng"
            icon={EyeIcon}
            eyebrow="Visitor 视角"
            title="公开主页"
            description="只读、沉浸、可分享。一个 Netflix 式的内容发现界面，只看见公开笔记。"
            features={["横向滚动分类行 · 海报式卡片", "阅读页含目录 / 相关推荐", "无需登录，可直接分享"]}
            cta="以访客身份浏览"
            variant="plain"
            animationDelay=".2s"
          />
        </div>
      </section>
    </div>
  );
}
