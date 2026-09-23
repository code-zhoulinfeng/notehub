import { notFound } from "next/navigation";
import { GithubIcon, LogoIcon, NotesIcon } from "@/components/icons";
import { Avatar } from "@/features/user/components/avatar";
import { VisitorNav } from "@/features/profile/components/visitor-nav";
import { RowScroller } from "@/features/note/components/row-scroller";
import { NOTES, REPO, USER } from "@/lib/mock/data";

/** 个人公开主页 —— Netflix 式内容发现界面，仅展示 public: true 的笔记 */
export default async function ProfilePage({ params }: PageProps<"/[username]">) {
  const { username } = await params;

  // 后端阶段：按 username 查 RepositoryConfig（SQLite），再经 GitHub API 拉取公开笔记
  if (username !== USER.username) notFound();

  const pub = NOTES.filter((n) => n.public);
  const byTag = (t: string) => pub.filter((n) => n.tags.includes(t));

  const frontend = [...new Set([...byTag("frontend"), ...byTag("react"), ...byTag("css"), ...byTag("nextjs")])];
  const devops = [...new Set([...byTag("docker"), ...byTag("devops"), ...byTag("ops")])];

  return (
    <div className="min-h-screen bg-ink-950">
      <VisitorNav username={username} name={USER.name} />

      {/* Hero */}
      <section className="relative h-[58vh] max-h-[580px] min-h-[420px] overflow-hidden">
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(110% 100% at 22% 15%, #5a0e18 0%, #24080e 38%, #0a0a0c 72%)",
          }}
        />
        <div className="grid-noise absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute top-1/2 -right-8 hidden -translate-y-1/2 select-none lg:block">
          <span className="text-[200px] leading-none font-bold tracking-tighter text-white/[0.022]">NOTES</span>
        </div>
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-ink-950 via-ink-950/70 to-transparent" />

        <div className="relative mx-auto flex h-full max-w-[1600px] flex-col justify-end px-4 pb-16 sm:px-8 lg:px-12">
          <div className="flex items-end gap-5">
            <Avatar size={84} className="shadow-card ring-2 ring-white/15" />
            <div className="min-w-0 pb-1">
              <div className="mb-2 flex anim-down items-center gap-2.5">
                <span className="rounded bg-accent px-2 py-[3px] text-[10.5px] font-bold tracking-wider text-white">PUBLIC PROFILE</span>
              </div>
              <h1 className="anim-up text-[34px] leading-none font-bold tracking-tight text-white sm:text-[44px]">{USER.name}</h1>
              <div
                className="mt-2.5 flex anim-up items-center gap-3 font-mono text-[13px] text-zinc-400"
                style={{ animationDelay: ".06s" }}
              >
                <span>@{USER.username}</span>
                <span className="text-ink-500">·</span>
                <span>{USER.joined}</span>
              </div>
            </div>
          </div>

          <p className="mt-5 max-w-xl anim-up text-[14.5px] leading-relaxed text-zinc-400" style={{ animationDelay: ".12s" }}>
            {USER.bio}
          </p>

          <div className="mt-7 flex anim-up flex-wrap items-center gap-3" style={{ animationDelay: ".18s" }}>
            <span className="flex items-center gap-2 rounded-lg border border-white/12 bg-white/10 px-4 py-2 text-[13px] text-white backdrop-blur-sm">
              <NotesIcon className="h-3.5 w-3.5 text-accent-400" />
              <span>
                <span className="font-bold">{pub.length}</span> 篇公开笔记
              </span>
            </span>
            <span className="flex items-center gap-2 rounded-lg border border-white/12 bg-white/10 px-4 py-2 text-[13px] text-white backdrop-blur-sm">
              <GithubIcon className="h-3.5 w-3.5 text-accent-400" />
              <span className="font-mono">
                {REPO.owner}/{REPO.repo}
              </span>
            </span>
          </div>
        </div>
      </section>

      {/* 分类行 */}
      <div className="relative z-10 -mt-6 pb-20">
        <RowScroller title="最新" notes={[...pub].sort((a, b) => b.ts - a.ts)} accent count base={`/${username}`} offset={0} />
        <RowScroller title="前端" notes={frontend} base={`/${username}`} offset={1} />
        <RowScroller title="工程与运维" notes={devops} base={`/${username}`} offset={3} />
      </div>

      <footer className="border-t border-ink-700/50">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-4 px-4 py-9 sm:flex-row sm:px-8 lg:px-12">
          <div className="flex items-center gap-2.5">
            <div className="grid h-6 w-6 place-items-center rounded-lg bg-accent text-white">
              <LogoIcon className="h-3.5 w-3.5" />
            </div>
            <span className="text-[13px] text-zinc-300">NoteHub</span>
          </div>
          <div className="text-[12px] text-ink-400">
            内容托管于 GitHub · {REPO.owner}/{REPO.repo}
          </div>
        </div>
      </footer>
    </div>
  );
}
