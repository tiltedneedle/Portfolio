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

// Every clean path the rooms answer to: home, each chapter, each page, each script slot.
const knownPaths = new Set(["/", ...chapters.flatMap((ch) => [ch.href, ...ch.pages.map((p) => ch.href + "/" + p.slug)])]);
for (let n = 1; n <= 20; n++) knownPaths.add("/content/scripts/" + n);
const knownHref = (href) => knownPaths.has(String(href).split("#")[0]);
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
  // The contact is where every "ask the studio" goes: an address, or a link.
  if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(id.contact ?? "") || /^https?:\/\//.test(id.contact ?? "")))
    problems.push(`${slug}: contact "${id.contact}" is neither an email address nor a link`);
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
  // What the studio has added for this client: dated, newest first, linking within the site.
  if (c.changes !== undefined) {
    if (!Array.isArray(c.changes)) problems.push(`${slug}: changes must be a list`);
    else {
      let last = "9999-99-99";
      for (const ch of c.changes) {
        const head = `${slug} changes: "${String(ch.text ?? "").slice(0, 40)}"`;
        if (!/^\d{4}-\d{2}-\d{2}$/.test(ch.date ?? "") || Number.isNaN(Date.parse(ch.date))) problems.push(`${head} has a bad date ${ch.date}`);
        if (ch.date > last) problems.push(`${head} is out of order (newest first)`);
        last = ch.date;
        if (!ch.text) problems.push(`${slug} changes: an entry has no text`);
        if (ch.href && !ch.href.startsWith("/")) problems.push(`${head} links off the site`);
        else if (ch.href && !knownHref(ch.href)) problems.push(`${head} links to ${ch.href}, which is not a page`);
      }
    }
  }
  // Findings: verdicts, scores, first moves, evidence, competitors, the map
  for (const [name, r] of [["content diagnostic", c.contentDiagnostic], ["competitor intelligence", c.competitorIntelligence]]) {
    const firsts = new Map();
    for (const sec of r.sections) {
      const where = `${slug} ${name} "${sec.title}"`;
      if (sec.verdict && !["strong", "mixed", "weak"].includes(sec.verdict)) problems.push(`${where}: verdict must be strong, mixed or weak`);
      if (sec.score !== undefined && !(Number.isInteger(sec.score) && sec.score >= 0 && sec.score <= 10)) problems.push(`${where}: score must be a whole number from 0 to 10`);
      if ((sec.verdict || sec.score !== undefined || sec.first) && !sec.body?.length) problems.push(`${where}: has a verdict, score or move but no body`);
      if (sec.first !== undefined) {
        if (![1, 2, 3].includes(sec.first)) problems.push(`${where}: first must be 1, 2 or 3`);
        if (firsts.has(sec.first)) problems.push(`${where}: move ${sec.first} is also on "${firsts.get(sec.first)}"`);
        firsts.set(sec.first, sec.title);
        if (!sec.change?.length) warn.push(`${where}: is a first move but lists nothing to change`);
      }
      for (const key of ["working", "limiting", "change"]) if (sec[key] && sec[key].length === 0) problems.push(`${where}: empty ${key} list`);
      for (const l of sec.lists ?? []) if (!l.label || !l.items?.length) problems.push(`${where}: a list needs a label and items`);
      for (const e of sec.evidence ?? []) if (!/^[A-Za-z0-9_-]{6,}$/.test(e.id)) problems.push(`${where}: evidence id "${e.id}" does not look like a YouTube id`);
    }
    if (r.competitors) {
      for (const k of r.competitors) {
        if (!k.name || !k.handle || !k.note) problems.push(`${slug} ${name}: competitor needs name, handle and note`);
        if (!["instagram", "tiktok", "youtube", "linkedin"].includes(k.platform)) problems.push(`${slug} ${name}: competitor "${k.name}" has an unknown platform`);
        if (!k.strengths?.length || !k.gaps?.length) problems.push(`${slug} ${name}: competitor "${k.name}" needs strengths and gaps`);
      }
    }
    if (r.map) {
      if (r.map.x?.length !== 2 || r.map.y?.length !== 2) problems.push(`${slug} ${name}: map axes need two labels each`);
      for (const p of r.map.points ?? []) if (!(p.x >= 0 && p.x <= 1 && p.y >= 0 && p.y <= 1)) problems.push(`${slug} ${name}: map point "${p.name}" must sit between 0 and 1`);
      if (!(r.map.points ?? []).some((p) => p.you)) warn.push(`${slug} ${name}: the map does not mark the client (you: true)`);
      if ((r.map.points ?? []).filter((p) => p.target).length > 1) problems.push(`${slug} ${name}: the map has more than one target`);
      if ((r.map.points ?? []).some((p) => p.target) && !(r.map.points ?? []).some((p) => p.you)) problems.push(`${slug} ${name}: a target on the map needs a you`);
      {
        const you = (r.map.points ?? []).find((p) => p.you);
        const target = (r.map.points ?? []).find((p) => p.target);
        if (you && target && String(target.name).trim().toLowerCase() === String(you.name).trim().toLowerCase())
          problems.push(`${slug} ${name}: the target needs a name that says when it is ("${you.name}, after the three moves"), not "${you.name}" again`);
      }
    }
  }

  // Notes inside the guides, and where scripts came from
  for (const [key, notes] of Object.entries(c.notes ?? {})) {
    const [ch, gs] = key.split("/");
    const g = guides.find((x) => x.chapter === ch && x.slug === gs);
    if (!g) {
      problems.push(`${slug}: notes for "${key}" but there is no such guide`);
      continue;
    }
    for (const n of notes) {
      if (!n.text) problems.push(`${slug}: an empty note in "${key}"`);
      if (n.at !== undefined && !(Number.isInteger(n.at) && n.at >= 1 && n.at <= g.sections.length)) problems.push(`${slug}: note in "${key}" points at section ${n.at}; the guide has ${g.sections.length}`);
    }
  }
  for (const s of c.scripts) {
    if (s.from) {
      const list = c.ideas[s.from.pillar];
      if (!list) problems.push(`${slug}: script ${s.n} comes from an unknown pillar "${s.from.pillar}"`);
      else if (!list[s.from.n - 1]?.text) warn.push(`${slug}: script ${s.n} says it came from ${s.from.pillar} ${s.from.n}, which is not written`);
    }
    if (s.shots && s.shots.some((x) => !x)) problems.push(`${slug}: script ${s.n} has an empty shot`);
  }
  c.scripts.forEach((s, i) => {
    if (s.n !== i + 1) problems.push(`${slug}: script at position ${i + 1} is numbered ${s.n}`);
    if (s.body?.length && !s.title) problems.push(`${slug}: script ${s.n} has a body but no title`);
    if (s.title && !s.body?.length) warn.push(`${slug}: script ${s.n} has a title but no body`);
  });
}

// Changes: dated, newest first, each with words and a path
const { changes } = await import(pathToFileURL(join(out, "content/system/changes.js")).href);
let lastDate = "9999-99-99";
for (const c of changes) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(c.date) || Number.isNaN(Date.parse(c.date))) problems.push(`changes: "${c.text.slice(0, 40)}" has a bad date ${c.date}`);
  if (c.date > lastDate) problems.push(`changes: "${c.text.slice(0, 40)}" is out of order (newest first)`);
  lastDate = c.date;
  if (!c.text) problems.push("changes: an entry has no text");
  if (c.href && !c.href.startsWith("/")) problems.push(`changes: "${c.text.slice(0, 40)}" links off the site`);
  else if (c.href && !knownHref(c.href)) problems.push(`changes: "${c.text.slice(0, 40)}" links to ${c.href}, which is not a page`);
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
      if ((b.kind === "fan" && b.to.length < 2) || (b.kind === "flow" && b.steps.length < 2) || (b.kind === "cycle" && b.items.length < 3)) problems.push(`guide ${key} ${where}: ${b.kind} needs more entries`);
      if (b.kind === "structure" && (b.parts.length < 2 || b.parts.some((p) => !(p.share > 0)))) problems.push(`guide ${key} ${where}: structure parts need positive shares`);
      if ((b.kind === "shots" || b.kind === "flashcards") && b.items.length === 0) problems.push(`guide ${key} ${where}: empty ${b.kind}`);
      if (b.kind === "typewriter" && b.queries.length === 0) problems.push(`guide ${key} ${where}: empty typewriter`);
      if (b.kind === "figure") {
        if (!b.alt) problems.push(`guide ${key} ${where}: figure without alt text`);
        if (b.src.startsWith("/") && !existsSync(join(root, "public", b.src.slice(1)))) problems.push(`guide ${key} ${where}: figure ${b.src} is not in public/`);
      }
    }
  };
  g.sections.forEach((s, i) => {
    if (!s.title) problems.push(`guide ${key} section ${i + 1} has no title`);
    walkBlocks(s.blocks, `"${s.title}"`);
  });
  if (g.opener) walkBlocks(g.opener, "opener");
  if (g.poster && !ids.has(g.poster)) warn.push(`guide ${key}: poster ${g.poster} is not in published.json (will use YouTube's still)`);
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
