import { supabaseAdmin } from "../supabase";
import { checkArticleQuality } from "./qualityGate";

/**
 * Publishes at most ONE AI article per UTC day: the newest fact-check-verified draft that passes
 * the quality gate. Drafts that fail are moved to 'in_review' with the reasons, so they get a human look
 * instead of being retried forever or published.
 */
export async function publishOneDaily() {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);

  const { data: today } = await supabaseAdmin
    .from("articles")
    .select("slug")
    .eq("is_ai_generated", true)
    .eq("status", "published")
    .gte("published_at", startOfDay.toISOString())
    .limit(1);
  if (today?.length) return { published: null, reason: `already published today (${today[0].slug})`, rejected: [] as string[] };

  const { data: titles } = await supabaseAdmin.from("articles").select("title").eq("status", "published").limit(1000);
  const existingTitles = (titles ?? []).map((t) => t.title as string);

  const { data: candidates, error } = await supabaseAdmin
    .from("articles")
    .select("id, slug, title, summary, body, primary_sources")
    .eq("is_ai_generated", true)
    .eq("status", "draft") // 'draft' = passed the automated fact-check; 'in_review' = flagged, never auto-published
    .order("generated_at", { ascending: false })
    .limit(10);
  if (error) throw new Error(`publishOneDaily: ${error.message}`);

  const rejected: string[] = [];
  for (const c of candidates ?? []) {
    const gate = checkArticleQuality(c, existingTitles);
    if (!gate.ok) {
      await supabaseAdmin
        .from("articles")
        .update({ status: "in_review", reviewer_notes: `Auto-publish gate failed: ${gate.reasons.join("; ")}` })
        .eq("id", c.id);
      rejected.push(`${c.slug}: ${gate.reasons.join("; ")}`);
      continue;
    }
    const now = new Date().toISOString();
    const { error: upErr } = await supabaseAdmin
      .from("articles")
      .update({
        status: "published",
        published_at: now,
        reviewed_at: now,
        reviewer_notes: "Auto-published: passed automated fact-check against the source and the quality gate. Spot-check in /admin/review.",
      })
      .eq("id", c.id)
      .eq("status", "draft");
    if (upErr) throw new Error(`publishOneDaily: ${upErr.message}`);
    return { published: c.slug as string, reason: "passed quality gate", rejected };
  }
  return { published: null, reason: "no draft passed the quality gate", rejected };
}
