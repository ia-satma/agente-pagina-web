"use client";

import * as React from "react";
import { useId, useRef } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * Wraps a card so an animated neon border + bloom appears on hover, with
 * the hue cycling based on the cursor's X position inside the card.
 *
 *   • Border ring (1px) traces the card edge with a radial gradient that
 *     follows the cursor — the HSL hue shifts from cyan → blue → purple →
 *     magenta as the cursor moves horizontally
 *   • Outer blurred bloom adds a soft halo so the effect reads even on the
 *     edge of the card
 *   • Both layers fade in only on hover, so resting cards stay quiet
 *   • Works in both light and dark themes (HSL with ~65% lightness reads on
 *     either surface; saturation 95% keeps it neon)
 *   • Respects `prefers-reduced-motion: reduce` (no glow, no transition)
 *
 * Place around any card-like element. The wrapper adds `relative` and
 * pseudo-elements; the child keeps its own border, bg, padding, etc.
 */

type Props = {
  children: React.ReactNode;
  className?: string;
  /** Base HSL hue (default 200 = cyan-blue). Range: 0–360. */
  hueBase?: number;
  /** Hue spread driven by cursor X position (default 140). */
  hueSpread?: number;
  /** Radius of the inner spotlight in px (default 240). */
  size?: number;
  /** Set true to keep the bloom always visible (not just on hover). */
  alwaysOn?: boolean;
};

export function NeonGlowCard({
  children,
  className,
  hueBase = 200,
  hueSpread = 140,
  size = 240,
  alwaysOn = false,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  // Stable id per instance for scoped CSS — avoids name collisions with
  // multiple NeonGlowCard mounts on the same page.
  const rawId = useId();
  const id = rawId.replace(/[^a-z0-9]/gi, "");

  const onMove = React.useCallback<React.PointerEventHandler<HTMLDivElement>>(
    (e) => {
      if (reduce) return;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty("--ng-x", `${x}px`);
      el.style.setProperty("--ng-y", `${y}px`);
      el.style.setProperty(
        "--ng-xp",
        rect.width > 0 ? String(x / rect.width) : "0.5",
      );
    },
    [reduce],
  );

  // Scoped CSS — the pseudo-element approach gives clean :hover transitions
  // and the mask-clip trick that limits the gradient to the 1px border ring.
  const css = `
    .neon-glow-${id} {
      --ng-base: ${hueBase};
      --ng-spread: ${hueSpread};
      --ng-size: ${size}px;
    }
    .neon-glow-${id} > .ng-border,
    .neon-glow-${id} > .ng-bloom {
      pointer-events: none;
      position: absolute;
      inset: 0;
      border-radius: inherit;
      opacity: ${alwaysOn ? 0.6 : 0};
      transition: opacity 0.45s ease;
    }
    .neon-glow-${id}:hover > .ng-border,
    .neon-glow-${id}:hover > .ng-bloom {
      opacity: 1;
    }
    .neon-glow-${id} > .ng-border {
      padding: 1px;
      background: radial-gradient(
        var(--ng-size) var(--ng-size) at var(--ng-x, 50%) var(--ng-y, 50%),
        hsl(calc(var(--ng-base) + var(--ng-xp, 0) * var(--ng-spread)) 95% 65% / 1),
        transparent 60%
      );
      -webkit-mask:
        linear-gradient(#000, #000) content-box,
        linear-gradient(#000, #000);
      -webkit-mask-composite: xor;
      mask:
        linear-gradient(#000, #000) content-box,
        linear-gradient(#000, #000);
      mask-composite: exclude;
    }
    .neon-glow-${id} > .ng-bloom {
      inset: -6px;
      filter: blur(22px);
      background: radial-gradient(
        var(--ng-size) var(--ng-size) at var(--ng-x, 50%) var(--ng-y, 50%),
        hsl(calc(var(--ng-base) + var(--ng-xp, 0) * var(--ng-spread)) 95% 70% / 0.55),
        transparent 65%
      );
      opacity: ${alwaysOn ? 0.45 : 0};
    }
    .neon-glow-${id}:hover > .ng-bloom {
      opacity: 0.7;
    }
    @media (prefers-reduced-motion: reduce) {
      .neon-glow-${id} > .ng-border,
      .neon-glow-${id} > .ng-bloom {
        display: none !important;
      }
    }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <div
        ref={ref}
        onPointerMove={onMove}
        className={cn(`neon-glow-${id} relative`, className)}
      >
        <div className="ng-bloom" aria-hidden />
        <div className="ng-border" aria-hidden />
        {children}
      </div>
    </>
  );
}
