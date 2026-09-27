"use client";

import Image from "next/image";
import { useState } from "react";

/**
 * A remote still that steps aside when it cannot load, so the slate under
 * it shows instead of a broken-image mark or a grey placeholder.
 *
 * Through next/image, so the AVIF and WebP pipeline next.config.ts has
 * always declared is actually used: before this the app served full-size
 * JPEGs straight from YouTube into wells as small as 64px.
 *
 * YouTube answers an unknown id with a 404 that still carries a tiny grey
 * JPEG (120 by 90), which a browser treats as a successful load. So the
 * decoded size is checked as well as the error event: anything that small
 * is not a still. The guard survives the optimiser because it resizes on
 * width only and never enlarges, so that 120px placeholder comes back
 * still 120 wide. Do not "fix" it away.
 *
 * `sizes` is required. Without it `fill` falls back to 100vw and a 1920px
 * image is fetched for a 150px well, which is the whole bug this change
 * exists to close.
 */
const PLACEHOLDER_MAX = 160;

export function Still({ src, className, sizes, eager = false }: { src: string; className?: string; sizes: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <Image
      src={src}
      alt=""
      fill
      sizes={sizes}
      priority={eager}
      className={className}
      onError={() => setFailed(true)}
      onLoad={(e) => {
        if (e.currentTarget.naturalWidth <= PLACEHOLDER_MAX) setFailed(true);
      }}
    />
  );
}
