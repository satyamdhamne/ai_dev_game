import { LockIcon } from "@/components/icons";
import { WaitlistForm } from "@/components/WaitlistForm";
import { getDayNumber } from "@/lib/day";
import { getPuzzleForDay } from "@/lib/puzzles";
import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Archive",
  description: "Every past Spot the AI Bug puzzle. Coming soon with Pro.",
};

export default function ArchivePage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">{"// archive"}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">Past bugs</h1>

      <div className="mt-6 rounded-2xl border border-warm/40 bg-surface p-5 sm:p-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-warm-soft px-2.5 py-0.5 font-mono text-xs font-semibold text-warm">
          <LockIcon width={12} height={12} /> Pro: coming soon
        </span>
        <p className="mt-3 leading-relaxed">
          Missed a day? Replay every past bug, see why AI makes each mistake, and practice by language or bug type.
        </p>
        <div className="mt-4">
          <WaitlistForm source="archive" />
        </div>
      </div>

      <Suspense fallback={<div className="mt-6 h-40 animate-pulse rounded-2xl bg-surface-2" />}>
        <PastDays />
      </Suspense>
    </main>
  );
}

async function PastDays() {
  await connection();
  const today = getDayNumber();
  const days = Array.from({ length: today - 1 }, (_, i) => today - 1 - i);

  if (days.length === 0) {
    return (
      <p className="mt-6 rounded-2xl border border-dashed border-border p-6 text-center font-mono text-sm text-muted">
        Day 1 is today. The archive starts tomorrow.
      </p>
    );
  }

  return (
    <ul className="mt-6 divide-y divide-border overflow-hidden rounded-2xl border border-border bg-surface" aria-label="Past puzzles">
      {days.map((day) => (
        <li key={day} className="flex items-center gap-3 px-4 py-3.5">
          <span className="w-14 shrink-0 font-mono text-xs text-muted">Day {day}</span>
          <span className="min-w-0 flex-1 truncate">{getPuzzleForDay(day).title}</span>
          <LockIcon width={16} height={16} className="shrink-0 text-muted" aria-label="Locked" />
        </li>
      ))}
    </ul>
  );
}
