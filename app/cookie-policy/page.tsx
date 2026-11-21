import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { siteConfig } from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "Cookie Policy — CyberNotes",
  description: "How CyberNotes uses cookies and similar technologies.",
};

export default function CookiePolicy() {
  return (
    <LegalPage docId="COOKIES" title="Cookie Policy">
      <p>
        This policy explains how {siteConfig.name} uses cookies and similar technologies. For how we
        handle personal data more broadly, see our <a href="/privacy-policy">Privacy Policy</a>.
      </p>

      <h2>1. What are cookies?</h2>
      <p>
        Cookies are small text files stored on your device when you visit a website. They let a site
        remember information, and are also used by advertising and analytics services.
      </p>

      <h2>2. Cookies we use</h2>
      <h3>Strictly necessary</h3>
      <p>
        The public site does not require you to log in and does not set tracking or advertising
        cookies of its own at the time of the last update above. Our hosting infrastructure may use
        technical cookies or similar mechanisms strictly needed to deliver pages securely.
      </p>
      <h3>Advertising (when enabled)</h3>
      <p>
        If we enable advertising, third-party vendors such as Google use cookies to serve and measure
        ads, including ads based on your previous visits to this and other sites. These are only
        set once ads are active and, where the law requires, after you give consent.
      </p>
      <h3>Analytics (if enabled)</h3>
      <p>
        If we add privacy-respecting analytics in future, we will describe the provider and cookies
        used here.
      </p>

      <h2>3. Managing cookies</h2>
      <ul>
        <li>
          Use your browser settings to block or delete cookies (see your browser&rsquo;s help pages).
          Blocking some cookies may affect how parts of the web work.
        </li>
        <li>
          Opt out of personalised Google ads at{" "}
          <a href="https://adssettings.google.com" target="_blank" rel="noreferrer">
            adssettings.google.com
          </a>
          , or via{" "}
          <a href="https://www.aboutads.info" target="_blank" rel="noreferrer">
            aboutads.info
          </a>
          .
        </li>
      </ul>

      <h2>4. Changes</h2>
      <p>We will update this page if our use of cookies changes. Check the date at the top.</p>

      <h2>5. Contact</h2>
      <p>
        <a href={`mailto:${siteConfig.contactEmail}`}>{siteConfig.contactEmail}</a>
      </p>
    </LegalPage>
  );
}