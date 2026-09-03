import { Statement } from "@/components/editorial/Statement";
import { StatementSlab } from "@/components/editorial/StatementSlab";
import { WorkReel } from "@/components/editorial/WorkReel";
import { ServiceIndex } from "@/components/editorial/ServiceIndex";
import { LogoRule } from "@/components/editorial/LogoRule";
import { ResultsIndex } from "@/components/editorial/ResultsIndex";
import { Socials } from "@/components/editorial/Socials";
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
      <StatementSlab />
      <WorkReel />
      <ServiceIndex />
      <LogoRule />
      <ResultsIndex />
      <Socials />
      <ContactForm />
    </>
  );
}
