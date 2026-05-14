import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const buttonStyles = cva(
  // Reactive sizing: hover scales 1.04 (button feels alive), active 0.98 (tap feedback).
  // 300ms unified across the site for consistent micro-interaction rhythm.
  "group/btn relative inline-flex items-center justify-center gap-2 rounded-full font-display font-medium tracking-tight whitespace-nowrap transition-all duration-300 ease-out hover:scale-[1.04] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-periwinkle focus-visible:ring-offset-2 focus-visible:ring-offset-ink disabled:pointer-events-none disabled:opacity-50 overflow-hidden",
  {
    variants: {
      variant: {
        primary:
          "bg-periwinkle text-navy hover:bg-mist active:scale-[0.98] shadow-[0_0_0_1px_rgba(0,0,0,0.06)]",
        secondary:
          "border border-line text-off hover:border-periwinkle/60 hover:bg-periwinkle/[0.04] active:scale-[0.98]",
        ghost: "text-off hover:bg-off/5",
        outline:
          "border border-off/20 text-off hover:border-off/50 active:scale-[0.98]",
        /** Dark pill — always navy regardless of theme. For periwinkle/light sections. */
        dark: "bg-navy text-paper hover:bg-navy/90 active:scale-[0.98]",
        /** Outlined dark — always navy text. For periwinkle/light sections. */
        outlineDark:
          "border border-navy/25 text-navy hover:border-navy hover:bg-navy/5 active:scale-[0.98]",
      },
      size: {
        // sm bumped from h-9 (36px) to h-10 (40px) to clear the WCAG mobile
        // touch target threshold (44px is recommended; 40px is the practical
        // floor for non-mobile-primary buttons).
        sm: "h-10 px-4 text-sm",
        md: "h-11 px-6 text-base",
        lg: "h-14 px-8 text-lg",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

type Variants = VariantProps<typeof buttonStyles>;

/** Color the neon line uses, picked per-variant for max contrast against the button bg. */
const NEON_COLOR_BY_VARIANT: Record<NonNullable<Variants["variant"]>, NeonColor> = {
  primary: "navy", // periwinkle bg → navy line for visibility
  secondary: "periwinkle",
  ghost: "periwinkle",
  outline: "periwinkle",
  dark: "periwinkle", // navy bg → periwinkle line glows
  outlineDark: "navy", // light bg → navy line
};

type NeonColor = "periwinkle" | "navy" | "paper";

const NEON_GRADIENT: Record<NeonColor, string> = {
  periwinkle: "via-periwinkle",
  navy: "via-navy",
  paper: "via-paper",
};

/**
 * Two thin neon lines (top + bottom edges of the button) that fade in on hover.
 * Adapted from the Aceternity-style neon-button pattern, anchored to SATMA palette.
 * Top line: opacity 0 → 1 (full glow). Bottom line: opacity 0 → 0.4 (subtle echo).
 */
function NeonLines({ color }: { color: NeonColor }) {
  const grad = NEON_GRADIENT[color];
  return (
    <>
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 top-0 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 ease-in-out group-hover/btn:opacity-100",
          grad,
        )}
      />
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 mx-auto h-px w-3/4 bg-gradient-to-r from-transparent to-transparent opacity-0 transition-opacity duration-500 ease-in-out group-hover/btn:opacity-40",
          grad,
        )}
      />
    </>
  );
}

type NeonProp = boolean | NeonColor;

function resolveNeonColor(
  neon: NeonProp,
  variant: Variants["variant"],
): NeonColor | null {
  if (neon === false) return null;
  if (neon === true) return NEON_COLOR_BY_VARIANT[variant ?? "primary"];
  return neon; // explicit color
}

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  Variants & {
    /** Show neon hover lines. Default `true`. Pass a color to override the auto-pick. */
    neon?: NeonProp;
  };

export const Button = ({
  className,
  variant,
  size,
  neon = true,
  children,
  ...rest
}: ButtonProps) => {
  const color = resolveNeonColor(neon, variant);
  return (
    <button
      className={cn(buttonStyles({ variant, size }), className)}
      {...rest}
    >
      {color && <NeonLines color={color} />}
      {children}
    </button>
  );
};

export type ButtonLinkProps = React.ComponentProps<typeof Link> &
  Variants & { neon?: NeonProp };

export const ButtonLink = ({
  className,
  variant,
  size,
  neon = true,
  children,
  ...rest
}: ButtonLinkProps) => {
  const color = resolveNeonColor(neon, variant);
  return (
    <Link
      className={cn(buttonStyles({ variant, size }), className)}
      {...rest}
    >
      {color && <NeonLines color={color} />}
      {children}
    </Link>
  );
};
