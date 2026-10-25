import { describe, expect, it } from "vitest";
import {
  attemptsLeft,
  classifyGuess,
  createGame,
  elapsedSeconds,
  formatDuration,
  getBugTypeOptions,
  isGameState,
  submitBugType,
  submitGuess,
} from "@/lib/game";
import { BUG_TYPES, type Puzzle } from "@/lib/types";

const puzzle = { id: 7, bugLine: 10, bugType: "Off-by-one" } as Puzzle;

describe("classifyGuess", () => {
  it("is warm within 2 lines and cold beyond", () => {
    expect(classifyGuess(10, 10)).toBe("found");
    expect(classifyGuess(8, 10)).toBe("warm");
    expect(classifyGuess(12, 10)).toBe("warm");
    expect(classifyGuess(7, 10)).toBe("cold");
    expect(classifyGuess(13, 10)).toBe("cold");
  });
});

describe("game flow", () => {
  it("wins on the right line and moves to the bug-type phase", () => {
    let g = createGame(3, puzzle, 1_000);
    g = submitGuess(g, 2, 10, 5_000);
    expect(g.phase).toBe("find");
    expect(attemptsLeft(g)).toBe(2);
    g = submitGuess(g, 10, 10, 42_000);
    expect(g.phase).toBe("name");
    expect(g.outcome).toBe("won");
    expect(elapsedSeconds(g, 99_000)).toBe(41); // clock stopped at endedAt
    g = submitBugType(g, "Off-by-one");
    expect(g.phase).toBe("done");
    expect(g.bugTypeGuess).toBe("Off-by-one");
  });

  it("loses after 3 misses and skips the bug-type phase", () => {
    let g = createGame(3, puzzle, 0);
    g = submitGuess(g, 1, 10, 1);
    g = submitGuess(g, 9, 10, 2);
    g = submitGuess(g, 20, 10, 3);
    expect(g.phase).toBe("done");
    expect(g.outcome).toBe("lost");
    expect(g.guesses.map((x) => x.result)).toEqual(["cold", "warm", "cold"]);
    expect(submitGuess(g, 10, 10, 4)).toBe(g);
    expect(submitBugType(g, "Off-by-one")).toBe(g);
  });

  it("ignores repeat guesses of the same line", () => {
    const g = submitGuess(createGame(1, puzzle, 0), 4, 10, 1);
    expect(submitGuess(g, 4, 10, 2)).toBe(g);
  });

  it("round-trips through JSON and passes the storage guard", () => {
    const g = createGame(1, puzzle, 0);
    expect(isGameState(JSON.parse(JSON.stringify(g)))).toBe(true);
    expect(isGameState({ version: 2 })).toBe(false);
    expect(isGameState(null)).toBe(false);
  });
});

describe("getBugTypeOptions", () => {
  it("returns 4 distinct options including the answer, stable per puzzle", () => {
    const a = getBugTypeOptions(puzzle);
    expect(a).toHaveLength(4);
    expect(new Set(a).size).toBe(4);
    expect(a).toContain("Off-by-one");
    a.forEach((t) => expect(BUG_TYPES).toContain(t));
    expect(getBugTypeOptions(puzzle)).toEqual(a);
  });

  it("puts the answer in varying positions across puzzles", () => {
    const positions = new Set(
      Array.from({ length: 30 }, (_, i) => getBugTypeOptions({ id: i + 1, bugType: "Race condition" }).indexOf("Race condition")),
    );
    expect(positions.size).toBeGreaterThan(1);
  });
});

describe("formatDuration", () => {
  it("formats seconds and minutes", () => {
    expect(formatDuration(0)).toBe("0s");
    expect(formatDuration(41)).toBe("41s");
    expect(formatDuration(65)).toBe("1m 05s");
  });
});
