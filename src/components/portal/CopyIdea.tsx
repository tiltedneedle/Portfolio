"use client";

import { useEffect, useState } from "react";

/** A one-word copy control for a card. Falls back to a hidden textarea where the clipboard API is missing. */
export function CopyIdea({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => setDone(false), 1600);
    return () => clearTimeout(t);
  }, [done]);
  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setDone(true);
        return;
      }
    } catch {
      // fall through
    }
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      setDone(true);
    } catch {
      // nothing more to try
    }
    document.body.removeChild(ta);
  };
  return (
    <button type="button" onClick={copy} className="slate-link no-print text-[11px]" aria-live="polite" data-cursor="Copy">
      {done ? "Copied" : "Copy"}
    </button>
  );
}
