import type { Metadata } from "next";
import { LegalPage } from "@/components/LegalPage";
import { termsLastUpdated, termsSections } from "@/lib/legal-data";

export const metadata: Metadata = {
  title: "Terms of Service | Tilted Needle",
  alternates: { canonical: "/terms" },
  description:
    "The terms and conditions governing your use of the Tilted Needle website and our social media production and marketing services.",
};

export default function Terms() {
  return (
    <LegalPage
      title="Terms of Service"
      lastUpdated={termsLastUpdated}
      sections={termsSections}
    />
  );
}
