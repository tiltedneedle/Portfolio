import { Fragment, type CSSProperties } from "react";

/**
 * Opening titles for every page after the home page.
 *
 * The home page opens like a title sequence; every other page opens like a
 * scene in the same film, in a shorter cut: the slate wipes on, the title
 * rises word by word through its own masks, the line under it is pulled
 * into focus, and the readouts come up after it. About a second.
 *
 * These only split text into spans; the motion is CSS (the scene titles
 * block in globals.css), so it needs no hydration, it is held while the
 * slate or a cut is on screen and plays when the frame lifts, and a reader
 * who asked for stillness gets the page already landed. No hooks, so they
 * work in server and client components alike.
 *
 * Words are separated by real spaces, so a title still wraps, balances and
 * reads exactly as the unsplit text did.
 */

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const words = (text: string) => text.split(/\s+/).filter(Boolean);

/**
 * A title's words, each rising through its own mask. `from` continues the
 * count across pieces set in another face ("Enter the" + "room."); `cue`
 * makes the words wait for their block's reveal (Reveal.tsx) instead of
 * running on load.
 */
export function Rise({ text, from = 0, cue = false }: { text: string; from?: number; cue?: boolean }) {
  return (
    <>
      {words(text).map((w, k) => (
        <Fragment key={k}>
          {k > 0 && " "}
          <span className={cue ? "cue-word" : "rise"}>
            <span style={{ "--i": from + k } as Vars}>{w}</span>
          </span>
        </Fragment>
      ))}
    </>
  );
}

/**
 * A line pulled into focus word by word, left to right. However long the
 * line, the pull takes the same time: a long intro does not keep the reader
 * waiting on its last word.
 */
export function Focus({ text }: { text: string }) {
  const list = words(text);
  const step = Math.min(0.045, 0.7 / Math.max(1, list.length));
  return (
    <>
      {list.map((w, k) => (
        <Fragment key={k}>
          {k > 0 && " "}
          <span className="focus" style={{ "--i": k, "--step": step.toFixed(3) + "s" } as Vars}>
            {w}
          </span>
        </Fragment>
      ))}
    </>
  );
}

/** When a scene piece starts, in seconds: `style={delay(0.8)}`. */
export const delay = (s: number) => ({ "--at": s + "s" }) as Vars;
