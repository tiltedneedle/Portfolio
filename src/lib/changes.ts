import type { Change } from "@/content/clients/types";

export type Dated = Change & { own?: boolean };

/**
 * The client's own additions beside the system's, newest first; on the
 * same day, the client's come first. The first `show` are what home lists.
 */
export function mergeChanges(mine: Change[], system: Change[], show = 5): Dated[] {
  const all: Dated[] = [...mine.map((c) => ({ ...c, own: true })), ...system.map((c) => ({ ...c }))];
  return all.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0)).slice(0, show);
}
