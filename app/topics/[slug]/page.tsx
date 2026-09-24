import { notFound } from "next/navigation";
import ClearanceBadge from "@/components/ClearanceBadge";
import CaseFileCard from "@/components/CaseFileCard";
import { getTopicBySlug } from "@/lib/db/topics";
import { getArticlesByTopic } from "@/lib/db/articles";

export const dynamic = "force-dynamic"; // renders per-request; content changes daily via the pipeline, so build-time prerendering isn't useful here

export default async function TopicPage({ params }: { params: { slug: string } }) {
  const topic = await getTopicBySlug(params.slug);
  if (!topic) notFound();

  const topicArticles = await getArticlesByTopic(topic.slug);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl">{topic.title}</h1>
        <ClearanceBadge level={topic.clearance} />
      </div>
      <p className="text-ink-soft mb-8 max-w-xl">{topic.description}</p>
      <div className="redaction-bar-thin" />
      {topicArticles.length > 0 ? (
        topicArticles.map((a) => <CaseFileCard key={a.slug} article={a} />)
      ) : (
        <p className="text-ink-soft font-mono text-sm">
          No case files filed under this topic yet.
        </p>
      )}
    </div>
  );
}