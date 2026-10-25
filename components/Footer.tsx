import { AUTHOR_NAME, AUTHOR_X_URL, SITE_NAME } from "@/lib/config";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border">
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted sm:flex-row">
        <p className="font-mono">
          {AUTHOR_NAME ? (
            <>
              Made by{" "}
              {AUTHOR_X_URL ? (
                <a href={AUTHOR_X_URL} target="_blank" rel="noopener noreferrer" className="text-fg underline-offset-4 hover:underline">
                  {AUTHOR_NAME}
                </a>
              ) : (
                <span className="text-fg">{AUTHOR_NAME}</span>
              )}
            </>
          ) : (
            <>
              <span className="text-accent">&gt;</span> {SITE_NAME}
            </>
          )}
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2" aria-label="Footer">
          <Link href="/interview-questions" className="hover:text-fg">
            Interview questions
          </Link>
          <Link href="/how-to-play" className="hover:text-fg">
            How to play
          </Link>
          <Link href="/archive" className="hover:text-fg">
            Archive
          </Link>
          {AUTHOR_X_URL && (
            <a href={AUTHOR_X_URL} target="_blank" rel="noopener noreferrer" className="hover:text-fg" aria-label="Follow on X (Twitter)">
              𝕏 / Twitter
            </a>
          )}
        </nav>
      </div>
    </footer>
  );
}
