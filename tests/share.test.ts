import { describe, expect, it } from "vitest";
import { createGame, submitBugType, submitGuess } from "@/lib/game";
import { buildShareText } from "@/lib/share";
import type { Puzzle } from "@/lib/types";

const puzzle = { id: 12, bugLine: 10, bugType: "Off-by-one" } as Puzzle;

describe("buildShareText", () => {
  it("matches the spec format for a win", () => {
    let g = createGame(12, puzzle, 0);
    g = submitGuess(g, 1, 10, 1); // cold
    g = submitGuess(g, 8, 10, 2); // warm
    g = submitGuess(g, 10, 10, 3); // found
    g = submitBugType(g, "Off-by-one");
    expect(buildShareText(g, "Off-by-one", 41, 5)).toBe(
      ["Spot the AI Bug — Day 12 🐛", "🟥🟨🟩  found in 3/3", "🧠 Bug type: ✅", "⏱️ 41s  🔥 Streak: 5", "spottheaibug.com"].join("\n"),
    );
  });

  it("pads unused attempts with black squares and marks a wrong bug type", () => {
    let g = submitGuess(createGame(2, puzzle, 0), 10, 10, 1);
    g = submitBugType(g, "Race condition");
    const text = buildShareText(g, "Off-by-one", 75, 1);
    expect(text).toContain("🟩⬛⬛  found in 1/3");
    expect(text).toContain("🧠 Bug type: ❌");
    expect(text).toContain("⏱️ 1m 15s");
  });

  it("shows a loss", () => {
    let g = createGame(3, puzzle, 0);
    for (const line of [1, 2, 20]) g = submitGuess(g, line, 10, 1);
    const text = buildShareText(g, "Off-by-one", 30, 0);
    expect(text).toContain("🟥🟥🟥  missed X/3");
    expect(text).toContain("🧠 Bug type: ➖");
  });
});
