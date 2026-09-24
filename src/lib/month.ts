import type { Script } from "@/content/clients/types";

export type IdeaRef = { pillar: string; n: number; text: string; example?: boolean; k?: string };
export type Slot =
  | { day: number; kind: "script"; n: number; title: string; href: string }
  | { day: number; kind: "idea"; n: number; title: string; href: string; pillar: string; pinned: boolean }
  | { day: number; kind: "open" };

const key = (i: IdeaRef) => i.k ?? i.pillar.toLowerCase() + ":" + i.n;

/**
 * The first month: one post every other day, fifteen in thirty. The
 * written scripts go first, in order; then the pinned ideas, in the order
 * they were pinned; then the rest of the hundred, round-robin across the
 * pillars so the month holds a mixture rather than a run of one kind.
 * An idea that already became a script is skipped.
 */
export function monthSlots(scripts: Script[], ideas: IdeaRef[], pinned: Iterable<string> = [], days = 30): Slot[] {
  const written = scripts.filter((s) => s.body?.length);
  const taken = new Set(written.filter((s) => s.from).map((s) => s.from!.pillar + ":" + s.from!.n));
  const free = ideas.filter((i) => !taken.has(key(i)));
  const byKey = new Map(free.map((i) => [key(i), i]));
  const first: IdeaRef[] = [];
  for (const k of pinned) {
    const i = byKey.get(k);
    if (i && !first.includes(i)) first.push(i);
  }
  const rest = free
    .filter((i) => !first.includes(i))
    .map((i, order) => ({ i, order }))
    .sort((x, y) => x.i.n - y.i.n || x.order - y.order)
    .map((x) => x.i);
  const spare = [...first, ...rest];
  const postingDays = Array.from({ length: days }, (_, i) => i + 1).filter((d) => d % 2 === 1);
  return postingDays.map((day, i) => {
    const s = written[i];
    if (s) return { day, kind: "script", n: s.n, title: s.title, href: "/content/scripts/" + s.n };
    const idea = spare[i - written.length];
    if (idea) return { day, kind: "idea", n: idea.n, title: idea.text, href: "/content/ideas", pillar: idea.example ? "Example" : idea.pillar, pinned: first.includes(idea) };
    return { day, kind: "open" };
  });
}
