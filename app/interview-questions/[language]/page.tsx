import { Breadcrumbs } from "@/components/interview/Breadcrumbs";
import { PlayCta } from "@/components/interview/PlayCta";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { bugTopicFor, getLanguageTopic, LANGUAGE_TOPICS, questionsForLanguage } from "@/lib/interview";
import { absoluteUrl, breadcrumbs, jsonLd, publisher } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

type Props = { params: Promise<{ language: string }> };

export function generateStaticParams() {
  return LANGUAGE_TOPICS.map((t) => ({ language: t.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const topic = getLanguageTopic((await params).language);
  if (!topic) return {};
  const title = `${topic.headline} (with answers)`;
  const path = `/interview-questions/${topic.slug}`;
  return {
    title,
    description: topic.description,
    alternates: { canonical: path },
    openGraph: { title, description: topic.description, url: path, type: "article" },
    twitter: { title, description: topic.description },
  };
}

export default async function LanguagePage({ params }: Props) {
  const topic = getLanguageTopic((await params).language);
  if (!topic) notFound();
  const questions = questionsForLanguage(topic.slug);
  const path = `/interview-questions/${topic.slug}`;
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
      name: topic.headline,
      description: topic.description,
      url: absoluteUrl(path),
      inLanguage: "en",
      educationalLevel: "intermediate",
      about: { "@type": "Thing", name: `${topic.name} debugging` },
      publisher,
      hasPart: questions.map((q) => ({
        "@type": "Question",
        eduQuestionType: "Flashcard",
        name: q.title,
        text: `${q.prompt}\n\n${q.code}`,
        acceptedAnswer: { "@type": "Answer", text: `Line ${q.bugLine} (${q.bugType}): ${q.answer}` },
      })),
    },
  ];

  const others = LANGUAGE_TOPICS.filter((t) => t.slug !== topic.slug);
  const bugTypes = [...new Set(questions.map((q) => q.bugType))].map(bugTopicFor);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(structured)} />
      <Breadcrumbs items={crumbs} />
      <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{topic.headline}</h1>
      <p className="mt-3 text-lg leading-relaxed text-muted">{topic.intro}</p>

      <section aria-labelledby="gotchas" className="mt-8 rounded-2xl border border-border bg-surface p-5 sm:p-6">
        <h2 id="gotchas" className="text-lg font-bold tracking-tight">
          {topic.name} gotchas interviewers love
        </h2>
        <ul className="mt-3 space-y-2 leading-relaxed">
          {topic.gotchas.map((g) => (
            <li key={g} className="flex gap-2">
              <span className="font-mono text-accent" aria-hidden>
                ▸
              </span>
              {g}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="questions" className="mt-10">
        <h2 id="questions" className="text-xl font-bold tracking-tight">
          {questions.length} {topic.name} spot-the-bug questions
        </h2>
        <p className="mt-1 text-sm text-muted">Each snippet has exactly one bug. Find the line before you open the answer.</p>
        <div className="mt-4 space-y-5">
          {questions.map((q, i) => (
            <QuestionCard key={q.slug} q={q} index={i + 1} show="bugType" />
          ))}
        </div>
      </section>

      <div className="mt-10">
        <PlayCta />
      </div>

      <nav aria-labelledby="related" className="mt-10">
        <h2 id="related" className="text-lg font-bold tracking-tight">
          Keep practicing
        </h2>
        <p className="mt-2 text-sm text-muted">Bug types covered on this page:</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {bugTypes.map((b) => (
            <li key={b.slug}>
              <Link href={`/interview-questions/bugs/${b.slug}`} className="inline-block rounded-lg border border-border px-3 py-1.5 text-sm hover:border-accent">
                {b.name}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-muted">Other languages:</p>
        <ul className="mt-2 flex flex-wrap gap-2">
          {others.map((t) => (
            <li key={t.slug}>
              <Link href={`/interview-questions/${t.slug}`} className="inline-block rounded-lg border border-border px-3 py-1.5 text-sm hover:border-accent">
                {t.name} interview questions
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
