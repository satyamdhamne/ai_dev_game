import { BUG_TOPICS, getBugTopic, questionsForBugType } from "@/lib/interview";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Bug-type interview questions with examples";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return BUG_TOPICS.map((t) => ({ slug: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const topic = getBugTopic((await params).slug) ?? BUG_TOPICS[0];
  return renderOgCard({
    eyebrow: "bug types",
    title: `${topic.name}: interview questions & examples`,
    footer: `${questionsForBugType(topic.bugType).length} examples · how to spot it in code review`,
  });
}
