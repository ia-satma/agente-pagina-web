"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLDivElement> & {
  children: React.ReactNode;
};

/**
 * Card whose border glows with a periwinkle/lilac gradient that follows the
 * cursor. Brand-anchored — never rotates into rainbow territory.
 *
 * The visual is implemented via CSS in `globals.css` (`[data-brand-glow]`).
 * This component only:
 *   1. Renders the wrapper with `data-brand-glow`
 *   2. Updates `--x` / `--y` / `--xp` / `--yp` CSS vars on each pointermove
 *   3. Bails out cleanly on coarse-pointer / reduced-motion devices
 */
export function BrandGlowCard({ children, className, style, ...rest }: Props) {
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const el = ref.current;
    if (!el) return;

    let raf = 0;
    let pendingX = 0;
    let pendingY = 0;
    let dirty = false;

    const flush = () => {
      // Coordinates MUST be viewport-relative because the CSS uses
      // `background-attachment: fixed` — the radial-gradient anchors to the
      // viewport, not the element. The mask-composite intersection clips
      // the gradient to the card's border outline.
      el.style.setProperty("--x", pendingX.toFixed(1));
      el.style.setProperty("--y", pendingY.toFixed(1));
      el.style.setProperty(
        "--xp",
        Math.max(0, Math.min(1, pendingX / window.innerWidth)).toFixed(3),
      );
      el.style.setProperty(
        "--yp",
        Math.max(0, Math.min(1, pendingY / window.innerHeight)).toFixed(3),
      );
      dirty = false;
    };

    const onMove = (e: PointerEvent) => {
      pendingX = e.clientX;
      pendingY = e.clientY;
      if (!dirty) {
        dirty = true;
        raf = requestAnimationFrame(flush);
      }
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      data-brand-glow
      className={cn("rounded-2xl", className)}
      style={style}
      {...rest}
    >
      {children}
    </div>
  );
}
