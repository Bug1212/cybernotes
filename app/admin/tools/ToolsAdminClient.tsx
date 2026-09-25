"use client";

import { useEffect, useState } from "react";
import { useAdminToken } from "@/lib/useAdminToken";

interface ToolRow {
  slug: string;
  name: string;
  category: string;
  description: string;
  supported_os: string[];
  installation: string | null;
  basic_usage: string | null;
  common_commands: string | null;
  official_docs_url: string | null;
  defensive_notes: string | null;
}

const emptyForm = {
  slug: "",
  name: "",
  category: "",
  description: "",
  supported_os: "", // comma-separated in the form, split into an array on submit
  installation: "",
  basic_usage: "",
  common_commands: "",
  official_docs_url: "",
  defensive_notes: "",
};

export default function ToolsAdminClient() {
  const { token, save } = useAdminToken();
  const [tokenInput, setTokenInput] = useState("");
  const [tools, setTools] = useState<ToolRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

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

  async function submit(e: React.FormEvent) {
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

  async function remove(slug: string) {
    if (!token) return;
    if (!confirm(`Delete tool "${slug}"? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/tools/${slug}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) {
      setError((await res.json()).error ?? `HTTP ${res.status}`);
      return;
    }
    load(token);
  }

  if (!token) {
    return (
      <div className="mt-8 rounded border border-line bg-paper-dark p-4">
        <label className="block font-mono text-xs uppercase tracking-wide text-ink-soft">Admin token</label>
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
        <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft">{tools.length} tools</h2>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="rounded bg-ink px-3 py-1.5 text-sm text-paper"
        >
          {showAddForm ? "Cancel" : "+ Add tool"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={submit} className="space-y-3 rounded border border-line bg-paper-dark p-4">
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
            <input
              required
              placeholder="category (e.g. Reconnaissance & OSINT)"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <input
              placeholder="supported OS, comma-separated (Linux, Windows, macOS)"
              value={form.supported_os}
              onChange={(e) => setForm({ ...form, supported_os: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
          </div>
          <textarea
            required
            placeholder="description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <textarea
            placeholder="installation (markdown, optional)"
            value={form.installation}
            onChange={(e) => setForm({ ...form, installation: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <textarea
            placeholder="basic usage (markdown, optional)"
            value={form.basic_usage}
            onChange={(e) => setForm({ ...form, basic_usage: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <textarea
            placeholder="common commands (markdown, optional)"
            value={form.common_commands}
            onChange={(e) => setForm({ ...form, common_commands: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <input
            placeholder="official docs URL (optional)"
            value={form.official_docs_url}
            onChange={(e) => setForm({ ...form, official_docs_url: e.target.value })}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <textarea
            placeholder="defensive notes — how defenders detect/mitigate use of this tool (optional)"
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
            {saving ? "Saving…" : "Add tool"}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-ink-soft">Loading…</p>}
      {error && <p className="rounded border border-rust bg-paper-dark p-3 text-sm text-rust">{error}</p>}

      {tools.map((tool) => (
        <div key={tool.slug} className="rounded border border-line bg-paper-dark p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-lg text-ink">{tool.name}</h3>
            <button onClick={() => remove(tool.slug)} className="rounded bg-rust px-3 py-1 text-xs text-paper">
              Delete
            </button>
          </div>
          <p className="font-mono text-xs text-ink-soft">
            {tool.category} · {tool.supported_os.join(", ") || "OS not specified"}
          </p>
          <p className="mt-2 text-sm text-ink">{tool.description}</p>
        </div>
      ))}
    </div>
  );
}