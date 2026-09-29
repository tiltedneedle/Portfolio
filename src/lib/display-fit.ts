/**
 * How wide a line of the display face is, in em, before it is set.
 *
 * The home page's title gives the client's name a line of its own, and that
 * line has to fit the title's measure. Wrapped, a short last word dropped
 * onto a line alone ("x Company / Name"); held to one line on a wide screen,
 * a long name ran past the line's mask and was cut off. The page is built
 * once, so the width is worked out from the name rather than measured after
 * it paints: a measured fit would jump on load, in the first thing anyone
 * sees.
 *
 * Advances measured from the vendored display face at 100px (canvas
 * measureText, weight 800), as fractions of an em. Checked against the
 * rendered title they land within 2%, on the wide side: the table ignores
 * kerning, and kerning only ever tightens.
 */
const ADVANCE: Record<string, number> = {
  A: 0.443, B: 0.441, C: 0.455, D: 0.461, E: 0.381, F: 0.378, G: 0.457, H: 0.455, I: 0.215,
  J: 0.421, K: 0.458, L: 0.374, M: 0.691, N: 0.508, O: 0.462, P: 0.436, Q: 0.462, R: 0.444,
  S: 0.441, T: 0.384, U: 0.453, V: 0.456, W: 0.733, X: 0.435, Y: 0.43, Z: 0.388,
  "0": 0.473, "1": 0.255, "2": 0.457, "3": 0.47, "4": 0.479, "5": 0.48, "6": 0.465, "7": 0.446,
  "8": 0.466, "9": 0.465, " ": 0.217, "&": 0.581, "'": 0.19, ".": 0.238, ",": 0.239, "-": 0.413,
};
/** Anything the table does not hold: about an average capital. */
const OTHER = 0.46;
/** The face's tracking, as .display sets it (letter-spacing: 0.01em). */
const TRACK = 0.01;
/** The serif times sign that opens the client's line, set at 0.7em. */
export const TIMES = 0.372;

const round = (n: number) => Math.round(n * 1000) / 1000;

/** The width of `text` set in the display face (which sets it in capitals), in em. */
export function displayEm(text: string): number {
  let em = 0;
  for (const ch of text.toUpperCase()) em += (ADVANCE[ch] ?? OTHER) + TRACK;
  return em;
}

/**
 * The widest single word of `text` in the display face, in em: the part of a
 * title that cannot wrap. A guide's title is set at 52px at the least, and
 * "Discoverability" is six of its own em wide, 310px -- more than a 320px
 * phone has once its margins are out (and the phone then zooms the whole
 * page out to fit it). The title's size is capped by this (Guide.tsx).
 */
export function longestWordEm(text: string): number {
  return round(Math.max(0, ...text.trim().split(/\s+/).filter(Boolean).map(displayEm)));
}

/**
 * The client's line in the home title -- the times sign, a space, the name
 * -- as the two widths its fit needs (globals.css, .title-fit): the whole
 * line, to scale it onto one line, and its longest word, the one thing that
 * cannot wrap, so the floor under the scale never lets a word overflow.
 */
export function titleFit(name: string): { line: number; word: number } {
  const clean = name.trim().replace(/\s+/g, " ");
  const words = clean.split(" ").filter(Boolean);
  return {
    line: round(TIMES + displayEm(" " + clean)),
    word: round(Math.max(TIMES, ...words.map(displayEm))),
  };
}
