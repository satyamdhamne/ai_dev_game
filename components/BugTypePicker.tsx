"use client";

import type { BugType } from "@/lib/types";

export function BugTypePicker({ options, onPick }: { options: BugType[]; onPick: (choice: BugType) => void }) {
  return (
    <section aria-labelledby="bugtype-heading" className="animate-fade-up rounded-2xl border border-accent/40 bg-surface p-4 sm:p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Bonus round</p>
      <h2 id="bugtype-heading" className="mt-1 text-lg font-semibold">
        Nice catch. Now name the bug.
      </h2>
      <p className="mt-1 text-sm text-muted">One shot. Doesn&apos;t affect your win, only your bragging rights.</p>
      <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {options.map((opt, i) => (
          <button
            key={opt}
            type="button"
            onClick={() => onPick(opt)}
            autoFocus={i === 0}
            className="min-h-12 rounded-xl border border-border bg-surface-2 px-4 py-2.5 text-left font-mono text-sm transition hover:border-accent hover:bg-accent-soft focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select-ring active:scale-[0.98]"
          >
            {opt}
          </button>
        ))}
      </div>
    </section>
  );
}
