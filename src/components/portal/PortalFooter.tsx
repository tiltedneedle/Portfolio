"use client";

import { useEffect, useState } from "react";
import { CutLink } from "@/components/room/CutLink";
import { WordStrip } from "@/components/editorial/WordStrip";
import { ClientMark } from "@/components/portal/ClientMark";
import { chapters } from "@/content/chapters";
import { client, clientShort } from "@/content/client/client";

// Frozen at build time; the effect corrects it if the visitor's year differs.
const BUILD_YEAR = new Date().getFullYear();

const heading = "mono mb-5 block";
const link = "underline-draw w-fit text-[15px] text-[color:var(--ink-soft)] transition-colors duration-300 hover:text-[color:var(--ink)]";

/** The tail leader: the approach as a crawl, then the contents once more. */
export function PortalFooter() {
  const [year, setYear] = useState(BUILD_YEAR);
  useEffect(() => {
    const current = new Date().getFullYear();
    if (current !== BUILD_YEAR) setYear(current);
  }, []);

  return (
    <footer className="border-t border-[color:var(--rule)] bg-[color:var(--stage)] text-[color:var(--ink-soft)]">
      <WordStrip words="research. create. publish. analyse. improve. repeat. " />
      <div className="mx-auto max-w-[1600px] px-6 py-16 md:px-14 md:py-20">
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <ClientMark size={28} />
            <p className="mt-6 max-w-[36ch] text-[15px] leading-relaxed text-[color:var(--ink-mid)]">
              Your complete viral content system. Built once, personalised for {clientShort()}, and yours to keep.
            </p>
            <p className="mono mt-6">
              Permanent access <span className="text-[color:var(--ink-faint)]">/</span> Reel {client.since}
            </p>
          </div>

          <div className="md:col-span-4 md:col-start-7">
            <p className={heading}>The system</p>
            <nav className="flex flex-col gap-3" aria-label="Footer">
              {chapters.map((c) => (
                <CutLink key={c.id} href={c.href} className={link}>
                  <span className="mono mr-3 text-[color:var(--ink-faint)]">{c.n}</span>
                  {c.title}
                </CutLink>
              ))}
            </nav>
          </div>

          <div className="md:col-span-3">
            <p className={heading}>Your team</p>
            <div className="flex flex-col gap-3">
              <a href={"mailto:" + client.contact} className={link}>
                {client.contact}
              </a>
              <p className="text-[13px] leading-relaxed text-[color:var(--ink-mid)]">
                Questions about any part of the system, or a video you want a second pair of eyes on: message your Tilted Needle team.
              </p>
            </div>
          </div>
        </div>

        <div className="mono mt-16 flex flex-col justify-between gap-4 border-t border-[color:var(--rule)] pt-6 md:mt-20 md:flex-row md:items-baseline">
          <p>
            &copy; {year} Tilted Needle <span className="text-[color:var(--ink-faint)]">/</span> Private, for {client.name}
          </p>
          <p className="text-[color:var(--ink-faint)]">Not for distribution</p>
        </div>
      </div>
    </footer>
  );
}
