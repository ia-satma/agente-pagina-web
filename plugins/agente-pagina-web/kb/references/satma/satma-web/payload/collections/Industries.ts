import type { CollectionConfig } from "payload";
import {
  revalidateCollection,
  revalidateOnDelete,
} from "../hooks/revalidate.ts";

export const Industries: CollectionConfig = {
  slug: "industries",
  labels: {
    singular: "Industria",
    plural: "Industrias",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "icon", "comingSoon", "order", "updatedAt"],
    group: "Contenido del sitio",
    description:
      "Verticales que dominamos. Aparecen en home (sección Industrias) y como filtros en /industrias.",
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
      label: "Nombre de la industria",
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
      name: "icon",
      type: "select",
      label: "Ícono",
      options: [
        { label: "Scale (jurídico)", value: "Scale" },
        { label: "Stethoscope (médico)", value: "Stethoscope" },
        { label: "Users (asociaciones)", value: "Users" },
        { label: "ShoppingBag (comercio)", value: "ShoppingBag" },
        { label: "Landmark (gobierno)", value: "Landmark" },
      ],
    },
    {
      name: "shortDescription",
      type: "textarea",
      label: "Descripción corta",
      required: true,
    },
    {
      name: "comingSoon",
      type: "checkbox",
      label: "Marcar como 'Próximamente'",
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
