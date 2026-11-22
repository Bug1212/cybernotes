"use client";

import { useMemo, useState } from "react";
import type { GlossaryTerm } from "@/lib/glossaryData";

const LEVELS = ["Beginner", "Intermediate", "Advanced"] as const;
const levelTone: Record<string, string> = {
  Beginner: "text-moss border-moss",
  Intermediate: "text-clearance border-clearance",
  Advanced: "text-rust border-rust",
};

export default function GlossaryClient({ terms, categories }: { terms: GlossaryTerm[]; categories: string[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");
  const [level, setLevel] = useState<string>("All");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return terms.filter(
      (t) =>
        (category === "All" || t.category === category) &&
        (level === "All" || t.level === level) &&
        (!q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q) || t.example.toLowerCase().includes(q))
    );
  }, [terms, query, category, level]);

  const chip = (active: boolean) =>
    `font-mono text-xs px-3 py-1.5 border rounded-full transition-colors ${active ? "bg-ink text-paper border-ink" : "border-line text-ink-soft hover:border-ink"}`;

  return (
    <div>
      <label htmlFor="glossary-search" className="sr-only">Search glossary</label>
      <input
        id="glossary-search"
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search terms, e.g. phishing, TLS, hash…"
        className="w-full rounded border border-line bg-paper-dark px-4 py-3 text-sm mb-4"
      />

      <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Filter by category">
        {["All", ...categories].map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={chip(category === c)} aria-pressed={category === c}>{c}</button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-6" role="group" aria-label="Filter by level">
        {["All", ...LEVELS].map((l) => (
          <button key={l} onClick={() => setLevel(l)} className={chip(level === l)} aria-pressed={level === l}>{l}</button>
        ))}
      </div>

      <p className="font-mono text-xs text-ink-soft mb-2" aria-live="polite">
        {filtered.length} {filtered.length === 1 ? "term" : "terms"}
      </p>

      <div>
        {filtered.map((t) => (
          <article key={t.term} className="border-t border-line py-5">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h2 className="text-xl">{t.term}</h2>
              <span className={`font-mono text-[11px] uppercase px-2 py-0.5 border rounded ${levelTone[t.level]}`}>{t.level}</span>
              <span className="font-mono text-[11px] uppercase text-ink-soft">{t.category}</span>
            </div>
            <p className="text-ink-soft mb-2">{t.definition}</p>
            <p className="text-sm"><span className="font-mono text-xs uppercase text-ink-soft">Example: </span>{t.example}</p>
          </article>
        ))}
        {filtered.length === 0 && (
          <p className="text-ink-soft border-t border-line py-6">No terms match. Try a different search or clear the filters.</p>
        )}
      </div>
    </div>
  );
}
