import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { GradientBlob } from "@/components/ui/gradient-blob";
import { Reveal } from "@/components/animations/reveal";
import { ScrollScrubReveal } from "@/components/animations/scroll-scrub-reveal";
import { NeonGlowCard } from "@/components/effects/neon-glow-card";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { getEditorial } from "@/lib/editorial";

export async function Manifiesto() {
  const editorial = await getEditorial();
  const pillars = editorial.manifestoPilares.map((p) => ({
    n: p.number,
    title: p.title,
    body: p.body,
  }));

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-40">
      <ScrollParallax speed={0.75} className="absolute inset-0 pointer-events-none">
        <GradientBlob
          tone="periwinkle"
          size={760}
          animate="float-a"
          className="-left-[10%] -top-[20%] opacity-50"
        />
        <GradientBlob
          tone="lilac"
          size={620}
          animate="float-b"
          className="-right-[5%] bottom-[5%] opacity-40"
        />
      </ScrollParallax>
      <Container>
        {/* Centered statement layout — Manifiesto is a declaration, not an
            inventory. Centered text reads like a thesis, not a column. */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <ScrollParallax speed={0.28}>
            <SectionEyebrow number="01" label={editorial.manifestoEyebrow} />
          </ScrollParallax>

          <ScrollParallax speed={0.22}>
            {/* Headline editable from Editorial global → manifestoHeadline.
                Whole-line Reveal instead of WordReveal so editors can change
                the wording freely without our split-by-period assumptions
                breaking. */}
            <Reveal>
              <h2 className="mt-8 font-display text-[clamp(1.875rem,4.5vw,4.25rem)] font-medium leading-[1] tracking-[-0.03em] text-off text-balance">
                {editorial.manifestoHeadline}
              </h2>
            </Reveal>
          </ScrollParallax>

          <ScrollParallax speed={-0.18}>
            <Reveal
              delay={0.4}
              className="mt-10 max-w-2xl text-lg text-muted lg:text-xl text-pretty"
            >
              {editorial.manifestoBody}
            </Reveal>
          </ScrollParallax>
        </div>

        <ScrollScrubReveal
          className="mt-20 grid gap-8 lg:mt-28 lg:grid-cols-3"
          y={50}
          stagger={0.18}
        >
          {pillars.map((p) => (
            <NeonGlowCard key={p.n} className="h-full rounded-2xl">
            <article
              className="group relative h-full overflow-hidden rounded-2xl border border-line bg-ink-soft/70 p-8 shadow-card transition-all duration-300 hover:scale-[1.025] hover:border-periwinkle/50 hover:shadow-card-hover lg:p-10"
            >
              <div className="font-display text-xs uppercase tracking-[0.3em] text-periwinkle">
                {p.n}
              </div>
              <h3 className="mt-6 font-display text-3xl font-medium tracking-tight text-off lg:text-4xl">
                {p.title}
              </h3>
              <p className="mt-4 text-muted leading-relaxed">{p.body}</p>
              <div className="pointer-events-none absolute -right-20 -bottom-20 size-48 rounded-full bg-periwinkle/5 blur-3xl transition-all duration-300 group-hover:bg-periwinkle/15" />
            </article>
            </NeonGlowCard>
          ))}
        </ScrollScrubReveal>
      </Container>
    </section>
  );
}
