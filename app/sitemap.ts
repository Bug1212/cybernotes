import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/siteConfig";
// import { supabasePublic } from "@/lib/supabasePublic";
import { supabaseRead } from "@/lib/supabaseRead";
import { QUIZ_CATEGORIES } from "@/lib/quizData";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;
  const now = new Date();
  const staticPaths = ["", "/topics", "/tools", "/cves", "/quizzes", "/glossary", "/learning-paths", "/about", "/contact", "/editorial-policy", "/privacy-policy", "/terms", "/cookie-policy", "/disclaimer"];
  const entries: MetadataRoute.Sitemap = staticPaths.map((p) => ({ url: `${base}${p}`, lastModified: now, changeFrequency: p === "" ? "daily" : "weekly", priority: p === "" ? 1 : 0.6 }));
  QUIZ_CATEGORIES.forEach((c) => entries.push({ url: `${base}/quizzes/${c.slug}`, lastModified: now, priority: 0.5 }));

  try {
    const [articles, topics, tools, cves] = await Promise.all([
      supabaseRead.from("articles").select("slug, published_at").eq("status", "published").limit(5000),
      supabaseRead.from("topics").select("slug"),
      supabaseRead.from("tools").select("slug"),
      supabaseRead.from("cves").select("slug, updated_date, published_date").limit(5000),
    ]);
    articles.data?.forEach((a) => entries.push({ url: `${base}/articles/${a.slug}`, lastModified: a.published_at ? new Date(a.published_at) : now, priority: 0.8 }));
    topics.data?.forEach((t) => entries.push({ url: `${base}/topics/${t.slug}`, lastModified: now, priority: 0.7 }));
    tools.data?.forEach((t) => entries.push({ url: `${base}/tools/${t.slug}`, lastModified: now, priority: 0.7 }));
    cves.data?.forEach((c) => entries.push({ url: `${base}/cves/${c.slug}`, lastModified: new Date(c.updated_date ?? c.published_date ?? now), priority: 0.6 }));
  } catch {
    /* database unreachable: still serve the static part of the sitemap */
  }
  return entries;
}
