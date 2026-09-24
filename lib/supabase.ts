import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Server-only client. Uses the service role key so pipeline jobs (cron/API
// routes) can bypass RLS. NEVER import this file from a "use client" component.
//
// Lazily created: Next.js imports every API route module at build time to
// collect metadata, even ones that are never called. If this client were
// built at module scope, `next build` would crash on missing env vars even
// when nothing actually queries Supabase during the build. The Proxy defers
// creation (and the env var check) until the first real `.from(...)` call,
// which only happens at request time.
let client: SupabaseClient | null = null;

function getServiceRoleClient(): SupabaseClient {
  if (client) return client;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env vars. See .env.example."
    );
  }

  client = createClient(url, key, { auth: { persistSession: false } });
  return client;
}

export const supabaseAdmin: SupabaseClient = new Proxy({} as SupabaseClient, {
  get(_target, prop, receiver) {
    return Reflect.get(getServiceRoleClient(), prop, receiver);
  },
});