import type { AuditFinding, AuditReport, Competitor, Pillar, PositionMap, Script } from "@/content/clients/types";

/** The four content pillars. Universal; every client's hundred ideas sit in these. */
export const pillars: { id: Pillar; title: string; definition: string }[] = [
  { id: "authority", title: "Authority", definition: "Content that demonstrates your expertise, experience, credibility and results." },
  { id: "education", title: "Education", definition: "Content that teaches your audience something useful." },
  { id: "entertainment", title: "Entertainment", definition: "Content designed to capture attention and keep people watching." },
  { id: "personal", title: "Personal", definition: "Content that allows people to understand the individuals, experiences and stories behind the business." },
];

/** The fixed audit structures. Every client's audit follows the same headings. */
export const diagnosticHeadings: { title: string; covers: string }[] = [
  { title: "Current positioning", covers: "How the brand reads to someone landing on it today." },
  { title: "Current content", covers: "What is being published, how often, and how it performs." },
  { title: "Hooks", covers: "How videos open, and whether the first seconds earn the rest." },
  { title: "Topics", covers: "The subjects being covered, and the ones being missed." },
  { title: "Video formats", covers: "The styles in use, and which formats the access could support." },
  { title: "Filming", covers: "Composition, movement, lighting, audio and coverage." },
  { title: "Editing", covers: "Pacing, cuts, B roll, captions, sound and consistency." },
  { title: "Posting", covers: "Consistency, platforms, timing and packaging." },
  { title: "Profile", covers: "Image, name, bio, links, pinned content and calls to action." },
  { title: "What is working", covers: "The elements to keep and build on." },
  { title: "What is holding you back", covers: "The specific things limiting reach and growth." },
  { title: "Biggest opportunities", covers: "Where the largest upside sits, in order." },
  { title: "What we would change", covers: "Who should be on camera, where to film, which stories to tell, and what to focus on first." },
];

export const competitorHeadings: { title: string; covers: string }[] = [
  { title: "Competitors analysed", covers: "The accounts studied: direct competitors and the creators speaking to the same audience." },
  { title: "Best performing content", covers: "The outliers: the videos that significantly outperformed everything else." },
  { title: "Best topics", covers: "The subjects that repeatedly perform in this market." },
  { title: "Best formats", covers: "The styles of video generating views." },
  { title: "Best hooks", covers: "The openings that are currently working." },
  { title: "Common patterns", covers: "What the successful content has in common." },
  { title: "Content gaps", covers: "What nobody in the market is doing well." },
  { title: "Opportunities for you", covers: "The gaps this business is best placed to fill." },
];

export const DIAGNOSTIC_INTRO =
  "A complete analysis of your current social media presence. What is working, what is limiting your growth, and what we would change.";

export const COMPETITOR_INTRO =
  "What is already working within your market. The topics, formats and hooks your competitors are using, and where the opportunities are for your brand.";

/**
 * Build a report from the fixed headings and a map of written findings, so a
 * client file only ever writes the findings and can never drift from the
 * structure. A finding is either the paragraphs alone or a full
 * `AuditFinding` (verdict, score, the keep / limiting / change columns,
 * evidence, a place in the first three moves). The competitor report can
 * also carry its board of accounts and a positioning map.
 */
export function report(
  intro: string,
  headings: { title: string; covers: string }[],
  written: Record<string, string[] | AuditFinding> = {},
  extra: { competitors?: Competitor[]; map?: PositionMap } = {}
): AuditReport {
  const sections = headings.map((h) => {
    const w = written[h.title];
    if (!w) return { ...h };
    return Array.isArray(w) ? { ...h, body: w } : { ...h, ...w };
  });
  return { intro, sections, ...extra };
}

/** Twenty-five slots, with any written ideas placed first. */
export function pillar(written: (string | { text: string; example?: boolean })[] = []) {
  const items = written.map((w) => (typeof w === "string" ? { text: w } : w));
  while (items.length < 25) items.push({ text: "" });
  return items.slice(0, 25);
}

/** Twenty script slots, with any written scripts placed by number. */
export function scripts(written: Script[] = []) {
  return Array.from({ length: 20 }, (_, i) => written.find((s) => s.n === i + 1) ?? { n: i + 1, title: "" });
}
