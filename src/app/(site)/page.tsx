import { Statement } from "@/components/editorial/Statement";
import { WorkPlates } from "@/components/editorial/WorkPlates";
import { ServiceIndex } from "@/components/editorial/ServiceIndex";
import { LogoRule } from "@/components/editorial/LogoRule";
import { ResultsIndex } from "@/components/editorial/ResultsIndex";
import { WordStrip } from "@/components/editorial/WordStrip";
import { ContactForm } from "@/components/home/ContactForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Editorial single-column flow in the manner of the reference: a statement
// hero, then arrow-tagged sections — work first, at length — closing on the
// one dark slab. Process lives on the service pages, not here.
export default function Home() {
  return (
    <>
      <Statement />
      <LogoRule />
      <WorkPlates />
      <ServiceIndex />
      <ResultsIndex />
      <WordStrip />
      <ContactForm />
    </>
  );
}
