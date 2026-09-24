"use client";

import { useClient } from "@/components/portal/ClientContext";
import { useFilmed } from "@/lib/read";

/** A quiet "filmed" beside a script, only once it has been marked on this device. */
export function FilmedMark({ n, className = "" }: { n: number; className?: string }) {
  const me = useClient();
  const { filmed } = useFilmed(me.slug);
  if (!filmed.has(String(n))) return null;
  return (
    <span className={"mono inline-flex items-center gap-1.5 text-[color:var(--ink)] " + className}>
      <span aria-hidden="true" className="inline-block h-1.5 w-1.5 rounded-full bg-[color:var(--ink)]" />
      Filmed
    </span>
  );
}

/** "2 filmed", for a set of script numbers; nothing until one is. */
export function FilmedCount({ ns, prefix = "", className = "" }: { ns: number[]; prefix?: string; className?: string }) {
  const me = useClient();
  const { filmed } = useFilmed(me.slug);
  const n = ns.filter((x) => filmed.has(String(x))).length;
  if (n === 0) return null;
  return (
    <span className={className}>
      {prefix}
      {n} filmed
    </span>
  );
}
