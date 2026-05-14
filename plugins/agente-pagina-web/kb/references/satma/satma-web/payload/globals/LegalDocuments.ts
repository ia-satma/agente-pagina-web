import type { GlobalConfig } from "payload";
import { revalidateSettings } from "../hooks/revalidate.ts";

/**
 * Legal documents — three globals, one per public legal page.
 *
 * Why three separate globals (vs one with tabs): each document has a
 * distinct slug, distinct lastUpdated date, and a distinct revalidation
 * target. Editing the privacy notice should NOT invalidate the cookies
 * page cache. Three globals = three independent revalidate triggers.
 *
 * Body uses the lexical richText editor that's already configured in
 * `payload.config.ts`. The editor supports headings, paragraphs, lists,
 * bold/italic, links — everything legal docs need without leaving
 * Payload's UI.
 */

const sharedAdmin = (description: string, group = "Configuración") => ({
  group,
  description,
});

// Reusable shape for any legal-style global. Each one passes its own
// label, description, defaults and revalidation target.
function buildLegalGlobal(opts: {
  slug: string;
  label: string;
  description: string;
  defaultTitle: string;
  defaultLastUpdated: string;
}): GlobalConfig {
  return {
    slug: opts.slug,
    label: opts.label,
    admin: sharedAdmin(opts.description),
    access: {
      read: () => true,
    },
    hooks: {
      afterChange: [revalidateSettings],
    },
    fields: [
      {
        name: "title",
        type: "text",
        label: "Título de la página",
        required: true,
        defaultValue: opts.defaultTitle,
      },
      {
        name: "lastUpdated",
        type: "text",
        label: "Última actualización (texto libre)",
        required: true,
        defaultValue: opts.defaultLastUpdated,
        admin: {
          description:
            "Texto que aparece como subtítulo. Ej: '27 de abril de 2026'.",
        },
      },
      {
        name: "body",
        type: "richText",
        label: "Cuerpo del documento",
        admin: {
          description:
            "Editor enriquecido. Soporta encabezados (H2/H3), párrafos, listas, negritas, italics, links. Si lo dejás vacío, la página se renderiza sin contenido — recomendado usar siempre.",
        },
      },
    ],
  };
}

export const AvisoPrivacidad = buildLegalGlobal({
  slug: "avisoPrivacidad",
  label: "Legal — Aviso de privacidad",
  description:
    "Documento público en /aviso-privacidad. Cumplimiento LFPDPPP (México). Cambiar aquí actualiza la página al instante.",
  defaultTitle: "Aviso de privacidad",
  defaultLastUpdated: "27 de abril de 2026",
});

export const PoliticaCookies = buildLegalGlobal({
  slug: "politicaCookies",
  label: "Legal — Política de cookies",
  description:
    "Documento público en /politica-cookies. Tipos de cookies usadas y cómo desactivarlas.",
  defaultTitle: "Política de cookies",
  defaultLastUpdated: "27 de abril de 2026",
});

export const ContratoServicios = buildLegalGlobal({
  slug: "contratoServicios",
  label: "Legal — Contrato de servicios",
  description:
    "Documento público en /contrato-servicios. Términos generales de prestación de servicios SATMA → cliente.",
  defaultTitle: "Contrato de prestación de servicios",
  defaultLastUpdated: "27 de abril de 2026",
});
