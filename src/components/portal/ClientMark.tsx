import Image from "next/image";
import { client, clientMonogram } from "@/content/client/client";

/**
 * The lockup: the Tilted Needle mark, a serif ×, and the client's mark. Until
 * a logo is supplied the client's mark is a monogram in a hairline square,
 * which is a design in its own right rather than a hole where one should be.
 */
export function ClientMark({ size = 56, className = "" }: { size?: number; className?: string }) {
  const box = size;
  return (
    <span className={"inline-flex items-center gap-[0.35em] " + className} style={{ fontSize: size * 0.5 }} role="img" aria-label={"Tilted Needle and " + client.name}>
      <Image src="/white-logo.png" alt="" width={box} height={box} className="object-contain" style={{ width: box, height: box }} />
      <span className="em-serif text-[color:var(--ink-mid)]" aria-hidden="true">
        &times;
      </span>
      {client.logo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={client.logo} alt="" style={{ height: box, width: "auto", maxWidth: box * 3 }} className="object-contain" />
      ) : (
        <span
          className="display inline-flex items-center justify-center border border-[color:var(--rule-strong)] text-[color:var(--ink)]"
          style={{ width: box, height: box, fontSize: box * 0.42, letterSpacing: "0.02em" }}
          aria-hidden="true"
        >
          {clientMonogram()}
        </span>
      )}
    </span>
  );
}
