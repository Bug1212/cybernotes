import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Privacy Policy — CyberNotes",
  description: "What information CyberNotes collects, how it is used, and the choices you have.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage docId="PRIVACY" title="Privacy Policy">
      <p>
        This Privacy Policy explains what information {siteConfig.name} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;) collects when you visit {siteConfig.url}, how we use it, and the choices
        you have. We keep data collection to a minimum: there are no user accounts, and you do not
        need to give us any personal information to read the site.
      </p>

      <h2>1. Information we collect</h2>
      <h3>Collected automatically</h3>
      <p>
        When you load a page, our hosting infrastructure records standard technical information such
        as your IP address, browser and device type, the page requested, the referring page, and the
        date and time. This is used to deliver the site, keep it secure, and diagnose problems.
      </p>
      <h3>Information you choose to send us</h3>
      <p>
        If you email us (for example to report an error or ask a question), we receive your email
        address and whatever you include in the message. We use it only to respond.
      </p>

      <h2>2. How we use information</h2>
      <ul>
        <li>To operate, secure, and troubleshoot the website.</li>
        <li>To understand, in aggregate, which content is useful so we can improve it.</li>
        <li>To respond to messages, corrections, and security reports.</li>
        <li>To show advertising, if and when advertising is enabled (see section 4).</li>
        <li>To comply with legal obligations.</li>
      </ul>
      <p>We do not sell your personal information.</p>

      <h2>3. Cookies</h2>
      <p>
        We use cookies and similar technologies as described in our{" "}
        <a href="/cookie-policy">Cookie Policy</a>.
      </p>

      <h2>4. Third-party services and advertising</h2>
      <p>
        We rely on third-party providers to run the site, currently including a hosting provider
        (Vercel) and a database provider (Supabase). These providers process data on our behalf
        under their own privacy terms.
      </p>
      <p>
        We may display ads served by Google AdSense or similar networks. Third-party vendors,
        including Google, use cookies to serve ads based on a user&rsquo;s prior visits to this and
        other websites. Google&rsquo;s use of advertising cookies enables it and its partners to
        serve ads to you based on your visit to our site and/or other sites on the internet. You may
        opt out of personalised advertising by visiting{" "}
        <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">
          Google Ads Settings
        </a>
        . You can learn more about how Google uses data at{" "}
        <a
          href="https://policies.google.com/technologies/partner-sites"
          target="_blank"
          rel="noreferrer"
        >
          policies.google.com/technologies/partner-sites
        </a>
        . Where required by law, we will ask for your consent before setting advertising cookies.
      </p>

      <h2>5. Data retention</h2>
      <p>
        Server logs are kept only as long as needed for security and operations, then deleted or
        anonymised. Emails you send us are kept as long as needed to handle your request.
      </p>

      <h2>6. Your rights</h2>
      <p>
        Depending on where you live (for example under the GDPR, UK GDPR, CCPA/CPRA, or India&rsquo;s
        Digital Personal Data Protection Act, 2023), you may have the right to access, correct,
        delete, or restrict the use of your personal data, to object to certain processing, and to
        withdraw consent. To exercise any of these rights, email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. We will respond
        within a reasonable time and as required by applicable law.
      </p>

      <h2>7. Children</h2>
      <p>
        {siteConfig.name} is not directed to children under 13 and we do not knowingly collect
        personal information from them. If you believe a child has sent us personal information,
        contact us and we will delete it.
      </p>

      <h2>8. Security</h2>
      <p>
        We use reasonable technical measures to protect the site and the data we hold. No system is
        perfectly secure, so we cannot guarantee absolute security.
      </p>

      <h2>9. External links</h2>
      <p>
        Our content links to third-party websites (vendor documentation, advisories, research). We
        are not responsible for their privacy practices; please review their policies.
      </p>

      <h2>10. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;Last updated&rdquo; date above shows
        when it last changed.
      </p>

      <h2>11. Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
    </LegalPage>
  );
}