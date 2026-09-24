"use client";

import { useEffect, useState } from "react";

/**
 * Copies a prepared text: the hundred ideas as a list, a script, anything
 * the page has already laid out. Falls back to a hidden textarea where the
 * clipboard API is missing, and only then asks the reader to copy by hand.
 */
function legacyCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  let ok = false;
  try {
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  }
  document.body.removeChild(ta);
  return ok;
}

export function CopyText({ text, label, className = "slate-link text-[13px]" }: { text: string; label: string; className?: string }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");
  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2200);
    return () => clearTimeout(t);
  }, [state]);
  const copy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        setState("done");
        return;
      }
    } catch {
      // fall through to the legacy path
    }
    setState(legacyCopy(text) ? "done" : "fail");
  };
  return (
    <button type="button" onClick={copy} className={"no-print " + className} aria-live="polite" data-cursor="Copy">
      {state === "idle" ? label : state === "done" ? "Copied" : "Select and copy by hand"}
    </button>
  );
}
