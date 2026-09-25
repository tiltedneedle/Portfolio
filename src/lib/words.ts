/** Words in a run of text, counted the way a script reader would. */
const WORDS = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve"];

/** "seven" for 7; a numeral above twelve, the way a newspaper sets it. */
export function numberWord(n: number) {
  return WORDS[n] ?? String(n);
}

export function wordCount(text: string) {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

/**
 * How long a script takes to say out loud, at a presenter's pace.
 * 150 words a minute is the middle of the range for spoken English on
 * camera; fast talkers reach 170, deliberate ones sit near 130.
 */
export const SPOKEN_WPM = 150;

export function spokenSeconds(text: string, wpm = SPOKEN_WPM) {
  return Math.round((wordCount(text) / wpm) * 60);
}

/** "1:20" style, for a spoken length. */
export function mmss(seconds: number) {
  const s = Math.max(0, Math.round(seconds));
  return Math.floor(s / 60) + ":" + String(s % 60).padStart(2, "0");
}
