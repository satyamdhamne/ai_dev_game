import { Game } from "@/components/Game";
import { getDailyPuzzle } from "@/lib/daily";
import { getDayNumber } from "@/lib/day";
import { connection } from "next/server";
import { Suspense } from "react";

export default function Home() {
  return (
    <Suspense fallback={<GameSkeleton />}>
      <TodayGame />
    </Suspense>
  );
}

async function TodayGame() {
  // "Today" depends on the request time (midnight IST rollover).
  await connection();
  const daily = await getDailyPuzzle(getDayNumber());
  return <Game daily={daily} />;
}

function GameSkeleton() {
  return (
    <main className="mx-auto w-full max-w-2xl flex-1 animate-pulse px-4 pt-5" aria-busy="true" aria-label="Loading today's bug">
      <div className="h-3 w-16 rounded bg-surface-2" />
      <div className="mt-2 h-7 w-2/3 rounded bg-surface-2" />
      <div className="mt-4 h-24 rounded-2xl bg-surface-2" />
      <div className="mt-4 h-96 rounded-2xl bg-surface-2" />
    </main>
  );
}
