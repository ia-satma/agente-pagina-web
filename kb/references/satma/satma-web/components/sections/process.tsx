import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { GradientBlob } from "@/components/ui/gradient-blob";
import { Reveal } from "@/components/animations/reveal";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { getEditorial } from "@/lib/editorial";

export async function Process() {
  const editorial = await getEditorial();
  const steps = editorial.processFases.map((f) => ({
    n: f.number,
    title: f.title,
    body: f.body,
  }));

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 lg:py-40">
      <ScrollParallax speed={0.75} className="absolute inset-0 pointer-events-none">
        <GradientBlob
          tone="lilac"
          size={720}
          animate="float-a"
          className="-left-[15%] top-[30%] opacity-45"
        />
        <GradientBlob
          tone="periwinkle"
          size={580}
          animate="float-c"
          className="right-[-8%] bottom-[-10%] opacity-40"
        />
      </ScrollParallax>
      <Container>
        {/* Centered intro — process feels like a journey; central framing
            anticipates the steps below. */}
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <ScrollParallax speed={0.25}>
            <SectionEyebrow number="06" label={editorial.processEyebrow} />
            {/* Headline editable from Editorial → processHeadline.
                Whole-line text: editor controls the wording, no
                split-by-period assumptions. */}
            <h2 className="mt-8 font-display text-[clamp(1.875rem,4.5vw,4.25rem)] font-medium leading-[1] tracking-[-0.03em] text-balance text-off">
              {editorial.processHeadline}
            </h2>
          </ScrollParallax>
        </div>

        <ol className="mt-20 space-y-2 lg:mt-28">
          {steps.map((s, i) => (
            <ScrollParallax key={s.n} speed={0.12 + (i % 3) * 0.08}>
              <Reveal delay={i * 0.05}>
              <li className="group relative grid items-baseline gap-6 rounded-2xl border border-line/70 bg-transparent px-6 py-8 shadow-card transition-all duration-300 hover:scale-[1.025] hover:border-periwinkle/50 hover:bg-ink-soft/85 hover:shadow-card-hover lg:grid-cols-12 lg:gap-12 lg:px-8 lg:py-10">
                <div className="font-display text-sm tracking-[0.3em] text-periwinkle lg:col-span-2">
                  {s.n}
                </div>
                <div className="font-display text-3xl font-medium tracking-tight lg:col-span-4 lg:text-5xl">
                  {s.title}
                </div>
                <p className="text-muted leading-relaxed lg:col-span-6 lg:text-lg text-pretty">
                  {s.body}
                </p>
              </li>
              </Reveal>
            </ScrollParallax>
          ))}
        </ol>
      </Container>
    </section>
  );
}
