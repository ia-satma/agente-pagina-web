import type { Metadata } from "next";
import { ArrowUpRight, Mail, Sparkles } from "lucide-react";
import Link from "next/link";

// Lucide v1.11 dropped the brand-icon set. We inline the LinkedIn glyph
// from the public Simple Icons project so the founder card has a proper
// platform indicator instead of a generic external-link icon.
function LinkedInGlyph({ size = 15 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { HeroParallax3D } from "@/components/sections/hero-parallax-3d";
import { Manifiesto } from "@/components/sections/manifiesto";
import { Equipo } from "@/components/sections/equipo";
import { Testimonios } from "@/components/sections/testimonios";
import { CtaFinal } from "@/components/sections/cta-final";
import { Reveal } from "@/components/animations/reveal";
import { Counter } from "@/components/effects/counter";
import { NeonGlowCard } from "@/components/effects/neon-glow-card";
import { Tilt3D } from "@/components/effects/tilt-3d";
import { site } from "@/lib/site";
import { getEditorial } from "@/lib/editorial";
import {
  JsonLd,
  buildAboutPage,
  buildBreadcrumb,
  buildSantiagoSchema,
} from "@/components/seo/page-schemas";

export const metadata: Metadata = {
  title: "Agencia",
  description:
    "satma es una agencia creativa con más de una década en Monterrey. Combinamos talento humano con inteligencia artificial para construir marcas que importan.",
};

export default async function AgenciaPage() {
  const editorial = await getEditorial();
  // Adapt the editorial array shape to the Counter component's
  // existing prop names (`to` instead of `value`).
  const stats = editorial.agenciaStats.map((s) => ({
    to: s.value,
    prefix: s.prefix,
    suffix: s.suffix,
    label: s.label,
  }));
  const valores = editorial.valores;

  return (
    <>
      {/* SEO/GEO — AboutPage + Breadcrumb + expanded Person (Santiago) */}
      <JsonLd
        data={buildAboutPage({
          url: "/agencia",
          name: "Agencia — SATMA",
          description:
            "SATMA es una agencia creativa con más de una década en Monterrey. Cuatro valores operativos: honestidad operativa, profundidad sectorial, tecnología al servicio y talento mexicano.",
        })}
      />
      <JsonLd
        data={buildBreadcrumb([
          { name: "Inicio", url: "/" },
          { name: "Agencia", url: "/agencia" },
        ])}
      />
      <JsonLd data={buildSantiagoSchema()} />

      {/* Hero composite — the parallax (woman → robot reveal lens) sits
          as the backdrop, the eyebrow + headline + CTAs float on top
          like a movie title card anchored bottom-left.
            • z-40 puts the overlay ABOVE the parallax's internal z-30
              vignettes (so text reads cleanly over the bottom dissolve).
            • `pointer-events-none` on the overlay shell lets the cursor
              fall through to the parallax (lens still tracks); inner
              `pointer-events-auto` re-enables interaction on the CTAs.
            • text-off / SectionEyebrow auto-flip with the active theme,
              so the headline reads on both the dark-galaxy and the
              light-paper variants of the parallax stage. */}
      <div className="relative">
        <HeroParallax3D />
        <div className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-end">
          <Container className="pointer-events-auto pb-16 sm:pb-20 lg:pb-28">
            <Reveal>
              <SectionEyebrow
                number="00"
                label="Agencia"
                className="text-off/55"
              />
            </Reveal>
            <Reveal delay={0.15}>
              <h1 className="mt-6 max-w-[18ch] font-display text-[clamp(2rem,5vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.035em] text-balance text-off lg:mt-8">
                Una agencia de{" "}
                <span className="italic font-light text-periwinkle">
                  personas
                </span>
                .
                <br />
                Que usa IA como herramienta.
              </h1>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-off/75 text-pretty lg:mt-8 lg:text-xl">
                Llevamos más de una década construyendo marcas para sectores
                regulados y exigentes. En 2026 evolucionamos: integrar
                inteligencia artificial sin perder el oficio que nos trajo
                hasta aquí.
              </p>
            </Reveal>
            <Reveal delay={0.45}>
              <div className="mt-8 flex flex-wrap items-center gap-3 lg:mt-10">
                <ButtonLink href="/contacto" variant="primary" size="lg">
                  Empezar un proyecto <ArrowUpRight size={20} />
                </ButtonLink>
                <ButtonLink
                  href="/casos"
                  size="lg"
                  className="border border-off/20 text-off hover:border-off/50"
                >
                  Ver casos
                </ButtonLink>
              </div>
            </Reveal>
          </Container>
        </div>
      </div>

      {/* Stats */}
      <section className="border-b border-line py-12 sm:py-16 lg:py-28">
        <Container>
          <div className="grid grid-cols-2 gap-y-12 gap-x-8 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div>
                  <div className="font-display text-5xl font-medium tracking-tight lg:text-7xl">
                    <Counter to={s.to} prefix={s.prefix} suffix={s.suffix} />
                  </div>
                  <div className="mt-3 text-xs uppercase tracking-[0.25em] text-muted">
                    {s.label}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Valores */}
      <section className="border-b border-line py-14 sm:py-20 lg:py-40">
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <SectionEyebrow number="01" label={editorial.valoresEyebrow} />
              <h2 className="mt-8 font-display text-[clamp(1.625rem,3.75vw,3.5rem)] font-medium leading-[1.02] tracking-[-0.03em] text-balance">
                {editorial.valoresHeadline}
              </h2>
              <p className="mt-8 max-w-md text-lg text-muted text-pretty">
                {editorial.valoresIntro}
              </p>
            </div>
            <div className="lg:col-span-7">
              <ul className="grid gap-3 sm:grid-cols-2">
                {valores.map((v, i) => (
                  <Reveal key={v.title} delay={i * 0.08}>
                    <Tilt3D className="h-full" intensity={4}>
                      <NeonGlowCard className="h-full rounded-2xl">
                        <li className="h-full rounded-2xl border border-line bg-ink-soft/40 p-8 shadow-card transition-all duration-300 hover:scale-[1.025] hover:border-periwinkle/50 hover:shadow-card-hover lg:p-10">
                          <Sparkles size={18} className="text-periwinkle" />
                          <h3 className="mt-5 font-display text-xl font-medium tracking-tight">
                            {v.title}
                          </h3>
                          <p className="mt-3 text-muted leading-relaxed text-pretty">
                            {v.body}
                          </p>
                        </li>
                      </NeonGlowCard>
                    </Tilt3D>
                  </Reveal>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <Manifiesto />

      {/* ── Founder section — anchored at #santiago-alvarez so the
            Person schema (which uses url: ".../#santiago-alvarez")
            resolves to a real piece of content. Boosts E-E-A-T:
            search + AI engines find an explicit "who runs this".
            The id matches the schema URL so Google can deep-link. ── */}
      <section
        id="santiago-alvarez"
        className="border-b border-line py-14 sm:py-20 lg:py-32"
      >
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionEyebrow number="03" label={editorial.santiagoEyebrow} />
              <h2 className="mt-8 font-display text-[clamp(1.75rem,4vw,3rem)] font-medium leading-[1.05] tracking-[-0.03em] text-balance">
                Santiago Álvarez
              </h2>
              <div className="mt-3 text-sm uppercase tracking-[0.22em] text-periwinkle">
                {editorial.santiagoRolePill}
              </div>
            </div>

            <div className="lg:col-span-8">
              <Reveal>
                {/* Bio paragraphs from Editorial → santiagoBioParagraphs.
                    Editor controls the wording; we render each as a
                    paragraph keeping the prose styling consistent. */}
                <div className="space-y-5 text-pretty text-base text-muted leading-relaxed lg:text-lg">
                  {editorial.santiagoBioParagraphs.map((p, i) => (
                    <p key={i}>{p.text}</p>
                  ))}
                </div>

                <div className="mt-10 flex flex-wrap items-center gap-3">
                  <Link
                    href={`mailto:${site.contact.email}`}
                    className="group inline-flex items-center gap-2 rounded-full border border-line bg-ink-soft/40 px-5 py-2.5 text-sm transition-colors hover:border-periwinkle/60 hover:text-periwinkle"
                  >
                    <Mail size={15} />
                    {site.contact.email}
                  </Link>
                  <Link
                    href={site.socials.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 rounded-full border border-line bg-ink-soft/40 px-5 py-2.5 text-sm transition-colors hover:border-periwinkle/60 hover:text-periwinkle"
                  >
                    <LinkedInGlyph size={15} />
                    LinkedIn
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    />
                  </Link>
                </div>

                {/* Credentials snippet — feeds the Person schema's
                    knowsAbout / hasOccupation visually so the data is
                    citable on the page itself, not just in JSON-LD. */}
                {/* Credentials grid — editable from Editorial →
                    santiagoCredentials. Reads as the Person schema's
                    knowsAbout / hasOccupation visually citable on the page. */}
                <dl className="mt-10 grid gap-6 border-t border-line pt-8 sm:grid-cols-3">
                  {editorial.santiagoCredentials.map((c, i) => (
                    <div key={i}>
                      <dt className="text-[11px] uppercase tracking-[0.22em] text-muted/80">
                        {c.label}
                      </dt>
                      <dd className="mt-2 font-display text-base text-off">
                        {c.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            </div>
          </div>
        </Container>
      </section>

      {/* Public team grid — pulled from Payload `team` collection.
          Auto-skips the Santiago row (he has his own bio above) so this
          area shows the rest of the people / area teams. Re-renders
          when CMS docs change via the collection's afterChange revalidate
          hook. */}
      <Equipo />

      <Testimonios />
      <CtaFinal />
    </>
  );
}
