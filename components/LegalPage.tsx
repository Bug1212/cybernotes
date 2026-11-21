import { siteConfig } from "@/lib/siteConfig";

export default function LegalPage({
  docId,
  title,
  children,
}: {
  docId: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <article className="max-w-2xl">
      <p className="case-number mb-3">DOC: {docId}</p>
      <h1 className="text-4xl leading-tight mb-2">{title}</h1>
      <p className="font-mono text-xs text-ink-soft mb-6">
        Last updated: {siteConfig.lastUpdated}
      </p>
      <div className="redaction-bar-thin" />
      <div className="prose-content leading-relaxed">{children}</div>
    </article>
  );
}