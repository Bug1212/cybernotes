import CaseFileCard from "@/components/CaseFileCard";
import { getPublishedArticles } from "@/lib/db/articles";

export const dynamic = "force-dynamic"; // content changes as articles are published via /admin/review

export default async function ArticlesIndex() {
  const articles = await getPublishedArticles();

  return (
    <div>
      <h1 className="text-3xl mb-2">All Case Files</h1>
      <p className="text-ink-soft mb-8">
        Every published article, most recent first.
      </p>

      {articles.length === 0 ? (
        <p className="text-ink-soft font-mono text-sm">No case files published yet.</p>
      ) : (
        articles.map((a) => <CaseFileCard key={a.slug} article={a} />)
      )}
    </div>
  );
}