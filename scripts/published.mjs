// Export the studio's published index from the ops database into
// src/lib/published.json (the library) and src/lib/published-picks.json (the
// few entries the home page needs). Read-only against the database.
//
//   node scripts/published.mjs
//
// Needs the ops app's .env.local (NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SECRET_KEY)
// at ../Tilted Needle/.env.local, or the same two variables in the environment.
// Keeps only durable stills: YouTube's own, or the studio's cached copy in the
// post-thumbnails bucket. Signed Instagram and TikTok CDN links expire.
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const here = new URL(".", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const site = resolve(here, "../src/lib");
const opsEnv = resolve(here, "../../Tilted Needle/.env.local");

function env(name) {
  if (process.env[name]) return process.env[name];
  const line = readFileSync(opsEnv, "utf8").split("\n").find((l) => l.startsWith(name + "="));
  return line ? line.slice(name.length + 1).trim().replace(/^["']|["']$/g, "") : "";
}

const url = env("NEXT_PUBLIC_SUPABASE_URL");
const key = env("SUPABASE_SECRET_KEY");
const headers = { apikey: key, Authorization: "Bearer " + key };

const CLIENT = {
  "The Jet Business": "The Jet Business",
  "Ameerh Naran": "Ameerh Naran",
  "Euro Eyes London (LEC)": "EuroEyes",
  "EuroEyes Deutschland": "EuroEyes",
  "Frankie Mardell - Trilogy Jewellers": "Frankie Mardell",
  "Tilted Needle": "Tilted Needle",
  "Tilted Needle Team": "Tilted Needle",
  "Entree Bakery and Cafe": "Entree",
  yusufnik8: "Yusuf Nik",
  "Alex Evagora": "Alex Evagora",
  Delfinomayfair: "Delfino Mayfair",
  "Ohana Development": "Ohana Developments",
  "Ahmed Amwell": "Ahmed Amwell",
};

const ytId = (u) => {
  const m = u.match(/shorts\/([A-Za-z0-9_-]{11})/) || u.match(/[?&]v=([A-Za-z0-9_-]{11})/) || u.match(/youtu\.be\/([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
};
const durable = (u) => !!u && (u.includes("supabase.co/storage") || u.includes("i.ytimg.com"));
const german = /\b(jahre|und|augen|dann|endlich|ich|nicht|mit|wir|sie|der|die|das|ohne|brille|sehen)\b|[äöüß]/i;

const res = await fetch(
  url + "/rest/v1/content_items?select=id,title,subject,produced_at,platform_posts(url,posted_at,thumbnail_url,accounts(platform_slug,handle,clients(name)))&limit=2000",
  { headers }
);
const items = await res.json();
if (!Array.isArray(items)) throw new Error(JSON.stringify(items).slice(0, 300));

const out = [];
for (const i of items) {
  for (const p of i.platform_posts || []) {
    const platform = p.accounts?.platform_slug;
    const client = CLIENT[p.accounts?.clients?.name] || p.accounts?.clients?.name || "";
    const videoId = platform === "youtube" || platform === "youtube_shorts" ? ytId(p.url) : null;
    let thumb = null;
    if (videoId && platform === "youtube_shorts") thumb = "https://i.ytimg.com/vi/" + videoId + "/oardefault.jpg";
    else if (durable(p.thumbnail_url)) thumb = p.thumbnail_url;
    else if (videoId) thumb = "https://i.ytimg.com/vi/" + videoId + "/maxresdefault.jpg";
    if (!thumb) continue;
    out.push({
      id: i.id.slice(0, 8) + "-" + platform,
      client,
      title: (i.title || "").trim(),
      subject: (i.subject || "").trim(),
      platform,
      handle: p.accounts?.handle || "",
      url: p.url,
      videoId,
      thumb,
      vertical: platform !== "youtube",
      posted: (p.posted_at || i.produced_at || "").slice(0, 10),
    });
  }
}
out.sort((a, b) => (b.posted || "").localeCompare(a.posted || ""));
writeFileSync(resolve(site, "published.json"), JSON.stringify(out, null, 1) + "\n");

const pick = (client) => {
  let mine = out.filter((p) => p.client === client && p.vertical);
  if (client === "EuroEyes") mine = mine.filter((p) => !/augenlasern|deutschland|_de\b/i.test(p.handle) && !german.test(p.title + " " + p.subject));
  return mine.find((p) => p.platform === "youtube_shorts") || mine[0] || null;
};
const picks = {};
for (const c of ["The Jet Business", "EuroEyes", "Frankie Mardell", "Tilted Needle"]) picks[c] = pick(c);
const tn = out.filter((p) => p.client === "Tilted Needle" && p.platform === "youtube_shorts");
picks.__reel = tn.find((p) => /week in the life/i.test(p.title)) || tn[0] || null;
picks.__count = out.filter((p) => p.vertical).length;
writeFileSync(resolve(site, "published-picks.json"), JSON.stringify(picks, null, 1) + "\n");
console.log("published:", out.length, "| library:", picks.__count, "| picks:", Object.keys(picks).length);
