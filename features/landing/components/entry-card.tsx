import Link from "next/link";
import type { ComponentType, SVGProps } from "react";
import { cn } from "cn";
import { ArrowRightIcon, CheckIcon } from "@/components/icons";

export type EntryCardProps = {
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  eyebrow: string;
  title: string;
  description: string;
  features: string[];
  cta: string;
  /** accent = 品牌红强调（Owner 入口）；plain = 中性白（Visitor 入口） */
  variant: "accent" | "plain";
  /** 入场动画延迟 */
  animationDelay?: string;
};


const ENTRY_VARIANTS: Record<EntryCardProps["variant"], Record<"hover" | "glow" | "icon" | "eyebrow", string>> = {
  accent: {
    hover: "hover:border-accent/40",
    glow: "glow-accent-hover",
    icon: "border-accent/25 bg-accent/12 text-accent-400",
    eyebrow: "text-accent",
  },
  plain: {
    hover: "hover:border-white/25",
    glow: "glow-white-hover",
    icon: "border-white/8 bg-white/5 text-zinc-300",
    eyebrow: "text-zinc-500",
  },
};

/** 双入口卡片 —— Owner 工作台 / Visitor 公开主页共用一套结构，仅配色方案不同 */
export function EntryCard({ href, icon: Icon, eyebrow, title, description, features, cta, variant, animationDelay }: EntryCardProps) {
  const v = ENTRY_VARIANTS[variant];

  return (
    <Link
      href={href}
      className={cn(
        "group relative anim-up overflow-hidden rounded-2xl border border-white/8 bg-ink-850/60 p-8 transition-all duration-300 hover:bg-ink-800/80",
        v.hover,
      )}
      style={animationDelay ? { animationDelay } : undefined}
    >
      {/* hover 时的角落光晕 */}
      <div
        className={cn(
          "pointer-events-none absolute -top-20 -right-20 h-70 w-70 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          v.glow,
        )}
      />

      <div className="relative">
        <div className={cn("grid h-12 w-12 place-items-center rounded-xl border", v.icon)}>
          <Icon className="h-5 w-5" />
        </div>

        <div className={cn("mt-6 text-[11px] font-medium tracking-[0.2em] uppercase", v.eyebrow)}>{eyebrow}</div>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h2>
        <p className="mt-3 text-[14px] leading-relaxed text-zinc-400">{description}</p>

        <div className="mt-6 space-y-2 text-[13px] text-zinc-500">
          {features.map((feature) => (
            <div key={feature} className="flex items-center gap-2">
              <CheckIcon className="h-3.5 w-3.5 text-mint" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex items-center gap-2 text-[13.5px] font-medium text-white">
          <span>{cta}</span>
          <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}
