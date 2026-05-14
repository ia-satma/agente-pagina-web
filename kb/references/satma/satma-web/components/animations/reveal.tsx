"use client";

import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  blur?: boolean;
  /** When true, animates immediately on mount instead of on scroll. */
  immediate?: boolean;
};

export function Reveal({
  children,
  className,
  delay = 0,
  y = 24,
  blur = false,
  immediate = false,
}: Props) {
  const reduce = useReducedMotion();
  const initial = reduce
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : { opacity: 0, y, filter: blur ? "blur(8px)" : "blur(0px)" };
  const target = { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <motion.div
      initial={initial}
      {...(immediate
        ? { animate: target }
        : {
            whileInView: target,
            viewport: { once: true, margin: "-80px" },
          })}
      transition={{
        duration: 0.9,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
