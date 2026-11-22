import { Clearance } from "@/lib/types";

const styles: Record<Clearance, string> = {
  PUBLIC: "text-moss border-moss",
  RESTRICTED: "text-clearance border-clearance",
  CLASSIFIED: "text-rust border-rust",
};

// Each clearance tier doubles as a difficulty level, so the badge says both.
const levelName: Record<Clearance, string> = {
  PUBLIC: "Beginner",
  RESTRICTED: "Intermediate",
  CLASSIFIED: "Advanced",
};

export default function ClearanceBadge({ level }: { level: Clearance }) {
  return (
    <span
      className={`font-mono text-xs tracking-wide px-2 py-1 border ${styles[level]}`}
      title={`${level} clearance — ${levelName[level]} level`}
    >
      {level} · {levelName[level]}
    </span>
  );
}
