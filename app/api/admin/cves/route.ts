import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data, error } = await supabaseAdmin
    .from("cves")
    .select("*")
    .order("published_date", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cves: data });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const required = ["cve_id", "slug", "title"];
  const missing = required.filter((k) => !body[k]);
  if (missing.length) {
    return NextResponse.json({ error: `Missing required field(s): ${missing.join(", ")}` }, { status: 400 });
  }

  const insert = {
    cve_id: body.cve_id, // e.g. CVE-2024-12345
    slug: body.slug, // e.g. cve-2024-12345
    title: body.title,
    severity: body.severity ?? null, // LOW | MEDIUM | HIGH | CRITICAL
    cvss_score: body.cvss_score ?? null,
    affected_software: body.affected_software ?? null,
    affected_versions: body.affected_versions ?? null,
    vulnerability_type: body.vulnerability_type ?? null,
    cwe: body.cwe ?? null, // e.g. CWE-79
    published_date: body.published_date ?? null,
    updated_date: body.updated_date ?? null,
    technical_explanation: body.technical_explanation ?? null,
    attack_scenario: body.attack_scenario ?? null,
    detection_methods: body.detection_methods ?? null,
    mitigation: body.mitigation ?? null,
    patched_version: body.patched_version ?? null,
    source_references: body.references ?? [],
    related_cves: body.related_cves ?? [],
  };

  const { data, error } = await supabaseAdmin.from("cves").insert(insert).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cve: data }, { status: 201 });
}