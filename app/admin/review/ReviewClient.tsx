// // // "use client";

// // // import { useEffect, useState } from "react";

// // // interface GeneratedArticle {
// // //   id: string;
// // //   case_number: string;
// // //   slug: string;
// // //   title: string;
// // //   topic_slug: string;
// // //   clearance: "PUBLIC" | "RESTRICTED" | "CLASSIFIED";
// // //   summary: string;
// // //   body: string;
// // //   primary_sources: { title: string; url: string }[];
// // //   fact_check_notes: string | null;
// // //   status: string;
// // // }

// // // // v1 admin auth: a shared secret typed once and kept for the tab session.
// // // // Swap for real auth (NextAuth / Supabase Auth) before opening this up to
// // // // more than one person.
// // // function useAdminToken() {
// // //   const [token, setToken] = useState<string | null>(null);

// // //   useEffect(() => {
// // //     const stored = sessionStorage.getItem("cybernotes_admin_token");
// // //     if (stored) setToken(stored);
// // //   }, []);

// // //   function save(t: string) {
// // //     sessionStorage.setItem("cybernotes_admin_token", t);
// // //     setToken(t);
// // //   }

// // //   return { token, save };
// // // }

// // // export default function ReviewClient() {
// // //   const { token, save } = useAdminToken();
// // //   const [tokenInput, setTokenInput] = useState("");
// // //   const [articles, setArticles] = useState<GeneratedArticle[]>([]);
// // //   const [loading, setLoading] = useState(false);
// // //   const [error, setError] = useState<string | null>(null);

// // //   async function load(t: string) {
// // //     setLoading(true);
// // //     setError(null);
// // //     try {
// // //       const res = await fetch("/api/admin/articles?status=draft,in_review", {
// // //         headers: { Authorization: `Bearer ${t}` },
// // //       });
// // //       if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
// // //       const { articles } = await res.json();
// // //       setArticles(articles);
// // //     } catch (err) {
// // //       setError((err as Error).message);
// // //     } finally {
// // //       setLoading(false);
// // //     }
// // //   }

// // //   useEffect(() => {
// // //     if (token) load(token);
// // //   }, [token]);

// // //   async function act(id: string, action: "approve" | "reject" | "publish", notes?: string) {
// // //     if (!token) return;
// // //     const res = await fetch(`/api/admin/articles/${id}`, {
// // //       method: "PATCH",
// // //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
// // //       body: JSON.stringify({ action, notes }),
// // //     });
// // //     if (!res.ok) {
// // //       setError((await res.json()).error ?? `HTTP ${res.status}`);
// // //       return;
// // //     }
// // //     load(token);
// // //   }

// // //   if (!token) {
// // //     return (
// // //       <div className="mt-8 rounded border border-line bg-paper-dark p-4">
// // //         <label className="block font-mono text-xs uppercase tracking-wide text-ink-soft">
// // //           Admin token
// // //         </label>
// // //         <div className="mt-2 flex gap-2">
// // //           <input
// // //             type="password"
// // //             value={tokenInput}
// // //             onChange={(e) => setTokenInput(e.target.value)}
// // //             className="flex-1 rounded border border-line bg-paper px-3 py-2 text-sm"
// // //             placeholder="ADMIN_SECRET"
// // //           />
// // //           <button
// // //             onClick={() => save(tokenInput)}
// // //             className="rounded bg-ink px-4 py-2 text-sm text-paper"
// // //           >
// // //             Unlock
// // //           </button>
// // //         </div>
// // //       </div>
// // //     );
// // //   }

// // //   return (
// // //     <div className="mt-8 space-y-6">
// // //       {loading && <p className="text-sm text-ink-soft">Loading…</p>}
// // //       {error && <p className="rounded border border-rust bg-paper-dark p-3 text-sm text-rust">{error}</p>}
// // //       {!loading && articles.length === 0 && (
// // //         <p className="text-sm text-ink-soft">Nothing waiting on review right now.</p>
// // //       )}

// // //       {articles.map((article) => (
// // //         <article key={article.id} className="rounded border border-line bg-paper-dark p-5">
// // //           <div className="flex items-center justify-between">
// // //             <span className="font-mono text-xs text-ink-soft">{article.case_number}</span>
// // //             <span
// // //               className={`font-mono text-xs uppercase ${
// // //                 article.status === "in_review" ? "text-rust" : "text-moss"
// // //               }`}
// // //             >
// // //               {article.status}
// // //             </span>
// // //           </div>
// // //           <h2 className="mt-1 font-serif text-xl text-ink">{article.title}</h2>
// // //           <p className="mt-1 text-sm text-ink-soft">
// // //             {article.topic_slug} · {article.clearance}
// // //           </p>
// // //           <p className="mt-3 text-sm text-ink">{article.summary}</p>

// // //           <details className="mt-3 text-sm">
// // //             <summary className="cursor-pointer font-mono text-xs text-clearance">Full body</summary>
// // //             <pre className="mt-2 whitespace-pre-wrap font-serif text-sm text-ink">{article.body}</pre>
// // //           </details>

// // //           {article.fact_check_notes && (
// // //             <div className="mt-3 rounded border border-rust/40 bg-paper p-3 text-xs text-ink-soft">
// // //               <strong className="text-rust">Fact-check notes:</strong> {article.fact_check_notes}
// // //             </div>
// // //           )}

// // //           <div className="mt-3 text-xs text-ink-soft">
// // //             Sources:{" "}
// // //             {article.primary_sources.map((s, i) => (
// // //               <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-clearance underline">
// // //                 {s.title}
// // //               </a>
// // //             ))}
// // //           </div>

// // //           <div className="mt-4 flex gap-2">
// // //             <button
// // //               onClick={() => act(article.id, "approve")}
// // //               className="rounded bg-moss px-3 py-1.5 text-sm text-paper"
// // //             >
// // //               Approve
// // //             </button>
// // //             <button
// // //               onClick={() => act(article.id, "publish")}
// // //               className="rounded bg-clearance px-3 py-1.5 text-sm text-paper"
// // //             >
// // //               Approve + Publish
// // //             </button>
// // //             <button
// // //               onClick={() => act(article.id, "reject")}
// // //               className="rounded bg-rust px-3 py-1.5 text-sm text-paper"
// // //             >
// // //               Reject
// // //             </button>
// // //           </div>
// // //         </article>
// // //       ))}
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import { useEffect, useState } from "react";

// // interface GeneratedArticle {
// //   id: string;
// //   case_number: string;
// //   slug: string;
// //   title: string;
// //   topic_slug: string;
// //   clearance: "PUBLIC" | "RESTRICTED" | "CLASSIFIED";
// //   summary: string;
// //   body: string;
// //   primary_sources: { title: string; url: string }[];
// //   fact_check_notes: string | null;
// //   status: string;
// // }

// // // v1 admin auth: a shared secret typed once and kept for the tab session.
// // // Swap for real auth (NextAuth / Supabase Auth) before opening this up to
// // // more than one person.
// // function useAdminToken() {
// //   const [token, setToken] = useState<string | null>(null);

// //   useEffect(() => {
// //     const stored = sessionStorage.getItem("cybernotes_admin_token");
// //     if (stored) setToken(stored);
// //   }, []);

// //   function save(t: string) {
// //     sessionStorage.setItem("cybernotes_admin_token", t);
// //     setToken(t);
// //   }

// //   return { token, save };
// // }

// // export default function ReviewClient() {
// //   const { token, save } = useAdminToken();
// //   const [tokenInput, setTokenInput] = useState("");
// //   const [articles, setArticles] = useState<GeneratedArticle[]>([]);
// //   const [debug, setDebug] = useState<Record<string, unknown> | null>(null);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState<string | null>(null);

// //   async function load(t: string) {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const res = await fetch("/api/admin/articles?status=draft,in_review", {
// //         headers: { Authorization: `Bearer ${t}` },
// //       });
// //       if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
// //       const { articles, debug } = await res.json();
// //       setArticles(articles);
// //       setDebug(debug ?? null);
// //     } catch (err) {
// //       setError((err as Error).message);
// //     } finally {
// //       setLoading(false);
// //     }
// //   }

// //   useEffect(() => {
// //     if (token) load(token);
// //   }, [token]);

// //   async function act(id: string, action: "approve" | "reject" | "publish", notes?: string) {
// //     if (!token) return;
// //     const res = await fetch(`/api/admin/articles/${id}`, {
// //       method: "PATCH",
// //       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
// //       body: JSON.stringify({ action, notes }),
// //     });
// //     if (!res.ok) {
// //       setError((await res.json()).error ?? `HTTP ${res.status}`);
// //       return;
// //     }
// //     load(token);
// //   }

// //   if (!token) {
// //     return (
// //       <div className="mt-8 rounded border border-line bg-paper-dark p-4">
// //         <label className="block font-mono text-xs uppercase tracking-wide text-ink-soft">
// //           Admin token
// //         </label>
// //         <div className="mt-2 flex gap-2">
// //           <input
// //             type="password"
// //             value={tokenInput}
// //             onChange={(e) => setTokenInput(e.target.value)}
// //             className="flex-1 rounded border border-line bg-paper px-3 py-2 text-sm"
// //             placeholder="ADMIN_SECRET"
// //           />
// //           <button
// //             onClick={() => save(tokenInput)}
// //             className="rounded bg-ink px-4 py-2 text-sm text-paper"
// //           >
// //             Unlock
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="mt-8 space-y-6">
// //       {loading && <p className="text-sm text-ink-soft">Loading…</p>}
// //       {error && <p className="rounded border border-rust bg-paper-dark p-3 text-sm text-rust">{error}</p>}
// //       {!loading && articles.length === 0 && (
// //         <div className="rounded border border-line bg-paper-dark p-4 text-sm">
// //           <p className="text-ink-soft">Nothing waiting on review right now.</p>
// //           {debug && (
// //             <div className="mt-3 border-t border-line pt-3 font-mono text-xs text-ink-soft space-y-1">
// //               <p className="text-clearance">Debug info:</p>
// //               <p>Connected to: {String(debug.connected_to_project_url)}</p>
// //               <p>Total articles visible to this client: {String(debug.total_articles_visible_to_this_client)}</p>
// //               <p>All statuses seen: {JSON.stringify(debug.all_statuses_seen)}</p>
// //               <p>Requested statuses: {JSON.stringify(debug.requested_statuses)}</p>
// //               {debug.debug_query_error ? (
// //                 <p className="text-rust">Debug query error: {String(debug.debug_query_error)}</p>
// //               ) : null}
// //             </div>
// //           )}
// //         </div>
// //       )}

// //       {articles.map((article) => (
// //         <article key={article.id} className="rounded border border-line bg-paper-dark p-5">
// //           <div className="flex items-center justify-between">
// //             <span className="font-mono text-xs text-ink-soft">{article.case_number}</span>
// //             <span
// //               className={`font-mono text-xs uppercase ${
// //                 article.status === "in_review" ? "text-rust" : "text-moss"
// //               }`}
// //             >
// //               {article.status}
// //             </span>
// //           </div>
// //           <h2 className="mt-1 font-serif text-xl text-ink">{article.title}</h2>
// //           <p className="mt-1 text-sm text-ink-soft">
// //             {article.topic_slug} · {article.clearance}
// //           </p>
// //           <p className="mt-3 text-sm text-ink">{article.summary}</p>

// //           <details className="mt-3 text-sm">
// //             <summary className="cursor-pointer font-mono text-xs text-clearance">Full body</summary>
// //             <pre className="mt-2 whitespace-pre-wrap font-serif text-sm text-ink">{article.body}</pre>
// //           </details>

// //           {article.fact_check_notes && (
// //             <div className="mt-3 rounded border border-rust/40 bg-paper p-3 text-xs text-ink-soft">
// //               <strong className="text-rust">Fact-check notes:</strong> {article.fact_check_notes}
// //             </div>
// //           )}

// //           <div className="mt-3 text-xs text-ink-soft">
// //             Sources:{" "}
// //             {article.primary_sources.map((s, i) => (
// //               <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-clearance underline">
// //                 {s.title}
// //               </a>
// //             ))}
// //           </div>

// //           <div className="mt-4 flex gap-2">
// //             <button
// //               onClick={() => act(article.id, "approve")}
// //               className="rounded bg-moss px-3 py-1.5 text-sm text-paper"
// //             >
// //               Approve
// //             </button>
// //             <button
// //               onClick={() => act(article.id, "publish")}
// //               className="rounded bg-clearance px-3 py-1.5 text-sm text-paper"
// //             >
// //               Approve + Publish
// //             </button>
// //             <button
// //               onClick={() => act(article.id, "reject")}
// //               className="rounded bg-rust px-3 py-1.5 text-sm text-paper"
// //             >
// //               Reject
// //             </button>
// //           </div>
// //         </article>
// //       ))}
// //     </div>
// //   );
// // }
// "use client";

// import { useEffect, useState } from "react";
// import { useAdminToken } from "@/lib/useAdminToken";

// interface GeneratedArticle {
//   id: string;
//   case_number: string;
//   slug: string;
//   title: string;
//   topic_slug: string;
//   clearance: "PUBLIC" | "RESTRICTED" | "CLASSIFIED";
//   summary: string;
//   body: string;
//   primary_sources: { title: string; url: string }[];
//   fact_check_notes: string | null;
//   status: string;
// }

// const emptyForm = {
//   slug: "",
//   case_number: "",
//   title: "",
//   topic_slug: "",
//   clearance: "PUBLIC",
//   summary: "",
//   body: "",
//   status: "draft",
// };

// export default function ReviewClient() {
//   const { token, save } = useAdminToken();
//   const [tokenInput, setTokenInput] = useState("");
//   const [articles, setArticles] = useState<GeneratedArticle[]>([]);
//   const [debug, setDebug] = useState<Record<string, unknown> | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const [showAddForm, setShowAddForm] = useState(false);
//   const [form, setForm] = useState(emptyForm);
//   const [saving, setSaving] = useState(false);

//   async function load(t: string) {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await fetch("/api/admin/articles?status=draft,in_review", {
//         headers: { Authorization: `Bearer ${t}` },
//       });
//       if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
//       const { articles, debug } = await res.json();
//       setArticles(articles);
//       setDebug(debug ?? null);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     if (token) load(token);
//   }, [token]);

//   async function act(id: string, action: "approve" | "reject" | "publish", notes?: string) {
//     if (!token) return;
//     const res = await fetch(`/api/admin/articles/${id}`, {
//       method: "PATCH",
//       headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//       body: JSON.stringify({ action, notes }),
//     });
//     if (!res.ok) {
//       setError((await res.json()).error ?? `HTTP ${res.status}`);
//       return;
//     }
//     load(token);
//   }

//   async function submitNewArticle(e: React.FormEvent) {
//     e.preventDefault();
//     if (!token) return;
//     setSaving(true);
//     setError(null);
//     try {
//       const res = await fetch("/api/admin/articles", {
//         method: "POST",
//         headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
//         body: JSON.stringify({
//           ...form,
//           case_number: form.case_number || null,
//         }),
//       });
//       if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
//       setForm(emptyForm);
//       setShowAddForm(false);
//       load(token);
//     } catch (err) {
//       setError((err as Error).message);
//     } finally {
//       setSaving(false);
//     }
//   }

//   if (!token) {
//     return (
//       <div className="mt-8 rounded border border-line bg-paper-dark p-4">
//         <label className="block font-mono text-xs uppercase tracking-wide text-ink-soft">
//           Admin token
//         </label>
//         <div className="mt-2 flex gap-2">
//           <input
//             type="password"
//             value={tokenInput}
//             onChange={(e) => setTokenInput(e.target.value)}
//             className="flex-1 rounded border border-line bg-paper px-3 py-2 text-sm"
//             placeholder="ADMIN_SECRET"
//           />
//           <button
//             onClick={() => save(tokenInput)}
//             className="rounded bg-ink px-4 py-2 text-sm text-paper"
//           >
//             Unlock
//           </button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="mt-8 space-y-6">
//       <div className="flex items-center justify-between">
//         <h2 className="font-mono text-xs uppercase tracking-wide text-ink-soft">
//           Draft / in-review queue
//         </h2>
//         <button
//           onClick={() => setShowAddForm((s) => !s)}
//           className="rounded bg-ink px-3 py-1.5 text-sm text-paper"
//         >
//           {showAddForm ? "Cancel" : "+ New article"}
//         </button>
//       </div>

//       {showAddForm && (
//         <form onSubmit={submitNewArticle} className="space-y-3 rounded border border-line bg-paper-dark p-4">
//           <div className="grid grid-cols-2 gap-3">
//             <input
//               required
//               placeholder="slug (e.g. cn-010-topic)"
//               value={form.slug}
//               onChange={(e) => setForm({ ...form, slug: e.target.value })}
//               className="rounded border border-line bg-paper px-3 py-2 text-sm"
//             />
//             <input
//               placeholder="case number (e.g. CN-010, optional)"
//               value={form.case_number}
//               onChange={(e) => setForm({ ...form, case_number: e.target.value })}
//               className="rounded border border-line bg-paper px-3 py-2 text-sm"
//             />
//           </div>
//           <input
//             required
//             placeholder="title"
//             value={form.title}
//             onChange={(e) => setForm({ ...form, title: e.target.value })}
//             className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
//           />
//           <div className="grid grid-cols-3 gap-3">
//             <input
//               required
//               placeholder="topic_slug (must exist in topics table)"
//               value={form.topic_slug}
//               onChange={(e) => setForm({ ...form, topic_slug: e.target.value })}
//               className="col-span-2 rounded border border-line bg-paper px-3 py-2 text-sm"
//             />
//             <select
//               value={form.clearance}
//               onChange={(e) => setForm({ ...form, clearance: e.target.value })}
//               className="rounded border border-line bg-paper px-3 py-2 text-sm"
//             >
//               <option value="PUBLIC">PUBLIC</option>
//               <option value="RESTRICTED">RESTRICTED</option>
//               <option value="CLASSIFIED">CLASSIFIED</option>
//             </select>
//           </div>
//           <textarea
//             required
//             placeholder="summary (1-2 sentences)"
//             value={form.summary}
//             onChange={(e) => setForm({ ...form, summary: e.target.value })}
//             rows={2}
//             className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
//           />
//           <textarea
//             required
//             placeholder="body (markdown)"
//             value={form.body}
//             onChange={(e) => setForm({ ...form, body: e.target.value })}
//             rows={8}
//             className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
//           />
//           <div className="flex items-center gap-3">
//             <label className="font-mono text-xs text-ink-soft">Save as:</label>
//             <select
//               value={form.status}
//               onChange={(e) => setForm({ ...form, status: e.target.value })}
//               className="rounded border border-line bg-paper px-3 py-2 text-sm"
//             >
//               <option value="draft">Draft (needs review)</option>
//               <option value="published">Published (goes live immediately)</option>
//             </select>
//             <button
//               type="submit"
//               disabled={saving}
//               className="ml-auto rounded bg-moss px-4 py-2 text-sm text-paper disabled:opacity-50"
//             >
//               {saving ? "Saving…" : "Create article"}
//             </button>
//           </div>
//         </form>
//       )}

//       {loading && <p className="text-sm text-ink-soft">Loading…</p>}
//       {error && <p className="rounded border border-rust bg-paper-dark p-3 text-sm text-rust">{error}</p>}
//       {!loading && articles.length === 0 && (
//         <div className="rounded border border-line bg-paper-dark p-4 text-sm">
//           <p className="text-ink-soft">Nothing waiting on review right now.</p>
//           {debug && (
//             <div className="mt-3 border-t border-line pt-3 font-mono text-xs text-ink-soft space-y-1">
//               <p className="text-clearance">Debug info:</p>
//               <p>Connected to: {String(debug.connected_to_project_url)}</p>
//               <p>Total articles visible to this client: {String(debug.total_articles_visible_to_this_client)}</p>
//               <p>All statuses seen: {JSON.stringify(debug.all_statuses_seen)}</p>
//               <p>Requested statuses: {JSON.stringify(debug.requested_statuses)}</p>
//               {debug.debug_query_error ? (
//                 <p className="text-rust">Debug query error: {String(debug.debug_query_error)}</p>
//               ) : null}
//             </div>
//           )}
//         </div>
//       )}

//       {articles.map((article) => (
//         <article key={article.id} className="rounded border border-line bg-paper-dark p-5">
//           <div className="flex items-center justify-between">
//             <span className="font-mono text-xs text-ink-soft">{article.case_number}</span>
//             <span
//               className={`font-mono text-xs uppercase ${
//                 article.status === "in_review" ? "text-rust" : "text-moss"
//               }`}
//             >
//               {article.status}
//             </span>
//           </div>
//           <h2 className="mt-1 font-serif text-xl text-ink">{article.title}</h2>
//           <p className="mt-1 text-sm text-ink-soft">
//             {article.topic_slug} · {article.clearance}
//           </p>
//           <p className="mt-3 text-sm text-ink">{article.summary}</p>

//           <details className="mt-3 text-sm">
//             <summary className="cursor-pointer font-mono text-xs text-clearance">Full body</summary>
//             <pre className="mt-2 whitespace-pre-wrap font-serif text-sm text-ink">{article.body}</pre>
//           </details>

//           {article.fact_check_notes && (
//             <div className="mt-3 rounded border border-rust/40 bg-paper p-3 text-xs text-ink-soft">
//               <strong className="text-rust">Fact-check notes:</strong> {article.fact_check_notes}
//             </div>
//           )}

//           <div className="mt-3 text-xs text-ink-soft">
//             Sources:{" "}
//             {article.primary_sources.map((s, i) => (
//               <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-clearance underline">
//                 {s.title}
//               </a>
//             ))}
//           </div>

//           <div className="mt-4 flex gap-2">
//             <button
//               onClick={() => act(article.id, "approve")}
//               className="rounded bg-moss px-3 py-1.5 text-sm text-paper"
//             >
//               Approve
//             </button>
//             <button
//               onClick={() => act(article.id, "publish")}
//               className="rounded bg-clearance px-3 py-1.5 text-sm text-paper"
//             >
//               Approve + Publish
//             </button>
//             <button
//               onClick={() => act(article.id, "reject")}
//               className="rounded bg-rust px-3 py-1.5 text-sm text-paper"
//             >
//               Reject
//             </button>
//           </div>
//         </article>
//       ))}
//     </div>
//   );
// }
"use client";

import { useEffect, useState } from "react";
import { useAdminToken } from "@/lib/useAdminToken";

interface GeneratedArticle {
  id: string;
  case_number: string;
  slug: string;
  title: string;
  topic_slug: string;
  clearance: "PUBLIC" | "RESTRICTED" | "CLASSIFIED";
  summary: string;
  body: string;
  primary_sources: { title: string; url: string }[];
  fact_check_notes: string | null;
  status: string;
}

const emptyForm = {
  slug: "",
  case_number: "",
  title: "",
  topic_slug: "",
  clearance: "PUBLIC",
  summary: "",
  body: "",
  status: "draft",
};

export default function ReviewClient() {
  const { token, save } = useAdminToken();
  const [tokenInput, setTokenInput] = useState("");
  const [articles, setArticles] = useState<GeneratedArticle[]>([]);
  const [debug, setDebug] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  async function load(t: string) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/articles?status=draft,in_review,approved", {
        headers: { Authorization: `Bearer ${t}` },
      });
      if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
      const { articles, debug } = await res.json();
      setArticles(articles);
      setDebug(debug ?? null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (token) load(token);
  }, [token]);

  async function act(id: string, action: "approve" | "reject" | "publish", notes?: string) {
    if (!token) return;
    const res = await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ action, notes }),
    });
    if (!res.ok) {
      setError((await res.json()).error ?? `HTTP ${res.status}`);
      return;
    }
    load(token);
  }

  async function submitNewArticle(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          ...form,
          case_number: form.case_number || null,
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
          <button
            onClick={() => save(tokenInput)}
            className="rounded bg-ink px-4 py-2 text-sm text-paper"
          >
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
          Draft / in-review / approved queue
        </h2>
        <button
          onClick={() => setShowAddForm((s) => !s)}
          className="rounded bg-ink px-3 py-1.5 text-sm text-paper"
        >
          {showAddForm ? "Cancel" : "+ New article"}
        </button>
      </div>

      {showAddForm && (
        <form onSubmit={submitNewArticle} className="space-y-3 rounded border border-line bg-paper-dark p-4">
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              placeholder="slug (e.g. cn-010-topic)"
              value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <input
              placeholder="case number (e.g. CN-010, optional)"
              value={form.case_number}
              onChange={(e) => setForm({ ...form, case_number: e.target.value })}
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
          <div className="grid grid-cols-3 gap-3">
            <input
              required
              placeholder="topic_slug (must exist in topics table)"
              value={form.topic_slug}
              onChange={(e) => setForm({ ...form, topic_slug: e.target.value })}
              className="col-span-2 rounded border border-line bg-paper px-3 py-2 text-sm"
            />
            <select
              value={form.clearance}
              onChange={(e) => setForm({ ...form, clearance: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            >
              <option value="PUBLIC">PUBLIC</option>
              <option value="RESTRICTED">RESTRICTED</option>
              <option value="CLASSIFIED">CLASSIFIED</option>
            </select>
          </div>
          <textarea
            required
            placeholder="summary (1-2 sentences)"
            value={form.summary}
            onChange={(e) => setForm({ ...form, summary: e.target.value })}
            rows={2}
            className="w-full rounded border border-line bg-paper px-3 py-2 text-sm"
          />
          <textarea
            required
            placeholder="body (markdown)"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            rows={8}
            className="w-full rounded border border-line bg-paper px-3 py-2 font-mono text-sm"
          />
          <div className="flex items-center gap-3">
            <label className="font-mono text-xs text-ink-soft">Save as:</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="rounded border border-line bg-paper px-3 py-2 text-sm"
            >
              <option value="draft">Draft (needs review)</option>
              <option value="published">Published (goes live immediately)</option>
            </select>
            <button
              type="submit"
              disabled={saving}
              className="ml-auto rounded bg-moss px-4 py-2 text-sm text-paper disabled:opacity-50"
            >
              {saving ? "Saving…" : "Create article"}
            </button>
          </div>
        </form>
      )}

      {loading && <p className="text-sm text-ink-soft">Loading…</p>}
      {error && <p className="rounded border border-rust bg-paper-dark p-3 text-sm text-rust">{error}</p>}
      {!loading && articles.length === 0 && (
        <div className="rounded border border-line bg-paper-dark p-4 text-sm">
          <p className="text-ink-soft">Nothing waiting on review right now.</p>
          {debug && (
            <div className="mt-3 border-t border-line pt-3 font-mono text-xs text-ink-soft space-y-1">
              <p className="text-clearance">Debug info:</p>
              <p>Connected to: {String(debug.connected_to_project_url)}</p>
              <p>Total articles visible to this client: {String(debug.total_articles_visible_to_this_client)}</p>
              <p>All statuses seen: {JSON.stringify(debug.all_statuses_seen)}</p>
              <p>Requested statuses: {JSON.stringify(debug.requested_statuses)}</p>
              {debug.debug_query_error ? (
                <p className="text-rust">Debug query error: {String(debug.debug_query_error)}</p>
              ) : null}
            </div>
          )}
        </div>
      )}

      {articles.map((article) => (
        <article key={article.id} className="rounded border border-line bg-paper-dark p-5">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs text-ink-soft">{article.case_number}</span>
            <span
              className={`font-mono text-xs uppercase ${
                article.status === "in_review"
                  ? "text-rust"
                  : article.status === "approved"
                  ? "text-clearance"
                  : "text-moss"
              }`}
            >
              {article.status}
            </span>
          </div>
          <h2 className="mt-1 font-serif text-xl text-ink">{article.title}</h2>
          <p className="mt-1 text-sm text-ink-soft">
            {article.topic_slug} · {article.clearance}
          </p>
          <p className="mt-3 text-sm text-ink">{article.summary}</p>

          <details className="mt-3 text-sm">
            <summary className="cursor-pointer font-mono text-xs text-clearance">Full body</summary>
            <pre className="mt-2 whitespace-pre-wrap font-serif text-sm text-ink">{article.body}</pre>
          </details>

          {article.fact_check_notes && (
            <div className="mt-3 rounded border border-rust/40 bg-paper p-3 text-xs text-ink-soft">
              <strong className="text-rust">Fact-check notes:</strong> {article.fact_check_notes}
            </div>
          )}

          <div className="mt-3 text-xs text-ink-soft">
            Sources:{" "}
            {article.primary_sources.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noreferrer" className="text-clearance underline">
                {s.title}
              </a>
            ))}
          </div>

          <div className="mt-4 flex gap-2">
            {article.status === "approved" ? (
              <>
                <button
                  onClick={() => act(article.id, "publish")}
                  className="rounded bg-clearance px-3 py-1.5 text-sm text-paper"
                >
                  Publish
                </button>
                <button
                  onClick={() => act(article.id, "reject")}
                  className="rounded bg-rust px-3 py-1.5 text-sm text-paper"
                >
                  Reject
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => act(article.id, "approve")}
                  className="rounded bg-moss px-3 py-1.5 text-sm text-paper"
                >
                  Approve
                </button>
                <button
                  onClick={() => act(article.id, "publish")}
                  className="rounded bg-clearance px-3 py-1.5 text-sm text-paper"
                >
                  Approve + Publish
                </button>
                <button
                  onClick={() => act(article.id, "reject")}
                  className="rounded bg-rust px-3 py-1.5 text-sm text-paper"
                >
                  Reject
                </button>
              </>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}