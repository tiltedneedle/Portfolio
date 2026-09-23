"use client";

import { useEffect, useState } from "react";

/** Copies the script as plain text. The lamp comes on while the copy is confirmed. */
export function CopyScript({ text, disabled }: { text: string; disabled?: boolean }) {
  const [state, setState] = useState<"idle" | "done" | "fail">("idle");

  useEffect(() => {
    if (state === "idle") return;
    const t = setTimeout(() => setState("idle"), 2200);
    return () => clearTimeout(t);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("fail");
    }
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
