import { changes } from "@/content/system/changes";
import { RecentList } from "@/components/portal/RecentList";
import type { Change } from "@/content/clients/types";
import { mergeChanges } from "@/lib/changes";

const show = 5;

/** The latest additions to the system, so a return visit sees it growing. */
export function RecentChanges({ slug, mine = [], paths }: { slug: string; mine?: Change[]; paths?: Set<string> }) {
  // An addition to a room this client does not have yet is still news; it
  // just has nowhere to send them, so the link comes off.
  const latest = mergeChanges(mine, changes, show).map((c) => (c.href && paths && !paths.has(c.href.split("#")[0]) ? { ...c, href: undefined } : c));
  if (latest.length === 0) return null;
  return (
    <section className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] py-20 md:py-28" aria-label="Recently added">
      <div className="mx-auto max-w-[1600px] px-6 md:px-14">
        <div className="grid gap-10 md:grid-cols-[1fr_minmax(0,64ch)] md:gap-20">
          <div>
            <p className="mono">Recently added</p>
            <h2 className="display mt-3 max-w-[10ch] text-[clamp(36px,4.6vw,72px)]">
              The system <span className="em-serif">keeps growing.</span>
            </h2>
            <p className="mt-4 max-w-[34ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">Permanent access means this: what we learn is added here, for you, as we learn it.</p>
          </div>
          <RecentList slug={slug} items={latest} />
        </div>
      </div>
    </section>
  );
}
