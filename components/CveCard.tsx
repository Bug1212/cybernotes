import Link from "next/link";
import { CVE } from "@/lib/types";

const severityStyles: Record<string, string> = {
  LOW: "text-moss border-moss",
  MEDIUM: "text-clearance border-clearance",
  HIGH: "text-rust border-rust",
  CRITICAL: "text-rust border-rust",
};

export default function CveCard({ cve }: { cve: CVE }) {
  return (
    <Link href={`/cves/${cve.slug}`} className="case-row px-2 -mx-2">
      <div className="flex items-center justify-between mb-2">
        <span className="case-number">{cve.cveId}</span>
        {cve.severity && (
          <span
            className={`font-mono text-xs tracking-wide px-2 py-1 border ${severityStyles[cve.severity] ?? ""}`}
          >
            {cve.severity}
            {cve.cvssScore ? ` ${cve.cvssScore}` : ""}
          </span>
        )}
      </div>
      <h3 className="text-xl mb-1">{cve.title}</h3>
      <p className="text-ink-soft">
        {cve.cwe ? `${cve.cwe} · ` : ""}
        {cve.affectedSoftware ?? ""}
      </p>
    </Link>
  );
}