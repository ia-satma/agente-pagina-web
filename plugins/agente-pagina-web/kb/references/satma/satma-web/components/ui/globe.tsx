"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  meridians?: number;
  parallels?: number;
  strokeWidth?: number;
  /** Seconds per full revolution. Default 140s. */
  speedSec?: number;
  /** Rotation direction. 1 = forward (W→E), -1 = reverse. */
  direction?: 1 | -1;
};

/**
 * Wireframe globe — looks like a real 3D sphere rotating on its Y axis.
 *
 * Rotation is faked using SVG math (no WebGL):
 *   - The outer silhouette circle stays fixed (a rotating sphere's outline
 *     doesn't change).
 *   - Each meridian is a vertical ellipse. Its visible horizontal radius is
 *     `R · |cos(α + θ)|` — wide when the meridian is on the front of the
 *     sphere, narrow when it's edge-on, wide again on the back.
 *   - We update each `<ellipse rx>` per frame via requestAnimationFrame so
 *     the meridians morph instead of the whole SVG spinning like a paper
 *     disc. The result reads as a true 3D rotating wireframe.
 *   - Parallels (latitude rings) stay fixed since Y-axis rotation doesn't
 *     change them.
 *
 * Respects `prefers-reduced-motion: reduce` (renders the still version).
 */
export function Globe({
  className,
  meridians = 11,
  parallels = 11,
  strokeWidth = 0.4,
  speedSec = 140,
  direction = 1,
}: Props) {
  const r = 100;
  const ellipseRefs = useRef<Array<SVGEllipseElement | null>>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let last = performance.now();
    let theta = 0;
    const speedRad = (Math.PI * 2) / speedSec; // rad per second

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000); // clamp to 50ms
      last = now;
      theta += speedRad * direction * dt;

      for (let i = 0; i < meridians; i++) {
        const el = ellipseRefs.current[i];
        if (!el) continue;
        const baseAngle = (i / Math.max(1, meridians - 1)) * Math.PI;
        const effective = baseAngle + theta;
        const rx = Math.abs(Math.cos(effective)) * r;
        if (rx < 0.4) {
          // edge-on — hide so we don't render zero-width lines
          el.style.opacity = "0";
        } else {
          el.style.opacity = "1";
          el.setAttribute("rx", rx.toFixed(2));
        }
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      if (raf) cancelAnimationFrame(raf);
    };
  }, [meridians, speedSec, direction]);

  // Initial render — distribute meridians evenly (matches the SSR snapshot
  // and the no-JS / reduced-motion fallback).
  const meridianEls = Array.from({ length: meridians }, (_, i) => {
    const angle = (i / Math.max(1, meridians - 1)) * Math.PI;
    const rx = Math.abs(Math.cos(angle)) * r;
    return (
      <ellipse
        key={`m${i}`}
        ref={(el) => {
          ellipseRefs.current[i] = el;
        }}
        cx="0"
        cy="0"
        rx={rx.toFixed(2)}
        ry={r}
      />
    );
  });

  const parallelEls = Array.from({ length: parallels }, (_, i) => {
    const t = i / Math.max(1, parallels - 1);
    const angle = (t - 0.5) * Math.PI;
    const y = Math.sin(angle) * r;
    const rx = Math.cos(angle) * r;
    if (rx < 0.1) return null;
    return (
      <ellipse
        key={`p${i}`}
        cx="0"
        cy={y}
        rx={rx}
        ry={Math.max(rx * 0.04, 0.4)}
      />
    );
  });

  return (
    <svg
      viewBox={`-${r + 4} -${r + 4} ${(r + 4) * 2} ${(r + 4) * 2}`}
      className={cn("text-periwinkle/35", className)}
      aria-hidden="true"
    >
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
        {/* Silhouette — never moves; it's the projected outline of the sphere. */}
        <circle cx="0" cy="0" r={r} strokeWidth={strokeWidth * 1.4} />
        {/* Meridians — rx animated per frame to simulate rotation. */}
        {meridianEls}
        {/* Parallels — static (Y-axis rotation doesn't move them). */}
        {parallelEls}
      </g>
    </svg>
  );
}
