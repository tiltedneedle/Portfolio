/**
 * The cut. Route changes on this site are not transitions; they are cuts:
 * one black frame, held for a beat, then the next scene is simply there.
 *
 * `beginCut` drops the frame (body.is-cutting, styled in globals.css).
 * CutOverlay clears it once the new pathname has committed, holding it for
 * HOLD_MS first so the cut reads as a cut rather than a flicker. A safety
 * timer clears it regardless, so a failed navigation can never leave the
 * site black.
 */

export const HOLD_MS = 140;
export const SAFETY_MS = 2500;

let safety: ReturnType<typeof setTimeout> | null = null;

export function beginCut() {
  if (typeof document === "undefined") return;
  document.body.classList.add("is-cutting");
  if (safety) clearTimeout(safety);
  safety = setTimeout(endCut, SAFETY_MS);
}

export function endCut() {
  if (typeof document === "undefined") return;
  document.body.classList.remove("is-cutting");
  if (safety) {
    clearTimeout(safety);
    safety = null;
  }
}

export function isCutting() {
  return typeof document !== "undefined" && document.body.classList.contains("is-cutting");
}
