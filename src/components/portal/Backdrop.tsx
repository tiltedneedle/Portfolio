import { published } from "@/lib/published";
import { reel } from "@/content/system/reel";
import { Still } from "@/components/portal/Still";

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
 * The kicker and the lead sit just under the band and are small text, so
 * they need 4.5:1 and cannot have a frame at 0.5 behind them. The band
 * therefore dissolves downward (.hero-band): full strength through its
 * middle, gone by its lower edge, wherever a given screen puts that edge.
 */
export function Backdrop() {
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
    <div key={key} className="flex shrink-0 gap-3 pr-3" aria-hidden={hidden || undefined}>
      {stills.map((s, i) => (
        <span key={s.id + i} className="well w-[120px] border border-[color:var(--rule)] md:w-[150px]">
          <Still src={s.thumb} sizes="(min-width:768px) 150px, 120px" className="object-cover" />
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* The band holds still and carries the fade; the row moves inside it,
          so the fade stays where the type is instead of travelling with the
          frames. */}
      <div className="hero-band absolute inset-x-0 top-1/2 -translate-y-1/2">
        <div className="drift flex w-max opacity-50">
          {row("a", false)}
          {row("b", true)}
        </div>
      </div>
      <div className="hero-vignette absolute inset-0" />
    </div>
  );
}
