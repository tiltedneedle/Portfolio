import { published } from "@/lib/published";
import { Still } from "@/components/portal/Still";

/**
 * Behind the home hero: a row of stills from the studio's published work,
 * drifting slowly, dimmed to a texture. The system is built from that work,
 * so it stands behind the name. Two copies of the row make the drift
 * seamless; reduced motion holds it still.
 */
export function Backdrop() {
  const pool = published.filter((p) => p.platform === "youtube_shorts" && p.vertical);
  // Step through the pool so neighbouring stills come from different posts.
  const step = Math.max(1, Math.floor(pool.length / 16));
  const stills = Array.from({ length: 16 }, (_, i) => pool[(i * step) % pool.length]).filter(Boolean);
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
      <div className="drift absolute left-0 top-1/2 flex w-max -translate-y-1/2 opacity-[0.14]">
        {row("a", false)}
        {row("b", true)}
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[rgba(11,11,12,0.7)] via-[rgba(11,11,12,0.35)] to-[color:var(--stage)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[color:var(--stage)] via-transparent to-[color:var(--stage)]" />
    </div>
  );
}
