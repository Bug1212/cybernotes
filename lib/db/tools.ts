import { supabasePublic } from "../supabasePublic";
import { Tool } from "../types";

function mapTool(row: any): Tool {
  return {
    slug: row.slug,
    name: row.name,
    category: row.category,
    description: row.description,
    supportedOs: row.supported_os ?? [],
    installation: row.installation,
    basicUsage: row.basic_usage,
    commonCommands: row.common_commands,
    officialDocsUrl: row.official_docs_url,
    learningResources: row.learning_resources ?? [],
    defensiveNotes: row.defensive_notes,
  };
}

export async function getTools(): Promise<Tool[]> {
  const { data, error } = await supabasePublic.from("tools").select("*").order("name", { ascending: true });
  if (error) throw new Error(`getTools: ${error.message}`);
  return (data ?? []).map(mapTool);
}

export async function getToolsByCategory(category: string): Promise<Tool[]> {
  const { data, error } = await supabasePublic
    .from("tools")
    .select("*")
    .eq("category", category)
    .order("name", { ascending: true });
  if (error) throw new Error(`getToolsByCategory: ${error.message}`);
  return (data ?? []).map(mapTool);
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const { data, error } = await supabasePublic.from("tools").select("*").eq("slug", slug).maybeSingle();
  if (error) throw new Error(`getToolBySlug: ${error.message}`);
  return data ? mapTool(data) : null;
}
