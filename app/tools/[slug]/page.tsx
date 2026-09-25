import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getToolBySlug } from "@/lib/db/tools";

export const dynamic = "force-dynamic";

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const tool = await getToolBySlug(params.slug);
  if (!tool) notFound();

  return (
    <article>
      <div className="flex items-center justify-between mb-4">
        <span className="case-number">{tool.category}</span>
        {tool.supportedOs.length > 0 && (
          <span className="font-mono text-xs text-ink-soft">{tool.supportedOs.join(", ")}</span>
        )}
      </div>
      <h1 className="text-4xl leading-tight mb-6">{tool.name}</h1>
      <p className="text-lg text-ink-soft mb-8">{tool.description}</p>
      <div className="redaction-bar-thin" />

      {tool.installation && (
        <div className="prose-content leading-relaxed mt-6">
          <h2 className="text-xl mb-2">Installation</h2>
          <ReactMarkdown>{tool.installation}</ReactMarkdown>
        </div>
      )}

      {tool.basicUsage && (
        <div className="prose-content leading-relaxed mt-6">
          <h2 className="text-xl mb-2">Basic usage</h2>
          <ReactMarkdown>{tool.basicUsage}</ReactMarkdown>
        </div>
      )}

      {tool.commonCommands && (
        <div className="prose-content leading-relaxed mt-6">
          <h2 className="text-xl mb-2">Common commands</h2>
          <ReactMarkdown>{tool.commonCommands}</ReactMarkdown>
        </div>
      )}

      {tool.defensiveNotes && (
        <div className="mt-8 rounded border border-line bg-paper-dark p-4 text-sm">
          <p className="font-mono text-xs uppercase tracking-wide text-clearance mb-1">Defensive notes</p>
          <p className="text-ink">{tool.defensiveNotes}</p>
        </div>
      )}

      {tool.officialDocsUrl && (
        <p className="mt-6 text-sm">
          <a href={tool.officialDocsUrl} target="_blank" rel="noreferrer" className="text-clearance underline">
            Official documentation &rarr;
          </a>
        </p>
      )}

      <div className="redaction-bar-thin mt-8" />
      <Link href="/tools" className="font-mono text-sm">
        &larr; Back to tools directory
      </Link>
    </article>
  );
}