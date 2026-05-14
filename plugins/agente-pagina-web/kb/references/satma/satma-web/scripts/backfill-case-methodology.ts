/**
 * One-shot script to populate the new methodology fields
 * (`metricLabel`, `metricPeriod`, `metricBaseline`, `metricSource`)
 * on the four seeded Cases. Idempotent — running again just re-applies
 * the same values.
 *
 * Run once after the schema migration:
 *   pnpm tsx scripts/backfill-case-methodology.ts
 *
 * Future cases created from /admin can fill these fields directly.
 */
import { getPayload } from "payload";
import config from "../payload.config.ts";

type Patch = {
  slug: string;
  metric: string;
  metricLabel: string;
  metricPeriod: string;
  metricBaseline: string;
  metricSource: string;
};

const PATCHES: Patch[] = [
  {
    slug: "despacho-juridico-monterrey",
    metric: "+312%",
    metricLabel: "leads calificados",
    metricPeriod: "12 meses",
    metricBaseline: "vs. baseline 2024",
    metricSource:
      "Conteo de leads cualificados por el equipo comercial del despacho. Fuente: CRM interno auditado mensualmente. Solo prospectos con propuesta enviada.",
  },
  {
    slug: "clinica-especialidades",
    metric: "Top 3",
    metricLabel: "ranking en Google búsqueda local",
    metricPeriod: "8 meses",
    metricBaseline: "antes en posiciones 12-18",
    metricSource:
      "Posición media en SERP de Google para 6 keywords de cabecera por especialidad médica, medida con tracking SEO continuo (semrush + ahrefs).",
  },
  {
    slug: "asociacion-empresarial",
    metric: "+1,800",
    metricLabel: "miembros activos",
    metricPeriod: "18 meses",
    metricBaseline: "duplicó la base anterior",
    metricSource:
      "Miembros con cuota al día y al menos un evento asistido en los últimos 90 días. Fuente: portal de membresía + CRM de la asociación.",
  },
  {
    slug: "comercializadora-retail",
    metric: "+47%",
    metricLabel: "revenue YoY",
    metricPeriod: "12 meses post-lanzamiento",
    metricBaseline: "año anterior comparable",
    metricSource:
      "Revenue total e-commerce + tienda física (omnicanal). Fuente: Shopify + ERP del cliente, neto de devoluciones.",
  },
];

async function main() {
  const payload = await getPayload({ config });

  for (const p of PATCHES) {
    const found = await payload.find({
      collection: "cases",
      where: { slug: { equals: p.slug } },
      limit: 1,
      overrideAccess: true,
    });
    if (found.docs.length === 0) {
      console.log(`✗ skip (not found): slug=${p.slug}`);
      continue;
    }
    const id = found.docs[0].id;
    await payload.update({
      collection: "cases",
      id,
      data: {
        metric: p.metric,
        metricLabel: p.metricLabel,
        metricPeriod: p.metricPeriod,
        metricBaseline: p.metricBaseline,
        metricSource: p.metricSource,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      overrideAccess: true,
    });
    console.log(`✓ patched: ${p.slug}  (id=${id})  metric=${p.metric}`);
  }

  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
