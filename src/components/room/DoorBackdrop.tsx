import { Still } from "@/components/portal/Still";
import { published } from "@/lib/published";
import { reel } from "@/content/system/reel";

/**
 * Behind the door: the studio's work, out of focus.
 *
 * Two rows of frames drifting in opposite directions, dimmed and blurred
 * well past reading, then buried under a scrim and a vignette. The door is
 * the one page a stranger can reach, so the work gives it depth without
 * telling anyone whose work it is: no names, no counts, nothing legible.
 * Each row is doubled so the drift meets itself; reduced motion holds it.
 */
const FRAMES = 12;

export function DoorBackdrop() {
  // The reel’s stills are files in this repo, so every frame lands. The
  // published index is only a fallback: YouTube answers a dead id with a
  // placeholder the Still component then hides, which would leave holes in
  // a drifting row.
  const local = reel.map((r) => r.thumb);
  const pool = local.length >= 6 ? local : [...local, ...published.filter((p) => p.platform === "youtube_shorts" && p.vertical).map((p) => p.thumb)];
  if (pool.length === 0) return null;
  // The two rows start at different places, so they never travel as a pair.
  const take = (offset: number) => Array.from({ length: FRAMES }, (_, i) => pool[(offset + i) % pool.length]);

  const row = (srcs: string[], drift: string) => (
    <div className={"flex w-max " + drift}>
      {[0, 1].map((copy) => (
        <div key={copy} className="flex shrink-0 gap-4 pr-4">
          {srcs.map((src, i) => (
            <span key={copy + "-" + i} className="well w-[132px] shrink-0 border border-[color:var(--rule)] md:w-[172px]">
              <Still src={src} className="absolute inset-0 h-full w-full object-cover" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 flex flex-col justify-center gap-4 opacity-[0.17] blur-[5px]">
        {row(take(0), "drift")}
        {row(take(4), "drift-back")}
      </div>
      {/* the form reads on the left, so the stage is heaviest there */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--stage)_0%,rgba(11,11,12,0.88)_42%,rgba(11,11,12,0.62)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(130%_95%_at_18%_50%,transparent_0%,rgba(11,11,12,0.5)_68%,var(--stage)_100%)]" />
    </div>
  );
}
