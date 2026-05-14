"use client";

import * as React from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

// Register once on the client. Safe to call multiple times — GSAP de-dupes.
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Vertical translation in px on enter. Default 60. */
  y?: number;
  /** Stagger between direct children (in seconds). 0 = single element. */
  stagger?: number;
  /** ScrollTrigger start position (default `"top 85%"`). */
  start?: string;
  /** ScrollTrigger end position (default `"top 35%"`). */
  end?: string;
  /**
   * `scrub: 1` = animation tied to scroll, smoothed by 1s.
   * Pass `false` for a one-shot reveal at threshold instead.
   */
  scrub?: number | boolean;
  /** Optional blur-in effect. Defaults to true (cinematic). */
  blur?: boolean;
};

/**
 * Scroll-scrubbed reveal: the animation progress follows the scrollbar.
 * Scrub back and forth — the elements respond. Far more cinematic than
 * a one-shot intersection-observer trigger.
 *
 * Children direct of the wrapper (`> *`) are staggered. To animate a single
 * element, wrap it in this component with `stagger={0}`.
 *
 * Respects `prefers-reduced-motion` automatically via the global CSS rule.
 */
export function ScrollScrubReveal({
  children,
  className,
  y = 60,
  stagger = 0.12,
  start = "top 85%",
  end = "top 35%",
  scrub = 1,
  blur = true,
}: Props) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const items = wrapperRef.current?.children;
      if (!items || items.length === 0) return;

      const fromVars: gsap.TweenVars = {
        y,
        opacity: 0,
        ...(blur ? { filter: "blur(8px)" } : {}),
      };

      const toVars: gsap.TweenVars = {
        y: 0,
        opacity: 1,
        ...(blur ? { filter: "blur(0px)" } : {}),
        ease: "power2.out",
        stagger: stagger || 0,
        scrollTrigger: {
          trigger: wrapperRef.current,
          start,
          end,
          scrub,
        },
      };

      gsap.fromTo(items, fromVars, toVars);
    },
    { scope: wrapperRef },
  );

  return (
    <div ref={wrapperRef} className={cn(className)}>
      {children}
    </div>
  );
}
