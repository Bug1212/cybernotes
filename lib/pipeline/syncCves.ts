import { supabaseAdmin } from "../supabase";

// Data sources (both free, official):
//  - CISA Known Exploited Vulnerabilities (KEV): CVEs being exploited in the wild, with a
//    "required action" we use as mitigation guidance.
//  - NIST NVD API 2.0: description, CVSS score/severity, CWE, affected versions, references.
// "This product uses data from the NVD API but is not endorsed or certified by the NVD."
const KEV_URL = "https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json";
const NVD_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0";

interface Kev {
  cveID: string;
  vendorProject?: string;
  product?: string;
  vulnerabilityName?: string;
  dateAdded?: string;
  shortDescription?: string;
  requiredAction?: string;
  dueDate?: string;
  knownRansomwareCampaignUse?: string;
}

const CWE_NAMES: Record<string, string> = {
  "CWE-20": "Improper Input Validation", "CWE-22": "Path Traversal", "CWE-77": "Command Injection",
  "CWE-78": "OS Command Injection", "CWE-79": "Cross-site Scripting (XSS)", "CWE-89": "SQL Injection",
  "CWE-94": "Code Injection", "CWE-119": "Memory Buffer Errors", "CWE-125": "Out-of-bounds Read",
  "CWE-269": "Improper Privilege Management", "CWE-287": "Improper Authentication",
  "CWE-306": "Missing Authentication for Critical Function", "CWE-352": "Cross-Site Request Forgery (CSRF)",
  "CWE-416": "Use After Free", "CWE-434": "Unrestricted File Upload", "CWE-502": "Deserialization of Untrusted Data",
  "CWE-787": "Out-of-bounds Write", "CWE-798": "Hard-coded Credentials", "CWE-862": "Missing Authorization",
  "CWE-918": "Server-Side Request Forgery (SSRF)",
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function getJson(url: string, headers: Record<string, string> = {}) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), 20_000);
  try {
    const res = await fetch(url, { headers: { "User-Agent": "CyberNotesBot/1.0", ...headers }, signal: ctrl.signal, cache: "no-store" });
    if (!res.ok) throw new Error(`${url} → HTTP ${res.status}`);
    return await res.json();
  } finally {
    clearTimeout(t);
  }
}

const nvdHeaders = (): Record<string, string> => (process.env.NVD_API_KEY ? { apiKey: process.env.NVD_API_KEY } : {});

function pickSeverity(metrics: any): { score: number | null; severity: string | null } {
  const m = metrics?.cvssMetricV31?.[0] ?? metrics?.cvssMetricV30?.[0] ?? metrics?.cvssMetricV40?.[0] ?? metrics?.cvssMetricV2?.[0];
  if (!m) return { score: null, severity: null };
  const score = m.cvssData?.baseScore ?? null;
  const sev = String(m.cvssData?.baseSeverity ?? m.baseSeverity ?? "").toUpperCase();
  return { score, severity: ["LOW", "MEDIUM", "HIGH", "CRITICAL"].includes(sev) ? sev : null };
}

function versionInfo(configurations: any[] | undefined) {
  const ranges: string[] = [];
  let fixed: string | null = null;
  let vendor: string | null = null, product: string | null = null;
  for (const conf of configurations ?? []) for (const node of conf.nodes ?? []) for (const m of node.cpeMatch ?? []) {
    if (!m.vulnerable) continue;
    const parts = String(m.criteria).split(":"); // cpe:2.3:a:vendor:product:version:...
    if (!vendor && parts[3]) { vendor = parts[3]; product = parts[4] ?? null; }
    const lo = m.versionStartIncluding ? `>= ${m.versionStartIncluding}` : m.versionStartExcluding ? `> ${m.versionStartExcluding}` : "";
    const hi = m.versionEndExcluding ? `< ${m.versionEndExcluding}` : m.versionEndIncluding ? `<= ${m.versionEndIncluding}` : "";
    if (m.versionEndExcluding && !fixed) fixed = `${m.versionEndExcluding} or later`;
    const range = [lo, hi].filter(Boolean).join(", ") || (parts[5] && parts[5] !== "*" && parts[5] !== "-" ? parts[5] : "");
    if (range && !ranges.includes(range)) ranges.push(range);
  }
  const pretty = (s: string) => s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    versions: ranges.slice(0, 6).join("; ") || null,
    fixed,
    software: vendor ? `${pretty(vendor)} ${product ? pretty(product) : ""}`.trim() : null,
  };
}

const first = (s: string, n: number) => {
  const sentence = s.split(/(?<=[.!?])\s/)[0] ?? s;
  return sentence.length > n ? sentence.slice(0, n - 1).trimEnd() + "…" : sentence;
};

function buildRow(id: string, nvd: any | null, kev: Kev | null) {
  const desc: string = nvd?.descriptions?.find((d: any) => d.lang === "en")?.value ?? kev?.shortDescription ?? "";
  const { score, severity } = pickSeverity(nvd?.metrics);
  const { versions, fixed, software } = versionInfo(nvd?.configurations);
  const cwes: string[] = (nvd?.weaknesses ?? [])
    .flatMap((w: any) => w.description ?? [])
    .map((d: any) => d.value)
    .filter((v: string) => /^CWE-\d+$/.test(v));
  const cwe = cwes.length ? Array.from(new Set(cwes)).join(", ") : null;
  const refs: { title: string; url: string }[] = (nvd?.references ?? []).slice(0, 8).map((r: any) => {
    let host = r.source; try { host = new URL(r.url).hostname; } catch {}
    return { title: `${(r.tags ?? [])[0] ?? "Reference"} — ${host}`, url: r.url };
  });
  const fixRefs = (nvd?.references ?? []).filter((r: any) => (r.tags ?? []).some((t: string) => ["Patch", "Vendor Advisory", "Mitigation"].includes(t))).slice(0, 4);

  const mit: string[] = [];
  if (kev) {
    mit.push(`**Actively exploited.** This CVE is in CISA's Known Exploited Vulnerabilities catalog (added ${kev.dateAdded ?? "n/a"}${kev.knownRansomwareCampaignUse === "Known" ? "; used in ransomware campaigns" : ""}).`);
    if (kev.requiredAction) mit.push(`**CISA required action:** ${kev.requiredAction}`);
    if (kev.dueDate) mit.push(`US federal agencies were required to remediate by ${kev.dueDate}; other organisations should treat it with the same urgency.`);
  } else {
    mit.push("Apply the vendor's security update or documented workaround, and limit exposure of the affected service until it is patched.");
  }
  if (fixRefs.length) mit.push("**Patches and advisories:**\n" + fixRefs.map((r: any) => `- ${r.url}`).join("\n"));

  return {
    cve_id: id,
    slug: id.toLowerCase(),
    title: kev?.vulnerabilityName ? `${kev.vulnerabilityName}` : first(desc, 120) || id,
    severity,
    cvss_score: score,
    affected_software: [kev?.vendorProject, kev?.product].filter(Boolean).join(" ") || software,
    affected_versions: versions,
    vulnerability_type: cwes.map((c) => CWE_NAMES[c]).find(Boolean) ?? null,
    cwe,
    published_date: nvd?.published?.slice(0, 10) ?? kev?.dateAdded ?? null,
    updated_date: nvd?.lastModified?.slice(0, 10) ?? null,
    technical_explanation: desc || null,
    attack_scenario: null,
    detection_methods: null,
    mitigation: mit.join("\n\n"),
    patched_version: fixed,
    source_references: refs,
    related_cves: [],
  };
}

/**
 * Adds new CVEs: newest KEV entries first (actively exploited), then recent CRITICAL CVEs from NVD.
 * `limit` caps NVD lookups per run (no API key: NVD allows ~5 requests / 30s, so keep it small;
 * set NVD_API_KEY for a much higher rate).
 */
export async function syncCves(limit = process.env.NVD_API_KEY ? 10 : 4) {
  const delay = process.env.NVD_API_KEY ? 700 : 6500;
  const added: string[] = [];
  const errors: string[] = [];

  // 1. KEV
  let kevList: Kev[] = [];
  try {
    const kev = await getJson(KEV_URL);
    kevList = (kev.vulnerabilities as Kev[]).sort((a, b) => (b.dateAdded ?? "").localeCompare(a.dateAdded ?? "")).slice(0, 40);
  } catch (e) { errors.push(`KEV: ${(e as Error).message}`); }

  const existing = new Set<string>();
  for (let i = 0; i < kevList.length; i += 20) {
    const ids = kevList.slice(i, i + 20).map((k) => k.cveID);
    const { data } = await supabaseAdmin.from("cves").select("cve_id").in("cve_id", ids);
    (data ?? []).forEach((r) => existing.add(r.cve_id));
  }
  const fresh = kevList.filter((k) => !existing.has(k.cveID)).slice(0, limit);

  for (let i = 0; i < fresh.length; i++) {
    const k = fresh[i];
    let nvd: any = null;
    try {
      const data = await getJson(`${NVD_URL}?cveId=${encodeURIComponent(k.cveID)}`, nvdHeaders());
      nvd = data.vulnerabilities?.[0]?.cve ?? null;
    } catch (e) { errors.push(`NVD ${k.cveID}: ${(e as Error).message}`); }
    const { error } = await supabaseAdmin.from("cves").upsert(buildRow(k.cveID, nvd, k), { onConflict: "cve_id" });
    if (error) errors.push(`${k.cveID}: ${error.message}`); else added.push(k.cveID);
    if (i < fresh.length - 1) await sleep(delay);
  }

  // 2. Recent CRITICAL CVEs from NVD (one request)
  try {
    await sleep(delay);
    const end = new Date(), start = new Date(end.getTime() - 7 * 86400_000);
    const fmt = (d: Date) => d.toISOString().replace("Z", "");
    const url = `${NVD_URL}?pubStartDate=${fmt(start)}&pubEndDate=${fmt(end)}&cvssV3Severity=CRITICAL&resultsPerPage=8`;
    const data = await getJson(url, nvdHeaders());
    const items: any[] = (data.vulnerabilities ?? []).map((v: any) => v.cve).filter((c: any) => c && !added.includes(c.id));
    const { data: have } = await supabaseAdmin.from("cves").select("cve_id").in("cve_id", items.map((c) => c.id));
    const haveSet = new Set((have ?? []).map((r) => r.cve_id));
    const rows = items.filter((c) => !haveSet.has(c.id)).map((c) => buildRow(c.id, c, null));
    if (rows.length) {
      const { error } = await supabaseAdmin.from("cves").upsert(rows, { onConflict: "cve_id" });
      if (error) errors.push(`NVD recent: ${error.message}`); else added.push(...rows.map((r) => r.cve_id));
    }
  } catch (e) { errors.push(`NVD recent: ${(e as Error).message}`); }

  return { added, errors };
}
