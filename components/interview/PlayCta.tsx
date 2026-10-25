import Link from "next/link";

export function PlayCta() {
  return (
    <aside className="rounded-2xl border border-accent/40 bg-accent-soft p-5 sm:p-6">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">Daily practice</p>
      <h2 className="mt-1 text-xl font-bold tracking-tight">One new AI bug every day</h2>
      <p className="mt-1 leading-relaxed">
        Spot the AI Bug is a free Wordle-style game: find the buggy line in an AI-written pull request in 3 attempts, name
        the bug and keep your streak alive. Five minutes a day keeps your code-review instincts sharp for interviews.
      </p>
      <Link
        href="/"
        className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-accent px-5 font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select-ring"
      >
        Play today&apos;s bug →
      </Link>
    </aside>
  );
}
