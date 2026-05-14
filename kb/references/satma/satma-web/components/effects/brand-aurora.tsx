import { cn } from "@/lib/utils";

type Intensity = "subtle" | "medium" | "cinematic";
type MaskShape = "radial" | "from-right" | "none";

type Props = {
  className?: string;
  /**
   * Visual intensity. `subtle` (default) ~ 32% opacity for ambient atmosphere.
   * `medium` reads as a clear effect. `cinematic` is the wow-factor original.
   */
  intensity?: Intensity;
  /** Where the aurora is "visible" — radial center mask, top-right diagonal, or no mask. */
  mask?: MaskShape;
};

const OPACITY: Record<Intensity, string> = {
  subtle: "opacity-[0.32]",
  medium: "opacity-[0.55]",
  cinematic: "opacity-[0.75]",
};

const MASK_CLASS: Record<MaskShape, string> = {
  radial: "brand-aurora--mask",
  "from-right": "brand-aurora--from-right",
  none: "",
};

/**
 * Animated brand-tinted aurora background. Server-renderable (no JS).
 * Uses CSS vars that flip per theme — same effect, theme-aware colors.
 *
 * Render inside a `relative overflow-hidden` parent. The aurora layer sits
 * `absolute inset-0`, doesn't intercept clicks (`pointer-events-none`), and
 * is `aria-hidden` for screen readers.
 *
 * Animation respects `prefers-reduced-motion` via the global rule in
 * globals.css that neutralizes all keyframe durations.
 */
export function BrandAurora({
  className,
  intensity = "subtle",
  mask = "radial",
}: Props) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden",
        className,
      )}
    >
      <div
        className={cn("brand-aurora", OPACITY[intensity], MASK_CLASS[mask])}
      />
    </div>
  );
}
