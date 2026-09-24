"use client";

import { useEffect, useSyncExternalStore } from "react";
import { CutLink } from "@/components/room/CutLink";
import type { Change } from "@/content/clients/types";

/**
 * The recent additions, with the ones since this device's last visit
 * marked with a lamp. The visit is stamped when the page is left, so the
 * marks last the whole visit and are gone on the next. A first visit marks
 * nothing: everything is new, and the section already says so.
 */
type Item = Change & { own?: boolean };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const key = (slug: string) => "tn-seen:" + slug;
const noop = () => () => {};
const two = (n: number) => String(n).padStart(2, "0");

/** "24 Sep 2026", the same on the server and in every browser: no locale in the way. */
function printed(date: string) {
  const [y, m, d] = date.split("-").map(Number);
  return d + " " + MONTHS[m - 1] + " " + y;
}

function today() {
  const d = new Date();
  return d.getFullYear() + "-" + two(d.getMonth() + 1) + "-" + two(d.getDate());
}

function lastSeen(slug: string) {
  try {
    return localStorage.getItem(key(slug)) ?? "";
  } catch {
    return "";
  }
}

export function RecentList({ slug, items }: { slug: string; items: Item[] }) {
  const seen = useSyncExternalStore(noop, () => lastSeen(slug), () => "");

  useEffect(() => {
    const stamp = () => {
      try {
        localStorage.setItem(key(slug), today());
      } catch {
        // A browser that keeps nothing simply never marks anything as new.
      }
    };
    window.addEventListener("pagehide", stamp);
    return () => {
      window.removeEventListener("pagehide", stamp);
      stamp();
    };
  }, [slug]);

  // Dates are days: something added on the day of the last visit may have come after it.
  const isNew = (c: Item) => !!seen && c.date >= seen;
  const fresh = items.filter(isNew).length;

  return (
    <div>
      {fresh > 0 && (
        <p className="mono mb-4 flex items-center gap-2 text-[color:var(--ink)]">
          <span className="lamp" aria-hidden="true" />
          {fresh === 1 ? "One addition" : fresh + " additions"} since your last visit
        </p>
      )}
      <ol className="border-b border-[color:var(--rule)]">
        {items.map((c) => {
          const mark = isNew(c);
          return (
            <li key={c.date + c.text} className="grid gap-x-8 gap-y-2 border-t border-[color:var(--rule)] py-5 md:grid-cols-[14ch_1fr_auto] md:items-baseline">
              <span className={"mono flex items-center gap-2 " + (mark ? "text-[color:var(--ink)]" : "text-[color:var(--ink-mid)]")}>
                {mark && <span className="lamp" aria-hidden="true" />}
                {printed(c.date)}
                {mark && <span className="sr-only">, new since your last visit</span>}
              </span>
              <span className="text-[17px] leading-snug text-[color:var(--ink)]">
                {c.own && <span className="mono mr-3 inline-block border border-[color:var(--rule-strong)] px-2 py-0.5 align-middle text-[11px] text-[color:var(--ink)]">For you</span>}
                {c.text}
              </span>
              {c.href ? (
                <CutLink href={c.href} className="slate-link" data-cursor="Cut">
                  Open &#8599;
                </CutLink>
              ) : (
                <span />
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
