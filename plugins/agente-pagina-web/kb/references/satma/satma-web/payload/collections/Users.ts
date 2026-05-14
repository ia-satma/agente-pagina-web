import type { CollectionConfig } from "payload";

export const Users: CollectionConfig = {
  slug: "users",
  labels: {
    singular: "Usuario",
    plural: "Usuarios",
  },
  admin: {
    useAsTitle: "email",
    defaultColumns: ["email", "name", "role"],
    group: "Sistema",
    description:
      "Cuentas con acceso al panel administrativo. Solo administradores pueden crear/editar usuarios.",
  },
  auth: true,
  fields: [
    {
      name: "name",
      type: "text",
      label: "Nombre",
      required: true,
    },
    {
      name: "role",
      type: "select",
      label: "Rol",
      defaultValue: "editor",
      options: [
        { label: "Administrador", value: "admin" },
        { label: "Editor", value: "editor" },
        { label: "Redactor", value: "redactor" },
      ],
    },
  ],
};
