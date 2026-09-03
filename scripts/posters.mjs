// Extract one poster frame per film with ffmpeg and record each film's
// duration, writing public/posters/<slug>.jpg and src/lib/posters.json.
//
//   node scripts/posters.mjs
//
// Reads the films straight out of case-studies-data.ts (title + videoUrl),
// so there is one list. A film whose video cannot be fetched is skipped and
// reported; its frame on the site shows the slate instead. Re-run whenever a
// video URL changes.

import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const ROOT = new URL("..", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const DATA = join(ROOT, "src/lib/case-studies-data.ts");
const OUT_DIR = join(ROOT, "public/posters");
const OUT_JSON = join(ROOT, "src/lib/posters.json");

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Pull title/videoUrl pairs out of the TS source, in order.
const src = readFileSync(DATA, "utf8");
const films = [];
let title = null;
for (const line of src.split("\n")) {
  const t = line.match(/^\s*title:\s*"([^"]+)"/);
  if (t) title = t[1];
  const v = line.match(/^\s*videoUrl:\s*"([^"]+)"/);
  if (v && title) {
    films.push({ title, slug: slugify(title), url: v[1] });
    title = null;
  }
}

mkdirSync(OUT_DIR, { recursive: true });
const result = existsSync(OUT_JSON) ? JSON.parse(readFileSync(OUT_JSON, "utf8")) : {};

for (const f of films) {
  const tmp = join(tmpdir(), f.slug + ".mp4");
  try {
    const res = await fetch(f.url);
    if (!res.ok) throw new Error("HTTP " + res.status);
    writeFileSync(tmp, Buffer.from(await res.arrayBuffer()));
  } catch (e) {
    console.log("skip  " + f.slug + "  (" + e.message + ")");
    continue;
  }
  const out = join(OUT_DIR, f.slug + ".jpg");
  // A frame one second in, scaled to 720 wide, quality 3 (high).
  execFileSync("ffmpeg", ["-y", "-loglevel", "error", "-ss", "1", "-i", tmp, "-frames:v", "1", "-vf", "scale=720:-2", "-q:v", "3", out]);
  const dur = execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", tmp]).toString().trim();
  result[f.slug] = { poster: "/posters/" + f.slug + ".jpg", duration: Math.round(Number(dur) * 10) / 10 };
  console.log("ok    " + f.slug + "  " + dur + "s");
}

writeFileSync(OUT_JSON, JSON.stringify(result, null, 2) + "\n");
console.log("wrote " + OUT_JSON + " (" + Object.keys(result).length + " posters)");
