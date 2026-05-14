import Link from "next/link";
import {
  ArrowUpRight,
  Scale,
  Stethoscope,
  Users,
  ShoppingBag,
  Landmark,
  Sparkles,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { GradientBlob } from "@/components/ui/gradient-blob";
import { Reveal } from "@/components/animations/reveal";
import { HoverAccent } from "@/components/effects/hover-accent";
import { ScrollParallax } from "@/components/effects/scroll-parallax";
import { getPayloadClient } from "@/lib/payload-client";
import { cn } from "@/lib/utils";

const ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Scale,
  Stethoscope,
  Users,
  ShoppingBag,
  Landmark,
  Sparkles,
};

export async function Industries() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "industries",
    sort: "order",
    limit: 30,
    overrideAccess: true,
  });

  const industries = result.docs.map((doc) => ({
    id: doc.id,
    slug: (doc as { slug?: string }).slug ?? "",
    name: doc.name,
    body: (doc as { shortDescription?: string }).shortDescription ?? "",
    Icon: ICONS[(doc as { icon?: string }).icon ?? "Sparkles"] ?? Sparkles,
    badge: (doc as { comingSoon?: boolean }).comingSoon ? "Próximamente" : undefined,
  }));

  return (
    <section
      id="industrias"
      className="relative overflow-hidden py-14 sm:py-20 lg:py-40"
    >
      <ScrollParallax speed={0.6} className="absolute inset-0 pointer-events-none">
        <GradientBlob
          tone="lilac"
          size={680}
          animate="float-b"
          className="-left-[12%] top-[8%] opacity-45"
        />
        <GradientBlob
          tone="periwinkle"
          size={560}
          animate="float-a"
          className="right-[-8%] bottom-[-5%] opacity-50"
        />
      </ScrollParallax>
      <Container>
        {/* Right-aligned layout — list on the LEFT col, eyebrow + headline +
            intro on the RIGHT col (text-right). Breaks the left/center
            cadence of sibling sections. */}
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <ul className="divide-y divide-line border-y border-line">
              {industries.map((ind, i) => {
                const { Icon } = ind;
                const baseClass = cn(
                  // Permanent -mx-4 px-4 so hover bg fills wider without
                  // shifting content (was hover:px-4 → caused layout jump
                  // on mobile/tap, also bad for keyboard focus state).
                  "group -mx-4 flex items-start gap-6 px-4 py-8 transition-colors",
                  ind.badge
                    ? "cursor-default opacity-60"
                    : "hover:bg-ink-soft/40",
                );

                const inner = (
                  <>
                    <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border border-line bg-ink text-muted transition-colors group-hover:border-periwinkle/40 group-hover:text-periwinkle">
                      <Icon size={20} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-2xl font-medium tracking-tight lg:text-3xl">
                          {ind.name}
                        </h3>
                        {ind.badge && (
                          <span className="rounded-full border border-line px-3 py-0.5 text-[10px] uppercase tracking-[0.25em] text-muted">
                            {ind.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-muted leading-relaxed text-pretty">
                        {ind.body}
                      </p>
                    </div>
                    {!ind.badge && (
                      <ArrowUpRight
                        size={20}
                        className="mt-2 shrink-0 text-muted transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-periwinkle"
                      />
                    )}
                  </>
                );

                return (
                  <ScrollParallax key={ind.id} speed={0.1 + (i % 3) * 0.06}>
                    <Reveal delay={i * 0.06}>
                      {/* `id={ind.slug}` makes the row addressable as an
                          anchor (e.g. /industrias#abogados from the
                          Santiago bio). Used as a deep-link target for
                          internal linking + future Schema CollectionPage
                          ItemList endpoints. */}
                      {ind.badge ? (
                        <div id={ind.slug} className={baseClass}>
                          {inner}
                        </div>
                      ) : (
                        <Link
                          id={ind.slug}
                          href={`/industrias#${ind.slug}`}
                          className={cn(baseClass, "scroll-mt-24")}
                        >
                          {inner}
                        </Link>
                      )}
                    </Reveal>
                  </ScrollParallax>
                );
              })}
            </ul>
          </div>

          <div className="order-1 lg:order-2 lg:col-span-5 lg:text-right">
            <ScrollParallax speed={0.25}>
              <SectionEyebrow
                number="03"
                label="Industrias"
                className="lg:justify-end"
              />
              <h2 className="mt-8 font-display text-[clamp(1.75rem,4vw,3.75rem)] font-medium leading-[1.02] tracking-[-0.03em] text-balance">
                Hablamos el idioma de cinco{" "}
                <HoverAccent className="italic text-periwinkle font-light">
                  industrias
                </HoverAccent>{" "}
                específicas.
              </h2>
            </ScrollParallax>
            <ScrollParallax speed={-0.18}>
              <p className="mt-8 max-w-md text-lg text-muted text-pretty lg:ml-auto">
                No somos generalistas. Cada vertical tiene reglas, lenguaje y dinámicas que dominamos a profundidad.
              </p>
            </ScrollParallax>
          </div>
        </div>
      </Container>
    </section>
  );
}
