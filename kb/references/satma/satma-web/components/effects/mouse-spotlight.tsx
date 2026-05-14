"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

const SIZE = 520;
const HALF = SIZE / 2;

/**
 * Soft brand-tinted spotlight that follows the cursor across the entire viewport.
 * Uses a smooth lerp for cinematic motion, runs in a single requestAnimationFrame loop,
 * and respects prefers-reduced-motion (renders nothing).
 *
 * Drop once near the top of the layout. It's `pointer-events: none`,
 * fixed-positioned and doesn't intercept any clicks.
 */
export function MouseSpotlight() {
  const blobRef = React.useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    if (reduce) return;
    const blob = blobRef.current;
    if (!blob) return;

    // Skip touch-only / coarse pointer devices
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    let visible = false;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
      if (!visible) {
        blob.style.opacity = "1";
        visible = true;
      }
    };

    const onLeave = () => {
      blob.style.opacity = "0";
      visible = false;
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      blob.style.transform = `translate3d(${currentX - HALF}px, ${currentY - HALF}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseleave", onLeave);
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, [reduce]);

  if (reduce) return null;

  return (
    <div
      ref={blobRef}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-0 rounded-full opacity-0 transition-opacity duration-300 will-change-transform"
      style={{
        width: SIZE,
        height: SIZE,
        // Both `--glow-rgb` and `--spotlight-alpha-*` swap per theme so the
        // spotlight stays visible against the active background WITHOUT
        // tinting card backgrounds enough to hurt text contrast.
        // - Dark: alphas 0.24 / 0.08 (more present, brightens dark surface)
        // - Light: alphas 0.10 / 0.03 (whisper-soft, never pulls down text contrast)
        background:
          "radial-gradient(circle at center, rgba(var(--glow-rgb), var(--spotlight-alpha-inner)), rgba(var(--glow-rgb), var(--spotlight-alpha-outer)) 40%, transparent 70%)",
      }}
    />
  );
}
