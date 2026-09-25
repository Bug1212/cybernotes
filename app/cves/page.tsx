import CveCard from "@/components/CveCard";
import { getCves } from "@/lib/db/cves";

export const dynamic = "force-dynamic"; // content changes as CVEs are added via /admin/cves

export default async function CvesIndex() {
  const cves = await getCves();

  return (
    <div>
      <h1 className="text-3xl mb-2">CVE / CWE Database</h1>
      <p className="text-ink-soft mb-8">
        Vulnerabilities explained for defenders: what they are, how they're detected, and how
        they're mitigated.
      </p>

      {cves.length === 0 && <p className="text-ink-soft">No CVEs published yet.</p>}

      {cves.map((cve) => (
        <CveCard key={cve.cveId} cve={cve} />
      ))}
    </div>
  );
}