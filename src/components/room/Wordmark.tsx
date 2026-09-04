import Image from "next/image";

/**
 * The animated wordmark. Every few seconds a stitch runs through the name:
 * letter by letter, each glyph tips into a tilted needle stroke and settles
 * back, left to right, while the figure leans into the run. It is the mark's
 * own idea (a tilted needle) rather than a borrowed one, and it is pure CSS,
 * so it stays crisp at any size and freezes under reduced motion.
 *
 * Accessible name is the plain text; the per-letter spans are decoration.
 */
const NAME = "TILTED NEEDLE";

export function Wordmark({ size = 15, mark = 22 }: { size?: number; mark?: number }) {
  const letters = NAME.split("");
  return (
    <span className="wm inline-flex items-center gap-3" role="img" aria-label="Tilted Needle">
      <Image src="/white-logo.png" alt="" width={mark} height={mark} className="wm-mark object-contain" />
      <span aria-hidden="true" className="wm-text display font-bold tracking-[0.08em] text-[color:var(--ink)]" style={{ fontSize: size }}>
        {letters.map((ch, i) => (
          <span key={i} className="wm-l" style={{ ["--i" as string]: i }}>
            {ch === " " ? (
              <span className="inline-block w-[0.35em]" />
            ) : (
              <>
                <span className="wm-a">{ch}</span>
                <span className="wm-b">/</span>
              </>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}
