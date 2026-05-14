import { fileURLToPath } from "node:url";
import path from "node:path";
import { buildConfig } from "payload";
import { sqliteAdapter } from "@payloadcms/db-sqlite";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { es } from "payload/i18n/es";
import { en } from "payload/i18n/en";
import sharp from "sharp";

import { Users } from "./payload/collections/Users.ts";
import { Media } from "./payload/collections/Media.ts";
import { Services } from "./payload/collections/Services.ts";
import { Industries } from "./payload/collections/Industries.ts";
import { Cases } from "./payload/collections/Cases.ts";
import { Portfolio } from "./payload/collections/Portfolio.ts";
import { Posts } from "./payload/collections/Posts.ts";
import { Team } from "./payload/collections/Team.ts";
import { Testimonials } from "./payload/collections/Testimonials.ts";
import { Settings } from "./payload/globals/Settings.ts";
import { Editorial } from "./payload/globals/Editorial.ts";
import { Navigation } from "./payload/globals/Navigation.ts";
import {
  AvisoPrivacidad,
  PoliticaCookies,
  ContratoServicios,
} from "./payload/globals/LegalDocuments.ts";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export default buildConfig({
  admin: {
    user: Users.slug,
    // theme: "all" → admin user can switch between light/dark from the
    // user dropdown (top-right). Defaults to system preference on first load.
    theme: "all",
    meta: {
      titleSuffix: " · SATMA admin",
      description: "Panel administrativo de SATMA agencia creativa.",
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      views: {
        dashboard: {
          Component: "/payload/views/Dashboard.tsx#CustomDashboard",
        },
      },
      graphics: {
        Logo: "/payload/components/Logo.tsx#Logo",
        Icon: "/payload/components/Icon.tsx#Icon",
      },
      afterNavLinks: [
        "/payload/components/ViewSiteLink.tsx#ViewSiteLink",
        "/payload/components/LogoutLink.tsx#LogoutLink",
      ],
    },
  },
  collections: [
    Users,
    Media,
    Services,
    Industries,
    Cases,
    Portfolio,
    Posts,
    Team,
    Testimonials,
  ],
  globals: [
    Settings,
    Editorial,
    Navigation,
    AvisoPrivacidad,
    PoliticaCookies,
    ContratoServicios,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "DEV-ONLY-CHANGE-ME",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI || "file:./satma.db",
    },
  }),
  sharp,
  upload: {
    limits: {
      fileSize: 50_000_000, // 50 MB
    },
  },
  i18n: {
    supportedLanguages: { es, en },
    fallbackLanguage: "es",
  },
});
