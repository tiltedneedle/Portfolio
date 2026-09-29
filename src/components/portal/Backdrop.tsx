import { published } from "@/lib/published";
import { reel } from "@/content/system/reel";
import { Still } from "@/components/portal/Still";
import { Scrub } from "@/components/portal/HeroMotion";

/**
 * Behind the home hero: a row of stills from the studio's work, the
 * showreel's films interleaved with published Shorts, drifting slowly
 * behind the name. The system is built from that work, so it stands behind
 * the name. Two copies of the row make the drift seamless; reduced motion
 * holds it still.
 *
 * How bright it can be is a contrast sum, not a taste call. The name is
 * --ink at display size and needs 3:1; a pure-white frame at 0.5 over the
 * stage still gives it 3.21:1, so 0.5 is the ceiling for the band, and it
 * is what the band now runs at across its middle. (It used to run at 0.45
 * under a 0.5 scrim and a side ramp that was only clear at the dead centre:
 * 3-22% across the name, which read as murk rather than film.)
 *
 * The band is centred on the NAME, not on the section: the caller puts it
 * inside the name's own box, and the frames are sized in em from the name's
 * font size (a well is 0.9em wide, so the band is about as tall as two
 * lines of the name). Centred on the section it drifted onto the tagline
 * and the lead on some screens, and the brief's tagline carries a red word
 * that has no contrast to spare over a picture. It also dissolves downward
 * (.hero-band), gone by its own lower edge.
 *
 * And it is film: the frames sit on a film base with a row of sprocket
 * holes along each edge, four to a frame, lit from behind the way a gate
 * lights them. The holes sit above the name's capitals and below its
 * baseline, never behind a stroke. On load the strip threads in from the
 * right and settles into its drift (.band-in).
 */
export function Backdrop({ className = "" }: { className?: string }) {
  const own = reel.map((r) => ({ id: r.id, thumb: r.thumb }));
  const rest = published.filter((p) => p.platform === "youtube_shorts" && p.vertical).map((p) => ({ id: p.id, thumb: p.thumb }));
  // Step through the Shorts so neighbouring stills come from different posts,
  // then interleave them with the reel so the row never runs one client.
  const need = Math.max(0, 16 - own.length);
  const step = Math.max(1, Math.floor(rest.length / Math.max(1, need)));
  const fill = Array.from({ length: need }, (_, i) => rest[(i * step) % Math.max(1, rest.length)]).filter(Boolean);
  const stills: { id: string; thumb: string }[] = [];
  for (let i = 0; i < Math.max(own.length, fill.length); i++) {
    if (own[i]) stills.push(own[i]);
    if (fill[i]) stills.push(fill[i]);
  }
  stills.splice(16);
  if (!stills.length) return null;
  const row = (key: string, hidden: boolean) => (
    <div key={key} className="flex shrink-0" aria-hidden={hidden || undefined}>
      {stills.map((s, i) => (
        <span key={s.id + i} className="film-frame">
          <span className="well block w-[max(0.9em,64px)]">
            <Still src={s.thumb} sizes="(min-width:1680px) 152px, (min-width:712px) 9vw, 64px" className="object-cover" />
          </span>
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className={"pointer-events-none absolute " + className}>
      {/* The band carries the fade and the pull focus; the row moves inside
          it, drifting and scrubbed by the scroll (HeroMotion's Scrub), so the
          fade stays where the type is instead of travelling with the frames. */}
      <Scrub>
        {row("a", false)}
        {row("b", true)}
      </Scrub>
      <div className="hero-vignette absolute inset-0" />
    </div>
  );
}
