import type { ReactNode } from "react";

/**
 * Inline marks in content strings: `**bold**` and `*emphasis*` (the serif
 * italic). A hand-written scanner rather than a regex, so there is nothing to
 * escape and nothing to get wrong.
 */
export function Rich({ text }: { text: string }) {
  const out: ReactNode[] = [];
  let i = 0;
  let key = 0;
  while (i < text.length) {
    const b = text.indexOf("**", i);
    const e = text.indexOf("*", i);
    let next = -1;
    let kind: "b" | "e" | null = null;
    if (b !== -1 && (e === -1 || b <= e)) {
      next = b;
      kind = "b";
    } else if (e !== -1) {
      next = e;
      kind = "e";
    }
    if (next === -1 || kind === null) {
      out.push(text.slice(i));
      break;
    }
    if (next > i) out.push(text.slice(i, next));
    if (kind === "b") {
      const close = text.indexOf("**", next + 2);
      if (close === -1) {
        out.push(text.slice(next));
        break;
      }
      out.push(
        <strong key={key++} className="font-medium text-[color:var(--ink)]">
          {text.slice(next + 2, close)}
        </strong>
      );
      i = close + 2;
    } else {
      const close = text.indexOf("*", next + 1);
      if (close === -1) {
        out.push(text.slice(next));
        break;
      }
      out.push(
        <em key={key++} className="em-serif">
          {text.slice(next + 1, close)}
        </em>
      );
      i = close + 1;
    }
  }
  return <>{out}</>;
}
