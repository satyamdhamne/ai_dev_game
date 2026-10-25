import { describe, expect, it } from "vitest";
import { getDayNumber, getNextRollover, getPuzzleIndex, istDateString, msUntilNextPuzzle } from "@/lib/day";

const LAUNCH = "2026-10-25";
const utc = (iso: string) => new Date(iso);

describe("getDayNumber", () => {
  it("is Day 1 on launch day in IST", () => {
    // 00:00 IST on launch day is 18:30 UTC the day before.
    expect(getDayNumber(utc("2026-10-24T18:30:00Z"), LAUNCH)).toBe(1);
    expect(getDayNumber(utc("2026-10-25T12:00:00Z"), LAUNCH)).toBe(1);
  });

  it("rolls over exactly at midnight IST, not midnight UTC", () => {
    expect(getDayNumber(utc("2026-10-25T18:29:59.999Z"), LAUNCH)).toBe(1); // 23:59:59.999 IST
    expect(getDayNumber(utc("2026-10-25T18:30:00Z"), LAUNCH)).toBe(2); // 00:00 IST
    // Midnight UTC is 05:30 IST, mid-day: no rollover there.
    expect(getDayNumber(utc("2026-10-25T23:59:59Z"), LAUNCH)).toBe(2);
    expect(getDayNumber(utc("2026-10-26T00:00:00Z"), LAUNCH)).toBe(2);
  });

  it("treats the UTC date and IST date differently in the 18:30-24:00 UTC window", () => {
    // 20:00 UTC on Oct 25 is already Oct 26 in IST.
    const t = utc("2026-10-25T20:00:00Z");
    expect(istDateString(t)).toBe("2026-10-26");
    expect(getDayNumber(t, LAUNCH)).toBe(2);
  });

  it("clamps instants before launch to Day 1", () => {
    expect(getDayNumber(utc("2026-10-24T18:29:59Z"), LAUNCH)).toBe(1);
    expect(getDayNumber(utc("2025-01-01T00:00:00Z"), LAUNCH)).toBe(1);
  });

  it("counts across month and year boundaries", () => {
    expect(getDayNumber(utc("2026-11-01T06:00:00Z"), LAUNCH)).toBe(8);
    expect(getDayNumber(utc("2026-12-31T18:30:00Z"), LAUNCH)).toBe(69); // Jan 1 2027 00:00 IST
    expect(getDayNumber(utc("2027-10-25T00:00:00Z"), LAUNCH)).toBe(366);
  });

  it("handles a leap day", () => {
    expect(getDayNumber(utc("2028-02-29T12:00:00Z"), "2028-02-28")).toBe(2);
    expect(getDayNumber(utc("2028-03-01T12:00:00Z"), "2028-02-28")).toBe(3);
  });

  it("does not depend on the host's local time zone", () => {
    // Date math uses epoch ms only; prove it by checking a US DST switch night
    // (Nov 1 2026 in America/*), which must be a normal day in IST.
    expect(getDayNumber(utc("2026-11-01T06:30:00Z"), LAUNCH)).toBe(8);
    expect(getDayNumber(utc("2026-11-01T18:29:00Z"), LAUNCH)).toBe(8);
    expect(getDayNumber(utc("2026-11-01T18:30:00Z"), LAUNCH)).toBe(9);
  });

  it("uses the configured launch date by default", () => {
    expect(getDayNumber(utc("2026-10-25T06:00:00Z"))).toBe(1);
  });
});

describe("getPuzzleIndex", () => {
  it("maps day N to puzzles[(N-1) % len]", () => {
    expect(getPuzzleIndex(1, 30)).toBe(0);
    expect(getPuzzleIndex(30, 30)).toBe(29);
    expect(getPuzzleIndex(31, 30)).toBe(0);
    expect(getPuzzleIndex(65, 30)).toBe(4);
  });
});

describe("next rollover", () => {
  it("is the next midnight IST (18:30 UTC)", () => {
    expect(getNextRollover(utc("2026-10-25T10:00:00Z")).toISOString()).toBe("2026-10-25T18:30:00.000Z");
    // Right after rollover, the next one is 24h away.
    expect(getNextRollover(utc("2026-10-25T18:30:00Z")).toISOString()).toBe("2026-10-26T18:30:00.000Z");
    // Late UTC evening is already the next IST day.
    expect(getNextRollover(utc("2026-10-25T23:00:00Z")).toISOString()).toBe("2026-10-26T18:30:00.000Z");
  });

  it("counts down to zero at the rollover instant", () => {
    expect(msUntilNextPuzzle(utc("2026-10-25T18:29:59Z"))).toBe(1000);
    expect(msUntilNextPuzzle(utc("2026-10-25T18:30:00Z"))).toBe(24 * 3600 * 1000);
  });
});
