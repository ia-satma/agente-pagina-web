import type { CollectionConfig } from "payload";
import {
  revalidateCollection,
  revalidateOnDelete,
} from "../hooks/revalidate.ts";

export const Team: CollectionConfig = {
  slug: "team",
  labels: {
    singular: "Miembro del equipo",
    plural: "Equipo",
  },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
    group: "Contenido del sitio",
    description:
      "Personas detrás de SATMA. Aparecen en /agencia → sección \"Personas detrás de SATMA\". Si dejas la foto en blanco se muestra una inicial estilizada como fallback. La entrada \"Santiago Álvarez\" se filtra automáticamente porque tiene su sección dedicada arriba.",
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
      label: "Nombre",
      required: true,
    },
    {
      name: "role",
      type: "text",
      label: "Cargo",
      required: true,
    },
    {
      name: "photo",
      type: "upload",
      relationTo: "media",
      label: "Foto (modo noche)",
      // Restrict the picker to images only — `media` accepts video too.
      filterOptions: {
        mimeType: { contains: "image" },
      },
      admin: {
        description:
          "Foto pensada para modo noche (fondo oscuro). Si solo subís UNA foto se usa en ambos modos. Resolución mínima 800×800 px, formatos JPG/PNG/WebP.",
      },
    },
    {
      name: "photoLight",
      type: "upload",
      relationTo: "media",
      label: "Foto (modo día)",
      filterOptions: {
        mimeType: { contains: "image" },
      },
      admin: {
        description:
          "Variante para modo día (fondo claro). Opcional — si la dejás en blanco, modo día usa la foto principal de arriba.",
      },
    },
    {
      name: "location",
      type: "text",
      label: "Ubicación",
      defaultValue: "Monterrey, Nuevo León",
      admin: {
        description:
          "Ciudad donde vive / opera la persona. Aparece como subtítulo en la card.",
      },
    },
    {
      name: "bio",
      type: "textarea",
      label: "Biografía corta",
    },
    {
      name: "linkedin",
      type: "text",
      label: "LinkedIn URL",
    },
    {
      name: "order",
      type: "number",
      label: "Orden",
      defaultValue: 0,
    },
  ],
};
