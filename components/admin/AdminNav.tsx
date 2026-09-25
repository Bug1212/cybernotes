"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/review", label: "Article Queue" },
  { href: "/admin/topics", label: "Topics" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/cves", label: "CVEs" },
];

export default function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="mb-6 flex gap-2 border-b border-line pb-4">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`font-mono text-xs uppercase tracking-wide px-3 py-1.5 border ${
            pathname === l.href
              ? "border-ink bg-ink text-paper"
              : "border-line text-ink-soft hover:border-ink"
          }`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}