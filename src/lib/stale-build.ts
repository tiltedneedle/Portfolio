/**
 * A deploy went out while a page was open, and the code the next room needs
 * is gone from the server: its chunk fails to load (Turbopack names the
 * error ChunkLoadError) and React hands it to an error boundary, which showed
 * the fault screen on the reader's next click. A full load of the same address
 * fetches the new version and is the cure, so the boundaries do that, once.
 * The time of the attempt is kept for the tab's session: a load that fails
 * the same way again shows the fault screen instead of reloading forever.
 * Without session storage there is no telling, so nothing reloads by itself
 * and the screen's own button does it instead.
 */
const KEY = "tn-stale-reload";
const WINDOW_MS = 30_000;

export function isStaleBuild(error: unknown) {
  const e = error as { name?: unknown; message?: unknown } | null | undefined;
  const text = String(e?.name ?? "") + " " + String(e?.message ?? "");
  return /ChunkLoadError|Failed to load chunk|Loading (CSS )?chunk \S+ failed|dynamically imported module|Importing a module script failed/i.test(text);
}

/** Whether this tab may reload for a stale build now: not if it did in the last half minute. */
export function mayReloadForStaleBuild() {
  try {
    return Date.now() - Number(sessionStorage.getItem(KEY) || 0) > WINDOW_MS;
  } catch {
    return false;
  }
}

export function reloadForStaleBuild() {
  try {
    sessionStorage.setItem(KEY, String(Date.now()));
  } catch {
    // no storage: this is the button's reload, made by hand
  }
  window.location.reload();
}
