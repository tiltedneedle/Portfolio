"use client";

import { useClient } from "@/components/portal/ClientContext";
import { useRead } from "@/lib/read";

/** A quiet "read" beside a row, only once the page has been marked on this device. */
export function ReadMark({ k }: { k: string }) {
  const me = useClient();
  const { read } = useRead(me.slug);
  if (!read.has(k)) return null;
  return (
    <span className="mono mr-4 inline-flex items-center gap-1.5 text-[color:var(--ink)]">
      <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--ink)]" />
      Read
    </span>
  );
}

/** "3 of 7 read", for a set of page keys. */
export function ReadCount({ keys, noun = "read" }: { keys: string[]; noun?: string }) {
  const me = useClient();
  const { read } = useRead(me.slug);
  const n = keys.filter((k) => read.has(k)).length;
  return (
    <span className={n === keys.length && n > 0 ? "text-[color:var(--ink)]" : "text-[color:var(--ink-mid)]"}>
      {n} of {keys.length} {noun}
    </span>
  );
}
