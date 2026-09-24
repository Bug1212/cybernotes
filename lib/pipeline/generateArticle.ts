import { groqJSON } from "./groq";
import { supabaseAdmin } from "../supabase";

interface RawArticleRow {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  source_url: string;
}

interface DraftArticle {
  title: string;
  topic_slug: string;
  clearance: "PUBLIC" | "RESTRICTED" | "CLASSIFIED";
  summary: string;
  body: string; // markdown
}

interface FactCheckResult {
  verified: boolean;
  notes: string;
  unsupported_claims: string[];
}

const GENERATION_SYSTEM_PROMPT = `You are a cybersecurity editor for CyberNotes, a learning platform ("declassified case files" theme, PUBLIC/RESTRICTED/CLASSIFIED difficulty tiers).

Given one source article's title/summary/excerpt, write an ORIGINAL explainer for students and practitioners. Rules:
- Do not paraphrase or closely mirror the source's sentences. Use it only as a factual starting point; add structure, context, and your own explanation.
- Educational framing only: explain how a vulnerability/technique works, how defenders detect it, and how to mitigate it. NEVER include working exploit code, step-by-step attack instructions, or anything that gives uplift toward carrying out an attack.
- If the source describes active/in-the-wild exploitation, say so, but keep the piece defender-oriented (detection + mitigation), not attacker-oriented.
- Ground every factual claim in the provided source material. Do not invent CVE IDs, statistics, vendor statements, or dates that are not in the source text.
- Pick the best-fitting topic_slug from the provided list, and a clearance tier (PUBLIC = beginner concept, RESTRICTED = intermediate/applied, CLASSIFIED = advanced/technical depth).
- Output body as clean Markdown, roughly 500-900 words, with headings.

Respond with a single JSON object: { "title": string, "topic_slug": string, "clearance": "PUBLIC"|"RESTRICTED"|"CLASSIFIED", "summary": string (<= 200 chars), "body": string (markdown) }`;

const FACT_CHECK_SYSTEM_PROMPT = `You are a fact-checker. Compare the generated article body against the original source excerpt.
Flag any claim in the article (specific numbers, CVE IDs, vendor names, dates, quotes) that is NOT supported by the source excerpt.
Respond with a single JSON object: { "verified": boolean, "notes": string, "unsupported_claims": string[] }.
"verified" is true only if there are zero unsupported claims of consequence (minor phrasing differences are fine).`;

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 80);
}

async function nextCaseNumber(): Promise<string> {
  const { data, error } = await supabaseAdmin
    .from("articles")
    .select("case_number")
    .not("case_number", "is", null)
    .order("case_number", { ascending: false })
    .limit(1);

  if (error) throw new Error(`Failed to read last case number: ${error.message}`);

  const last = data?.[0]?.case_number as string | undefined;
  const lastNum = last ? parseInt(last.replace("CN-", ""), 10) : 0;
  return `CN-${String(lastNum + 1).padStart(3, "0")}`;
}

async function getTopicListForPrompt(): Promise<string> {
  const { data, error } = await supabaseAdmin.from("topics").select("slug, description");
  if (error) throw new Error(`Failed to load topics: ${error.message}`);
  return (data ?? []).map((t) => `${t.slug}: ${t.description}`).join("\n");
}

/**
 * Generate one draft article from one pending raw_article row, run a
 * fact-check pass against the source text, and store the result directly in
 * `articles` with status 'draft' (verified) or 'in_review' (unsupported
 * claims found — needs a human look before it can move to 'approved').
 */
export async function generateFromRawArticle(raw: RawArticleRow) {
  const sourceExcerpt = [raw.title, raw.summary, raw.content].filter(Boolean).join("\n\n").slice(0, 6000);
  const topicList = await getTopicListForPrompt();

  const draft = await groqJSON<DraftArticle>(
    GENERATION_SYSTEM_PROMPT,
    `Available topics:\n${topicList}\n\nSource article:\n${sourceExcerpt}\n\nSource URL (for attribution): ${raw.source_url}`
  );

  const factCheck = await groqJSON<FactCheckResult>(
    FACT_CHECK_SYSTEM_PROMPT,
    `Source excerpt:\n${sourceExcerpt}\n\nGenerated article body:\n${draft.body}`
  );

  const caseNumber = await nextCaseNumber();
  const slug = slugify(draft.title);
  const status = factCheck.verified ? "draft" : "in_review";

  const { data, error } = await supabaseAdmin
    .from("articles")
    .insert({
      raw_article_id: raw.id,
      case_number: caseNumber,
      slug,
      title: draft.title,
      topic_slug: draft.topic_slug,
      clearance: draft.clearance,
      summary: draft.summary,
      body: draft.body,
      is_ai_generated: true,
      primary_sources: [{ title: raw.title, url: raw.source_url }],
      fact_check_notes:
        factCheck.notes +
        (factCheck.unsupported_claims.length
          ? `\n\nUnsupported claims flagged: ${factCheck.unsupported_claims.join("; ")}`
          : ""),
      status,
    })
    .select()
    .single();

  if (error) throw new Error(`Failed to store generated article: ${error.message}`);

  await supabaseAdmin.from("raw_articles").update({ status: "processed" }).eq("id", raw.id);

  return data;
}

/** Process up to `limit` pending raw articles into drafts. */
export async function generatePendingArticles(limit = 3) {
  const { data: pending, error } = await supabaseAdmin
    .from("raw_articles")
    .select("id, title, summary, content, source_url")
    .eq("status", "pending")
    .order("fetched_at", { ascending: true })
    .limit(limit);

  if (error) throw new Error(`Failed to load pending raw articles: ${error.message}`);
  if (!pending?.length) return [];

  const results = [];
  for (const raw of pending) {
    try {
      results.push(await generateFromRawArticle(raw));
    } catch (err) {
      console.error(`[pipeline] Generation failed for raw_article ${raw.id}:`, err);
      await supabaseAdmin.from("raw_articles").update({ status: "skipped" }).eq("id", raw.id);
    }
  }
  return results;
}
