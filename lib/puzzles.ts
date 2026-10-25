import data from "@/data/puzzles.json";
import { getDayNumber, getPuzzleIndex } from "./day";
import type { Puzzle } from "./types";

export const puzzles = data as Puzzle[];

export function getPuzzleForDay(day: number): Puzzle {
  return puzzles[getPuzzleIndex(day, puzzles.length)];
}

export function getTodayPuzzle(now: Date = new Date()): { day: number; puzzle: Puzzle } {
  const day = getDayNumber(now);
  return { day, puzzle: getPuzzleForDay(day) };
}
