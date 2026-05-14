import type { ComponentProps } from "react";
import { LegalPage, makeLegalMetadata } from "@/components/sections/legal-page";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getLegal, hasLexicalContent } from "@/lib/editorial";

type RichTextData = ComponentProps<typeof RichText>["data"];

export const metadata = makeLegalMetadata(
  "Política de cookies",
  "Cómo SATMA usa cookies y tecnologías similares en su sitio web.",
);

// Hardcoded fallback date — used only if the editor hasn't filled the
// `lastUpdated` field in /admin → Globals → "Legal — Política de cookies".
const FALLBACK_LAST_UPDATED = "27 de abril de 2026";

export default async function PoliticaCookies() {
  const legal = await getLegal("politicaCookies");
  const lexicalBody =
    legal?.body && hasLexicalContent(legal.body)
      ? (legal.body as RichTextData)
      : null;
  const lastUpdated = legal?.lastUpdated || FALLBACK_LAST_UPDATED;

  return (
    <LegalPage
      number="L2"
      label="Legal"
      title={<>Política de <span className="italic font-light text-periwinkle">cookies</span>.</>}
      lastUpdated={lastUpdated}
      slug="politica-cookies"
      schemaTitle="Política de cookies — SATMA"
      schemaDescription="Cómo SATMA usa cookies y tecnologías similares en su sitio web."
    >
      {lexicalBody ? (
        <RichText data={lexicalBody} disableContainer />
      ) : (
        <>
          <p>
            Este sitio utiliza cookies y tecnologías similares para mejorar tu experiencia de navegación, analizar el uso del sitio y entregarte contenido relevante.
          </p>

          <h2>1. ¿Qué son las cookies?</h2>
          <p>
            Las cookies son pequeños archivos de texto que se almacenan en tu navegador cuando visitas un sitio web. Permiten al sitio recordar tus acciones y preferencias durante un periodo determinado.
          </p>

          <h2>2. Tipos de cookies que usamos</h2>
          <h3>Cookies estrictamente necesarias</h3>
          <p>
            Permiten el funcionamiento básico del sitio (navegación, acceso a áreas seguras, preferencia de tema día/noche). No pueden desactivarse.
          </p>
          <h3>Cookies de analítica</h3>
          <p>
            Nos ayudan a entender cómo se usa el sitio mediante datos agregados y anónimos. Utilizamos Vercel Analytics y, eventualmente, PostHog.
          </p>
          <h3>Cookies de funcionalidad</h3>
          <p>
            Recuerdan tus preferencias (idioma, modo claro/oscuro) para mejorar tu experiencia.
          </p>

          <h2>3. Cómo gestionar las cookies</h2>
          <p>
            Puedes configurar o deshabilitar las cookies desde tu navegador. Sin embargo, algunas funciones del sitio pueden dejar de funcionar correctamente si las desactivas todas.
          </p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noreferrer">Chrome</a></li>
            <li><a href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias" target="_blank" rel="noreferrer">Firefox</a></li>
            <li><a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noreferrer">Safari</a></li>
            <li><a href="https://support.microsoft.com/es-es/microsoft-edge" target="_blank" rel="noreferrer">Edge</a></li>
          </ul>

          <h2>4. Modificaciones</h2>
          <p>
            Esta política puede actualizarse cuando incorporemos nuevas herramientas. La fecha de última actualización aparece al inicio del documento.
          </p>
        </>
      )}
    </LegalPage>
  );
}
