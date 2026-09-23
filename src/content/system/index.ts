import type { ChapterId, Guide } from "@/content/types";
import { studyYourNiche } from "@/content/system/create/study-your-niche";
import { ideation } from "@/content/system/create/ideation";
import { videoStyle } from "@/content/system/create/video-style";
import { hooks } from "@/content/system/create/hooks";
import { coreMessage } from "@/content/system/create/core-message";
import { filming } from "@/content/system/create/filming";
import { editing } from "@/content/system/create/editing";
import { strategy } from "@/content/system/publish/strategy";
import { packaging } from "@/content/system/publish/packaging";
import { discoverability } from "@/content/system/publish/discoverability";
import { profile } from "@/content/system/publish/profile";
import { understandingYourAnalytics } from "@/content/system/analyse/understanding-your-analytics";
import { monthlyProcess } from "@/content/system/analyse/monthly-process";

/** Every universal guide, in reading order. */
export const guides: Guide[] = [
  studyYourNiche,
  ideation,
  videoStyle,
  hooks,
  coreMessage,
  filming,
  editing,
  strategy,
  packaging,
  discoverability,
  profile,
  understandingYourAnalytics,
  monthlyProcess,
];

export function guidesFor(chapter: ChapterId) {
  return guides.filter((g) => g.chapter === chapter);
}

export function findGuide(chapter: ChapterId, slug: string) {
  return guides.find((g) => g.chapter === chapter && g.slug === slug);
}

/** Rough reading time from the words on the page. */
export function readingMinutes(g: Guide) {
  const text = JSON.stringify(g);
  const words = text.split(/\s+/).length;
  return Math.max(2, Math.round(words / 190));
}
