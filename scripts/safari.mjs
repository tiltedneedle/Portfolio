// Safari's engine: every page a reader can reach from the front page, in
// Playwright's WebKit, as an iPhone and as desktop Safari. Each page has to
// answer, come alive (hydrate) with no page or console errors, and never be
// wider than the screen: not as it opens, and not in any frame while it is
// scrolled through. The last is why this exists. WebKit counts what is drawn
// toward a page's width, animations mid-flight included, where Chromium does
// not: a flap dropping in perspective made a phone's page 53px too wide and a
// date stamp landing at 1.7x 218px, while every Chromium check, the
// accessibility pass included, measured 0. Then the phone menu, open. Needs
// the browser once: `npx playwright install webkit`.
//
//   node scripts/safari.mjs http://localhost:3400                                 (open door)
//   PORTAL_SECRET=... node scripts/safari.mjs http://localhost:3401 --gated --code horizon-2026
//
// Gated, it signs the demo client's session with the server's secret, as
// links does (the server needs PORTAL_DEMO=1): Safari keeps the Secure
// cookie the door sets, but will not send it back to plain http://localhost,
// so a session won through the form here is lost on the next page load.
// Production is https, where it is sent. With --code the form is checked on
// its own: a client typing the code is let through.
import crypto from "node:crypto";
import { devices, webkit } from "playwright";

const base = process.argv[2] || "http://localhost:3400";
const codeAt = process.argv.indexOf("--code");
const code = codeAt > -1 ? process.argv[codeAt + 1] : "";
let session = null;
if (process.argv.includes("--gated")) {
  const secret = process.env.PORTAL_SECRET;
  if (!secret) {
    console.error("safari: --gated needs the server's PORTAL_SECRET in the environment");
    process.exit(2);
  }
  const exp = Date.now() + 3600e3;
  const value = "demo." + exp + "." + crypto.createHmac("sha256", secret).update("demo." + exp).digest("hex");
  session = { name: "tn-room", value, domain: new URL(base).hostname, path: "/", httpOnly: true, secure: false, sameSite: "Lax" };
}
const FILE = /\.(png|jpe?g|webp|avif|gif|svg|mp4|ico|json|txt|webmanifest|pdf)$/;
const SHAPES = [
  { name: "iphone", device: devices["iPhone 15"] },
  { name: "desktop", device: devices["Desktop Safari"] },
];

let failed = 0;
const say = (ok, msg) => {
  if (!ok) failed++;
  console.log((ok ? "ok    " : "FAIL  ") + msg);
};

/** Go to a page and let it settle (not networkidle: see a11y). */
async function visit(page, url, settle = 600) {
  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForLoadState("load", { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(settle);
  return resp;
}

/**
 * Scroll the page through, top to bottom, while a frame loop watches its
 * width. Steps of most of a screen, so every block is on screen at some
 * step and every reveal starts; the loop keeps watching between steps, and
 * for most of a second at the foot, so an animation still under way is
 * seen. Says how far past the screen the page got, and what was reaching
 * past its edge then: something moving (a transform, an animation), outside
 * any sideways scroller of its own.
 *
 * Frames alone are not enough. The stamp's easing does nearly all its
 * travel at once, so it is widest for a few milliseconds, and a frame lands
 * there or not by luck (on one broken build, one walk saw it 218px past the
 * screen, another 23px, another not at all). So each animation that moves
 * something is also stopped as it appears and measured at set points along
 * its run, from its first frame, then let go where it was.
 */
const scrollThrough = (page) =>
  page.evaluate(async () => {
    const de = document.documentElement;
    de.style.scrollBehavior = "auto";
    const cw = de.clientWidth;
    let worst = 0;
    let culprit = "";
    const name = (el) => el.tagName.toLowerCase() + (typeof el.className === "string" && el.className.trim() ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : "");
    const seen = new WeakSet();
    const MOVES = /transform|translate|scale|rotate/;
    // Blamed only for what it adds: the page may already be too wide.
    const probe = (base) => {
      for (const a of document.getAnimations()) {
        if (seen.has(a) || a.pending || a.currentTime === null) continue;
        seen.add(a);
        const fx = a.effect;
        const end = fx && fx.target ? fx.getComputedTiming().endTime : Infinity;
        if (!Number.isFinite(end) || !fx.getKeyframes().some((k) => Object.keys(k).some((p) => MOVES.test(p)))) continue;
        const was = a.currentTime;
        const running = a.playState === "running";
        a.pause();
        for (const f of [0, 0.1, 0.25, 0.5]) {
          a.currentTime = f * end;
          const over = de.scrollWidth - cw;
          if (over > base && over > worst) {
            worst = over;
            culprit = name(fx.target) + ", " + Math.round(f * 100) + "% into " + (a.animationName || "its animation");
          }
        }
        a.currentTime = was;
        if (running) a.play();
      }
    };
    const find = () => {
      for (const el of document.body.querySelectorAll("*")) {
        const r = el.getBoundingClientRect();
        if (!r.width || r.right <= cw + 0.5) continue;
        const cs = getComputedStyle(el);
        if (cs.position === "fixed" || (cs.transform === "none" && !el.getAnimations().length)) continue;
        let own = false;
        for (let a = el.parentElement; a && a !== document.body; a = a.parentElement) {
          if (getComputedStyle(a).overflowX !== "visible") {
            own = true;
            break;
          }
        }
        if (!own) return name(el) + " to " + Math.round(r.right) + "px";
      }
      return "";
    };
    let watching = true;
    const watch = () => {
      const over = de.scrollWidth - cw;
      if (over > worst) {
        worst = over;
        culprit = find();
      }
      probe(over);
      if (watching) requestAnimationFrame(watch);
    };
    requestAnimationFrame(watch);
    const step = Math.round(innerHeight * 0.85);
    for (let y = 0; y < de.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 100));
    }
    await new Promise((r) => setTimeout(r, 800));
    watching = false;
    return { worst, culprit };
  });

/**
 * One shape's walk: every page reached by following links from the front
 * page, checked as above, then (on the phone) the menu. Lines are kept and
 * printed after, since the two shapes walk at once.
 */
async function walk(browser, shape) {
  const lines = [];
  const note = (ok, msg) => {
    if (!ok) failed++;
    lines.push((ok ? "ok    " : "FAIL  ") + msg);
  };
  const label = shape.name.padEnd(8);
  const errors = [];
  let context = null;
  let page = null;
  let crashed = false;
  // A fresh context and page, with the session and past the slate (which
  // plays once, on a first visit, over everything, and is not what is
  // measured here). If WebKit loses a page, the walk goes on in a new one.
  const open = async () => {
    if (context) await context.close().catch(() => {});
    context = await browser.newContext({ ...shape.device });
    if (session) await context.addCookies([session]);
    await context.addInitScript(() => {
      try {
        localStorage.setItem("tn-slate-seen", "1");
      } catch {}
    });
    page = await context.newPage();
    crashed = false;
    page.on("crash", () => (crashed = true));
    page.on("pageerror", (e) => errors.push(String(e)));
    page.on("console", (m) => {
      if (m.type() === "error") errors.push(m.text());
    });
  };

  // One page: what is wrong with it, and the pages it leads to.
  const check = async (path) => {
    errors.length = 0;
    const resp = await visit(page, base + path);
    // Alive: React has taken over every part of the page, each section and
    // the footer, which hydrate on their own and late (its fiber is on the
    // element once it has). Waited for, since a part sets up its reveals as
    // it hydrates: scrolled through before that, the walk passed a list
    // that had not yet been set to write itself, and missed its stamp
    // running 218px past the screen.
    const alive = await page
      .waitForFunction(
        () => {
          const parts = [document.querySelector("main"), ...document.querySelectorAll("main section, footer")].filter(Boolean);
          return parts.length > 0 && parts.every((el) => Object.keys(el).some((k) => k.startsWith("__reactFiber")));
        },
        null,
        { timeout: 15000, polling: 100 }
      )
      .then(
        () => true,
        () => false
      );
    const at = await page.evaluate(() => ({
      over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      links: [...document.querySelectorAll("a[href^='/']")].map((a) => a.getAttribute("href")),
    }));
    const links = [];
    for (const href of at.links) {
      const clean = href.split("#")[0].split("?")[0] || "/";
      // Written scripts are twenty pages of one template: the first three
      // stand for the rest here (the accessibility pass visits every one).
      const n = /\/(\d+)$/.exec(clean);
      if (n && Number(n[1]) > 3) continue;
      if (!FILE.test(clean) && !clean.startsWith("/_next") && !clean.startsWith("/login")) links.push(clean);
    }
    const run = await scrollThrough(page);
    const status = resp ? resp.status() : 0;
    // A page that bounces to the door answers 200 and passes everything
    // else, and the walk ends there, one page long.
    const door = new URL(page.url()).pathname.startsWith("/login");
    const problems = [
      door ? "sent to the door (no session)" : "",
      status !== 200 ? "answered " + status : "",
      alive ? "" : "never came alive (a part never hydrated)",
      at.over > 0 ? at.over + "px wider than the screen as it opens" : "",
      run.worst > 0 ? run.worst + "px wider than the screen while scrolled through" + (run.culprit ? " (" + run.culprit + ")" : "") : "",
      errors.length ? "console: " + errors[0].slice(0, 140) : "",
    ].filter(Boolean);
    return { problems, links };
  };

  await open();
  const queue = ["/"];
  const queued = new Set(queue);
  while (queue.length) {
    const path = queue.shift();
    // A page WebKit loses (its process crashes, or the page goes) is tried
    // once more in a fresh one: lost twice is a failure, lost once is said.
    let result = null;
    let lost = "";
    for (let attempt = 0; attempt < 2 && !result; attempt++) {
      try {
        result = await check(path);
      } catch (e) {
        lost = (crashed ? "crashed" : "gone") + ": " + String(e?.message || e).split("\n")[0].slice(0, 100);
        await open();
      }
    }
    if (!result) {
      note(false, label + path.padEnd(44) + "WebKit lost the page twice (" + lost + ")");
      continue;
    }
    for (const next of result.links) {
      if (queued.has(next)) continue;
      queued.add(next);
      queue.push(next);
    }
    note(result.problems.length === 0, label + path.padEnd(44) + result.problems.join("  ") + (lost ? "  (WebKit lost the page once, " + lost + "; this is the second try)" : ""));
  }
  lines.push("      " + label + queued.size + " pages");

  // The phone menu fills the screen and is no wider than it (it was 12px
  // wider in Safari once, from a flap waiting on the page behind it).
  if (shape.name === "iphone") {
    try {
      await visit(page, base + "/");
      await page.click("[data-nav] button[aria-controls='system-menu']");
      await page.waitForTimeout(800);
      const menu = await page.evaluate(() => ({
        open: !!document.querySelector("#system-menu"),
        over: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      }));
      note(menu.open && menu.over <= 0, label + "menu open" + (menu.open ? "" : "  (did not open)") + (menu.over > 0 ? "  " + menu.over + "px wider than the screen" : ""));
    } catch (e) {
      note(false, label + "menu open  (" + String(e?.message || e).split("\n")[0].slice(0, 100) + ")");
    }
  }
  await context.close().catch(() => {});
  return lines;
}

const browser = await webkit.launch();
try {
  // The door, as a client meets it on a phone: the code typed into the form
  // is sent, and the door answers with a session. Read off the door's
  // answer, not the browser's cookie jar, which says nothing over plain
  // http: WebKit on Linux (CI) does not keep the Secure cookie at all, and
  // on Windows keeps it but never sends it back.
  if (code) {
    const context = await browser.newContext({ ...devices["iPhone 15"] });
    const page = await context.newPage();
    let handed = false;
    page.on("response", async (r) => {
      if (r.request().method() !== "POST") return;
      const set = (await r.headerValue("set-cookie").catch(() => null)) || "";
      if (/(^|\n)\s*tn-room=/.test(set)) handed = true;
    });
    await visit(page, base + "/login");
    await page.fill("#code", code);
    await page.press("#code", "Enter");
    for (let i = 0; i < 150 && !handed; i++) await page.waitForTimeout(100);
    say(handed, "iphone  the door opens to the code" + (handed ? "" : "  (no session in the door's answer)"));
    await context.close();
  }
  // Both shapes at once, each in its own context. A walk that cannot go on
  // at all (WebKit itself gone) is a failure to report, not a crash here.
  const walks = await Promise.allSettled(SHAPES.map((shape) => walk(browser, shape)));
  walks.forEach((w, i) => {
    if (w.status === "fulfilled") for (const line of w.value) console.log(line);
    else say(false, SHAPES[i].name.padEnd(8) + "the walk could not go on (" + String(w.reason?.message || w.reason).split("\n")[0].slice(0, 120) + ")");
  });
} finally {
  await browser.close();
}

console.log(failed ? "\n" + failed + " failed" : "\nall passed");
process.exit(failed ? 1 : 0);
