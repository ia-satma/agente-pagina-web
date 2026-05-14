import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/sections/page-hero";
import { Cases } from "@/components/sections/cases";
import { Testimonios } from "@/components/sections/testimonios";
import { CtaFinal } from "@/components/sections/cta-final";
import {
  JsonLd,
  buildBreadcrumb,
  buildCollectionPage,
} from "@/components/seo/page-schemas";

export const metadata: Metadata = {
  title: "Casos",
  description:
    "Resultados que se miden, no que se prometen. Una selección de proyectos de SATMA con métricas reales por industria.",
};

export default function CasosPage() {
  return (
    <>
      <JsonLd
        data={buildCollectionPage({
          url: "/casos",
          name: "Casos de éxito — SATMA",
          description:
            "Proyectos públicos de SATMA con métricas verificables: +312% leads en despacho jurídico, top 3 SEO en clínica de especialidades, +1,800 miembros en asociación, +47% revenue en retail premium.",
        })}
      />
      <JsonLd
        data={buildBreadcrumb([
          { name: "Inicio", url: "/" },
          { name: "Casos", url: "/casos" },
        ])}
      />

      <PageHero
        eyebrowNumber="05"
        eyebrowLabel="Portafolio"
        headline={
          <>
            El trabajo. <span className="italic font-light text-periwinkle">La prueba.</span>
          </>
        }
        description="Una selección curada de los proyectos que más nos han enseñado. Cada caso documenta el reto, la decisión estratégica y la métrica de impacto verificable."
      >
        <ButtonLink href="/contacto" variant="primary" size="lg">
          Quiero algo así para mi marca <ArrowUpRight size={20} />
        </ButtonLink>
      </PageHero>

      <Cases />
      <Testimonios />
      <CtaFinal />
    </>
  );
}
