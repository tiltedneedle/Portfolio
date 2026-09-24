// Smoke test against a running server: every route answers, the door
// behaves, and the pages carry what they should. No browser needed.
//
//   node scripts/smoke.mjs http://localhost:3400            (open door)
//   node scripts/smoke.mjs http://localhost:3401 --gated    (PORTAL_SECRET set)
const base = process.argv[2] || "http://localhost:3400";
const gated = process.argv.includes("--gated");
let failed = 0;

async function expect(path, want, opts = {}) {
  const res = await fetch(base + path, { redirect: "manual", headers: { connection: "close", ...(opts.headers || {}) } });
  const body = opts.contains ? await res.text() : "";
  const okStatus = res.status === want;
  const okBody = !opts.contains || (opts.contains instanceof RegExp ? opts.contains.test(body) : body.includes(opts.contains));
  const okLoc = !opts.location || (res.headers.get("location") || "").includes(opts.location);
  const ok = okStatus && okBody && okLoc;
  if (!ok) failed++;
  console.log((ok ? "ok    " : "FAIL  ") + path.padEnd(40) + " " + res.status + (opts.location ? " -> " + res.headers.get("location") : "") + (opts.contains && !okBody ? '  (missing "' + opts.contains + '")' : ""));
}

if (!gated) {
  await expect("/", 200, { contains: "Company Name" });
  await expect("/audit", 200, { contains: "Content diagnostic" });
  await expect("/audit/content-diagnostic", 200, { contains: /13(<!-- -->)? headings/ });
  await expect("/audit/competitor-intelligence", 200);
  await expect("/content", 200);
  await expect("/content/ideas", 200, { contains: "Authority" });
  await expect("/content/scripts", 200);
  await expect("/content/scripts/1", 200, { contains: "Copy script" });
  await expect("/content/scripts/1", 200, { contains: "Prompter" });
  await expect("/content/ideas", 200, { contains: "Deal me one" });
  await expect("/create/hooks", 200, { contains: "Name the hook" });
  await expect("/analyse/understanding-your-analytics", 200, { contains: "retention curve" });
  await expect("/publish/strategy", 200, { contains: "posts across" });
  await expect("/", 200, { contains: "Training film" });
  await expect("/content/scripts/20", 200);
  await expect("/content/scripts/21", 404);
  await expect("/create", 200);
  for (const s of ["study-your-niche", "ideation", "video-style", "hooks", "core-message", "filming", "editing"]) await expect("/create/" + s, 200, { contains: "The rule" });
  for (const s of ["strategy", "packaging", "discoverability", "profile"]) await expect("/publish/" + s, 200, { contains: "The rule" });
  for (const s of ["understanding-your-analytics", "monthly-process"]) await expect("/analyse/" + s, 200, { contains: "The rule" });
  await expect("/c/demo/audit", 307, { location: "/audit" });
  await expect("/c/template", 307, { location: "/" });
  await expect("/nope", 404);
  await expect("/login", 200, { contains: "door is open" });
  await expect("/robots.txt", 200, { contains: "Disallow: /" });
} else {
  await expect("/", 307, { location: "/login" });
  await expect("/create/hooks", 307, { location: "/login?next=%2Fcreate%2Fhooks" });
  await expect("/", 307, { location: "/login", headers: { cookie: "tn-room=demo.9999999999999.deadbeef" } });
  await expect("/c/demo/audit", 307, { location: "/audit" });
  await expect("/login", 200, { contains: "Access code" });
}

console.log(failed ? "\n" + failed + " failed" : "\nall passed");
process.exit(failed ? 1 : 0);
