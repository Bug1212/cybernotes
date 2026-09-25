import ReactMarkdown from "react-markdown";

export default function InfoCard({
  label,
  accent = "line",
  children,
}: {
  label: string;
  accent?: "line" | "rust" | "moss" | "clearance";
  children: string;
}) {
  const accentColor = {
    line: "border-l-line",
    rust: "border-l-rust",
    moss: "border-l-moss",
    clearance: "border-l-clearance",
  }[accent];

  return (
    <section className={`mb-5 border-l-4 ${accentColor} bg-paper-dark rounded-r pl-5 pr-4 py-4`}>
      <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">{label}</h2>
      <div className="prose-content text-sm">
        <ReactMarkdown>{children}</ReactMarkdown>
      </div>
    </section>
  );
}