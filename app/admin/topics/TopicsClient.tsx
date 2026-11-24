"use client";

import { useEffect, useState } from "react";
import { useAdminToken } from "@/lib/useAdminToken";

interface Topic {
  slug: string;
  title: string;
  description: string;
  clearance: "PUBLIC" | "RESTRICTED" | "CLASSIFIED";
  sort_order: number;
}

const emptyForm = { slug: "", title: "", description: "", clearance: "PUBLIC", sort_order: 0 };

export default function TopicsClient() {
  const { token, save } = useAdminToken();
  const [tokenInput, setTokenInput] = useState("");
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);

  async function load(t: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/topics", { headers: { Authorization: `Bearer ${t}` } });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      const { topics } = await res.json();
      setTopics(topics);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) load(token);
  }, [token]);

  async function createTopic(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/topics", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
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

  function startEdit(t: Topic) {
    setEditingSlug(t.slug);
    setEditForm({
      slug: t.slug,
      title: t.title,
      description: t.description,
      clearance: t.clearance,
      sort_order: t.sort_order,
    });
  }

  async function saveEdit(slug: string) {
    if (!token) return;
    setError(null);
    try {
      const res = await fetch(`/api/admin/topics/${slug}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: editForm.title,
          description: editForm.description,
          clearance: editForm.clearance,
          sort_order: editForm.sort_order,
        }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      setEditingSlug(null);
      load(token);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function deleteTopic(slug: string) {
    if (!token) return;
    if (!confirm(`Delete topic "${slug}"? Articles linked to it will lose their topic (not be deleted).`))
      return;
    try {
      const res = await fetch(`/api/admin/topics/${slug}`, {
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
          {topics.length} topic{topics.length === 1 ? "" : "s"}
        </h2>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="rounded bg-ink px-3 py-1.5 text-sm text-paper"
        >
          {showAddForm ? "Cancel" : "+ New topic"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={createTopic} className="space-y-3 rounded border border-line bg-paper-dark p-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="slug (e.g. cloud-security)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="title (e.g. Cloud Security)"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
          </div>
          <textarea
            required
            placeholder="description (1 sentence, shown on the hub card)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <div className="flex items-center gap-3">
            <select
              value={form.clearance}
              onChange={(e) => setForm({ ...form, clearance: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="RESTRICTED">RESTRICTED</option>
              <option value="CLASSIFIED">CLASSIFIED</option>
            </select>
            <input
              type="number"
              placeholder="sort order"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number(e.target.value) })}
              className="w-28 rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={saving}
              className="ml-auto rounded bg-moss px-4 py-2 text-sm text-paper disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create topic"}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-sm text-ink-soft">Loading…</p>}
      {error && <p className="rounded border border-rust bg-paper-dark p-3 text-sm text-rust">{error}</p>}

      {topics.map((t) => (
        <div key={t.slug} className="rounded border border-line bg-paper-dark p-4">
          {editingSlug === t.slug ? (
            <div className="space-y-3">
              <input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
              />
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={2}
                className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
              />
              <div className="flex items-center gap-3">
                <select
                  value={editForm.clearance}
                  onChange={(e) => setEditForm({ ...editForm, clearance: e.target.value })}
                  className="rounded border border-line bg-paper px-3 py-2 text-sm"
                >
                  <option value="PUBLIC">PUBLIC</option>
                  <option value="RESTRICTED">RESTRICTED</option>
                  <option value="CLASSIFIED">CLASSIFIED</option>
                </select>
                <input
                  type="number"
                  value={editForm.sort_order}
                  onChange={(e) => setEditForm({ ...editForm, sort_order: Number(e.target.value) })}
                  className="w-28 rounded border border-line bg-paper px-3 py-2 text-sm"
                />
                <button
                  onClick={() => saveEdit(t.slug)}
                  className="ml-auto rounded bg-moss px-3 py-1.5 text-sm text-paper"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingSlug(null)}
                  className="rounded border border-line px-3 py-1.5 text-sm text-ink-soft"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs text-ink-soft">{t.slug}</span>
                <span className="font-mono text-xs uppercase text-clearance">{t.clearance}</span>
              </div>
              <h2 className="mt-1 font-serif text-xl text-ink">{t.title}</h2>
              <p className="mt-1 text-sm text-ink">{t.description}</p>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => startEdit(t)}
                  className="rounded bg-clearance px-3 py-1.5 text-sm text-paper"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTopic(t.slug)}
                  className="rounded bg-rust px-3 py-1.5 text-sm text-paper"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}