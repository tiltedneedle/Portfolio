"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * The marks a reader leaves on this device: which pages are read, which
 * scripts are filmed. Each kind is one localStorage key per client, one
 * entry per line, read through useSyncExternalStore so the server render
 * says "none" and the browser corrects it on hydration.
 *
 * A read key is "chapter/slug": "create/hooks", "audit/content-diagnostic".
 * A filmed key is the script's number: "4".
 */
type Kind = "read" | "filmed";
const EVENT: Record<Kind, string> = { read: "tn:read", filmed: "tn:filmed" };
const storageKey = (kind: Kind, client: string) => "tn-" + kind + ":" + client;

function raw(kind: Kind, client: string) {
  try {
    return localStorage.getItem(storageKey(kind, client)) ?? "";
  } catch {
    return "";
  }
}

// One subscriber per kind, so the store is not resubscribed on every render.
const subscribe = (kind: Kind) => (cb: () => void) => {
  window.addEventListener(EVENT[kind], cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVENT[kind], cb);
    window.removeEventListener("storage", cb);
  };
};
const subscribers: Record<Kind, (cb: () => void) => () => void> = { read: subscribe("read"), filmed: subscribe("filmed") };

function useMarks(kind: Kind, client: string) {
  const text = useSyncExternalStore(subscribers[kind], () => raw(kind, client), () => "");
  const marks = useMemo(() => new Set(text ? text.split("\n").filter(Boolean) : []), [text]);
  const toggle = useCallback(
    (key: string) => {
      const next = new Set(marks);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      try {
        localStorage.setItem(storageKey(kind, client), Array.from(next).join("\n"));
      } catch {
        // Private mode or blocked storage: the mark simply does not persist.
      }
      window.dispatchEvent(new Event(EVENT[kind]));
    },
    [kind, client, marks]
  );
  return { marks, toggle };
}

export function useRead(client: string) {
  const { marks, toggle } = useMarks("read", client);
  return { read: marks, toggle };
}

export function useFilmed(client: string) {
  const { marks, toggle } = useMarks("filmed", client);
  return { filmed: marks, toggle };
}
