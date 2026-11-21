import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import NavLinks from "../components/NavLinks";

const nav = [
  { href: "/learning-paths", label: "Learning Paths" },
  { href: "/topics", label: "Topics" },
  { href: "/tools", label: "Tools" },
  { href: "/cves", label: "CVEs" },
  { href: "/quizzes", label: "Quizzes" },
  { href: "/glossary", label: "Glossary" },
];

export default function Header() {
  return (
    <header className="border-b-2 border-ink">
      <div className="max-w-4xl mx-auto px-6 py-6 flex flex-wrap items-baseline justify-between gap-y-3">
        <Link href="/" className="text-2xl font-semibold inline-flex items-center gap-2.5">
          <span className="cn-logo-mark cn-only-colorful" aria-hidden="true">🛡</span>
          CyberNotes
        </Link>
        <div className="ml-auto flex flex-wrap items-center gap-4">
          <NavLinks items={nav} />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}