import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/sections/page-hero";
import { Industries } from "@/components/sections/industries";
import { Cases } from "@/components/sections/cases";
import { CtaFinal } from "@/components/sections/cta-final";
import {
  JsonLd,
  buildBreadcrumb,
  buildCollectionPage,
} from "@/components/seo/page-schemas";

export const metadata: Metadata = {
  title: "Industrias",
  description:
    "Despachos jurídicos, sector médico, asociaciones y ONGs, comercializadoras, instituciones de gobierno. Cinco industrias donde dominamos el lenguaje, las regulaciones y las dinámicas de cada audiencia.",
};

export default function IndustriasPage() {
  return (
    <>
      <JsonLd
        data={buildCollectionPage({
          url: "/industrias",
          name: "Industrias — SATMA",
          description:
            "Las cinco verticales especializadas de SATMA: despachos jurídicos, sector médico, asociaciones y ONGs, comercializadoras y retail, e instituciones de gobierno.",
        })}
      />
      <JsonLd
        data={buildBreadcrumb([
          { name: "Inicio", url: "/" },
          { name: "Industrias", url: "/industrias" },
        ])}
      />

      <PageHero
        eyebrowNumber="03"
        eyebrowLabel="Industrias"
        headline={
          <>
            Cinco verticales <span className="italic font-light text-periwinkle">profundamente</span> conocidas.
          </>
        }
        description="No somos generalistas. Cada industria tiene reglas, lenguaje y dinámicas distintas. Después de una década, sabemos qué funciona en cada una y qué nunca debe intentarse."
      >
        <ButtonLink href="/contacto" variant="primary" size="lg">
          Hablemos de tu industria <ArrowUpRight size={20} />
        </ButtonLink>
      </PageHero>

      <Industries />
      <Cases />
      <CtaFinal />
    </>
  );
}
