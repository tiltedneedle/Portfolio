/**
 * Full-page film grain.
 *
 * The reference site runs a canvas grain library. This is a from-scratch
 * equivalent: a single inline SVG feTurbulence tile as a data URI, repeated and
 * nudged between a few offsets so it shimmers the way real film does. No
 * canvas, no rAF, no JS at runtime — it is one element and a CSS keyframe, so
 * it costs nothing on the main thread and cannot leak.
 *
 * The tile is deliberately small (180px) and the opacity low; grain should be
 * felt rather than seen. `prefers-reduced-motion` freezes the shimmer in
 * globals.css but keeps the texture, since the texture is not the motion.
 */

// baseFrequency high enough to read as grain rather than clouds; a single
// octave keeps the tile cheap to rasterise.
const NOISE_TILE =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180">
       <filter id="n">
         <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="1" stitchTiles="stitch"/>
         <feColorMatrix type="saturate" values="0"/>
       </filter>
       <rect width="180" height="180" filter="url(#n)" opacity="0.55"/>
     </svg>`
  );

export function FilmGrain() {
  return (
    <div
      className="grain"
      aria-hidden="true"
      style={{ backgroundImage: `url("${NOISE_TILE}")` }}
    />
  );
}
