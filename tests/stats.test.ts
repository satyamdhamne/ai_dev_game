import { describe, expect, it } from "vitest";
import { emptyStats, liveStreak, recordGame, winPercent } from "@/lib/stats";

describe("recordGame", () => {
  it("tracks wins, streaks and distribution", () => {
    let s = emptyStats();
    s = recordGame(s, 1, "won", 2);
    s = recordGame(s, 2, "won", 1);
    s = recordGame(s, 3, "won", 3);
    expect(s.played).toBe(3);
    expect(s.currentStreak).toBe(3);
    expect(s.maxStreak).toBe(3);
    expect(s.distribution).toEqual({ "1": 1, "2": 1, "3": 1, X: 0 });

    s = recordGame(s, 4, "lost", 3);
    expect(s.currentStreak).toBe(0);
    expect(s.maxStreak).toBe(3);
    expect(s.distribution.X).toBe(1);
    expect(winPercent(s)).toBe(75);
  });

  it("restarts the streak after a skipped day", () => {
    let s = recordGame(emptyStats(), 1, "won", 1);
    s = recordGame(s, 3, "won", 1);
    expect(s.currentStreak).toBe(1);
  });

  it("only counts a day once", () => {
    const s = recordGame(emptyStats(), 5, "won", 1);
    expect(recordGame(s, 5, "won", 1)).toBe(s);
    expect(recordGame(s, 4, "won", 1)).toBe(s);
  });
});

describe("liveStreak", () => {
  it("survives through the next day and expires after a missed day", () => {
    const s = recordGame(recordGame(emptyStats(), 1, "won", 1), 2, "won", 1);
    expect(liveStreak(s, 2)).toBe(2);
    expect(liveStreak(s, 3)).toBe(2);
    expect(liveStreak(s, 4)).toBe(0);
  });
});
