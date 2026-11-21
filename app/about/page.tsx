import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "About — CyberNotes",
  description: "What CyberNotes is, who it is for, and how it works.",
};

const pillars = [
  { title: "Learn", body: "Plain-language topic hubs that take you from the basics to advanced material, tiered PUBLIC, RESTRICTED, and CLASSIFIED." },
  { title: "Tools", body: "A directory of security tools with install steps, basic usage, and authorized-use notes." },
  { title: "CVEs", body: "Known vulnerabilities explained: who is affected, how defenders detect them, and how to fix them." },
  { title: "News & analysis", body: "Original explainers on current security events, with links to primary sources." },
];

export default function About() {
  return (
    <article className="max-w-2xl">
      <p className="case-number mb-3">DOC: ABOUT</p>
      <h1 className="text-4xl leading-tight mb-6">About {siteConfig.name}</h1>
      <div className="redaction-bar-thin" />

      <div className="prose-content leading-relaxed">
        <p>
          {siteConfig.name} is a cybersecurity knowledge platform built around one idea: security should
          be understandable. Every topic is written as a numbered &ldquo;case file&rdquo; that starts
          from first principles and builds up, so a student can go from &ldquo;What is SQL
          injection?&rdquo; to &ldquo;How do I defend against it?&rdquo; without hitting a wall of
          jargon.
        </p>

        <h2>Who it is for</h2>
        <p>
          Students, developers, IT and security professionals, and anyone curious about how attacks and
          defences actually work.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 my-8">
        {pillars.map((p) => (
          <div key={p.title} className="border border-line bg-paper-dark p-5">
            <h3 className="text-lg mb-1">{p.title}</h3>
            <p className="text-sm text-ink-soft">{p.body}</p>
          </div>
        ))}
      </div>

      <div className="prose-content leading-relaxed">
        <h2>How content is made</h2>
        <p>
          Some articles are written by hand and some are drafted with AI assistance from published
          security sources, then fact-checked and reviewed by a person before publishing. We link to
          primary sources and correct mistakes. Read the full details in our{" "}
          <Link href="/editorial-policy">Editorial Policy</Link>.
        </p>

        <h2>Our promise</h2>
        <p>
          Education and defence first. We do not publish working exploits, and we keep explanations
          clearly separate from attack instructions. See our <Link href="/disclaimer">Disclaimer</Link>.
        </p>

        <h2>Get in touch</h2>
        <p>
          Found an error or have a suggestion? <Link href="/contact">Contact us</Link>.
        </p>
      </div>
    </article>
  );
}