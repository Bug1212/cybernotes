import { NextRequest, NextResponse } from "next/server";
import { publishOneDaily } from "../../../../lib/pipeline/publishDaily";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

function isAuthorized(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  return !!secret && req.headers.get("authorization") === `Bearer ${secret}`;
}

// Publishes at most ONE AI article per UTC day, and only if it passes the quality gate.
async function handle(req: NextRequest) {
  if (!isAuthorized(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await publishOneDaily());
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 });
  }
}
export const GET = handle;
export const POST = handle;