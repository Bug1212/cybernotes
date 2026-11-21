import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Contact — CyberNotes",
  description: "Report an error, send a security report, or get in touch with CyberNotes.",
};

const reasons = [
  { title: "Report an error", body: "Spotted something inaccurate or out of date? Tell us the page and what is wrong — we correct confirmed errors promptly." },
  { title: "Security report", body: "Found a vulnerability in this website? Please report it privately and give us reasonable time to fix it before disclosing." },
  { title: "Content requests", body: "Want a topic, tool, or CVE covered? Send us a suggestion." },
  { title: "Business & other", body: "Partnerships, takedown requests, privacy requests, or anything else." },
];

export default function Contact() {
  return (
    <article className="max-w-2xl">
      <p className="case-number mb-3">DOC: CONTACT</p>
      <h1 className="text-4xl leading-tight mb-4">Contact</h1>
      <p className="text-lg text-ink-soft mb-6">
        The best way to reach us is by email. We read everything and reply as soon as we can.
      </p>
      <div className="redaction-bar-thin" />

      <div className="border-2 border-ink p-6 my-6">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-2">Email</p>
        <a
          href={`mailto:${siteConfig.contactEmail}`}
          className="text-2xl underline break-all"
        >
          {siteConfig.contactEmail}
        </a>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        {reasons.map((r) => (
          <div key={r.title} className="border border-line bg-paper-dark p-5">
            <h2 className="text-lg mb-1">{r.title}</h2>
            <p className="text-sm text-ink-soft">{r.body}</p>
          </div>
        ))}
      </div>

      <p className="text-sm text-ink-soft">
        See also: <Link href="/privacy-policy" className="underline">Privacy Policy</Link> &middot;{" "}
        <Link href="/editorial-policy" className="underline">Editorial Policy</Link>
      </p>
    </article>
  );
}