import { supabaseRead } from "@/lib/supabaseRead";
import { siteConfig } from "@/lib/siteConfig";

export const dynamic = "force-dynamic";

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// RSS 2.0 feed of the latest published articles — gives readers a way to follow the site.
export async function GET() {
  let items = "";
  try {
    const { data } = await supabaseRead
      .from("articles")
      .select("slug, title, summary, published_at")
      .eq("status", "published")
      .order("published_at", { ascending: false })
      .limit(30);
    items = (data ?? [])
      .map((a) => `<item><title>${esc(a.title)}</title><link>${siteConfig.url}/articles/${a.slug}</link><guid>${siteConfig.url}/articles/${a.slug}</guid><pubDate>${new Date(a.published_at ?? Date.now()).toUTCString()}</pubDate><description>${esc(a.summary ?? "")}</description></item>`)
      .join("");
  } catch {
    /* serve an empty feed rather than an error */
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>${esc(siteConfig.name)}</title><link>${siteConfig.url}</link><description>Cybersecurity, plainly explained.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}