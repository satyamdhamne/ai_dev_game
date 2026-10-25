import { describe, expect, it } from "vitest";
import data from "@/data/puzzles.json";
import { validatePuzzles } from "@/lib/validatePuzzles";

describe("puzzles.json", () => {
  it("passes validation", () => {
    expect(validatePuzzles(data).errors).toEqual([]);
  });

  it("validator catches broken puzzles", () => {
    const bad = [{ ...data[0], id: 1, bugLine: 999, language: "cobol" }, { ...data[0], id: 1 }];
    const { errors } = validatePuzzles(bad);
    expect(errors.some((e) => e.includes("bugLine 999"))).toBe(true);
    expect(errors.some((e) => e.includes("invalid language"))).toBe(true);
    expect(errors.some((e) => e.includes("duplicate id"))).toBe(true);
  });

  it("validator catches a bugLine that the fix doesn't touch", () => {
    const p = data[0];
    const { errors } = validatePuzzles([{ ...p, bugLine: 1 }]);
    expect(errors.some((e) => e.includes("does not change bugLine"))).toBe(true);
  });
});
