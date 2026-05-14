"use client";

import * as React from "react";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import { cn } from "@/lib/utils";

/**
 * CSS-3D tilt wrapper for cards. Pure CSS perspective + transform — no
 * WebGL, no R3F. Tracks cursor inside the wrapper and tilts the card
 * toward the cursor with spring-eased motion. On leave, returns to rest.
 *
 * Composes with `<NeonGlowCard>`: place Tilt3D outside, NeonGlowCard inside.
 * The neon border traces the tilted plane correctly because it lives in
 * the same transform context.
 *
 * Auto-disabled on:
 *   - `prefers-reduced-motion: reduce`
 *   - Coarse pointers / touch (`(hover: none), (pointer: coarse)`)
 *
 * Usage:
 *   <Tilt3D>
 *     <NeonGlowCard>
 *       <YourCard />
 *     </NeonGlowCard>
 *   </Tilt3D>
 */

type Props = {
  children: React.ReactNode;
  /** Max tilt in degrees on each axis. Default 5° (subtle). */
  intensity?: number;
  /** Perspective in px. Higher = subtler depth. Default 1000. */
  perspective?: number;
  className?: string;
};

export function Tilt3D({
  children,
  intensity = 5,
  perspective = 1000,
  className,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 22, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 22, mass: 0.5 });

  const rotateX = useTransform(sy, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-intensity, intensity]);

  const [enabled, setEnabled] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqCoarse = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setEnabled(!mqReduced.matches && !mqCoarse.matches);
    update();
    mqReduced.addEventListener("change", update);
    mqCoarse.addEventListener("change", update);
    return () => {
      mqReduced.removeEventListener("change", update);
      mqCoarse.removeEventListener("change", update);
    };
  }, []);

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enabled || !wrapRef.current) return;
    const r = wrapRef.current.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      ref={wrapRef}
      className={cn("relative", className)}
      style={{ perspective: `${perspective}px` }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <motion.div
        style={{
          rotateX: enabled ? rotateX : 0,
          rotateY: enabled ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full will-change-transform"
      >
        {children}
      </motion.div>
    </div>
  );
}
