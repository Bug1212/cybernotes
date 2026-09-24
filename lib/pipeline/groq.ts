import Groq from "groq-sdk";

let client: Groq | null = null;

function getGroq() {
  if (!client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Missing GROQ_API_KEY env var. See .env.example.");
    client = new Groq({ apiKey });
  }
  return client;
}

export const GROQ_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";

/**
 * Ask Groq for a JSON-only completion. Strips ```json fences defensively —
 * models sometimes wrap JSON in markdown even when told not to.
 */
export async function groqJSON<T>(systemPrompt: string, userPrompt: string): Promise<T> {
  const groq = getGroq();

  const completion = await groq.chat.completions.create({
    model: GROQ_MODEL,
    temperature: 0.4,
    max_tokens: 4000,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const raw = completion.choices[0]?.message?.content ?? "";
  const cleaned = raw.replace(/```json|```/g, "").trim();

  try {
    return JSON.parse(cleaned) as T;
  } catch (err) {
    throw new Error(`Groq did not return valid JSON: ${(err as Error).message}\nRaw: ${raw.slice(0, 500)}`);
  }
}
