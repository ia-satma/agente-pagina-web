import type { GlobalConfig } from "payload";
import { revalidateSettings } from "../hooks/revalidate.ts";

export const Settings: GlobalConfig = {
  slug: "settings",
  label: "Ajustes del sitio",
  admin: {
    group: "Configuración",
    description:
      "Datos globales: nombre del sitio, contacto, redes sociales. Lo que cambia aquí se actualiza en header, footer y formularios.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSettings],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Identidad",
          fields: [
            {
              name: "siteName",
              type: "text",
              label: "Nombre del sitio",
              defaultValue: "satma — agencia creativa",
            },
            {
              name: "tagline",
              type: "text",
              label: "Eslogan",
              defaultValue: "Marketing humano. Potenciado con IA.",
            },
            {
              name: "description",
              type: "textarea",
              label: "Descripción / meta",
              defaultValue:
                "Agencia creativa que combina marketing humano con inteligencia artificial.",
            },
            {
              name: "logo",
              type: "upload",
              relationTo: "media",
              label: "Logo principal",
            },
          ],
        },
        {
          label: "Contacto",
          fields: [
            { name: "email", type: "email", label: "Email", defaultValue: "santiago@satma.mx" },
            { name: "phone", type: "text", label: "Teléfono principal", defaultValue: "+52 81 2399 7852" },
            { name: "phoneAlt", type: "text", label: "Teléfono secundario", defaultValue: "+52 81 2474 9049" },
            { name: "addressStreet", type: "text", label: "Calle y número", defaultValue: "Simón Bolívar 224, Of. 301" },
            { name: "addressNeighborhood", type: "text", label: "Colonia", defaultValue: "Col. Chepevera" },
            { name: "addressCity", type: "text", label: "Ciudad", defaultValue: "Monterrey" },
            { name: "addressState", type: "text", label: "Estado", defaultValue: "NL" },
            { name: "addressZip", type: "text", label: "C.P.", defaultValue: "64030" },
          ],
        },
        {
          label: "Redes sociales",
          fields: [
            { name: "instagram", type: "text", label: "Instagram URL" },
            { name: "facebook", type: "text", label: "Facebook URL" },
            { name: "x", type: "text", label: "X / Twitter URL" },
            { name: "linkedin", type: "text", label: "LinkedIn URL" },
          ],
        },
        {
          label: "Hero del Home",
          fields: [
            {
              name: "heroBadge",
              type: "text",
              label: "Texto del badge superior",
              defaultValue: "Edición evolutiva 2026",
            },
            {
              name: "heroHeadline",
              type: "textarea",
              label: "Titular principal",
              defaultValue:
                "Donde la creatividad se encuentra con la inteligencia.",
            },
            {
              name: "heroSubheadline",
              type: "textarea",
              label: "Subtítulo",
              defaultValue:
                "Marketing humano, potenciado con IA. Diseñamos estrategias que combinan instinto creativo con la velocidad de las herramientas más avanzadas.",
            },
            {
              name: "heroCtaPrimaryLabel",
              type: "text",
              defaultValue: "Empezar un proyecto",
            },
            {
              name: "heroCtaPrimaryHref",
              type: "text",
              defaultValue: "/contacto",
            },
            {
              name: "heroCtaSecondaryLabel",
              type: "text",
              defaultValue: "Ver casos",
            },
            {
              name: "heroCtaSecondaryHref",
              type: "text",
              defaultValue: "/casos",
            },
          ],
        },
      ],
    },
  ],
};
