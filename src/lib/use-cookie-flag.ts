"use client";

import { useSyncExternalStore } from "react";

/**
 * Whether a (non-httpOnly) cookie is present. Read through
 * useSyncExternalStore so the server render says "no" and the browser
 * corrects it on hydration without a setState-in-effect.
 */
const noop = () => () => {};

export function useCookieFlag(name: string) {
  return useSyncExternalStore(
    noop,
    () => document.cookie.split(";").some((c) => c.trim().startsWith(name + "=")),
    () => false
  );
}
