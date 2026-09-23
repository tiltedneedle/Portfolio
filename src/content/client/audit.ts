/**
 * YOUR AUDIT. Personalised for each client.
 *
 * The two structures below are fixed: every client's audit follows the same
 * thirteen and eight headings, so the layout is built once. For each new
 * client, fill in `body` (paragraphs) under each heading; a heading with no
 * body shows its placeholder slate.
 */
export type AuditSection = {
  title: string;
  /** What this heading covers, shown on the slate until it is written. */
  covers: string;
  body?: string[];
};

export const contentDiagnostic: { intro: string; sections: AuditSection[] } = {
  intro:
    "A complete analysis of your current social media presence. What is working, what is limiting your growth, and what we would change.",
  sections: [
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
    {
      title: "What we would change",
      covers: "Who should be on camera, where to film, which stories to tell, and what to focus on first.",
    },
  ],
};

export const competitorIntelligence: { intro: string; sections: AuditSection[] } = {
  intro:
    "What is already working within your market. The topics, formats and hooks your competitors are using, and where the opportunities are for your brand.",
  sections: [
    { title: "Competitors analysed", covers: "The accounts studied: direct competitors and the creators speaking to the same audience." },
    { title: "Best performing content", covers: "The outliers: the videos that significantly outperformed everything else." },
    { title: "Best topics", covers: "The subjects that repeatedly perform in this market." },
    { title: "Best formats", covers: "The styles of video generating views." },
    { title: "Best hooks", covers: "The openings that are currently working." },
    { title: "Common patterns", covers: "What the successful content has in common." },
    { title: "Content gaps", covers: "What nobody in the market is doing well." },
    { title: "Opportunities for you", covers: "The gaps this business is best placed to fill." },
  ],
};
