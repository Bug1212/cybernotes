"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin/review", label: "Articles" },
  { href: "/admin/tools", label: "Tools" },
  { href: "/admin/cves", label: "CVEs / CWE" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-6 flex gap-1">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className={`folder-tab ${pathname?.startsWith(l.href) ? "bg-ink text-paper border-ink" : ""}`}
        >
          {l.label}
        </Link>
      ))}
    </nav>
  );
}