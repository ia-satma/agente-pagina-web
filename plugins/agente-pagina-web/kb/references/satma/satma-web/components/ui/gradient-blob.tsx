import { cn } from "@/lib/utils";

type Tone = "periwinkle" | "lilac" | "mist" | "navy";
type Animate = "float-a" | "float-b" | "float-c" | false;

/** Gradients use CSS vars (--tone-X) that flip per theme — see globals.css. */
const TONE_CLASSES: Record<Tone, string> = {
  periwinkle:
    "bg-[radial-gradient(circle_at_center,var(--tone-periwinkle),transparent_70%)]",
  lilac: "bg-[radial-gradient(circle_at_center,var(--tone-lilac),transparent_70%)]",
  mist: "bg-[radial-gradient(circle_at_center,var(--tone-mist),transparent_70%)]",
  navy: "bg-[radial-gradient(circle_at_center,var(--tone-navy),transparent_70%)]",
};

const ANIMATE_CLASSES: Record<Exclude<Animate, false>, string> = {
  "float-a": "animate-float-a",
  "float-b": "animate-float-b",
  "float-c": "animate-float-c",
};

type Props = {
  tone?: Tone;
  className?: string;
  /** Visual size, applied to width and height. */
  size?: number;
  /** Tailwind opacity class to dim the blob. Defaults to opacity-100. */
  opacityClass?: string;
  /**
   * Subtle 2D motion. Default `float-a`. Pass `false` to disable.
   * Different variants have slightly different rhythms — alternate them
   * across sections so the page never feels rigid.
   */
  animate?: Animate;
};

/**
 * Soft radial gradient blob for decorating section backgrounds.
 * Render inside a `relative overflow-hidden` parent — position with
 * Tailwind classes via `className` (e.g. `-top-40 -left-40`).
 */
export function GradientBlob({
  tone = "periwinkle",
  className,
  size = 720,
  opacityClass = "opacity-100",
  animate = "float-a",
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute rounded-full blur-[120px]",
        TONE_CLASSES[tone],
        opacityClass,
        animate !== false && ANIMATE_CLASSES[animate],
        className,
      )}
      style={{ width: size, height: size }}
    />
  );
}
