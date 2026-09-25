"use client";

import { useEffect, useState } from "react";
import { useAdminToken } from "@/lib/useAdminToken";

interface Cve {
  cve_id: string;
  slug: string;
  title: string;
  severity: string | null;
  cvss_score: number | null;
  affected_software: string | null;
}

const emptyForm = {
  cve_id: "",
  title: "",
  severity: "MEDIUM",
  cvss_score: "",
  affected_software: "",
  affected_versions: "",
  vulnerability_type: "",
  cwe: "",
  published_date: "",
  patched_version: "",
  technical_explanation: "",
  attack_scenario: "",
  detection_methods: "",
  mitigation: "",
};

export default function CvesClient() {
  const { token, save } = useAdminToken();
  const [tokenInput, setTokenInput] = useState("");
  const [cves, setCves] = useState<Cve[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load(t: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/cves", { headers: { Authorization: `Bearer ${t}` } });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      const { cves } = await res.json();
      setCves(cves);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) load(token);
  }, [token]);

  async function createCve(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/cves", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          cvss_score: form.cvss_score ? Number(form.cvss_score) : null,
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

  async function deleteCve(cveId: string) {
    if (!token) return;
    if (!confirm(`Delete ${cveId}? This can't be undone.`)) return;
    try {
      const res = await fetch(`/api/admin/cves/${encodeURIComponent(cveId)}`, {
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
          {cves.length} CVE{cves.length === 1 ? "" : "s"}
        </h2>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="rounded bg-ink px-3 py-1.5 text-sm text-paper"
        >
          {showAddForm ? "Cancel" : "+ New CVE"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={createCve} className="space-y-3 rounded border border-line bg-paper-dark p-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="CVE-2024-12345"
              value={form.cve_id}
              onChange={(e) => setForm({ ...form, cve_id: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm font-mono"
            />
            <input
              required
              placeholder="title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-4 gap-3">
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
              <option value="CRITICAL">CRITICAL</option>
            </select>
            <input
              placeholder="CVSS (0-10)"
              value={form.cvss_score}
              onChange={(e) => setForm({ ...form, cvss_score: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <input
              placeholder="CWE (e.g. CWE-89)"
              value={form.cwe}
              onChange={(e) => setForm({ ...form, cwe: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <input
              type="date"
              value={form.published_date}
              onChange={(e) => setForm({ ...form, published_date: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <input
              placeholder="affected software"
              value={form.affected_software}
              onChange={(e) => setForm({ ...form, affected_software: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <input
              placeholder="affected versions"
              value={form.affected_versions}
              onChange={(e) => setForm({ ...form, affected_versions: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <input
              placeholder="patched version"
              value={form.patched_version}
              onChange={(e) => setForm({ ...form, patched_version: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
          </div>
          <input
            placeholder="vulnerability type (e.g. SQL Injection)"
            value={form.vulnerability_type}
            onChange={(e) => setForm({ ...form, vulnerability_type: e.target.value })}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <textarea
            placeholder="technical explanation — what is it? (markdown)"
            value={form.technical_explanation}
            onChange={(e) => setForm({ ...form, technical_explanation: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <textarea
            placeholder="attack scenario — defender-oriented, no working exploit code (markdown)"
            value={form.attack_scenario}
            onChange={(e) => setForm({ ...form, attack_scenario: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <textarea
            placeholder="detection methods (markdown)"
            value={form.detection_methods}
            onChange={(e) => setForm({ ...form, detection_methods: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <textarea
            placeholder="mitigation (markdown)"
            value={form.mitigation}
            onChange={(e) => setForm({ ...form, mitigation: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-moss px-4 py-2 text-sm text-paper disabled:opacity-50"
          >
            {saving ? "Saving…" : "Create CVE"}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-ink-soft">Loading…</p>}
      {error && <p className="rounded border border-rust bg-paper-dark p-3 text-sm text-rust">{error}</p>}

      {cves.map((c) => (
        <div key={c.cve_id} className="rounded border border-line bg-paper-dark p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ink-soft">{c.cve_id}</span>
            <span className="font-mono text-xs uppercase text-rust">
              {c.severity} {c.cvss_score ? `· ${c.cvss_score}` : ""}
            </span>
          </div>
          <h2 className="mt-1 font-serif text-xl text-ink">{c.title}</h2>
          {c.affected_software && <p className="mt-1 text-sm text-ink-soft">Affects: {c.affected_software}</p>}
          <div className="mt-3 flex gap-2">
            <button
              onClick={() => deleteCve(c.cve_id)}
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