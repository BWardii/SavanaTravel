"use client";

import { useState, useCallback, useEffect } from "react";
import { useSeason } from "@/contexts/season-context";

function storageKey(season: number) {
  return `savana_seen_enquiries_${season}`;
}

function getSeenIds(season: number): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(storageKey(season));
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function saveSeenIds(season: number, ids: Set<string>) {
  try {
    localStorage.setItem(storageKey(season), JSON.stringify([...ids]));
  } catch { /* storage full or unavailable */ }
}

export function useSeenEnquiries() {
  const season = useSeason();
  const [seen, setSeen] = useState<Set<string>>(new Set());

  useEffect(() => {
    setSeen(getSeenIds(season));
  }, [season]);

  const markSeen = useCallback((id: string) => {
    setSeen((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveSeenIds(season, next);
      return next;
    });
  }, [season]);

  const isNew = useCallback((id: string) => !seen.has(id), [seen]);

  return { isNew, markSeen };
}
