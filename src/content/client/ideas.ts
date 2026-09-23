/**
 * 100 VIRAL CONTENT IDEAS. Personalised for each client.
 *
 * Four pillars, twenty-five ideas each. Every idea is one short statement or
 * question. An empty string is an open slot and renders as one; the entries
 * marked as examples show what a filled card looks like and should be
 * replaced for each client.
 */
export type Pillar = "authority" | "education" | "entertainment" | "personal";

export type Idea = { text: string; example?: boolean };

export const pillars: { id: Pillar; title: string; definition: string }[] = [
  { id: "authority", title: "Authority", definition: "Content that demonstrates your expertise, experience, credibility and results." },
  { id: "education", title: "Education", definition: "Content that teaches your audience something useful." },
  { id: "entertainment", title: "Entertainment", definition: "Content designed to capture attention and keep people watching." },
  { id: "personal", title: "Personal", definition: "Content that allows people to understand the individuals, experiences and stories behind the business." },
];

const slots = (n: number): Idea[] => Array.from({ length: n }, () => ({ text: "" }));

export const ideas: Record<Pillar, Idea[]> = {
  authority: [
    { text: "The biggest mistake people make when buying a private jet.", example: true },
    { text: "After 20 years in private aviation, this is what I would always check before buying.", example: true },
    { text: "The quickest corporate jet deal we have ever closed.", example: true },
    ...slots(22),
  ],
  education: [
    { text: "How far can a private jet actually fly without stopping?", example: true },
    { text: "What is an empty leg, and why does it exist?", example: true },
    { text: "Why do two jets of a similar size have completely different range?", example: true },
    ...slots(22),
  ],
  entertainment: [
    { text: "Can you identify this aircraft from the window alone?", example: true },
    { text: "The different types of private jet passengers.", example: true },
    { text: "Reacting to the strangest aircraft configuration we have seen this year.", example: true },
    ...slots(22),
  ],
  personal: [
    { text: "The deal that nearly collapsed 24 hours before delivery.", example: true },
    { text: "The story of my first ever jet sale.", example: true },
    { text: "Why I have the best job in the world.", example: true },
    ...slots(22),
  ],
};
