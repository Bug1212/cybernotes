import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig, youtubeConfig, YOUTUBE_TOS_URL, GOOGLE_PRIVACY_URL } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Terms & Conditions — CyberNotes",
  description: "The terms that apply when you use CyberNotes.",
};

export default function Terms() {
  return (
    <LegalPage docId="TERMS" title="Terms & Conditions">
      <p>
        By accessing or using {siteConfig.name} at {siteConfig.url} (the &ldquo;Site&rdquo;), you
        agree to these Terms. If you do not agree, please do not use the Site.
      </p>

      <h2>1. Educational purpose</h2>
      <p>
        The Site provides cybersecurity education and information: articles, tool guides,
        vulnerability (CVE) explanations, and glossary entries. It is intended to help people learn
        to understand and defend systems.
      </p>

      <h2>2. Authorized and lawful use only</h2>
      <p>
        Security tools and techniques described on the Site must only be used on systems you own or
        have explicit, written permission to test. Unauthorized access to computer systems is illegal
        in most jurisdictions. You are solely responsible for how you use any information on the
        Site, and for complying with all applicable laws.
      </p>

      <h2>3. Acceptable use</h2>
      <p>You agree not to:</p>
      <ul>
        <li>use the Site or its content to attack, disrupt, or gain unauthorized access to any system;</li>
        <li>attempt to probe, scan, or test the vulnerability of the Site itself without our written permission;</li>
        <li>scrape or copy the Site at a volume or in a manner that burdens our infrastructure;</li>
        <li>republish our content wholesale without permission or attribution;</li>
        <li>use the Site in violation of any law or third-party right.</li>
      </ul>
      <p>
        If you find a security issue in the Site, please report it responsibly via our{" "}
        <a href="/contact">contact page</a>.
      </p>

      <h2>4. Intellectual property</h2>
      <p>
        Unless otherwise noted, the original text, design, and code of the Site are owned by{" "}
        {siteConfig.ownerName}. You may quote short excerpts with clear attribution and a link back.
        Third-party names, logos, and trademarks (including those of tools and vendors we discuss)
        belong to their respective owners and are used for identification only.
      </p>

      <h2>5. Accuracy of information</h2>
      <p>
        We work to keep content accurate (see our <a href="/editorial-policy">Editorial Policy</a>),
        but security information changes quickly and errors can occur. Content is provided for general
        information and may be incomplete or out of date. Always verify against official vendor
        advisories and documentation before acting.
      </p>

      <h2>6. Third-party links and advertising</h2>
      <p>
        The Site links to third-party websites and may display third-party advertising. We do not
        control and are not responsible for third-party content, products, or services, and a link or
        ad is not an endorsement.
      </p>

      <h2 id="youtube-api-services">7. YouTube API Services</h2>
      <p>
        Parts of {siteConfig.name}, including our video upload client ({youtubeConfig.apiClientName}), use YouTube
        API Services. By using these features you agree to be bound by the{" "}
        <a href={YOUTUBE_TOS_URL} target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a>{" "}
        ({YOUTUBE_TOS_URL}). Google&rsquo;s handling of your information is described in the{" "}
        <a href={GOOGLE_PRIVACY_URL} target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>, and ours
        in our <a href="/privacy-policy#youtube-api-services">Privacy Policy</a>. YouTube and the YouTube logo are
        trademarks of Google LLC; {siteConfig.name} is not affiliated with or endorsed by YouTube or Google.
      </p>

      <h2>8. Disclaimer of warranties</h2>
      <p>
        The Site and its content are provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
        without warranties of any kind, express or implied, including fitness for a particular
        purpose, accuracy, or non-infringement. See also our <a href="/disclaimer">Disclaimer</a>.
      </p>

      <h2>9. Limitation of liability</h2>
      <p>
        To the maximum extent permitted by law, {siteConfig.ownerName} will not be liable for any
        indirect, incidental, special, consequential, or punitive damages, or any loss of data,
        profits, or business, arising from your use of the Site or reliance on its content.
      </p>

      <h2>10. Changes to the Site and these Terms</h2>
      <p>
        We may modify or discontinue any part of the Site and may update these Terms at any time. The
        &ldquo;Last updated&rdquo; date shows the current version; continued use means you accept the
        changes.
      </p>

      <h2>11. Governing law</h2>
      <p>
        These Terms are governed by the laws of {siteConfig.jurisdiction}, without regard to conflict
        of law rules, and courts in {siteConfig.jurisdiction} have jurisdiction over disputes, subject
        to any mandatory consumer protections in your country.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about these Terms: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
    </LegalPage>
  );
}