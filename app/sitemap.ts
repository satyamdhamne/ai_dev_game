import { BUG_TOPICS, LANGUAGE_TOPICS } from "@/lib/interview";
import { absoluteUrl } from "@/lib/seo";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: absoluteUrl("/"), changeFrequency: "daily", priority: 1 },
    { url: absoluteUrl("/interview-questions"), changeFrequency: "weekly", priority: 0.9 },
    ...LANGUAGE_TOPICS.map((t) => ({
      url: absoluteUrl(`/interview-questions/${t.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
    ...BUG_TOPICS.map((t) => ({
      url: absoluteUrl(`/interview-questions/bugs/${t.slug}`),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    { url: absoluteUrl("/how-to-play"), changeFrequency: "monthly", priority: 0.5 },
  ];
}
