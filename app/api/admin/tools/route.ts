import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  return req.headers.get("authorization") === `Bearer ${secret}`;
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin.from("tools").select("*").order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tools: data });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    slug,
    name,
    category,
    description,
    supported_os,
    installation,
    basic_usage,
    common_commands,
    official_docs_url,
    learning_resources,
    defensive_notes,
  } = body;

  if (!slug || !name || !category || !description) {
    return NextResponse.json(
      { error: "slug, name, category, and description are required" },
      { status: 400 }
    );
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "slug must be lowercase letters, numbers, and hyphens only" },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("tools")
    .insert({
      slug,
      name,
      category,
      description,
      supported_os: supported_os ?? [],
      installation: installation || null,
      basic_usage: basic_usage || null,
      common_commands: common_commands || null,
      official_docs_url: official_docs_url || null,
      learning_resources: learning_resources ?? [],
      defensive_notes: defensive_notes || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tool: data }, { status: 201 });
}