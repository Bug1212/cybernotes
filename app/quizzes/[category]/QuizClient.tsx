"use client";

import Link from "next/link";
import { useState } from "react";
import type { QuizCategory } from "@/lib/quizData";

export default function QuizClient({ category }: { category: QuizCategory }) {
  const total = category.questions.length;
  const [order, setOrder] = useState<number[]>(() => category.questions.map((_, i) => i));
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [missed, setMissed] = useState<number[]>([]);

  const q = category.questions[order[idx]];
  const answered = picked !== null;

  function choose(i: number) {
    if (answered) return;
    setPicked(i);
    if (i === q.answer) setScore((s) => s + 1);
    else setMissed((m) => [...m, order[idx]]);
  }
  function next() {
    if (idx + 1 >= total) setDone(true);
    else {
      setIdx(idx + 1);
      setPicked(null);
    }
  }
  function restart() {
    // shuffle question order for a fresh attempt
    const o = category.questions.map((_, i) => i).sort(() => Math.random() - 0.5);
    setOrder(o);
    setIdx(0);
    setPicked(null);
    setScore(0);
    setMissed([]);
    setDone(false);
  }

  if (done) {
    const pct = Math.round((score / total) * 100);
    return (
      <div className="max-w-2xl">
        <p className="case-number mb-3">QUIZ RESULT</p>
        <h1 className="text-3xl mb-2">{category.title}</h1>
        <p className="text-5xl font-semibold my-6">{score} / {total} <span className="text-xl text-ink-soft">({pct}%)</span></p>
        <p className="text-ink-soft mb-6">
          {pct === 100 ? "Perfect score — nicely done." : pct >= 70 ? "Solid. Review the ones you missed below." : "Good start. Review the explanations below and try again."}
        </p>
        {missed.length > 0 && (
          <div className="mb-6">
            <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-3">Review what you missed</h2>
            {missed.map((qi) => {
              const m = category.questions[qi];
              return (
                <div key={qi} className="border-l-4 border-l-rust bg-paper-dark pl-4 pr-3 py-3 mb-3 text-sm">
                  <p className="font-semibold mb-1">{m.q}</p>
                  <p className="text-moss mb-1">Correct answer: {m.options[m.answer]}</p>
                  <p className="text-ink-soft">{m.explain}</p>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <button onClick={restart} className="rounded bg-ink px-4 py-2 text-sm text-paper">Try again</button>
          <Link href="/quizzes" className="rounded border border-line px-4 py-2 text-sm">All quizzes</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <p className="case-number mb-3">{category.title.toUpperCase()} QUIZ</p>
      <div className="flex items-center justify-between font-mono text-xs text-ink-soft mb-2">
        <span>Question {idx + 1} of {total}</span>
        <span>Score: {score}</span>
      </div>
      <div className="h-1.5 bg-paper-dark rounded mb-6" role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={idx + (answered ? 1 : 0)}>
        <div className="h-full bg-clearance rounded transition-all" style={{ width: `${((idx + (answered ? 1 : 0)) / total) * 100}%` }} />
      </div>

      <h1 className="text-2xl leading-snug mb-5">{q.q}</h1>

      <div className="space-y-3">
        {q.options.map((opt, i) => {
          const isAnswer = i === q.answer;
          const isPicked = i === picked;
          let cls = "border-line bg-paper-dark hover:border-ink";
          if (answered && isAnswer) cls = "border-moss bg-moss/10";
          else if (answered && isPicked) cls = "border-rust bg-rust/10";
          else if (answered) cls = "border-line bg-paper-dark opacity-70";
          return (
            <button
              key={i}
              onClick={() => choose(i)}
              disabled={answered}
              className={`w-full text-left border rounded px-4 py-3 text-sm transition-colors ${cls}`}
            >
              <span className="font-mono text-xs mr-3 text-ink-soft">{String.fromCharCode(65 + i)}</span>
              {opt}
              {answered && isAnswer && <span className="float-right text-moss font-semibold">✓ Correct</span>}
              {answered && isPicked && !isAnswer && <span className="float-right text-rust font-semibold">✗ Your answer</span>}
            </button>
          );
        })}
      </div>

      {answered && (
        <div className="mt-5 border-l-4 border-l-clearance bg-paper-dark pl-4 pr-3 py-3 text-sm" aria-live="polite">
          <p className="font-mono text-xs uppercase tracking-wide text-ink-soft mb-1">Explanation</p>
          <p>{q.explain}</p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-between">
        <Link href="/quizzes" className="font-mono text-sm">&larr; All quizzes</Link>
        {answered && (
          <button onClick={next} className="rounded bg-ink px-4 py-2 text-sm text-paper">
            {idx + 1 >= total ? "See results" : "Next question →"}
          </button>
        )}
      </div>
    </div>
  );
}