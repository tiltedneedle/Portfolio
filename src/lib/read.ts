"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Which pages the reader has marked as read, on this device. Kept in
 * localStorage under the client's slug, as one key per line, and read
 * through useSyncExternalStore so the server render says "none" and the
 * browser corrects it on hydration.
 *
 * A key is "chapter/slug": "create/hooks", "audit/content-diagnostic".
 */
const EVENT = "tn:read";
const storageKey = (client: string) => "tn-read:" + client;

function raw(client: string) {
  try {
    return localStorage.getItem(storageKey(client)) ?? "";
  } catch {
    return "";
  }
}

function subscribe(cb: () => void) {
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", cb);
  };
}

export function useRead(client: string) {
  const text = useSyncExternalStore(subscribe, () => raw(client), () => "");
  const read = useMemo(() => new Set(text ? text.split("\n").filter(Boolean) : []), [text]);
  const toggle = useCallback(
    (key: string) => {
      const next = new Set(read);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem(storageKey(client), Array.from(next).join("\n"));
      } catch {
        // Private mode or blocked storage: the mark simply does not persist.
      }
      window.dispatchEvent(new Event(EVENT));
    },
    [client, read]
  );
  return { read, toggle };
}
