import type { CollectionConfig } from "payload";
import {
  revalidateCollection,
  revalidateOnDelete,
} from "../hooks/revalidate.ts";

/**
 * Portafolio — branding, identidad visual, sistemas de marca y trabajo
 * de diseño. Diferente de `cases` (que mide resultados de marketing/ROI):
 * portfolio es showcase visual, casos son storytelling con métricas.
 */
export const Portfolio: CollectionConfig = {
  slug: "portfolio",
  labels: {
    singular: "Pieza de portafolio",
    plural: "Portafolio",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: [
      "title",
      "client",
      "category",
      "year",
      "featured",
      "updatedAt",
    ],
    group: "Contenido del sitio",
    description:
      "Showcase visual: branding, identidad, sistemas de marca, video. Pieza visual sin obligación de métricas. Distinto de Casos (que sí lleva ROI/resultados).",
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
      label: "Título",
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
      name: "category",
      type: "select",
      label: "Categoría",
      required: true,
      defaultValue: "branding",
      options: [
        { label: "Branding & identidad", value: "branding" },
        { label: "Sistema de diseño", value: "design-system" },
        { label: "Logo & marca", value: "logo" },
        { label: "Empaque", value: "packaging" },
        { label: "Editorial", value: "editorial" },
        { label: "Web & digital", value: "web" },
        { label: "Campaña", value: "campaign" },
        { label: "Otro", value: "other" },
      ],
    },
    {
      name: "year",
      type: "number",
      label: "Año",
      required: true,
      defaultValue: new Date().getFullYear(),
    },
    {
      name: "industry",
      type: "relationship",
      relationTo: "industries",
      label: "Industria",
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Imagen de portada",
      admin: {
        description:
          "Imagen estática de fallback. Si pones un videoUrl, este se usa como póster mientras carga el video. Aspect ratio sugerido 4:5 o 3:4.",
      },
    },
    {
      name: "videoUrl",
      type: "text",
      label: "Video (Vimeo o YouTube)",
      admin: {
        description:
          "URL pública del video. Soporta vimeo.com/{id}, player.vimeo.com/video/{id}, youtube.com/watch?v={id}, youtu.be/{id}. Si está, reemplaza la imagen estática en la card como autoplay muted loop.",
      },
    },
    {
      name: "gallery",
      type: "upload",
      relationTo: "media",
      hasMany: true,
      label: "Galería de imágenes",
    },
    {
      name: "summary",
      type: "textarea",
      label: "Resumen / descripción corta",
      admin: {
        description: "1-2 frases que aparecen en la card al hover.",
      },
    },
    {
      name: "body",
      type: "richText",
      label: "Detalle del proyecto",
    },
    {
      name: "tools",
      type: "array",
      label: "Herramientas / disciplinas",
      labels: { singular: "Herramienta", plural: "Herramientas" },
      fields: [
        {
          name: "tool",
          type: "text",
        },
      ],
    },
    {
      name: "externalUrl",
      type: "text",
      label: "URL externa (opcional)",
      admin: {
        description:
          "Link a Behance, Dribbble, sitio del cliente, etc. Si está vacío, el card abre la página interna del proyecto.",
      },
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Destacar en home",
      defaultValue: false,
    },
    {
      name: "order",
      type: "number",
      label: "Orden de despliegue",
      defaultValue: 0,
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Fecha de publicación",
      defaultValue: () => new Date(),
    },
  ],
};
