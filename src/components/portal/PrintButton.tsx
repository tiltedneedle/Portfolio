"use client";

/** Prints the page. The print stylesheet keeps only the script itself. */
export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="slate-link text-[13px]" data-cursor="Print">
      Print
    </button>
  );
}
