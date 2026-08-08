import { Hero } from "@/components/home/Hero";
import { BrandsMarquee } from "@/components/home/BrandsMarquee";
import { ServicesShowcase } from "@/components/home/ServicesShowcase";
import { ProcessTimeline } from "@/components/home/ProcessTimeline";
import { CaseStudyCards } from "@/components/home/CaseStudyCards";
import { PortfolioLibrary } from "@/components/home/PortfolioLibrary";
import { ContactForm } from "@/components/home/ContactForm";
import { caseStudies } from "@/lib/case-studies-data";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <Hero />
      <BrandsMarquee />
      <ServicesShowcase />
      <ProcessTimeline />
      <CaseStudyCards caseStudies={caseStudies} />
      <PortfolioLibrary />
      <ContactForm />
    </>
  );
}
