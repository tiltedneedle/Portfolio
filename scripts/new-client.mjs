// Scaffold a client: the folder, the identity, the empty slots, the link to
// the client in the Tilted Needle app, and the lines in the registry and the
// proxy's list. Everything the README's "To add a client" steps do by hand.
//
//   node scripts/new-client.mjs <slug> "<Name>" [--ops-client <id>] [--short "Short"]
//                               [--since 2026] [--contact email] [--logo /client/file.png]
//
// --ops-client is the client's id in the Tilted Needle app (its row in that
// app's `clients` table). Its people, invited there with the Client role for
// that client, sign in here with the same email and password. Without it,
// nobody can sign in until it is set. Then write the audit, ideas and
// scripts in the new index.ts and run `npm run check`.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);

function opt(name, fallback = "") {
  const i = args.indexOf("--" + name);
  if (i === -1) return fallback;
  const v = args[i + 1];
  if (v === undefined || v.startsWith("--")) fail("--" + name + " needs a value");
  return v;
}

function fail(msg) {
  console.error("new-client: " + msg);
  console.error('usage: node scripts/new-client.mjs <slug> "<Name>" [--ops-client <id>] [--short "Short"] [--since 2026] [--contact email] [--logo /client/file.png]');
  process.exit(1);
}

const positional = args.filter((a, i) => !a.startsWith("--") && !(i > 0 && args[i - 1].startsWith("--")));
const [slug, name] = positional;
if (!slug || !name) fail("slug and name are required");
if (!/^[a-z0-9-]{1,64}$/.test(slug)) fail("slug must be lowercase letters, digits and dashes");
if (slug === "template" || slug === "demo") fail("that slug is taken by the shipped " + slug);

const dir = join(root, "src/content/clients", slug);
if (existsSync(dir)) fail(dir + " already exists");

const short = opt("short");
const since = opt("since", String(new Date().getFullYear()));
const contact = opt("contact", "info@tiltedneedle.com");
const logo = opt("logo");
if (logo && !existsSync(join(root, "public", logo.replace(/^\//, "")))) fail("logo " + logo + " is not under public/");
const opsClientId = opt("ops-client").toLowerCase();
if (opsClientId && !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(opsClientId)) fail("--ops-client must be the client's id in the Tilted Needle app, a UUID");

// An identifier for the export: "horizon-aviation" becomes horizonAviation.
let ident = slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
if (/^[0-9]/.test(ident)) ident = "c" + ident;

const q = (s) => JSON.stringify(s);

const file = `import type { ClientSystem } from "@/content/clients/types";
import { COMPETITOR_INTRO, DIAGNOSTIC_INTRO, competitorHeadings, diagnosticHeadings, pillar, report, scripts } from "@/content/system/pillars";

/**
 * ${name}. Scaffolded by scripts/new-client.mjs on ${new Date().toISOString().slice(0, 10)}.
 *
 * Fill the four parts in order: the two reports (paragraphs under each
 * fixed heading), the four pillars (25 ideas each), the twenty scripts.
 * Anything left empty renders as a slot that says it is on its way.
 * Run \`npm run check\` after every session of writing.
 */
export const ${ident}: ClientSystem = {
  identity: {
    slug: ${q(slug)},
    name: ${q(name)},
    short: ${q(short)},
    logo: ${q(logo)},
    since: ${q(since)},
    contact: ${q(contact)},
    // The client's id in the Tilted Needle app. Mirrored in slugs.ts
    // (OPS_CLIENT_IDS); the build checks the two agree.
    opsClientId: ${q(opsClientId)},
  },

  contentDiagnostic: report(DIAGNOSTIC_INTRO, diagnosticHeadings, {
    // "Heading title": ["Paragraph.", "Paragraph."],
  }),

  competitorIntelligence: report(COMPETITOR_INTRO, competitorHeadings, {
    // "Heading title": ["Paragraph.", "Paragraph."],
  }),

  ideas: {
    authority: pillar([
      // { text: "..." },
    ]),
    education: pillar([]),
    entertainment: pillar([]),
    personal: pillar([]),
  },

  scripts: scripts([
    // { n: 1, title: "...", hook: "...", body: ["...", "..."], cta: "..." },
  ]),
};
`;

// Two files have to agree with the new folder: the registry, which the
// server reads, and slugs.ts (the slugs and the Tilted Needle ids), which
// the proxy reads where it cannot import the registry. Every anchor is
// checked BEFORE anything is written, because a half-scaffolded client does
// not merely fail to build: the registry throws at module load and takes
// `npm run check`, `npm run build` and `npm test` down with it.
const regPath = join(root, "src/content/clients/registry.ts");
const slugsPath = join(root, "src/content/clients/slugs.ts");
let reg = readFileSync(regPath, "utf8");
let slugsSrc = readFileSync(slugsPath, "utf8");
const importLine = `import { ${ident} } from "@/content/clients/${slug}";`;
const anchorImport = 'import { demo } from "@/content/clients/demo";';
const anchorAll = /const all: ClientSystem\[\] = \[([^\]]*)\];/;
const anchorSlugs = /export const CLIENT_SLUGS = \[([^\]]*)\] as const;/;
const anchorIds = /export const OPS_CLIENT_IDS: Readonly<Record<string, string>> = \{([\s\S]*?)\n\};/;
if (!reg.includes(anchorImport) || !anchorAll.test(reg)) fail("registry.ts does not look like the one this script knows; add the client by hand");
if (!anchorSlugs.test(slugsSrc) || !anchorIds.test(slugsSrc)) fail("slugs.ts does not look like the one this script knows; add the client by hand");
// One Tilted Needle client, one portal: a second would show its people
// whichever of the two came first.
if (opsClientId && slugsSrc.toLowerCase().includes('"' + opsClientId + '"')) fail("another client here already has the Tilted Needle id " + opsClientId);

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "index.ts"), file);

reg = reg.replace(anchorImport, anchorImport + "\n" + importLine);
reg = reg.replace(anchorAll, (m, list) => `const all: ClientSystem[] = [${list.trim()}, ${ident}];`);
writeFileSync(regPath, reg);

slugsSrc = slugsSrc.replace(anchorSlugs, (m, list) => `export const CLIENT_SLUGS = [${list.trim()}, "${slug}"] as const;`);
if (opsClientId) slugsSrc = slugsSrc.replace(anchorIds, (m, body) => `export const OPS_CLIENT_IDS: Readonly<Record<string, string>> = {${body}\n  ${q(slug)}: ${q(opsClientId)},\n};`);
writeFileSync(slugsPath, slugsSrc);

console.log("created  src/content/clients/" + slug + "/index.ts");
console.log("updated  src/content/clients/registry.ts");
console.log("updated  src/content/clients/slugs.ts");
console.log(
  opsClientId
    ? "accounts people invited in the Tilted Needle app with the Client role for this client sign in here"
    : "accounts none yet: set opsClientId here and in slugs.ts to the client's id in the Tilted Needle app"
);
console.log("link     /login?for=" + slug + "   (their own door, with their name on it)");
console.log("next     write the reports, ideas and scripts, then: npm run check && npm run build");
