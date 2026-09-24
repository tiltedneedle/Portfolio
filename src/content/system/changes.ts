/**
 * What has been added to the system, newest first. Home shows the latest
 * few, so a client who comes back sees that the system keeps growing.
 * Dates are ISO (YYYY-MM-DD); `npm run check` keeps them in order.
 */
export const changes: { date: string; text: string; href?: string }[] = [
  { date: "2026-09-24", text: "Your first month, laid out: your scripts on every other day, then ideas from your hundred.", href: "/content/scripts" },
  { date: "2026-09-24", text: "Every script carries a storyboard, a location and who is on camera; the prompter counts you in.", href: "/content/scripts" },
  { date: "2026-09-24", text: "Notes from the studio inside the guides, written for you, where they apply.", href: "/create/hooks" },
  { date: "2026-09-24", text: "The audit reads as a report: a verdict and a score on every heading, and the three moves to make first.", href: "/audit/content-diagnostic" },
  { date: "2026-09-24", text: "Press / to find any page, section, idea or script by its words.", href: "/" },
];
