import type { GuideNote } from "@/content/clients/types";
import { Rich } from "@/components/portal/Rich";

/**
 * A note from the studio, for this client, inside a universal guide. The
 * guide says what everyone should do; the note says what that means here.
 */
export function ForYou({ who, notes, under }: { who: string; notes: GuideNote[]; under?: string }) {
  if (!notes.length) return null;
  // A guide can carry several notes; as landmarks they need distinct names.
  const label = "For " + who + (under ? ", under " + under : "");
  return (
    <aside className="border border-[color:var(--rule-strong)] bg-[color:var(--stage-2)] p-6 md:p-8" aria-label={label}>
      <p className="mono flex items-center gap-2 text-[color:var(--ink)]">
        <span className="lamp" aria-hidden="true" />
        For {who}
      </p>
      <div className="mt-4 flex flex-col gap-4">
        {notes.map((n) => (
          <p key={n.text} className="em-serif max-w-[40ch] text-[clamp(19px,2vw,24px)] leading-[1.3] text-[color:var(--ink)]">
            <Rich text={n.text} />
          </p>
        ))}
      </div>
    </aside>
  );
}
