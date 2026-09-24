import Parser from "rss-parser";
import crypto from "crypto";
import { supabaseAdmin } from "../supabase";

const parser = new Parser({
  timeout: 15_000,
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
 * Pull every enabled RSS source, normalize items, and dedupe by content_hash
 * against what's already in raw_articles. Returns only genuinely new items —
 * nothing is written to the DB here (see storeRawArticles).
 */
export async function fetchAllSources(): Promise<FetchedItem[]> {
  const { data: sources, error } = await supabaseAdmin
    .from("sources")
    .select("id, url, kind")
    .eq("enabled", true);

  if (error) throw new Error(`Failed to load sources: ${error.message}`);
  if (!sources?.length) return [];

  const results: FetchedItem[] = [];

  for (const source of sources) {
    if (source.kind !== "rss") continue; // API sources: add a handler per-API as needed.

    try {
      const feed = await parser.parseURL(source.url);
      for (const item of feed.items) {
        const link = item.link ?? source.url;
        const title = (item.title ?? "").trim();
        if (!title) continue;

        results.push({
          sourceId: source.id,
          sourceUrl: link,
          title,
          summary: (item.contentSnippet ?? item.summary ?? "").slice(0, 2000),
          content: (item["content:encoded"] ?? item.content ?? item.contentSnippet ?? "").slice(0, 20_000),
          publishedAt: item.isoDate ?? item.pubDate ?? null,
          contentHash: hashItem(link, title),
        });
      }
    } catch (err) {
      // One bad feed shouldn't kill the whole run.
      console.error(`[pipeline] Failed to fetch source ${source.url}:`, err);
    }
  }

  return dedupeAgainstDatabase(results);
}

async function dedupeAgainstDatabase(items: FetchedItem[]): Promise<FetchedItem[]> {
  if (!items.length) return items;

  const hashes = items.map((i) => i.contentHash);
  const { data: existing, error } = await supabaseAdmin
    .from("raw_articles")
    .select("content_hash")
    .in("content_hash", hashes);

  if (error) throw new Error(`Dedup lookup failed: ${error.message}`);

  const seen = new Set(existing?.map((r) => r.content_hash) ?? []);
  // Also dedupe within this batch (a title can appear in two feeds).
  const batchSeen = new Set<string>();

  return items.filter((item) => {
    if (seen.has(item.contentHash) || batchSeen.has(item.contentHash)) return false;
    batchSeen.add(item.contentHash);
    return true;
  });
}

/** Insert new items into raw_articles. Returns the inserted rows. */
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

  const { data, error } = await supabaseAdmin
    .from("raw_articles")
    .insert(rows)
    .select();

  if (error) throw new Error(`Failed to store raw articles: ${error.message}`);
  return data ?? [];
}
