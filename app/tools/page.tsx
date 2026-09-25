import Link from "next/link";
import { getTools } from "@/lib/db/tools";

export const dynamic = "force-dynamic";

export default async function ToolsIndex() {
  const tools = await getTools();
  const byCategory = new Map<string, typeof tools>();
  for (const t of tools) {
    if (!byCategory.has(t.category)) byCategory.set(t.category, []);
    byCategory.get(t.category)!.push(t);
  }

  return (
    <div>
      <h1 className="text-3xl mb-2">Tools Directory</h1>
      <p className="text-ink-soft mb-8 max-w-xl">
        Reconnaissance, vulnerability scanning, pentesting, forensics, and everything else a
        working security practitioner actually reaches for.
      </p>
      {tools.length === 0 && (
        <p className="text-ink-soft font-mono text-sm">No tools added yet.</p>
      )}
      {Array.from(byCategory.entries()).map(([category, categoryTools]) => (
        <section key={category} className="mb-10">
          <h2 className="text-xl mb-4">{category}</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {categoryTools.map((t) => (
              <Link key={t.slug} href={`/tools/${t.slug}`} className="hub-card">
                <h3 className="text-lg mb-1">{t.name}</h3>
                {/* line-clamp-3 caps any card at 3 lines regardless of how long the
                    description is — a long/unstructured entry can no longer blow
                    out the grid layout the way it did before. */}
                <p className="text-sm text-ink-soft line-clamp-3">{t.description}</p>
                {t.supportedOs.length > 0 && (
                  <p className="mt-2 font-mono text-xs text-ink-soft">{t.supportedOs.join(" · ")}</p>
                )}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}