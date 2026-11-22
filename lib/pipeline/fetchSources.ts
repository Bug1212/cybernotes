import Parser from "rss-parser";
import crypto from "crypto";
import { supabaseAdmin } from "../supabase";

const parser = new Parser({
  timeout: 10_000,
  headers: { "User-Agent": "CyberNotesBot/1.0 (+https://cybernotes.example)" },
});

export interface FetchedItem {
  sourceId: string;
  sourceUrl: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string | null;
  contentHash: string;
}

function hashItem(sourceUrl: string, title: string) {
  return crypto
    .createHash("sha256")
    .update(`${sourceUrl}::${title}`.toLowerCase().trim())
    .digest("hex");
}

/**
 * Pull every enabled RSS source and normalize items. Dedup against what's
 * already in the DB happens at insert time (storeRawArticles uses upsert +
 * ignoreDuplicates on content_hash) rather than here — with 20+ sources a
 * pre-check using `.in("content_hash", [...hundreds of hashes])` builds a
 * URL long enough that Cloudflare/PostgREST reject it outright (414 Request-
 * URI Too Large). The unique constraint on content_hash is the real dedup
 * mechanism; this function only dedupes within the current batch (the same
 * item can appear in two feeds).
 */
export async function fetchAllSources(): Promise<FetchedItem[]> {
  const { data: sources, error } = await supabaseAdmin
    .from("sources")
    .select("id, url, kind")
    .eq("enabled", true);

  if (error) throw new Error(`Failed to load sources: ${error.message}`);
  if (!sources?.length) return [];

  const results: FetchedItem[] = [];
  const batchSeen = new Set<string>();

  // Fetch all feeds in parallel (sequential fetching of 20+ feeds is too slow for a serverless time limit).
  const rssSources = sources.filter((s) => s.kind === "rss"); // API sources: add a handler per-API as needed.
  const settled = await Promise.allSettled(rssSources.map((source) => parser.parseURL(source.url)));

  settled.forEach((outcome, i) => {
    const source = rssSources[i];
    if (outcome.status === "rejected") {
      // One bad feed shouldn't kill the whole run.
      console.error(`[pipeline] Failed to fetch source ${source.url}:`, outcome.reason);
      return;
    }
    // Newest 15 per feed: some feeds (e.g. CISA) return years of archive on the first run.
    for (const item of outcome.value.items.slice(0, 15)) {
      const link = item.link ?? source.url;
      const title = (item.title ?? "").trim();
      if (!title) continue;

      const contentHash = hashItem(link, title);
      if (batchSeen.has(contentHash)) continue; // same item syndicated on two feeds
      batchSeen.add(contentHash);

      results.push({
        sourceId: source.id,
        sourceUrl: link,
        title,
        summary: (item.contentSnippet ?? item.summary ?? "").slice(0, 2000),
        content: (item["content:encoded"] ?? item.content ?? item.contentSnippet ?? "").slice(0, 20_000),
        publishedAt: item.isoDate ?? item.pubDate ?? null,
        contentHash,
      });
    }
  });

  return results;
}

/**
 * Insert new items into raw_articles. Uses upsert + ignoreDuplicates on the
 * content_hash unique constraint instead of insert(), so items already seen
 * in a prior run are silently skipped by Postgres rather than needing a
 * separate lookup first. Returns only the rows that were actually new.
 */
export async function storeRawArticles(items: FetchedItem[]) {
  if (!items.length) return [];

  const rows = items.map((item) => ({
    source_id: item.sourceId,
    source_url: item.sourceUrl,
    title: item.title,
    summary: item.summary,
    content: item.content,
    published_at: item.publishedAt,
    content_hash: item.contentHash,
    status: "pending" as const,
  }));

  // ignoreDuplicates means conflicting rows are skipped, not updated — and
  // Supabase/PostgREST only returns the rows actually written when you
  // ask for .select() after an upsert, so `data` here is already just the
  // genuinely-new ones.
  const { data, error } = await supabaseAdmin
    .from("raw_articles")
    .upsert(rows, { onConflict: "content_hash", ignoreDuplicates: true })
    .select();

  if (error) throw new Error(`Failed to store raw articles: ${error.message}`);
  return data ?? [];
}
