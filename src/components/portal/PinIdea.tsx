"use client";

import { useClient } from "@/components/portal/ClientContext";
import { usePinned } from "@/lib/read";

/**
 * Pin an idea to the shortlist. The pin lives on this device; the
 * shortlist, the first month and the call sheet all follow it.
 */
export function PinIdea({ k }: { k: string }) {
  const me = useClient();
  const { pinned, toggle } = usePinned(me.slug);
  const on = pinned.has(k);
  return (
    <button type="button" onClick={() => toggle(k)} aria-pressed={on} className={"slate-link text-[11px]" + (on ? " text-[color:var(--ink)]" : "")} data-cursor={on ? "Unpin" : "Pin"}>
      {on ? (
        <span className="inline-flex items-center gap-1.5">
          <span aria-hidden="true" className="pop inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--ink)]" />
          Pinned
        </span>
      ) : (
        "Pin"
      )}
    </button>
  );
}

/** "3 pinned", for a set of idea keys; `empty` is said instead while there are none. */
export function PinnedCount({ keys, prefix = "", empty, className = "" }: { keys: string[]; prefix?: string; empty?: string; className?: string }) {
  const me = useClient();
  const { pinned } = usePinned(me.slug);
  const n = keys.filter((k) => pinned.has(k)).length;
  if (n === 0) return empty ? <span className={className}>{empty}</span> : null;
  return (
    <span className={className}>
      {prefix}
      {n} pinned
    </span>
  );
}
