// Scaffold a client: the folder, the identity, the empty slots, the access
// hash, and the line in the registry. Everything the README's "To add a
// client" steps 1 to 3 do by hand.
//
//   node scripts/new-client.mjs <slug> "<Name>" [--short "Short"] [--code "access code"]
//                               [--since 2026] [--contact email] [--logo /client/file.png]
//
// Then write the audit, ideas and scripts in the new index.ts and run
// `npm run check`. The access code itself is never stored; only its hash.
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
  console.error('usage: node scripts/new-client.mjs <slug> "<Name>" [--short "Short"] [--code "access code"] [--since 2026] [--contact email] [--logo /client/file.png]');
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
const code = opt("code");
if (logo && !existsSync(join(root, "public", logo.replace(/^\//, "")))) fail("logo " + logo + " is not under public/");

let accessHash = "";
if (code) {
  const data = new TextEncoder().encode("tn:" + slug + ":" + code);
  const hash = await crypto.subtle.digest("SHA-256", data);
  accessHash = Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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
    // sha256("tn:" + slug + ":" + access code), from \`npm run access -- ${slug} "<code>"\`.
    accessHash: ${q(accessHash)},
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

mkdirSync(dir, { recursive: true });
writeFileSync(join(dir, "index.ts"), file);

// The registry: one import, one entry.
const regPath = join(root, "src/content/clients/registry.ts");
let reg = readFileSync(regPath, "utf8");
const importLine = `import { ${ident} } from "@/content/clients/${slug}";`;
const anchorImport = 'import { demo } from "@/content/clients/demo";';
const anchorAll = /const all: ClientSystem\[\] = \[([^\]]*)\];/;
if (!reg.includes(anchorImport) || !anchorAll.test(reg)) fail("registry.ts does not look like the one this script knows; add the client by hand");
reg = reg.replace(anchorImport, anchorImport + "\n" + importLine);
reg = reg.replace(anchorAll, (m, list) => `const all: ClientSystem[] = [${list.trim()}, ${ident}];`);
writeFileSync(regPath, reg);

console.log("created  src/content/clients/" + slug + "/index.ts");
console.log("updated  src/content/clients/registry.ts");
console.log(accessHash ? "access   hash set from the code you gave (the code itself is not stored)" : "access   no code given: the client cannot log in until accessHash is set");
console.log("next     write the reports, ideas and scripts, then: npm run check && npm run build");
