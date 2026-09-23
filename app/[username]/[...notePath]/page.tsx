import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeftIcon, ClockIcon, ExternalIcon, CopyIcon, LogoIcon } from "@/components/icons";
import { CopyButton, ToastButton } from "@/components/toast-buttons";
import { Avatar } from "@/features/user/components/avatar";
import { VisitorNav } from "@/features/profile/components/visitor-nav";
import { VisibilityBadge } from "@/features/note/components/visibility-badge";
import { Markdown } from "@/features/note/components/markdown";
import { RowScroller } from "@/features/note/components/row-scroller";
import { extractToc } from "@/lib/markdown";
import { NOTES, REPO, USER, coverFor, findNote } from "@/lib/mock/data";
import { esc } from "@/lib/utils";

/** 公开笔记阅读页 —— 服务端校验可见性，私密笔记一律 404（不泄露存在性） */
export default async function PublicNotePage({ params }: PageProps<"/[username]/[...notePath]">) {
  const { username, notePath } = await params;
  const path = notePath.join("/");

  // 后端阶段：服务端完成 Authentication → Authorization → Visibility Check
  if (username !== USER.username) notFound();
  const note = findNote(path);
  if (!note || !note.public) notFound();

  const idx = NOTES.indexOf(note);
  const toc = extractToc(note.content);
  const related = NOTES.filter((n) => n.public && n.path !== note.path).slice(0, 6);
  const publicUrl = `notehub.dev/${USER.username}/${note.path}`;

  return (
    <div className="min-h-screen bg-ink-950">
      <VisitorNav username={username} name={USER.name} />

      {/* 封面 Hero */}
      <section className="relative pt-[68px]">
        <div className="relative h-[46vh] max-h-[440px] min-h-[320px] overflow-hidden" style={{ background: coverFor(idx) }}>
          <div className="grid-noise absolute inset-0 opacity-40" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink-950 via-ink-950/75 to-transparent" />

          <div className="relative mx-auto flex h-full max-w-[1080px] flex-col justify-end px-4 pb-10 sm:px-8">
            <div className="mb-4 flex anim-down flex-wrap items-center gap-3">
              <VisibilityBadge isPublic size="lg" />
              <Link
                href={`/${username}`}
                className="flex items-center gap-2 text-[12.5px] text-zinc-300 transition-colors hover:text-white"
              >
                <Avatar size={20} />
                <span>@{USER.username}</span>
              </Link>
              <span className="text-ink-500">·</span>
              <span className="flex items-center gap-1.5 text-[12.5px] text-ink-300">
                <ClockIcon className="h-3 w-3" />
                {note.updated}更新
              </span>
            </div>

            <h1 className="anim-up text-[32px] leading-[1.1] font-bold tracking-tight text-white drop-shadow-2xl sm:text-[44px]">
              {esc(note.title)}
            </h1>

            <p className="mt-4 max-w-2xl anim-up text-[15px] leading-relaxed text-zinc-300" style={{ animationDelay: ".08s" }}>
              {esc(note.description)}
            </p>

            <div className="mt-5 flex anim-up flex-wrap items-center gap-2" style={{ animationDelay: ".14s" }}>
              {note.tags.map((t) => (
                <span
                  key={t}
                  className="rounded border border-white/[0.07] bg-white/[0.07] px-2.5 py-1 font-mono text-[11.5px] text-zinc-300 backdrop-blur-sm"
                >
                  #{esc(t)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 正文 + TOC */}
      <div className="mx-auto max-w-[1080px] px-4 pb-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1fr_220px]">
          <article className="min-w-0">
            <div className="mb-8 flex flex-wrap items-center gap-2.5 border-y border-ink-700/50 py-5">
              <CopyButton
                text={`https://${publicUrl}`}
                className="flex items-center gap-2 rounded-lg border border-ink-700/60 px-3.5 py-2 text-[12.5px] text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <CopyIcon className="h-3.5 w-3.5" />
                复制链接
              </CopyButton>
              <ToastButton
                msg="已跳转 GitHub 源文件（原型演示）"
                className="flex items-center gap-2 rounded-lg border border-ink-700/60 px-3.5 py-2 text-[12.5px] text-zinc-300 transition-colors hover:bg-white/[0.05] hover:text-white"
              >
                <ExternalIcon className="h-3.5 w-3.5" />在 GitHub 上查看
              </ToastButton>
              <span className="ml-auto hidden font-mono text-[11.5px] text-ink-400 sm:block">{note.sha}</span>
            </div>

            <Markdown content={note.content} />
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-[92px]">
              <div className="mb-3.5 font-mono text-[10.5px] tracking-[0.18em] text-ink-400">目录</div>
              <nav className="space-y-1 border-l border-ink-700/60">
                {toc.length ? (
                  toc.map((t) => (
                    <a
                      key={t.id}
                      href={`#${t.id}`}
                      className="toc-link block py-1 text-[12.5px] leading-snug text-ink-300 transition-colors hover:text-white"
                      style={{ paddingLeft: t.level === 3 ? 22 : 12 }}
                    >
                      {esc(t.text)}
                    </a>
                  ))
                ) : (
                  <div className="pl-3 text-[12.5px] text-ink-400">无小节</div>
                )}
              </nav>

              <div className="mt-8 border-t border-ink-700/50 pt-5">
                <div className="mb-3 font-mono text-[10.5px] tracking-[0.18em] text-ink-400">作者</div>
                <Link href={`/${username}`} className="group flex items-center gap-3">
                  <Avatar size={36} />
                  <div className="min-w-0">
                    <div className="truncate text-[13px] text-white transition-colors group-hover:text-accent-400">{USER.name}</div>
                    <div className="font-mono text-[11px] text-ink-400">@{USER.username}</div>
                  </div>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 继续阅读 */}
      <div className="border-t border-ink-700/50 pt-10 pb-20">
        <RowScroller title="继续阅读" notes={related} accent base={`/${username}`} offset={idx + 1} />
      </div>

      <footer className="border-t border-ink-700/50">
        <div className="mx-auto flex max-w-[1080px] flex-col items-center justify-between gap-4 px-4 py-9 sm:flex-row sm:px-8">
          <div className="flex items-center gap-2.5">
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-accent text-white">
              <LogoIcon className="h-3.5 w-3.5" />
            </div>
            <span className="text-[13px] text-zinc-300">NoteHub</span>
          </div>
          <div className="font-mono text-[12px] text-ink-400">
            {REPO.rootPath}
            {esc(note.path)}.md
          </div>
        </div>
      </footer>
    </div>
  );
}
