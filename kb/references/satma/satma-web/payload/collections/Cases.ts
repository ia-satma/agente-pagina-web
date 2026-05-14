import type { CollectionConfig } from "payload";
import {
  revalidateCollection,
  revalidateOnDelete,
} from "../hooks/revalidate.ts";

export const Cases: CollectionConfig = {
  slug: "cases",
  labels: {
    singular: "Caso",
    plural: "Casos",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "client", "industry", "year", "featured", "updatedAt"],
    group: "Contenido del sitio",
    description:
      "Casos de éxito con métricas tangibles (ROI, leads, revenue). Mostrar resultados que se midieron. Distinto de Portafolio (que es showcase visual).",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateCollection],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    {
      name: "title",
      type: "text",
      label: "Título del caso",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug (URL)",
      required: true,
      unique: true,
    },
    {
      name: "client",
      type: "text",
      label: "Cliente",
    },
    {
      name: "industry",
      type: "relationship",
      relationTo: "industries",
      label: "Industria",
    },
    {
      name: "services",
      type: "relationship",
      relationTo: "services",
      hasMany: true,
      label: "Servicios aplicados",
    },
    {
      name: "year",
      type: "number",
      label: "Año",
      required: true,
      defaultValue: new Date().getFullYear(),
    },
    {
      name: "metric",
      type: "text",
      label: "Métrica destacada",
      admin: {
        description: "El número grande, ej. '+312%' o 'Top 3' o '+1,800'",
      },
    },
    {
      name: "metricLabel",
      type: "text",
      label: "Etiqueta de la métrica",
      admin: {
        description:
          "Qué mide el número. Ej: 'leads calificados', 'ranking en Google búsqueda local', 'miembros activos'.",
      },
    },
    {
      name: "metricPeriod",
      type: "text",
      label: "Período",
      admin: {
        description:
          "Ventana de tiempo en la que se logró el resultado. Ej: '12 meses', '8 meses', '12 meses post-lanzamiento'.",
      },
    },
    {
      name: "metricBaseline",
      type: "text",
      label: "Baseline (comparativa)",
      admin: {
        description:
          "Contra qué se compara la métrica. Ej: 'vs. baseline 2024', 'antes en posiciones 12-18', 'duplicó la base anterior'.",
      },
    },
    {
      name: "metricSource",
      type: "textarea",
      label: "Metodología / fuente",
      admin: {
        description:
          "Aporta credibilidad E-E-A-T a Google y AI engines: cómo se midió, fuente del dato, qué tooling se usó. Ejemplo: 'Conteo de leads cualificados por el equipo comercial. Fuente: CRM interno auditado mensualmente. Solo prospectos con propuesta enviada.'",
      },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Imagen de portada",
    },
    {
      name: "gallery",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      label: "Galería",
    },
    {
      name: "summary",
      type: "textarea",
      label: "Resumen ejecutivo",
    },
    {
      name: "body",
      type: "richText",
      label: "Caso de estudio (cuerpo)",
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Destacar en home",
      defaultValue: false,
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Fecha de publicación",
      defaultValue: () => new Date(),
    },
  ],
};
