"use client";

import { useEffect, useState } from "react";
import { useAdminToken } from "@/lib/useAdminToken";

interface CveRow {
  cve_id: string;
  slug: string;
  title: string;
  severity: string | null;
  cvss_score: number | null;
  cwe: string | null;
  affected_software: string | null;
}

const emptyForm = {
  cve_id: "",
  slug: "",
  title: "",
  severity: "",
  cvss_score: "",
  cwe: "",
  affected_software: "",
  affected_versions: "",
  vulnerability_type: "",
  published_date: "",
  technical_explanation: "",
  attack_scenario: "",
  detection_methods: "",
  mitigation: "",
  patched_version: "",
};

export default function CvesAdminClient() {
  const { token, save } = useAdminToken();
  const [tokenInput, setTokenInput] = useState("");
  const [cves, setCves] = useState<CveRow[]>([]);
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

  async function submit(e: React.FormEvent) {
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
          severity: form.severity || null,
          cvss_score: form.cvss_score ? Number(form.cvss_score) : null,
          published_date: form.published_date || null,
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

  async function remove(cveId: string) {
    if (!token) return;
    if (!confirm(`Delete ${cveId}? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/cves/${cveId}`, {
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
        <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft">{cves.length} entries</h2>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="rounded bg-ink px-3 py-1.5 text-sm text-paper"
        >
          {showAddForm ? "Cancel" : "+ Add CVE"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={submit} className="space-y-3 rounded border border-line bg-paper-dark p-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="CVE ID (e.g. CVE-2024-12345)"
              value={form.cve_id}
              onChange={(e) => setForm({ ...form, cve_id: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <input
              required
              placeholder="slug (e.g. cve-2024-12345)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
          </div>
          <input
            required
            placeholder="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-4 gap-3">
            <select
              value={form.severity}
              onChange={(e) => setForm({ ...form, severity: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            >
              <option value="">Severity…</option>
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
              placeholder="CWE (e.g. CWE-79)"
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
          <div className="grid grid-cols-2 gap-3">
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
          </div>
          <input
            placeholder="vulnerability type (e.g. SQL Injection)"
            value={form.vulnerability_type}
            onChange={(e) => setForm({ ...form, vulnerability_type: e.target.value })}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <textarea
            placeholder="technical explanation (markdown, optional)"
            value={form.technical_explanation}
            onChange={(e) => setForm({ ...form, technical_explanation: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <textarea
            placeholder="attack scenario — defender-oriented, no working exploit code (markdown, optional)"
            value={form.attack_scenario}
            onChange={(e) => setForm({ ...form, attack_scenario: e.target.value })}
            rows={3}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <textarea
            placeholder="detection methods (markdown, optional)"
            value={form.detection_methods}
            onChange={(e) => setForm({ ...form, detection_methods: e.target.value })}
            rows={2}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <textarea
            placeholder="mitigation (markdown, optional)"
            value={form.mitigation}
            onChange={(e) => setForm({ ...form, mitigation: e.target.value })}
            rows={2}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <input
            placeholder="patched version (optional)"
            value={form.patched_version}
            onChange={(e) => setForm({ ...form, patched_version: e.target.value })}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="rounded bg-moss px-4 py-2 text-sm text-paper disabled:opacity-50"
          >
            {saving ? "Saving…" : "Add CVE"}
          </button>
        </form>
      )}

      {loading && <p className="text-sm text-ink-soft">Loading…</p>}
      {error && <p className="rounded border border-rust bg-paper-dark p-3 text-sm text-rust">{error}</p>}

      {cves.map((cve) => (
        <div key={cve.cve_id} className="rounded border border-line bg-paper-dark p-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ink-soft">{cve.cve_id}</span>
            <button onClick={() => remove(cve.cve_id)} className="rounded bg-rust px-3 py-1 text-xs text-paper">
              Delete
            </button>
          </div>
          <h3 className="mt-1 font-serif text-lg text-ink">{cve.title}</h3>
          <p className="font-mono text-xs text-ink-soft">
            {cve.severity ?? "—"} {cve.cvss_score ? `(${cve.cvss_score})` : ""} · {cve.cwe ?? "no CWE set"} ·{" "}
            {cve.affected_software ?? "software not set"}
          </p>
        </div>
      ))}
    </div>
  );
}