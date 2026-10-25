import { Breadcrumbs } from "@/components/interview/Breadcrumbs";
import { PlayCta } from "@/components/interview/PlayCta";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { InlineCode } from "@/components/InlineCode";
import { BUG_TOPICS, getBugTopic, questionsForBugType } from "@/lib/interview";
import { absoluteUrl, breadcrumbs, jsonLd, publisher } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return BUG_TOPICS.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getBugTopic((await params).slug);
  if (!topic) return {};
  const title = `${topic.name}: interview questions & examples`;
  const path = `/interview-questions/bugs/${topic.slug}`;
  return {
    title,
    description: topic.description,
    alternates: { canonical: path },
    openGraph: { title, description: topic.description, url: path, type: "article" },
    twitter: { title, description: topic.description },
  };
}

export default async function BugTypePage({ params }: Props) {
  const topic = getBugTopic((await params).slug);
  if (!topic) notFound();
  const questions = questionsForBugType(topic.bugType);
  const path = `/interview-questions/bugs/${topic.slug}`;
  const crumbs = [
    { name: "Home", path: "/" },
    { name: "Interview questions", path: "/interview-questions" },
    { name: topic.name, path },
  ];

  const structured = [
    breadcrumbs(crumbs),
    {
      "@context": "https://schema.org",
      "@type": "Quiz",
      name: `${topic.name} interview questions`,
      description: topic.description,
      url: absoluteUrl(path),
      inLanguage: "en",
      about: { "@type": "Thing", name: topic.name },
      publisher,
      hasPart: questions.map((q) => ({
        "@type": "Question",
        eduQuestionType: "Flashcard",
        name: q.title,
        text: `${q.prompt}\n\n${q.code}`,
        acceptedAnswer: { "@type": "Answer", text: `Line ${q.bugLine}: ${q.answer}` },
      })),
    },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{topic.name}: interview questions</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">
        <InlineCode text={topic.definition} />
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section aria-labelledby="spot" className="rounded-2xl border border-border bg-surface p-5">
          <h2 id="spot" className="text-lg font-bold tracking-tight">
            How to spot it in code review
          </h2>
          <ul className="mt-3 space-y-2 text-[15px] leading-relaxed">
            {topic.howToSpot.map((h) => (
              <li key={h} className="flex gap-2">
                <span className="font-mono text-accent" aria-hidden>
                  ▸
                </span>
                <span>
                  <InlineCode text={h} />
                </span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="why-ai" className="rounded-2xl border border-border bg-surface p-5">
          <h2 id="why-ai" className="text-lg font-bold tracking-tight">
            Why AI-generated code gets this wrong
          </h2>
          <p className="mt-3 text-[15px] leading-relaxed">{topic.whyAi}</p>
        </section>
      </div>

      <section aria-labelledby="questions" className="mt-10">
        <h2 id="questions" className="text-xl font-bold tracking-tight">
          {topic.name}: {questions.length} practice questions
        </h2>
        <div className="mt-4 space-y-5">
          {questions.map((q, i) => (
            <QuestionCard key={q.slug} q={q} index={i + 1} show="language" />
          ))}
        </div>
      </section>

      <div className="mt-10">
        <PlayCta />
      </div>

      <nav aria-labelledby="related" className="mt-10">
        <h2 id="related" className="text-lg font-bold tracking-tight">
          More bug types
        </h2>
        <ul className="mt-3 flex flex-wrap gap-2">
          {BUG_TOPICS.filter((t) => t.slug !== topic.slug).map((t) => (
            <li key={t.slug}>
              <Link href={`/interview-questions/bugs/${t.slug}`} className="inline-block rounded-lg border border-border px-3 py-1.5 text-sm hover:border-accent">
                {t.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
