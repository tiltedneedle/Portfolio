/**
 * The reference marks every section with a small uppercase label and a
 * south-east arrow instead of a big heading — the display type is saved for
 * content. Reused across the editorial home page.
 */
export function SectionTag({ children, id }: { children: string; id?: string }) {
  return (
    <h2
      id={id}
      className="eyebrow flex items-center gap-2 text-[13px] font-medium tracking-[0.08em]"
    >
      {children}
      <span aria-hidden="true" className="text-[15px] leading-none">&#8600;</span>
    </h2>
  );
}
