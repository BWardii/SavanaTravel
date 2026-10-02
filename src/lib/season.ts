export const SEASONS = [2026, 2027] as const;
export type Season = (typeof SEASONS)[number];
export const DEFAULT_SEASON: Season = 2026;

export function isSeason(value: unknown): value is Season {
  const n = Number(value);
  return n === 2026 || n === 2027;
}

export function parseSeason(value: unknown): Season {
  return Number(value) === 2027 ? 2027 : DEFAULT_SEASON;
}

export function adminPath(season: Season, rest = ""): string {
  const suffix = rest
    ? rest.startsWith("/")
      ? rest
      : `/${rest}`
    : "";
  return `/admin/${season}${suffix}`;
}

export function switchAdminSeason(pathname: string, next: Season): string {
  const replaced = pathname.replace(/^\/admin\/(2026|2027)/, `/admin/${next}`);
  return replaced.startsWith(`/admin/${next}`) ? replaced : adminPath(next);
}

export function onboardPath(season: Season): string {
  return season === 2026 ? "/onboard" : `/onboard/${season}`;
}

export function onboardSuccessPath(season: Season): string {
  return season === 2026 ? "/onboard/success" : `/onboard/${season}/success`;
}
