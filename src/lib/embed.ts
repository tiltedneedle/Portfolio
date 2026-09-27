/**
 * The privacy-enhanced player URL for a YouTube id.
 *
 * Data-free on purpose, and in its own file on purpose. This is the one
 * published-index helper a client component needs, and while it lived in
 * lib/published.ts every visitor downloaded the studio's whole publishing
 * index -- 634 entries, 250 KB -- because that module's first line imports
 * published.json. Do not re-export this from there: a re-export rebuilds
 * the same path. src/lib/client-bundle.test.ts holds the rule.
 */
export function embedUrl(videoId: string) {
  return "https://www.youtube-nocookie.com/embed/" + videoId + "?rel=0&modestbranding=1&playsinline=1&color=white&autoplay=1";
}
