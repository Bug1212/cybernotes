import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "../../../../../lib/supabase";

export const dynamic = "force-dynamic";

function isAuthorized(req: NextRequest) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = req.headers.get("authorization");
  return header === `Bearer ${secret}`;
}

const ALLOWED_ACTIONS = ["approve", "reject", "publish", "edit"] as const;
type Action = (typeof ALLOWED_ACTIONS)[number];

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const action: Action | undefined = body.action;

  if (!action || !ALLOWED_ACTIONS.includes(action)) {
    return NextResponse.json({ error: `action must be one of ${ALLOWED_ACTIONS.join(", ")}` }, { status: 400 });
  }

  let update: Record<string, unknown>;

  switch (action) {
    case "approve":
      update = { status: "approved", reviewed_at: new Date().toISOString(), reviewer_notes: body.notes ?? null };
      break;
    case "reject":
      update = { status: "rejected", reviewed_at: new Date().toISOString(), reviewer_notes: body.notes ?? null };
      break;
    case "publish":
      update = { status: "published", published_at: new Date().toISOString() };
      break;
    case "edit":
      // Human touch-ups before approval: title/summary/body/topic_slug/clearance.
      update = {
        ...(body.title && { title: body.title }),
        ...(body.summary && { summary: body.summary }),
        ...(body.body && { body: body.body }),
        ...(body.topic_slug && { topic_slug: body.topic_slug }),
        ...(body.clearance && { clearance: body.clearance }),
      };
      break;
  }

  const { data, error } = await supabaseAdmin
    .from("articles")
    .update(update)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ article: data });
}
