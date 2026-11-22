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

  const status = req.nextUrl.searchParams.get("status") ?? "draft,in_review";
  const statuses = status.split(",");

  let query = supabaseAdmin
    .from("articles")
    .select("*")
    .in("status", statuses)
    .order("generated_at", { ascending: false });
  if (req.nextUrl.searchParams.get("ai") === "1") query = query.eq("is_ai_generated", true);
  const limit = Number(req.nextUrl.searchParams.get("limit"));
  if (limit > 0) query = query.limit(Math.min(limit, 50));
  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message, debug: { statuses } }, { status: 500 });

  // Debug: unfiltered count + every status value actually present, using
  // the SAME client instance. If `articles` is empty above but this shows a
  // nonzero total, the filtered query is being blocked (RLS / wrong key) —
  // not a "no matching rows" situation. If total is also 0, this client is
  // hitting an empty or different database than the SQL editor is.
  const { data: allRows, count, error: debugError } = await supabaseAdmin
    .from("articles")
    .select("status", { count: "exact" });

  return NextResponse.json({
    articles: data,
    debug: {
      requested_statuses: statuses,
      matched_count: data?.length ?? 0,
      total_articles_visible_to_this_client: count,
      all_statuses_seen: allRows?.map((r) => r.status),
      debug_query_error: debugError?.message ?? null,
      connected_to_project_url: process.env.SUPABASE_URL,
    },
  });
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { slug, case_number, title, topic_slug, clearance, summary, status } = body;
  let { body: articleBody } = body;

  if (!slug || !title || !topic_slug || !summary || !articleBody) {
    return NextResponse.json(
      { error: "slug, title, topic_slug, summary, and body are required" },
      { status: 400 }
    );
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    return NextResponse.json(
      { error: "slug must be lowercase letters, numbers, and hyphens only" },
      { status: 400 }
    );
  }

  const publishNow = status === "published";

  const { data, error } = await supabaseAdmin
    .from("articles")
    .insert({
      slug,
      case_number: case_number || null,
      title,
      topic_slug,
      clearance: clearance ?? "PUBLIC",
      summary,
      body: articleBody,
      status: publishNow ? "published" : "draft",
      is_ai_generated: false,
      published_at: publishNow ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ article: data }, { status: 201 });
}
