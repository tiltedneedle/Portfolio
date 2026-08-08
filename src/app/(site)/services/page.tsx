import type { Metadata } from "next";
import { ServicesOverview } from "@/components/ServicesOverview";

export const metadata: Metadata = {
  title: "Services | Tilted Needle",
  alternates: { canonical: "/services" },
  description:
    "Content creation, influencer marketing, paid advertising & performance, and app & web development. Four core capabilities, one integrated growth engine.",
};

export default function Services() {
  return <ServicesOverview />;
}
