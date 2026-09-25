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
  const { data, error } = await supabaseAdmin.from("tools").select("*").order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tools: data });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const required = ["slug", "name", "category", "description"];
  const missing = required.filter((k) => !body[k]);
  if (missing.length) {
    return NextResponse.json({ error: `Missing required field(s): ${missing.join(", ")}` }, { status: 400 });
  }

  const insert = {
    slug: body.slug,
    name: body.name,
    category: body.category,
    description: body.description,
    supported_os: body.supported_os ?? [],
    installation: body.installation ?? null,
    basic_usage: body.basic_usage ?? null,
    common_commands: body.common_commands ?? null,
    official_docs_url: body.official_docs_url ?? null,
    learning_resources: body.learning_resources ?? [],
    defensive_notes: body.defensive_notes ?? null,
  };

  const { data, error } = await supabaseAdmin.from("tools").insert(insert).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tool: data }, { status: 201 });
}