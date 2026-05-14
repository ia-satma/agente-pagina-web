import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { SectionEyebrow } from "@/components/ui/section-eyebrow";
import { PageHero } from "@/components/sections/page-hero";
import { CtaFinal } from "@/components/sections/cta-final";
import { Reveal } from "@/components/animations/reveal";
import { NeonGlowCard } from "@/components/effects/neon-glow-card";
import { getPayloadClient } from "@/lib/payload-client";
import { site } from "@/lib/site";
import {
  JsonLd,
  buildBreadcrumb,
  buildCollectionPage,
  buildItemList,
} from "@/components/seo/page-schemas";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Pensamientos, casos y aprendizajes desde el equipo SATMA. Marketing, IA, branding y la operación real de una agencia mexicana.",
};

const dateFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function BlogPage() {
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "posts",
    where: { _status: { equals: "published" } },
    sort: "-publishedAt",
    limit: 30,
    overrideAccess: true,
  });

  const posts = result.docs.map((doc) => {
    const tagsRaw = (doc as { tags?: Array<{ tag?: string }> }).tags;
    const firstTag = tagsRaw && tagsRaw.length > 0 ? tagsRaw[0].tag : null;
    return {
      id: doc.id,
      slug: (doc as { slug?: string }).slug ?? "",
      title: (doc as { title?: string }).title ?? "",
      excerpt: (doc as { excerpt?: string }).excerpt ?? "",
      category: firstTag ?? "Pensamientos",
      publishedAt:
        (doc as { publishedAt?: string }).publishedAt ?? new Date().toISOString(),
    };
  });

  return (
    <>
      <JsonLd
        data={buildCollectionPage({
          url: "/blog",
          name: "Diario satma — Blog",
          description:
            "Pensamientos del equipo SATMA, casos diseccionados y aprendizajes sobre marketing, IA aplicada, branding y operación de agencia.",
        })}
      />
      <JsonLd
        data={buildBreadcrumb([
          { name: "Inicio", url: "/" },
          { name: "Blog", url: "/blog" },
        ])}
      />
      {posts.length > 0 && (
        <JsonLd
          data={buildItemList(
            "/blog",
            posts.map((p) => ({
              name: p.title,
              url: `/blog/${p.slug}`,
              description: p.excerpt,
            })),
            "Artículos del blog SATMA",
          )}
        />
      )}

      <PageHero
        eyebrowNumber="06"
        eyebrowLabel="Diario"
        headline={
          <>
            Diario <span className="italic font-light text-periwinkle">satma</span>.
          </>
        }
        description="Pensamientos del equipo, casos diseccionados y aprendizajes que normalmente no contamos. Publicamos cuando tenemos algo que decir, no cuando toca."
      />

      <section className="py-14 sm:py-20 lg:py-32">
        <Container>
          <div className="mb-16 flex items-end justify-between">
            <SectionEyebrow number="01" label="Más recientes" />
            <span className="text-sm text-muted">
              {posts.length} {posts.length === 1 ? "artículo" : "artículos"}
            </span>
          </div>

          {posts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-line p-16 text-center">
              <p className="text-lg text-muted">
                Aún no hay artículos publicados. Vuelve pronto.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {posts.map((post, i) => (
                <Reveal key={post.id} delay={i * 0.08}>
                  <li>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="group -mx-4 grid items-baseline gap-6 px-4 py-12 transition-colors hover:bg-ink-soft/30 lg:grid-cols-12 lg:gap-12"
                    >
                      <div className="flex items-center gap-4 lg:col-span-3">
                        <span className="rounded-full border border-line bg-ink-soft/40 px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-periwinkle">
                          {post.category}
                        </span>
                        <span className="text-sm text-muted">
                          {dateFormatter.format(new Date(post.publishedAt))}
                        </span>
                      </div>
                      <div className="lg:col-span-7">
                        <h3 className="font-display text-2xl font-medium tracking-tight transition-colors group-hover:text-periwinkle lg:text-3xl text-balance">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-muted leading-relaxed text-pretty">
                          {post.excerpt}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted transition-colors group-hover:text-periwinkle lg:col-span-2 lg:justify-end">
                        Leer
                        <ArrowUpRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        />
                      </div>
                    </Link>
                  </li>
                </Reveal>
              ))}
            </ul>
          )}

          <Reveal>
            <NeonGlowCard className="mt-24 rounded-3xl">
            <div className="rounded-3xl border border-line bg-ink-soft/30 p-10 shadow-card transition-all duration-300 hover:scale-[1.025] hover:border-periwinkle/50 hover:shadow-card-hover lg:p-14">
              <div className="grid items-center gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7">
                  <Mail size={28} className="text-periwinkle" />
                  <h3 className="mt-6 font-display text-3xl font-medium tracking-tight lg:text-4xl text-balance">
                    Una vez al mes. Sin relleno.
                  </h3>
                  <p className="mt-4 max-w-xl text-muted text-pretty">
                    El newsletter de satma resume lo que estamos viendo en el mercado, los experimentos que funcionaron y los que no. Para gente ocupada.
                  </p>
                </div>
                <div className="lg:col-span-5 lg:justify-self-end">
                  <ButtonLink
                    href={`mailto:${site.contact.email}?subject=Suscribirme al newsletter SATMA`}
                    variant="primary"
                    size="lg"
                  >
                    Suscribirme <ArrowUpRight size={20} />
                  </ButtonLink>
                </div>
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
