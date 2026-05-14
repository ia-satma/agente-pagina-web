"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Multiplier — 0 disables, 1 is 1:1 with mouse. Default 0.25. */
  strength?: number;
  /** Activation radius in px around the element center. */
  radius?: number;
};

/**
 * Adds a subtle magnetic pull toward the cursor. The element drifts in the
 * direction of the mouse when it gets within `radius` px of the center.
 *
 * Wraps an `<span>`, so safe to put around buttons/links without affecting
 * layout. Uses transform on a child wrapper to avoid clipping focus rings.
 */
export function Magnetic({
  children,
  className,
  strength = 0.25,
  radius = 120,
}: Props) {
  const wrapRef = React.useRef<HTMLSpanElement>(null);
  const innerRef = React.useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();

  const onMove = React.useCallback<React.MouseEventHandler<HTMLSpanElement>>(
    (e) => {
      if (reduce) return;
      const wrap = wrapRef.current;
      const inner = innerRef.current;
      if (!wrap || !inner) return;
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist > radius) {
        inner.style.transform = "translate3d(0, 0, 0)";
        return;
      }
      const factor = (1 - dist / radius) * strength;
      inner.style.transform = `translate3d(${dx * factor}px, ${dy * factor}px, 0)`;
    },
    [reduce, radius, strength],
  );

  const onLeave = React.useCallback(() => {
    if (innerRef.current) innerRef.current.style.transform = "translate3d(0, 0, 0)";
  }, []);

  return (
    <span
      ref={wrapRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={cn("inline-block", className)}
    >
      <span
        ref={innerRef}
        className="inline-block transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
      >
        {children}
      </span>
    </span>
  );
}
