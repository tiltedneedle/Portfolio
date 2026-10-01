// Accessibility and layout pass in a real browser: every route the index
// knows plus the fixed pages, at desktop and phone width, run through axe
// (WCAG 2.2 AA and best practice) with no filter, checked for horizontal
// overflow and for console errors; then the palette, open. Needs the
// Playwright browser once: `npx playwright install chromium`.
//
//   node scripts/a11y.mjs http://localhost:3401 --sign-in   (accounts: signs in as the test double's client)
//   node scripts/a11y.mjs http://localhost:3400                        (open door)
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright";
import { ACCOUNTS, PASSWORD } from "./test-accounts.mjs";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const base = process.argv[2] || "http://localhost:3400";
const signingIn = process.argv.includes("--sign-in");
const widths = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "phone", width: 390, height: 844 },
];
const TAGS = ["wcag2a", "wcag2aa", "wcag22aa", "best-practice"];

let failed = 0;
const say = (ok, msg) => {
  if (!ok) failed++;
  console.log((ok ? "ok    " : "FAIL  ") + msg);
};

const browser = await chromium.launch();
try {
  // At rest: with motion reduced nothing is mid-fade when axe measures it,
  // and every reveal is already in. The desk powering up, the road drawing
  // and the cuts are checked by hand, not here.
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(String(e)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  if (signingIn) {
    await visit(page, base + "/login");
    await page.fill("#email", ACCOUNTS.client);
    await page.fill("#password", PASSWORD);
    await Promise.all([page.waitForURL((u) => !u.pathname.startsWith("/login")), page.press("#password", "Enter")]);
    say(!page.url().includes("/login"), "signed in as the client behind the door");
  }

  // Every guide, report and written script the palette knows, plus the fixed pages.
  const indexRes = await page.request.get(base + "/search-index.json");
  const index = indexRes.ok() ? await indexRes.json() : [];
  say(Array.isArray(index) && index.length > 0, "search index answers with " + (Array.isArray(index) ? index.length : 0) + " entries");
  // The rooms, the door (with and without a client named) and the 404, then every page the index knows.
  const routes = [...new Set(["/", "/audit", "/content", "/create", "/publish", "/analyse", "/content/ideas", "/content/scripts", "/login", "/login?for=demo", "/login?forgot=1", "/login?error=credentials", "/auth/reset", "/nothing-on-this-slate", ...index.map((e) => e.href)])];

  const audit = () =>
    page.evaluate(async (tags) => {
      const res = await window.axe.run(document, { runOnly: { type: "tag", values: tags } });
      return {
        violations: res.violations.map((v) => v.id + " x" + v.nodes.length + " (" + (v.nodes[0]?.target?.[0] || "") + ")"),
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
      };
    }, TAGS);

  /**
 * Go to a page and wait for it to settle.
 *
 * Not `networkidle`: since the stills go through the image optimiser the home
 * page issues fifteen requests, and on a slow runner "no traffic for 500ms"
 * can simply never happen inside the timeout. It timed out in CI while
 * passing every time locally, which is the worst kind of check. Wait for the
 * document instead, then give the page a fixed beat to finish painting.
 */
async function visit(page, url, settle = 600) {
  const resp = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
  await page.waitForLoadState("load", { timeout: 45000 }).catch(() => {});
  await page.waitForTimeout(settle);
  return resp;
}

for (const w of widths) {
    await page.setViewportSize({ width: w.width, height: w.height });
    for (const route of routes) {
      errors.length = 0;
      // Home opens on the slate, which has to finish before anything is measured.
      const resp = await visit(page, base + route, route === "/" ? 3000 : 400);
      await page.addScriptTag({ content: axeSource });
      const r = await audit();
      const wide = r.scrollW > r.innerW;
      // A not-found page is meant to answer 404; the browser logging that is not a fault of the page.
      const own404 = resp?.status() === 404;
      const consoleErrors = errors.filter((e) => !(own404 && /status of 404/.test(e)));
      // A rail a thumb cannot reach the end of is a deliverable nobody can
      // read. This shipped once: spines were made non-snapping to stop the
      // rail stuttering over them, and under `scroll-snap-type: mandatory`
      // that left sixteen of twenty scripts unreachable on a phone, with
      // every other check green.
      const stuck = await page.evaluate(async () => {
        const out = [];
        for (const r of document.querySelectorAll(".rail")) {
          const max = r.scrollWidth - r.clientWidth;
          if (max < 8) continue;
          const was = r.scrollLeft;
          r.scrollLeft = r.scrollWidth;
          await new Promise((res) => setTimeout(res, 250));
          const got = Math.round(r.scrollLeft);
          r.scrollLeft = was;
          if (got < max - 4) out.push(got + " of " + max);
        }
        return out;
      });
      // A well with nothing in it. Still drops itself when a frame will not
      // load, so an empty well is invisible to axe, to the overflow check
      // and to the console -- it is simply a bordered box. The hero backdrop
      // ran as thirty-two of them, drifting, for as long as the placeholder
      // guard read naturalWidth (which srcset density-corrects to the layout
      // width, so every 256px still in a 150px well looked like a 150px
      // placeholder). Nothing else here can see that.
      const hollow = await page.evaluate(() => {
        const wells = [...document.querySelectorAll(".well")];
        const empty = wells.filter((w) => !w.querySelector("img") && !w.querySelector("iframe"));
        return wells.length ? empty.length + " of " + wells.length : "";
      });
      const problems = [
        r.violations.length ? "axe: " + r.violations.join("; ") : "",
        wide ? "overflow " + r.scrollW + " > " + r.innerW : "",
        stuck.length ? "rail stops short: " + stuck.join(", ") : "",
        hollow && !hollow.startsWith("0 of ") ? "empty wells: " + hollow : "",
        consoleErrors.length ? "console: " + consoleErrors[0].slice(0, 140) : "",
      ].filter(Boolean);
      say(problems.length === 0, w.name.padEnd(8) + route.padEnd(44) + problems.join("  "));
    }
  }

  // The palette, open with results, is a dialog of its own.
  await page.setViewportSize({ width: widths[0].width, height: widths[0].height });
  await visit(page, base + "/create/hooks");
  await page.mouse.move(700, 500);
  await page.keyboard.press("/");
  await page.waitForTimeout(300);
  await page.keyboard.type("hook");
  await page.waitForTimeout(1200);
  await page.addScriptTag({ content: axeSource });
  const pal = await audit();
  const open = await page.evaluate(() => !!document.querySelector("[role=dialog][aria-label='Contents']") && document.querySelectorAll("[role=option]").length > 0);
  say(open && pal.violations.length === 0, "desktop  palette open" + (open ? "" : "  (did not open)") + (pal.violations.length ? "  axe: " + pal.violations.join("; ") : ""));

  // The commission, opened from a locked card, is a dialog of its own. Only a
  // client with something still to be written has locked cards; a written
  // client has none and no modal, and that is checked instead.
  await page.keyboard.press("Escape");
  await visit(page, base + "/", 3000);
  const lockedCard = page.locator("button.shuttle-card").first();
  if ((await lockedCard.count()) === 0) {
    const stray = await page.evaluate(() => document.querySelectorAll("[aria-labelledby='locked-title']").length);
    say(stray === 0, "desktop  commission (nothing locked for this client)");
  } else {
    await lockedCard.scrollIntoViewIfNeeded();
    await lockedCard.click();
    await page.waitForTimeout(1600);
    await page.addScriptTag({ content: axeSource });
    const com = await audit();
    const shown = await page.evaluate(() => {
      const d = document.querySelector("[role=dialog][aria-modal=true][aria-labelledby='locked-title']");
      return !!d && !!document.getElementById("locked-title")?.textContent && !!d.querySelector("a[href^='mailto:']") && d.contains(document.activeElement);
    });
    await page.keyboard.press("Escape");
    await page.waitForTimeout(500);
    const closed = await page.evaluate(() => !document.querySelector("[aria-labelledby='locked-title']") && document.body.style.overflow === "");
    say(
      shown && closed && com.violations.length === 0,
      "desktop  commission open" + (shown ? "" : "  (did not open, or focus is outside it)") + (closed ? "" : "  (Escape left it open or the page locked)") + (com.violations.length ? "  axe: " + com.violations.join("; ") : "")
    );
  }

  // The nav: a room's panel, opened from the keyboard, is a list of its own;
  // Escape closes it and hands focus back to the room without reopening it.
  await page.setViewportSize({ width: widths[0].width, height: widths[0].height });
  await visit(page, base + "/create/hooks");
  await page.focus("[data-nav] a[aria-label='Home']");
  await page.keyboard.press("Tab");
  await page.waitForTimeout(400);
  await page.addScriptTag({ content: axeSource });
  const pan = await audit();
  const panelShown = await page.evaluate(() => !!document.querySelector("[data-nav] .panel"));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);
  const panelBack = await page.evaluate(() => !document.querySelector("[data-nav] .panel") && !!document.activeElement?.closest("[data-room]"));
  say(
    panelShown && panelBack && pan.violations.length === 0,
    "desktop  room panel open" + (panelShown ? "" : "  (did not open on focus)") + (panelBack ? "" : "  (Escape left it open, or dropped focus)") + (pan.violations.length ? "  axe: " + pan.violations.join("; ") : "")
  );

  // The menu on a phone fills the screen: the page behind it is inert while
  // it is open, and Escape closes it and hands focus back to its button.
  await page.setViewportSize({ width: widths[1].width, height: widths[1].height });
  await visit(page, base + "/create/hooks");
  await page.click("[data-nav] button[aria-controls='system-menu']");
  await page.waitForTimeout(800);
  await page.addScriptTag({ content: axeSource });
  const men = await audit();
  const menuShown = await page.evaluate(() => !!document.querySelector("#system-menu") && !!document.querySelector("main")?.hasAttribute("inert"));
  await page.keyboard.press("Escape");
  await page.waitForTimeout(500);
  const menuBack = await page.evaluate(
    () => !document.querySelector("#system-menu") && !document.querySelector("main")?.hasAttribute("inert") && document.activeElement?.getAttribute("aria-controls") === "system-menu"
  );
  say(
    menuShown && menuBack && men.violations.length === 0,
    "phone    menu open" + (menuShown ? "" : "  (did not open, or the page behind is not inert)") + (menuBack ? "" : "  (Escape left it open, or dropped focus)") + (men.violations.length ? "  axe: " + men.violations.join("; ") : "")
  );
} finally {
  await browser.close();
}

console.log(failed ? "\n" + failed + " failed" : "\nall passed");
process.exit(failed ? 1 : 0);
