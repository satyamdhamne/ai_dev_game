export const LANGUAGES = ["python", "javascript", "typescript", "go", "sql", "java"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const BUG_TYPES = [
  "Off-by-one",
  "Security / injection",
  "Race condition",
  "Null / undefined handling",
  "Wrong edge case",
  "Resource leak",
  "Logic inverted",
  "Wrong API usage",
  "Leaked secret",
  "Performance trap",
] as const;

export type Language = (typeof LANGUAGES)[number];
export type Difficulty = (typeof DIFFICULTIES)[number];
export type BugType = (typeof BUG_TYPES)[number];

export interface Puzzle {
  id: number;
  title: string;
  language: Language;
  difficulty: Difficulty;
  prContext: string;
  code: string;
  bugLine: number;
  bugType: BugType;
  explanation: string;
  fixedCode: string;
  whyAiDoesThis: string;
}

/** One syntax-highlighted token; `dark` is the dark-theme color. */
export interface Token {
  content: string;
  color?: string;
  dark?: string;
}
export type TokenLine = Token[];

export type DiffRowView =
  | { kind: "ctx" | "del" | "add"; oldNo?: number; newNo?: number; tokens: TokenLine }
  | { kind: "gap" };

/** Everything the client needs to play one day. */
export interface DailyPuzzle {
  day: number;
  puzzle: Puzzle;
  lines: TokenLine[];
  diff: DiffRowView[];
}

export type GuessResult = "cold" | "warm" | "found";
export interface Guess {
  line: number;
  result: GuessResult;
}
