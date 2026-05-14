import type { Metadata } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ThemeInit } from "@/components/layout/theme-init";
import { MouseSpotlight } from "@/components/effects/mouse-spotlight";
// import { AmbientMesh } from "@/components/ui/ambient-mesh"; // disabled — colored blobs killed text contrast in light mode
import { SiteGrid } from "@/components/ui/site-grid";
import { VoiceAgent } from "@/components/ai/voice-agent";
import { RootStructuredData } from "@/components/seo/structured-data";
import { site } from "@/lib/site";
import { getNavigation } from "@/lib/navigation";

const display = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: { default: `${site.fullName}`, template: `%s · ${site.name}` },
  description: site.description,
  metadataBase: new URL(site.url),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: site.name,
    title: site.fullName,
    description: site.description,
    url: site.url,
  },
  twitter: {
    card: "summary_large_image",
    title: site.fullName,
    description: site.description,
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.ico" },
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetch the menu once at the layout level — the editor controls
  // visibility from /admin → Globals → "Menú de navegación".
  // Header is a client component so we pass the data in via props;
  // Footer is async server and fetches it itself. Both share the
  // same revalidation hook so an edit shows up in <2s.
  const navItems = await getNavigation();
  return (
    <html
      lang="es-MX"
      className={`${display.variable} ${body.variable}`}
      data-theme="dark"
      suppressHydrationWarning
    >
      <head>
        <ThemeInit />
        {/* JSON-LD structured data (Organization + LocalBusiness + WebSite)
            — emitted on every (frontend) page so search engines + AI
            crawlers have a stable graph anchor for SATMA. */}
        <RootStructuredData />
      </head>
      <body className="min-h-dvh flex flex-col bg-ink text-off antialiased">
        {/* Site-wide atmosphere:
            1. SiteGrid (z=-20) — brand dot grid pattern, static at 50%
            2. film-grain (z=-5) — film texture for premium feel
            (AmbientMesh removed — colored blobs interfered with text legibility
             in light mode. Body bg-image keeps the soft mesh atmosphere.) */}
        <SiteGrid />
        <div className="film-grain" aria-hidden />

        <MouseSpotlight />
        <Header navItems={navItems} />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />

        {/* Floating AI chat (text + voice) — powered by ElevenLabs
            Conversational AI. Lives outside <main> so it sits over every
            page in the (frontend) tree, but is excluded from /admin via
            the (payload) route group. */}
        <VoiceAgent />
      </body>
    </html>
  );
}
