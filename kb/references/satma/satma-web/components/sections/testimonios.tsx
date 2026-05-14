import { Quote } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { GradientBlob } from "@/components/ui/gradient-blob";
import { HoverAccent } from "@/components/effects/hover-accent";
import { Reveal } from "@/components/animations/reveal";
import { NeonGlowCard } from "@/components/effects/neon-glow-card";
import { Tilt3D } from "@/components/effects/tilt-3d";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { getPayloadClient } from "@/lib/payload-client";

export async function Testimonios() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "testimonials",
    where: { featured: { equals: true } },
    sort: "order",
    limit: 6,
    overrideAccess: true,
  });

  const testimonials = result.docs.map((doc) => ({
    id: doc.id,
    quote: (doc as { quote?: string }).quote ?? "",
    author: (doc as { author?: string }).author ?? "",
    role: (doc as { role?: string }).role ?? "",
    company: (doc as { company?: string }).company ?? "",
  }));

  if (testimonials.length === 0) return null;

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-40">
      <ScrollParallax speed={0.75} className="absolute inset-0 pointer-events-none">
        <GradientBlob
          tone="periwinkle"
          size={700}
          animate="float-b"
          className="left-[10%] -top-[15%] opacity-40"
        />
      </ScrollParallax>
      <Container>
        {/* Centered showcase — testimonials feel stronger framed centrally. */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <ScrollParallax speed={0.25}>
            <SectionEyebrow number="07" label="Lo que dicen" />

            <h2 className="mt-8 font-display text-[clamp(1.875rem,4.5vw,4.25rem)] font-medium leading-[1] tracking-[-0.03em] text-balance">
              La <HoverAccent className="italic text-periwinkle font-light">prueba</HoverAccent>{" "}
              es lo que dicen quienes ya trabajan con nosotros.
            </h2>
          </ScrollParallax>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-3 sm:mt-16 md:grid-cols-2 lg:mt-24 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <ScrollParallax key={t.id} speed={0.12 + (i % 3) * 0.1}>
              <Reveal delay={i * 0.1}>
              <Tilt3D className="h-full" intensity={4}>
              <NeonGlowCard className="h-full rounded-2xl">
              <figure className="flex h-full flex-col justify-between rounded-2xl border border-line bg-ink-soft/70 p-8 shadow-card transition-all duration-300 hover:scale-[1.025] hover:border-periwinkle/50 hover:shadow-card-hover lg:p-10">
                <Quote
                  size={28}
                  className="text-periwinkle/60"
                  strokeWidth={1.5}
                />
                <blockquote className="mt-8 text-lg leading-relaxed text-off/85 text-pretty lg:text-xl">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-10 pt-6">
                  <div className="font-display text-base text-off">
                    {t.author}
                  </div>
                  <div className="mt-1 text-sm text-muted">
                    {t.role && <>{t.role}</>}
                    {t.role && t.company && " · "}
                    {t.company}
                  </div>
                </figcaption>
              </figure>
              </NeonGlowCard>
              </Tilt3D>
              </Reveal>
            </ScrollParallax>
          ))}
        </div>
      </Container>
    </section>
  );
}
