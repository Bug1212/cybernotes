import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import { getCveBySlug } from "@/lib/db/cves";

export const dynamic = "force-dynamic";

const severityStyles: Record<string, string> = {
  LOW: "text-moss border-moss",
  MEDIUM: "text-clearance border-clearance",
  HIGH: "text-rust border-rust",
  CRITICAL: "text-rust border-rust",
};

export default async function CvePage({ params }: { params: { slug: string } }) {
  const cve = await getCveBySlug(params.slug);
  if (!cve) notFound();

  return (
    <article>
      <div className="flex items-center justify-between mb-4">
        <span className="case-number">{cve.cveId}</span>
        {cve.severity && (
          <span
            className={`font-mono text-xs tracking-wide px-2 py-1 border ${severityStyles[cve.severity] ?? ""}`}
          >
            {cve.severity}
            {cve.cvssScore ? ` — CVSS ${cve.cvssScore}` : ""}
          </span>
        )}
      </div>
      <h1 className="text-4xl leading-tight mb-4">{cve.title}</h1>

      <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-ink-soft mb-8">
        {cve.cwe && <span>CWE: {cve.cwe}</span>}
        {cve.vulnerabilityType && <span>Type: {cve.vulnerabilityType}</span>}
        {cve.affectedSoftware && <span>Affects: {cve.affectedSoftware}{cve.affectedVersions ? ` (${cve.affectedVersions})` : ""}</span>}
        {cve.patchedVersion && <span>Patched in: {cve.patchedVersion}</span>}
        {cve.publishedDate && <span>Published: {cve.publishedDate}</span>}
      </div>

      <div className="redaction-bar-thin" />

      {cve.technicalExplanation && (
        <div className="prose-content leading-relaxed mt-6">
          <h2 className="text-xl mb-2">What it is</h2>
          <ReactMarkdown>{cve.technicalExplanation}</ReactMarkdown>
        </div>
      )}

      {cve.attackScenario && (
        <div className="prose-content leading-relaxed mt-6">
          <h2 className="text-xl mb-2">Attack scenario</h2>
          <ReactMarkdown>{cve.attackScenario}</ReactMarkdown>
        </div>
      )}

      {cve.detectionMethods && (
        <div className="prose-content leading-relaxed mt-6">
          <h2 className="text-xl mb-2">Detection</h2>
          <ReactMarkdown>{cve.detectionMethods}</ReactMarkdown>
        </div>
      )}

      {cve.mitigation && (
        <div className="prose-content leading-relaxed mt-6">
          <h2 className="text-xl mb-2">Mitigation</h2>
          <ReactMarkdown>{cve.mitigation}</ReactMarkdown>
        </div>
      )}

      {cve.references.length > 0 && (
        <div className="mt-10 border-t border-line pt-4 text-sm text-ink-soft">
          <p className="font-mono text-xs uppercase tracking-wide mb-2">References</p>
          <ul className="space-y-1">
            {cve.references.map((r, i) => (
              <li key={i}>
                <a href={r.url} target="_blank" rel="noreferrer" className="text-clearance underline">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="redaction-bar-thin mt-8" />
      <Link href="/cves" className="font-mono text-sm">
        &larr; Back to CVE database
      </Link>
    </article>
  );
}