import { describe, expect, it } from "vitest";
import { BUG_TOPICS, LANGUAGE_TOPICS, practiceQuestions, questionsForBugType, questionsForLanguage } from "@/lib/interview";
import puzzles from "@/data/puzzles.json";
import { BUG_TYPES, LANGUAGES } from "@/lib/types";

describe("interview questions content", () => {
  it("has a topic page for every language and bug type", () => {
    expect(LANGUAGE_TOPICS.map((t) => t.slug).sort()).toEqual([...LANGUAGES].sort());
    expect(BUG_TOPICS.map((t) => t.bugType).sort()).toEqual([...BUG_TYPES].sort());
    expect(new Set(BUG_TOPICS.map((t) => t.slug)).size).toBe(BUG_TOPICS.length);
  });

  it("covers each language and bug type with several questions", () => {
    for (const lang of LANGUAGES) expect(questionsForLanguage(lang).length).toBeGreaterThanOrEqual(3);
    for (const bug of BUG_TYPES) expect(questionsForBugType(bug).length).toBeGreaterThanOrEqual(2);
  });

  it("every question is well-formed", () => {
    const slugs = new Set<string>();
    for (const q of practiceQuestions) {
      expect(slugs.has(q.slug), q.slug).toBe(false);
      slugs.add(q.slug);
      expect(q.slug).toMatch(/^[a-z0-9-]+$/);
      const lines = q.code.split("\n");
      expect(q.bugLine, q.slug).toBeGreaterThanOrEqual(1);
      expect(q.bugLine, q.slug).toBeLessThanOrEqual(lines.length);
      expect(lines[q.bugLine - 1].trim(), q.slug).not.toBe("");
      for (const f of ["title", "prompt", "answer", "fix"] as const) expect(q[f].trim(), `${q.slug}.${f}`).not.toBe("");
    }
  });

  it("never reuses a daily puzzle's code (no spoilers)", () => {
    const daily = new Set(puzzles.map((p) => p.code.split("\n")[p.bugLine - 1].trim()));
    for (const q of practiceQuestions) {
      const bugLine = q.code.split("\n")[q.bugLine - 1].trim();
      expect(daily.has(bugLine), q.slug).toBe(false);
    }
  });
});
