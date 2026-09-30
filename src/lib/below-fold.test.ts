import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const FOLD = 800;

class FakeIO {
  static made: FakeIO[] = [];
  observed = new Set<Element>();
  constructor(
    public cb: (entries: IntersectionObserverEntry[]) => void,
    public opts: IntersectionObserverInit
  ) {
    FakeIO.made.push(this);
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
  }
  disconnect() {
    this.observed.clear();
  }
  /** Delivers one batch: [target, its top, whether it is inside the margin]. */
  fire(...batch: [Element, number, boolean][]) {
    this.cb(
      batch.map(
        ([target, top, isIntersecting]) =>
          ({ target, isIntersecting, boundingClientRect: { top }, rootBounds: { bottom: FOLD } }) as unknown as IntersectionObserverEntry
      )
    );
  }
}

const M = "0px 0px -60px 0px";
const el = () => ({}) as Element;
const spies = () => ({ hold: vi.fn(), release: vi.fn() });
const observer = (margin: string) => {
  const io = FakeIO.made.find((o) => o.opts.rootMargin === margin);
  if (!io) throw new Error("no observer for " + margin);
  return io;
};

async function load() {
  vi.resetModules();
  return (await import("./below-fold")).belowFold;
}

beforeEach(() => {
  FakeIO.made = [];
  vi.stubGlobal("IntersectionObserver", FakeIO);
  // Nothing may read the screen's height: on a phone that forces a layout.
  vi.stubGlobal("window", {
    get innerHeight(): number {
      throw new Error("read window.innerHeight");
    },
  });
});
afterEach(() => vi.unstubAllGlobals());

describe("belowFold", () => {
  it("leaves a block on screen, above it, or just showing at the bottom edge alone", async () => {
    const belowFold = await load();
    const [a, b, c] = [el(), el(), el()];
    const [sa, sb, sc] = [spies(), spies(), spies()];
    belowFold(a, M, sa);
    belowFold(b, M, sb);
    belowFold(c, M, sc);
    const sight = observer("0px");
    // c's top is 20px above the foot of the screen: showing, so not held,
    // though it is not yet 60px in.
    sight.fire([a, 300, true], [b, -2000, false], [c, 780, true]);
    for (const s of [sa, sb, sc]) {
      expect(s.hold).not.toHaveBeenCalled();
      expect(s.release).not.toHaveBeenCalled();
    }
    expect(sight.observed.size).toBe(0);
    expect(FakeIO.made.some((o) => o.opts.rootMargin === M)).toBe(false);
  });

  it("holds a block below the fold and lets it go once it is the margin into view", async () => {
    const belowFold = await load();
    const a = el();
    const s = spies();
    belowFold(a, M, s);
    observer("0px").fire([a, 1400, false]);
    expect(s.hold).toHaveBeenCalledTimes(1);
    expect(observer("0px").observed.has(a)).toBe(false);
    const release = observer(M);
    expect(release.observed.has(a)).toBe(true);
    release.fire([a, 1400, false]);
    release.fire([a, 790, false]);
    expect(s.release).not.toHaveBeenCalled();
    release.fire([a, 500, true]);
    expect(s.release).toHaveBeenCalledTimes(1);
    expect(s.hold).toHaveBeenCalledTimes(1);
    expect(release.observed.has(a)).toBe(false);
  });

  it("shares one observer for first sight, and one per release margin", async () => {
    const belowFold = await load();
    const blocks = [el(), el(), el()];
    belowFold(blocks[0], M, spies());
    belowFold(blocks[1], M, spies());
    belowFold(blocks[2], "0px 0px -15% 0px", spies());
    expect(FakeIO.made.map((io) => io.opts.rootMargin)).toEqual(["0px"]);
    observer("0px").fire(...blocks.map((b): [Element, number, boolean] => [b, 2000, false]));
    expect(FakeIO.made.map((io) => io.opts.rootMargin)).toEqual(["0px", M, "0px 0px -15% 0px"]);
    expect(observer(M).observed.size).toBe(2);
  });

  it("does nothing once cleaned up, before or after first sight", async () => {
    const belowFold = await load();
    const [a, b] = [el(), el()];
    const [sa, sb] = [spies(), spies()];
    belowFold(a, M, sa)();
    const stopB = belowFold(b, M, sb);
    observer("0px").fire([b, 1400, false]);
    stopB();
    expect(observer("0px").observed.size).toBe(0);
    expect(observer(M).observed.size).toBe(0);
    expect(sa.hold).not.toHaveBeenCalled();
    expect(sb.hold).toHaveBeenCalledTimes(1);
    expect(sb.release).not.toHaveBeenCalled();
  });

  it("a stale cleanup leaves a newer watch on the same block be", async () => {
    const belowFold = await load();
    const a = el();
    const first = spies();
    const stop = belowFold(a, M, first);
    stop();
    const second = spies();
    belowFold(a, M, second);
    stop();
    const sight = observer("0px");
    expect(sight.observed.has(a)).toBe(true);
    sight.fire([a, 1400, false]);
    expect(first.hold).not.toHaveBeenCalled();
    expect(second.hold).toHaveBeenCalledTimes(1);
  });

  it("never holds anything without an IntersectionObserver", async () => {
    vi.stubGlobal("IntersectionObserver", undefined);
    const belowFold = await load();
    const s = spies();
    expect(() => belowFold(el(), M, s)()).not.toThrow();
    expect(s.hold).not.toHaveBeenCalled();
  });
});
