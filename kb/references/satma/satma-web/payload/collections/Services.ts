import type { CollectionConfig } from "payload";
import {
  revalidateCollection,
  revalidateOnDelete,
} from "../hooks/revalidate.ts";

export const Services: CollectionConfig = {
  slug: "services",
  labels: {
    singular: "Servicio",
    plural: "Servicios",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "icon", "featured", "order", "updatedAt"],
    group: "Contenido del sitio",
    description:
      "Las disciplinas que la agencia ofrece. Aparecen en home (sección Servicios) y en /servicios.",
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
      name: "name",
      type: "text",
      label: "Nombre del servicio",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      label: "Slug (URL)",
      required: true,
      unique: true,
      admin: {
        description: "Ejemplo: marketing-360 (en minúsculas, sin espacios)",
      },
    },
    {
      name: "icon",
      type: "select",
      label: "Ícono",
      options: [
        { label: "Brain (cerebro)", value: "Brain" },
        { label: "Layout (sitio)", value: "Layout" },
        { label: "Megaphone (altavoz)", value: "Megaphone" },
        { label: "Palette (paleta)", value: "Palette" },
        { label: "PlayCircle (video)", value: "PlayCircle" },
        { label: "TrendingUp (performance)", value: "TrendingUp" },
        { label: "Sparkles", value: "Sparkles" },
      ],
    },
    {
      name: "shortDescription",
      type: "textarea",
      label: "Descripción corta (para tarjeta)",
      required: true,
    },
    {
      name: "longDescription",
      type: "richText",
      label: "Descripción extendida",
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
      label: "Orden de aparición",
      defaultValue: 0,
    },
  ],
};
