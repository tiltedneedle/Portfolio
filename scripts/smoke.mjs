// Smoke test against a running server: every route answers, the door
// behaves, and the pages carry what they should. No browser needed.
//
//   node scripts/smoke.mjs http://localhost:3400            (open door)
//   node scripts/smoke.mjs http://localhost:3401 --gated    (accounts: the test double)
import { ACCOUNTS, signIn } from "./test-accounts.mjs";
const base = process.argv[2] || "http://localhost:3400";
const gated = process.argv.includes("--gated");
let failed = 0;

async function expect(path, want, opts = {}) {
  const res = await fetch(base + path, { redirect: "manual", headers: { connection: "close", ...(opts.headers || {}) } });
  // Every body is read, even where only the status is checked. Left unread,
  // it holds Node's HTTP client paused, and when the server then closes the
  // connection the client dies on an internal assertion (undici's
  // assert(!this.paused)): that, not the site, failed CI's smoke step on
  // most pushes, open door or gated at random.
  const text = await res.text();
  const body = opts.contains || opts.lacks ? text : "";
  const okStatus = res.status === want;
  const okBody = !opts.contains || (opts.contains instanceof RegExp ? opts.contains.test(body) : body.includes(opts.contains));
  // opts.lacks: a string the page must not carry.
  const okLacks = !opts.lacks || !body.includes(opts.lacks);
  const okLoc = !opts.location || (res.headers.get("location") || "").includes(opts.location);
  // opts.header: [name, fragment] that the response header must carry.
  const okHeader = !opts.header || (res.headers.get(opts.header[0]) || "").includes(opts.header[1]);
  const ok = okStatus && okBody && okLacks && okLoc && okHeader;
  if (!ok) failed++;
  console.log((ok ? "ok    " : "FAIL  ") + path.padEnd(40) + " " + res.status + (opts.location ? " -> " + res.headers.get("location") : "") + (opts.contains && !okBody ? '  (missing "' + opts.contains + '")' : "") + (opts.lacks && !okLacks ? '  (carries "' + opts.lacks + '")' : "") + (opts.header && !okHeader ? "  (header " + opts.header[0] + " lacks " + opts.header[1] + ")" : ""));
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
  // The template has nothing written, so every personalised part is shown
  // LOCKED: named on the strip and in the nav, so the client sees the whole
  // shape of the system, with nothing of anyone else's on it and no way into
  // the empty room behind it.
  // The strip's heading is the brief's own: WHAT YOU HAVE ACCESS TO.
  await expect("/", 200, { contains: 'What you have <span class="em-serif">access to.' });
  await expect("/", 200, { contains: "Your audit" });
  // The room's own name, not a tagline that happens to share words with it:
  // this asserts the room.
  await expect("/", 200, { contains: "Your content<" });
  // The brief's own words, as served: the tagline with its red word, the lead,
  // and the objective. A writing pass once paraphrased all three.
  await expect("/", 200, { contains: ">viral<" });
  await expect("/", 200, { contains: "Everything we have learned from generating over 5 billion organic views, built into one complete system for" });
  await expect("/", 200, { contains: "This portal gives you the exact frameworks, processes and principles we use at Tilted Needle" });
  await expect("/", 200, { contains: "To give your team the knowledge and infrastructure required to consistently create content" });
  await expect("/", 200, { contains: "Not yours yet" });
  // A locked part is a button, never a link. The path into the room it will
  // one day open must be nowhere on the page, router payload included.
  await expect("/", 200, { lacks: "/content/ideas" });
  await expect("/", 200, { lacks: "/audit/content-diagnostic" });
  await expect("/", 200, { lacks: "Same for everyone" });
  // The nav names the locked rooms on every page; what it must never do is
  // offer a way into one.
  await expect("/create/hooks", 200, { lacks: "/audit/content-diagnostic" });
  await expect("/create/hooks", 200, { contains: "Name the hook" });
  await expect("/analyse/understanding-your-analytics", 200, { contains: "retention curve" });
  await expect("/publish/strategy", 200, { contains: "posts across" });
  await expect("/", 200, { contains: "Training film" });
  await expect("/", 200, { contains: "From our clients" });
  await expect("/clips/tiktok-7283257299626511649.jpg", 200);
  // The brief's figure, served as a file, and on the page the brief puts it.
  await expect("/guides/bad-and-good-profile.webp", 200);
  await expect("/publish/discoverability", 200, { contains: "/guides/bad-and-good-profile.webp" });
  await expect("/", 200, { contains: "Call sheet" });
  await expect("/", 200, { contains: "Recently added" });
  await expect("/search-index.json", 200, { contains: "Verbal hooks" });
  // The palette versions the URL by build; the door must pass the query through.
  await expect("/search-index.json?v=smoke", 200, { contains: "Verbal hooks" });
  await expect("/create/hooks", 200, { contains: "Mark as read" });
  await expect("/content/scripts/20", 200);
  await expect("/content/scripts/21", 404, { contains: "Missing reel" });
  await expect("/opengraph-image", 200);
  await expect("/create", 200);
  // A room states what is in it, offers a way in, and cuts to the next room.
  await expect("/create", 200, { contains: "To read" });
  await expect("/create", 200, { contains: "Start at 04.01" });
  await expect("/create", 200, { contains: "The next room" });
  await expect("/analyse", 200, { lacks: "The next room" });
  await expect("/create/hooks", 200, { contains: "In this guide" });
  // The conform: one measured reel at the foot of every page, and the same
  // measurement read out in the first frame. The template client has thirteen
  // universal pages and no audit, so its reel starts at 04.
  await expect("/create/hooks", 200, { contains: "The whole system, end to end" });
  await expect("/create/hooks", 200, { contains: /13(<!-- -->)? pages/ });
  await expect("/create/hooks", 200, { contains: /04(<!-- -->)? — (<!-- -->)?Create/ });

  await expect("/", 200, { contains: "POS" });
  await expect("/", 200, { contains: "Position:" });
  for (const s of ["study-your-niche", "ideation", "video-style", "hooks", "core-message", "filming", "editing"]) await expect("/create/" + s, 200, { contains: "The rule" });
  for (const s of ["strategy", "packaging", "discoverability", "profile"]) await expect("/publish/" + s, 200, { contains: "The rule" });
  for (const s of ["understanding-your-analytics", "monthly-process"]) await expect("/analyse/" + s, 200, { contains: "The rule" });
  await expect("/c/demo/audit", 307, { location: "/audit" });
  await expect("/c/template", 307, { location: "/" });
  await expect("/nope", 404);
  await expect("/login", 200, { contains: "door is open" });
  // A hostile or mistyped ?error must not take the door down: messages is a
  // plain object, so messages["__proto__"] used to render Object.prototype
  // and throw, replacing the login form with the fault page.
  await expect("/login?error=__proto__", 200, { contains: 'name="email"' });
  await expect("/login?for=constructor", 200, { contains: 'name="email"' });
  await expect("/login?error=constructor", 200, { contains: 'name="email"' });
  await expect("/login?error=nosuchthing", 200, { contains: 'name="email"' });
  // Same bug, one line below the one that was fixed: a prototype key reached
  // the client lookup, so /login?for=constructor answered 500.
  await expect("/login?for=constructor", 200, { contains: 'name="email"' });
  await expect("/login?for=tostring", 200, { contains: 'name="email"' });
  await expect("/login?for=nosuchclient", 200, { contains: 'name="email"' });
  await expect("/login?for=demo", 200, { contains: /prepared for (<!-- -->)?Horizon Aviation/ });
  await expect("/login?for=nope", 200, { contains: "Private screening" });
  await expect("/robots.txt", 200, { contains: "Disallow: /" });
  // The headers next.config.ts promises, on a page and on a route handler.
  await expect("/", 200, { header: ["content-security-policy", "default-src 'self'"] });
  await expect("/", 200, { header: ["x-robots-tag", "noindex"] });
  await expect("/", 200, { header: ["strict-transport-security", "max-age="] });
  await expect("/search-index.json", 200, { header: ["x-content-type-options", "nosniff"] });
} else {
  await expect("/login", 200, { header: ["x-robots-tag", "noindex"] });
  await expect("/login", 200, { header: ["x-frame-options", "SAMEORIGIN"] });
  // Static files are served past the door, like the clips: not rewritten into a tree.
  await expect("/guides/bad-and-good-profile.webp", 200);
  await expect("/", 307, { location: "/login" });
  await expect("/create/hooks", 307, { location: "/login?next=%2Fcreate%2Fhooks" });
  await expect("/search-index.json", 307, { location: "/login?next=%2Fsearch-index.json" });
  await expect("/", 307, { location: "/login", headers: { cookie: "tn-room=demo.9999999999999.deadbeef" } });
  await expect("/", 307, { location: "/login", headers: { cookie: "sb-localhost-auth-token=base64-bm90IGEgc2Vzc2lvbg" } });
  await expect("/c/demo/audit", 307, { location: "/audit" });
  await expect("/login", 200, { contains: 'name="email"' });
  await expect("/login?error=__proto__", 200, { contains: 'name="email"' });
  // A backslash is a slash to a browser, so this used to survive safeNext
  // and end up in the form as a redirect target. The framework echoes the
  // request URL in its own router payload either way; what matters is that
  // the field the form actually submits has been sanitised back to "/".
  await expect("/login?next=%2F%5Cevil.example", 200, { contains: 'name="next" value="/"' });
  await expect("/login?next=%2F%2Fevil.example", 200, { contains: 'name="next" value="/"' });
  await expect("/login?next=%2Fcreate%2Fhooks", 200, { contains: 'name="next" value="/create/hooks"' });
  await expect("/login?for=demo", 200, { contains: /prepared for (<!-- -->)?Horizon Aviation/ });
  await expect("/login?error=account", 200, { contains: "This account has no portal here" });
  await expect("/login?forgot=1", 200, { contains: 'action="/auth/forgot"' });
  await expect("/login?error=link", 200, { contains: 'action="/auth/forgot"' });
  // Choosing a password needs the session an emailed link begins.
  await expect("/auth/reset", 307, { location: "/login?error=link" });

  // Inside, as the demo's client, through the form handler a browser posts to.
  const s = await signIn(base, ACCOUNTS.client);
  const okIn = s.status === 303 && s.location === "/" && s.cookie.includes("sb-localhost-auth-token=");
  if (!okIn) failed++;
  console.log((okIn ? "ok    " : "FAIL  ") + "sign in as the demo's client".padEnd(40) + " " + s.status + " -> " + s.location);
  const inside = { headers: { cookie: s.cookie } };
  await expect("/", 200, { contains: "Horizon Aviation", ...inside });
  await expect("/audit/content-diagnostic", 200, { contains: "Horizon Aviation", ...inside });
  await expect("/content/scripts/3", 200, inside);
  await expect("/search-index.json", 200, { contains: "Verbal hooks", ...inside });
  await expect("/c/template/audit", 307, { location: "/audit", ...inside });
  // An account with no portal here is turned away at the form, and says why.
  const staff = await signIn(base, ACCOUNTS.owner);
  const okStaff = staff.location.startsWith("/login?error=account") && !staff.cookie.includes("sb-");
  if (!okStaff) failed++;
  console.log((okStaff ? "ok    " : "FAIL  ") + "staff account turned away".padEnd(40) + " " + staff.status + " -> " + staff.location);
}

console.log(failed ? "\n" + failed + " failed" : "\nall passed");
process.exit(failed ? 1 : 0);
