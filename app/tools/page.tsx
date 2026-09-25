import ToolCard from "@/components/ToolCard";
import { getTools } from "@/lib/db/tools";

export const dynamic = "force-dynamic"; // content changes as tools are added via /admin/tools

export default async function ToolsIndex() {
  const tools = await getTools();

  const byCategory = tools.reduce<Record<string, typeof tools>>((acc, tool) => {
    (acc[tool.category] ??= []).push(tool);
    return acc;
  }, {});

  return (
    <div>
      <h1 className="text-3xl mb-2">Tools Directory</h1>
      <p className="text-ink-soft mb-8">
        Penetration testing and security tools, with setup notes and defensive-use guidance.
      </p>

      {tools.length === 0 && (
        <p className="text-ink-soft">No tools published yet.</p>
      )}

      {Object.entries(byCategory).map(([category, categoryTools]) => (
        <div key={category} className="mb-10">
          <h2 className="font-mono text-sm uppercase tracking-wide text-ink-soft mb-2">{category}</h2>
          {categoryTools.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      ))}
    </div>
  );
}