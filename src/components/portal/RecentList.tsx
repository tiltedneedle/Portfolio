"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { CutLink } from "@/components/room/CutLink";
import type { Change } from "@/content/clients/types";
import { belowFold } from "@/lib/below-fold";

/**
 * The recent additions, with the ones since this device's last visit
 * marked with a lamp. The visit is stamped when the page is left, so the
 * marks last the whole visit and are gone on the next. A first visit marks
 * nothing: everything is new, and the section already says so.
 *
 * "Still being written", so it writes itself: as the list comes on, each
 * entry's date is stamped and its line types out behind a tally caret, one
 * entry after another. Served at rest -- the whole list is in the HTML --
 * and set to wait only when it is still below the fold after hydration,
 * never under reduced motion. The typing is a picture of the line: a screen
 * reader is given each line whole, once.
 */
const STEP = 3; // characters a tick
const TICK = 24; // ms a tick
const BEAT = 220; // ms between one entry and the next
type Item = Change & { own?: boolean };

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
/** The date this device last saw the home list; the nav lights a lamp when the system has grown since. */
export const seenKey = (slug: string) => "tn-seen:" + slug;
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
    return localStorage.getItem(seenKey(slug)) ?? "";
  } catch {
    return "";
  }
}

export function RecentList({ slug, items }: { slug: string; items: Item[] }) {
  const seen = useSyncExternalStore(noop, () => lastSeen(slug), () => "");
  const list = useRef<HTMLOListElement>(null);
  // null: at rest, every line shown. "wait": below the fold, lines held
  // back. Otherwise the entry being typed and how much of it is out.
  const [type, setType] = useState<"wait" | { row: number; n: number } | null>(null);

  useEffect(() => {
    const ol = list.current;
    if (!ol || !items.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Held back only once it is known the list is below the fold, after hydration.
    return belowFold(ol, "0px 0px -15% 0px", {
      hold: () => setType("wait"),
      release: () => setType({ row: 0, n: 0 }),
    });
  }, [items.length]);

  useEffect(() => {
    if (!type || type === "wait") return;
    const text = items[type.row]?.text ?? "";
    const t =
      type.n < text.length
        ? setTimeout(() => setType({ row: type.row, n: Math.min(text.length, type.n + STEP) }), TICK)
        : setTimeout(() => setType(type.row + 1 < items.length ? { row: type.row + 1, n: 0 } : null), BEAT);
    return () => clearTimeout(t);
  }, [type, items]);

  useEffect(() => {
    const stamp = () => {
      try {
        localStorage.setItem(seenKey(slug), today());
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
      <ol ref={list} className="border-b border-[color:var(--rule)]">
        {items.map((c, k) => {
          const mark = isNew(c);
          // Where this entry is in the typing: shown whole, held back, or being typed.
          const phase = type === null ? "whole" : type === "wait" || k > type.row ? "held" : k < type.row ? "whole" : "typing";
          return (
            // A held entry fades out whole, not hidden: its link stays in the
            // tab order and in reach of a screen reader (.row-held).
            <li
              key={c.date + c.text}
              className={"grid gap-x-8 gap-y-2 border-t border-[color:var(--rule)] py-5 md:grid-cols-[14ch_1fr_auto] md:items-baseline" + (phase === "held" ? " row-held" : "")}
            >
              <span className={"mono flex items-center gap-2 " + (mark ? "text-[color:var(--ink)]" : "text-[color:var(--ink-mid)]") + (phase === "typing" ? " stamp-in" : "")}>
                {mark && <span className="lamp" aria-hidden="true" />}
                {printed(c.date)}
                {mark && <span className="sr-only">, new since your last visit</span>}
              </span>
              <span className="text-[17px] leading-snug text-[color:var(--ink)]">
                {c.own && <span className="mono mr-3 inline-block border border-[color:var(--rule-strong)] px-2 py-0.5 align-middle text-[11px] text-[color:var(--ink)]">For you</span>}
                {phase === "typing" && typeof type === "object" && type ? (
                  <>
                    <span className="sr-only">{c.text}</span>
                    {/* The rest of the line is laid out but unseen, so the
                        line does not reflow as it types. */}
                    <span aria-hidden="true">
                      {c.text.slice(0, type.n)}
                      <span className="type-caret" />
                      <span className="invisible">{c.text.slice(type.n)}</span>
                    </span>
                  </>
                ) : (
                  c.text
                )}
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
