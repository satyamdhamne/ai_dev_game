import { diffLines, resolveFixedLines } from "./diff";
import { BUG_TYPES, DIFFICULTIES, LANGUAGES } from "./types";

const STRING_FIELDS = [
  "title",
  "prContext",
  "code",
  "explanation",
  "fixedCode",
  "whyAiDoesThis",
] as const;

export interface ValidationResult {
  errors: string[];
  warnings: string[];
}

/** Checks puzzles.json-shaped data. Errors fail the build; warnings are advisory. */
export function validatePuzzles(data: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!Array.isArray(data)) return { errors: ["puzzles.json must be an array"], warnings };
  if (data.length === 0) errors.push("puzzles.json is empty");

  const seen = new Set<number>();
  data.forEach((raw, i) => {
    const p = (raw ?? {}) as Record<string, unknown>;
    const label = `puzzle[${i}]${typeof p.id === "number" ? ` (id ${p.id})` : ""}`;
    const err = (msg: string) => errors.push(`${label}: ${msg}`);

    if (typeof p.id !== "number" || !Number.isInteger(p.id) || p.id < 1) err("id must be a positive integer");
    else if (seen.has(p.id)) err(`duplicate id ${p.id}`);
    else seen.add(p.id);

    for (const field of STRING_FIELDS) {
      if (typeof p[field] !== "string" || (p[field] as string).trim() === "") err(`${field} must be a non-empty string`);
    }
    if (!LANGUAGES.includes(p.language as never)) err(`invalid language "${String(p.language)}"`);
    if (!DIFFICULTIES.includes(p.difficulty as never)) err(`invalid difficulty "${String(p.difficulty)}"`);
    if (!BUG_TYPES.includes(p.bugType as never)) err(`invalid bugType "${String(p.bugType)}"`);

    if (typeof p.code === "string") {
      const lines = p.code.split("\n");
      if (lines.length < 10 || lines.length > 25) warnings.push(`${label}: code has ${lines.length} lines (aim for 10-25)`);
      if (typeof p.bugLine !== "number" || !Number.isInteger(p.bugLine)) {
        err("bugLine must be an integer");
      } else if (p.bugLine < 1 || p.bugLine > lines.length) {
        err(`bugLine ${p.bugLine} is outside the code (1-${lines.length})`);
      } else {
        const bug = lines[p.bugLine - 1];
        if (bug.trim() === "") err(`bugLine ${p.bugLine} points at a blank line`);
        if (typeof p.fixedCode === "string" && p.fixedCode.trim() === bug.trim()) err("fixedCode is identical to the bug line");
        const bugLine = p.bugLine;
        if (typeof p.fixedCode === "string") {
          const fixed = resolveFixedLines(lines, p.fixedCode.split("\n"), bugLine);
          const ops = diffLines(lines, fixed);
          // The fix must remove/replace the bug line, or insert code directly around it.
          const touched = ops.some((op, k) => {
            if (op.oldIndex !== bugLine - 1) return false;
            return op.kind === "del" || ops[k - 1]?.kind === "add" || ops[k + 1]?.kind === "add";
          });
          if (!touched) err(`fixedCode does not change bugLine ${bugLine}; is bugLine pointing at the right line?`);
        }
      }
      if (typeof p.fixedCode === "string" && p.fixedCode.trim() === p.code.trim()) err("fixedCode is identical to code");
    }
  });

  data.forEach((raw, i) => {
    if (typeof raw?.id === "number" && raw.id !== i + 1) warnings.push(`puzzle[${i}]: id ${raw.id} is out of sequence (expected ${i + 1})`);
  });

  return { errors, warnings };
}
