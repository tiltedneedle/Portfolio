/**
 * Below the fold, once: the rule behind every block that is served at rest
 * and comes on as the reader reaches it (Reveal, Odometer, TypeOn,
 * RecentList). A block still below the fold when the page settles is held
 * back, and let go once it is a margin into view; a block already on
 * screen, or above it, is left alone.
 *
 * Each block used to decide with a getBoundingClientRect in its own mount
 * effect, then write a class. On a guide page that is forty-odd reads, each
 * forcing the layout the block before it had just invalidated: on a
 * throttled phone, 780ms of the load went on it. Here IntersectionObservers
 * do all the measuring. Their entries arrive in one batch after the
 * browser's own layout, with the block's box and the screen's already
 * taken, so nothing here reads the layout at all -- not even
 * window.innerHeight, which on a phone is itself a forced layout. First
 * sight is taken with no margin, so the entry's root is the screen itself;
 * the block is then handed to an observer with the release margin. The
 * observers are shared: one for first sight, one per release margin.
 */
type Watcher = (entry: IntersectionObserverEntry) => void;

const shared = new Map<string, { io: IntersectionObserver; watchers: Map<Element, Watcher> }>();

function watch(el: Element, margin: string, fn: Watcher) {
  let o = shared.get(margin);
  if (!o) {
    const watchers = new Map<Element, Watcher>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) watchers.get(e.target)?.(e);
      },
      { rootMargin: margin }
    );
    o = { io, watchers };
    shared.set(margin, o);
  }
  const { io, watchers } = o;
  watchers.set(el, fn);
  io.observe(el);
  return () => {
    // A newer watch on the same element is not this one's to end.
    if (watchers.get(el) !== fn) return;
    watchers.delete(el);
    io.unobserve(el);
  };
}

/**
 * Calls `hold` if `el` is below the fold at first sight, then `release`
 * once it is `margin` into view (a rootMargin, e.g. "0px 0px -60px 0px").
 * On screen or above it at first sight, neither is called. Without an
 * IntersectionObserver nothing is ever held. Returns the cleanup.
 */
export function belowFold(el: Element, margin: string, { hold, release }: { hold: () => void; release: () => void }) {
  if (typeof IntersectionObserver === "undefined") return () => {};
  let stop = watch(el, "0px", (e) => {
    stop();
    // The foot of the screen, as the observer saw it. (A root that cannot
    // be seen, in a cross-origin frame, gives none: then only a block
    // showing, or above the top, is left alone.)
    const fold = e.rootBounds ? e.rootBounds.bottom : 0;
    if (e.isIntersecting || e.boundingClientRect.top < fold) return;
    hold();
    stop = watch(el, margin, (f) => {
      if (!f.isIntersecting) return;
      stop();
      release();
    });
  });
  return () => stop();
}
