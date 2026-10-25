import { Game } from "@/components/Game";
import { LANGUAGE_LABEL } from "@/components/interview/labels";
import { SITE_NAME, SITE_URL, TAGLINE } from "@/lib/config";
import { BUG_TOPICS, LANGUAGE_TOPICS } from "@/lib/interview";
import { jsonLd } from "@/lib/seo";
import Link from "next/link";
import { getDailyPuzzle } from "@/lib/daily";
import { getDayNumber } from "@/lib/day";
import { connection } from "next/server";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <Suspense fallback={<GameSkeleton />}>
        <TodayGame />
      </Suspense>
      <About />
    </>
  );
}

const STRUCTURED = [
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: TAGLINE,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE_NAME,
    url: SITE_URL,
    applicationCategory: "GameApplication",
    operatingSystem: "Any",
    browserRequirements: "Requires JavaScript",
    description:
      "A daily Wordle-style game for developers: find the one real bug in an AI-written pull request, then name the bug type.",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  },
];

/** Static, crawlable copy below the game: what this is and where to practice more. */
function About() {
  return (
    <section aria-labelledby="about-heading" className="mx-auto w-full max-w-2xl px-4 pb-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(STRUCTURED)} />
      <div className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <h2 id="about-heading" className="text-lg font-bold tracking-tight">
          A daily debugging workout for developers
        </h2>
        <p className="mt-2 leading-relaxed text-muted">
          Every day, everyone gets the same short pull request written by AI with exactly one real bug: off-by-one
          errors, SQL injection, race conditions, resource leaks and more. Find the line in three attempts, name the bug,
          and share your streak. It&apos;s the fastest way to sharpen the code-review skills that debugging and
          code-review interview rounds test.
        </p>
        <h3 className="mt-5 font-mono text-xs uppercase tracking-widest text-muted">Coding interview questions</h3>
        <ul className="mt-2 flex flex-wrap gap-2">
          {LANGUAGE_TOPICS.map((t) => (
            <li key={t.slug}>
              <Link href={`/interview-questions/${t.slug}`} className="inline-block rounded-lg border border-border px-3 py-1.5 text-sm hover:border-accent">
                {LANGUAGE_LABEL[t.slug]}
              </Link>
            </li>
          ))}
          {BUG_TOPICS.slice(0, 4).map((t) => (
            <li key={t.slug}>
              <Link href={`/interview-questions/bugs/${t.slug}`} className="inline-block rounded-lg border border-border px-3 py-1.5 text-sm hover:border-accent">
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/interview-questions" className="mt-4 inline-block font-semibold text-accent underline-offset-4 hover:underline">
          Browse all find-the-bug interview questions →
        </Link>
      </div>
    </section>
  );
}

async function TodayGame() {
  // "Today" depends on the request time (midnight IST rollover).
  await connection();
  const daily = await getDailyPuzzle(getDayNumber());
  return <Game daily={daily} />;
}

function GameSkeleton() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 animate-pulse px-4 pt-5" aria-busy="true" aria-label="Loading today's bug">
      <div className="h-3 w-16 rounded bg-surface-2" />
      <div className="mt-2 h-7 w-2/3 rounded bg-surface-2" />
      <div className="mt-4 h-24 rounded-2xl bg-surface-2" />
      <div className="mt-4 h-96 rounded-2xl bg-surface-2" />
    </main>
  );
}
