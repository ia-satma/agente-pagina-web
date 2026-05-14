"use client";

import * as React from "react";
import { useReducedMotion } from "motion/react";

type Props = {
  to: number;
  /** Animation duration in seconds. Default 1.6. */
  duration?: number;
  prefix?: string;
  suffix?: string;
  /** Locale-formatted number (es-MX). */
  format?: boolean;
  className?: string;
};

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

/**
 * Counter that animates from 0 to `to` once it enters the viewport.
 * Renders the final value immediately if reduced motion is preferred.
 */
export function Counter({
  to,
  duration = 1.6,
  prefix = "",
  suffix = "",
  format = false,
  className,
}: Props) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const [n, setN] = React.useState(0);
  const reduce = useReducedMotion();

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduce) {
      // Reduced motion: jump straight to the final value, no animation.
      // The setState-in-effect rule warns generically here, but reading
      // `prefers-reduced-motion` requires window access which is only
      // safe inside this effect.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setN(to);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const start = performance.now();
        let raf = 0;
        const tick = (now: number) => {
          const t = Math.min((now - start) / (duration * 1000), 1);
          const eased = easeOutExpo(t);
          setN(Math.round(to * eased));
          if (t < 1) {
            raf = requestAnimationFrame(tick);
          }
        };
        raf = requestAnimationFrame(tick);
        observer.disconnect();
        return () => cancelAnimationFrame(raf);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration, reduce]);

  const display = format ? n.toLocaleString("es-MX") : String(n);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
