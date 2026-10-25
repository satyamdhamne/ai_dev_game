"use client";

import { useSyncExternalStore } from "react";
import { isGameState, type GameState } from "./game";
import { emptyStats, isStats, type Stats } from "./stats";
import { KEYS, readJSON, writeJSON } from "./storage";

/**
 * A tiny localStorage-backed store for useSyncExternalStore. The server
 * snapshot is always `null`, so SSR and hydration render the "unknown" state
 * and the client picks up the persisted value right after.
 */
function createPersistentStore<T>(key: string, guard: (v: unknown) => v is T) {
  let loaded = false;
  let value: T | null = null;
  const listeners = new Set<() => void>();

  const emit = () => listeners.forEach((l) => l());

  return {
    get(): T | null {
      if (!loaded) {
        value = readJSON(key, guard);
        loaded = true;
      }
      return value;
    },
    set(next: T) {
      value = next;
      loaded = true;
      writeJSON(key, next);
      emit();
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      // Keep multiple tabs in sync.
      const onStorage = (e: StorageEvent) => {
        if (e.key === key) {
          loaded = false;
          emit();
        }
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
}

export const gameStore = createPersistentStore<GameState>(KEYS.game, isGameState);
export const statsStore = createPersistentStore<Stats>(KEYS.stats, isStats);

const serverNull = () => null;

export function useGameState(): GameState | null {
  return useSyncExternalStore(gameStore.subscribe, gameStore.get, serverNull);
}

export function useStats(): Stats {
  const stats = useSyncExternalStore(statsStore.subscribe, statsStore.get, serverNull);
  return stats ?? EMPTY;
}
const EMPTY = emptyStats();

const noopSubscribe = () => () => {};
/** False during SSR and hydration, true afterwards. */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
