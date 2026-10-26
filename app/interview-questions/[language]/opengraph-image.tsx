import { getLanguageTopic, LANGUAGE_TOPICS, questionsForLanguage } from "@/lib/interview";
import { ogContentType, ogSize, renderOgCard } from "@/lib/og";

export const alt = "Find-the-bug interview questions with answers";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return LANGUAGE_TOPICS.map((t) => ({ language: t.slug }));
}

export default async function Image({ params }: { params: Promise<{ language: string }> }) {
  const topic = getLanguageTopic((await params).language) ?? LANGUAGE_TOPICS[0];
  return renderOgCard({
    eyebrow: `${topic.name.toLowerCase()} interview questions`,
    title: topic.headline,
    footer: `${questionsForLanguage(topic.slug).length} spot-the-bug questions · answers & fixes`,
  });
}
