// Validate every client system and every guide before a build, so a
// missing idea, a duplicate slug or a clip that is not in the library is a
// clear line in the terminal rather than a quiet gap on a page.
//
//   node scripts/check-content.mjs      (also: npm run check)
//
// The content is TypeScript, so it is compiled once into a temporary ESM
// package with tsc, the "@/" alias is rewritten to relative paths, and the
// result is imported by plain Node. Nothing is written inside the repo.
import { execFileSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1"));

// Compile src/content and src/lib/published.json into a temp dir with tsc,
// rewriting the "@/..." alias so plain Node can import the result.
const out = mkdtempSync(join(tmpdir(), "tn-check-"));
writeFileSync(join(out, "package.json"), JSON.stringify({ type: "module" }));
let tscOut = "";
try {
  execFileSync(
    process.platform === "win32" ? "npx.cmd" : "npx",
    // tsconfig.check.json extends the repo config, so the "@/" alias resolves
    // and every content file is emitted; only the output directory changes.
    ["tsc", "-p", join(root, "tsconfig.check.json"), "--outDir", out],
    { stdio: "pipe", cwd: root, shell: process.platform === "win32" }
  );
} catch (e) {
  // A type error anywhere in the content is a real problem: show it.
  tscOut = String(e.stdout || "");
  console.error(tscOut.slice(0, 4000));
  rmSync(out, { recursive: true, force: true });
  process.exit(1);
}
if (!existsSync(join(out, "content/clients/registry.js"))) {
  console.error("tsc produced no emit:\n" + tscOut.slice(0, 2000));
  process.exit(1);
}

// Rewrite alias imports in the emitted files to relative paths.
function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".js")) {
      let s = readFileSync(p, "utf8");
      s = s.replace(/from\s+["']@\/([^"']+)["']/g, (_, rel) => {
        const target = join(out, rel);
        let relPath = require_relative(dir, target);
        if (!relPath.startsWith(".")) relPath = "./" + relPath;
        return 'from "' + relPath + (existsSync(target + ".js") ? ".js" : "/index.js") + '"';
      });
      // next/navigation's notFound is only called on a bad slug; stub it.
      s = s.replace(/import\s+\{\s*notFound\s*\}\s+from\s+["']next\/navigation["'];?/, "const notFound = () => { throw new Error('notFound'); };");
      writeFileSync(p, s);
    }
  }
}
function require_relative(from, to) {
  const a = from.split(/[\\/]/).filter(Boolean);
  const b = to.split(/[\\/]/).filter(Boolean);
  let i = 0;
  while (i < a.length && i < b.length && a[i].toLowerCase() === b[i].toLowerCase()) i++;
  return [...Array(a.length - i).fill(".."), ...b.slice(i)].join("/");
}
walk(out);

// published.json sits beside the emit in case a content file ever imports it.
mkdirSync(join(out, "lib"), { recursive: true });
copyFileSync(join(root, "src/lib/published.json"), join(out, "lib/published.json"));

const { clients } = await import(pathToFileURL(join(out, "content/clients/registry.js")).href);
const { guides } = await import(pathToFileURL(join(out, "content/system/index.js")).href);
const { chapters } = await import(pathToFileURL(join(out, "content/chapters.js")).href);
const published = JSON.parse(readFileSync(join(root, "src/lib/published.json"), "utf8"));
const ids = new Set(published.map((p) => p.videoId).filter(Boolean));

const problems = [];
const warn = [];

// Clients
for (const [slug, c] of Object.entries(clients)) {
  const id = c.identity;
  if (id.slug !== slug) problems.push(`${slug}: identity.slug is "${id.slug}"`);
  if (!/^[a-z0-9-]{1,64}$/.test(slug)) problems.push(`${slug}: slug must be lowercase letters, digits, dashes`);
  if (!id.name) problems.push(`${slug}: no name`);
  if (id.accessHash && !/^[0-9a-f]{64}$/.test(id.accessHash)) problems.push(`${slug}: accessHash is not a sha256 hex`);
  if (!id.accessHash && slug !== "template") warn.push(`${slug}: no access code, so nobody can log in to it`);
  if (id.logo && !existsSync(join(root, "public", id.logo))) problems.push(`${slug}: logo ${id.logo} not found under public/`);
  for (const [name, report] of [["contentDiagnostic", c.contentDiagnostic], ["competitorIntelligence", c.competitorIntelligence]]) {
    const titles = new Set();
    for (const s of report.sections) {
      if (titles.has(s.title)) problems.push(`${slug}: ${name} repeats heading "${s.title}"`);
      titles.add(s.title);
      if (!s.covers) problems.push(`${slug}: ${name} "${s.title}" has no covers line`);
    }
  }
  for (const [pillar, list] of Object.entries(c.ideas)) {
    if (list.length !== 25) problems.push(`${slug}: ${pillar} has ${list.length} ideas, not 25`);
    const texts = list.map((i) => i.text).filter(Boolean);
    if (new Set(texts).size !== texts.length) problems.push(`${slug}: ${pillar} has duplicate ideas`);
    for (const t of texts) if (t.length > 140) warn.push(`${slug}: ${pillar} idea is long (${t.length} chars): "${t.slice(0, 40)}…"`);
  }
  if (c.scripts.length !== 20) problems.push(`${slug}: ${c.scripts.length} scripts, not 20`);
  c.scripts.forEach((s, i) => {
    if (s.n !== i + 1) problems.push(`${slug}: script at position ${i + 1} is numbered ${s.n}`);
    if (s.body?.length && !s.title) problems.push(`${slug}: script ${s.n} has a body but no title`);
    if (s.title && !s.body?.length) warn.push(`${slug}: script ${s.n} has a title but no body`);
  });
}

// Guides
const seen = new Set();
for (const g of guides) {
  const key = g.chapter + "/" + g.slug;
  if (seen.has(key)) problems.push(`guide ${key} is listed twice`);
  seen.add(key);
  const ch = chapters.find((c) => c.id === g.chapter);
  if (!ch?.pages.some((p) => p.slug === g.slug)) problems.push(`guide ${key} is not in chapters.ts`);
  if (!g.title || !g.kicker || !g.intro?.length) problems.push(`guide ${key} is missing title, kicker or intro`);
  if (!g.rule?.length) problems.push(`guide ${key} has no rule`);
  const walkBlocks = (blocks, where) => {
    for (const b of blocks) {
      if (b.kind === "clips") for (const it of b.items) if (!ids.has(it.id)) warn.push(`guide ${key} ${where}: clip ${it.id} is not in published.json (will use YouTube's still)`);
      if (b.kind === "sub") walkBlocks(b.blocks, where + " > " + b.title);
      if (b.kind === "list" && b.items.length === 0) problems.push(`guide ${key} ${where}: empty list`);
    }
  };
  g.sections.forEach((s, i) => {
    if (!s.title) problems.push(`guide ${key} section ${i + 1} has no title`);
    walkBlocks(s.blocks, `"${s.title}"`);
  });
  if (g.opener) walkBlocks(g.opener, "opener");
}
for (const ch of chapters) {
  if (["create", "publish", "analyse"].includes(ch.id)) {
    for (const p of ch.pages) if (!guides.some((g) => g.chapter === ch.id && g.slug === p.slug)) problems.push(`chapters.ts lists ${ch.id}/${p.slug} but there is no guide for it`);
  }
}

rmSync(out, { recursive: true, force: true });

for (const w of warn) console.log("warn  " + w);
for (const p of problems) console.log("FAIL  " + p);
console.log(`\n${Object.keys(clients).length} clients, ${guides.length} guides: ${problems.length} problems, ${warn.length} warnings`);
process.exit(problems.length ? 1 : 0);
