import type { Metadata } from "next";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Page not found | Tilted Needle",
  robots: { index: false, follow: true },
};

const suggestions = [
  { href: "/services", label: "Services" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/careers", label: "Careers" },
  { href: "/book-demo", label: "Book a Demo" },
];

export default function NotFound() {
  return (
    <>
      <NavBar />
      <main>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black px-6 py-32">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(41,151,255,0.06),transparent_60%)] pointer-events-none" />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />

          <div className="relative mx-auto max-w-[720px] text-center">
            <p className="text-[#2997ff] text-[15px] font-medium mb-4">404</p>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.03em] leading-[1.05] text-[#f5f5f7] mb-6">
              This page went
              <br />
              <span
                className="bg-gradient-to-r from-[#a1a1a6] via-[#f5f5f7] to-[#a1a1a6] bg-clip-text text-transparent animate-gradient-shift"
                style={{ backgroundSize: "200% 100%" }}
              >
                off-script.
              </span>
            </h1>

            <p className="text-[19px] md:text-xl text-[#86868b] leading-relaxed mb-10">
              The link may be old or mistyped. Here&apos;s where to go instead.
            </p>

            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <Link
                href="/"
                className="inline-flex items-center px-7 py-3.5 bg-[#f5f5f7] text-[#1c1c1e] rounded-full text-[15px] font-medium transition-all duration-300 hover:bg-white hover:shadow-[0_0_40px_rgba(255,255,255,0.15)]"
              >
                Back to home
              </Link>
              <Link
                href="/#contact"
                className="inline-flex items-center px-7 py-3.5 text-[#f5f5f7] border border-white/20 rounded-full text-[15px] font-medium transition-all duration-300 hover:border-white/40 hover:bg-white/[0.04]"
              >
                Get in touch
              </Link>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-2 rounded-full bg-white/[0.04] text-[13px] text-[#a1a1a6] hover:bg-white/[0.08] hover:text-[#f5f5f7] transition-colors duration-300"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
