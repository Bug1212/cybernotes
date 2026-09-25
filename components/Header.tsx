import Link from "next/link";

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
      <div className="max-w-4xl mx-auto px-6 py-6 flex items-baseline justify-between">
        <Link href="/" className="text-2xl font-semibold">
          CyberNotes
        </Link>
        <nav className="flex gap-1">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="folder-tab">
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}