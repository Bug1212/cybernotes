import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Read-only, RLS-scoped client for public pages (server components).
// Uses the anon key — safe by design, since RLS policies in schema.sql only
// expose topics, tools, cves, and published articles to this role.
// Never use this for writes or for anything gated (raw_articles, sources,
// non-published articles) — use lib/supabase.ts (service role) for that.
//
// Lazily created for the same reason as lib/supabase.ts: avoids crashing
// `next build` when env vars aren't set for a build that doesn't need them.
let client: SupabaseClient | null = null;

function getPublicClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY env vars. See .env.example."
    );
  }

  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export const supabasePublic: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getPublicClient(), prop, receiver);
  },
});