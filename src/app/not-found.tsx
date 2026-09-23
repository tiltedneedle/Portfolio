import { CutLink } from "@/components/room/CutLink";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-[color:var(--stage)]">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-32 md:px-14">
        <p className="mono mb-8">
          404 <span className="text-[color:var(--ink-mid)]">/</span> Missing reel
        </p>
        <h1 className="display max-w-[10ch] text-[clamp(64px,11vw,176px)]">
          Nothing on this <span className="em-serif">slate.</span>
        </h1>
        <p className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-[color:var(--ink-mid)]">
          The link may be old or mistyped. The system starts at home.
        </p>
        <div className="mt-10">
          <CutLink href="/" className="pill pill-solid px-7 py-3 text-[15px]">
            Back to the system
          </CutLink>
        </div>
      </div>
    </main>
  );
}
