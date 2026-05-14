"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Radius of the inner glow in px. */
  size?: number;
  /** Glow tone — `glow` (default) follows the theme via CSS variable. */
  tone?: "glow" | "periwinkle" | "lilac" | "mist";
};

const TONE_RGB: Record<NonNullable<Props["tone"]>, string> = {
  glow: "var(--glow-rgb)",
  periwinkle: "179, 203, 255",
  lilac: "224, 216, 240",
  mist: "221, 228, 244",
};

/**
 * Wraps a card so an internal spotlight follows the cursor while hovering.
 * Same effect Linear / Vercel / Stripe use on their feature cards.
 *
 * The wrapper itself adds `relative overflow-hidden` and a `group` class — so
 * the consumer doesn't need to manage them.
 */
export function CardGlow({
  children,
  className,
  size = 380,
  tone = "glow",
}: Props) {
  const ref = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const onMove = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(
    (e) => {
      if (reduce) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      el.style.setProperty("--gx", `${e.clientX - rect.left}px`);
      el.style.setProperty("--gy", `${e.clientY - rect.top}px`);
    },
    [reduce],
  );

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn("group relative overflow-hidden", className)}
      style={
        {
          "--gx": "50%",
          "--gy": "50%",
        } as React.CSSProperties
      }
    >
      {!reduce && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(${size}px circle at var(--gx) var(--gy), rgba(${TONE_RGB[tone]}, 0.22), transparent 60%)`,
          }}
        />
      )}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </div>
  );
}
