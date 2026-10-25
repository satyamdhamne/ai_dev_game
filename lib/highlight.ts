import "server-only";
import { cacheLife } from "next/cache";
import { createHighlighter } from "shiki";
import { LANGUAGES, type Language, type TokenLine } from "./types";

let highlighter: ReturnType<typeof createHighlighter> | null = null;

function getHighlighter() {
  highlighter ??= createHighlighter({
    themes: ["github-light", "github-dark"],
    langs: [...LANGUAGES],
  });
  return highlighter;
}

/** Highlights code into per-line tokens carrying both light and dark colors. */
export async function highlightLines(code: string, lang: Language): Promise<TokenLine[]> {
  const hl = await getHighlighter();
  const { tokens } = hl.codeToTokens(code, {
    lang,
    themes: { light: "github-light", dark: "github-dark" },
  });
  return tokens.map((line) =>
    line.map((t) => ({
      content: t.content,
      color: t.htmlStyle?.color,
      dark: t.htmlStyle?.["--shiki-dark"],
    })),
  );
}

/** Cached variant for static content pages: same input, same output, forever. */
export async function highlightCached(code: string, lang: Language): Promise<TokenLine[]> {
  "use cache";
  cacheLife("max");
  return highlightLines(code, lang);
}
