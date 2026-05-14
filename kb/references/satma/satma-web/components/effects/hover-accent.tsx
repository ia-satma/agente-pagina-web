import * as React from "react";
import { cn } from "@/lib/utils";

type Props = React.HTMLAttributes<HTMLSpanElement> & {
  children: React.ReactNode;
};

/**
 * Hover accent — server-renderable wrapper that applies a triple-effect
 * hover treatment via pure CSS (defined in `globals.css` as `.hover-accent`):
 *
 *   1. Underline draws in from left (transform scaleX 0 → 1)
 *   2. Letter-spacing opens slightly (0 → 0.025em)
 *   3. Soft periwinkle glow (text-shadow with `--glow-rgb` — theme-aware)
 *
 * Zero JS, zero motion library, fully accessible. The global
 * `prefers-reduced-motion` rule already neutralizes the transitions.
 */
export function HoverAccent({ className, children, ...rest }: Props) {
  return (
    <span className={cn("hover-accent", className)} {...rest}>
      {children}
    </span>
  );
}
