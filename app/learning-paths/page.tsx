import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Learning Paths — CyberNotes",
  description: "Step-by-step cybersecurity learning paths: foundations, web security, ethical hacking and blue team basics.",
};

const PATHS = [
  {
    title: "Security Foundations",
    level: "Beginner",
    blurb: "New to security? Start here: the vocabulary, how networks work, and your first quizzes.",
    steps: [
      { label: "Learn the vocabulary", href: "/glossary", kind: "Glossary" },
      { label: "Networking Fundamentals", href: "/topics/networking-fundamentals", kind: "Topic" },
      { label: "How DNS Actually Works", href: "/articles/how-dns-actually-works", kind: "Article" },
      { label: "Networking quiz", href: "/quizzes/networking", kind: "Quiz" },
      { label: "Linux quiz", href: "/quizzes/linux", kind: "Quiz" },
    ],
  },
  {
    title: "Web Application Security",
    level: "Intermediate",
    blurb: "How web apps get attacked, how to test your own, and how to fix what you find.",
    steps: [
      { label: "Web Security hub", href: "/topics/web-security", kind: "Topic" },
      { label: "What Is SQL Injection?", href: "/articles/what-is-sql-injection", kind: "Article" },
      { label: "OWASP Top 10 quiz", href: "/quizzes/owasp", kind: "Quiz" },
      { label: "Burp Suite", href: "/tools/burp-suite", kind: "Tool" },
      { label: "OWASP ZAP", href: "/tools/owasp-zap", kind: "Tool" },
    ],
  },
  {
    title: "Ethical Hacking & Pentesting",
    level: "Intermediate → Advanced",
    blurb: "The mindset, the methodology and the core tools — always with permission.",
    steps: [
      { label: "Ethical hacking quiz", href: "/quizzes/ethical-hacking", kind: "Quiz" },
      { label: "Reconnaissance with Nmap", href: "/tools/nmap", kind: "Tool" },
      { label: "Read traffic with Wireshark", href: "/tools/wireshark", kind: "Tool" },
      { label: "Pentesting Tools hub", href: "/topics/pentesting-tools", kind: "Topic" },
      { label: "Penetration testing quiz", href: "/quizzes/penetration-testing", kind: "Quiz" },
    ],
  },
  {
    title: "Blue Team & SOC Basics",
    level: "Intermediate",
    blurb: "Detect, prioritise and respond: track exploited vulnerabilities and watch the wire.",
    steps: [
      { label: "SOC vocabulary: SIEM, EDR, IOC", href: "/glossary", kind: "Glossary" },
      { label: "Track exploited vulnerabilities", href: "/cves", kind: "CVEs" },
      { label: "Wireshark display filters", href: "/tools/wireshark", kind: "Tool" },
      { label: "Scan containers with Trivy", href: "/tools/trivy", kind: "Tool" },
      { label: "Cryptography quiz", href: "/quizzes/cryptography", kind: "Quiz" },
    ],
  },
];

export default function LearningPaths() {
  return (
    <div>
      <h1 className="text-3xl mb-2">Learning Paths</h1>
      <p className="text-ink-soft mb-8 max-w-xl">
        Pick a path and follow it in order. Each step is a real page on this site — read, practise,
        then check yourself with the quiz.
      </p>
      <div className="space-y-8">
        {PATHS.map((p) => (
          <section key={p.title} className="border border-line bg-paper-dark rounded p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2 mb-1">
              <h2 className="text-2xl">{p.title}</h2>
              <span className="font-mono text-xs uppercase tracking-wide text-clearance">{p.level}</span>
            </div>
            <p className="text-ink-soft mb-5">{p.blurb}</p>
            <ol className="space-y-2">
              {p.steps.map((s, i) => (
                <li key={s.label}>
                  <Link href={s.href} className="flex items-center gap-3 border border-line bg-paper rounded px-4 py-3 hover:border-ink transition-colors">
                    <span className="font-mono text-xs w-6 h-6 rounded-full bg-ink text-paper grid place-items-center shrink-0">{i + 1}</span>
                    <span className="flex-1">{s.label}</span>
                    <span className="font-mono text-[11px] uppercase text-ink-soft">{s.kind}</span>
                  </Link>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
}
