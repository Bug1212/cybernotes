import { Clearance } from "@/lib/types";

const styles: Record<Clearance, string> = {
  PUBLIC: "text-moss border-moss",
  RESTRICTED: "text-clearance border-clearance",
  CLASSIFIED: "text-rust border-rust",
};

export default function ClearanceBadge({ level }: { level: Clearance }) {
  return (
    <span
      className={`font-mono text-xs tracking-wide px-2 py-1 border ${styles[level]}`}
    >
      {level}
    </span>
  );
}
