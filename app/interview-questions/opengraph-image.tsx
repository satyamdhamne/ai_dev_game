import { ogContentType, ogSize, renderOgCard } from "@/lib/og";
import { practiceQuestions } from "@/lib/interview";

export const alt = "Find-the-bug coding interview questions with answers";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgCard({
    eyebrow: "coding interview questions",
    title: "Find-the-bug interview questions, with answers",
    footer: `${practiceQuestions.length} questions · Python, JS, TS, Go, Java, SQL`,
  });
}
