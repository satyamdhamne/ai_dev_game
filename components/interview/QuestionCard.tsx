import { bugTopicFor, type PracticeQuestion } from "@/lib/interview";
import Link from "next/link";
import { InlineCode } from "../InlineCode";
import { CodeSnippet } from "./CodeSnippet";
import { LANGUAGE_LABEL } from "./labels";

export function QuestionCard({ q, index, show }: { q: PracticeQuestion; index: number; show: "language" | "bugType" }) {
  const bug = bugTopicFor(q.bugType);
  return (
    <article id={q.slug} className="scroll-mt-20 rounded-2xl border border-border bg-surface p-4 sm:p-6">
      <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
        <span className="text-muted">Q{index}</span>
        {show === "language" ? (
          <Link href={`/interview-questions/${q.language}`} className="rounded-md bg-surface-2 px-2 py-0.5 font-semibold hover:text-accent">
            {LANGUAGE_LABEL[q.language]}
          </Link>
        ) : (
          <Link href={`/interview-questions/bugs/${bug.slug}`} className="rounded-md bg-surface-2 px-2 py-0.5 font-semibold hover:text-accent">
            {q.bugType}
          </Link>
        )}
        <span className="rounded-md bg-surface-2 px-2 py-0.5 capitalize text-muted">{q.difficulty}</span>
      </div>
      <h3 className="mt-2 text-lg font-semibold tracking-tight">{q.title}</h3>
      <p className="mt-1 text-[15px] leading-relaxed text-muted">{q.prompt}</p>
      <div className="mt-3">
        <CodeSnippet code={q.code} language={q.language} />
      </div>
      <details className="group mt-3 rounded-xl border border-border bg-surface-2/50 open:bg-surface-2">
        <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-2 px-4 font-semibold [&::-webkit-details-marker]:hidden">
          <span>Show answer</span>
          <span className="font-mono text-muted transition group-open:rotate-90" aria-hidden>
            ›
          </span>
        </summary>
        <div className="space-y-3 px-4 pb-4">
          <p className="font-mono text-sm">
            <span className="rounded-md bg-danger-soft px-2 py-0.5 font-semibold text-danger">line {q.bugLine}</span>{" "}
            <span className="text-muted">· {q.bugType}</span>
          </p>
          <p className="leading-relaxed">
            <InlineCode text={q.answer} />
          </p>
          <CodeSnippet code={q.fix} language={q.language} label="Fix" />
          {q.followUp && (
            <p className="text-sm leading-relaxed text-muted">
              <strong className="text-fg">Interview follow-up:</strong> <InlineCode text={q.followUp} />
            </p>
          )}
        </div>
      </details>
    </article>
  );
}
