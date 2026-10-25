import { Breadcrumbs } from "@/components/interview/Breadcrumbs";
import { PlayCta } from "@/components/interview/PlayCta";
import { BUG_TOPICS, HUB_FAQ, LANGUAGE_TOPICS, practiceQuestions, questionsForBugType, questionsForLanguage } from "@/lib/interview";
import { absoluteUrl, breadcrumbs, jsonLd, publisher } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";

const TITLE = "Find-the-Bug Coding Interview Questions (with Answers)";
const DESCRIPTION = `${practiceQuestions.length} spot-the-bug coding interview questions with answers and fixes in Python, JavaScript, TypeScript, Go, Java and SQL. Practice debugging and code review for technical interviews.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/interview-questions" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/interview-questions", type: "website" },
  twitter: { title: TITLE, description: DESCRIPTION },
};

const CRUMBS = [
  { name: "Home", path: "/" },
  { name: "Interview questions", path: "/interview-questions" },
];

export default function InterviewQuestionsHub() {
  const structured = [
    breadcrumbs(CRUMBS),
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: TITLE,
      description: DESCRIPTION,
      url: absoluteUrl("/interview-questions"),
      publisher,
      hasPart: [
        ...LANGUAGE_TOPICS.map((t) => ({ "@type": "WebPage", name: t.headline, url: absoluteUrl(`/interview-questions/${t.slug}`) })),
        ...BUG_TOPICS.map((t) => ({ "@type": "WebPage", name: `${t.name} interview questions`, url: absoluteUrl(`/interview-questions/bugs/${t.slug}`) })),
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: HUB_FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)} />
      <Breadcrumbs items={CRUMBS} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Find-the-bug coding interview questions</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">
        Debugging and code-review rounds are now a standard part of technical interviews, and with AI writing more code,
        reading it critically matters more than ever. Here are {practiceQuestions.length} short, realistic snippets, each with
        exactly one real bug, a clear explanation and a production-ready fix.
      </p>

      <section aria-labelledby="by-language" className="mt-10">
        <h2 id="by-language" className="text-xl font-bold tracking-tight">
          Interview questions by language
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {LANGUAGE_TOPICS.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/interview-questions/${t.slug}`}
                className="block h-full rounded-2xl border border-border bg-surface p-4 transition hover:border-accent focus-visible:outline-2 focus-visible:outline-select-ring"
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{t.name}</span>
                  <span className="font-mono text-xs text-muted">{questionsForLanguage(t.slug).length} questions</span>
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted">{t.gotchas.slice(0, 2).join(" ")}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="by-bug" className="mt-10">
        <h2 id="by-bug" className="text-xl font-bold tracking-tight">
          Interview questions by bug type
        </h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {BUG_TOPICS.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/interview-questions/bugs/${t.slug}`}
                className="flex h-full items-center justify-between gap-3 rounded-2xl border border-border bg-surface px-4 py-3 transition hover:border-accent focus-visible:outline-2 focus-visible:outline-select-ring"
              >
                <span className="font-semibold">{t.name}</span>
                <span className="shrink-0 font-mono text-xs text-muted">{questionsForBugType(t.bugType).length} questions</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how" className="mt-10 rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <h2 id="how" className="text-xl font-bold tracking-tight">
          How to answer a spot-the-bug interview question
        </h2>
        <ol className="mt-3 list-decimal space-y-2 pl-5 leading-relaxed">
          <li>Say what the code is supposed to do, in one sentence.</li>
          <li>Walk through it with a normal input, then with edge inputs: empty, zero, null, very large, concurrent calls.</li>
          <li>Point to the exact line and explain what breaks, for whom, and when.</li>
          <li>Propose the smallest correct fix, then mention how you&apos;d test it.</li>
          <li>Offer a follow-up: how to prevent the whole class of bug (types, linters, tests, code review checklists).</li>
        </ol>
      </section>

      <div className="mt-10">
        <PlayCta />
      </div>

      <section aria-labelledby="faq" className="mt-10">
        <h2 id="faq" className="text-xl font-bold tracking-tight">
          FAQ
        </h2>
        <div className="mt-4 space-y-3">
          {HUB_FAQ.map((f) => (
            <details key={f.q} className="rounded-xl border border-border bg-surface px-4 open:pb-4">
              <summary className="flex min-h-12 cursor-pointer items-center font-semibold">{f.q}</summary>
              <p className="leading-relaxed text-muted">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </main>
  );
}
