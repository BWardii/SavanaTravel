"use client";

import { useState, useCallback, useEffect } from "react";

const STORAGE_KEY = "savana_seen_enquiries";

function getSeenIds(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSeenIds(ids: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch { /* storage full or unavailable */ }
}

export function useSeenEnquiries() {
  const [seen, setSeen] = useState<Set<string>>(new Set());

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setSeen(getSeenIds());
  }, []);

  const markSeen = useCallback((id: string) => {
    setSeen((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveSeenIds(next);
      return next;
    });
  }, []);

  const isNew = useCallback((id: string) => !seen.has(id), [seen]);

  return { isNew, markSeen };
}
