import data from "@/data/interview-questions.json";
import type { BugType, Difficulty, Language } from "./types";

/** A short, static practice question for the SEO interview pages (separate from the daily puzzles). */
export interface PracticeQuestion {
  slug: string;
  language: Language;
  bugType: BugType;
  difficulty: Difficulty;
  title: string;
  prompt: string;
  code: string;
  bugLine: number;
  answer: string;
  fix: string;
  followUp?: string;
}

export const practiceQuestions = data as PracticeQuestion[];

export interface LanguageTopic {
  slug: Language;
  name: string;
  /** Used in titles: "Python code review interview questions" */
  headline: string;
  description: string;
  intro: string;
  gotchas: string[];
}

export const LANGUAGE_TOPICS: LanguageTopic[] = [
  {
    slug: "python",
    name: "Python",
    headline: "Python debugging & code review interview questions",
    description:
      "Find-the-bug Python interview questions with answers: mutable defaults, SQL injection, race conditions, slicing edge cases and leaked secrets.",
    intro:
      "Python interviews love \"what's wrong with this function?\" questions because the language hides its sharp edges behind friendly syntax. Each question below is a short, realistic snippet with exactly one bug. Read it like a pull request, decide which line is wrong, then reveal the answer and the fix.",
    gotchas: [
      "Default arguments are evaluated once, at definition time.",
      "Negative slicing with a variable breaks when the variable is 0.",
      "f-strings in SQL or shell commands are injection vectors.",
      "Check-then-act on the filesystem is a race between processes.",
      "Logging whole request objects leaks tokens and cookies.",
    ],
  },
  {
    slug: "javascript",
    name: "JavaScript",
    headline: "JavaScript find-the-bug interview questions",
    description:
      "JavaScript interview questions where you spot the bug: sort() on numbers, falsy zero, off-by-one array access, leaked keys and event listener leaks.",
    intro:
      "JavaScript bug-hunt questions test whether you know the language's defaults: string sorting, falsy values, zero-based indexes, and what actually ships to the browser. Every snippet below compiles and looks reasonable. Your job is to find the one line that breaks in production.",
    gotchas: [
      "Array.prototype.sort() compares strings unless you pass a comparator.",
      "0, \"\" and NaN are falsy; use == null to test for missing values.",
      "The last index is length - 1 (or use .at(-1)).",
      "Every listener you add needs a matching removeEventListener with the same function.",
      "Anything in front-end code, including API keys, is public.",
    ],
  },
  {
    slug: "typescript",
    name: "TypeScript",
    headline: "TypeScript code review interview questions",
    description:
      "TypeScript interview questions with answers: XSS via innerHTML, async race conditions, non-null assertions, inverted filters and await-in-loop performance traps.",
    intro:
      "Types catch a lot, but not everything. These TypeScript interview questions focus on bugs the compiler happily accepts: non-null assertions that lie, async responses that arrive out of order, and DOM APIs that execute user input. Spot the line, then check your reasoning against the answer.",
    gotchas: [
      "The ! operator silences the compiler; it doesn't make the value exist.",
      "Async responses can resolve out of order; only the latest should win.",
      "innerHTML with user input is cross-site scripting.",
      "await inside a for loop serializes independent requests.",
      "filter() keeps items where the callback returns true.",
    ],
  },
  {
    slug: "go",
    name: "Go",
    headline: "Go (Golang) find-the-bug interview questions",
    description:
      "Go interview questions where you find the bug: concurrent map writes, unclosed response bodies, divide by zero, inverted checks and hard-coded secrets.",
    intro:
      "Go interviews often hand you a short function and ask what goes wrong under load. These questions cover the classics: maps shared across goroutines, response bodies that never get closed, and edge cases that panic. Each has exactly one bug and a production-ready fix.",
    gotchas: [
      "Maps are not safe for concurrent writes; guard them or use one per goroutine.",
      "Always close resp.Body, even if you don't read it.",
      "Integer division by zero panics.",
      "Secrets in source code end up in every clone and fork.",
      "Read boolean conditions twice; ! flips the whole meaning.",
    ],
  },
  {
    slug: "java",
    name: "Java",
    headline: "Java debugging interview questions",
    description:
      "Java find-the-bug interview questions with answers: == on Strings, Optional.get(), JDBC resource leaks, off-by-one loops and String concatenation in loops.",
    intro:
      "Java code-review questions reward knowing the difference between references and values, and who is responsible for closing what. Each snippet below is short, compiles cleanly and contains exactly one real bug that would ship to production.",
    gotchas: [
      "== compares references; use equals() for Strings and boxed numbers.",
      "Optional.get() throws on empty; prefer map/orElse.",
      "Use try-with-resources for connections, statements and streams.",
      "Valid indexes are 0..length - 1.",
      "String += in a loop is quadratic; use StringBuilder.",
    ],
  },
  {
    slug: "sql",
    name: "SQL",
    headline: "SQL interview questions: spot the bug",
    description:
      "SQL interview questions where you find the bug: = NULL comparisons, BETWEEN with timestamps, ORDER BY mistakes, dynamic SQL injection and non-sargable LIKE patterns.",
    intro:
      "SQL bugs rarely throw errors. They just return the wrong rows, or the right rows very slowly. These interview questions cover NULL logic, date-range boundaries, injection in stored functions and index-killing patterns. Find the broken line, then compare your answer.",
    gotchas: [
      "Nothing equals NULL; use IS NULL / IS NOT NULL.",
      "BETWEEN on timestamps silently drops the last day; use half-open ranges.",
      "A leading % in LIKE can't use a B-tree index.",
      "Dynamic SQL needs bound parameters too (EXECUTE ... USING).",
      "Top-N queries need ORDER BY ... DESC.",
    ],
  },
];

export interface BugTopic {
  slug: string;
  bugType: BugType;
  name: string;
  description: string;
  definition: string;
  howToSpot: string[];
  whyAi: string;
}

export const BUG_TOPICS: BugTopic[] = [
  {
    slug: "off-by-one",
    bugType: "Off-by-one",
    name: "Off-by-one errors",
    description: "Off-by-one error interview questions with examples in JavaScript, Java and SQL, plus how to spot boundary bugs in code review.",
    definition:
      "An off-by-one error uses a boundary that's one step too far or too short: `<=` instead of `<`, `length` instead of `length - 1`, or an inclusive range where an exclusive one was needed.",
    howToSpot: [
      "Check every loop bound against the valid index range.",
      "Ask whether each range is inclusive or exclusive, and whether the code agrees.",
      "Test the first, last and empty cases mentally.",
      "Watch for 0-indexed code documented as 1-indexed, or vice versa.",
    ],
    whyAi:
      "Models have seen both conventions thousands of times and blend them, writing the documentation for one and the arithmetic for the other.",
  },
  {
    slug: "injection",
    bugType: "Security / injection",
    name: "SQL injection & XSS",
    description: "Injection interview questions: SQL injection in Python and stored procedures, and XSS via innerHTML in TypeScript, with secure fixes.",
    definition:
      "Injection happens when untrusted input is mixed into code: SQL, shell commands or HTML. The input stops being data and starts being instructions.",
    howToSpot: [
      "Look for string building (f-strings, template literals, +) around SQL, shell or HTML.",
      "Trace every user-controlled value to where it's executed or rendered.",
      "Prefer bound parameters, argument arrays and textContent.",
      "Remember that \"escaping\" by hand is almost always incomplete.",
    ],
    whyAi:
      "String interpolation is the shortest way to make code work, and models often parameterize the obvious value while interpolating the risky one.",
  },
  {
    slug: "race-condition",
    bugType: "Race condition",
    name: "Race conditions",
    description: "Race condition interview questions in Go, Python and TypeScript: concurrent map writes, TOCTOU file checks and out-of-order async responses.",
    definition:
      "A race condition is a bug whose outcome depends on timing: two goroutines, threads, processes or requests touching the same state in an order the code didn't plan for.",
    howToSpot: [
      "Find shared state, then ask who else can modify it at the same time.",
      "Be suspicious of check-then-act sequences (exists then create, read then write).",
      "Remember that async responses can arrive out of order.",
      "Prefer atomic operations, locks, or ownership by a single goroutine.",
    ],
    whyAi:
      "Single-threaded examples dominate training data, and nothing in a one-request test reveals the interleaving.",
  },
  {
    slug: "null-handling",
    bugType: "Null / undefined handling",
    name: "Null & undefined bugs",
    description: "Null handling interview questions: SQL = NULL, Java Optional.get(), and TypeScript non-null assertions on localStorage, with fixes.",
    definition:
      "Null-handling bugs assume a value exists when it may not: a missing map key, an empty Optional, a first-time visitor's empty storage, or NULL in SQL's three-valued logic.",
    howToSpot: [
      "For every lookup, ask \"what if it's not there?\"",
      "Treat ! and .get() as claims that need proof.",
      "In SQL, remember NULL = NULL is not TRUE.",
      "Check first-run and deleted-record paths explicitly.",
    ],
    whyAi:
      "Models optimize for code that compiles, and non-null assertions are the quickest way to silence a type error.",
  },
  {
    slug: "edge-cases",
    bugType: "Wrong edge case",
    name: "Edge-case bugs",
    description: "Edge case interview questions: falsy zero in JavaScript, Python slicing with n = 0, and Go division by zero on empty input.",
    definition:
      "Edge-case bugs work for typical inputs and break at the boundaries: zero, empty collections, the last day of a month, non-ASCII text.",
    howToSpot: [
      "Run through 0, 1, empty and maximum inputs before anything else.",
      "Look for truthiness checks that also catch 0 or \"\".",
      "Look for division and indexing that assume a non-empty input.",
      "Ask what the caller expects for \"no data\".",
    ],
    whyAi:
      "Training examples are usually happy-path, so the boundary case that never appears in examples never gets handled.",
  },
  {
    slug: "resource-leak",
    bugType: "Resource leak",
    name: "Resource leaks",
    description: "Resource leak interview questions: unclosed Go response bodies, JDBC connections in Java, and event listeners that are never removed.",
    definition:
      "A resource leak acquires something finite (a file descriptor, connection, listener or timer) and fails to release it on some path, until the process runs out.",
    howToSpot: [
      "Pair every open/add/subscribe with its close/remove/unsubscribe.",
      "Check that cleanup runs on early returns and errors too.",
      "Prefer defer, try-with-resources, with and cleanup functions.",
      "Ask what happens when this runs 10,000 times.",
    ],
    whyAi:
      "Cleanup is invisible in short examples, and models often add early returns without re-checking that cleanup still runs.",
  },
  {
    slug: "inverted-logic",
    bugType: "Logic inverted",
    name: "Inverted logic",
    description: "Inverted logic interview questions: flipped filters in TypeScript, reversed checks in Go and ASC vs DESC in SQL.",
    definition:
      "Inverted logic does exactly the opposite of what was intended: a missing or extra `!`, `ASC` instead of `DESC`, or keeping what should be removed.",
    howToSpot: [
      "Read each condition out loud and compare it to the requirement.",
      "Check what filter() and WHERE keep, not what they drop.",
      "Write the one-line test: does a known-good input pass?",
      "Be extra careful with double negatives.",
    ],
    whyAi:
      "Models autocomplete the shape of a familiar line and can flip a single character; the code compiles either way.",
  },
  {
    slug: "wrong-api-usage",
    bugType: "Wrong API usage",
    name: "Wrong API usage",
    description: "Wrong API usage interview questions: Python mutable defaults, JavaScript sort() without a comparator, and Java == on Strings.",
    definition:
      "Wrong API usage calls a real function in a way that doesn't do what the author thinks: default sorting, reference equality, shared defaults, a cutset instead of a prefix.",
    howToSpot: [
      "Know the defaults of the APIs you use every day.",
      "Be wary of methods with similar names (== vs equals, substr vs substring).",
      "Read the signature: what are the extra parameters, and who passes them?",
      "Test with inputs that distinguish the two behaviors.",
    ],
    whyAi:
      "Similar-sounding APIs look interchangeable, and the happy-path example often works by luck.",
  },
  {
    slug: "leaked-secrets",
    bugType: "Leaked secret",
    name: "Leaked secrets",
    description: "Leaked secret interview questions: API keys in front-end code, hard-coded JWT keys, and credentials written to logs.",
    definition:
      "A leaked secret is a credential that ends up somewhere it can be read: source control, a browser bundle, logs or error messages.",
    howToSpot: [
      "Search diffs for keys, tokens and passwords in literals.",
      "Ask where each value ends up: bundle, logs, repo?",
      "Check that secrets come from a secret store or server-side env.",
      "Remember that leaked keys must be rotated, not just removed.",
    ],
    whyAi:
      "Models are trained to make code work out of the box, and a hard-coded fallback or a verbose log line does exactly that.",
  },
  {
    slug: "performance-traps",
    bugType: "Performance trap",
    name: "Performance traps",
    description: "Performance trap interview questions: await in loops, String += in Java, and leading-wildcard LIKE queries that skip indexes.",
    definition:
      "A performance trap is correct code with the wrong complexity: quadratic loops, serialized I/O, or queries the database can't use an index for.",
    howToSpot: [
      "Ask how the code behaves at 100x the test input.",
      "Look for lookups or copies inside loops.",
      "Look for independent awaits that run one after another.",
      "Check that WHERE clauses can use an index on the raw column.",
    ],
    whyAi:
      "The most direct translation of a requirement is usually the slow one, and small examples hide the cost.",
  },
];

export const HUB_FAQ: { q: string; a: string }[] = [
  {
    q: "What is a find-the-bug coding interview question?",
    a: "You get a short, realistic piece of code that contains a bug and you're asked to find it, explain what breaks and propose a fix. It tests code-reading, debugging and code-review skills rather than algorithm memorization.",
  },
  {
    q: "Which companies ask debugging or code review questions?",
    a: "Many teams now include a code-review or debugging round, especially for backend, full-stack and senior roles, because reviewing AI-generated and teammates' code is a large part of the job.",
  },
  {
    q: "How should I answer a spot-the-bug question?",
    a: "Read the code top to bottom, state what it's supposed to do, test it mentally with normal and edge inputs (empty, zero, null, concurrent calls), point to the exact line, explain the failure and give a minimal fix.",
  },
  {
    q: "How can I practice debugging every day?",
    a: "Play Spot the AI Bug: every day there's a new AI-written pull request with one real bug. Find the line in three attempts, name the bug type and compare your streak with friends.",
  },
  {
    q: "Are these questions free?",
    a: "Yes. All interview questions on this site and the daily puzzle are free to play.",
  },
];

export const getLanguageTopic = (slug: string) => LANGUAGE_TOPICS.find((t) => t.slug === slug);
export const getBugTopic = (slug: string) => BUG_TOPICS.find((t) => t.slug === slug);
export const bugTopicFor = (bugType: BugType) => BUG_TOPICS.find((t) => t.bugType === bugType)!;
export const questionsForLanguage = (lang: Language) => practiceQuestions.filter((q) => q.language === lang);
export const questionsForBugType = (bugType: BugType) => practiceQuestions.filter((q) => q.bugType === bugType);
