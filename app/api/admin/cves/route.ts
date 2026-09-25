import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

function slugify(cveId: string) {
  return cveId.toLowerCase();
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("cves")
    .select("*")
    .order("published_date", { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cves: data });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    cve_id,
    title,
    severity,
    cvss_score,
    affected_software,
    affected_versions,
    vulnerability_type,
    cwe,
    published_date,
    updated_date,
    technical_explanation,
    attack_scenario,
    detection_methods,
    mitigation,
    patched_version,
    source_references,
    related_cves,
  } = body;

  if (!cve_id || !title) {
    return NextResponse.json({ error: "cve_id and title are required" }, { status: 400 });
  }
  if (!/^CVE-\d{4}-\d+$/i.test(cve_id)) {
    return NextResponse.json(
      { error: "cve_id must look like CVE-2024-12345" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("cves")
    .insert({
      cve_id: cve_id.toUpperCase(),
      slug: slugify(cve_id),
      title,
      severity: severity || null,
      cvss_score: cvss_score || null,
      affected_software: affected_software || null,
      affected_versions: affected_versions || null,
      vulnerability_type: vulnerability_type || null,
      cwe: cwe || null,
      published_date: published_date || null,
      updated_date: updated_date || null,
      technical_explanation: technical_explanation || null,
      attack_scenario: attack_scenario || null,
      detection_methods: detection_methods || null,
      mitigation: mitigation || null,
      patched_version: patched_version || null,
      source_references: source_references ?? [],
      related_cves: related_cves ?? [],
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cve: data }, { status: 201 });
}