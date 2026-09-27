"use client";

import { useClient } from "@/components/portal/ClientContext";
import { useRead } from "@/lib/read";

/**
 * The foot of a page: mark it read. The mark lives on this device only
 * and shows on the room's overview, in the nav and on the home strip.
 *
 * `ask` is what this page asks, in its own words. It has no default: a new
 * call site has to decide what it is asking about.
 */
export function ReadToggle({ k, ask }: { k: string; ask: string }) {
  const me = useClient();
  const { read, toggle } = useRead(me.slug);
  const done = read.has(k);
  return (
    <div className="no-print border-t border-[color:var(--rule)] bg-[color:var(--stage)]">
      <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-6 px-6 py-8 md:px-14">
        <p className="mono flex items-center gap-2">
          {done ? (
            <>
              <span aria-hidden="true" className="pop inline-block h-2 w-2 rounded-full bg-[color:var(--ink)]" />
              <span className="text-[color:var(--ink)]">Read</span>
              <span className="text-[color:var(--ink-mid)]">on this device</span>
            </>
          ) : (
            <>
              <span className="lamp-off" aria-hidden="true" />
              {ask}
            </>
          )}
        </p>
        <button type="button" onClick={() => toggle(k)} aria-pressed={done} className={done ? "slate-link" : "pill pill-outline px-6 py-2.5 text-[14px]"} data-cursor={done ? "Undo" : "Mark"}>
          {done ? "Unmark" : "Mark as read"}
        </button>
      </div>
    </div>
  );
}
