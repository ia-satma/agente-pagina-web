import type { Metadata } from "next";
import { ArrowUpRight } from "lucide-react";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/sections/page-hero";
import { Services } from "@/components/sections/services";
import { Process } from "@/components/sections/process";
import { CtaFinal } from "@/components/sections/cta-final";
import { getPayloadClient } from "@/lib/payload-client";
import {
  JsonLd,
  buildBreadcrumb,
  buildCollectionPage,
  buildItemList,
  buildService,
} from "@/components/seo/page-schemas";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Branding, marketing 360, sitios y plataformas, contenido & video, IA aplicada, performance & analítica. Seis disciplinas que combinamos según tu ambición.",
};

export default async function ServiciosPage() {
  // Fetch services straight from Payload to feed the structured data.
  // The <Services /> component fetches the same list internally — Payload
  // de-dupes via the React cache so this is a free read.
  const payload = await getPayloadClient();
  const result = await payload.find({
    collection: "services",
    sort: "order",
    limit: 30,
    overrideAccess: true,
    depth: 0,
  });

  const services = result.docs.map((doc) => ({
    slug: (doc as { slug?: string }).slug ?? "",
    name: (doc as { name?: string }).name ?? "",
    shortDescription:
      (doc as { shortDescription?: string }).shortDescription ?? "",
  }));
  return (
    <>
      {/* SEO/GEO — Service catalog + CollectionPage + Breadcrumb + ItemList */}
      <JsonLd
        data={buildCollectionPage({
          url: "/servicios",
          name: "Servicios de SATMA — agencia creativa",
          description:
            "Las seis disciplinas que SATMA combina por proyecto: branding, marketing 360, desarrollo, contenido y video, IA aplicada, performance.",
        })}
      />
      <JsonLd
        data={buildBreadcrumb([
          { name: "Inicio", url: "/" },
          { name: "Servicios", url: "/servicios" },
        ])}
      />
      <JsonLd
        data={buildItemList(
          "/servicios",
          services.map((s) => ({
            name: s.name,
            url: `/servicios#${s.slug}`,
            description: s.shortDescription,
          })),
          "Catálogo de servicios SATMA",
        )}
      />
      {services.map((s) => (
        <JsonLd
          key={s.slug}
          data={buildService({
            slug: s.slug,
            name: s.name,
            description: s.shortDescription,
          })}
        />
      ))}

      <PageHero
        eyebrowNumber="02"
        eyebrowLabel="Servicios"
        headline={
          <>
            Lo que hacemos. <span className="italic font-light text-periwinkle">Bien hecho.</span>
          </>
        }
        description="Seis disciplinas que combinamos según el reto. Sin paquetes pre-armados — cada equipo se construye en función de lo que tu marca necesita ahora."
      >
        <ButtonLink href="/contacto" variant="primary" size="lg">
          Solicitar propuesta <ArrowUpRight size={20} />
        </ButtonLink>
        <ButtonLink href="/casos" size="lg" className="border border-paper/20 text-paper hover:border-paper/50">
          Ver casos por servicio
        </ButtonLink>
      </PageHero>

      <Services />
      <Process />
      <CtaFinal />
    </>
  );
}
