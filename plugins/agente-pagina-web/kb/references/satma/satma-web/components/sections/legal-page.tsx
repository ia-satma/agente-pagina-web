import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { PageHero } from "@/components/sections/page-hero";
import {
  JsonLd,
  buildBreadcrumb,
  buildWebPage,
} from "@/components/seo/page-schemas";

type Props = {
  number: string;
  label: string;
  title: React.ReactNode;
  lastUpdated: string;
  children: React.ReactNode;
  /** Required for SEO — used to build canonical URL + breadcrumb. */
  slug?: string;
  /** Plain-text title for schema (the JSX `title` is for display). */
  schemaTitle?: string;
  /** Plain-text description for the WebPage schema. */
  schemaDescription?: string;
};

export function LegalPage({
  number,
  label,
  title,
  lastUpdated,
  children,
  slug,
  schemaTitle,
  schemaDescription,
}: Props) {
  return (
    <>
      {/* Breadcrumb + WebPage schema. Legal pages don't drive conversions
          but proper schema lets search engines surface the right one
          (privacidad vs cookies vs contrato) for navigational queries. */}
      {slug && (
        <>
          <JsonLd
            data={buildBreadcrumb([
              { name: "Inicio", url: "/" },
              { name: schemaTitle ?? label, url: `/${slug}` },
            ])}
          />
          {schemaTitle && schemaDescription && (
            <JsonLd
              data={buildWebPage({
                url: `/${slug}`,
                name: schemaTitle,
                description: schemaDescription,
                lastUpdated,
              })}
            />
          )}
        </>
      )}

      <PageHero
        eyebrowNumber={number}
        eyebrowLabel={label}
        headline={title}
        description={`Última actualización: ${lastUpdated}`}
      />
      <section className="border-b border-line py-12 sm:py-16 lg:py-28">
        <Container>
          <article className="prose prose-invert mx-auto max-w-3xl text-muted [&>h2]:font-display [&>h2]:text-2xl [&>h2]:font-medium [&>h2]:tracking-tight [&>h2]:text-off [&>h2]:mt-12 [&>h2]:mb-4 [&>h3]:font-display [&>h3]:text-lg [&>h3]:font-medium [&>h3]:text-off [&>h3]:mt-8 [&>h3]:mb-3 [&>p]:my-4 [&>p]:leading-relaxed [&>ul]:my-4 [&>ul>li]:my-2 [&>ul]:list-disc [&>ul]:pl-6 [&_a]:text-periwinkle [&_a:hover]:underline [&_strong]:text-off">
            {children}
          </article>
        </Container>
      </section>
    </>
  );
}

export function makeLegalMetadata(title: string, description: string): Metadata {
  return { title, description };
}
