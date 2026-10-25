import { AppShell } from "@/components/AppShell";
import { Footer } from "@/components/Footer";
import { SITE_NAME, SITE_URL, TAGLINE } from "@/lib/config";
import { themeScript } from "@/lib/theme";
import { Analytics } from "@vercel/analytics/next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import type { Metadata, Viewport } from "next";
import "./globals.css";

const description =
  "A free daily game for developers: find the one real bug in an AI-written pull request. Plus find-the-bug coding interview questions with answers in Python, JavaScript, TypeScript, Go, Java and SQL.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: Daily Find-the-Bug Game & Coding Interview Practice`,
    template: `%s · ${SITE_NAME}`,
  },
  description,
  applicationName: SITE_NAME,
  keywords: [
    "coding interview questions",
    "find the bug interview questions",
    "debugging interview questions",
    "code review interview questions",
    "spot the bug",
    "daily coding challenge",
    "wordle for developers",
    "AI code review",
  ],
  alternates: { canonical: "/" },
  category: "technology",
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    locale: "en_US",
    title: `${SITE_NAME} 🐛`,
    description: TAGLINE,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} 🐛`,
    description: TAGLINE,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0d12" },
    { media: "(prefers-color-scheme: light)", color: "#f6f7f9" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${GeistSans.variable} ${GeistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
        >
          Skip to content
        </a>
        <AppShell>
          <div id="main" className="flex flex-1 flex-col">
            {children}
          </div>
        </AppShell>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
