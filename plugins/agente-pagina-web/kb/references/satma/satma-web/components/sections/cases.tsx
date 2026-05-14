import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/animations/reveal";
import { GradientBlob } from "@/components/ui/gradient-blob";
import { HoverAccent } from "@/components/effects/hover-accent";
import { NeonGlowCard } from "@/components/effects/neon-glow-card";
import { Tilt3D } from "@/components/effects/tilt-3d";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { MetricCallout } from "@/components/ui/metric-callout";
import { getPayloadClient } from "@/lib/payload-client";
import { cn } from "@/lib/utils";

const ACCENTS = [
  "from-periwinkle/20 via-periwinkle/5 to-transparent",
  "from-lilac/20 via-lilac/5 to-transparent",
  "from-mist/30 via-mist/5 to-transparent",
  "from-periwinkle/15 via-periwinkle/5 to-transparent",
];

const SPANS = [
  "lg:col-span-7",
  "lg:col-span-5",
  "lg:col-span-5",
  "lg:col-span-7",
];

export async function Cases() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "cases",
    where: { featured: { equals: true } },
    sort: "-publishedAt",
    limit: 4,
    depth: 1,
    overrideAccess: true,
  });

  const cases = result.docs.map((doc, i) => {
    const industry = (doc as { industry?: { name?: string } | string }).industry;
    const industryName =
      typeof industry === "object" && industry !== null && "name" in industry
        ? String(industry.name ?? "")
        : "";
    return {
      id: doc.id,
      slug: (doc as { slug?: string }).slug ?? "",
      title: (doc as { title?: string }).title ?? "",
      industry: industryName,
      // Methodology fields — added to the Cases collection so each
      // case ships with full E-E-A-T context (period + baseline +
      // source) editable from /admin instead of a hardcoded lookup.
      metric: (doc as { metric?: string }).metric ?? "",
      metricLabel: (doc as { metricLabel?: string }).metricLabel ?? "",
      metricPeriod: (doc as { metricPeriod?: string }).metricPeriod ?? "",
      metricBaseline:
        (doc as { metricBaseline?: string }).metricBaseline ?? "",
      metricSource: (doc as { metricSource?: string }).metricSource ?? "",
      year: (doc as { year?: number }).year ?? new Date().getFullYear(),
      accent: ACCENTS[i % ACCENTS.length],
      span: SPANS[i % SPANS.length],
    };
  });

  return (
    <section
      id="casos"
      className="relative overflow-hidden py-14 sm:py-20 lg:py-40"
    >
      <ScrollParallax speed={0.75} className="absolute inset-0 pointer-events-none">
        <GradientBlob
          tone="mist"
          size={780}
          animate="float-b"
          className="-right-[18%] top-[10%] opacity-45"
        />
      </ScrollParallax>
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <ScrollParallax speed={0.22}>
            <SectionEyebrow number="05" label="Casos seleccionados" />
            <h2 className="mt-8 max-w-[18ch] font-display text-[clamp(1.875rem,4.5vw,4.25rem)] font-medium leading-[1] tracking-[-0.03em] text-balance">
              Resultados que se{" "}
              <HoverAccent className="italic text-periwinkle font-light">miden</HoverAccent>,
              no que se prometen.
            </h2>
          </ScrollParallax>
          <Link
            href="/casos"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-line px-5 py-3 text-sm transition-colors hover:border-periwinkle/60 hover:text-periwinkle lg:self-end"
          >
            Ver todos los casos
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        <div className="mt-16 grid gap-3 lg:mt-24 lg:grid-cols-12">
          {cases.map((c, i) => {
            const cardSpeed = 0.12 + (i % 2) * 0.15;
            return (
            <ScrollParallax key={c.id} speed={cardSpeed} className={cn(c.span)}>
              <Reveal delay={i * 0.08}>
              <Tilt3D className="h-full" intensity={4}>
              <NeonGlowCard className="rounded-2xl">
              <Link
                href={`/casos/${c.slug}`}
                className="group relative block aspect-[2.2/1] overflow-hidden rounded-2xl border border-line bg-ink-soft/70 shadow-card transition-all duration-300 hover:scale-[1.025] hover:border-periwinkle/50 hover:shadow-card-hover"
              >
                <div
                  className={cn(
                    "absolute inset-0 bg-gradient-to-br opacity-100 transition-opacity duration-300 group-hover:opacity-60",
                    c.accent,
                  )}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />

                <div className="pointer-events-none absolute right-5 top-5 font-display text-5xl text-off/[0.08] tracking-tight lg:text-7xl">
                  {c.year}
                </div>

                <div className="relative flex h-full flex-col justify-between p-4 sm:p-6 lg:p-7">
                  <div className="flex items-center justify-between">
                    {c.industry && (
                      <span className="rounded-full border border-line bg-ink/60 px-2.5 py-0.5 text-[9px] uppercase tracking-[0.25em] text-muted backdrop-blur">
                        {c.industry}
                      </span>
                    )}
                    <ArrowUpRight
                      size={16}
                      className="text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-periwinkle"
                    />
                  </div>

                  <div>
                    <h3 className="font-display text-lg font-medium tracking-tight text-off lg:text-xl text-pretty">
                      {c.title}
                    </h3>
                    {c.metric && (
                      // E-E-A-T — show the result with period + baseline
                      // when methodology fields are filled in /admin.
                      // Falls back to the bare metric line if only the
                      // top-level metric exists.
                      <div className="mt-3">
                        {c.metricLabel || c.metricPeriod || c.metricBaseline ? (
                          <MetricCallout
                            metric={c.metric}
                            label={c.metricLabel || undefined}
                            period={c.metricPeriod || undefined}
                            baseline={c.metricBaseline || undefined}
                            source={c.metricSource || undefined}
                            variant="compact"
                          />
                        ) : (
                          <span className="text-xs font-medium text-periwinkle">
                            {c.metric}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
              </NeonGlowCard>
              </Tilt3D>
              </Reveal>
            </ScrollParallax>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
