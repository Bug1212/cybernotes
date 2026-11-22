import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { QUIZ_CATEGORIES, getQuizCategory } from "@/lib/quizData";
import QuizClient from "./QuizClient";

export function generateStaticParams() {
  return QUIZ_CATEGORIES.map((c) => ({ category: c.slug }));
}

export function generateMetadata({ params }: { params: { category: string } }): Metadata {
  const c = getQuizCategory(params.category);
  return { title: c ? `${c.title} Quiz — CyberNotes` : "Quiz — CyberNotes", description: c?.blurb };
}

export default function QuizPage({ params }: { params: { category: string } }) {
  const category = getQuizCategory(params.category);
  if (!category) notFound();
  return <QuizClient category={category} />;
}
