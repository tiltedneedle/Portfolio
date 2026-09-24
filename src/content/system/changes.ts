import type { Change } from "@/content/clients/types";

/**
 * What has been added to the system, newest first. Home shows the latest
 * few, so a client who comes back sees that the system keeps growing.
 * Dates are ISO (YYYY-MM-DD); `npm run check` keeps them in order.
 */
export const changes: Change[] = [
  { date: "2026-09-24", text: "Eight of our clients' videos, 118 million views between them, now play from your home page.", href: "/" },
  { date: "2026-09-24", text: "Leave a guide mid-way and the call sheet offers to pick it up where you left off.", href: "/" },
  { date: "2026-09-24", text: "Pin the ideas you like: your shortlist leads the first month and the call sheet.", href: "/content/ideas" },
  { date: "2026-09-24", text: "Mark a script as filmed and the rail, the first month and the call sheet follow.", href: "/content/scripts" },
  { date: "2026-09-24", text: "Every idea card can ask the studio to write it up as a script.", href: "/content/ideas" },
  { date: "2026-09-24", text: "The positioning map draws the road from where you are to where the three moves lead.", href: "/audit/competitor-intelligence" },
  { date: "2026-09-24", text: "Your first month, laid out: your scripts on every other day, then ideas from your hundred.", href: "/content/scripts" },
  { date: "2026-09-24", text: "Every script carries a storyboard, a location and who is on camera; the prompter counts you in.", href: "/content/scripts" },
  { date: "2026-09-24", text: "Notes from the studio inside the guides, written for you, where they apply.", href: "/create/hooks" },
  { date: "2026-09-24", text: "The audit reads as a report: a verdict and a score on every heading, and the three moves to make first.", href: "/audit/content-diagnostic" },
  { date: "2026-09-24", text: "Press / to find any page, section, idea, script or audit finding by its words.", href: "/" },
];
