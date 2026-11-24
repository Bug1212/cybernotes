"use client";

import { useEffect, useState } from "react";

// v1 admin auth: a shared secret typed once and kept for the tab session.
// Swap for real auth (NextAuth / Supabase Auth) before opening this up to
// more than one person. Used identically across every /admin/* page so
// unlocking once (e.g. on /admin/review) also unlocks /admin/topics and
// /admin/tools in the same tab.
export function useAdminToken() {
  const [token, setToken] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("cybernotes_admin_token");
    if (stored) setToken(stored);
    setHydrated(true);
  }, []);

  function save(t: string) {
    sessionStorage.setItem("cybernotes_admin_token", t);
    setToken(t);
  }

  function clear() {
    sessionStorage.removeItem("cybernotes_admin_token");
    setToken(null);
  }

  return { token, save, clear, hydrated };
}