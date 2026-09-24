import Link from "next/link";
import ClearanceBadge from "@/components/ClearanceBadge";

const paths = [
  {
    level: "PUBLIC" as const,
    title: "Start Here",
    description: "Networking basics and how the internet actually works.",
    topicSlug: "networking-fundamentals",
  },
  {
    level: "RESTRICTED" as const,
    title: "Break Things Safely",
    description: "Web security fundamentals — how common vulnerabilities work.",
    topicSlug: "web-security",
  },
  {
    level: "RESTRICTED" as const,
    title: "Find What's Public",
    description: "OSINT — what information is out there, and how it's found.",
    topicSlug: "osint",
  },
  {
    level: "CLASSIFIED" as const,
    title: "Use the Tools",
    description: "Hands-on with nmap, Burp Suite, Metasploit, and Wireshark.",
    topicSlug: "pentesting-tools",
  },
];

export default function LearningPaths() {
  return (
    <div>
      <h1 className="text-3xl mb-8">Learning Paths</h1>
      <div>
        {paths.map((p, i) => (
          <Link
            key={p.topicSlug}
            href={`/topics/${p.topicSlug}`}
            className="flex items-start gap-6 border-t border-line py-6 first:border-t-0"
          >
            <span className="case-number pt-1">{`0${i + 1}`}</span>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h2 className="text-xl">{p.title}</h2>
                <ClearanceBadge level={p.level} />
              </div>
              <p className="text-ink-soft">{p.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
