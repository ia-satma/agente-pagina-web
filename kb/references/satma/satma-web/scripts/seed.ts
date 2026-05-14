/**
 * Seed script — populates Payload collections with the same content currently
 * shown on the public site (so the CMS is in sync with what visitors see).
 *
 * Run with:   pnpm seed
 * Re-runnable: yes — collections that already have content are skipped.
 */
import { getPayload } from "payload";
import config from "../payload.config.ts";

type AnyDoc = Record<string, unknown>;

async function seedCollection<T extends AnyDoc>(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  docs: T[],
) {
  const existing = await payload.find({
    collection: slug as never,
    limit: 1,
    overrideAccess: true,
  });

  if (existing.totalDocs > 0) {
    console.log(`⏭  ${slug}: already has ${existing.totalDocs} docs, skipping`);
    return;
  }

  for (const data of docs) {
    await payload.create({
      collection: slug as never,
      data: data as never,
      overrideAccess: true,
    });
  }
  console.log(`✓  ${slug}: created ${docs.length} docs`);
}

async function seedGlobal(
  payload: Awaited<ReturnType<typeof getPayload>>,
  slug: string,
  data: AnyDoc,
) {
  await payload.updateGlobal({
    slug: slug as never,
    data: data as never,
    overrideAccess: true,
  });
  console.log(`✓  global ${slug} updated`);
}

const services = [
  {
    name: "Branding & Identidad",
    slug: "branding",
    icon: "Palette",
    shortDescription:
      "Construimos sistemas visuales que aguantan el tiempo: logo, paleta, tipografía, voz, manual de marca y aplicaciones.",
    featured: false,
    order: 1,
  },
  {
    name: "Marketing 360",
    slug: "marketing-360",
    icon: "Megaphone",
    shortDescription:
      "Estrategia integral on/off line, redes sociales, campañas de medios pagados, influencers y RP.",
    featured: false,
    order: 2,
  },
  {
    name: "Sitios y plataformas",
    slug: "sitios-plataformas",
    icon: "Layout",
    shortDescription:
      "Sitios web, e-commerce y plataformas a medida con tecnología moderna y CMS administrable.",
    featured: false,
    order: 3,
  },
  {
    name: "Contenido & Video",
    slug: "contenido-video",
    icon: "PlayCircle",
    shortDescription:
      "Producción audiovisual, fotografía, animación 2D/3D y narrativa de marca lista para cada canal.",
    featured: false,
    order: 4,
  },
  {
    name: "IA aplicada",
    slug: "ia-aplicada",
    icon: "Brain",
    shortDescription:
      "Generación de contenido, análisis de audiencia, automatización de campañas y desarrollo de productos con IA.",
    featured: false,
    order: 5,
  },
  {
    name: "Performance & Analítica",
    slug: "performance-analitica",
    icon: "TrendingUp",
    shortDescription:
      "Optimización continua, dashboards, atribución y mejoras basadas en datos reales del negocio.",
    featured: false,
    order: 6,
  },
];

const industries = [
  {
    name: "Despachos jurídicos",
    slug: "abogados",
    icon: "Scale",
    shortDescription:
      "Marketing especializado para abogados: posicionamiento de autoridad, captación de clientes y comunicación con apego a normativa.",
    comingSoon: false,
    order: 1,
  },
  {
    name: "Sector médico",
    slug: "medicos",
    icon: "Stethoscope",
    shortDescription:
      "Reputación profesional, captación de pacientes y comunicación clínica clara para consultorios, hospitales y especialistas.",
    comingSoon: false,
    order: 2,
  },
  {
    name: "Asociaciones y ONGs",
    slug: "asociaciones",
    icon: "Users",
    shortDescription:
      "Comunicación de impacto con presupuestos sensibles. Todos los servicios bajo un esquema único, ideal para causas y membresías.",
    comingSoon: false,
    order: 3,
  },
  {
    name: "Comercializadoras",
    slug: "comercializadoras",
    icon: "ShoppingBag",
    shortDescription:
      "Posicionamiento de marca, e-commerce, campañas, influencers y soporte de RH para retail y consumo masivo.",
    comingSoon: false,
    order: 4,
  },
  {
    name: "Instituciones de gobierno",
    slug: "gobierno",
    icon: "Landmark",
    shortDescription:
      "Comunicación gubernamental con foco en transparencia, ciudadanía y narrativas que conectan política pública con la calle.",
    comingSoon: false,
    order: 5,
  },
];

const cases = [
  {
    title: "De despacho local a referente regional",
    slug: "despacho-juridico-monterrey",
    client: "Despacho jurídico, Monterrey",
    year: 2025,
    metric: "+312% leads calificados",
    summary:
      "Rediseñamos la presencia digital y la estrategia de captación de un despacho mediano. Resultado: una pipeline predecible de prospectos calificados.",
    featured: true,
  },
  {
    title: "Reputación digital para clínica multiespecialidad",
    slug: "clinica-especialidades",
    client: "Clínica de especialidades",
    year: 2025,
    metric: "Top 3 en búsqueda local",
    summary:
      "Estrategia SEO + reputación + contenido médico que posicionó la clínica en el top 3 de Google para sus especialidades clave.",
    featured: true,
  },
  {
    title: "Plataforma digital para asociación empresarial",
    slug: "asociacion-empresarial",
    client: "Asociación empresarial NL",
    year: 2024,
    metric: "+1,800 miembros activos",
    summary:
      "Sitio + plataforma de membresías + comunicación 360 que duplicó la base activa en 18 meses.",
    featured: true,
  },
  {
    title: "Lanzamiento omnicanal para retail premium",
    slug: "comercializadora-retail",
    client: "Retail premium",
    year: 2024,
    metric: "+47% revenue YoY",
    summary:
      "Lanzamiento integral on/off line: e-commerce, campañas de medios pagados, influencers y experiencia en tienda.",
    featured: true,
  },
];

const testimonials = [
  {
    quote:
      "SATMA entendió nuestro despacho como pocos. La estrategia digital se tradujo en clientes calificados desde el primer trimestre.",
    author: "Lic. Mario H.",
    role: "Socio fundador",
    company: "Despacho jurídico, Monterrey",
    featured: true,
    order: 1,
  },
  {
    quote:
      "Nos gusta cómo combinan creatividad con datos. Cada campaña tiene una hipótesis y un número que la prueba.",
    author: "Adriana V.",
    role: "Directora de marketing",
    company: "Comercializadora retail",
    featured: true,
    order: 2,
  },
  {
    quote:
      "Pasaron de proveedor a aliado en tres meses. Hoy nos sentamos en las decisiones de producto, no solo en las de comunicación.",
    author: "Dr. Juan Carlos R.",
    role: "Director médico",
    company: "Clínica de especialidades",
    featured: true,
    order: 3,
  },
];

const team = [
  {
    name: "Santiago Álvarez",
    role: "Managing Director",
    bio: "Fundador de SATMA. 15+ años construyendo estrategias de marca y comunicación para sectores regulados en México.",
    order: 1,
  },
  {
    name: "Equipo creativo",
    role: "Diseño + dirección de arte",
    bio: "Diseñadores, ilustradores y directores de arte que dan forma visual a las ideas estratégicas.",
    order: 2,
  },
  {
    name: "Equipo digital",
    role: "Desarrollo + IA aplicada",
    bio: "Ingenieros y especialistas en IA que construyen sitios, plataformas y herramientas a medida.",
    order: 3,
  },
];

const posts = [
  {
    title: "Por qué la IA no reemplaza a la creatividad — la pone a trabajar",
    slug: "ia-no-reemplaza-creatividad",
    excerpt:
      "Doce meses operando con herramientas de inteligencia artificial cambiaron qué hacemos primero, qué hacemos último y qué dejamos de hacer.",
    publishedAt: "2026-03-12T10:00:00.000Z",
  },
  {
    title: "Marketing jurídico en México: lo que sí permite la barra y lo que conviene",
    slug: "marketing-juridico-mexico",
    excerpt:
      "Una guía honesta para despachos que quieren crecer su clientela sin pisar las restricciones del Código de Ética profesional.",
    publishedAt: "2026-02-28T10:00:00.000Z",
  },
  {
    title: "Las únicas tres métricas que importan en marketing B2B",
    slug: "metricas-que-importan",
    excerpt:
      "Olvídate de los vanity metrics. Si tu reporte mensual no responde estas tres preguntas, tu agencia te está vendiendo humo.",
    publishedAt: "2026-01-15T10:00:00.000Z",
  },
];

const settings = {
  siteName: "satma — agencia creativa",
  tagline: "Marketing humano. Potenciado con IA.",
  description:
    "Agencia creativa que combina marketing humano con inteligencia artificial. Estrategia, creatividad y tecnología para marcas con ambición.",
  email: "santiago@satma.mx",
  phone: "+52 81 2399 7852",
  phoneAlt: "+52 81 2474 9049",
  addressStreet: "Simón Bolívar 224, Of. 301",
  addressNeighborhood: "Col. Chepevera",
  addressCity: "Monterrey",
  addressState: "NL",
  addressZip: "64030",
  instagram: "https://instagram.com/satma.mx",
  facebook: "https://facebook.com/satma.mx",
  x: "https://x.com/satma_mx",
  linkedin: "https://linkedin.com/company/satma-mx",
  heroBadge: "Edición evolutiva 2026",
  heroHeadline: "Donde la creatividad se encuentra con la inteligencia.",
  heroSubheadline:
    "Marketing humano, potenciado con IA. Diseñamos estrategias que combinan instinto creativo con la velocidad de las herramientas más avanzadas.",
  heroCtaPrimaryLabel: "Empezar un proyecto",
  heroCtaPrimaryHref: "/contacto",
  heroCtaSecondaryLabel: "Ver casos",
  heroCtaSecondaryHref: "/casos",
};

async function main() {
  const payload = await getPayload({ config });
  console.log("\n— SATMA seed —\n");

  await seedCollection(payload, "services", services);
  await seedCollection(payload, "industries", industries);
  await seedCollection(payload, "cases", cases);
  await seedCollection(payload, "testimonials", testimonials);
  await seedCollection(payload, "team", team);
  await seedCollection(payload, "posts", posts);
  await seedGlobal(payload, "settings", settings);

  // Link cases to industries by slug
  const allIndustries = await payload.find({
    collection: "industries",
    limit: 50,
    overrideAccess: true,
  });
  const indMap = new Map(
    allIndustries.docs.map((d) => [String(d.slug ?? ""), d.id]),
  );

  const allCases = await payload.find({
    collection: "cases",
    limit: 50,
    overrideAccess: true,
  });

  const links: Record<string, string> = {
    "despacho-juridico-monterrey": "abogados",
    "clinica-especialidades": "medicos",
    "asociacion-empresarial": "asociaciones",
    "comercializadora-retail": "comercializadoras",
  };

  for (const c of allCases.docs) {
    const industrySlug = links[String(c.slug ?? "")];
    const industryId = industrySlug ? indMap.get(industrySlug) : undefined;
    if (industryId && !c.industry) {
      await payload.update({
        collection: "cases",
        id: c.id,
        data: { industry: industryId } as never,
        overrideAccess: true,
      });
      console.log(`✓  linked case ${c.slug} → industry ${industrySlug}`);
    }
  }

  console.log("\n✓ seed complete\n");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("\n✗ seed failed:", err);
    process.exit(1);
  });
