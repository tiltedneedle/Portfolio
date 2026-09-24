"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { HOLD_MS, endCut, isCutting } from "@/lib/cut";

/**
 * The black frame that every cut passes through. Rendered once in the root
 * layout; it does nothing until CutLink drops the frame, then clears it a
 * beat after the pathname changes.
 */
export function CutOverlay() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (!isCutting()) return;
    // The new scene has committed. Hold the black for one beat, then reveal.
    // Instant, not the page's smooth default: this happens under the black
    // frame and must be over before it lifts. A hash means the router has
    // already put the section in view; resetting would undo that.
    if (!window.location.hash) window.scrollTo({ top: 0, behavior: "instant" });
    const t = setTimeout(endCut, HOLD_MS);
    return () => clearTimeout(t);
  }, [pathname]);

  // A back/forward navigation never goes through CutLink; make sure the frame
  // is not stuck from a cut that was interrupted.
  useEffect(() => {
    const onShow = () => endCut();
    window.addEventListener("pageshow", onShow);
    return () => window.removeEventListener("pageshow", onShow);
  }, []);

  return <div className="cut-frame" aria-hidden="true" />;
}
