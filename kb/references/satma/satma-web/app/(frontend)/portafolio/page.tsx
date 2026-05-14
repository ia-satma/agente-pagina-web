import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { PageHero } from "@/components/sections/page-hero";
import { CtaFinal } from "@/components/sections/cta-final";
import { Reveal } from "@/components/animations/reveal";
import { NeonGlowCard } from "@/components/effects/neon-glow-card";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { GradientBlob } from "@/components/ui/gradient-blob";
import { VideoEmbed } from "@/components/ui/video-embed";
import { getPayloadClient } from "@/lib/payload-client";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import {
  JsonLd,
  buildBreadcrumb,
  buildCollectionPage,
} from "@/components/seo/page-schemas";

export const metadata: Metadata = {
  title: "Portafolio",
  description:
    "Branding, sistemas de identidad y diseño para marcas con ambición. Una selección de trabajo de SATMA — la parte visual del oficio.",
};

const CATEGORY_LABELS: Record<string, string> = {
  branding: "Branding & identidad",
  "design-system": "Sistema de diseño",
  logo: "Logo & marca",
  packaging: "Empaque",
  editorial: "Editorial",
  web: "Web & digital",
  campaign: "Campaña",
  other: "Otro",
};

type Cover = { url?: string; alt?: string } | string | number | null | undefined;

function getCoverUrl(cover: Cover): string | null {
  if (!cover) return null;
  if (typeof cover === "object" && "url" in cover && cover.url) return cover.url;
  return null;
}

export default async function PortfolioPage() {
  // Try to load portfolio items from Payload. The collection may be empty
  // (recently added) — handle empty state gracefully.
  let items: Array<{
    id: string | number;
    slug: string;
    title: string;
    client: string;
    category: string;
    year: number;
    summary: string;
    cover: string | null;
    videoUrl: string;
    externalUrl: string;
  }> = [];

  try {
    const payload = await getPayloadClient();
    const result = await payload.find({
      collection: "portfolio" as never,
      sort: "order",
      limit: 30,
      depth: 1,
      overrideAccess: true,
    });
    items = result.docs.map((doc) => {
      const d = doc as {
        id: string | number;
        slug?: string;
        title?: string;
        client?: string;
        category?: string;
        year?: number;
        summary?: string;
        cover?: Cover;
        videoUrl?: string;
        externalUrl?: string;
      };
      return {
        id: d.id,
        slug: d.slug ?? "",
        title: d.title ?? "",
        client: d.client ?? "",
        category: d.category ?? "branding",
        year: d.year ?? new Date().getFullYear(),
        summary: d.summary ?? "",
        cover: getCoverUrl(d.cover),
        videoUrl: d.videoUrl ?? "",
        externalUrl: d.externalUrl ?? "",
      };
    });
  } catch {
    // Collection might not be migrated yet. Empty state will render.
  }

  const isEmpty = items.length === 0;

  return (
    <>
      <JsonLd
        data={buildCollectionPage({
          url: "/portafolio",
          name: "Portafolio — SATMA",
          description:
            "Showcase visual de SATMA: branding, sistemas de identidad, diseño editorial, web y campañas para marcas con ambición.",
        })}
      />
      <JsonLd
        data={buildBreadcrumb([
          { name: "Inicio", url: "/" },
          { name: "Portafolio", url: "/portafolio" },
        ])}
      />

      <PageHero
        eyebrowNumber="08"
        eyebrowLabel="Portafolio"
        headline={
          <>
            Sistemas de marca,{" "}
            <span className="italic font-light text-periwinkle">
              identidad
            </span>{" "}
            y diseño.
          </>
        }
        description="Branding, naming, sistemas visuales y piezas de campaña. La parte del oficio donde el detalle decide la diferencia."
      >
        <ButtonLink href="/contacto" variant="primary" size="lg">
          Trabajemos juntos <ArrowUpRight size={20} />
        </ButtonLink>
        <ButtonLink
          href="/casos"
          size="lg"
          className="border border-paper/20 text-paper hover:border-paper/50"
        >
          Ver casos con métricas
        </ButtonLink>
      </PageHero>

      {/* Grid section */}
      <section className="relative overflow-hidden py-14 sm:py-20 lg:py-40">
        <ScrollParallax
          speed={0.6}
          className="absolute inset-0 pointer-events-none"
        >
          <GradientBlob
            tone="lilac"
            size={680}
            animate="float-a"
            className="-left-[10%] top-[12%] opacity-45"
          />
          <GradientBlob
            tone="periwinkle"
            size={560}
            animate="float-c"
            className="right-[-8%] bottom-[5%] opacity-40"
          />
        </ScrollParallax>

        <Container>
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <ScrollParallax speed={0.22}>
              <SectionEyebrow number="01" label="Selección" />
              <h2 className="mt-6 max-w-none font-display text-[clamp(1.875rem,4.5vw,4.25rem)] font-medium leading-[1] tracking-[-0.03em] text-balance sm:mt-8 sm:max-w-[20ch]">
                <span className="text-muted">Diseño que</span> no se olvida
                fácil.
              </h2>
            </ScrollParallax>
          </div>

          {isEmpty ? (
            <Reveal delay={0.2}>
              <NeonGlowCard className="mt-16 rounded-3xl lg:mt-24">
                <div className="flex flex-col items-center justify-center rounded-3xl border border-line bg-ink-soft/40 p-16 text-center shadow-card lg:p-24">
                  <Sparkles size={32} className="text-periwinkle" />
                  <h3 className="mt-6 max-w-2xl font-display text-2xl font-medium tracking-tight text-pretty lg:text-3xl">
                    Estamos curando esta selección.
                  </h3>
                  <p className="mt-4 max-w-xl text-muted leading-relaxed text-pretty">
                    Pronto vamos a publicar aquí piezas de branding,
                    identidad y diseño editorial de proyectos recientes.
                    Mientras, los casos con resultados están disponibles.
                  </p>
                  <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                    <ButtonLink href="/casos" variant="primary" size="md">
                      Ver casos con métricas{" "}
                      <ArrowUpRight size={18} />
                    </ButtonLink>
                    <ButtonLink
                      href={`mailto:${site.contact.email}?subject=Solicito portafolio de branding`}
                      variant="secondary"
                      size="md"
                    >
                      Solicitar deck completo
                    </ButtonLink>
                  </div>
                </div>
              </NeonGlowCard>
            </Reveal>
          ) : (
            <div className="mt-20 flex flex-col gap-32 lg:mt-32 lg:gap-48">
              {items.map((item, i) => {
                const Tag = item.externalUrl ? "a" : Link;
                const href = item.externalUrl || `/portafolio/${item.slug}`;
                const externalProps = item.externalUrl
                  ? { target: "_blank" as const, rel: "noopener noreferrer" }
                  : {};
                // Alternating caption alignment for editorial rhythm
                const isOdd = i % 2 === 1;
                return (
                  <Reveal key={item.id} delay={0.05}>
                    <article className="relative">
                      {/* ── Ambient backdrop — the cover image blurred + scaled
                            sits behind the video as atmospheric stage light.
                            Falls back to a periwinkle aurora if no cover. ── */}
                      <div className="pointer-events-none absolute inset-x-[-10%] -inset-y-12 -z-10 overflow-hidden">
                        {item.cover ? (
                          <Image
                            src={item.cover}
                            alt=""
                            fill
                            sizes="100vw"
                            className="object-cover scale-110 opacity-30 blur-3xl"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(179,203,255,0.25),transparent_60%)]" />
                        )}
                      </div>

                      {/* ── Caption row above the video — small editorial line
                            that frames the piece. ── */}
                      <ScrollParallax speed={0.12} className="mx-auto max-w-5xl">
                        <div
                          className={cn(
                            "mb-8 flex flex-col gap-3 text-xs uppercase tracking-[0.3em] sm:flex-row sm:items-center sm:justify-between",
                            isOdd && "sm:flex-row-reverse",
                          )}
                        >
                          <span className="text-periwinkle">
                            {String(i + 1).padStart(2, "0")} ·{" "}
                            {CATEGORY_LABELS[item.category] ?? item.category}
                          </span>
                          {(item.client || item.year) && (
                            <span className="text-muted">
                              {[item.client, item.year]
                                .filter(Boolean)
                                .join(" · ")}
                            </span>
                          )}
                        </div>
                      </ScrollParallax>

                      {/* ── Video stage — 16:9 frame, centered, with theatrical
                            border + glow underneath. The link wraps the whole
                            stage so click works. ── */}
                      <ScrollParallax speed={0.18}>
                        <div className="relative mx-auto max-w-5xl">
                          {/* Floor reflection / spot light — periwinkle glow that
                              radiates from below the video, simulating a stage
                              light bouncing off polished floor. */}
                          <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-12 left-1/2 -z-10 h-56 w-[85%] -translate-x-1/2 rounded-full bg-gradient-to-b from-periwinkle/35 via-periwinkle/10 to-transparent blur-[60px]"
                          />

                          <NeonGlowCard className="rounded-3xl">
                            <Tag
                              href={href}
                              {...externalProps}
                              className="group relative block aspect-video overflow-hidden rounded-3xl border border-periwinkle/30 bg-[#020306] shadow-[0_40px_100px_-30px_rgba(110,144,219,0.55)] transition-all duration-500 hover:scale-[1.015] hover:border-periwinkle/55"
                            >
                              {/* Cover poster (always rendered first as fallback) */}
                              {item.cover ? (
                                <Image
                                  src={item.cover}
                                  alt={item.title}
                                  fill
                                  sizes="(max-width: 768px) 90vw, (max-width: 1024px) 85vw, 1024px"
                                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                                />
                              ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-periwinkle/15 via-lilac/10 to-transparent" />
                              )}
                              {/* Video iframe (autoplay muted loop) */}
                              {item.videoUrl && (
                                <VideoEmbed
                                  url={item.videoUrl}
                                  title={item.title}
                                />
                              )}

                              {/* Cinematic vignette inside the frame — subtle
                                  darkening at edges so the video pops central. */}
                              <div
                                aria-hidden
                                className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(0,0,0,0.4)_100%)]"
                              />

                              {/* Top-right corner indicator (chevron + open
                                  hint that fades in on hover). */}
                              <div className="pointer-events-none absolute right-3 top-3 flex items-center gap-2 rounded-full border border-paper/20 bg-black/40 px-2.5 py-1 text-xs uppercase tracking-[0.18em] text-paper/85 backdrop-blur transition-all duration-300 group-hover:border-periwinkle/55 group-hover:bg-periwinkle/15 sm:right-5 sm:top-5 sm:px-3 sm:py-1.5 sm:text-[10px] sm:tracking-[0.3em]">
                                Ver
                                <ArrowUpRight
                                  size={12}
                                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                />
                              </div>
                            </Tag>
                          </NeonGlowCard>

                          {/* Hairline scan-line below the frame — sello de
                              marca, picks up the periwinkle from the glow. */}
                          <div
                            aria-hidden
                            className="pointer-events-none absolute -bottom-px left-1/2 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-periwinkle/40 to-transparent"
                          />
                        </div>
                      </ScrollParallax>

                      {/* ── Caption block below the video — discreto, no
                            shouty. The video is the protagonista; the title
                            es solo etiqueta editorial. ── */}
                      <ScrollParallax
                        speed={-0.12}
                        className={cn(
                          "mx-auto mt-8 max-w-3xl",
                          isOdd ? "text-right" : "text-left",
                          "lg:text-center",
                        )}
                      >
                        <Tag
                          href={href}
                          {...externalProps}
                          className="group inline-block focus-ring"
                        >
                          <h3 className="font-display text-base font-medium tracking-tight text-off transition-colors duration-300 group-hover:text-periwinkle lg:text-lg text-balance">
                            {item.title}
                          </h3>
                        </Tag>
                        {item.summary && (
                          <p className="mt-3 text-sm text-muted leading-relaxed text-pretty">
                            {item.summary}
                          </p>
                        )}
                      </ScrollParallax>
                    </article>
                  </Reveal>
                );
              })}
            </div>
          )}
        </Container>
      </section>

      <CtaFinal />
    </>
  );
}
