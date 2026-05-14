import type { ComponentProps } from "react";
import { LegalPage, makeLegalMetadata } from "@/components/sections/legal-page";
import { RichText } from "@payloadcms/richtext-lexical/react";
import { getLegal, hasLexicalContent } from "@/lib/editorial";

type RichTextData = ComponentProps<typeof RichText>["data"];

export const metadata = makeLegalMetadata(
  "Contrato de prestación de servicios",
  "Términos generales que rigen los servicios prestados por SATMA a sus clientes.",
);

// Hardcoded fallback date — used only if the editor hasn't filled the
// `lastUpdated` field in /admin → Globals → "Legal — Contrato de servicios".
const FALLBACK_LAST_UPDATED = "27 de abril de 2026";

export default async function ContratoServicios() {
  const legal = await getLegal("contratoServicios");
  const lexicalBody =
    legal?.body && hasLexicalContent(legal.body)
      ? (legal.body as RichTextData)
      : null;
  const lastUpdated = legal?.lastUpdated || FALLBACK_LAST_UPDATED;

  return (
    <LegalPage
      number="L3"
      label="Legal"
      title={<>Contrato de <span className="italic font-light text-periwinkle">servicios</span>.</>}
      lastUpdated={lastUpdated}
      slug="contrato-servicios"
      schemaTitle="Contrato de prestación de servicios — SATMA"
      schemaDescription="Términos generales que rigen los servicios prestados por SATMA a sus clientes."
    >
      {lexicalBody ? (
        <RichText data={lexicalBody} disableContainer />
      ) : (
        <>
          <p>
            Los siguientes términos generales rigen la relación entre SATMA y sus clientes, salvo que se acuerde lo contrario por escrito en una propuesta o adenda firmada por ambas partes.
          </p>

          <h2>1. Objeto</h2>
          <p>
            SATMA prestará los servicios descritos en cada propuesta comercial, los cuales podrán incluir: branding, diseño, desarrollo web, marketing digital, contenido, video, IA aplicada y servicios relacionados.
          </p>

          <h2>2. Alcance y entregables</h2>
          <p>
            Los entregables específicos, plazos y horas estimadas se documentan en cada propuesta comercial aceptada. Cualquier cambio fuera del alcance original deberá ser cotizado y aprobado por escrito antes de ejecutarse.
          </p>

          <h2>3. Honorarios y forma de pago</h2>
          <p>
            Los honorarios se especifican en cada propuesta. Salvo acuerdo distinto, se factura el 50% al inicio del proyecto y el 50% restante contra entrega final. Los servicios mensuales se facturan al inicio de cada período.
          </p>

          <h2>4. Propiedad intelectual</h2>
          <p>
            Todos los entregables finales aprobados pasan a ser propiedad del cliente una vez liquidado el pago total. SATMA conserva el derecho de utilizar el trabajo en su portafolio y materiales promocionales, salvo NDA específica.
          </p>

          <h2>5. Confidencialidad</h2>
          <p>
            Ambas partes acuerdan mantener bajo estricta confidencialidad toda información comercial, técnica o estratégica intercambiada durante la relación, incluso después de terminado el contrato.
          </p>

          <h2>6. Vigencia y terminación</h2>
          <p>
            El contrato vigorará desde la fecha de aceptación de la propuesta y hasta la entrega final. Cualquiera de las partes puede dar por terminada la relación con aviso previo de 30 días naturales por escrito.
          </p>

          <h2>7. Limitación de responsabilidad</h2>
          <p>
            La responsabilidad total de SATMA frente al cliente, por cualquier causa, no excederá el monto total efectivamente pagado por el cliente en los seis meses anteriores al evento que origine el reclamo.
          </p>

          <h2>8. Jurisdicción</h2>
          <p>
            Para la interpretación y cumplimiento de este contrato, las partes se someten a las leyes y tribunales competentes de Monterrey, Nuevo León, México.
          </p>

          <h2>9. Contacto</h2>
          <p>
            Para cualquier duda sobre estos términos, escríbenos a <a href="mailto:santiago@satma.mx">santiago@satma.mx</a>.
          </p>
        </>
      )}
    </LegalPage>
  );
}
