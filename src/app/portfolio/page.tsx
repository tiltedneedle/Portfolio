import type { Metadata } from "next";
import { PortfolioBoard } from "@/components/PortfolioBoard";

// Title intentionally inherits the root default, matching the original.
export const metadata: Metadata = {
  alternates: { canonical: "/portfolio" },
};

export default function Portfolio() {
  return <PortfolioBoard />;
}
