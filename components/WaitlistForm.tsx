"use client";

import { track } from "@/lib/analytics";
import { useId, useState, type FormEvent } from "react";

const WAITLIST_URL = process.env.NEXT_PUBLIC_WAITLIST_URL;
/** Field name the endpoint expects (e.g. "entry.123456" for Google Forms). */
const EMAIL_FIELD = process.env.NEXT_PUBLIC_WAITLIST_EMAIL_FIELD || "email";

type Status = "idle" | "submitting" | "success" | "error";

async function submitEmail(email: string, source: string): Promise<void> {
  if (!WAITLIST_URL) throw new Error("Waitlist isn't configured yet (set NEXT_PUBLIC_WAITLIST_URL).");
  const body = new FormData();
  body.append(EMAIL_FIELD, email);
  body.append("source", source);
  try {
    const res = await fetch(WAITLIST_URL, { method: "POST", body, headers: { Accept: "application/json" } });
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
  } catch (err) {
    // Endpoints like Google Forms don't send CORS headers. Retry as an opaque
    // no-cors POST: the submission still lands, we just can't read the reply.
    if (err instanceof TypeError) {
      await fetch(WAITLIST_URL, { method: "POST", body, mode: "no-cors" });
      return;
    }
    throw err;
  }
}

export function WaitlistForm({ source, compact = false }: { source: string; compact?: boolean }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setError("");
    try {
      await submitEmail(email.trim(), source);
      setStatus("success");
      track("waitlist_submitted", { source });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Try again?");
    }
  }

  if (status === "success") {
    return (
      <p role="status" className="rounded-xl border border-accent/40 bg-accent-soft px-4 py-3 font-mono text-sm text-accent">
        ✓ You&apos;re on the list. We&apos;ll ping you when Pro ships.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full" noValidate={false}>
      {!compact && (
        <label htmlFor={id} className="mb-2 block text-sm font-medium">
          Get early access to Pro
        </label>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.dev"
          aria-label="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="min-h-11 w-full min-w-0 flex-1 rounded-xl border border-border bg-bg px-3.5 font-mono text-sm text-fg placeholder:text-muted/70 focus:border-select-ring focus:outline-none focus:ring-2 focus:ring-select-ring/30"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="min-h-11 shrink-0 rounded-xl bg-fg px-4 text-sm font-semibold text-bg transition hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-select-ring disabled:opacity-60"
        >
          {status === "submitting" ? "Joining…" : "Join waitlist"}
        </button>
      </div>
      {status === "error" && (
        <p role="alert" className="mt-2 text-sm text-danger">
          {error}
        </p>
      )}
    </form>
  );
}
