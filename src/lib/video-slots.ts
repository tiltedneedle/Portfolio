// Caps how many videos may be fetching at once so a grid of autoplaying
// previews doesn't saturate the connection. Max 4 concurrent loads.
//
// This module owns the whole acquire/hold/release lifecycle on purpose.
// Three components previously hand-rolled it with a local `holding` flag, a
// `progress` listener and a timeout, and all three leaked: the effect cleanup
// released the slot but left `holding` true and never cleared the timer or
// removed the listener, so the orphaned timer released the *same* slot a
// second time. `active` is module state, so after a few unmounts it went
// negative and the cap stopped applying for the rest of the session — the
// exact saturation this file exists to prevent.
//
// Everything now funnels through one idempotent release, and `active` is
// clamped so no future bug can permanently disable the limiter.

const MAX_CONCURRENT = 4;

let active = 0;
const queue: Array<() => void> = [];

export const loadedSrcs = new Set<string>();

export function requestSlot(): Promise<void> {
  if (active < MAX_CONCURRENT) {
    active++;
    return Promise.resolve();
  }
  return new Promise<void>((resolve) => {
    queue.push(() => {
      active++;
      resolve();
    });
  });
}

export function releaseSlot() {
  // Clamped: a double release must not drive the counter negative, because
  // that would make requestSlot() resolve immediately forever.
  if (active > 0) active--;
  if (queue.length > 0) queue.shift()!();
}

/** Test/debug hook — lets a caller assert the counter has not drifted. */
export function slotDebugState() {
  return { active, queued: queue.length, max: MAX_CONCURRENT };
}

/**
 * Attach `src` to `video` once a load slot is free, then play it.
 *
 * Returns a cancel function for the effect cleanup. Exactly one slot release
 * happens per successful acquire, whichever way the load ends — buffered,
 * playable, timed out, or cancelled mid-flight.
 */
export function attachThrottledVideo(
  video: HTMLVideoElement,
  src: string,
  timeoutMs = 2500
): () => void {
  let cancelled = false;
  let slotHeld = false;
  let timer: ReturnType<typeof setTimeout> | undefined;

  const releaseOnce = () => {
    if (timer) {
      clearTimeout(timer);
      timer = undefined;
    }
    if (!slotHeld) return;
    slotHeld = false;
    releaseSlot();
  };

  const onProgress = () => {
    // Enough has arrived for playback to start — let the next video in.
    if (video.buffered.length > 0) releaseOnce();
  };

  const onCanPlay = () => {
    loadedSrcs.add(src);
    releaseOnce();
    if (!cancelled) video.play().catch(() => {});
  };

  // Already fetched this session: the browser serves it from cache, so it
  // needs no slot and must not touch the counter.
  if (loadedSrcs.has(src)) {
    video.src = src;
    video.play().catch(() => {});
    return () => {
      cancelled = true;
      video.pause();
    };
  }

  void (async () => {
    await requestSlot();
    if (cancelled) {
      // Granted after we were torn down. Hand it straight back — `slotHeld` is
      // still false, so this balances the queue's increment exactly once.
      releaseSlot();
      return;
    }
    slotHeld = true;
    video.src = src;
    video.load();
    video.addEventListener("canplay", onCanPlay, { once: true });
    video.addEventListener("progress", onProgress);
    // A stalled fetch must not hold the slot forever.
    timer = setTimeout(releaseOnce, timeoutMs);
  })();

  return () => {
    cancelled = true;
    video.removeEventListener("canplay", onCanPlay);
    video.removeEventListener("progress", onProgress);
    video.pause();
    releaseOnce();
  };
}
