import {
  Brain,
  Layout,
  Megaphone,
  Palette,
  PlayCircle,
  Sparkles,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import Link from "next/link";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/animations/reveal";
import { GradientBlob } from "@/components/ui/gradient-blob";
import { CardGlow } from "@/components/effects/card-glow";
import { NeonGlowCard } from "@/components/effects/neon-glow-card";
import { Tilt3D } from "@/components/effects/tilt-3d";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { getPayloadClient } from "@/lib/payload-client";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Brain,
  Layout,
  Megaphone,
  Palette,
  PlayCircle,
  TrendingUp,
  Sparkles,
};

/**
 * Bento layout proportions per index (hand-tuned for 6 services).
 * If the CMS holds more or fewer, the rest defaults to 3 cols.
 */
const BENTO_SPAN: Record<number, string> = {
  0: "lg:col-span-2",
  1: "lg:col-span-2",
  2: "lg:col-span-2",
  3: "lg:col-span-3",
  4: "lg:col-span-3",
  5: "lg:col-span-6",
};

export async function Services() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "services",
    sort: "order",
    limit: 30,
    overrideAccess: true,
  });

  const services = result.docs.map((doc, i) => {
    const iconName = (doc as { icon?: string }).icon ?? "Sparkles";
    return {
      id: doc.id,
      slug: (doc as { slug?: string }).slug ?? "",
      Icon: ICONS[iconName] ?? Sparkles,
      name: doc.name,
      body: (doc as { shortDescription?: string }).shortDescription ?? "",
      span: BENTO_SPAN[i] ?? "lg:col-span-3",
      highlight: Boolean((doc as { featured?: boolean }).featured),
    };
  });

  return (
    <section
      id="servicios"
      className="relative overflow-hidden py-14 sm:py-20 lg:py-40"
    >
      <ScrollParallax speed={0.8} className="absolute inset-0 pointer-events-none">
        <GradientBlob
          tone="mist"
          size={680}
          animate="float-c"
          className="right-[-15%] top-[15%] opacity-50"
        />
      </ScrollParallax>
      <Container>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <ScrollParallax speed={0.22}>
            <SectionEyebrow number="02" label="Servicios" />
            <h2 className="mt-8 max-w-[18ch] font-display text-[clamp(1.875rem,4.5vw,4.25rem)] font-medium leading-[1] tracking-[-0.03em] text-balance">
              Un equipo.{" "}
              <span className="text-muted">
                Seis disciplinas. Mil maneras de combinarlas.
              </span>
            </h2>
          </ScrollParallax>
          <Link
            href="/servicios"
            className="group inline-flex shrink-0 items-center gap-2 self-start rounded-full border border-line px-5 py-3 text-sm transition-colors hover:border-periwinkle/60 hover:text-periwinkle lg:self-end"
          >
            Ver todos los servicios
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>

        {/* Bento grid — 1 col on phone, 2 cols on tablet portrait,
            6 cols on desktop where the per-item `lg:col-span-*` kicks in. */}
        <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:mt-24 lg:grid-cols-6">
          {services.map((s, i) => {
            const { Icon } = s;
            // Stagger parallax speed so the grid moves like a wave.
            const cardSpeed = 0.15 + (i % 3) * 0.08;
            return (
              <ScrollParallax
                key={s.id}
                speed={cardSpeed}
                // `id={s.slug}` makes each card the deep-link target for
                // /servicios#branding, /servicios#ia-aplicada etc. — referenced
                // by the Service schemas + ItemList we emit on /servicios.
                // `scroll-mt-24` accounts for the sticky header on jump.
                className={cn("scroll-mt-24", s.span)}
                id={s.slug}
              >
                <Reveal delay={i * 0.06}>
                <Tilt3D className="h-full" intensity={5}>
                <NeonGlowCard className="h-full rounded-2xl">
                <CardGlow
                  tone={s.highlight ? "periwinkle" : "glow"}
                  className={cn(
                    "h-full rounded-2xl border p-8 shadow-card transition-all duration-300 hover:scale-[1.025] hover:shadow-card-hover lg:p-10",
                    s.highlight
                      ? "border-periwinkle/40 bg-periwinkle/[0.06]"
                      : "border-line bg-ink-soft/70 hover:border-periwinkle/50 hover:bg-ink-soft/95",
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={cn(
                        "flex size-12 items-center justify-center rounded-xl border transition-all duration-300",
                        s.highlight
                          ? "border-periwinkle/40 bg-periwinkle/10 text-periwinkle"
                          : "border-line bg-ink text-muted group-hover:border-periwinkle/40 group-hover:text-periwinkle",
                      )}
                    >
                      <Icon size={20} />
                    </div>
                    {s.highlight && (
                      <span className="rounded-full border border-periwinkle/40 bg-periwinkle/10 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-periwinkle">
                        Nuevo · 2026
                      </span>
                    )}
                  </div>
                  <div className="mt-auto pt-12">
                    <h3 className="font-display text-2xl font-medium tracking-tight text-off lg:text-3xl">
                      {s.name}
                    </h3>
                    <p className="mt-4 max-w-prose text-muted leading-relaxed">
                      {s.body}
                    </p>
                  </div>
                </CardGlow>
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
