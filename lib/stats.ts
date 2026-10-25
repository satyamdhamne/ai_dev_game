import type { Outcome } from "./game";

export type DistributionKey = "1" | "2" | "3" | "X";

export interface Stats {
  version: 1;
  played: number;
  wins: number;
  currentStreak: number;
  maxStreak: number;
  distribution: Record<DistributionKey, number>;
  lastPlayedDay: number | null;
  lastWonDay: number | null;
}

export function emptyStats(): Stats {
  return {
    version: 1,
    played: 0,
    wins: 0,
    currentStreak: 0,
    maxStreak: 0,
    distribution: { "1": 0, "2": 0, "3": 0, X: 0 },
    lastPlayedDay: null,
    lastWonDay: null,
  };
}

/** Records a finished game. Idempotent: a day is only ever counted once. */
export function recordGame(stats: Stats, day: number, outcome: Outcome, attempts: number): Stats {
  if (stats.lastPlayedDay !== null && day <= stats.lastPlayedDay) return stats;

  const won = outcome === "won";
  const currentStreak = won ? (stats.lastWonDay === day - 1 ? stats.currentStreak + 1 : 1) : 0;
  const key: DistributionKey = won ? (String(attempts) as DistributionKey) : "X";

  return {
    ...stats,
    played: stats.played + 1,
    wins: stats.wins + (won ? 1 : 0),
    currentStreak,
    maxStreak: Math.max(stats.maxStreak, currentStreak),
    distribution: { ...stats.distribution, [key]: stats.distribution[key] + 1 },
    lastPlayedDay: day,
    lastWonDay: won ? day : stats.lastWonDay,
  };
}

/** A streak only survives if the last win was today or yesterday. */
export function liveStreak(stats: Stats, today: number): number {
  if (stats.lastWonDay === null || stats.lastWonDay < today - 1) return 0;
  return stats.currentStreak;
}

export function winPercent(stats: Stats): number {
  return stats.played === 0 ? 0 : Math.round((stats.wins / stats.played) * 100);
}

export function isStats(value: unknown): value is Stats {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<Stats>;
  return v.version === 1 && typeof v.played === "number" && typeof v.distribution === "object";
}
