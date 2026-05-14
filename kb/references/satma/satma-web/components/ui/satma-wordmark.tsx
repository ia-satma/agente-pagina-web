import { cn } from "@/lib/utils";

/**
 * SATMA wordmark — text rendition styled to feel close to the brand book's
 * double-stroke geometric logo. The real PDF logo lives at
 * /images/satma-wordmark.png for places that need the literal lockup.
 */
export function SatmaWordmark({
  className,
  withDot = true,
}: {
  className?: string;
  withDot?: boolean;
}) {
  return (
    <span
      className={cn(
        "font-display font-medium tracking-[-0.04em] leading-none",
        className,
      )}
    >
      satma
      {withDot && <span className="text-periwinkle">.</span>}
    </span>
  );
}
