import { NextRequest, NextResponse } from "next/server";
import { fetchAllSources, storeRawArticles } from "../../../../lib/pipeline/fetchSources";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false; // fail closed if not configured
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

export async function POST(req: NextRequest) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const newItems = await fetchAllSources();
    const stored = await storeRawArticles(newItems);
    return NextResponse.json({ fetched: newItems.length, stored: stored.length });
  } catch (err) {
    console.error("[api/pipeline/fetch]", err);
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
