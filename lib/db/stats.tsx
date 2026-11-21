import { supabasePublic } from "../supabasePublic";

// Counts shown in the Colorful home page stats strip. Never throws — a failed
// count just shows 0 rather than breaking the home page.
async function count(table: string, published = false): Promise<number> {
  try {
    let q = supabasePublic.from(table).select("*", { count: "exact", head: true });
    if (published) q = q.eq("status", "published");
    const { count: c } = await q;
    return c ?? 0;
  } catch {
    return 0;
  }
}

export async function getSiteStats() {
  const [caseFiles, tools, cves, topics] = await Promise.all([
    count("articles", true),
    count("tools"),
    count("cves"),
    count("topics"),
  ]);
  return { caseFiles, tools, cves, topics };
}