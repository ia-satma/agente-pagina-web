"use client";

import * as React from "react";
import { useRef, useSyncExternalStore } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Drop-in parallax wrapper. Translates child content vertically based on
 * the scroll progress through the viewport, so different parts of the page
 * drift at slightly different speeds — the classic depth effect.
 *
 *   speed > 0 → element moves UP (it appears closer / leads the scroll)
 *   speed < 0 → element moves DOWN (it appears farther / lags behind)
 *   speed = 0 → no parallax (default scroll)
 *
 * Recommended values:
 *   - 0.05 → 0.15  : foreground text accents (eyebrows, headlines)
 *   - -0.05 → -0.15: body copy (slight lag for "depth behind")
 *   - 0.25 → 0.5   : decorative background layers (blobs, meshes, globes)
 *
 * Auto-disabled on:
 *   - `prefers-reduced-motion: reduce`
 *   - Coarse-pointer devices (touch / mobile) — parallax on phone scroll
 *     causes jank on low-end Android and burns battery without payoff
 *     (the effect is barely perceptible on a small viewport anyway). The
 *     site's hero is the only place parallax really pays off, and that
 *     section has its own touch-optimized handling.
 *
 * When disabled, returns the children inside a plain wrapper — `useScroll`
 * is never instantiated, so no scroll listener is attached. With ~30
 * instances on the home page, this is a meaningful win on mobile.
 */

type Props = {
  children: React.ReactNode;
  /** Strength + direction of parallax. -1..1 typical. Default 0.1. */
  speed?: number;
  /** When false, returns to a non-motion span (no scroll listener). */
  enabled?: boolean;
  className?: string;
  /** Render as a different tag (default `div`). */
  as?: "div" | "span" | "section";
  /** Optional id — used by callers that need the wrapper as an anchor target. */
  id?: string;
};

/**
 * SSR-safe matchMedia subscription via `useSyncExternalStore`. Returns
 * true on coarse-pointer devices (touch). On the server we return false
 * so the markup is identical to a desktop user — there's no flash since
 * the wrapper element shape doesn't change, only the inner activation.
 */
const COARSE_QUERY = "(hover: none), (pointer: coarse)";
function subscribeCoarse(cb: () => void) {
  const mq = window.matchMedia(COARSE_QUERY);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
function getCoarseSnapshot() {
  return window.matchMedia(COARSE_QUERY).matches;
}
function useIsCoarsePointer(): boolean {
  return useSyncExternalStore(
    subscribeCoarse,
    getCoarseSnapshot,
    () => false, // server snapshot — no media query available
  );
}

export function ScrollParallax({
  children,
  speed = 0.1,
  enabled = true,
  className,
  as = "div",
  id,
}: Props) {
  const reduce = useReducedMotion();
  const isCoarse = useIsCoarsePointer();

  // Bail early without instantiating useScroll. This is the meaningful
  // perf win on mobile: 30+ scroll listeners across the page → 0.
  if (reduce || isCoarse || !enabled) {
    if (as === "span") return <span id={id} className={className}>{children}</span>;
    if (as === "section") return <section id={id} className={className}>{children}</section>;
    return <div id={id} className={className}>{children}</div>;
  }

  return (
    <ScrollParallaxInner speed={speed} className={className} as={as} id={id}>
      {children}
    </ScrollParallaxInner>
  );
}

function ScrollParallaxInner({
  children,
  speed,
  className,
  as,
  id,
}: {
  children: React.ReactNode;
  speed: number;
  className?: string;
  as: "div" | "span" | "section";
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  // Track scroll progress through the wrapper's viewport intersection.
  // `start end` = wrapper top hits viewport bottom (entering)
  // `end start` = wrapper bottom leaves viewport top (exiting)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Map progress 0→1 to a translate range. Total travel = 400 * speed px.
  const range = 400 * speed;
  const y = useTransform(scrollYProgress, [0, 1], [range, -range]);

  const Tag = motion[as] as typeof motion.div;
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      id={id}
      style={{ y, willChange: "transform" }}
      className={cn(className)}
    >
      {children}
    </Tag>
  );
}
