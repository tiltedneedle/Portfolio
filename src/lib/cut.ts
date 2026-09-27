/**
 * The cut. Route changes on this site are not transitions; they are cuts:
 * one black frame, held for a beat, then the next scene is simply there.
 *
 * `beginCut` drops the frame (body.is-cutting, styled in globals.css).
 * CutOverlay clears it once the new pathname has committed, holding it for
 * a beat first so the cut reads as a cut rather than a flicker. A safety
 * timer clears it regardless, so a failed navigation can never leave the
 * site black.
 *
 * Two lengths. A cut inside a room is the short one and carries nothing. A
 * cut that changes room is a scene change: it is held longer and slated
 * with the scene it is cutting to, the way the opening clapper slates 01.
 * The length tells you how far you travelled; the slate tells you where
 * you landed.
 */

export const HOLD_MS = 140;
export const HOLD_SCENE_MS = 260;
export const SAFETY_MS = 2500;

let safety: ReturnType<typeof setTimeout> | null = null;
let hold = HOLD_MS;

/** How long the frame is held for the cut now in progress. */
export function cutHold() {
  return hold;
}

export function beginCut(slate?: { n: string; title: string } | null) {
  if (typeof document === "undefined") return;
  hold = slate ? HOLD_SCENE_MS : HOLD_MS;
  // The label goes on before the frame does, so it is there on the first
  // painted black frame. Struck with the cut, not after it: that is the
  // whole difference between a slate and a flicker.
  const frame = document.querySelector<HTMLElement>(".cut-frame");
  if (frame) {
    if (slate) {
      frame.dataset.scene = "Scene " + slate.n;
      frame.dataset.to = slate.title;
    } else {
      delete frame.dataset.scene;
      delete frame.dataset.to;
    }
  }
  document.body.classList.add("is-cutting");
  if (safety) clearTimeout(safety);
  safety = setTimeout(endCut, SAFETY_MS);
}

export function endCut() {
  if (typeof document === "undefined") return;
  document.body.classList.remove("is-cutting");
  // Also on the safety timer and on back/forward, so an abandoned
  // navigation can never leave a slate naming a room nobody reached.
  const frame = document.querySelector<HTMLElement>(".cut-frame");
  if (frame) {
    delete frame.dataset.scene;
    delete frame.dataset.to;
  }
  hold = HOLD_MS;
  if (safety) {
    clearTimeout(safety);
    safety = null;
  }
}

export function isCutting() {
  return typeof document !== "undefined" && document.body.classList.contains("is-cutting");
}
