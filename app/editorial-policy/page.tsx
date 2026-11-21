import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Editorial Policy — CyberNotes",
  description: "How CyberNotes researches, writes, fact-checks, reviews, and corrects its content.",
};

export default function EditorialPolicy() {
  return (
    <LegalPage docId="EDITORIAL" title="Editorial Policy">
      <p>
        {siteConfig.name} exists to explain cybersecurity clearly and accurately. This page describes
        how our content is produced, so you know what to trust and how to challenge it.
      </p>

      <h2>1. What we publish</h2>
      <p>
        Plain-language explainers on security topics, guides to security tools, explanations of
        known vulnerabilities (CVEs), and a glossary. Our focus is understanding and defence, not
        attack.
      </p>

      <h2>2. How articles are produced</h2>
      <p>
        Some articles are written by hand. Others are drafted with the help of AI language models,
        using published security news, advisories, and research as source material. AI is a drafting
        tool, not an author: it does not decide what gets published.
      </p>
      <ul>
        <li>
          <strong>Original analysis, not rewrites.</strong> We use sources as research, and add our own
          structure, context, and explanation. We do not republish or closely paraphrase another
          publisher&rsquo;s article.
        </li>
        <li>
          <strong>Automated fact-check.</strong> Each AI draft is compared against its source material,
          and any claim the source does not support is flagged.
        </li>
        <li>
          <strong>Human review before publishing.</strong> A person reviews every AI-assisted article
          before it goes live. Drafts with flagged claims are held back until the issues are fixed or
          the draft is rejected.
        </li>
        <li>
          <strong>Attribution.</strong> AI-assisted articles link to their primary sources.
        </li>
      </ul>

      <h2>3. Sources</h2>
      <p>
        We prefer primary and authoritative sources: vendor advisories, CERT/CSIRT bulletins, vulnerability
        databases, and reputable security publications and research blogs. We cite them where we rely
        on them.
      </p>

      <h2>4. Responsible disclosure and safety</h2>
      <p>
        We do not publish working exploit code or step-by-step attack instructions. For actively
        exploited vulnerabilities we focus on detection and mitigation. Educational explanations are
        kept distinct from anything that would help carry out an attack.
      </p>

      <h2>5. Independence and advertising</h2>
      <p>
        Advertising, if shown, is separate from editorial decisions. We do not accept payment to
        change what we write, and any sponsored content would be clearly labelled.
      </p>

      <h2>6. Corrections</h2>
      <p>
        If you find an error, email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a> with the page and
        what is wrong. We investigate, correct confirmed errors promptly, and for significant
        corrections we note the change on the page.
      </p>

      <h2>7. Authors</h2>
      <p>
        Content is published by the {siteConfig.ownerName}. See our <a href="/about">About page</a> for
        more about who we are.
      </p>
    </LegalPage>
  );
}