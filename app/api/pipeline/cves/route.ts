import { NextRequest, NextResponse } from "next/server";
import { syncCves } from "../../../../lib/pipeline/syncCves";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return !!secret && req.headers.get("authorization") === `Bearer ${secret}`;
}

// Vercel Cron calls routes with GET; manual triggers can use POST. Same handler.
async function handle(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const limit = Number(req.nextUrl.searchParams.get("limit")) || undefined;
  try {
    return NextResponse.json(await syncCves(limit));
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
export const GET = handle;
export const POST = handle;
