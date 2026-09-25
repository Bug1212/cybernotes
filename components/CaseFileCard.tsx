import Link from "next/link";
import ClearanceBadge from "./ClearanceBadge";
import { Article } from "@/lib/types";

export default function CaseFileCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/articles/${article.slug}`}
      className="case-row px-2 -mx-2"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="case-number">{article.caseNumber}</span>
        <ClearanceBadge level={article.clearance} />
      </div>
      <h3 className="text-xl mb-1">{article.title}</h3>
      <p className="text-ink-soft line-clamp-2">{article.summary}</p>
    </Link>
  );
}