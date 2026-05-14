import { ArrowUpRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { BrandMesh } from "@/components/ui/brand-mesh";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { Reveal } from "@/components/animations/reveal";
import { SplitReveal } from "@/components/animations/split-reveal";
import { GiantBgText } from "@/components/animations/giant-bg-text";
import { site } from "@/lib/site";
import { getEditorial } from "@/lib/editorial";

export async function CtaFinal() {
  const editorial = await getEditorial();
  return (
    <section
      data-section="cta-final"
      className="relative overflow-hidden bg-periwinkle text-navy"
    >
      {/* Brand mesh — replaces the wireframe globes with cleaner geometric
          patterns. Dark-gray tint reads on the periwinkle bg, two different
          variants give the section visual rhythm without competing with the
          headline. The radial mask softens the edges. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[15%] -top-[20%] h-[120%] w-[60%] text-navy/35"
        style={{
          maskImage:
            "radial-gradient(closest-side, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(closest-side, black 20%, transparent 80%)",
        }}
      >
        <BrandMesh variant="grid" cell={36} strokeWidth={0.6} />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute -right-[15%] -bottom-[25%] h-[120%] w-[60%] text-navy/35"
        style={{
          maskImage:
            "radial-gradient(closest-side, black 20%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(closest-side, black 20%, transparent 80%)",
        }}
      >
        <BrandMesh variant="topo" cell={42} strokeWidth={0.6} />
      </div>

      {/* Giant scrubbed satma word — appears as you scroll into the section */}
      <div className="pointer-events-none absolute inset-x-0 bottom-[-8vw] flex justify-center">
        <GiantBgText
          text="satma"
          vw={28}
          ghost
          className="text-navy/30 [-webkit-text-stroke:1px_color-mix(in_oklch,_var(--color-navy)_15%,transparent)]"
        />
      </div>

      <Container className="relative z-10 py-14 sm:py-20 lg:py-40">
        <Reveal>
          {/* Centered headline — a rallying call reads stronger framed. */}
          <ScrollParallax speed={0.25} className="mx-auto flex max-w-4xl flex-col items-center text-center">
            {/* Brand mark eyebrow — "Agenc.IA Creativa" sits above the
                headline as the SATMA tagline. Rendered in italic display
                weight (not the uppercase-tracked style of regular section
                eyebrows) because it's a brand statement, not a category
                label. The period before "IA" makes the agencia + IA
                wordplay legible at a glance. */}
            <div className="font-display text-base italic font-medium text-navy/85 lg:text-lg">
              {editorial.ctaEyebrow}
            </div>
            <h2 className="mt-8 font-display text-[clamp(2rem,5.5vw,5.5rem)] font-medium leading-[0.94] tracking-[-0.04em] text-balance text-navy">
              {/* Char-cascade reveal on the primary headline — same SplitText
                  treatment as the Hero so the close mirrors the open. */}
              <SplitReveal
                text={editorial.ctaHeadline}
                stagger={0.028}
                duration={0.95}
                yOffsetEm={0.6}
              />
            </h2>

            {/* Sub-headline — completes the slogan with the SATMA promise.
                "Enfócate en tu Core Business" sets the action; "De lo
                demás nos encargamos nosotros" closes the loop. The word
                "nosotros" lands in semibold + non-italic so the verbal
                emphasis falls on WHO does the work — that's the agency's
                core promise. Whole-line Reveal (not SplitText) so the
                bold word can stand without char-by-char fragmentation. */}
            <Reveal delay={0.4}>
              <p className="mt-6 max-w-3xl text-balance font-display text-[clamp(1.25rem,2.5vw,2.125rem)] italic font-light leading-[1.2] tracking-[-0.01em] text-navy/85">
                {editorial.ctaSubheadlineBefore}{" "}
                <strong className="font-semibold not-italic text-navy">
                  {editorial.ctaSubheadlineEmphasis}
                </strong>
                .
              </p>
            </Reveal>

            {/* Small follow-up prompt right under the slogan, before the
                buttons. */}
            <Reveal delay={0.55}>
              <div className="mt-8 text-[11px] uppercase tracking-[0.32em] text-navy/55">
                {editorial.ctaPrompt}
              </div>
            </Reveal>
          </ScrollParallax>

          <div className="mt-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/contacto" size="lg" variant="dark">
                {editorial.ctaPrimaryLabel} <ArrowUpRight size={20} />
              </ButtonLink>
              <ButtonLink
                href={`mailto:${site.contact.email}`}
                size="lg"
                variant="outlineDark"
              >
                <Mail size={18} /> {editorial.ctaSecondaryLabel}
              </ButtonLink>
            </div>
            <div className="text-navy/70 lg:text-right">
              <div className="font-display text-base text-navy">
                {site.contact.email}
              </div>
              <div className="mt-1 text-sm">{site.contact.phone}</div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
