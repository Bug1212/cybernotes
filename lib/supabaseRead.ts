import { supabaseAdmin } from "./supabase";

// Read-only data for the PUBLIC pages (topics, tools, CVEs, published articles).
// This runs only in server code (server components / route handlers), so the key never reaches the
// browser. It uses the same server connection as the admin pages and the CVE/article pipeline, so
// public pages always read the exact database those write to — no dependency on the anon key,
// NEXT_PUBLIC_* env vars, or row-level-security policies being configured identically.
//
// Safety rule: every query using this client for public pages must stay a plain read and must
// filter to public content itself (e.g. articles are always filtered to status = 'published').
export const supabaseRead = supabaseAdmin;