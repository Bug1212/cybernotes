import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

const EDITABLE_FIELDS: Record<string, string> = {
  title: "title",
  severity: "severity",
  cvss_score: "cvss_score",
  affected_software: "affected_software",
  affected_versions: "affected_versions",
  vulnerability_type: "vulnerability_type",
  cwe: "cwe",
  published_date: "published_date",
  updated_date: "updated_date",
  technical_explanation: "technical_explanation",
  attack_scenario: "attack_scenario",
  detection_methods: "detection_methods",
  mitigation: "mitigation",
  patched_version: "patched_version",
  references: "source_references",
  related_cves: "related_cves",
};

export async function PATCH(req: NextRequest, { params }: { params: { cveId: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const update: Record<string, unknown> = {};
  for (const [inputKey, column] of Object.entries(EDITABLE_FIELDS)) {
    if (inputKey in body) update[column] = body[inputKey];
  }
  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "No editable fields provided" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("cves")
    .update(update)
    .eq("cve_id", params.cveId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cve: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { cveId: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { error } = await supabaseAdmin.from("cves").delete().eq("cve_id", params.cveId);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}