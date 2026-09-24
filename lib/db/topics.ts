import { supabasePublic } from "../supabasePublic";
import { Topic } from "../types";

function mapTopic(row: any): Topic {
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    clearance: row.clearance,
    sortOrder: row.sort_order,
  };
}

export async function getTopics(): Promise<Topic[]> {
  const { data, error } = await supabasePublic
    .from("topics")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw new Error(`getTopics: ${error.message}`);
  return (data ?? []).map(mapTopic);
}

export async function getTopicBySlug(slug: string): Promise<Topic | null> {
  const { data, error } = await supabasePublic
    .from("topics")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw new Error(`getTopicBySlug: ${error.message}`);
  return data ? mapTopic(data) : null;
}
