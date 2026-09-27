import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { describe, expect, it } from "vitest";

/**
 * The studio's publishing index is 634 entries and a quarter of a megabyte.
 * It is server data: it feeds the backdrops, the showreel and the clip
 * rails, all of which render on the server. If any "use client" module ever
 * reaches it, directly or through a chain of imports, the whole index is
 * downloaded by every visitor.
 *
 * That is not hypothetical: it happened. EmbedModal imported `embedUrl`
 * from lib/published, whose first line imports published.json, and the
 * index shipped for months while two comments in the repo claimed it never
 * would. So the rule is held by a test rather than by a comment.
 *
 * Type-only imports are ignored. SWC erases them, so `import type
 * { Published }` in a client component costs nothing, and counting it would
 * fail this test the first time someone writes one.
 */
const SRC = resolve(__dirname, "..");
const FORBIDDEN = ["src/lib/published.ts", "src/lib/published.json"];

function walk(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name)) out.push(full);
  }
  return out;
}

/** The first line of real code, with the leading comments and blanks stripped. */
function isClientEntry(text: string): boolean {
  const lines = text.split("\n");
  let inBlock = false;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (inBlock) {
      if (line.includes("*/")) inBlock = false;
      continue;
    }
    if (line.startsWith("//")) continue;
    if (line.startsWith("/*")) {
      if (!line.includes("*/")) inBlock = true;
      continue;
    }
    return /^["']use client["'];?$/.test(line);
  }
  return false;
}

/** Every value import in a file: `import type` and `{ type X }` are erased, so they do not count. */
function valueImports(text: string): string[] {
  const out: string[] = [];
  const re = /import\s+([\s\S]*?)\s*from\s*["']([^"']+)["']/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    const clause = m[1];
    if (/^type\b/.test(clause.trim())) continue;
    // `import { type A, B }` still imports B; `import { type A }` imports nothing.
    const braced = clause.match(/\{([\s\S]*)\}/);
    if (braced && /^\s*$/.test(braced[1].replace(/type\s+[^,]+,?/g, "")) && !/^[^{]*\w/.test(clause.split("{")[0])) continue;
    out.push(m[2]);
  }
  // A bare side-effect import (`import "./x"`) counts too.
  const bare = /import\s*["']([^"']+)["']/g;
  while ((m = bare.exec(text))) out.push(m[1]);
  return out;
}

function resolveImport(spec: string, from: string): string | null {
  let base: string;
  if (spec.startsWith("@/")) base = join(SRC, spec.slice(2));
  else if (spec.startsWith(".")) base = resolve(dirname(from), spec);
  else return null; // a package, not ours
  for (const cand of [base, base + ".ts", base + ".tsx", base + ".json", join(base, "index.ts"), join(base, "index.tsx")]) {
    try {
      if (statSync(cand).isFile()) return cand;
    } catch {
      // keep trying
    }
  }
  return null;
}

const rel = (p: string) => relative(resolve(SRC, ".."), p).replace(/\\/g, "/");

/** The chain from a client entry to a forbidden module, or null. */
function chainToForbidden(entry: string): string[] | null {
  const seen = new Set<string>();
  const stack: { file: string; path: string[] }[] = [{ file: entry, path: [rel(entry)] }];
  while (stack.length) {
    const { file, path } = stack.pop()!;
    if (seen.has(file)) continue;
    seen.add(file);
    if (FORBIDDEN.includes(rel(file))) return path;
    let text: string;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue;
    }
    if (file.endsWith(".json")) continue;
    for (const spec of valueImports(text)) {
      const next = resolveImport(spec, file);
      if (next && !seen.has(next)) stack.push({ file: next, path: [...path, rel(next)] });
    }
  }
  return null;
}

describe("the client bundle", () => {
  const files = walk(SRC);
  const entries = files.filter((f) => isClientEntry(readFileSync(f, "utf8")));

  it("finds the client components to check", () => {
    expect(entries.length).toBeGreaterThan(10);
  });

  it("never reaches the publishing index", () => {
    const leaks = entries.map((e) => chainToForbidden(e)).filter((c): c is string[] => c !== null);
    const message = leaks.map((c) => c.join("\n      -> ")).join("\n\n");
    expect(message, "a client component reaches the publishing index:\n\n" + message).toBe("");
  });
});
