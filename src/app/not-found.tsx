import Link from "next/link";
import { CutLink } from "@/components/room/CutLink";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center bg-[color:var(--stage)]">
      <div className="mx-auto w-full max-w-[1600px] px-6 py-32 md:px-14">
        <p className="mono mb-8">
          404 <span className="text-[color:var(--ink-faint)]">/</span> Missing reel
        </p>
        <h1 className="display max-w-[10ch] text-[clamp(64px,11vw,176px)]">
          Nothing on this <span className="em-serif">slate.</span>
        </h1>
        <p className="mt-8 max-w-[44ch] text-[17px] leading-relaxed text-[color:var(--ink-mid)]">
          The link may be old or mistyped. Here is where to go instead.
        </p>
        <div className="mt-10 flex items-center gap-8">
          <CutLink href="/" className="pill pill-solid px-7 py-3 text-[15px]">
            Back to the reel
          </CutLink>
          <Link href="/#contact" className="slate-link text-[13px]">
            Get in touch &#8599;
          </Link>
        </div>
      </div>
    </main>
  );
}
