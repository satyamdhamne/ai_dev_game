import { BUG_TYPE_CHOICES, MAX_ATTEMPTS, WARM_DISTANCE } from "./config";
import { mulberry32, shuffle } from "./random";
import { BUG_TYPES, type BugType, type Guess, type GuessResult, type Puzzle } from "./types";

export type Phase = "find" | "name" | "done";
export type Outcome = "won" | "lost";

export interface GameState {
  version: 1;
  day: number;
  puzzleId: number;
  guesses: Guess[];
  phase: Phase;
  outcome: Outcome | null;
  bugTypeOptions: BugType[];
  bugTypeGuess: BugType | null;
  startedAt: number;
  /** When the hunt ended (line found or attempts exhausted). Stops the clock. */
  endedAt: number | null;
}

/** The correct bug type plus N-1 others, in a stable per-puzzle order. */
export function getBugTypeOptions(puzzle: Pick<Puzzle, "id" | "bugType">): BugType[] {
  const rand = mulberry32(puzzle.id * 7919 + 17);
  const decoys = shuffle(
    BUG_TYPES.filter((t) => t !== puzzle.bugType),
    rand,
  ).slice(0, BUG_TYPE_CHOICES - 1);
  return shuffle([puzzle.bugType, ...decoys], rand);
}

export function createGame(day: number, puzzle: Puzzle, now: number): GameState {
  return {
    version: 1,
    day,
    puzzleId: puzzle.id,
    guesses: [],
    phase: "find",
    outcome: null,
    bugTypeOptions: getBugTypeOptions(puzzle),
    bugTypeGuess: null,
    startedAt: now,
    endedAt: null,
  };
}

export function classifyGuess(line: number, bugLine: number): GuessResult {
  if (line === bugLine) return "found";
  return Math.abs(line - bugLine) <= WARM_DISTANCE ? "warm" : "cold";
}

export function attemptsLeft(state: GameState): number {
  return MAX_ATTEMPTS - state.guesses.length;
}

export function submitGuess(state: GameState, line: number, bugLine: number, now: number): GameState {
  if (state.phase !== "find") return state;
  if (state.guesses.some((g) => g.line === line)) return state;

  const result = classifyGuess(line, bugLine);
  const guesses = [...state.guesses, { line, result }];

  if (result === "found") {
    return { ...state, guesses, phase: "name", outcome: "won", endedAt: now };
  }
  if (guesses.length >= MAX_ATTEMPTS) {
    return { ...state, guesses, phase: "done", outcome: "lost", endedAt: now };
  }
  return { ...state, guesses };
}

export function submitBugType(state: GameState, choice: BugType): GameState {
  if (state.phase !== "name") return state;
  return { ...state, bugTypeGuess: choice, phase: "done" };
}

export function elapsedSeconds(state: GameState, now: number): number {
  const end = state.endedAt ?? now;
  return Math.max(0, Math.floor((end - state.startedAt) / 1000));
}

export function formatDuration(totalSeconds: number): string {
  if (totalSeconds < 60) return `${totalSeconds}s`;
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}m ${String(s).padStart(2, "0")}s`;
}

/** Validates a parsed localStorage value before trusting it. */
export function isGameState(value: unknown): value is GameState {
  if (!value || typeof value !== "object") return false;
  const v = value as Partial<GameState>;
  return (
    v.version === 1 &&
    typeof v.day === "number" &&
    typeof v.puzzleId === "number" &&
    Array.isArray(v.guesses) &&
    (v.phase === "find" || v.phase === "name" || v.phase === "done") &&
    Array.isArray(v.bugTypeOptions) &&
    typeof v.startedAt === "number"
  );
}
