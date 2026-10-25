import { IST_OFFSET_MINUTES, LAUNCH_DATE } from "./config";

const DAY_MS = 24 * 60 * 60 * 1000;
const OFFSET_MS = IST_OFFSET_MINUTES * 60 * 1000;

function parseDate(date: string): number {
  const [y, m, d] = date.split("-").map(Number);
  return Date.UTC(y, m - 1, d);
}

/** Midnight (as a UTC epoch-ms "calendar day" value) of the IST date `now` falls on. */
function istCalendarDay(now: Date): number {
  return Math.floor((now.getTime() + OFFSET_MS) / DAY_MS) * DAY_MS;
}

/** The IST calendar date for an instant, formatted YYYY-MM-DD. */
export function istDateString(now: Date): string {
  return new Date(istCalendarDay(now)).toISOString().slice(0, 10);
}

/**
 * Day N of the game: days since LAUNCH_DATE + 1, rolling over at midnight IST.
 * Instants before launch are clamped to Day 1.
 */
export function getDayNumber(now: Date = new Date(), launchDate: string = LAUNCH_DATE): number {
  const days = Math.round((istCalendarDay(now) - parseDate(launchDate)) / DAY_MS);
  return Math.max(1, days + 1);
}

/** Puzzles cycle once the list runs out. */
export function getPuzzleIndex(day: number, puzzleCount: number): number {
  return (((day - 1) % puzzleCount) + puzzleCount) % puzzleCount;
}

/** The instant of the next midnight IST after `now`. */
export function getNextRollover(now: Date = new Date()): Date {
  return new Date(istCalendarDay(now) + DAY_MS - OFFSET_MS);
}

export function msUntilNextPuzzle(now: Date = new Date()): number {
  return getNextRollover(now).getTime() - now.getTime();
}
