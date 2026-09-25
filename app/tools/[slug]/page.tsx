import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import MetaBadge from "@/components/MetaBadge";
import InfoCard from "@/components/InfoCard";
import { getToolBySlug } from "@/lib/db/tools";

export const dynamic = "force-dynamic";

export default async function ToolPage({ params }: { params: { slug: string } }) {
  const tool = await getToolBySlug(params.slug);
  if (!tool) notFound();

  return (
    <article>
      <p className="case-number mb-3">{tool.category}</p>
      <h1 className="text-4xl leading-tight mb-4">{tool.name}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        <MetaBadge tone="clearance">{tool.category}</MetaBadge>
        {tool.supportedOs.map((os) => (
          <MetaBadge key={os}>{os}</MetaBadge>
        ))}
      </div>

      {/* Description is rendered as markdown, not plain text — a short blurb
          reads fine either way, but this also keeps long/structured content
          from admin forms (headings, line breaks, code) from collapsing into
          one unreadable paragraph. */}
      <div className="prose-content text-lg text-ink-soft mb-6">
        <ReactMarkdown>{tool.description}</ReactMarkdown>
      </div>

      <div className="redaction-bar-thin" />

      {tool.installation && (
        <InfoCard label="Installation" accent="moss">
          {tool.installation}
        </InfoCard>
      )}

      {tool.basicUsage && (
        <InfoCard label="Basic Usage" accent="clearance">
          {tool.basicUsage}
        </InfoCard>
      )}

      {tool.commonCommands && (
        <InfoCard label="Common Commands" accent="line">
          {tool.commonCommands}
        </InfoCard>
      )}

      {tool.defensiveNotes && (
        <InfoCard label="Defensive / Authorized-Use Notes" accent="rust">
          {tool.defensiveNotes}
        </InfoCard>
      )}

      {tool.learningResources.length > 0 && (
        <section className="mb-6">
          <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">
            Learning Resources
          </h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            {tool.learningResources.map((r, i) => (
              <li key={i}>
                <a href={r.url} target="_blank" rel="noreferrer" className="text-clearance underline">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {tool.officialDocsUrl && (
        <p className="mb-6">
          <a
            href={tool.officialDocsUrl}
            target="_blank"
            rel="noreferrer"
            className="text-clearance underline font-mono text-sm"
          >
            Official documentation &rarr;
          </a>
        </p>
      )}

      <div className="redaction-bar-thin" />
      <Link href="/tools" className="font-mono text-sm">
        &larr; Back to Tools Directory
      </Link>
    </article>
  );
}