import { cn } from "@/lib/utils";

export function SectionEyebrow({
  number,
  label,
  className,
}: {
  number: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 font-display text-xs uppercase tracking-[0.25em] text-muted",
        className,
      )}
    >
      <span className="text-periwinkle">{number}</span>
      <span className="h-px w-8 bg-line" />
      <span>{label}</span>
    </div>
  );
}
