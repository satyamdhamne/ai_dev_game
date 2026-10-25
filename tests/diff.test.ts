import { describe, expect, it } from "vitest";
import { diffLines, resolveFixedLines, toHunks } from "@/lib/diff";

describe("diff", () => {
  const code = ["a", "b", "c", "d", "e", "f", "g", "h"];

  it("treats a short fixedCode as a replacement for the bug line", () => {
    expect(resolveFixedLines(code, ["C1", "C2"], 3)).toEqual(["a", "b", "C1", "C2", "d", "e", "f", "g", "h"]);
  });

  it("keeps a full snippet as-is", () => {
    const full = [...code.slice(0, 4), "E", ...code.slice(5)];
    expect(resolveFixedLines(code, full, 5)).toBe(full);
  });

  it("produces hunks with context and gaps", () => {
    const fixed = ["a", "B", "c", "d", "e", "f", "g", "H"];
    const rows = toHunks(diffLines(code, fixed), 1);
    expect(rows.map((r) => r.kind)).toEqual(["ctx", "del", "add", "ctx", "gap", "ctx", "del", "add"]);
  });
});
