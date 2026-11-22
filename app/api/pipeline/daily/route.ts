import { NextRequest, NextResponse } from "next/server";
import { fetchAllSources, storeRawArticles } from "../../../../lib/pipeline/fetchSources";
import { generatePendingArticles } from "../../../../lib/pipeline/generateArticle";
import { publishOneDaily } from "../../../../lib/pipeline/publishDaily";
import { supabaseAdmin } from "../../../../lib/supabase";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return !!secret && req.headers.get("authorization") === `Bearer ${secret}`;
}

// One endpoint for the whole daily job (Vercel's free plan allows only 2 cron jobs):
//   fetch sources (only if the backlog is low) → draft articles → publish ONE that passes the gate.
// Vercel Cron uses GET; manual runs can use POST. Optional ?generate=N drafts more per run (default 2).
async function handle(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const generateCount = Math.min(Number(req.nextUrl.searchParams.get("generate")) || 2, 5);
  const out: Record<string, unknown> = {};
  try {
    const { count } = await supabaseAdmin.from("raw_articles").select("*", { count: "exact", head: true }).eq("status", "pending");
    out.pending_before = count ?? 0;
    if ((count ?? 0) < 20) {
      const stored = await storeRawArticles(await fetchAllSources());
      out.fetched_new = stored.length;
    }
    const drafted = await generatePendingArticles(generateCount);
    out.drafted = drafted.map((a) => a?.slug);
    out.publish = await publishOneDaily();
    return NextResponse.json(out);
  } catch (err) {
    return NextResponse.json({ ...out, error: (err as Error).message }, { status: 500 });
  }
}
export const GET = handle;
export const POST = handle;
