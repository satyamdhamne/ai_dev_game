"use client";

import { track } from "@/lib/analytics";
import { MAX_ATTEMPTS } from "@/lib/config";
import { formatDuration, type GameState } from "@/lib/game";
import { buildShareText } from "@/lib/share";
import type { DailyPuzzle, GuessResult } from "@/lib/types";
import Link from "next/link";
import { useState, type Ref } from "react";
import { useShell } from "./AppShell";
import { Countdown } from "./Countdown";
import { DiffView } from "./DiffView";
import { InlineCode } from "./InlineCode";
import { LANGUAGE_LABEL } from "./interview/labels";
import { ChartIcon, LockIcon, ShareIcon } from "./icons";
import { WaitlistForm } from "./WaitlistForm";

const SQUARE: Record<GuessResult, string> = { cold: "bg-danger", warm: "bg-warm", found: "bg-accent" };
const SQUARE_LABEL: Record<GuessResult, string> = { cold: "cold miss", warm: "warm miss", found: "found" };

interface Props {
  daily: DailyPuzzle;
  game: GameState;
  seconds: number;
  streak: number;
  ref?: Ref<HTMLElement>;
}

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }
}

export function ResultScreen({ daily, game, seconds, streak, ref }: Props) {
  const { puzzle } = daily;
  const { openStats } = useShell();
  const [toast, setToast] = useState("");
  const won = game.outcome === "won";
  const bugTypeCorrect = game.bugTypeGuess === puzzle.bugType;

  async function share() {
    const text = buildShareText(game, puzzle.bugType, seconds, streak);
    const mobile = window.matchMedia("(pointer: coarse)").matches;
    if (mobile && typeof navigator.share === "function") {
      track("share_clicked", { method: "native", day: game.day });
      try {
        await navigator.share({ text });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        // Fall through to clipboard.
      }
    } else {
      track("share_clicked", { method: "clipboard", day: game.day });
    }
    const ok = await copyText(text);
    setToast(ok ? "Copied to clipboard" : "Couldn't copy. Long-press to copy instead.");
    window.setTimeout(() => setToast(""), 2200);
  }

  return (
    <section ref={ref} aria-labelledby="result-heading" className="animate-fade-up scroll-mt-20 space-y-4">
      <div className="rounded-2xl border border-border bg-surface p-5 text-center sm:p-6">
        <p className="font-mono text-xs uppercase tracking-widest text-muted">Day {game.day}</p>
        <h2 id="result-heading" className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          {won ? (game.guesses.length === 1 ? "First try. Ruthless. 🐛" : "Caught it. 🐛") : "The bug got away."}
        </h2>
        <p className="mt-1 text-sm text-muted">
          {won ? "That one would've made it past half the reviewers on your team." : `It was hiding on line ${puzzle.bugLine}.`}
        </p>

        <div className="mt-4 flex justify-center gap-1.5" role="img" aria-label={`Guesses: ${game.guesses.map((g) => SQUARE_LABEL[g.result]).join(", ") || "none"}`}>
          {Array.from({ length: MAX_ATTEMPTS }, (_, i) => {
            const g = game.guesses[i];
            return <span key={i} className={`h-7 w-7 rounded-md ${g ? SQUARE[g.result] : "bg-surface-2 ring-1 ring-border"}`} />;
          })}
        </div>

        <dl className="mt-5 grid grid-cols-3 gap-2">
          <ResultStat label="Attempts" value={won ? `${game.guesses.length}/${MAX_ATTEMPTS}` : `X/${MAX_ATTEMPTS}`} />
          <ResultStat label="Time" value={formatDuration(seconds)} />
          <ResultStat label="Bug type" value={game.bugTypeGuess === null ? "—" : bugTypeCorrect ? "✅" : "❌"} />
        </dl>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={share}
            className="flex min-h-12 flex-1 items-center justify-center gap-2 rounded-xl bg-accent font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select-ring active:scale-[0.98]"
          >
            <ShareIcon /> Share result
          </button>
          <button
            type="button"
            onClick={openStats}
            aria-label="Open statistics"
            className="flex min-h-12 items-center justify-center rounded-xl border border-border px-4 text-muted transition hover:bg-surface-2 hover:text-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select-ring"
          >
            <ChartIcon />
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-2 h-5 font-mono text-xs text-accent">
          {toast}
        </p>

        <Countdown className="mt-2 border-t border-border pt-4" />
      </div>

      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-danger-soft px-2 py-0.5 font-mono text-xs font-semibold text-danger">
            line {puzzle.bugLine}
          </span>
          <span className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-xs font-semibold">{puzzle.bugType}</span>
        </div>
        {game.bugTypeGuess !== null && (
          <p className="mt-3 text-sm">
            {bugTypeCorrect ? (
              <span className="text-accent">✅ You named it: {puzzle.bugType}.</span>
            ) : (
              <span className="text-danger">
                ❌ You said <strong>{game.bugTypeGuess}</strong>.
              </span>
            )}
          </p>
        )}
        <h3 className="mt-4 font-mono text-xs uppercase tracking-widest text-muted">What breaks</h3>
        <p className="mt-1.5 leading-relaxed">
          <InlineCode text={puzzle.explanation} />
        </p>

        <h3 className="mt-5 mb-2 font-mono text-xs uppercase tracking-widest text-muted">The fix</h3>
        <DiffView rows={daily.diff} />
        <Link
          href={`/interview-questions/${puzzle.language}`}
          className="mt-4 inline-block text-sm font-semibold text-accent underline-offset-4 hover:underline"
        >
          Want more? Practice {LANGUAGE_LABEL[puzzle.language]} find-the-bug interview questions →
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="font-mono text-xs uppercase tracking-widest text-muted">Why AI does this</h3>
          <span className="flex items-center gap-1 rounded-full bg-warm-soft px-2.5 py-0.5 font-mono text-xs font-semibold text-warm">
            <LockIcon width={12} height={12} /> Pro
          </span>
        </div>
        {/* Real text, blurred: a teaser, not a secret. */}
        <p className="mt-2 select-none leading-relaxed blur-[5px]" aria-hidden>
          <InlineCode text={puzzle.whyAiDoesThis} />
        </p>
        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
          <p className="mb-3 text-sm">
            <strong>Pro is coming:</strong> why LLMs make each mistake, the full archive, and team leaderboards.
          </p>
          <WaitlistForm source="result_pro_lock" compact />
        </div>
      </div>
    </section>
  );
}

function ResultStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 py-2.5">
      <dd className="font-mono text-lg font-semibold tabular-nums">{value}</dd>
      <dt className="text-[11px] uppercase tracking-wider text-muted">{label}</dt>
    </div>
  );
}
