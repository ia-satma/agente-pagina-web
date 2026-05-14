import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowUpRight,
  Brain,
  ImageIcon,
  MessageCircle,
  Sparkles,
  Target,
  Wand2,
  Workflow,
  Zap,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
// PageHero is imported at the top-level layout via (frontend)/layout.tsx,
// so this page doesn't need to import it again. Kept here as a reminder.
// import { PageHero } from "@/components/sections/page-hero";
import { CtaFinal } from "@/components/sections/cta-final";
import { BrandAurora } from "@/components/effects/brand-aurora";
import { BrandGlowCard } from "@/components/effects/brand-glow-card";
import { NeonGlowCard } from "@/components/effects/neon-glow-card";
import { Tilt3D } from "@/components/effects/tilt-3d";
import { Reveal } from "@/components/animations/reveal";
import { site } from "@/lib/site";
import {
  JsonLd,
  buildBreadcrumb,
  buildSoftwareApplication,
} from "@/components/seo/page-schemas";

export const metadata: Metadata = {
  title: "brujer.ia",
  description:
    "El producto de inteligencia artificial de SATMA aplicado al marketing. Generación de contenido, análisis de audiencia, automatización de campañas y agentes conversacionales.",
};

const features = [
  {
    icon: ImageIcon,
    name: "Generación de contenido visual",
    body: "Imágenes, videos cortos y variantes A/B para campañas — listas para publicar en horas, no semanas.",
  },
  {
    icon: Brain,
    name: "Análisis predictivo",
    body: "Anticipa qué funciona antes de invertir el presupuesto. Modelos entrenados con tu propia data.",
  },
  {
    icon: MessageCircle,
    name: "Agentes conversacionales",
    body: "Asistentes que califican leads, responden FAQs y agendan citas — entrenados con tu tono de marca.",
  },
  {
    icon: Workflow,
    name: "Automatización de flujos",
    body: "Conectamos tus herramientas (CRM, redes, email) en pipelines que se ejecutan solos y se autoajustan.",
  },
  {
    icon: Target,
    name: "Targeting inteligente",
    body: "Segmentación dinámica por intención, no solo por demografía. Mejor CAC, mejor LTV.",
  },
  {
    icon: Zap,
    name: "Optimización continua",
    body: "Cada campaña aprende de la anterior. Las decisiones se vuelven más rápidas con cada ciclo.",
  },
];

export default function BrujeriaPage() {
  return (
    <>
      {/* SEO/GEO — brujer.ia is a product (SoftwareApplication), not a
          custom service. Distinct schema lets Google index it as a tool
          in its own right + show "in beta" availability metadata. */}
      <JsonLd
        data={buildSoftwareApplication({
          url: "/brujer-ia",
          name: "brujer.ia",
          description:
            "Plataforma propia de SATMA dedicada a IA aplicada al marketing. Combina generación automática de contenido visual, análisis predictivo de campañas, asistentes conversacionales, automatización de flujos y targeting inteligente. Beta privada para 10 marcas en 2026.",
          category: "MarketingApplication",
          applicationCategory: "BusinessApplication",
        })}
      />
      <JsonLd
        data={buildBreadcrumb([
          { name: "Inicio", url: "/" },
          { name: "brujer.ia", url: "/brujer-ia" },
        ])}
      />

      <section className="relative overflow-hidden border-b border-line bg-gradient-to-br from-navy via-navy to-[#1a1d2e] text-paper">
        {/* Brand aurora — la temática "IA mágica" justifica intensidad media */}
        <BrandAurora intensity="medium" mask="radial" />

        <Container className="relative grid items-center gap-16 pt-40 pb-24 lg:grid-cols-12 lg:pt-56 lg:pb-32">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-periwinkle/40 bg-periwinkle/[0.08] px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-periwinkle">
              <Wand2 size={14} />
              Producto SATMA · Beta privada
            </div>

            <h1 className="mt-10 font-display text-[clamp(2.25rem,6vw,5.5rem)] font-medium leading-[0.92] tracking-[-0.04em] text-paper">
              brujer<span className="text-periwinkle">.ia</span>
            </h1>
            <p className="mt-6 max-w-xl text-xl text-paper/75 lg:text-2xl text-pretty">
              Magia operacional para tu marketing — sin perder el toque humano.
            </p>
            <p className="mt-6 max-w-2xl text-lg text-paper/55 leading-relaxed text-pretty">
              Nuestra plataforma de IA aplicada combina modelos generativos, análisis predictivo y orquestación de agentes para acelerar lo que tu equipo ya hace bien.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="#features" variant="primary" size="lg">
                Ver capacidades <ArrowUpRight size={20} />
              </ButtonLink>
              <ButtonLink
                href={`mailto:${site.contact.email}?subject=Acceso beta brujer.ia`}
                size="lg"
                className="border border-paper/20 text-paper hover:border-paper/50"
              >
                Solicitar acceso beta
              </ButtonLink>
            </div>
          </div>

          <div className="relative lg:col-span-5">
            <div className="relative aspect-square w-full max-w-[460px] mx-auto">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-periwinkle/30 via-transparent to-transparent blur-2xl" />
              <Image
                src="/images/brujeria-mascot.png"
                alt="Mascota oficial de brujer.ia — la plataforma de IA aplicada al marketing de SATMA en beta privada para 2026"
                fill
                priority
                sizes="(max-width: 1024px) 80vw, 460px"
                className="object-contain"
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Features */}
      <section id="features" className="border-b border-line py-14 sm:py-20 lg:py-40">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
            <SectionEyebrow number="01" label="Capacidades" />
            <h2 className="mt-8 font-display text-[clamp(1.625rem,3.75vw,3.5rem)] font-medium leading-[1] tracking-[-0.03em] text-balance">
              Seis módulos. <span className="text-muted">Una sola plataforma.</span>
            </h2>
            <p className="mt-8 text-lg text-muted text-pretty">
              brujer.ia se integra con las herramientas que ya usas. Empezamos por los flujos donde más urge la velocidad y crecemos desde ahí.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-4 sm:mt-16 sm:grid-cols-2 lg:mt-24 lg:grid-cols-3">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={f.name} delay={i * 0.06}>
                  <Tilt3D className="h-full" intensity={4}>
                  <NeonGlowCard className="h-full rounded-2xl">
                  <BrandGlowCard className="h-full bg-ink-soft/55 p-8 shadow-card transition-all duration-300 hover:scale-[1.025] hover:border-periwinkle/50 hover:shadow-card-hover backdrop-blur-sm">
                    <div className="flex size-12 items-center justify-center rounded-xl border border-line bg-ink text-periwinkle">
                      <Icon size={20} />
                    </div>
                    <h3 className="mt-8 font-display text-2xl font-medium tracking-tight">
                      {f.name}
                    </h3>
                    <p className="mt-4 text-muted leading-relaxed text-pretty">
                      {f.body}
                    </p>
                  </BrandGlowCard>
                  </NeonGlowCard>
                  </Tilt3D>
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Beta CTA */}
      <section className="border-b border-line py-14 sm:py-20 lg:py-32">
        <Container>
          <Reveal>
            <NeonGlowCard className="rounded-3xl">
            <div className="rounded-3xl border border-periwinkle/30 bg-gradient-to-br from-periwinkle/[0.08] to-transparent p-10 shadow-card transition-all duration-300 hover:scale-[1.025] hover:border-periwinkle/55 hover:shadow-card-hover lg:p-16">
              <Sparkles size={28} className="text-periwinkle" />
              <h3 className="mt-6 max-w-3xl font-display text-[clamp(1.5rem,3.25vw,2.75rem)] font-medium leading-[1.05] tracking-[-0.02em] text-balance">
                Estamos aceptando 10 marcas en la beta privada de 2026.
              </h3>
              <p className="mt-6 max-w-2xl text-lg text-muted text-pretty">
                Si quieres ser de las primeras en operar con brujer.ia desde adentro, escríbenos. Calificamos contigo si encaja con tu industria y volumen.
              </p>
              <div className="mt-10">
                <ButtonLink
                  href={`mailto:${site.contact.email}?subject=Acceso beta brujer.ia`}
                  variant="primary"
                  size="lg"
                >
                  Solicitar acceso <ArrowUpRight size={20} />
                </ButtonLink>
              </div>
            </div>
            </NeonGlowCard>
          </Reveal>
        </Container>
      </section>

      <CtaFinal />
    </>
  );
}
