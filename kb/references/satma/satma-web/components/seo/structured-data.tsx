import { site } from "@/lib/site";

/**
 * JSON-LD structured data emitted on every page (mounted at the root of
 * the (frontend) layout). Three top-level schemas:
 *
 *   1. Organization      — corporate identity, social profiles, founder.
 *   2. LocalBusiness     — Monterrey office, geo, hours, contact points.
 *      Subtypes ProfessionalService → narrows the kind of business so
 *      Google Business Profile and Knowledge Graph map us correctly.
 *   3. WebSite           — site root + sitelinks search box (when search
 *      is added, the SearchAction lights up Google's search-box feature).
 *
 * One <script type="application/ld+json"> per schema is the canonical
 * pattern (Google's Rich Results Test prefers separate blobs over one
 * @graph wrapper because it surfaces validation errors more granularly).
 *
 * Per-page schemas (Service, Article, FAQPage, BreadcrumbList) live in
 * their own components and are mounted from each page that needs them —
 * see Fase 2 of the SEO plan.
 */
export function RootStructuredData() {
  const url = site.url;
  const logo = `${url}/images/satma-wordmark.png`;
  const isotype = `${url}/images/satma-isotype.png`;

  // ── 1. Organization ──────────────────────────────────────────────────
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${url}/#organization`,
    name: "SATMA",
    alternateName: ["satma — agencia creativa", "SATMA agencia creativa"],
    legalName: "SATMA",
    url,
    logo: {
      "@type": "ImageObject",
      url: logo,
      width: 480,
      height: 90,
    },
    image: isotype,
    description:
      "Agencia creativa mexicana especializada en branding, marketing 360, desarrollo y IA aplicada. Más de 10 años trabajando con sectores regulados y exigentes en México y Latinoamérica.",
    slogan: "Marketing humano. Potenciado con IA.",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Monterrey",
        addressRegion: "Nuevo León",
        addressCountry: "MX",
      },
    },
    founder: {
      "@type": "Person",
      "@id": `${url}/#santiago`,
      name: "Santiago Álvarez",
      jobTitle: "Managing Director",
      email: site.contact.email,
    },
    sameAs: [
      site.socials.instagram,
      site.socials.facebook,
      site.socials.x,
      site.socials.linkedin,
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.contact.email,
        telephone: site.contact.phone,
        areaServed: ["MX", "US", "LATAM"],
        availableLanguage: ["Spanish", "English"],
      },
    ],
    knowsAbout: [
      "Branding",
      "Identidad de marca",
      "Marketing digital",
      "Marketing 360",
      "Diseño web",
      "Desarrollo web",
      "Producción audiovisual",
      "Inteligencia artificial aplicada al marketing",
      "Performance marketing",
      "SEO",
      "Marketing jurídico",
      "Marketing médico",
      "Marketing para asociaciones",
      "Retail marketing",
      "Comunicación gubernamental",
    ],
  };

  // ── 2. LocalBusiness (ProfessionalService) ───────────────────────────
  const localBusiness = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${url}/#localbusiness`,
    name: "SATMA — agencia creativa",
    image: logo,
    url,
    telephone: site.contact.phone,
    email: site.contact.email,
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address.street,
      addressLocality: site.contact.address.city,
      addressRegion: site.contact.address.state,
      postalCode: site.contact.address.zip,
      addressCountry: "MX",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.6759, // Monterrey downtown / Chepevera area
      longitude: -100.3187,
    },
    areaServed: [
      { "@type": "Country", name: "México" },
      { "@type": "Country", name: "Estados Unidos" },
      { "@type": "AdministrativeArea", name: "Latinoamérica" },
    ],
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "18:00",
      },
    ],
    parentOrganization: { "@id": `${url}/#organization` },
    sameAs: [
      site.socials.instagram,
      site.socials.facebook,
      site.socials.x,
      site.socials.linkedin,
    ],
  };

  // ── 3. WebSite ───────────────────────────────────────────────────────
  // The potentialAction is wired to /blog?q={search_term_string} as a
  // forward-compatible default — when site search is implemented the
  // markup is already in place. Google requires the URL to actually
  // resolve; /blog accepts unknown query params gracefully today.
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${url}/#website`,
    url,
    name: "satma — agencia creativa",
    publisher: { "@id": `${url}/#organization` },
    inLanguage: "es-MX",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      {/* Each schema in its own <script> tag — eases debugging in
          Google's Rich Results Test (errors are scoped per blob). */}
      <script
        type="application/ld+json"
        // Stringified server-side so React doesn't escape the JSON in
        // ways that break parsers.
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
