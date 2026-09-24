"use client";

import { useState } from "react";

/**
 * A remote still that steps aside when it cannot load, so the slate under
 * it shows instead of a broken-image mark or a grey placeholder.
 *
 * YouTube answers an unknown id with a 404 that still carries a tiny grey
 * JPEG (120 by 90), which a browser treats as a successful load. So the
 * decoded size is checked as well as the error event: anything that small
 * is not a still.
 */
const PLACEHOLDER_MAX = 160;

export function Still({ src, className, eager = false }: { src: string; className?: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      onError={() => setFailed(true)}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth <= PLACEHOLDER_MAX) setFailed(true);
      }}
      className={className}
    />
  );
}
