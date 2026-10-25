"use client";

import { track } from "@/lib/analytics";
import { MAX_ATTEMPTS, WARM_DISTANCE } from "@/lib/config";
import {
  attemptsLeft,
  createGame,
  elapsedSeconds,
  formatDuration,
  submitBugType,
  submitGuess,
  type GameState,
} from "@/lib/game";
import { liveStreak, recordGame } from "@/lib/stats";
import { gameStore, statsStore, useGameState, useHydrated, useStats } from "@/lib/store";
import type { BugType, DailyPuzzle, Difficulty, Language } from "@/lib/types";
import { useNow } from "@/lib/useNow";
import { useEffect, useMemo, useRef, useState } from "react";
import { BugTypePicker } from "./BugTypePicker";
import { CodeBlock, type LineMark } from "./CodeBlock";
import { ClockIcon } from "./icons";
import { ResultScreen } from "./ResultScreen";

const LANGUAGE_META: Record<Language, { label: string; ext: string; className: string }> = {
  python: { label: "Python", ext: "py", className: "bg-sky-500/15 text-sky-600 dark:text-sky-300" },
  javascript: { label: "JavaScript", ext: "js", className: "bg-yellow-400/20 text-yellow-700 dark:text-yellow-300" },
  typescript: { label: "TypeScript", ext: "ts", className: "bg-blue-500/15 text-blue-600 dark:text-blue-300" },
  go: { label: "Go", ext: "go", className: "bg-cyan-500/15 text-cyan-700 dark:text-cyan-300" },
  sql: { label: "SQL", ext: "sql", className: "bg-violet-500/15 text-violet-600 dark:text-violet-300" },
  java: { label: "Java", ext: "java", className: "bg-orange-500/15 text-orange-700 dark:text-orange-300" },
};

const DIFFICULTY_DOTS: Record<Difficulty, number> = { easy: 1, medium: 2, hard: 3 };

function fileNameFor(title: string, language: Language): string {
  const words = title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().split(" ");
  const ext = LANGUAGE_META[language].ext;
  if (language === "java") return `${words.map((w) => w[0].toUpperCase() + w.slice(1)).join("")}.java`;
  if (language === "javascript" || language === "typescript") {
    return `${words.map((w, i) => (i ? w[0].toUpperCase() + w.slice(1) : w)).join("")}.${ext}`;
  }
  return `${words.join("_")}.${ext}`;
}

export function Game({ daily }: { daily: DailyPuzzle }) {
  const { day, puzzle, lines } = daily;
  const hydrated = useHydrated();
  const stored = useGameState();
  const stats = useStats();
  const game: GameState | null = stored && stored.day === day && stored.puzzleId === puzzle.id ? stored : null;
  const staleTab = stored !== null && stored.day > day;

  const [selected, setSelected] = useState<number | null>(null);
  const [shake, setShake] = useState<{ line: number; key: number } | null>(null);
  const resultRef = useRef<HTMLElement>(null);
  const scrollOnDone = useRef(false);

  // Start (or replace yesterday's) game once we know what's in storage.
  useEffect(() => {
    if (!hydrated || game || staleTab) return;
    gameStore.set(createGame(day, puzzle, Date.now()));
    track("puzzle_started", { day, puzzleId: puzzle.id, difficulty: puzzle.difficulty });
  }, [hydrated, game, staleTab, day, puzzle]);

  useEffect(() => {
    if (game?.phase === "done" && scrollOnDone.current) {
      scrollOnDone.current = false;
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [game?.phase]);

  const now = useNow(1000, game?.phase === "find");
  const seconds = game ? elapsedSeconds(game, now) : 0;
  const streak = liveStreak(stats, day);

  const marks = useMemo(() => {
    const m = new Map<number, LineMark>();
    game?.guesses.forEach((g) => m.set(g.line, g.result));
    if (game?.outcome === "lost") m.set(puzzle.bugLine, "reveal");
    return m;
  }, [game, puzzle.bugLine]);

  function guess(line: number) {
    if (!game || game.phase !== "find") return;
    const next = submitGuess(game, line, puzzle.bugLine, Date.now());
    if (next === game) return;
    const last = next.guesses[next.guesses.length - 1];

    track("line_guessed", { day, attempt: next.guesses.length, result: last.result });
    if (last.result !== "found") setShake({ line, key: Date.now() });
    setSelected(null);

    if (next.outcome && !game.outcome) {
      const secs = elapsedSeconds(next, Date.now());
      statsStore.set(recordGame(statsStore.get() ?? stats, day, next.outcome, next.guesses.length));
      track(next.outcome === "won" ? "puzzle_solved" : "puzzle_failed", {
        day,
        attempts: next.guesses.length,
        seconds: secs,
      });
      if (next.phase === "done") scrollOnDone.current = true;
    }
    gameStore.set(next);
  }

  function pickBugType(choice: BugType) {
    if (!game) return;
    scrollOnDone.current = true;
    gameStore.set(submitBugType(game, choice));
  }

  const lastGuess = game?.guesses[game.guesses.length - 1];
  const lang = LANGUAGE_META[puzzle.language];

  return (
    <>
      <main className="mx-auto w-full max-w-2xl flex-1 px-4 pt-5 pb-10">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-mono text-xs uppercase tracking-widest text-accent">Day {day}</p>
            <h1 className="mt-1 text-xl font-bold tracking-tight sm:text-2xl">{puzzle.title}</h1>
          </div>
          <div
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 font-mono text-sm tabular-nums text-muted"
            aria-label={`Time: ${formatDuration(seconds)}`}
            role="timer"
          >
            <ClockIcon width={14} height={14} />
            {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, "0")}
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className={`rounded-md px-2 py-0.5 font-mono font-semibold ${lang.className}`}>{lang.label}</span>
          <span className="flex items-center gap-1.5 rounded-md bg-surface-2 px-2 py-0.5 font-mono capitalize text-muted">
            <span className="flex gap-0.5" aria-hidden>
              {[1, 2, 3].map((d) => (
                <span key={d} className={`h-1.5 w-1.5 rounded-full ${d <= DIFFICULTY_DOTS[puzzle.difficulty] ? "bg-fg" : "bg-border"}`} />
              ))}
            </span>
            {puzzle.difficulty}
          </span>
        </div>

        <div className="mt-4 rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent-soft text-sm" aria-hidden>
              🤖
            </span>
            <span className="font-mono font-semibold">ai-assistant</span>
            <span className="text-muted">opened</span>
            <span className="font-mono text-muted">#{1000 + day}</span>
            <span className="ml-auto rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[11px] font-semibold text-accent">
              open
            </span>
          </div>
          <p className="mt-2 text-[15px] leading-relaxed">{puzzle.prContext}</p>
          <p className="mt-2 font-mono text-xs text-muted">✓ CI passing · 1 file changed · 1 bug hiding</p>
        </div>

        {staleTab && (
          <div role="alert" className="mt-4 rounded-xl border border-warm/40 bg-warm-soft p-4 text-sm">
            A new bug is live.{" "}
            <button type="button" onClick={() => window.location.reload()} className="font-semibold underline underline-offset-4">
              Refresh to play
            </button>
          </div>
        )}

        <div className="mt-4">
          <CodeBlock
            lines={lines}
            fileName={fileNameFor(puzzle.title, puzzle.language)}
            marks={marks}
            selected={selected}
            interactive={game?.phase === "find"}
            shake={shake}
            onSelect={setSelected}
            onSubmit={guess}
          />
        </div>

        <div aria-live="polite" className="mt-3 min-h-6 text-center text-sm">
          {game?.phase === "find" && lastGuess && (
            <p key={game.guesses.length} className="animate-fade-up">
              {lastGuess.result === "warm" ? (
                <span className="font-semibold text-warm">🔥 Warm: the bug is within {WARM_DISTANCE} lines.</span>
              ) : (
                <span className="font-semibold text-sky-500">❄️ Cold: not even close.</span>
              )}{" "}
              <span className="text-muted">
                {attemptsLeft(game)} {attemptsLeft(game) === 1 ? "attempt" : "attempts"} left.
              </span>
            </p>
          )}
          {game?.phase === "find" && !lastGuess && (
            <p className="text-muted">Tap the line you think has the bug, then submit.</p>
          )}
        </div>

        {game?.phase === "name" && (
          <div className="mt-2">
            <BugTypePicker options={game.bugTypeOptions} onPick={pickBugType} />
          </div>
        )}

        {game?.phase === "done" && (
          <div className="mt-2">
            <ResultScreen ref={resultRef} daily={daily} game={game} seconds={seconds} streak={streak} />
          </div>
        )}
      </main>

      {game?.phase === "find" && (
        <div id="submit-bar" className="fixed inset-x-0 bottom-0 z-10 border-t border-border bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/75">
          <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted">Attempts</span>
              <div className="flex gap-1" role="img" aria-label={`${attemptsLeft(game)} of ${MAX_ATTEMPTS} attempts left`}>
                {Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
                  const g = game.guesses[i];
                  return (
                    <span
                      key={i}
                      className={`h-3 w-3 rounded-[3px] ${g ? (g.result === "warm" ? "bg-warm" : "bg-danger") : "bg-surface-2 ring-1 ring-border"}`}
                    />
                  );
                })}
              </div>
            </div>
            <p className="min-w-0 flex-1 truncate text-center font-mono text-sm text-muted">
              {selected ? (
                <>
                  line <span className="font-semibold text-fg">{selected}</span> selected
                </>
              ) : (
                "pick a line"
              )}
            </p>
            <button
              type="button"
              disabled={selected === null}
              onClick={() => selected !== null && guess(selected)}
              className="min-h-12 rounded-xl bg-accent px-6 font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select-ring active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-40"
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </>
  );
}
