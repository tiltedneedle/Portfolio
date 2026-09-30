"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useClientOptional } from "@/components/portal/ClientContext";
import { monogram, type PublicIdentity } from "@/content/clients/types";

/**
 * The lockup: the Tilted Needle mark, a serif ×, and the client's mark.
 * Until a logo is supplied the client's mark is a monogram in a hairline
 * square, a design in its own right rather than a hole where one should be.
 *
 * Pass `identity={null}` for the studio mark alone (the door, before anyone
 * is in the room).
 */
export function ClientMark({ size = 56, fluid, className = "", identity }: { size?: number; fluid?: string; className?: string; identity?: PublicIdentity | null }) {
  const fromRoom = useClientOptional();
  const who = identity === undefined ? fromRoom : identity;
  // The whole lockup is drawn from one length, --mark: the box, and the ×
  // and the monogram in proportion to it. It is `size` px, or `fluid`, a CSS
  // length the box follows instead (the home hero's gives way to a short
  // screen); `size` is then the images' own size, so it should be the most
  // the box ever grows to.
  const box = "var(--mark)";
  return (
    <span
      className={"inline-flex items-center gap-[0.35em] " + className}
      style={{ "--mark": fluid ?? size + "px", fontSize: "calc(var(--mark) * 0.5)" } as CSSProperties}
      role="img"
      aria-label={who ? "Tilted Needle and " + who.name : "Tilted Needle"}
    >
      <Image src="/white-logo.png" alt="" width={size} height={size} className="object-contain" style={{ width: box, height: box }} />
      {who && (
        <>
          <span className="em-serif text-[color:var(--ink-mid)]" aria-hidden="true">
            &times;
          </span>
          {who.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={who.logo} alt="" style={{ height: box, width: "auto", maxWidth: "calc(var(--mark) * 3)" }} className="object-contain" />
          ) : (
            <span
              className="display inline-flex items-center justify-center border border-[color:var(--rule-strong)] text-[color:var(--ink)]"
              style={{ width: box, height: box, fontSize: "calc(var(--mark) * 0.42)", letterSpacing: "0.02em" }}
              aria-hidden="true"
            >
              {monogram(who)}
            </span>
          )}
        </>
      )}
    </span>
  );
}
