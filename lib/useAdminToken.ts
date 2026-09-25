"use client";

import { useEffect, useState } from "react";

// v1 admin auth: a shared secret typed once and kept for the tab session,
// shared across every /admin/* page via the same sessionStorage key.
// Swap for real auth (NextAuth / Supabase Auth) before opening this up to
// more than one person.
export function useAdminToken() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("cybernotes_admin_token");
    if (stored) setToken(stored);
  }, []);

  function save(t: string) {
    sessionStorage.setItem("cybernotes_admin_token", t);
    setToken(t);
  }

  return { token, save };
}