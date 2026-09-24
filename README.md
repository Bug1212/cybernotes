<<<<<<< HEAD
# cybernotes
=======
# CyberNotes

Cybersecurity, taught simply — a Next.js (App Router + TypeScript + Tailwind)
scaffold for a "declassified case files" style learning site.

## Concept

Difficulty levels double as security clearance tiers:
- `PUBLIC` — beginner
- `RESTRICTED` — intermediate
- `CLASSIFIED` — advanced

Articles are "case files" (CN-001, CN-002, ...) filed under topic hubs.

## Design tokens

| Token       | Value     | Use                              |
|-------------|-----------|-----------------------------------|
| paper       | `#E9E6DC` | page background                  |
| paper-dark  | `#DDD8C9` | card/tab background              |
| ink         | `#1B1B18` | primary text, borders            |
| ink-soft    | `#4A473F` | secondary text                   |
| rust        | `#C1440E` | CLASSIFIED tier / primary accent |
| clearance   | `#2B4570` | RESTRICTED tier / links          |
| moss        | `#3F6B4F` | PUBLIC tier                      |
| line        | `#B8B2A0` | dividers, card borders           |

Fonts: **Source Serif 4** (headlines & body), **IBM Plex Mono** (labels,
case numbers, code). Loaded via Google Fonts in `app/layout.tsx`.

## Structure

```
app/
  layout.tsx          Root layout — header, footer, font loading
  page.tsx            Homepage
  learning-paths/     Sequenced beginner → advanced path
  topics/             Topic hub index + [slug] dynamic topic pages
  articles/[slug]/    Individual case-file (article) pages
  glossary/           Term lookup
  quizzes/            Placeholder — wire up your quiz component here
components/
  Header.tsx, Footer.tsx, CaseFileCard.tsx, ClearanceBadge.tsx
lib/
  content.ts          Sample topics/articles data — replace with real
                       content, MDX, or a CMS
```

## Running it

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Content model

Everything the site reads is in Supabase now — `lib/content.ts`'s static
arrays are gone. Run `supabase/schema.sql` once; it creates:

- **`topics`** — the topic hubs (slug, title, description, clearance, sort order)
- **`articles`** — every article, hand-written or AI-generated, in one table.
  `status` (`draft` → `in_review` → `approved` → `published` / `rejected`)
  and `is_ai_generated` distinguish pipeline drafts from hand-written pieces;
  the public site only ever sees `status = 'published'` rows (enforced by
  Row Level Security, not just app logic).
- **`tools`** — the cybersecurity tools directory schema from the
  requirements doc (category, OS support, install/usage/commands,
  docs links, defensive-use notes). No front-end pages read this yet —
  it's schema + query helpers (`lib/db/tools.ts`), ready for that vertical slice.
- **`cves`** — the CVE database schema (severity, CVSS, affected
  software/versions, CWE, technical explanation, defender-oriented attack
  scenario, detection, mitigation, references). Same status: schema + query
  helpers (`lib/db/cves.ts`) ready, no pages built yet.

Query helpers live in `lib/db/*.ts` and read through `lib/supabasePublic.ts`
(anon key, RLS-scoped — safe for server components). Writes and anything
gated (drafts, `raw_articles`, `sources`) go through `lib/supabase.ts`
(service role key, server-only, used by the pipeline and `/api/admin/*`).

Two seed articles are included (`CN-001` DNS, `CN-002` SQL injection) so the
home/topic/article pages have something to render immediately after you run
the schema.

**If you already ran the old `schema.sql`** (the one with a
`generated_articles` table), drop that table first —
`drop table if exists generated_articles cascade;` — before running the new
one; the pipeline now writes straight into `articles`.

## AI content pipeline (news → article)

`Sources → fetch (RSS) → dedupe (content hash) → store raw → Groq generation → fact-check pass → human review → publish`

1. **Set up Supabase.** Run `supabase/schema.sql` in the SQL editor (see
   "Content model" above — this same file creates `sources` and
   `raw_articles` alongside `articles`/`topics`/`tools`/`cves`, and seeds
   four reputable feeds: The Hacker News, BleepingComputer, CISA Advisories,
   Krebs on Security).
2. **Copy `.env.example` to `.env.local`** and fill in Supabase + Groq keys,
   plus `CRON_SECRET` and `ADMIN_SECRET` (any long random strings).
3. **Fetch:** `POST /api/pipeline/fetch` (with `Authorization: Bearer $CRON_SECRET`)
   pulls all enabled sources, hashes each item's `source_url + title`, and
   inserts only genuinely new ones into `raw_articles`.
4. **Generate:** `POST /api/pipeline/generate` picks the oldest pending raw
   article, has Groq write an original explainer (not a paraphrase — see the
   prompt in `lib/pipeline/generateArticle.ts`), then runs a second Groq pass
   that checks the draft's claims against the source excerpt. Anything with
   unsupported claims lands in `in_review` instead of `draft`, with the
   specific claims flagged in `fact_check_notes`.
5. **Review:** open `/admin/review`, enter `ADMIN_SECRET`, and Approve,
   Approve + Publish, or Reject each draft. Nothing reaches `published`
   without this step — the pipeline never auto-publishes.
6. **Schedule it:** `vercel.json` sets up daily cron (05:00 UTC fetch, 05:30
   generate) — one article a day by design, matching the "1 high-quality
   article/day" target rather than flooding the site. Vercel automatically
   sends `Authorization: Bearer $CRON_SECRET` to cron-triggered routes when
   that env var is set.

The public pages (`/`, `/topics`, `/topics/[slug]`, `/articles/[slug]`) read
straight from `articles`/`topics` via `lib/db/*.ts` now, so anything the
pipeline publishes — or you insert by hand with `status: 'published'` —
shows up without further wiring. `/admin/review` uses a single shared
secret — fine solo, but swap in real auth (NextAuth or Supabase Auth) before
adding other reviewers.

## Next steps to make this real

1. **Tools directory & CVE pages** — `tools` and `cves` tables + query
   helpers (`lib/db/tools.ts`, `lib/db/cves.ts`) exist; there are no
   front-end routes yet. `/tools`, `/tools/[slug]`, `/cves`, `/cves/[slug]`
   following the same pattern as `/topics`/`/articles` is the natural next
   vertical slice.
2. **Visual notes** — you already have a Playwright pipeline generating
   1080×1080 PNGs for Instagram. Reuse it here: embed those same visuals
   inline in article bodies instead of (or alongside) posting to Instagram.
3. **Quizzes** — the `/quizzes` page is a placeholder. A simple client
   component with `useState` per question is enough to start; no backend
   needed for v1.
4. **SEO/AdSense scaffolding** — sitemap, robots.txt, schema.org markup,
   and the legal pages (Privacy Policy, Terms, Editorial Policy, etc.) AdSense
   expects. Not started yet.
5. **Deploy** — Vercel is the natural fit for Next.js and has a generous
   free tier for a v1 launch.
>>>>>>> 42a1865 (Add project changes)
