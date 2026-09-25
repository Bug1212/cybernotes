import Link from "next/link";
import { Tool } from "@/lib/types";

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link href={`/tools/${tool.slug}`} className="case-row px-2 -mx-2">
      <div className="flex items-center justify-between mb-2">
        <span className="case-number">{tool.category}</span>
        {tool.supportedOs.length > 0 && (
          <span className="font-mono text-xs text-ink-soft">{tool.supportedOs.join(", ")}</span>
        )}
      </div>
      <h3 className="text-xl mb-1">{tool.name}</h3>
      <p className="text-ink-soft">{tool.description}</p>
    </Link>
  );
}