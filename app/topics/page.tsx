import Link from "next/link";
import ClearanceBadge from "@/components/ClearanceBadge";
import { getTopics } from "@/lib/db/topics";

export const dynamic = "force-dynamic"; // renders per-request; content changes daily via the pipeline, so build-time prerendering isn't useful here

export default async function TopicsIndex() {
  const topics = await getTopics();

  return (
    <div>
      <h1 className="text-3xl mb-8">Topic Hubs</h1>
      {topics.map((t) => (
        <Link
          key={t.slug}
          href={`/topics/${t.slug}`}
          className="block border-t border-line py-6 first:border-t-0"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl">{t.title}</h2>
            <ClearanceBadge level={t.clearance} />
          </div>
          <p className="text-ink-soft line-clamp-2">{t.description}</p>
        </Link>
      ))}
    </div>
  );
}