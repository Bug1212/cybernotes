import { NextRequest, NextResponse } from "next/server";
import { generatePendingArticles } from "../../../../lib/pipeline/generateArticle";
import { supabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return !!secret && req.headers.get("authorization") === `Bearer ${secret}`;
}

const MAX_WAITING_DRAFTS = 6; // don't burn Groq quota drafting more while good drafts are still waiting

async function handle(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Each article = 2 Groq calls (~10-15s), so keep a run small enough for the 60s function limit.
  const count = Math.min(Number(req.nextUrl.searchParams.get("count")) || 2, 3);

  try {
    const { count: waiting } = await supabaseAdmin
      .from("articles")
      .select("*", { count: "exact", head: true })
      .eq("is_ai_generated", true)
      .eq("status", "draft");
    if ((waiting ?? 0) >= MAX_WAITING_DRAFTS) {
      return NextResponse.json({ generated: 0, skipped: `${waiting} verified drafts already waiting` });
    }
    const generated = await generatePendingArticles(count);
    return NextResponse.json({ generated: generated.length, articles: generated.map((a) => a?.slug) });
  } catch (err) {
    console.error("[api/pipeline/generate]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}

// GET for schedulers, POST for manual runs.
export const GET = handle;
export const POST = handle;