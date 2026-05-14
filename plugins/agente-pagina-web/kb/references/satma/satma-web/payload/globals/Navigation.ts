import type { GlobalConfig } from "payload";
import { revalidateNavigation } from "../hooks/revalidate.ts";

/**
 * Navigation global — controls which top-level menu links appear on
 * the public site (header desktop nav, footer column, mobile drawer).
 *
 * Each row has:
 *   • label — what the user sees (e.g. "Servicios")
 *   • href — the route, with leading slash (e.g. "/servicios")
 *   • enabled — toggle. If unchecked, the item is hidden everywhere.
 *
 * Default rows match the legacy `lib/site.ts` nav. Editors can re-order,
 * rename, hide or add items without redeploying. Hidden items are
 * filtered out at fetch time in `lib/navigation.ts`.
 *
 * Why a Global (not a collection): nav is singleton — there's one menu,
 * not many. Globals give us a single editing surface in /admin and
 * keep the data shape predictable.
 */
export const Navigation: GlobalConfig = {
  slug: "navigation",
  label: "Menú de navegación",
  admin: {
    group: "Configuración",
    description:
      "Controla qué secciones aparecen en el menú del sitio (header, footer, móvil). Marcar 'Visible' muestra el ítem; desmarcarlo lo oculta sin borrarlo.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateNavigation],
  },
  fields: [
    {
      name: "items",
      type: "array",
      label: "Items del menú",
      labels: { singular: "Item", plural: "Items" },
      admin: {
        description:
          "Cada fila es un link del menú. Reordená arrastrando. Desmarcá 'Visible' para ocultar sin borrar.",
        initCollapsed: false,
      },
      defaultValue: [
        { label: "Agencia", href: "/agencia", enabled: true },
        { label: "Servicios", href: "/servicios", enabled: true },
        { label: "Industrias", href: "/industrias", enabled: true },
        { label: "Casos", href: "/casos", enabled: true },
        { label: "Portafolio", href: "/portafolio", enabled: true },
        { label: "brujer.ia", href: "/brujer-ia", enabled: false },
        { label: "Blog", href: "/blog", enabled: true },
        { label: "Contacto", href: "/contacto", enabled: true },
      ],
      fields: [
        {
          name: "label",
          type: "text",
          label: "Texto que se muestra",
          required: true,
        },
        {
          name: "href",
          type: "text",
          label: "URL / ruta",
          required: true,
          admin: {
            description:
              "Ruta interna (con slash inicial, ej. '/servicios') o URL completa (ej. 'https://...').",
          },
        },
        {
          name: "enabled",
          type: "checkbox",
          label: "Visible en el menú",
          defaultValue: true,
        },
      ],
    },
  ],
};
