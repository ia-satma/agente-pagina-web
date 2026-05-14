import { ArrowUpRight, Play, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Globe } from "@/components/ui/globe";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { Reveal } from "@/components/animations/reveal";
import { SplitReveal } from "@/components/animations/split-reveal";
import { Magnetic } from "@/components/effects/magnetic";
import { Counter } from "@/components/effects/counter";
import { BrandAurora } from "@/components/effects/brand-aurora";
import { HoverAccent } from "@/components/effects/hover-accent";

export function Hero() {
  return (
    <section
      data-hero
      className="relative min-h-[100svh] overflow-hidden bg-ink text-off"
    >
      {/* Subtle aurora — gives the hero atmosphere now that the video lives in HeroVideoIntro */}
      <BrandAurora intensity="subtle" mask="from-right" />

      {/* ── Top dissolve — receives the exit of HeroVideoIntro.
            Mirrors the bottom fade of the video stage so the seam disappears.
            `from-ink` is theme-aware → works in dark and light mode. ── */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[22%] bg-gradient-to-b from-ink via-ink/70 to-transparent" />

      {/* ── Lingering periwinkle halo right at the seam — picks up the glow
            from the bottom of the video and carries it into the hero. ── */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[18%]"
        style={{
          background:
            "radial-gradient(120% 100% at 50% 0%, rgba(179, 203, 255, 0.10), transparent 60%)",
          mixBlendMode: "screen",
        }}
      />

      {/* Bottom fade for clean transition into Marquee/Manifiesto */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-ink to-transparent" />

      {/* ── Animated wireframe globe — brand motif from the SATMA brand book.
            Sits behind the "Edición evolutiva" content, off to the right.
            Wrapped in ScrollParallax so it drifts as the user scrolls past
            (depth illusion). The Globe component handles its own internal
            3D rotation. ── */}
      <ScrollParallax
        speed={0.7}
        className="pointer-events-none absolute right-[-18%] top-[12%] z-0 hidden h-[78%] w-[78%] max-w-[820px] items-center justify-center md:flex lg:right-[-12%] lg:top-[8%] lg:h-[88%] lg:w-[68%]"
      >
        {/* Soft halo behind the globe so it reads on both themes without
             needing different fill colors. */}
        <div
          className="absolute inset-[12%] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(179, 203, 255, 0.18), transparent 70%)",
          }}
        />
        <Globe
          className="relative h-full w-full text-periwinkle/30 [stroke-linecap:round]"
          meridians={13}
          parallels={11}
          strokeWidth={0.35}
          speedSec={140}
        />
      </ScrollParallax>

      {/* Mobile-only smaller globe — sits as a decorative bullet right above
          the "Edición evolutiva" badge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[14%] z-0 flex h-44 w-44 -translate-x-1/2 items-center justify-center md:hidden"
      >
        <div
          className="absolute inset-[10%] rounded-full blur-2xl"
          style={{
            background:
              "radial-gradient(closest-side, rgba(179, 203, 255, 0.22), transparent 70%)",
          }}
        />
        <Globe
          className="relative h-full w-full text-periwinkle/35"
          meridians={11}
          parallels={9}
          strokeWidth={0.4}
          speedSec={120}
        />
      </div>

      <Container className="relative z-10 flex min-h-[100svh] flex-col justify-end pb-16 pt-32 lg:pb-20 lg:pt-40">
        <ScrollParallax speed={0.35}>
          <Reveal immediate delay={0.2}>
            <div className="inline-flex items-center gap-3 rounded-full border border-line bg-ink/60 px-4 py-1.5 backdrop-blur">
              <Sparkles size={13} className="text-periwinkle" />
              <span className="text-[11px] uppercase tracking-[0.3em] text-muted">
                Edición evolutiva 2026
              </span>
            </div>
          </Reveal>
        </ScrollParallax>

        <ScrollParallax speed={0.2}>
          <h1 className="mt-8 max-w-[20ch] font-display text-[clamp(2.25rem,5.25vw,5rem)] font-medium leading-[1] tracking-[-0.025em] text-off text-balance">
            {/* GSAP SplitText cascade — chars rise + unblur in sequence.
                The three lines fire one after another so the eye reads them
                as a single cinematic unfurl. `inteligencia.` gets a slightly
                slower stagger so the closing word feels weighted. */}
            <SplitReveal text="Donde la " immediate delay={0.3} />
            <HoverAccent>
              <SplitReveal text="creatividad" immediate delay={0.55} />
            </HoverAccent>
            <br />
            <span className="text-muted">
              <SplitReveal text="se encuentra con la" immediate delay={0.85} />
            </span>
            <br />
            <HoverAccent className="italic font-light text-periwinkle">
              <SplitReveal
                text="inteligencia."
                immediate
                delay={1.25}
                stagger={0.045}
                duration={1}
              />
            </HoverAccent>
          </h1>
        </ScrollParallax>

        <ScrollParallax speed={-0.12}>
          {/* Bumped delays so the body copy lands AFTER the new char-cascade
              of the headline finishes (~1.8s with the SplitText timing). */}
          <Reveal immediate delay={1.95} className="mt-7 max-w-xl">
            <p className="text-base text-muted lg:text-lg text-pretty">
              Marketing humano, potenciado con IA. Diseñamos estrategias que combinan instinto creativo con la velocidad de las herramientas más avanzadas.
            </p>
          </Reveal>
        </ScrollParallax>

        <ScrollParallax speed={-0.2}>
          <Reveal immediate delay={2.15} className="mt-8 flex flex-wrap items-center gap-3">
            <Magnetic strength={0.3} radius={140}>
              <ButtonLink href="/contacto" variant="primary" size="md">
                Empezar un proyecto <ArrowUpRight size={18} />
              </ButtonLink>
            </Magnetic>
            <Magnetic strength={0.2}>
              <ButtonLink href="/casos" variant="secondary" size="md">
                <Play size={14} /> Ver casos
              </ButtonLink>
            </Magnetic>
          </Reveal>
        </ScrollParallax>

        <ScrollParallax speed={-0.3}>
          <Reveal
            immediate
            delay={2.4}
            className="mt-14 flex items-end justify-between gap-8 border-t border-line pt-6"
          >
            <div className="font-display text-[10px] uppercase leading-relaxed tracking-[0.3em] text-muted">
              Scroll
              <br />
              para evolucionar ↓
            </div>
            <div className="hidden gap-10 sm:flex">
              <Stat to={10} prefix="+" label="años" />
              <Stat to={150} prefix="+" label="proyectos" />
              <Stat to={5} label="industrias" />
            </div>
          </Reveal>
        </ScrollParallax>
      </Container>
    </section>
  );
}

function Stat({
  to,
  label,
  prefix,
}: {
  to: number;
  label: string;
  prefix?: string;
}) {
  return (
    <div>
      <div className="font-display text-2xl tracking-tight text-off lg:text-3xl">
        <Counter to={to} prefix={prefix} />
      </div>
      <div className="mt-1 text-[10px] uppercase tracking-[0.3em] text-muted">
        {label}
      </div>
    </div>
  );
}
