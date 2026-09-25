// // import { NextRequest, NextResponse } from "next/server";
// // import { supabaseAdmin } from "../../../../lib/supabase";

// // export const dynamic = "force-dynamic";

// // function isAuthorized(req: NextRequest) {
// //   const secret = process.env.ADMIN_SECRET;
// //   if (!secret) return false;
// //   const header = req.headers.get("authorization");
// //   return header === `Bearer ${secret}`;
// // }

// // export async function GET(req: NextRequest) {
// //   if (!isAuthorized(req)) {
// //     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
// //   }

// //   const status = req.nextUrl.searchParams.get("status") ?? "draft,in_review";
// //   const statuses = status.split(",");

// //   const { data, error } = await supabaseAdmin
// //     .from("articles")
// //     .select("*")
// //     .in("status", statuses)
// //     .order("generated_at", { ascending: false });

// //   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
// //   return NextResponse.json({ articles: data });
// // }

// import { NextRequest, NextResponse } from "next/server";
// import { supabaseAdmin } from "../../../../lib/supabase";

// export const dynamic = "force-dynamic";

// function isAuthorized(req: NextRequest) {
//   const secret = process.env.ADMIN_SECRET;
//   if (!secret) return false;
//   const header = req.headers.get("authorization");
//   return header === `Bearer ${secret}`;
// }

// export async function GET(req: NextRequest) {
//   if (!isAuthorized(req)) {
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//   }

//   const status = req.nextUrl.searchParams.get("status") ?? "draft,in_review";
//   const statuses = status.split(",");

//   const { data, error } = await supabaseAdmin
//     .from("articles")
//     .select("*")
//     .in("status", statuses)
//     .order("generated_at", { ascending: false });

//   if (error) return NextResponse.json({ error: error.message, debug: { statuses } }, { status: 500 });

//   // Debug: unfiltered count + every status value actually present, using
//   // the SAME client instance. If `articles` is empty above but this shows a
//   // nonzero total, the filtered query is being blocked (RLS / wrong key) —
//   // not a "no matching rows" situation. If total is also 0, this client is
//   // hitting an empty or different database than the SQL editor is.
//   const { data: allRows, count, error: debugError } = await supabaseAdmin
//     .from("articles")
//     .select("status", { count: "exact" });

//   return NextResponse.json({
//     articles: data,
//     debug: {
//       requested_statuses: statuses,
//       matched_count: data?.length ?? 0,
//       total_articles_visible_to_this_client: count,
//       all_statuses_seen: allRows?.map((r) => r.status),
//       debug_query_error: debugError?.message ?? null,
//       connected_to_project_url: process.env.SUPABASE_URL,
//     },
//   });
// }
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const required = ["slug", "title", "topic_slug", "summary", "body"];
  const missing = required.filter((k) => !body[k]);
  if (missing.length) {
    return NextResponse.json({ error: `Missing required field(s): ${missing.join(", ")}` }, { status: 400 });
  }

  const insert = {
    case_number: body.case_number ?? null,
    slug: body.slug,
    title: body.title,
    topic_slug: body.topic_slug,
    clearance: body.clearance ?? "PUBLIC",
    summary: body.summary,
    body: body.body,
    status: body.status ?? "draft", // hand-written articles can be inserted straight as 'published' if desired
    is_ai_generated: false,
    primary_sources: body.primary_sources ?? [],
    published_at: body.status === "published" ? new Date().toISOString() : null,
  };

  const { data, error } = await supabaseAdmin.from("articles").insert(insert).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ article: data }, { status: 201 });
}

export async function GET(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = req.nextUrl.searchParams.get("status") ?? "draft,in_review";
  const statuses = status.split(",");

  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("*")
    .in("status", statuses)
    .order("generated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message, debug: { statuses } }, { status: 500 });

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