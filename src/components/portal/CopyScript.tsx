"use client";

import { useEffect, useState } from "react";

/**
 * Copies the script as plain text. The lamp comes on while the copy is
 * confirmed. Where the clipboard API is missing (an insecure origin, an
 * old browser) it falls back to selecting a hidden textarea and copying
 * that, and only then tells the reader to copy by hand.
 */
function legacyCopy(text: string) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.top = "0";
  ta.style.left = "0";
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

export function CopyScript({ text, disabled }: { text: string; disabled?: boolean }) {
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
    <button
      type="button"
      onClick={copy}
      disabled={disabled}
      className="pill pill-solid inline-flex items-center gap-3 px-6 py-3 text-[15px] disabled:opacity-40"
      aria-live="polite"
    >
      {state === "done" && <span className="lamp" aria-hidden="true" />}
      {state === "idle" ? "Copy script" : state === "done" ? "Copied" : "Select the text and copy"}
    </button>
  );
}
