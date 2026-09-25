import { notFound } from "next/navigation";
import Link from "next/link";
import MetaBadge from "@/components/MetaBadge";
import InfoCard from "@/components/InfoCard";
import { getCveBySlug } from "@/lib/db/cves";

export const dynamic = "force-dynamic";

const SEVERITY_TONE = {
  LOW: "moss",
  MEDIUM: "clearance",
  HIGH: "rust",
  CRITICAL: "rust",
} as const;

export default async function CvePage({ params }: { params: { slug: string } }) {
  const cve = await getCveBySlug(params.slug);
  if (!cve) notFound();

  const metaRows = [
    { label: "Affected software", value: cve.affectedSoftware },
    { label: "Affected versions", value: cve.affectedVersions },
    { label: "Vulnerability type", value: cve.vulnerabilityType },
    { label: "CWE", value: cve.cwe },
    { label: "Patched version", value: cve.patchedVersion },
    { label: "Published", value: cve.publishedDate },
    { label: "Updated", value: cve.updatedDate },
  ].filter((r) => r.value);

  return (
    <article>
      <p className="case-number mb-3">{cve.cveId}</p>
      <h1 className="text-4xl leading-tight mb-4">{cve.title}</h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {cve.severity && (
          <MetaBadge tone={SEVERITY_TONE[cve.severity]}>
            {cve.severity} {cve.cvssScore ? `· CVSS ${cve.cvssScore}` : ""}
          </MetaBadge>
        )}
        {cve.cwe && <MetaBadge>{cve.cwe}</MetaBadge>}
      </div>

      {metaRows.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-2 mb-6 border border-line rounded p-4 bg-paper-dark">
          {metaRows.map((r) => (
            <div key={r.label} className="flex justify-between text-sm border-b border-line/50 py-1.5 last:border-0">
              <span className="font-mono text-xs uppercase text-ink-soft">{r.label}</span>
              <span className="text-ink">{r.value}</span>
            </div>
          ))}
        </div>
      )}

      <div className="redaction-bar-thin" />

      {cve.technicalExplanation && (
        <InfoCard label="What Is It?" accent="clearance">
          {cve.technicalExplanation}
        </InfoCard>
      )}

      {cve.attackScenario && (
        <InfoCard label="How It's Exploited" accent="rust">
          {cve.attackScenario}
        </InfoCard>
      )}

      {cve.detectionMethods && (
        <InfoCard label="Detection" accent="line">
          {cve.detectionMethods}
        </InfoCard>
      )}

      {cve.mitigation && (
        <InfoCard label="Mitigation" accent="moss">
          {cve.mitigation}
        </InfoCard>
      )}

      {cve.references.length > 0 && (
        <section className="mb-6">
          <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">References</h2>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            {cve.references.map((r, i) => (
              <li key={i}>
                <a href={r.url} target="_blank" rel="noreferrer" className="text-clearance underline">
                  {r.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {cve.relatedCves.length > 0 && (
        <section className="mb-6">
          <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">Related CVEs</h2>
          <div className="flex flex-wrap gap-2">
            {cve.relatedCves.map((id) => (
              <MetaBadge key={id}>{id}</MetaBadge>
            ))}
          </div>
        </section>
      )}

      <div className="redaction-bar-thin" />
      <Link href="/cves" className="font-mono text-sm">
        &larr; Back to CVE Database
      </Link>
    </article>
  );
}