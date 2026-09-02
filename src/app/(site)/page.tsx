import { Statement } from "@/components/editorial/Statement";
import { About } from "@/components/editorial/About";
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

// Editorial single-column flow in the reference's own order: statement, the
// about paragraph, work at length, the service index, then clients and
// results as ruled lists, closing on the one dark slab. Process lives on the
// service pages, not here.
export default function Home() {
  return (
    <>
      <Statement />
      <About />
      <WorkPlates />
      <ServiceIndex />
      <LogoRule />
      <ResultsIndex />
      <WordStrip />
      <ContactForm />
    </>
  );
}
