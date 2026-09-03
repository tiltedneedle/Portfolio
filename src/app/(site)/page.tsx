import type { Metadata } from "next";
import { Slate } from "@/components/room/Slate";
import { ColdOpen } from "@/components/room/ColdOpen";
import { Sequence } from "@/components/room/Sequence";
import { TitleCard } from "@/components/room/TitleCard";
import { CreditsRoll } from "@/components/room/CreditsRoll";
import { ResultsSlate } from "@/components/room/ResultsSlate";
import { EndSlate } from "@/components/room/EndSlate";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// The reel, in running order: slate (once), cold open, the sequence of six
// films, the studio as a title card, the clients as credits, the results as
// slate lines, and contact as the end slate. The footer is the tail leader.
export default function Home() {
  return (
    <>
      <Slate />
      <ColdOpen />
      <Sequence />
      <TitleCard />
      <CreditsRoll />
      <ResultsSlate />
      <EndSlate />
    </>
  );
}
