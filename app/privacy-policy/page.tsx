import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig, youtubeConfig, YOUTUBE_TOS_URL, GOOGLE_PRIVACY_URL, GOOGLE_REVOKE_URL } from "@/lib/siteConfig";

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

      <h2 id="youtube-api-services">5. YouTube API Services</h2>
      <p>
        {siteConfig.name} uses YouTube API Services. Our API client, {youtubeConfig.apiClientName}, uses
        the YouTube Data API to upload videos to our own YouTube channel,{" "}
        <a href={youtubeConfig.channelUrl} target="_blank" rel="noopener noreferrer">
          {youtubeConfig.channelName}
        </a>
        . This section explains exactly what it does with data.
      </p>

      <h3>YouTube Terms of Service and Google Privacy Policy</h3>
      <p>
        By using features of {siteConfig.name} that use YouTube API Services, you agree to be bound by the{" "}
        <a href={YOUTUBE_TOS_URL} target="_blank" rel="noopener noreferrer">YouTube Terms of Service</a>. How
        Google handles your information is described in the{" "}
        <a href={GOOGLE_PRIVACY_URL} target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>{" "}
        ({GOOGLE_PRIVACY_URL}).
      </p>

      <h3>Information the API client accesses</h3>
      <p>
        {youtubeConfig.apiClientName} acts only on our own channel, with the channel owner&rsquo;s permission
        granted through Google OAuth. It requests only the following permission(s):
      </p>
      <ul>
        {youtubeConfig.scopes.map((sc) => (
          <li key={sc.scope}>
            <code>{sc.scope}</code> &mdash; {sc.purpose}
          </li>
        ))}
      </ul>
      <p>
        It does not access, collect or store information about viewers, subscribers or other YouTube users,
        and it never asks for your YouTube login credentials.
      </p>

      <h3>Information we store and how we use it</h3>
      <ul>
        <li>OAuth access and refresh tokens, kept securely and used only by the API client to upload to our channel.</li>
        <li>Details of the videos we upload (title, description, tags, video ID and upload status), used to manage our own uploads.</li>
      </ul>
      <p>
        We do not sell, rent or share YouTube API data or Authorized Data with third parties, and we do not use
        it for advertising or profiling.
      </p>

      <h3>Retention and deletion</h3>
      <p>
        We do not store YouTube API data indefinitely. If you ask us to delete data we hold, or if we are unable
        to verify authorization for data we hold, we will delete it within 30 days (usually much sooner). To make a
        request, email <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>

      <h3>Revoking access</h3>
      <p>
        In addition to our normal procedure for deleting stored data, you can revoke {youtubeConfig.apiClientName}&rsquo;s
        access to your data at any time through the Google security settings page:{" "}
        <a href={GOOGLE_REVOKE_URL} target="_blank" rel="noopener noreferrer">{GOOGLE_REVOKE_URL}</a>. When access
        is revoked we stop using it and delete the stored tokens.
      </p>

      <h3>Questions or complaints</h3>
      <p>
        If you have questions or complaints about our privacy practices relating to YouTube API Services, contact
        us at <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>.
      </p>

      <h3>Embedded YouTube videos</h3>
      <p>
        Our pages may embed videos from YouTube. When you load or play an embedded player, YouTube (Google) may
        collect data and set cookies as described in the Google Privacy Policy and our{" "}
        <a href="/cookie-policy">Cookie Policy</a>.
      </p>

      <h2>6. Data retention</h2>
      <p>
        Server logs are kept only as long as needed for security and operations, then deleted or
        anonymised. Emails you send us are kept as long as needed to handle your request.
      </p>

      <h2>7. Your rights</h2>
      <p>
        Depending on where you live (for example under the GDPR, UK GDPR, CCPA/CPRA, or India&rsquo;s
        Digital Personal Data Protection Act, 2023), you may have the right to access, correct,
        delete, or restrict the use of your personal data, to object to certain processing, and to
        withdraw consent. To exercise any of these rights, email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>. We will respond
        within a reasonable time and as required by applicable law.
      </p>

      <h2>8. Children</h2>
      <p>
        {siteConfig.name} is not directed to children under 13 and we do not knowingly collect
        personal information from them. If you believe a child has sent us personal information,
        contact us and we will delete it.
      </p>

      <h2>9. Security</h2>
      <p>
        We use reasonable technical measures to protect the site and the data we hold. No system is
        perfectly secure, so we cannot guarantee absolute security.
      </p>

      <h2>10. External links</h2>
      <p>
        Our content links to third-party websites (vendor documentation, advisories, research). We
        are not responsible for their privacy practices; please review their policies.
      </p>

      <h2>11. Changes to this policy</h2>
      <p>
        We may update this policy from time to time. The &ldquo;Last updated&rdquo; date above shows
        when it last changed.
      </p>

      <h2>12. Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
    </LegalPage>
  );
}