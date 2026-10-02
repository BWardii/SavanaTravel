"use client";

import { createContext, useContext } from "react";
import { DEFAULT_SEASON, type Season } from "@/lib/season";

const SeasonContext = createContext<Season>(DEFAULT_SEASON);

export function SeasonProvider({
  season,
  children,
}: {
  season: Season;
  children: React.ReactNode;
}) {
  return <SeasonContext.Provider value={season}>{children}</SeasonContext.Provider>;
}

export function useSeason(): Season {
  return useContext(SeasonContext);
}
