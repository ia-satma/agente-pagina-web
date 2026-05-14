import type { CollectionConfig } from "payload";
import {
  revalidateCollection,
  revalidateOnDelete,
} from "../hooks/revalidate.ts";

export const Media: CollectionConfig = {
  slug: "media",
  labels: {
    singular: "Archivo",
    plural: "Archivos",
  },
  admin: {
    useAsTitle: "filename",
    group: "Configuración",
    description:
      "Imágenes, videos y documentos subidos. Se referencian desde otros campos (cover, gallery, etc.).",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateCollection],
    afterDelete: [revalidateOnDelete],
  },
  upload: {
    staticDir: "media",
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      // Square avatar — for /agencia team grid (56×56 display, retina x4).
      // Cropped center so portraits / headshots frame the face.
      { name: "avatar", width: 256, height: 256, position: "centre" },
      { name: "card", width: 768, height: 1024, position: "centre" },
      { name: "tablet", width: 1024, height: undefined, position: "centre" },
      { name: "desktop", width: 1920, height: undefined, position: "centre" },
    ],
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*", "video/*"],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Texto alternativo",
      required: true,
    },
    {
      name: "caption",
      type: "text",
      label: "Pie de foto (opcional)",
    },
  ],
};
