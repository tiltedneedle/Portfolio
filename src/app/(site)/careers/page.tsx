import type { Metadata } from "next";
import { CareersPage } from "@/components/CareersPage";

export const metadata: Metadata = {
  title: "Careers | Tilted Needle",
  alternates: { canonical: "/careers" },
  description:
    "Join the team behind the views. Tilted Needle is a social-media production company in London and Dubai working with world-class brands and creators. Explore open roles and apply.",
};

export default function Careers() {
  return <CareersPage />;
}
