import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ClearanceBadge from "@/components/ClearanceBadge";
import { getArticleBySlug } from "@/lib/db/articles";

export const dynamic = "force-dynamic"; // renders per-request; content changes daily via the pipeline, so build-time prerendering isn't useful here

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticleBySlug(params.slug);
  if (!article) notFound();

  return (
    <article>
      <div className="flex items-center justify-between mb-4">
        <span className="case-number">{article.caseNumber}</span>
        <ClearanceBadge level={article.clearance} />
      </div>
      <h1 className="text-4xl leading-tight mb-6">{article.title}</h1>
      <p className="text-lg text-ink-soft mb-8">{article.summary}</p>
      <div className="redaction-bar-thin" />
      <div className="prose-content leading-relaxed">
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>

      {article.isAiGenerated && article.primarySources.length > 0 && (
        <div className="mt-10 border-t border-line pt-4 text-sm text-ink-soft">
          <p className="font-mono text-xs uppercase tracking-wide mb-2">Primary sources</p>
          <ul className="space-y-1">
            {article.primarySources.map((s, i) => (
              <li key={i}>
                <a href={s.url} target="_blank" rel="noreferrer" className="text-clearance underline">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="redaction-bar-thin" />
      <Link href={`/topics/${article.topicSlug}`} className="font-mono text-sm">
        &larr; Back to topic hub
      </Link>
    </article>
  );
}