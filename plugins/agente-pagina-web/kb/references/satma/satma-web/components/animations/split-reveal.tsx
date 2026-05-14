"use client";

import * as React from "react";
import { useRef } from "react";
import { useReducedMotion } from "motion/react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { SplitText } from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(SplitText, ScrollTrigger, useGSAP);
}

type Props = {
  /** The plain text to render. SplitText wraps each char/word client-side. */
  text: string;
  className?: string;
  /** Seconds before the cascade starts. */
  delay?: number;
  /** Per-target stagger in seconds (chars or words). */
  stagger?: number;
  /** Granularity of the split. Default `chars` for hero/CtaFinal headlines. */
  by?: "chars" | "words";
  /**
   * If true, fires on mount (use for above-the-fold content).
   * If false, waits for the element to enter the viewport (ScrollTrigger).
   */
  immediate?: boolean;
  /** Per-target tween duration. */
  duration?: number;
  /** Vertical offset in `em` units that each char/word starts at. */
  yOffsetEm?: number;
  /** Initial blur in px. Set to 0 to disable. */
  blurPx?: number;
};

/**
 * SplitText-powered char/word reveal — replacement for WordReveal where
 * we want the cinematic char-by-char cascade ("premium agency" feel).
 *
 * Why GSAP SplitText over a custom motion implementation:
 *   - Splits respect ligatures, kerning and line breaks (no awkward "v" alone).
 *   - Cleans up DOM mutations on unmount via `split.revert()`.
 *   - Works with `text-balance` and clamp font-sizes without breaking layout.
 *   - Supports prefers-reduced-motion fallback to plain text.
 *
 * Usage:
 *   <SplitReveal text="Donde la creatividad" immediate delay={0.3} />
 *   <SplitReveal text="…recordar." />   // viewport-triggered (CtaFinal)
 */
export function SplitReveal({
  text,
  className,
  delay = 0,
  stagger = 0.025,
  by = "chars",
  immediate = false,
  duration = 0.85,
  yOffsetEm = 0.55,
  blurPx = 10,
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  // SSR-safe reduced-motion check from motion/react — same hook the rest
  // of the codebase uses. Returns null on the server, true|false on client.
  const reduce = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      if (reduce) {
        // No animation — just reveal the static text.
        el.style.opacity = "1";
        return;
      }

      const split = new SplitText(el, {
        type: "chars,words",
        wordsClass: "splitr-word",
        charsClass: "splitr-char",
      });
      const targets = by === "words" ? split.words : split.chars;

      // Reveal the host (was hidden by inline opacity:0 to avoid FOUC) —
      // GSAP now controls visibility per-target.
      el.style.opacity = "1";

      const tween = gsap.fromTo(
        targets,
        {
          y: `${yOffsetEm}em`,
          opacity: 0,
          filter: blurPx > 0 ? `blur(${blurPx}px)` : "none",
        },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration,
          stagger,
          ease: "power3.out",
          delay,
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: el,
                  start: "top 85%",
                  once: true,
                },
              }),
        },
      );

      return () => {
        tween.kill();
        // Revert restores the original DOM so the text is selectable & accessible.
        split.revert();
      };
    },
    { scope: ref, dependencies: [reduce, text, by, immediate] },
  );

  return (
    <span
      ref={ref}
      className={cn("inline-block", className)}
      // Hidden until GSAP swaps in the chars — prevents flash of the raw text
      // jumping into place before the cascade.
      style={{ opacity: 0, willChange: "opacity" }}
    >
      {text}
    </span>
  );
}
