/**
 * The content model for the system.
 *
 * Every guide page is data: an intro, a training film slot, numbered sections
 * made of blocks, and the rule it closes on. The renderer in
 * `components/portal/Guide.tsx` turns each block kind into a designed piece,
 * so the writing stays writing and the design stays in one place.
 *
 * Inline text supports two marks: `**bold**` (ink, medium weight) and
 * `*emphasis*` (the serif italic). Nothing else.
 */

export type ChapterId = "home" | "audit" | "content" | "create" | "publish" | "analyse";

export type Block =
  /** A paragraph. */
  | { kind: "p"; text: string }
  /** A larger opening paragraph. */
  | { kind: "lead"; text: string }
  /**
   * A list. `rule`: ruled rows with a mono index (the default). `tag`: short
   * items as pills. `beat`: one-word beats stacked in the display face.
   */
  | { kind: "list"; title?: string; items: string[]; style?: "rule" | "tag" | "beat" }
  /** Questions to ask, set in the serif italic. */
  | { kind: "questions"; title?: string; items: string[] }
  /**
   * Example lines. `spoken`: something said on camera (serif italic, quoted).
   * `screen`: on-screen text (display face, as a caption chip). `dim`: lines
   * to avoid (set quietly).
   */
  | { kind: "lines"; title?: string; items: string[]; mode?: "spoken" | "screen" | "dim" }
  /** One or more "instead of this, try this" pairs. */
  | { kind: "swaps"; title?: string; pairs: { from: string; to: string }[]; fromLabel?: string; toLabel?: string }
  /** Equal pairs: "if you are talking about X, show X". */
  | { kind: "pairs"; title?: string; items: { a: string; b: string }[]; aLabel?: string; bLabel?: string }
  /** Labelled groups: a mono label and the lines under it. */
  | { kind: "keyed"; title?: string; items: { label: string; lines: string[] }[] }
  /** An ordered structure, drawn as a timeline. */
  | { kind: "steps"; title?: string; items: { title: string; text?: string }[] }
  /** A small grid of titled cards (the four pillars). */
  | { kind: "cards"; title?: string; items: { title: string; text: string }[] }
  /** Two columns side by side (when to speed up / when to slow down). */
  | { kind: "split"; title?: string; a: { label: string; items: string[] }; b: { label: string; items: string[] } }
  /** A call sheet: boxes to tick before you film, publish, or leave a shoot. */
  | { kind: "checklist"; title: string; items: string[]; note?: string }
  /** A pull quote or a principle, optionally labelled ("Action point"). */
  | { kind: "aside"; label?: string; text: string }
  /** A titled sub-section. */
  | { kind: "sub"; title: string; blocks: Block[] }
  /** Example clips from the studio's published library, by YouTube id. */
  | { kind: "clips"; title?: string; note?: string; items: { id: string; caption?: string }[] }
  /** The bad-profile / good-profile comparison. */
  | { kind: "profile" }
  /* ---- diagrams. Each draws a principle the writing states. ---- */
  /** Where attention is lost: a watch-time curve with the two exits marked. */
  | { kind: "retention"; title?: string; note?: string }
  /** A month of days, every `every`th one carrying a post. */
  | { kind: "cadence"; title?: string; note?: string; days?: number; every?: number }
  /** One to many: a root and its branches (one idea, four angles; one video, five platforms). */
  | { kind: "fan"; title?: string; from: string; fromLabel?: string; to: { label?: string; text: string }[]; note?: string }
  /** The shape of a video as a strip with timecodes; `share` is relative. */
  | { kind: "structure"; title?: string; parts: { label: string; share: number; text?: string }[]; seconds?: number; note?: string }
  /** Shot sizes as a contact sheet of 9:16 frames. */
  | { kind: "shots"; title?: string; items: { label: string; size: "wide" | "medium" | "close" | "detail"; text?: string }[]; note?: string }
  /** Two angles of view from one camera. */
  | { kind: "lens"; title?: string; wide: string; tight: string; note?: string }
  /** Flashcards: an opening line on the front, the hook it uses on the back. */
  | { kind: "flashcards"; title?: string; items: { front: string; back: string }[]; note?: string }
  /** A ladder of yes/no questions; yes turns to an answer, no drops to the next. */
  | { kind: "flow"; title?: string; steps: { q: string; yes: string }[]; end: string; note?: string }
  /** A search box typing the things people search for. */
  | { kind: "typewriter"; title?: string; queries: string[] }
  /** A ring of stations, the last leading back to the first. */
  | { kind: "cycle"; title?: string; items: string[]; note?: string }
  /** A still, from `public/` or a URL, in a well with a caption. */
  | { kind: "figure"; src: string; alt: string; caption?: string; ratio?: "16/9" | "9/16" | "4/5" | "1/1" | "3/2" };

export type Section = {
  /** "01", "02"… Unnumbered sections (a call sheet, a test) leave it out. */
  n?: string;
  title: string;
  blocks: Block[];
};

export type TrainingFilm = {
  title: string;
  /** Drop the YouTube id in when the film is uploaded. Until then the well shows its slate. */
  youtubeId?: string;
  minutes?: number;
};

export type Guide = {
  chapter: Extract<ChapterId, "create" | "publish" | "analyse">;
  slug: string;
  /** As printed: "Hooks", "Viral filming blueprint". */
  title: string;
  /** One line under the title, set in the serif italic. */
  kicker: string;
  intro: string[];
  /** Blocks that belong before the first numbered section (a comparison, a list of searches). */
  opener?: Block[];
  film?: TrainingFilm;
  /** YouTube id of the clip that stands for this guide on its chapter page. */
  poster?: string;
  sections: Section[];
  /** The rule the page closes on. */
  rule: Block[];
};
