import { supabasePublic } from "../supabasePublic";
import { Article } from "../types";

function mapArticle(row: any): Article {
  return {
    id: row.id,
    caseNumber: row.case_number,
    slug: row.slug,
    title: row.title,
    topicSlug: row.topic_slug,
    clearance: row.clearance,
    summary: row.summary,
    body: row.body,
    status: row.status,
    isAiGenerated: row.is_ai_generated,
    primarySources: row.primary_sources ?? [],
    publishedAt: row.published_at,
  };
}

// RLS restricts the anon role to status = 'published' rows regardless of
// the filter below — the explicit .eq is just so this reads correctly and
// fails obviously (empty array) rather than mysteriously if RLS is ever off.
export async function getPublishedArticles(): Promise<Article[]> {
  const { data, error } = await supabasePublic
    .from("articles")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(`getPublishedArticles: ${error.message}`);
  return (data ?? []).map(mapArticle);
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabasePublic
    .from("articles")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  if (error) throw new Error(`getArticleBySlug: ${error.message}`);
  return data ? mapArticle(data) : null;
}

export async function getArticlesByTopic(topicSlug: string): Promise<Article[]> {
  const { data, error } = await supabasePublic
    .from("articles")
    .select("*")
    .eq("topic_slug", topicSlug)
    .eq("status", "published")
    .order("published_at", { ascending: false });

  if (error) throw new Error(`getArticlesByTopic: ${error.message}`);
  return (data ?? []).map(mapArticle);
}
