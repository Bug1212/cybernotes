import { NextRequest, NextResponse } from "next/server";
import { generatePendingArticles } from "../../../../lib/pipeline/generateArticle";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // One high-quality article a day was the original target with 4 sources.
    // With ~23 sources feeding raw_articles now, there's enough backlog to
    // draft more per run without scraping the bottom of the barrel. Still
    // all gated by /admin/review — raising this increases draft volume,
    // not publish volume.
    const generated = await generatePendingArticles(1);
    return NextResponse.json({ generated: generated.length, articles: generated.map((a) => a?.slug) });
  } catch (err) {
    console.error("[api/pipeline/generate]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}