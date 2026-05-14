import type { ComponentProps } from "react";
import { LegalPage, makeLegalMetadata } from "@/components/sections/legal-page";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getLegal, hasLexicalContent } from "@/lib/editorial";

// Bridge `unknown` → the Lexical state shape RichText expects.
type RichTextData = ComponentProps<typeof RichText>["data"];

export const metadata = makeLegalMetadata(
  "Aviso de privacidad",
  "Aviso de privacidad de SATMA conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares.",
);

// Hardcoded fallback date — used only if the editor hasn't filled the
// `lastUpdated` field in /admin → Globals → "Legal — Aviso de privacidad".
const FALLBACK_LAST_UPDATED = "27 de abril de 2026";

export default async function AvisoPrivacidad() {
  // Fetch from Payload global. If the editor has populated the body in
  // /admin, we render that Lexical state via RichText. Otherwise we fall
  // back to the original hardcoded JSX so the page never breaks.
  const legal = await getLegal("avisoPrivacidad");
  const lexicalBody =
    legal?.body && hasLexicalContent(legal.body)
      ? (legal.body as RichTextData)
      : null;
  const lastUpdated = legal?.lastUpdated || FALLBACK_LAST_UPDATED;

  return (
    <LegalPage
      number="L1"
      label="Legal"
      title={<>Aviso de <span className="italic font-light text-periwinkle">privacidad</span>.</>}
      lastUpdated={lastUpdated}
      slug="aviso-privacidad"
      schemaTitle="Aviso de privacidad — SATMA"
      schemaDescription="Aviso de privacidad de SATMA conforme a la Ley Federal de Protección de Datos Personales en Posesión de los Particulares."
    >
      {lexicalBody ? (
        // disableContainer = no wrapper div — the LegalPage `<article>`
        // already wraps the content with the right prose selectors.
        <RichText data={lexicalBody} disableContainer />
      ) : (
        <>
          <p>
            En cumplimiento de la <strong>Ley Federal de Protección de Datos Personales en Posesión de los Particulares</strong>, ponemos a disposición de los titulares el presente Aviso de Privacidad.
          </p>

          <h2>1. Identidad del responsable</h2>
          <p>
            SATMA, agencia creativa, con domicilio en Simón Bolívar 224, Of. 301, Col. Chepevera, Monterrey, NL, C.P. 64030, México, es responsable del uso, protección y tratamiento de tus datos personales.
          </p>

          <h2>2. Datos personales que recabamos</h2>
          <p>Recabamos los siguientes datos personales cuando interactúas con nosotros:</p>
          <ul>
            <li>Nombre completo, correo electrónico y teléfono</li>
            <li>Empresa, cargo y datos de contacto profesional</li>
            <li>Información del proyecto que nos compartas en formularios o reuniones</li>
            <li>Datos de navegación obtenidos por cookies (ver Política de cookies)</li>
          </ul>

          <h2>3. Finalidades del tratamiento</h2>
          <p>Tus datos personales serán utilizados para:</p>
          <ul>
            <li>Atender solicitudes de contacto y propuestas comerciales</li>
            <li>Prestar los servicios de marketing y diseño contratados</li>
            <li>Emitir facturación y comprobantes fiscales</li>
            <li>Mantener comunicación con clientes activos y prospectos calificados</li>
            <li>Mejorar nuestros servicios mediante análisis estadístico agregado</li>
          </ul>

          <h2>4. Transferencia de datos</h2>
          <p>
            SATMA no transfiere tus datos personales a terceros sin tu consentimiento, salvo en los casos previstos por la ley o cuando la operación del servicio contratado lo requiera (por ejemplo, plataformas de email o publicidad).
          </p>

          <h2>5. Tus derechos ARCO</h2>
          <p>
            Tienes derecho a <strong>acceder</strong>, <strong>rectificar</strong>, <strong>cancelar</strong> u <strong>oponerte</strong> al tratamiento de tus datos personales, así como a revocar el consentimiento otorgado. Para ejercer estos derechos, envíanos un correo a <a href="mailto:santiago@satma.mx">santiago@satma.mx</a> con la información que identifique tu solicitud.
          </p>

          <h2>6. Modificaciones al aviso</h2>
          <p>
            Nos reservamos el derecho de actualizar este aviso. Cualquier cambio será publicado en esta misma página con la fecha de su última modificación.
          </p>

          <h2>7. Contacto</h2>
          <p>
            Para cualquier duda sobre el tratamiento de tus datos personales, escríbenos a <a href="mailto:santiago@satma.mx">santiago@satma.mx</a>.
          </p>
        </>
      )}
    </LegalPage>
  );
}
