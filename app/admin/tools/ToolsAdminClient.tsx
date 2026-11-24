"use client";

import { useEffect, useState } from "react";
import { useAdminToken } from "@/lib/useAdminToken";
import { TOOL_CATEGORIES } from "../../../lib/toolCategories";

interface Tool {
  slug: string;
  name: string;
  category: string;
  description: string;
  supported_os: string[];
  installation: string | null;
  basic_usage: string | null;
  common_commands: string | null;
  official_docs_url: string | null;
  learning_resources: { title: string; url: string }[];
  defensive_notes: string | null;
}

const emptyForm = {
  slug: "",
  name: "",
  category: TOOL_CATEGORIES[0] as string,
  description: "",
  supported_os: "", // comma-separated in the form, split on submit
  installation: "",
  basic_usage: "",
  common_commands: "",
  official_docs_url: "",
  defensive_notes: "",
};

export default function ToolsClient() {
  const { token, save } = useAdminToken();
  const [tokenInput, setTokenInput] = useState("");
  const [tools, setTools] = useState<Tool[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  async function load(t: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tools", { headers: { Authorization: `Bearer ${t}` } });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      const { tools } = await res.json();
      setTools(tools);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) load(token);
  }, [token]);

  async function createTool(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          supported_os: form.supported_os
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      setForm(emptyForm);
      setShowAddForm(false);
      load(token);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSaving(false);
    }
  }

  async function deleteTool(slug: string) {
    if (!token) return;
    if (!confirm(`Delete tool "${slug}"? This can't be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/tools/${slug}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      load(token);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  if (!token) {
    return (
      <div className="mt-8 rounded border border-line bg-paper-dark p-4">
        <label className="block font-mono text-xs uppercase tracking-wide text-ink-soft">
          Admin token
        </label>
        <div className="mt-2 flex gap-2">
          <input
            type="password"
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            className="flex-1 rounded border border-line bg-paper px-3 py-2 text-sm"
            placeholder="ADMIN_SECRET"
          />
          <button onClick={() => save(tokenInput)} className="rounded bg-ink px-4 py-2 text-sm text-paper">
            Unlock
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft">
          {tools.length} tool{tools.length === 1 ? "" : "s"}
        </h2>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="rounded bg-ink px-3 py-1.5 text-sm text-paper"
        >
          {showAddForm ? "Cancel" : "+ New tool"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={createTool} className="space-y-3 rounded border border-line bg-paper-dark p-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="slug (e.g. nmap)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="name (e.g. Nmap)"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            >
              {TOOL_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <input
              placeholder="supported OS, comma-separated (e.g. Linux, macOS, Windows)"
              value={form.supported_os}
              onChange={(e) => setForm({ ...form, supported_os: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
          </div>
          <textarea
            required
            placeholder="description (1-2 sentences)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <textarea
            placeholder="installation instructions (markdown)"
            value={form.installation}
            onChange={(e) => setForm({ ...form, installation: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <textarea
            placeholder="basic usage (markdown)"
            value={form.basic_usage}
            onChange={(e) => setForm({ ...form, basic_usage: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <textarea
            placeholder="common commands (markdown)"
            value={form.common_commands}
            onChange={(e) => setForm({ ...form, common_commands: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <input
            placeholder="official docs URL"
            value={form.official_docs_url}
            onChange={(e) => setForm({ ...form, official_docs_url: e.target.value })}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <textarea
            placeholder="defensive / authorized-use notes"
            value={form.defensive_notes}
            onChange={(e) => setForm({ ...form, defensive_notes: e.target.value })}
            rows={2}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-moss px-4 py-2 text-sm text-paper disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create tool"}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-ink-soft">Loading…</p>}
      {error && <p className="rounded border border-rust bg-paper-dark p-3 text-sm text-rust">{error}</p>}

      {tools.map((t) => (
        <div key={t.slug} className="rounded border border-line bg-paper-dark p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ink-soft">{t.category}</span>
            <span className="font-mono text-xs text-ink-soft">{t.supported_os.join(", ")}</span>
          </div>
          <h2 className="mt-1 font-serif text-xl text-ink">{t.name}</h2>
          <p className="mt-1 text-sm text-ink">{t.description}</p>

          <button
            onClick={() => setExpandedSlug(expandedSlug === t.slug ? null : t.slug)}
            className="mt-2 font-mono text-xs text-clearance"
          >
            {expandedSlug === t.slug ? "Hide details" : "Show details"}
          </button>

          {expandedSlug === t.slug && (
            <div className="mt-3 space-y-2 border-t border-line pt-3 text-sm">
              {t.installation && (
                <p>
                  <strong className="font-mono text-xs uppercase text-ink-soft">Installation:</strong>{" "}
                  {t.installation}
                </p>
              )}
              {t.basic_usage && (
                <p>
                  <strong className="font-mono text-xs uppercase text-ink-soft">Basic usage:</strong>{" "}
                  {t.basic_usage}
                </p>
              )}
              {t.common_commands && (
                <p>
                  <strong className="font-mono text-xs uppercase text-ink-soft">Common commands:</strong>{" "}
                  {t.common_commands}
                </p>
              )}
              {t.official_docs_url && (
                <p>
                  <a href={t.official_docs_url} target="_blank" rel="noreferrer" className="text-clearance underline">
                    Official docs
                  </a>
                </p>
              )}
              {t.defensive_notes && (
                <p className="text-ink-soft">
                  <strong className="font-mono text-xs uppercase">Defensive notes:</strong> {t.defensive_notes}
                </p>
              )}
            </div>
          )}

          <div className="mt-3 flex gap-2">
            <button
              onClick={() => deleteTool(t.slug)}
              className="rounded bg-rust px-3 py-1.5 text-sm text-paper"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}