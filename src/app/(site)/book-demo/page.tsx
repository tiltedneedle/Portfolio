import type { Metadata } from "next";
import Script from "next/script";
import { BookDemoPage } from "@/components/BookDemoPage";

export const metadata: Metadata = {
  title: "Book a Demo | Tilted Needle",
  alternates: { canonical: "/book-demo" },
  description:
    "Schedule a free strategy session with our team. Discover how we can help your brand grow, 2B+ organic views and $250M+ revenue generated for clients.",
};

export default function BookDemo() {
  return (
    <>
      <BookDemoPage />
      <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
    </>
  );
}
