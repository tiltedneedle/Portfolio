import { CopyText } from "@/components/portal/CopyText";

/** A one-word copy control for an idea card. */
export function CopyIdea({ text }: { text: string }) {
  return <CopyText text={text} label="Copy" className="slate-link text-[11px]" />;
}
