import "server-only";
import { cacheLife } from "next/cache";
import { diffLines, resolveFixedLines, toHunks } from "./diff";
import { highlightLines } from "./highlight";
import { getPuzzleForDay } from "./puzzles";
import type { DailyPuzzle, DiffRowView } from "./types";

/** Highlighted puzzle + fix diff for a day. Pure function of `day`, so cache it forever. */
export async function getDailyPuzzle(day: number): Promise<DailyPuzzle> {
  "use cache";
  cacheLife("max");

  const puzzle = getPuzzleForDay(day);
  const codeLines = puzzle.code.split("\n");
  const fixedRaw = resolveFixedLines(codeLines, puzzle.fixedCode.split("\n"), puzzle.bugLine);

  const [lines, fixedTokens] = await Promise.all([
    highlightLines(puzzle.code, puzzle.language),
    highlightLines(fixedRaw.join("\n"), puzzle.language),
  ]);

  const diff: DiffRowView[] = toHunks(diffLines(codeLines, fixedRaw)).map((row) => {
    if (row.kind === "gap") return row;
    if (row.kind === "add") return { kind: "add", newNo: row.newIndex! + 1, tokens: fixedTokens[row.newIndex!] ?? [] };
    return {
      kind: row.kind,
      oldNo: row.oldIndex! + 1,
      newNo: row.newIndex !== undefined ? row.newIndex + 1 : undefined,
      tokens: lines[row.oldIndex!] ?? [],
    };
  });

  return { day, puzzle, lines, diff };
}
