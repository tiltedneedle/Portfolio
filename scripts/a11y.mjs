// Accessibility and layout pass in a real browser: every route the index
// knows plus the fixed pages, at desktop and phone width, run through axe
// (WCAG 2.2 AA and best practice) with no filter, checked for horizontal
// overflow and for console errors; then the palette, open. Needs the
// Playwright browser once: `npx playwright install chromium`.
//
//   node scripts/a11y.mjs http://localhost:3401 --code horizon-2026   (gated: logs in)
//   node scripts/a11y.mjs http://localhost:3400                        (open door)
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { chromium } from "playwright";

const require = createRequire(import.meta.url);
const axeSource = readFileSync(require.resolve("axe-core/axe.min.js"), "utf8");
const base = process.argv[2] || "http://localhost:3400";
const codeAt = process.argv.indexOf("--code");
const code = codeAt > -1 ? process.argv[codeAt + 1] : "";
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

  if (code) {
    await page.goto(base + "/login", { waitUntil: "networkidle" });
    await page.fill("#code", code);
    await Promise.all([page.waitForURL((u) => !u.pathname.startsWith("/login")), page.press("#code", "Enter")]);
    say(!page.url().includes("/login"), "logged in as the client behind the door");
  }

  // Every guide, report and written script the palette knows, plus the fixed pages.
  const indexRes = await page.request.get(base + "/search-index.json");
  const index = indexRes.ok() ? await indexRes.json() : [];
  say(Array.isArray(index) && index.length > 0, "search index answers with " + (Array.isArray(index) ? index.length : 0) + " entries");
  // The rooms, the door (with and without a client named) and the 404, then every page the index knows.
  const routes = [...new Set(["/", "/audit", "/content", "/create", "/publish", "/analyse", "/content/ideas", "/content/scripts", "/login", "/login?for=demo", "/nothing-on-this-slate", ...index.map((e) => e.href)])];

  const audit = () =>
    page.evaluate(async (tags) => {
      const res = await window.axe.run(document, { runOnly: { type: "tag", values: tags } });
      return {
        violations: res.violations.map((v) => v.id + " x" + v.nodes.length + " (" + (v.nodes[0]?.target?.[0] || "") + ")"),
        scrollW: document.documentElement.scrollWidth,
        innerW: window.innerWidth,
      };
    }, TAGS);

  for (const w of widths) {
    await page.setViewportSize({ width: w.width, height: w.height });
    for (const route of routes) {
      errors.length = 0;
      const resp = await page.goto(base + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(route === "/" ? 3000 : 400);
      await page.addScriptTag({ content: axeSource });
      const r = await audit();
      const wide = r.scrollW > r.innerW;
      // A not-found page is meant to answer 404; the browser logging that is not a fault of the page.
      const own404 = resp?.status() === 404;
      const consoleErrors = errors.filter((e) => !(own404 && /status of 404/.test(e)));
      const problems = [
        r.violations.length ? "axe: " + r.violations.join("; ") : "",
        wide ? "overflow " + r.scrollW + " > " + r.innerW : "",
        consoleErrors.length ? "console: " + consoleErrors[0].slice(0, 140) : "",
      ].filter(Boolean);
      say(problems.length === 0, w.name.padEnd(8) + route.padEnd(44) + problems.join("  "));
    }
  }

  // The palette, open with results, is a dialog of its own.
  await page.setViewportSize({ width: widths[0].width, height: widths[0].height });
  await page.goto(base + "/create/hooks", { waitUntil: "networkidle" });
  await page.mouse.move(700, 500);
  await page.keyboard.press("/");
  await page.waitForTimeout(300);
  await page.keyboard.type("hook");
  await page.waitForTimeout(1200);
  await page.addScriptTag({ content: axeSource });
  const pal = await audit();
  const open = await page.evaluate(() => !!document.querySelector("[role=dialog][aria-label='Contents']") && document.querySelectorAll("[role=option]").length > 0);
  say(open && pal.violations.length === 0, "desktop  palette open" + (open ? "" : "  (did not open)") + (pal.violations.length ? "  axe: " + pal.violations.join("; ") : ""));
} finally {
  await browser.close();
}

console.log(failed ? "\n" + failed + " failed" : "\nall passed");
process.exit(failed ? 1 : 0);
