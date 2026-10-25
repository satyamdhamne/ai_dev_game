import { HowToPlayContent } from "@/components/HowToPlayContent";
import { TAGLINE } from "@/lib/config";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How to play",
  description: "Find the one real bug in today's AI-written pull request in 3 attempts, then name it.",
  alternates: { canonical: "/how-to-play" },
};

export default function HowToPlayPage() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-8">
      <p className="font-mono text-xs uppercase tracking-widest text-accent">{"// rules"}</p>
      <h1 className="mt-1 text-3xl font-bold tracking-tight">How to play</h1>
      <p className="mt-2 text-muted">{TAGLINE}</p>
      <div className="mt-6 rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <HowToPlayContent />
      </div>
      <Link
        href="/"
        className="mt-6 flex min-h-12 items-center justify-center rounded-xl bg-accent font-semibold text-accent-fg transition hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select-ring"
      >
        Play today&apos;s bug →
      </Link>
    </main>
  );
}
