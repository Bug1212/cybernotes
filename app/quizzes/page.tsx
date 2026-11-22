import Link from "next/link";
import type { Metadata } from "next";
import { QUIZ_CATEGORIES } from "@/lib/quizData";

export const metadata: Metadata = {
  title: "Quizzes — CyberNotes",
  description: "Test yourself on networking, Linux, ethical hacking, OWASP, cryptography and penetration testing.",
};

export default function QuizzesIndex() {
  return (
    <div>
      <h1 className="text-3xl mb-2">Quick Quizzes</h1>
      <p className="text-ink-soft mb-8 max-w-xl">
        Short quizzes to check what actually stuck. Every question comes with an explanation, so you
        learn even when you get it wrong.
      </p>
      <div className="grid sm:grid-cols-2 gap-5">
        {QUIZ_CATEGORIES.map((c) => (
          <Link key={c.slug} href={`/quizzes/${c.slug}`} className="hub-card">
            <div className="text-2xl mb-2" aria-hidden="true">{c.icon}</div>
            <h2 className="text-lg mb-1">{c.title}</h2>
            <p className="text-sm text-ink-soft mb-3">{c.blurb}</p>
            <p className="font-mono text-xs text-ink-soft">{c.questions.length} questions</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
