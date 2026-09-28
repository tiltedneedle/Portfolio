/**
 * The locked parts, and the one way to open the modal that explains them.
 *
 * A locked part has no page behind it, so nothing that opens it is a link:
 * every trigger is a button that raises this event, and one listener in the
 * portal layout answers. The same shape as the palette's "tn:palette", for
 * the same reason -- the nav, the home strip and the footer all need to
 * reach one overlay that none of them owns.
 *
 * Deliberately free of imports: this is reached from client components, and
 * anything it pulled in would be pulled into the browser bundle with it.
 */
export const LOCKED_EVENT = "tn:locked";

/** Which of the four the reader asked about, so the modal can open on it. */
export type LockedDetail = { anchor?: string };

export function openLocked(anchor?: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<LockedDetail>(LOCKED_EVENT, { detail: { anchor } }));
}
