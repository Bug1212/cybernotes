import Link from "next/link";
import MetaBadge from "@/components/MetaBadge";
import { getCves } from "@/lib/db/cves";

export const dynamic = "force-dynamic";

const SEVERITY_TONE = {
  LOW: "moss",
  MEDIUM: "clearance",
  HIGH: "rust",
  CRITICAL: "rust",
} as const;

export default async function CvesIndex() {
  const cves = await getCves();

  return (
    <div>
      <h1 className="text-3xl mb-2">CVE Database</h1>
      <p className="text-ink-soft mb-8 max-w-xl">
        Known vulnerabilities explained plainly — what they are, who's affected, how defenders
        detect and fix them.
      </p>
      {cves.length === 0 && <p className="text-ink-soft font-mono text-sm">No CVEs added yet.</p>}
      <div className="grid gap-4">
        {cves.map((c) => (
          <Link key={c.cveId} href={`/cves/${c.slug}`} className="hub-card">
            <div className="flex items-center justify-between mb-2">
              <span className="case-number">{c.cveId}</span>
              {c.severity && (
                <MetaBadge tone={SEVERITY_TONE[c.severity]}>
                  {c.severity} {c.cvssScore ? `· ${c.cvssScore}` : ""}
                </MetaBadge>
              )}
            </div>
            <h3 className="text-lg mb-1">{c.title}</h3>
            {c.affectedSoftware && (
              <p className="text-sm text-ink-soft">Affects: {c.affectedSoftware}</p>
            )}
          </Link>
        ))}
      </div>
      <p className="mt-10 border-t border-line pt-4 font-mono text-xs text-ink-soft">
        Data from the U.S. NIST National Vulnerability Database (NVD) and CISA&rsquo;s Known Exploited
        Vulnerabilities catalog. This product uses data from the NVD API but is not endorsed or
        certified by the NVD. Always confirm against the vendor&rsquo;s advisory.
      </p>
    </div>
  );
}
