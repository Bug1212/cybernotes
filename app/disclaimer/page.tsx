import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Disclaimer — CyberNotes",
  description: "Important limits on how CyberNotes content should be used.",
};

export default function Disclaimer() {
  return (
    <LegalPage docId="DISCLAIMER" title="Disclaimer">
      <h2>Educational use only</h2>
      <p>
        Everything on {siteConfig.name} is published for education and defensive awareness. Nothing
        here is an invitation or instruction to access systems you do not own or have explicit
        permission to test. Doing so can be a crime. You are responsible for your own actions.
      </p>

      <h2>Not professional advice</h2>
      <p>
        Content is general information, not legal, compliance, or professional security advice. For
        decisions affecting your organisation, consult a qualified professional and your own
        security team.
      </p>

      <h2>Accuracy and timeliness</h2>
      <p>
        Vulnerability details, tool behaviour, and best practices change quickly. We aim to be
        accurate but make no guarantee that content is complete, current, or error-free. Always
        confirm against official vendor advisories, CVE/NVD records, and tool documentation before
        taking action. Spotted a mistake? Tell us via the <a href="/contact">contact page</a>.
      </p>

      <h2>AI-assisted content</h2>
      <p>
        Some articles are drafted with the help of AI tools and then reviewed before publication, as
        described in our <a href="/editorial-policy">Editorial Policy</a>. Such articles link to
        their primary sources so you can verify claims yourself.
      </p>

      <h2>Tools and third-party links</h2>
      <p>
        Mentions of tools, vendors, and external sites are not endorsements. We are not responsible
        for third-party software, content, or services, or for any damage from using them.
      </p>

      <h2>Advertising</h2>
      <p>
        If ads are shown, they are provided by third parties and do not influence our editorial
        decisions.
      </p>

      <h2>Limitation of liability</h2>
      <p>
        Use of this site is at your own risk. See our <a href="/terms">Terms &amp; Conditions</a> for
        the full limitation of liability.
      </p>
    </LegalPage>
  );
}