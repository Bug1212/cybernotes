import Link from "next/link";
import CaseFileCard from "@/components/CaseFileCard";
import ClearanceBadge from "@/components/ClearanceBadge";
import { getPublishedArticles } from "@/lib/db/articles";
import { getTopics } from "@/lib/db/topics";
import { getTools } from "@/lib/db/tools";
import { getCves } from "@/lib/db/cves";
import { getSiteStats } from "@/lib/db/stats";
import { siteConfig } from "@/lib/siteConfig";
import YouTubeSection from "@/components/YouTubeSection";

export const dynamic = "force-dynamic"; // renders per-request; content changes daily via the pipeline, so build-time prerendering isn't useful here

// Blocks marked cn-only-colorful are hidden in Classic and shown when the
// Colorful switch is on (see app/theme.css). Blocks marked cn-only-classic are
// the reverse. Everything else is shared, so core content is rendered once.
const TOPIC_ICONS: Record<string, string> = {
  "networking-fundamentals": "🌐",
  "web-security": "🕸",
  osint: "🔎",
  "pentesting-tools": "🧰",
};
const iconFor = (slug: string) => TOPIC_ICONS[slug] ?? "📁";

export default async function Home() {
  const [articles, topics, tools, cves, stats] = await Promise.all([
    getPublishedArticles(),
    getTopics(),
    getTools().catch(() => []),
    getCves().catch(() => []),
    getSiteStats(),
  ]);
  const [featured, ...rest] = articles;
  const featuredTopic = featured ? topics.find((t) => t.slug === featured.topicSlug) : undefined;
  const readMins = featured ? Math.max(1, Math.round(featured.body.split(/\s+/).length / 200)) : 0;
  const domain = siteConfig.url.replace(/^https?:\/\//, "");

  return (
    <div>
      <section className="relative pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8 cn-hero">
          <div className="max-w-xl">
            <span className="cn-pill cn-only-colorful">
              <b />
              {domain} · plain-language case files
            </span>
            <p className="case-number mb-4 cn-only-classic">FILE: 00-INTRO</p>
            <h1 className="text-4xl sm:text-6xl leading-[1.05] mb-6 cn-hero-title">
              Cybersecurity, <span>without the jargon.</span>
            </h1>
            <p className="text-lg text-ink-soft">
              Every complex topic — networking, web security, OSINT, the
              tools real attackers and defenders use — broken into case
              files anyone can read, at the level you're cleared for.
            </p>
            <div className="cn-cta cn-only-colorful">
              <Link href="/topics" className="cn-btn cn-btn-p">Start learning →</Link>
              <Link href="/tools" className="cn-btn cn-btn-s">Browse tools</Link>
            </div>
          </div>

          <div
            className="stamp text-rust border-rust text-sm shrink-0 self-start mt-2 sm:mt-8 cn-only-classic"
            aria-hidden="true"
          >
            CLEARED FOR
            <br />
            PUBLIC READING
          </div>

          <div className="cn-term cn-only-colorful" aria-hidden="true">
            <div className="cn-term__dots">
              <i style={{ background: "#FF5F57" }} />
              <i style={{ background: "#FEBC2E" }} />
              <i style={{ background: "#28C840" }} />
            </div>
            <div className="cn-term__body">
              <div><span className="g">$</span> nmap -sV <span className="y">192.168.1.10</span></div>
              <div className="d">Starting scan… host is up</div>
              <div><span className="c">22/tcp</span>&nbsp; open&nbsp; ssh&nbsp;&nbsp;&nbsp;&nbsp; <span className="d">OpenSSH</span></div>
              <div><span className="c">80/tcp</span>&nbsp; open&nbsp; http&nbsp;&nbsp;&nbsp; <span className="d">nginx</span></div>
              <div><span className="m">3306/tcp</span> closed mysql</div>
              <div className="d"># what does this mean? → Tools → Nmap</div>
            </div>
            <span className="cn-term__stamp">CLEARED FOR PUBLIC READING</span>
          </div>
        </div>
      </section>

      <div className="cn-stats cn-only-colorful">
        <div className="cn-stat"><b>{stats.caseFiles}</b><span>case files</span></div>
        <div className="cn-stat"><b>{stats.tools}</b><span>tools explained</span></div>
        <div className="cn-stat"><b>{stats.cves}</b><span>CVEs tracked</span></div>
        <div className="cn-stat"><b>{stats.topics}</b><span>topic hubs</span></div>
      </div>

      <div className="redaction-bar cn-only-classic" />

      {featured && (
        <section className="cn-sec">
          <p className="case-number mb-3 cn-only-classic">FEATURED CASE FILE</p>
          <div className="cn-sec-head cn-only-colorful">
            <h2>Featured case file</h2>
            <p>Start here — the latest explainer.</p>
          </div>
          <Link href={`/articles/${featured.slug}`} className="group block">
            <div className="border-2 border-ink p-6 sm:p-8 transition-colors group-hover:bg-paper-dark/60 cn-feat__card">
              <div className="cn-feat__art cn-only-colorful" aria-hidden="true">
                {iconFor(featured.topicSlug)}
                <em>{featured.caseNumber}</em>
              </div>
              <div className="cn-feat__txt">
                <div className="flex items-center justify-between mb-4">
                  <span className="case-number cn-only-classic">{featured.caseNumber}</span>
                  <ClearanceBadge level={featured.clearance} />
                </div>
                <h2 className="text-2xl sm:text-3xl mb-3">{featured.title}</h2>
                <p className="text-ink-soft max-w-lg">{featured.summary}</p>
                <div className="cn-feat__meta cn-only-colorful">
                  <span>⏱ {readMins} min read</span>
                  {featuredTopic && <span>🛡 {featuredTopic.title}</span>}
                </div>
                <span className="cn-btn cn-btn-p cn-only-colorful">Read case file</span>
              </div>
            </div>
          </Link>
        </section>
      )}

      <div className="redaction-bar cn-only-classic" />

      <section className="cn-sec">
        <h2 className="text-2xl mb-6">Topic Hubs</h2>
        <p className="cn-sub cn-only-colorful">Pick a path and read at the level you're cleared for.</p>
        <div className="grid sm:grid-cols-2 gap-6 mb-4">
          {topics.map((t) => (
            <Link key={t.slug} href={`/topics/${t.slug}`} className="hub-card">
              <div className="cn-hub-icon cn-only-colorful" aria-hidden="true">{iconFor(t.slug)}</div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg">{t.title}</h3>
                <ClearanceBadge level={t.clearance} />
              </div>
              <p className="text-sm text-ink-soft line-clamp-2">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="cn-two cn-only-colorful">
        <div className="cn-box">
          <h3>🧰 Tools directory</h3>
          {tools.length > 0 ? (
            <div className="cn-chips">
              {tools.slice(0, 9).map((t) => (
                <Link key={t.slug} href={`/tools/${t.slug}`} className="cn-chip">{t.name}</Link>
              ))}
            </div>
          ) : (
            <p className="cn-sub">No tools added yet.</p>
          )}
          <Link href="/tools" className="cn-more">All tools →</Link>
        </div>
        <div className="cn-box">
          <h3>🔥 Latest CVEs</h3>
          {cves.length > 0 ? (
            cves.slice(0, 3).map((c) => (
              <Link key={c.cveId} href={`/cves/${c.slug}`} className="cn-cve">
                <div>
                  <b>{c.cveId}</b>
                  <span>{c.title}</span>
                </div>
                {c.severity && (
                  <span className={`cn-badge cn-sev-${c.severity}`}>
                    {c.severity}{c.cvssScore ? ` ${c.cvssScore}` : ""}
                  </span>
                )}
              </Link>
            ))
          ) : (
            <p className="cn-sub">No CVEs added yet.</p>
          )}
          <Link href="/cves" className="cn-more">All CVEs →</Link>
        </div>
      </section>

      <div className="redaction-bar cn-only-classic" />

      <section className="cn-sec">
        <h2 className="text-2xl mb-2">More Case Files</h2>
        <div>
          {rest.length > 0 ? (
            rest.map((a) => <CaseFileCard key={a.slug} article={a} />)
          ) : (
            <p className="text-ink-soft font-mono text-sm">No other case files published yet.</p>
          )}
        </div>
      </section>

      <YouTubeSection />

      <section className="cn-band cn-only-colorful">
        <div>
          <h2>New to security?</h2>
          <p>Start with the basics and work up — one case file at a time.</p>
        </div>
        <Link href="/learning-paths" className="cn-btn cn-btn-w">Begin the path →</Link>
      </section>
    </div>
  );
}