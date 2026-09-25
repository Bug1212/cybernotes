import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

const EDITABLE_FIELDS = [
  "title",
  "severity",
  "cvss_score",
  "affected_software",
  "affected_versions",
  "vulnerability_type",
  "cwe",
  "published_date",
  "updated_date",
  "technical_explanation",
  "attack_scenario",
  "detection_methods",
  "mitigation",
  "patched_version",
  "source_references",
  "related_cves",
] as const;

export async function PATCH(req: NextRequest, { params }: { params: { cveId: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const update: Record<string, unknown> = {};
  for (const key of EDITABLE_FIELDS) {
    if (body[key] !== undefined) update[key] = body[key];
  }

  const { data, error } = await supabaseAdmin
    .from("cves")
    .update(update)
    .eq("cve_id", decodeURIComponent(params.cveId).toUpperCase())
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ cve: data });
}

export async function DELETE(req: NextRequest, { params }: { params: { cveId: string } }) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin
    .from("cves")
    .delete()
    .eq("cve_id", decodeURIComponent(params.cveId).toUpperCase());
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}