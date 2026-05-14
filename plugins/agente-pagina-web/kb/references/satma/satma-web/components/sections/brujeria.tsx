import Image from "next/image";
import { ArrowUpRight, Sparkles, Wand2 } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/animations/reveal";
import { NeonGlowCard } from "@/components/effects/neon-glow-card";

const features = [
  "Generación automática de contenido visual",
  "Análisis predictivo de campañas",
  "Asistentes conversacionales para clientes",
  "Automatización de flujos de marketing",
];

export function Brujeria() {
  return (
    <section className="relative py-14 sm:py-20 lg:py-40">
      <Container>
        <SectionEyebrow number="04" label="Producto propio" />

        <Reveal>
          <NeonGlowCard className="mt-12 rounded-3xl">
          <div className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-ink-soft/80 via-ink to-ink p-8 shadow-card transition-all duration-300 hover:scale-[1.025] hover:border-periwinkle/50 hover:shadow-card-hover lg:p-16">
            {/* Glow */}
            <div className="pointer-events-none absolute -left-32 -top-32 size-96 rounded-full bg-periwinkle/10 blur-3xl" />
            <div className="pointer-events-none absolute -right-32 -bottom-32 size-96 rounded-full bg-lilac/10 blur-3xl" />

            <div className="relative grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-periwinkle/40 bg-periwinkle/[0.06] px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-periwinkle">
                  <Wand2 size={14} />
                  Producto SATMA · Beta
                </div>

                <h2 className="mt-8 font-display text-[clamp(2rem,4.5vw,4.5rem)] font-medium leading-[0.95] tracking-[-0.04em] text-off">
                  brujer<span className="text-periwinkle">.ia</span>
                </h2>

                <p className="mt-6 max-w-xl text-lg text-muted lg:text-xl text-pretty">
                  Nuestra plataforma propia de inteligencia artificial aplicada al marketing. Magia operacional sin perder el toque humano.
                </p>

                <ul className="mt-10 grid gap-3 sm:grid-cols-2">
                  {features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-3 text-off/80"
                    >
                      <Sparkles
                        size={16}
                        className="mt-1 shrink-0 text-periwinkle"
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-10 flex flex-wrap gap-3">
                  <ButtonLink href="/brujer-ia" variant="primary" size="md">
                    Conocer brujer.ia <ArrowUpRight size={18} />
                  </ButtonLink>
                  <ButtonLink href="/contacto" variant="secondary" size="md">
                    Solicitar acceso beta
                  </ButtonLink>
                </div>
              </div>

              <div className="relative lg:col-span-5">
                <div className="relative aspect-square w-full max-w-md mx-auto">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-periwinkle/20 via-transparent to-transparent blur-2xl" />
                  <Image
                    src="/images/brujeria-mascot.png"
                    alt="Mascota de brujer.ia — plataforma propia de SATMA de inteligencia artificial aplicada al marketing"
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 80vw, 400px"
                    priority={false}
                  />
                </div>
              </div>
            </div>
          </div>
          </NeonGlowCard>
        </Reveal>
      </Container>
    </section>
  );
}
