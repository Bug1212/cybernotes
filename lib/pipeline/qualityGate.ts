// Automated checks an AI draft must pass before it can be auto-published.
// Anything that fails is NOT published: it goes to the admin review queue with the reasons.

export interface GateInput {
  title: string;
  summary: string | null;
  body: string;
  primary_sources: unknown[] | null;
}

const STOP = new Set("the a an of to in and or for on with from by at is are was were be this that how what why into your you it its as about".split(" "));
const words = (t: string) => new Set(t.toLowerCase().replace(/[^a-z0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w)));

export function titleSimilarity(a: string, b: string): number {
  const A = words(a), B = words(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  A.forEach((w) => B.has(w) && inter++);
  return inter / (A.size + B.size - inter); // Jaccard
}

export function checkArticleQuality(a: GateInput, existingTitles: string[]): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const body = a.body.trim();
  const wordCount = body.split(/\s+/).length;
  const sections = (body.match(/^##\s+\S/gm) ?? []).length;

  if (wordCount < 400) reasons.push(`too short (${wordCount} words, need 400+)`);
  if (wordCount > 1800) reasons.push(`too long (${wordCount} words)`);
  if (sections < 3) reasons.push(`only ${sections} "##" sections (need 3+)`);
  if (!/detect|mitigat|defen[cs]e|prevent|protect|harden|patch/i.test(body)) reasons.push("no defensive guidance (detection/mitigation/prevention)");
  if (a.title.length < 15 || a.title.length > 140) reasons.push("title length out of range");
  if (!a.summary || a.summary.length < 40) reasons.push("missing or too-short summary");
  if (!a.primary_sources || a.primary_sources.length === 0) reasons.push("no primary source attribution");
  if (/lorem ipsum|\[insert|\bTODO\b|as an ai (language )?model|i (cannot|can't) (provide|assist|help)/i.test(body)) reasons.push("contains placeholder or AI-refusal text");
  if (!/[.!?)"'`*\]]$/.test(body) || /^#{1,6}\s.*$/.test(body.split("\n").pop() ?? "")) reasons.push("ends abruptly (looks incomplete)");

  const dup = existingTitles.find((t) => titleSimilarity(a.title, t) >= 0.6);
  if (dup) reasons.push(`near-duplicate of existing article "${dup}"`);

  return { ok: reasons.length === 0, reasons };
}
