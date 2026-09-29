import { CutLink } from "@/components/room/CutLink";
import { Rise, delay } from "@/components/portal/Scene";
import { HeroDust } from "@/components/portal/HeroDust";

/**
 * A page that is not there. Said in the suite's own terms: the reel is
 * missing, and the monitor it should be playing on shows what a monitor
 * shows with nothing on its input -- colour bars, NO SIGNAL, and now and
 * then the picture losing its vertical hold. The only colour on the site
 * outside the tally, and it belongs here: it is the one screen where
 * nothing is playing.
 */
export default function NotFound() {
  return (
    <main className="relative flex min-h-screen items-center overflow-hidden bg-[color:var(--stage)]">
      {/* The projector still running, its beam and its dust, with no reel on it. */}
      <HeroDust />
      <div className="relative mx-auto grid w-full max-w-[1600px] items-center gap-14 px-6 py-32 md:grid-cols-[minmax(0,1fr)_auto] md:gap-16 md:px-14">
        <div className="min-w-0">
          <p className="mono scene-slate mb-8">
            404 <span className="text-[color:var(--ink-mid)]">/</span> Missing reel
          </p>
          <h1 className="display max-w-[10ch] text-[clamp(64px,11vw,176px)]">
            <Rise text="Nothing on this" />{" "}
            <span className="em-serif">
              <Rise text="slate." from={3} />
            </span>
          </h1>
          <p className="scene-up mt-8 max-w-[44ch] text-[17px] leading-relaxed text-[color:var(--ink-mid)]" style={delay(0.7)}>
            The link may be old or mistyped. The system starts at home.
          </p>
          <div className="scene-up mt-10" style={delay(0.85)}>
            <CutLink href="/" className="pill pill-solid px-7 py-3 text-[15px]">
              Back to the system
            </CutLink>
          </div>
        </div>

        <div aria-hidden="true" className="hidden w-[min(32vw,440px)] md:block">
          <p className="mono scene-up flex items-center justify-between" style={delay(0.4)}>
            <span className="flex items-center gap-2 text-[color:var(--ink)]">
              <span className="lamp lamp-live" />
              Input 1
            </span>
            <span className="text-[color:var(--ink-mid)]">00:00:00:00</span>
          </p>
          <div className="monitor-on relative mt-3 aspect-[4/3] overflow-hidden border border-[color:var(--rule-strong)] bg-black" style={delay(0.55)}>
            <div className="bars absolute inset-0" />
            <span className="scan pointer-events-none absolute inset-0" />
            <span className="mono absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 whitespace-nowrap bg-black px-3 py-2 text-[color:var(--ink)]">No signal</span>
          </div>
        </div>
      </div>
    </main>
  );
}
