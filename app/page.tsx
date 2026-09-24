import Link from "next/link";
import CaseFileCard from "@/components/CaseFileCard";
import ClearanceBadge from "@/components/ClearanceBadge";
import { getPublishedArticles } from "@/lib/db/articles";
import { getTopics } from "@/lib/db/topics";

export const dynamic = "force-dynamic"; // renders per-request; content changes daily via the pipeline, so build-time prerendering isn't useful here

export default async function Home() {
  const [articles, topics] = await Promise.all([getPublishedArticles(), getTopics()]);
  const [featured, ...rest] = articles;

  return (
    <div>
      <section className="relative pb-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-8">
          <div className="max-w-xl">
            <p className="case-number mb-4">FILE: 00-INTRO</p>
            <h1 className="text-4xl sm:text-6xl leading-[1.05] mb-6">
              Cybersecurity, without the jargon.
            </h1>
            <p className="text-lg text-ink-soft">
              Every complex topic — networking, web security, OSINT, the
              tools real attackers and defenders use — broken into case
              files anyone can read, at the level you're cleared for.
            </p>
          </div>
          <div
            className="stamp text-rust border-rust text-sm shrink-0 self-start mt-2 sm:mt-8"
            aria-hidden="true"
          >
            CLEARED FOR
            <br />
            PUBLIC READING
          </div>
        </div>
      </section>

      <div className="redaction-bar" />

      {featured && (
        <section>
          <p className="case-number mb-3">FEATURED CASE FILE</p>
          <Link href={`/articles/${featured.slug}`} className="group block">
            <div className="border-2 border-ink p-6 sm:p-8 transition-colors group-hover:bg-paper-dark/60">
              <div className="flex items-center justify-between mb-4">
                <span className="case-number">{featured.caseNumber}</span>
                <ClearanceBadge level={featured.clearance} />
              </div>
              <h2 className="text-2xl sm:text-3xl mb-3">{featured.title}</h2>
              <p className="text-ink-soft max-w-lg">{featured.summary}</p>
            </div>
          </Link>
        </section>
      )}

      <div className="redaction-bar" />

      <section>
        <h2 className="text-2xl mb-6">Topic Hubs</h2>
        <div className="grid sm:grid-cols-2 gap-6 mb-4">
          {topics.map((t) => (
            <Link key={t.slug} href={`/topics/${t.slug}`} className="hub-card">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg">{t.title}</h3>
                <ClearanceBadge level={t.clearance} />
              </div>
              <p className="text-sm text-ink-soft">{t.description}</p>
            </Link>
          ))}
        </div>
      </section>

      <div className="redaction-bar" />

      <section>
        <h2 className="text-2xl mb-2">More Case Files</h2>
        <div>
          {rest.length > 0 ? (
            rest.map((a) => <CaseFileCard key={a.slug} article={a} />)
          ) : (
            <p className="text-ink-soft font-mono text-sm">No other case files published yet.</p>
          )}
        </div>
      </section>
    </div>
  );
}