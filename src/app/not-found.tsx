import Link from "next/link";

export default function NotFound() {
  return (
    <main className="bg-[var(--paper)] min-h-screen flex items-center">
      <div className="mx-auto w-full max-w-[1600px] px-6 md:px-[60px] py-32">
        <p className="eyebrow mb-8">404</p>
        <h1 className="font-thin text-[color:var(--ink)] leading-[1.14] text-[12vw] sm:text-[56px] md:text-[80px] max-w-[14ch]">
          This page went <span className="em-serif">missing</span>.
        </h1>
        <p className="mt-8 text-[17px] text-[color:var(--ink-mid)] max-w-[44ch] leading-relaxed">
          The link may be old or mistyped. Here&apos;s where to go instead.
        </p>
        <div className="mt-10 flex items-center gap-6">
          <Link href="/" className="pill pill-solid px-7 py-3 text-[15px]">
            Back to home
          </Link>
          <Link href="/#contact" className="underline-draw text-[15px] text-[color:var(--ink)]">
            get in touch <span aria-hidden="true">&#8600;</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
