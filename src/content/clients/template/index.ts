import type { ClientSystem } from "@/content/clients/types";
import { COMPETITOR_INTRO, DIAGNOSTIC_INTRO, competitorHeadings, diagnosticHeadings, pillar, report, scripts } from "@/content/system/pillars";

/**
 * THE TEMPLATE. What an open door shows, and what a new client's folder is
 * copied from. Every personalised slot is empty, so the audit, the ideas
 * and the scripts are not on the website at all until a client's are
 * written. The demo client shows the finished state.
 *
 * To set up a client: copy this folder to `src/content/clients/<slug>/`,
 * fill the four parts below, generate an access hash with
 * `node scripts/access.mjs <slug> <access code>`, add the client to
 * `registry.ts`, run `npm run check`.
 */
export const template: ClientSystem = {
  identity: {
    slug: "template",
    name: "Company Name",
    short: "",
    logo: "",
    since: "2026",
    contact: "info@tiltedneedle.com",
    accessHash: "",
  },

  contentDiagnostic: report(DIAGNOSTIC_INTRO, diagnosticHeadings),

  competitorIntelligence: report(COMPETITOR_INTRO, competitorHeadings),

  ideas: {
    authority: pillar(),
    education: pillar(),
    entertainment: pillar(),
    personal: pillar(),
  },

  scripts: scripts(),
};
