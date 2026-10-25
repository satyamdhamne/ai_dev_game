import { MAX_ATTEMPTS, WARM_DISTANCE } from "@/lib/config";

const Square = ({ color, label }: { color: string; label: string }) => (
  <span className={`inline-block h-4 w-4 rounded-[3px] align-[-2px] ${color}`} role="img" aria-label={label} />
);

export function HowToPlayContent() {
  return (
    <div className="space-y-5 text-[15px] leading-relaxed">
      <p>
        Every day, everyone gets the same <strong>pull request written by AI</strong>. It looks clean. It has comments. It
        has exactly <strong>one real bug</strong>.
      </p>
      <ol className="space-y-3">
        <Step n={1} title="Find the line">
          Tap the buggy line, then hit <Kbd>Submit</Kbd>. You get {MAX_ATTEMPTS} attempts.
        </Step>
        <Step n={2} title="Read the hints">
          A miss within {WARM_DISTANCE} lines is <span className="font-medium text-warm">🔥 Warm</span>. Anything further
          is <span className="font-medium text-sky-500">❄️ Cold</span>.
        </Step>
        <Step n={3} title="Name the bug">
          Found it? Bonus round: pick the bug type from 4 options. It doesn&apos;t affect your win, just your bragging
          rights.
        </Step>
      </ol>
      <div className="rounded-xl border border-border bg-surface-2 p-4 font-mono text-sm">
        <p className="mb-2 text-muted">{"// your share card"}</p>
        <p className="flex items-center gap-1">
          <Square color="bg-danger" label="cold miss" />
          <Square color="bg-warm" label="warm miss" />
          <Square color="bg-accent" label="found" />
          <span className="ml-2">found in 3/3</span>
        </p>
        <p className="mt-2 text-xs text-muted">🟥 cold miss · 🟨 warm miss · 🟩 found · ⬛ unused</p>
      </div>
      <p className="text-sm text-muted">
        Keyboard: <Kbd>↑</Kbd> <Kbd>↓</Kbd> to move between lines, <Kbd>Enter</Kbd> to submit. A new bug drops every day
        at midnight IST.
      </p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-accent-soft font-mono text-xs font-bold text-accent">
        {n}
      </span>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-muted">{children}</p>
      </div>
    </li>
  );
}

function Kbd({ children }: { children: React.ReactNode }) {
  return (
    <kbd className="rounded border border-border bg-surface px-1.5 py-0.5 font-mono text-[0.8em] text-fg">{children}</kbd>
  );
}
