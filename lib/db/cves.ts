import { supabasePublic } from "../supabasePublic";
import { CVE } from "../types";

function mapCve(row: any): CVE {
  return {
    cveId: row.cve_id,
    slug: row.slug,
    title: row.title,
    severity: row.severity,
    cvssScore: row.cvss_score,
    affectedSoftware: row.affected_software,
    affectedVersions: row.affected_versions,
    vulnerabilityType: row.vulnerability_type,
    cwe: row.cwe,
    publishedDate: row.published_date,
    updatedDate: row.updated_date,
    technicalExplanation: row.technical_explanation,
    attackScenario: row.attack_scenario,
    detectionMethods: row.detection_methods,
    mitigation: row.mitigation,
    patchedVersion: row.patched_version,
    references: row.source_references ?? [],
    relatedCves: row.related_cves ?? [],
  };
}

export async function getCves(): Promise<CVE[]> {
  const { data, error } = await supabasePublic
    .from("cves")
    .select("*")
    .order("published_date", { ascending: false });
  if (error) throw new Error(`getCves: ${error.message}`);
  return (data ?? []).map(mapCve);
}

export async function getCveBySlug(slug: string): Promise<CVE | null> {
  const { data, error } = await supabasePublic.from("cves").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`getCveBySlug: ${error.message}`);
  return data ? mapCve(data) : null;
}
