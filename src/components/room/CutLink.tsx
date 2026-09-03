"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ComponentProps, MouseEvent } from "react";
import { useReducedMotion } from "framer-motion";
import { beginCut } from "@/lib/cut";

type Props = ComponentProps<typeof Link>;

/**
 * A next/link that cuts. Plain clicks drop the black frame and push the
 * route; modified clicks (new tab), hash links and external URLs behave like
 * any link. Under reduced motion the cut is skipped: the frame is a motion.
 *
 * A link to the page already showing does not cut either: the pathname would
 * never change, so nothing would lift the frame until the safety timer.
 */
export function CutLink({ href, onClick, ...rest }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const target = typeof href === "string" ? href : (href.pathname ?? "");
  const cuts = target.startsWith("/") && !target.startsWith("/#") && !rest.target;

  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented || !cuts || reduced) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    if (target.split("#")[0] === pathname) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    e.preventDefault();
    beginCut();
    // One frame of black before the route starts changing, so the cut lands
    // on a painted black frame rather than mid-render.
    requestAnimationFrame(() => router.push(target));
  };

  return <Link href={href} onClick={handle} {...rest} />;
}
