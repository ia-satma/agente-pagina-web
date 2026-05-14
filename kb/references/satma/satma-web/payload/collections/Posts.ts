import type { CollectionConfig } from "payload";
import {
  revalidateCollection,
  revalidateOnDelete,
} from "../hooks/revalidate.ts";

export const Posts: CollectionConfig = {
  slug: "posts",
  labels: {
    singular: "Artículo",
    plural: "Blog",
  },
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "author", "publishedAt", "_status"],
    group: "Contenido del sitio",
    description:
      "Diario satma. Artículos, ensayos y aprendizajes del equipo. Soportan drafts y se publican manual.",
  },
  versions: {
    drafts: true,
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
      label: "Slug",
      required: true,
      unique: true,
    },
    {
      name: "excerpt",
      type: "textarea",
      label: "Resumen",
      required: true,
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Imagen de portada",
    },
    {
      name: "content",
      type: "richText",
      label: "Contenido",
    },
    {
      name: "author",
      type: "relationship",
      relationTo: "users",
      label: "Autor",
    },
    {
      name: "tags",
      type: "array",
      label: "Tags",
      fields: [{ name: "tag", type: "text" }],
    },
    {
      name: "publishedAt",
      type: "date",
      label: "Fecha de publicación",
      defaultValue: () => new Date(),
    },
  ],
};
