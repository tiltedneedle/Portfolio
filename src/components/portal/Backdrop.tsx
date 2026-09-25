import { published } from "@/lib/published";
import { reel } from "@/content/system/reel";
import { Still } from "@/components/portal/Still";

/**
 * Behind the home hero: a row of stills from the studio's work, the
 * showreel's films interleaved with published Shorts, drifting slowly,
 * dimmed to a texture. The system is built from that work, so it stands
 * behind the name. Two copies of the row make the drift seamless; reduced
 * motion holds it still.
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
          <Still src={s.thumb} className="absolute inset-0 h-full w-full object-cover" />
        </span>
      ))}
    </div>
  );
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="drift absolute left-0 top-1/2 flex w-max -translate-y-1/2 opacity-[0.45]">
        {row("a", false)}
        {row("b", true)}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,11,12,0.72)] via-[rgba(11,11,12,0.5)] to-[color:var(--stage)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--stage)] via-transparent to-[color:var(--stage)]" />
    </div>
  );
}
