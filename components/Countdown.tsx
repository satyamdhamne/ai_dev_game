"use client";

import { msUntilNextPuzzle } from "@/lib/day";
import { useNow } from "@/lib/useNow";
import { useEffect } from "react";

function format(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h, m, s].map((n) => String(n).padStart(2, "0")).join(":");
}

/** Time until the next midnight IST. Reloads the page when a new puzzle drops. */
export function Countdown({ className = "" }: { className?: string }) {
  const now = useNow(1000);
  const remaining = msUntilNextPuzzle(new Date(now));

  useEffect(() => {
    // Rollover happens at midnight IST; once we cross it, fetch the new day.
    const id = window.setTimeout(() => window.location.reload(), msUntilNextPuzzle() + 1500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div className={className}>
      <p className="font-mono text-[11px] uppercase tracking-widest text-muted">Next bug in</p>
      <p className="font-mono text-2xl font-semibold tabular-nums" suppressHydrationWarning>
        {format(remaining)}
      </p>
    </div>
  );
}
