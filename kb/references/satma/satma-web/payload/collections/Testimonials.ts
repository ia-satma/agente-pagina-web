import type { CollectionConfig } from "payload";
import {
  revalidateCollection,
  revalidateOnDelete,
} from "../hooks/revalidate.ts";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: {
    singular: "Testimonio",
    plural: "Testimonios",
  },
  admin: {
    useAsTitle: "author",
    defaultColumns: ["author", "role", "company", "featured", "order"],
    group: "Contenido del sitio",
    description:
      "Citas de clientes. Aparecen en home (sección Lo que dicen) y en /agencia.",
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
      name: "quote",
      type: "textarea",
      label: "Cita / testimonio",
      required: true,
    },
    {
      name: "author",
      type: "text",
      label: "Autor",
      required: true,
    },
    {
      name: "role",
      type: "text",
      label: "Cargo",
    },
    {
      name: "company",
      type: "text",
      label: "Empresa / contexto",
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      label: "Foto del autor",
    },
    {
      name: "featured",
      type: "checkbox",
      label: "Destacar en home",
      defaultValue: true,
    },
    {
      name: "order",
      type: "number",
      label: "Orden",
      defaultValue: 0,
    },
  ],
};
