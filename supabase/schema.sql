-- CyberNotes content model + AI pipeline schema.
-- Run in the Supabase SQL editor (or `supabase db push`).
-- Safe to run on a fresh project. If you already ran the old schema.sql
-- (with a `generated_articles` table), drop it first: `drop table if exists generated_articles cascade;`

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────
-- Content model
-- ─────────────────────────────────────────────────────────

create table if not exists topics (
  slug text primary key,
  title text not null,
  description text not null,
  clearance text not null default 'PUBLIC' check (clearance in ('PUBLIC', 'RESTRICTED', 'CLASSIFIED')),
  sort_order int not null default 0
);

-- Single table for every article, hand-written or AI-generated. The AI
-- pipeline (lib/pipeline/generateArticle.ts) inserts rows here directly
-- with status 'draft' or 'in_review'; a human moves them to 'approved' /
-- 'published' via /admin/review. Hand-written articles can be inserted
-- with status 'published' straight away. raw_article_id is added as an FK
-- further down, once raw_articles exists.
create table if not exists articles (
  id uuid primary key default gen_random_uuid(),
  case_number text unique,
  slug text unique not null,
  title text not null,
  topic_slug text references topics(slug) on delete set null,
  clearance text not null default 'PUBLIC' check (clearance in ('PUBLIC', 'RESTRICTED', 'CLASSIFIED')),
  summary text not null,
  body text not null, -- markdown
  status text not null default 'draft' check (status in ('draft', 'in_review', 'approved', 'published', 'rejected')),
  is_ai_generated boolean not null default false,
  raw_article_id uuid,
  primary_sources jsonb not null default '[]',
  fact_check_notes text,
  reviewer_notes text,
  generated_at timestamptz not null default now(),
  reviewed_at timestamptz,
  published_at timestamptz
);

create table if not exists tools (
  slug text primary key,
  name text not null,
  category text not null, -- e.g. 'Reconnaissance & OSINT', 'Vulnerability Scanning', ...
  description text not null,
  supported_os text[] not null default '{}',
  installation text, -- markdown
  basic_usage text, -- markdown
  common_commands text, -- markdown
  official_docs_url text,
  learning_resources jsonb not null default '[]', -- [{ "title": "...", "url": "..." }]
  defensive_notes text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tools_category on tools(category);

create table if not exists cves (
  cve_id text primary key, -- e.g. 'CVE-2024-12345'
  slug text unique not null, -- e.g. 'cve-2024-12345'
  title text not null,
  severity text check (severity in ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  cvss_score numeric(3, 1),
  affected_software text,
  affected_versions text,
  vulnerability_type text,
  cwe text,
  published_date date,
  updated_date date,
  technical_explanation text, -- markdown; what it is / how it works
  attack_scenario text, -- markdown; defender-oriented, no working exploit code
  detection_methods text, -- markdown
  mitigation text, -- markdown
  patched_version text,
  source_references jsonb not null default '[]',
  related_cves text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_cves_severity on cves(severity);

-- ─────────────────────────────────────────────────────────
-- AI pipeline tables (sources → raw_articles → articles)
-- ─────────────────────────────────────────────────────────

create table if not exists sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null unique,
  kind text not null default 'rss' check (kind in ('rss', 'api')),
  enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists raw_articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid references sources(id) on delete set null,
  source_url text not null,
  title text not null,
  summary text,
  content text,
  published_at timestamptz,
  content_hash text not null unique,
  status text not null default 'pending' check (status in ('pending', 'processed', 'skipped')),
  fetched_at timestamptz not null default now()
);

create index if not exists idx_raw_articles_status on raw_articles(status);

-- Now that raw_articles exists, attach the real FK from articles to it.
do $$
begin
  if not exists (
    select 1 from information_schema.table_constraints
    where constraint_name = 'articles_raw_article_id_fkey'
  ) then
    alter table articles
      add constraint articles_raw_article_id_fkey
      foreign key (raw_article_id) references raw_articles(id) on delete set null;
  end if;
end $$;

-- ─────────────────────────────────────────────────────────
-- Row Level Security — anon (public site) can only ever read
-- topics / tools / cves, and articles with status = 'published'.
-- Writes (and reading drafts/raw_articles/sources) go through the
-- service-role key from server-only code (lib/supabase.ts), which
-- bypasses RLS entirely.
-- ─────────────────────────────────────────────────────────

alter table topics enable row level security;
alter table articles enable row level security;
alter table tools enable row level security;
alter table cves enable row level security;
alter table sources enable row level security;
alter table raw_articles enable row level security;

drop policy if exists "public read topics" on topics;
create policy "public read topics" on topics for select using (true);

drop policy if exists "public read published articles" on articles;
create policy "public read published articles" on articles for select using (status = 'published');

drop policy if exists "public read tools" on tools;
create policy "public read tools" on tools for select using (true);

drop policy if exists "public read cves" on cves;
create policy "public read cves" on cves for select using (true);

-- No policies on sources / raw_articles for anon → effectively no public
-- access to either (service role bypasses RLS, so the pipeline still works).

-- ─────────────────────────────────────────────────────────
-- Seed data
-- ─────────────────────────────────────────────────────────

insert into topics (slug, title, description, clearance, sort_order) values
  ('networking-fundamentals', 'Networking Fundamentals', 'How the internet actually works — IP, DNS, ports, and the plumbing everything else sits on.', 'PUBLIC', 1),
  ('web-security', 'Web Security', 'How common web vulnerabilities work, from injection to broken auth.', 'RESTRICTED', 2),
  ('osint', 'OSINT', 'What information about people and organizations is publicly discoverable, and how.', 'RESTRICTED', 3),
  ('pentesting-tools', 'Pentesting Tools', 'Hands-on with nmap, Burp Suite, Metasploit, Wireshark, and the rest of the toolbox.', 'CLASSIFIED', 4)
on conflict (slug) do nothing;

insert into sources (name, url, kind) values
  ('The Hacker News', 'https://feeds.feedburner.com/TheHackersNews', 'rss'),
  ('BleepingComputer', 'https://www.bleepingcomputer.com/feed/', 'rss'),
  ('CISA Advisories', 'https://www.cisa.gov/cybersecurity-advisories/all.xml', 'rss'),
  ('Krebs on Security', 'https://krebsonsecurity.com/feed/', 'rss')
on conflict (url) do nothing;

insert into articles (case_number, slug, title, topic_slug, clearance, summary, body, status, is_ai_generated, published_at) values
  (
    'CN-001',
    'how-dns-actually-works',
    'How DNS Actually Works',
    'networking-fundamentals',
    'PUBLIC',
    'The phonebook of the internet, and why it''s a favorite target for attackers.',
    E'# How DNS Actually Works\n\nEvery time you type a website name into your browser, something has to translate that name into an IP address a computer can actually connect to. That translator is DNS — the Domain Name System.\n\n## The lookup chain\n\nYour request doesn''t go straight to one all-knowing server. It hops through a chain: a recursive resolver (often run by your ISP or a public one like 1.1.1.1), then root servers, then TLD servers (for `.com`, `.org`, etc.), then the authoritative server for the specific domain.\n\n## Why attackers care\n\nBecause DNS is trusted by default, it''s a popular target: DNS spoofing, cache poisoning, and DNS tunneling all abuse that trust to redirect traffic or sneak data past defenses.\n\n## Defending it\n\nDNSSEC adds cryptographic signatures so resolvers can verify responses haven''t been tampered with. Monitoring DNS query logs is also one of the highest-signal, lowest-noise things a SOC can do.',
    'published',
    false,
    now()
  ),
  (
    'CN-002',
    'what-is-sql-injection',
    'What Is SQL Injection?',
    'web-security',
    'RESTRICTED',
    'How untrusted input becomes a database command, and how to stop it.',
    E'# What Is SQL Injection?\n\nSQL injection happens when user input is concatenated directly into a database query instead of being treated as pure data. If an application builds a query like `SELECT * FROM users WHERE name = ''` + input + `''`, an attacker can supply input that changes the query''s meaning entirely.\n\n## Why it still happens\n\nDespite being decades old, SQLi persists because string-concatenated queries are the "obvious" way to write one, especially in legacy code.\n\n## Detection\n\nWeb application firewalls can catch common patterns, but the more reliable signal is application-layer logging: unexpected quote characters, `UNION`, or `--` sequences in fields that should just be names or emails.\n\n## Prevention\n\nParameterized queries (prepared statements) are the fix: the database treats input strictly as data, never as part of the query structure, regardless of what characters it contains.',
    'published',
    false,
    now()
  )
on conflict (slug) do nothing;
