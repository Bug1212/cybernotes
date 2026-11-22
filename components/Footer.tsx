import Link from "next/link";

const columns = [
  {
    title: "Learn",
    links: [
      { href: "/topics", label: "Topics" },
      { href: "/tools", label: "Tools" },
      { href: "/cves", label: "CVEs" },
      { href: "/glossary", label: "Glossary" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
      { href: "/editorial-policy", label: "Editorial Policy" },
      { href: "/feed.xml", label: "RSS Feed" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy-policy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms & Conditions" },
      { href: "/cookie-policy", label: "Cookie Policy" },
      { href: "/disclaimer", label: "Disclaimer" },
      { href: "https://www.youtube.com/t/terms", label: "YouTube Terms of Service" },
      { href: "http://www.google.com/policies/privacy", label: "Google Privacy Policy" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink mt-24">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          <div className="col-span-2 sm:col-span-1">
            <p className="text-lg font-semibold mb-2">CyberNotes</p>
            <p className="font-mono text-xs text-ink-soft">
              Cybersecurity, plainly explained.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">
                {col.title}
              </p>
              <ul className="space-y-2 text-sm">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.href.startsWith("http") ? (
                      <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:underline">
                        {l.label}
                      </a>
                    ) : (
                      <Link href={l.href} className="hover:underline">
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-line mt-8 pt-4 font-mono text-xs text-ink-soft">
          &copy; {new Date().getFullYear()} CyberNotes. Educational content only &mdash; see our{" "}
          <Link href="/disclaimer" className="underline">
            disclaimer
          </Link>
          .
        </div>
      </div>
    </footer>
  );
}