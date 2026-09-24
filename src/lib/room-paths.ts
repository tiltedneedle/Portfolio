/**
 * The two path maps the proxy applies on every request. Pure, so they can
 * be tested without a request.
 *
 * A client's pages are pre-rendered under `/c/<slug>/...`; visitors only
 * ever see clean paths. `roomPath` is the rewrite from a clean path into a
 * client's tree; `cleanPath` is the bounce for anything that arrives
 * addressed to a tree directly.
 */

/** `/create/hooks` for `demo` becomes `/c/demo/create/hooks`; `/` becomes `/c/demo`. */
export function roomPath(path: string, slug: string) {
  return "/c/" + slug + (path === "/" ? "" : path);
}

/** True for `/c` and anything under it. */
export function isRoomPath(path: string) {
  return path === "/c" || path.startsWith("/c/");
}

/** `/c/demo/create/hooks` becomes `/create/hooks`; `/c/demo` and `/c` become `/`. */
export function cleanPath(path: string) {
  return path.replace(/^\/c(\/[^/]+)?/, "") || "/";
}
