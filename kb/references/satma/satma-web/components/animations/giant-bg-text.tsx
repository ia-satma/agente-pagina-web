"use client";

import * as React from "react";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type Props = {
  /** The text to render (will be huge — keep it short). */
  text: string;
  /** Element to use as the ScrollTrigger trigger. Defaults to the text's parent section (must be `position: relative` and contain it). */
  triggerSelector?: string;
  /** Tailwind text-color / utility classes for the text glyphs. */
  className?: string;
  /** Font size in viewport-width units. Default 26vw. */
  vw?: number;
  /**
   * If true, the text uses an outline-only stroke + gradient mask for a
   * "ghost" effect that doesn't compete with foreground content.
   */
  ghost?: boolean;
};

/**
 * Giant background text that scrubs into view as the user scrolls through
 * the parent section. Goes from y:10vh + scale 0.8 + opacity 0 → in place +
 * scale 1 + opacity 1, smoothly tied to scroll progress.
 *
 * Render INSIDE a `relative overflow-hidden` parent. Sit it absolutely
 * positioned where you want the text to appear (typically center-bottom).
 */
export function GiantBgText({
  text,
  triggerSelector,
  className,
  vw = 22,
  ghost = true,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const trigger = triggerSelector
        ? document.querySelector(triggerSelector)
        : el.parentElement;
      if (!trigger) return;

      gsap.fromTo(
        el,
        { y: "12vh", scale: 0.85, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger,
            start: "top 85%",
            end: "bottom bottom",
            scrub: 1,
          },
        },
      );
    },
    { scope: ref },
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn(
        "pointer-events-none select-none whitespace-nowrap font-display font-black leading-[0.75] tracking-[-0.05em]",
        ghost && "giant-bg-text-ghost",
        className,
      )}
      style={{ fontSize: `${vw}vw` }}
    >
      {text}
    </div>
  );
}
