export const site = {
  name: "satma",
  fullName: "satma — agencia creativa",
  url: "https://satma.mx",
  description:
    "Agencia creativa que combina marketing humano con inteligencia artificial. Estrategia, creatividad y tecnología para marcas con ambición.",
  contact: {
    phone: "+52 81 2399 7852",
    phoneAlt: "+52 81 2474 9049",
    email: "santiago@satma.mx",
    address: {
      street: "Simón Bolívar 224, Of. 301",
      neighborhood: "Col. Chepevera",
      city: "Monterrey",
      state: "NL",
      zip: "64030",
      country: "México",
    },
  },
  socials: {
    instagram: "https://instagram.com/satma.mx",
    facebook: "https://facebook.com/satma.mx",
    x: "https://x.com/satma_mx",
    linkedin: "https://linkedin.com/company/satma-mx",
  },
  nav: [
    { label: "Agencia", href: "/agencia" },
    { label: "Servicios", href: "/servicios" },
    { label: "Industrias", href: "/industrias" },
    { label: "Casos", href: "/casos" },
    { label: "Portafolio", href: "/portafolio" },
    // { label: "brujer.ia", href: "/brujer-ia" }, // hidden until product is ready
    { label: "Blog", href: "/blog" },
    { label: "Contacto", href: "/contacto" },
  ],
} as const;

export type SiteConfig = typeof site;
