import { Container } from "@/components/ui/container";
import { Globe } from "@/components/ui/globe";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { Reveal } from "@/components/animations/reveal";
import { WordReveal } from "@/components/animations/word-reveal";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { cn } from "@/lib/utils";

type Props = {
  eyebrowNumber: string;
  eyebrowLabel: string;
  /** Headline split as `{normal} <em>{accent}</em> {after}`. */
  headline: React.ReactNode;
  description?: React.ReactNode;
  /** Optional content rendered below the description (badges, CTAs). */
  children?: React.ReactNode;
  /** Tone — `dark` (default) keeps the navy hero; `accent` uses periwinkle. */
  tone?: "dark" | "accent";
  /** Extra wrapper class for the section. */
  className?: string;
};

export function PageHero({
  eyebrowNumber,
  eyebrowLabel,
  headline,
  description,
  children,
  tone = "dark",
  className,
}: Props) {
  const isAccent = tone === "accent";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b border-line",
        isAccent
          ? "bg-periwinkle text-navy"
          : "bg-navy text-paper",
        className,
      )}
    >
      <ScrollParallax
        speed={0.7}
        className="pointer-events-none absolute -right-[18%] top-1/2 h-[140%] w-auto -translate-y-1/2"
      >
        <Globe
          className={cn(
            "h-full w-full",
            isAccent ? "text-navy/15" : "text-periwinkle/20",
          )}
          meridians={13}
          parallels={11}
          strokeWidth={0.35}
        />
      </ScrollParallax>

      <Container className="relative pt-40 pb-24 lg:pt-56 lg:pb-32">
        <ScrollParallax speed={0.28}>
          <SectionEyebrow
            number={eyebrowNumber}
            label={eyebrowLabel}
            className={cn(isAccent ? "text-navy/55" : "text-paper/55")}
          />
        </ScrollParallax>
        <ScrollParallax speed={0.2}>
          <h1
            className={cn(
              "mt-8 max-w-[18ch] font-display text-[clamp(2rem,5vw,4.75rem)] font-medium leading-[0.95] tracking-[-0.035em] text-balance",
            )}
          >
            {typeof headline === "string" ? <WordReveal text={headline} /> : headline}
          </h1>
        </ScrollParallax>

        {description && (
          <ScrollParallax speed={-0.18}>
            <Reveal delay={0.3} className="mt-8 max-w-2xl">
              <p
                className={cn(
                  "text-lg leading-relaxed lg:text-xl text-pretty",
                  isAccent ? "text-navy/75" : "text-paper/75",
                )}
              >
                {description}
              </p>
            </Reveal>
          </ScrollParallax>
        )}

        {children && (
          <ScrollParallax speed={-0.25}>
            <Reveal delay={0.5} className="mt-10 flex flex-wrap items-center gap-3">
              {children}
            </Reveal>
          </ScrollParallax>
        )}
      </Container>
    </section>
  );
}
