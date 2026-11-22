import type { Metadata } from "next";
import GlossaryClient from "./GlossaryClient";
import { GLOSSARY, GLOSSARY_CATEGORIES } from "@/lib/glossaryData";

export const metadata: Metadata = {
  title: "Cybersecurity Glossary — CyberNotes",
  description: "Plain-language cybersecurity terms with practical examples, from beginner to advanced. Search and filter by category.",
};

export default function GlossaryPage() {
  return (
    <div>
      <h1 className="text-3xl mb-2">Glossary</h1>
      <p className="text-ink-soft mb-6 max-w-xl">
        {GLOSSARY.length} cybersecurity terms in plain language, each with a practical example.
        Search, or filter by category and level.
      </p>
      <GlossaryClient terms={GLOSSARY} categories={GLOSSARY_CATEGORIES} />
    </div>
  );
}
