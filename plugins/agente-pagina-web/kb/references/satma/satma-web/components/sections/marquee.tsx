import { cn } from "@/lib/utils";

const defaultItems = [
  "Estrategia",
  "Creatividad",
  "Inteligencia",
  "Branding",
  "Performance",
  "Contenido",
  "Producto",
  "IA aplicada",
];

export function Marquee({
  items = defaultItems,
  className,
}: {
  items?: readonly string[];
  className?: string;
}) {
  const sequence = [...items, ...items, ...items, ...items];
  return (
    <section
      className={cn(
        // No border-y — flow continuously with the surrounding sections.
        "relative overflow-hidden bg-ink py-3 lg:py-4",
        className,
      )}
      aria-hidden="true"
    >
      <div className="flex w-max animate-marquee gap-8 whitespace-nowrap font-display text-base uppercase tracking-[0.15em] text-muted lg:text-lg">
        {sequence.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-8">
            {item}
            <span className="text-periwinkle text-xs lg:text-sm">✶</span>
          </span>
        ))}
      </div>
    </section>
  );
}
