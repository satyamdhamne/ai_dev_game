"use client";

import { liveStreak, winPercent, type DistributionKey } from "@/lib/stats";
import { useGameState, useStats } from "@/lib/store";
import { Countdown } from "./Countdown";
import { Modal } from "./Modal";

const KEYS: DistributionKey[] = ["1", "2", "3", "X"];

export function StatsModal({ open, onClose, today }: { open: boolean; onClose: () => void; today: number | null }) {
  const stats = useStats();
  const game = useGameState();
  const day = today ?? stats.lastPlayedDay ?? 0;
  const max = Math.max(1, ...KEYS.map((k) => stats.distribution[k]));
  const playedToday = game?.day === day && game.outcome !== null;
  const todayKey: DistributionKey | null = playedToday
    ? game.outcome === "won"
      ? (String(game.guesses.length) as DistributionKey)
      : "X"
    : null;

  return (
    <Modal open={open} onClose={onClose} title="Statistics">
      <dl className="grid grid-cols-4 gap-2 text-center">
        <Stat label="Played" value={stats.played} />
        <Stat label="Win %" value={winPercent(stats)} />
        <Stat label="Streak" value={liveStreak(stats, day)} />
        <Stat label="Max" value={stats.maxStreak} />
      </dl>

      <h3 className="mt-6 mb-3 font-mono text-xs uppercase tracking-widest text-muted">Attempts distribution</h3>
      <ul className="space-y-1.5" aria-label="Attempts distribution">
        {KEYS.map((k) => {
          const count = stats.distribution[k];
          const pct = Math.max(8, (count / max) * 100);
          const current = k === todayKey;
          return (
            <li key={k} className="flex items-center gap-2 font-mono text-sm">
              <span className="w-4 text-right text-muted">{k}</span>
              <div className="flex-1">
                <div
                  className={`flex h-6 items-center justify-end rounded-md px-2 text-xs font-semibold transition-all ${
                    current ? (k === "X" ? "bg-danger text-white" : "bg-accent text-accent-fg") : "bg-surface-2 text-fg"
                  }`}
                  style={{ width: `${pct}%` }}
                  aria-label={`${k === "X" ? "Missed" : `${k} attempt${k === "1" ? "" : "s"}`}: ${count}`}
                >
                  {count}
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {playedToday && <Countdown className="mt-6 border-t border-border pt-5 text-center" />}
    </Modal>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl bg-surface-2 px-1 py-3">
      <dd className="font-mono text-2xl font-semibold tabular-nums">{value}</dd>
      <dt className="mt-0.5 text-[11px] uppercase tracking-wider text-muted">{label}</dt>
    </div>
  );
}
