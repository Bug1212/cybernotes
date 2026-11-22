import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import NavLinks from "./NavLinks";

const nav = [
  { href: "/learning-paths", label: "Learning Paths" },
  { href: "/topics", label: "Topics" },
  { href: "/tools", label: "Tools" },
  { href: "/cves", label: "CVEs" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/glossary", label: "Glossary" },
];

// Two rows on every page: [logo ............ theme switch] then [nav tabs].
// One layout at every width, so the logo never jumps around or wraps oddly.
export default function Header() {
  return (
    <header className="border-b-2 border-ink">
      <div className="max-w-4xl mx-auto px-6 pt-5 cn-header-inner">
        <div className="flex items-center justify-between gap-4 mb-4">
          <Link href="/" className="inline-flex items-center gap-2.5 text-2xl font-semibold leading-none">
            <span className="cn-logo-mark cn-only-colorful" aria-hidden="true">🛡</span>
            CyberNotes
          </Link>
          <ThemeToggle />
        </div>
        <NavLinks items={nav} />
      </div>
    </header>
  );
}
