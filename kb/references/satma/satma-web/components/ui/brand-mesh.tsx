"use client";

import * as React from "react";
import { useId } from "react";
import { cn } from "@/lib/utils";

/**
 * SVG-based geometric mesh — a brand decorative pattern that fills its
 * container. Cleaner alternative to the wireframe globe for sections where
 * the orbital motif feels heavy (CTA blocks, footer chrome).
 *
 * Five variants:
 *   - `grid`     →  clean architectural square grid (lines on every cell)
 *   - `grid-dot` →  square grid + dot at every intersection (dense, tech)
 *   - `dots`     →  dot grid only (light, breathable)
 *   - `diagonal` →  45° diagonal cross-hatch (energetic)
 *   - `topo`     →  topographic wave lines (organic, terrain-like)
 *
 * All variants use `currentColor`, so set the tint via `text-*` className.
 * Apply opacity / blend via the parent's `style` or extra className.
 */

type Variant = "grid" | "grid-dot" | "dots" | "diagonal" | "topo";

type Props = {
  variant?: Variant;
  /** Cell size in px. Default 40. */
  cell?: number;
  /** Line stroke width in px. Default 0.5. */
  strokeWidth?: number;
  className?: string;
};

export function BrandMesh({
  variant = "grid",
  cell = 40,
  strokeWidth = 0.5,
  className,
}: Props) {
  const rawId = useId();
  const id = `brandmesh-${rawId.replace(/[^a-z0-9]/gi, "")}`;

  return (
    <svg
      className={cn("h-full w-full", className)}
      aria-hidden
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={id}
          width={cell}
          height={cell}
          patternUnits="userSpaceOnUse"
        >
          {variant === "grid" && (
            <path
              d={`M ${cell} 0 L 0 0 0 ${cell}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={strokeWidth}
            />
          )}

          {variant === "grid-dot" && (
            <>
              <path
                d={`M ${cell} 0 L 0 0 0 ${cell}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
              />
              <circle cx={0} cy={0} r={1.4} fill="currentColor" />
            </>
          )}

          {variant === "dots" && (
            <circle
              cx={cell / 2}
              cy={cell / 2}
              r={1.2}
              fill="currentColor"
            />
          )}

          {variant === "diagonal" && (
            <>
              <line
                x1={0}
                y1={cell}
                x2={cell}
                y2={0}
                stroke="currentColor"
                strokeWidth={strokeWidth}
              />
              <line
                x1={0}
                y1={0}
                x2={cell}
                y2={cell}
                stroke="currentColor"
                strokeWidth={strokeWidth * 0.6}
              />
            </>
          )}

          {variant === "topo" && (
            <>
              <path
                d={`M 0 ${cell * 0.75} Q ${cell * 0.25} ${cell * 0.55} ${cell * 0.5} ${cell * 0.75} T ${cell} ${cell * 0.75}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
              />
              <path
                d={`M 0 ${cell * 0.35} Q ${cell * 0.25} ${cell * 0.15} ${cell * 0.5} ${cell * 0.35} T ${cell} ${cell * 0.35}`}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth * 0.7}
                opacity={0.7}
              />
            </>
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
