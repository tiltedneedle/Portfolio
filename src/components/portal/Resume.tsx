"use client";

import { useState, useSyncExternalStore } from "react";
import { useReducedMotion } from "framer-motion";
import { useClient } from "@/components/portal/ClientContext";
import { useRead } from "@/lib/read";

/**
 * Pick up where you left off. The rail remembers the last section read on
 * this device; on the next visit, if the page is not yet marked read, one
 * line offers to jump back there. Nothing is stored beyond the section id.
 */
const noop = () => () => {};
export const positionKey = (client: string, k: string) => "tn-pos:" + client + ":" + k;

export function Resume({ k, items }: { k: string; items: { id: string; n?: string; title: string }[] }) {
  const me = useClient();
  const { read } = useRead(me.slug);
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState(false);
  const saved = useSyncExternalStore(
    noop,
    () => {
      try {
        return localStorage.getItem(positionKey(me.slug, k)) ?? "";
      } catch {
        return "";
      }
    },
    () => ""
  );
  const at = items.find((it) => it.id === saved);
  if (dismissed || !at || at.id === items[0]?.id || read.has(k)) return null;
  const go = () => {
    setDismissed(true);
    document.getElementById(at.id)?.scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
  };
  return (
    <div className="mt-10 md:ml-[calc(100%-60ch)] md:max-w-[60ch]">
      <button type="button" onClick={go} className="group flex w-full items-baseline gap-4 border-y border-[color:var(--rule)] py-4 text-left" data-cursor="Cut">
        <span className="mono shrink-0">Resume</span>
        <span className="min-w-0 flex-1 text-[15px] text-[color:var(--ink-soft)] transition-colors group-hover:text-[color:var(--ink)]">
          {at.n && <span className="mono mr-2 text-[color:var(--ink-mid)]">{at.n}</span>}
          {at.title}
        </span>
        <span aria-hidden="true" className="mono text-[color:var(--ink-mid)] transition-colors group-hover:text-[color:var(--ink)]">
          &darr;
        </span>
      </button>
    </div>
  );
}
