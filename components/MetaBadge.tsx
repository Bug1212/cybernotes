const TONES = {
  neutral: "border-line text-ink-soft",
  rust: "border-rust text-rust",
  moss: "border-moss text-moss",
  clearance: "border-clearance text-clearance",
} as const;

export default function MetaBadge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: keyof typeof TONES;
}) {
  return (
    <span
      className={`inline-block font-mono text-xs uppercase tracking-wide px-2 py-1 border rounded ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}