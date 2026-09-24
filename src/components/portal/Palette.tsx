"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { beginCut } from "@/lib/cut";
import { EASE_OUT_EXPO } from "@/lib/design-tokens";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { snippet, type SearchEntry } from "@/lib/search-index";

/**
 * The palette: every page and every section of the system, one keystroke
 * away. ⌘K or / opens it, typing filters, arrows move, Enter cuts. The
 * square brackets page through the system in order without opening it.
 *
 * The index is built on the server (titles and hrefs only) and handed in,
 * so the browser never carries the guide text.
 */
export type PaletteItem = {
  href: string;
  title: string;
  chapter: string;
  n: string;
  sections: { id: string; title: string; n?: string }[];
  /** Not listed until something is typed: the client's ideas and scripts. */
  hidden?: boolean;
};

type Hit = { href: string; title: string; kicker: string; n: string; section?: boolean; snippet?: string };

// The full-text index, fetched once per visit the first time three letters are typed.
let indexCache: SearchEntry[] | null = null;
let indexLoading: Promise<void> | null = null;
function loadIndex() {
  if (indexCache || indexLoading) return indexLoading ?? Promise.resolve();
  indexLoading = fetch("/search-index.json", { credentials: "same-origin" })
    .then((r) => (r.ok ? r.json() : null))
    .then((data) => {
      if (Array.isArray(data)) indexCache = data as SearchEntry[];
    })
    .catch(() => {
      // The palette still finds pages and sections by their titles.
    })
    .finally(() => {
      indexLoading = null;
    });
  return indexLoading;
}

const KEYS = "⌘K";

/** The prompter or the lightbox is up: their keys are theirs. */
function otherDialogOpen() {
  return !!document.querySelector('[role="dialog"][aria-modal="true"]:not([aria-label="Contents"]):not([aria-label="Keys"])');
}

function isTyping(e: KeyboardEvent) {
  const t = e.target as HTMLElement | null;
  if (!t) return false;
  const tag = t.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || t.isContentEditable;
}

export function Palette({ items }: { items: PaletteItem[] }) {
  const [open, setOpen] = useState(false);
  const [help, setHelp] = useState(false);
  // Bumps once the index has arrived so the hits recompute.
  const [indexed, setIndexed] = useState(0);
  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const box = useRef<HTMLDivElement>(null);
  useFocusTrap(open, box);
  // A section anchor to jump to once the next page has committed.
  const pendingHash = useRef<string | null>(null);
// The exit animation keeps the field mounted for a beat; a key pressed in
  // that beat must reach the page, not the dying field, so focus leaves first.
  const close = useCallback(() => {
    input.current?.blur();
    setOpen(false);
  }, []);
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();

  // The page order for [ and ]: every distinct path, home first.
  const order = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const it of items) {
      if (it.hidden) continue;
      const p = it.href.split("#")[0];
      if (!seen.has(p)) {
        seen.add(p);
        out.push(p);
      }
    }
    return out;
  }, [items]);

  const go = useCallback(
    (href: string) => {
      close();
      const path = href.split("#")[0];
      if (path === pathname) {
        const hash = href.split("#")[1];
        // A jump within the scene is a cut too: instant, and only once the
        // palette has gone (a smooth scroll started while it closes is
        // dropped by the browser).
        document.body.style.overflow = "";
        const target = hash ? document.getElementById(hash) : null;
        // Keep the address honest without a navigation.
        history.replaceState(null, "", hash ? "#" + hash : window.location.pathname);
        setTimeout(() => {
          if (hash) target?.scrollIntoView({ block: "start", behavior: "instant" });
          else window.scrollTo({ top: 0, behavior: "instant" });
        }, 80);
        return;
      }
      pendingHash.current = href.split("#")[1] || null;
      if (!reduced) beginCut();
      requestAnimationFrame(() => router.push(href));
    },
    [pathname, reduced, router, close]
  );

  // The router lands new pages at the top; a section pick still has to
  // arrive at its section. The cut frame is up while this happens, so the
  // jump is instant and never seen. (Smooth here would be cancelled by the
  // overlay's own reset to the top, which runs in the same commit.)
  useEffect(() => {
    const hash = pendingHash.current;
    if (!hash) return;
    pendingHash.current = null;
    requestAnimationFrame(() => document.getElementById(hash)?.scrollIntoView({ block: "start", behavior: "instant" }));
  }, [pathname]);

  const show = useCallback(() => {
    setQ("");
    setCursor(0);
    setOpen(true);
  }, []);


  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (otherDialogOpen()) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) close();
        else show();
        return;
      }
      if (isTyping(e)) return;
      if (e.key === "?" && !open) {
        e.preventDefault();
        setHelp((h) => !h);
        return;
      }
      if (help && e.key === "Escape") {
        setHelp(false);
        return;
      }
      if (e.key === "/" && !open) {
        e.preventDefault();
        show();
        return;
      }
      if (open) return;
      if (e.key === "[" || e.key === "]") {
        const step = e.key === "]" ? 1 : -1;
        // On a script, the brackets page through the scripts themselves.
        const script = pathname.match(/^\/content\/scripts\/(\d+)$/);
        if (script) {
          const n = Number(script[1]) + step;
          if (n >= 1 && n <= 20) go("/content/scripts/" + n);
          return;
        }
        const i = order.indexOf(pathname);
        if (i === -1) return;
        const next = order[i + step];
        if (next) go(next);
      }
    };
    window.addEventListener("keydown", key);
    window.addEventListener("tn:palette", show);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("tn:palette", show);
    };
  }, [open, help, order, pathname, go, show, close]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const t = setTimeout(() => input.current?.focus(), 30);
    return () => {
      document.body.style.overflow = "";
      clearTimeout(t);
    };
  }, [open]);

  useEffect(() => {
    if (!open || indexCache || q.trim().length < 3) return;
    let live = true;
    loadIndex().then(() => {
      if (live && indexCache) setIndexed((n) => n + 1);
    });
    return () => {
      live = false;
    };
  }, [open, q]);

  const hits = useMemo<Hit[]>(() => {
    const needle = q.trim().toLowerCase();
    const pages: Hit[] = items.filter((it) => !it.hidden).map((it) => ({ href: it.href, title: it.title, kicker: it.chapter, n: it.n }));
    if (!needle) return pages;
    const words = needle.split(/\s+/).filter(Boolean);
    const matches = (s: string) => words.every((w) => s.toLowerCase().includes(w));
    const out: Hit[] = [];
    for (const it of items) {
      if (matches(it.title + " " + it.chapter + " " + it.n)) out.push({ href: it.href, title: it.title, kicker: it.chapter, n: it.n });
    }
    for (const it of items) {
      for (const s of it.sections) {
        if (matches(s.title + " " + it.title + " " + it.chapter)) out.push({ href: it.href + "#" + s.id, title: s.title, kicker: it.title, n: s.n ?? it.n, section: true });
      }
    }
    // Then the words themselves, once the index is here and there is enough typed to mean something.
    if (needle.length >= 3 && indexCache) {
      const seen = new Set(out.map((h) => h.href));
      for (const e of indexCache) {
        for (const s of e.sections) {
          const href = e.href + (s.id ? "#" + s.id : "");
          if (seen.has(href) || !matches(s.text)) continue;
          seen.add(href);
          out.push({ href, title: s.title, kicker: e.title, n: s.n ?? e.n, section: true, snippet: snippet(s.text, words[0]) });
        }
      }
    }
    return out.slice(0, 14);
    // indexed is a tick that says the index has arrived; the memo must rerun then.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, q, indexed]);

  useEffect(() => {
    const el = list.current?.children[cursor] as HTMLElement | undefined;
    el?.scrollIntoView({ block: "nearest" });
  }, [cursor]);

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") close();
    else if (e.key === "ArrowDown") {
      e.preventDefault();
      setCursor((c) => Math.min(hits.length - 1, c + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setCursor((c) => Math.max(0, c - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const h = hits[cursor];
      if (h) go(h.href);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={show}
        className="mono no-print fixed bottom-6 left-6 z-40 hidden items-center gap-3 border border-[color:var(--rule-strong)] bg-[rgba(11,11,12,0.7)] px-3 py-2 backdrop-blur-md transition-colors hover:text-[color:var(--ink)] md:flex"
        aria-label="Open the contents"
        data-cursor="Open"
      >
        Contents <span className="text-[color:var(--ink-mid)]">{KEYS}</span>
      </button>

      <AnimatePresence>
        {help && !open && (
          <motion.div
            key="help"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            className="fixed inset-0 z-[90] flex items-end justify-start bg-black/60 p-6 backdrop-blur-sm md:p-14"
            onClick={() => setHelp(false)}
          >
            <div role="dialog" aria-modal="true" aria-label="Keys" onClick={(e) => e.stopPropagation()} className="panel w-full max-w-[420px] p-6">
              <p className="mono flex items-center justify-between">
                <span>Keys</span>
                <span className="text-[color:var(--ink-mid)]">? or Esc to close</span>
              </p>
              <dl className="mt-5 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-[15px] text-[color:var(--ink-soft)]">
                {[
                  ["\u2318K  or  /", "Contents: any page, any section"],
                  ["[  ]", "Previous and next page; on a script, the scripts"],
                  ["\u2191 \u2193  \u21B5", "Move and open, inside the contents"],
                  ["Space", "Roll and pause the prompter"],
                  ["\u2191 \u2193  +  \u2212  M  R", "Prompter pace, size, mirror, rewind"],
                  ["Esc", "Close anything"],
                ].map(([k, v]) => (
                  <Fragment key={k}>
                    <dt className="mono whitespace-nowrap text-[color:var(--ink)]">{k}</dt>
                    <dd>{v}</dd>
                  </Fragment>
                ))}
              </dl>
            </div>
          </motion.div>
        )}
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.18 }}
            className="fixed inset-0 z-[90] flex items-start justify-center bg-black/70 px-4 pt-[12vh] backdrop-blur-sm"
            onClick={() => close()}
          >
            <motion.div
              initial={reduced ? false : { opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6 }}
              transition={{ duration: 0.22, ease: EASE_OUT_EXPO }}
              ref={box}
              role="dialog"
              aria-modal="true"
              aria-label="Contents"
              onClick={(e) => e.stopPropagation()}
              className="panel w-full max-w-[680px] overflow-hidden"
            >
              <div className="flex items-center gap-4 border-b border-[color:var(--rule)] px-5 py-4">
                <span className="mono shrink-0">Go to</span>
                <input
                  ref={input}
                  value={q}
                  onChange={(e) => {
                    setQ(e.target.value);
                    setCursor(0);
                  }}
                  onKeyDown={onKey}
                  placeholder="A page, a section, any words"
                  className="w-full bg-transparent text-[19px] text-[color:var(--ink)] outline-none placeholder:text-[color:var(--ink-mid)]"
                  aria-label="Search the system"
                  autoComplete="off"
                  spellCheck={false}
                />
                <span className="mono shrink-0 text-[color:var(--ink-mid)]">Esc</span>
              </div>
              <ul ref={list} className="max-h-[52vh] overflow-y-auto py-2" role="listbox">
                {hits.length === 0 && (
                  <li className="mono px-5 py-6 text-[color:var(--ink-mid)]">Nothing on that. Try a room, a page or a subject.</li>
                )}
                {hits.map((h, i) => (
                  <li key={h.href + i} role="option" aria-selected={i === cursor}>
                    <button
                      type="button"
                      onMouseEnter={() => setCursor(i)}
                      onClick={() => go(h.href)}
                      className={
                        "flex w-full items-baseline gap-4 px-5 py-2.5 text-left transition-colors " +
                        (i === cursor ? "bg-[color:var(--stage-3)] text-[color:var(--ink)]" : "text-[color:var(--ink-soft)]")
                      }
                    >
                      <span className="mono w-[5ch] shrink-0 text-[color:var(--ink-mid)]">{h.n}</span>
                      <span className="min-w-0 flex-1">
                        <span className={h.section ? "text-[15px]" : "text-[17px]"}>{h.title}</span>
                        {h.snippet && <span className="mt-0.5 block truncate text-[12px] text-[color:var(--ink-mid)]">{h.snippet}</span>}
                      </span>
                      <span className="mono ml-auto shrink-0 text-[color:var(--ink-mid)]">{h.kicker}</span>
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mono flex flex-wrap gap-x-6 gap-y-1 border-t border-[color:var(--rule)] px-5 py-3 text-[color:var(--ink-mid)]">
                <span>&uarr;&darr; move</span>
                <span>&crarr; open</span>
                <span>[ ] previous / next page</span>
                <span>/ search</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
