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
 * JPEG, 120 by 90, which a browser treats as a successful load. So the
 * frame is checked as well as the error event -- but by its SHAPE, not its
 * size. Every YouTube still this site asks for is 16:9 (maxresdefault,
 * mqdefault) or the video's own vertical crop (oardefault); 4:3 is the one
 * thing that cannot come back from a real video, so 4:3 from YouTube means
 * there is no such video.
 *
 * NOT naturalWidth, which is what this guard used to read. Under a `sizes`
 * attribute with a w-descriptor srcset the browser reports naturalWidth
 * density-corrected to the layout width, not to the width of the file: a
 * perfectly good 256px still sitting in a 150px well reports 150. A
 * "<= 160 means placeholder" test therefore deleted every still in the hero
 * backdrop, which is how the drift behind the client's name became thirty-two
 * empty boxes moving in the dark. A ratio survives the correction; a width
 * does not. Do not put a pixel threshold back.
 *
 * `sizes` is required. Without it `fill` falls back to 100vw and a 1920px
 * image is fetched for a 150px well, which is the whole bug this component
 * exists to close.
 */
const PLACEHOLDER_AR = 4 / 3;

export function Still({ src, className, sizes, eager = false }: { src: string; className?: string; sizes: string; eager?: boolean }) {
  const [failed, setFailed] = useState(false);
  const fromYouTube = src.includes("i.ytimg.com");
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
        if (!fromYouTube) return;
        const { naturalWidth: w, naturalHeight: h } = e.currentTarget;
        if (h > 0 && Math.abs(w / h - PLACEHOLDER_AR) < 0.03) setFailed(true);
      }}
    />
  );
}
