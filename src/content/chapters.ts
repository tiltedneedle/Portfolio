import type { ChapterId } from "@/content/types";

/**
 * The six rooms of the system, in the order the client moves through them.
 * The nav, the home strip, the footer and every prev/next link read this.
 *
 * `personalised` chapters are written for each client; everything else is
 * the same for everyone.
 */
export type ChapterPage = { slug: string; title: string; short?: string };

export type Chapter = {
  id: ChapterId;
  n: string;
  title: string;
  href: string;
  personalised: boolean;
  /** One line for the nav panel and the overview page. */
  blurb: string;
  pages: ChapterPage[];
};

export const chapters: Chapter[] = [
  {
    id: "home",
    n: "01",
    title: "Home",
    href: "/",
    personalised: false,
    blurb: "Your system, what is inside it, and how to move through it.",
    pages: [
      { slug: "#welcome", title: "Welcome" },
      { slug: "#access", title: "What you have access to" },
      { slug: "#how", title: "How to use the system" },
    ],
  },
  {
    id: "audit",
    n: "02",
    title: "Your audit",
    href: "/audit",
    personalised: true,
    blurb: "Where you are now, what is working, and what we would change.",
    pages: [
      { slug: "content-diagnostic", title: "Content diagnostic" },
      { slug: "competitor-intelligence", title: "Competitor intelligence" },
    ],
  },
  {
    id: "content",
    n: "03",
    title: "Your content",
    href: "/content",
    personalised: true,
    blurb: "One hundred ideas across four pillars, and twenty scripts ready to film.",
    pages: [
      { slug: "ideas", title: "100 viral content ideas", short: "100 ideas" },
      { slug: "scripts", title: "20 personalised scripts", short: "20 scripts" },
    ],
  },
  {
    id: "create",
    n: "04",
    title: "Create",
    href: "/create",
    personalised: false,
    blurb: "The exact process we use to research, write, film and edit.",
    pages: [
      { slug: "study-your-niche", title: "Study your niche" },
      { slug: "ideation", title: "Infinite content ideation system", short: "Ideation system" },
      { slug: "video-style", title: "Style of video" },
      { slug: "hooks", title: "Hooks" },
      { slug: "core-message", title: "Deliver your core message", short: "Core message" },
      { slug: "filming", title: "How to film" },
      { slug: "editing", title: "How to edit" },
    ],
  },
  {
    id: "publish",
    n: "05",
    title: "Publish",
    href: "/publish",
    personalised: false,
    blurb: "Everything that happens after the video is finished.",
    pages: [
      { slug: "strategy", title: "Publishing strategy" },
      { slug: "packaging", title: "Content packaging" },
      { slug: "discoverability", title: "Discoverability" },
      { slug: "profile", title: "Profile optimisation" },
    ],
  },
  {
    id: "analyse",
    n: "06",
    title: "Analyse",
    href: "/analyse",
    personalised: false,
    blurb: "What the numbers are telling you, and what to do next.",
    pages: [
      { slug: "understanding-your-analytics", title: "Understanding your analytics", short: "Your analytics" },
      { slug: "monthly-process", title: "Monthly analytics process", short: "Monthly process" },
    ],
  },
];

export function chapter(id: ChapterId): Chapter {
  const c = chapters.find((x) => x.id === id);
  if (!c) throw new Error("Unknown chapter " + id);
  return c;
}

/** "04.03" for the third page of chapter 04. */
export function pageNumber(id: ChapterId, slug: string): string {
  const c = chapter(id);
  const i = c.pages.findIndex((p) => p.slug === slug);
  return c.n + "." + String(i + 1).padStart(2, "0");
}

export function pageHref(id: ChapterId, slug: string): string {
  const c = chapter(id);
  return slug.startsWith("#") ? c.href + slug : c.href + "/" + slug;
}

/** The page before and after, across chapter boundaries, for the match cut at the foot of a guide. */
export function neighbours(id: ChapterId, slug: string) {
  const flat = chapters
    .filter((c) => c.id !== "home")
    .flatMap((c) => c.pages.map((p) => ({ chapter: c, page: p })));
  const i = flat.findIndex((x) => x.chapter.id === id && x.page.slug === slug);
  return { prev: i > 0 ? flat[i - 1] : null, next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : null };
}
