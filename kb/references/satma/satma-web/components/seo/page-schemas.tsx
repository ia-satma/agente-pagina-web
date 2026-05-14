import { site } from "@/lib/site";

/**
 * Per-page JSON-LD helpers — pair with the root-level Organization /
 * LocalBusiness / WebSite schemas in `components/seo/structured-data.tsx`.
 *
 * Pattern: each helper returns a plain JS object (a Schema.org graph node).
 * The page that needs the schema imports the helper, builds the object
 * and emits it via `<JsonLd data={...} />`. Multiple schemas per page are
 * fine — emit one `<JsonLd>` per node so Google's Rich Results Test
 * surfaces validation errors per blob.
 *
 * `@id` strategy: every node uses a deterministic URL fragment so we can
 * reference (and Google can dedup) entities across pages. The root
 * Organization / WebSite live at `/#organization` and `/#website`. Per-
 * page entities use the page's URL with a fragment, e.g. a Service node
 * lives at `/servicios#branding`.
 */

const BASE = site.url;

/* ────────────────────────────────────────────────────────────────────
 * Generic emitter — call with any Schema.org graph node
 * ────────────────────────────────────────────────────────────────────*/

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────
 * BreadcrumbList — apply on every internal page so Google understands
 * site hierarchy. Position is 1-indexed per spec.
 * ────────────────────────────────────────────────────────────────────*/

export type BreadcrumbItem = { name: string; url: string };

export function buildBreadcrumb(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url.startsWith("http") ? it.url : `${BASE}${it.url}`,
    })),
  };
}

/* ────────────────────────────────────────────────────────────────────
 * Service — one node per discipline SATMA offers.
 * Used in /servicios and (optionally) on the home so Google gets the
 * service catalog with a clear provider link to the Organization.
 * ────────────────────────────────────────────────────────────────────*/

export type ServiceInput = {
  slug: string;
  name: string;
  description: string;
  /** What kind of service category this falls under in Schema vocab. */
  serviceType?: string;
  /** Optional area served override. Defaults to MX/US/LATAM. */
  areaServed?: string[];
};

export function buildService(input: ServiceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${BASE}/servicios#${input.slug}`,
    name: input.name,
    description: input.description,
    serviceType: input.serviceType ?? input.name,
    provider: { "@id": `${BASE}/#organization` },
    areaServed: (input.areaServed ?? ["MX", "US", "LATAM"]).map((code) => ({
      "@type": "Country",
      name: code === "MX" ? "México" : code === "US" ? "Estados Unidos" : code,
    })),
    url: `${BASE}/servicios`,
  };
}

/* ────────────────────────────────────────────────────────────────────
 * ItemList — index of items in a listing page. Useful on /servicios,
 * /casos, /portafolio, /industrias, /blog so search engines know the
 * collection has multiple distinct items.
 * ────────────────────────────────────────────────────────────────────*/

export type ItemListEntry = {
  name: string;
  url: string;
  description?: string;
};

export function buildItemList(
  pageUrl: string,
  items: ItemListEntry[],
  listName: string,
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${BASE}${pageUrl}#itemlist`,
    name: listName,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      url: it.url.startsWith("http") ? it.url : `${BASE}${it.url}`,
      ...(it.description && { description: it.description }),
    })),
  };
}

/* ────────────────────────────────────────────────────────────────────
 * FAQPage — perfect on /contacto. Triggers Google's FAQ rich result.
 * ────────────────────────────────────────────────────────────────────*/

export type FAQEntry = { question: string; answer: string };

export function buildFAQ(pageUrl: string, entries: FAQEntry[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${BASE}${pageUrl}#faq`,
    mainEntity: entries.map((e) => ({
      "@type": "Question",
      name: e.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: e.answer,
      },
    })),
  };
}

/* ────────────────────────────────────────────────────────────────────
 * AboutPage — for /agencia. Subtype of WebPage. Lets Google identify
 * the page as "the about page" of the Organization (different from
 * arbitrary content pages).
 * ────────────────────────────────────────────────────────────────────*/

export function buildAboutPage(opts: {
  url: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "@id": `${BASE}${opts.url}#aboutpage`,
    url: `${BASE}${opts.url}`,
    name: opts.name,
    description: opts.description,
    inLanguage: "es-MX",
    isPartOf: { "@id": `${BASE}/#website` },
    about: { "@id": `${BASE}/#organization` },
    mainEntity: { "@id": `${BASE}/#organization` },
  };
}

/* ────────────────────────────────────────────────────────────────────
 * ContactPage — for /contacto. Pairs naturally with the FAQPage on the
 * same URL — both can coexist.
 * ────────────────────────────────────────────────────────────────────*/

export function buildContactPage(opts: {
  url: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${BASE}${opts.url}#contactpage`,
    url: `${BASE}${opts.url}`,
    name: opts.name,
    description: opts.description,
    inLanguage: "es-MX",
    isPartOf: { "@id": `${BASE}/#website` },
    about: { "@id": `${BASE}/#organization` },
  };
}

/* ────────────────────────────────────────────────────────────────────
 * CollectionPage — for listing pages (/casos, /industrias, /portafolio,
 * /blog, /servicios). Lets Google differentiate "list of items" from
 * "single article" pages.
 * ────────────────────────────────────────────────────────────────────*/

export function buildCollectionPage(opts: {
  url: string;
  name: string;
  description: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${BASE}${opts.url}#collectionpage`,
    url: `${BASE}${opts.url}`,
    name: opts.name,
    description: opts.description,
    inLanguage: "es-MX",
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
  };
}

/* ────────────────────────────────────────────────────────────────────
 * SoftwareApplication — for /brujer-ia (the in-house AI platform).
 * Distinct from Service: this is a product, not a custom engagement.
 * ────────────────────────────────────────────────────────────────────*/

export function buildSoftwareApplication(opts: {
  url: string;
  name: string;
  description: string;
  category?: string;
  applicationCategory?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${BASE}${opts.url}#software`,
    name: opts.name,
    description: opts.description,
    url: `${BASE}${opts.url}`,
    applicationCategory: opts.applicationCategory ?? "BusinessApplication",
    applicationSubCategory: opts.category ?? "MarketingApplication",
    operatingSystem: "Web",
    publisher: { "@id": `${BASE}/#organization` },
    offers: {
      "@type": "Offer",
      // Beta privada — sin precio público. PriceSpecification con
      // priceCurrency MXN y price 0 sería incorrecto. Mejor omitir.
      availability: "https://schema.org/LimitedAvailability",
      priceSpecification: {
        "@type": "PriceSpecification",
        priceCurrency: "MXN",
        // Custom pricing — Google accepts "0" + availability for "request quote".
        price: "0",
        description: "Beta privada por invitación. Cotización a la medida.",
      },
    },
  };
}

/* ────────────────────────────────────────────────────────────────────
 * Person — Santiago Álvarez, fundador. Used on /agencia and any page
 * that highlights authorship (blog posts when /blog/[slug] exists).
 * ────────────────────────────────────────────────────────────────────*/

export function buildSantiagoSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${BASE}/#santiago`,
    name: "Santiago Álvarez",
    givenName: "Santiago",
    familyName: "Álvarez",
    jobTitle: "Managing Director y Fundador",
    worksFor: { "@id": `${BASE}/#organization` },
    email: site.contact.email,
    telephone: site.contact.phone,
    url: `${BASE}/agencia#santiago-alvarez`,
    description:
      "Fundador de SATMA. Más de 15 años construyendo estrategias de marca y comunicación para sectores regulados en México y Latinoamérica.",
    nationality: { "@type": "Country", name: "México" },
    workLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Monterrey",
        addressRegion: "Nuevo León",
        addressCountry: "MX",
      },
    },
    knowsLanguage: ["es-MX", "en"],
    knowsAbout: [
      "Estrategia de marca",
      "Branding",
      "Marketing jurídico",
      "Marketing médico",
      "Marketing para asociaciones empresariales",
      "Marketing de retail premium",
      "Comunicación gubernamental",
      "Comunicación institucional",
      "Inteligencia artificial aplicada al marketing",
      "Liderazgo de equipos creativos",
      "Consultoría estratégica B2B",
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Managing Director, agencia creativa",
      occupationLocation: { "@id": `${BASE}/#localbusiness` },
      skills:
        "Estrategia de marca, dirección creativa, marketing digital, IA aplicada, gestión de equipos, comunicación corporativa",
    },
    sameAs: [site.socials.linkedin],
  };
}

/* ────────────────────────────────────────────────────────────────────
 * Generic WebPage — fallback for legal pages (privacy, cookies, contract).
 * Mostly there for breadcrumb context; not required but tidy.
 * ────────────────────────────────────────────────────────────────────*/

export function buildWebPage(opts: {
  url: string;
  name: string;
  description: string;
  /** ISO date of last meaningful update — feeds dateModified. */
  lastUpdated?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${BASE}${opts.url}#webpage`,
    url: `${BASE}${opts.url}`,
    name: opts.name,
    description: opts.description,
    inLanguage: "es-MX",
    isPartOf: { "@id": `${BASE}/#website` },
    publisher: { "@id": `${BASE}/#organization` },
    ...(opts.lastUpdated && { dateModified: opts.lastUpdated }),
  };
}
