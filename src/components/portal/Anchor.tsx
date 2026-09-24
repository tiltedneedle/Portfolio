"use client";

import { useEffect, useState } from "react";

/**
 * A section's own address. Shows beside a heading on hover or focus,
 * copies the link to that section, and says so for a moment. For a team
 * that talks in numbers: "look at 04.04, section 07".
 */
export function Anchor({ id, label }: { id: string; label: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  const copy = async () => {
    const url = window.location.origin + window.location.pathname + "#" + id;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        setDone(true);
        return;
      }
    } catch {
      // fall through
    }
    history.replaceState(null, "", "#" + id);
    setDone(true);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-label={"Copy a link to " + label}
      className="no-print mono inline-flex items-baseline gap-1.5 text-[11px] text-[color:var(--ink-mid)] opacity-0 transition-opacity hover:text-[color:var(--ink)] focus-visible:opacity-100 group-hover/section:opacity-100"
      data-cursor={done ? "Copied" : "Link"}
    >
      {done ? "Link copied" : "#"}
    </button>
  );
}
