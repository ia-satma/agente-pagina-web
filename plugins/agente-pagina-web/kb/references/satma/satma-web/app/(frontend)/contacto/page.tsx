import type { Metadata } from "next";
import { ArrowUpRight, Mail, MapPin, MessageSquare, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/sections/page-hero";
import { Reveal } from "@/components/animations/reveal";
import { site } from "@/lib/site";
import {
  JsonLd,
  buildBreadcrumb,
  buildContactPage,
  buildFAQ,
} from "@/components/seo/page-schemas";

/**
 * FAQ on /contacto — sourced from the same canonical answers used in the
 * voice-agent knowledge base (see knowledge-base/08-faq.md). Picked the
 * questions most likely to surface in Google's "People also ask" /
 * AI Overview block: pricing, scope, geography, timeline.
 *
 * Keep answers terse (1-3 sentences) — Google clips long answers.
 */
const FAQ: { question: string; answer: string }[] = [
  {
    question: "¿Cuánto cuesta un proyecto con SATMA?",
    answer:
      "Los presupuestos se arman a la medida según el alcance. Como referencia, manejamos rangos desde menos de $100,000 MXN para iniciativas pequeñas hasta más de $1,000,000 MXN para proyectos integrales. La primera conversación exploratoria de 30-45 minutos es gratis.",
  },
  {
    question: "¿En qué industrias trabaja SATMA?",
    answer:
      "Somos especialistas en cinco verticales: despachos jurídicos, sector médico, asociaciones empresariales y ONGs, comercializadoras y retail, e instituciones de gobierno. Para otros sectores evaluamos caso por caso.",
  },
  {
    question: "¿Trabajan solo en Monterrey o atienden a otras ciudades?",
    answer:
      "Tenemos sede en Monterrey, Nuevo León, pero atendemos clientes en todo México, Estados Unidos y Latinoamérica. La operación es híbrida: presencial en Monterrey y virtual para el resto.",
  },
  {
    question: "¿Hacen branding sin contratar más servicios?",
    answer:
      "Sí. Aceptamos proyectos puntuales de branding, identidad y manuales de marca sin necesidad de vender servicios adicionales. Lo mismo aplica a sitios web, video o cualquiera de las seis disciplinas.",
  },
  {
    question: "¿Cuánto tarda un proyecto típico?",
    answer:
      "Refresh de identidad: 4-6 semanas. Branding completo: 8-12 semanas. Sitio web mediano: 6-10 semanas. E-commerce: 10-16 semanas. Plataforma a medida: 12-24 semanas. Cada propuesta incluye cronograma detallado.",
  },
  {
    question: "¿Cómo empiezo a trabajar con SATMA?",
    answer:
      "Tres maneras: el formulario en /contacto, escribir directamente a santiago@satma.mx, o llamar/WhatsApp al +52 81 2399 7852. Te respondemos en menos de 24 horas hábiles para agendar una primera conversación.",
  },
  {
    question: "¿Qué es brujer.ia?",
    answer:
      "brujer.ia es la plataforma propia de SATMA dedicada a IA aplicada al marketing. Combina generación automática de contenido, análisis predictivo, asistentes conversacionales y automatización de flujos. Está en beta privada para 10 marcas en 2026.",
  },
  {
    question: "¿Realmente integran IA o es solo marketing?",
    answer:
      "La integramos en serio, pero como herramienta — no como discurso. Donde acelera (análisis, generación, automatización), la usamos. Donde no aporta, no la fingimos. Tenemos disciplina dedicada de IA aplicada y producto propio (brujer.ia).",
  },
];

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Hablemos. Email, teléfono y dirección de SATMA en Monterrey. O escríbenos directamente desde el formulario de contacto.",
};

const interes = [
  { value: "branding", label: "Branding & identidad" },
  { value: "marketing", label: "Marketing 360" },
  { value: "web", label: "Sitio web / plataforma" },
  { value: "ia", label: "IA aplicada" },
  { value: "otro", label: "Otro / no estoy seguro" },
];

const presupuesto = [
  { value: "lt-100k", label: "Menos de $100,000 MXN" },
  { value: "100-300", label: "$100,000 – $300,000 MXN" },
  { value: "300-1000", label: "$300,000 – $1,000,000 MXN" },
  { value: "gt-1000", label: "Más de $1,000,000 MXN" },
  { value: "asesoria", label: "Solo busco asesoría" },
];

export default function ContactoPage() {
  return (
    <>
      {/* SEO/GEO — ContactPage + FAQPage + Breadcrumb. The FAQPage rich
          result is one of the highest-ROI structured data types: it can
          surface as collapsible Q&A directly in Google search. */}
      <JsonLd
        data={buildContactPage({
          url: "/contacto",
          name: "Contacto — SATMA",
          description:
            "Datos de contacto directo de SATMA: email santiago@satma.mx, teléfono +52 81 2399 7852, oficina en Monterrey, NL. Respondemos en menos de 24 horas hábiles.",
        })}
      />
      <JsonLd
        data={buildBreadcrumb([
          { name: "Inicio", url: "/" },
          { name: "Contacto", url: "/contacto" },
        ])}
      />
      <JsonLd data={buildFAQ("/contacto", FAQ)} />

      <PageHero
        eyebrowNumber="07"
        eyebrowLabel="Contacto"
        headline={
          <>
            Hablemos.
            <br />
            <span className="italic font-light text-periwinkle">Sin rodeos.</span>
          </>
        }
        description="Cuéntanos del proyecto y te respondemos en menos de 24 horas hábiles. Si la conversación tiene sentido para ambas partes, agendamos una llamada exploratoria gratuita."
      />

      <section className="py-14 sm:py-20 lg:py-32">
        <Container>
          <div className="grid gap-16 lg:grid-cols-12 lg:gap-12">
            {/* Form */}
            <div className="lg:col-span-7">
              <form
                method="post"
                action={`mailto:${site.contact.email}`}
                encType="text/plain"
                className="grid gap-6"
              >
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Nombre completo" name="nombre" required />
                  <Field label="Empresa" name="empresa" required />
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <Field label="Email" name="email" type="email" required />
                  <Field label="Teléfono" name="telefono" type="tel" />
                </div>

                <FieldGroup label="¿Qué te interesa?">
                  <select
                    name="interes"
                    defaultValue=""
                    className="h-12 w-full rounded-xl border border-line bg-ink-soft/40 px-4 text-base text-off transition-colors focus:border-periwinkle focus:outline-none"
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {interes.map((i) => (
                      <option key={i.value} value={i.value}>
                        {i.label}
                      </option>
                    ))}
                  </select>
                </FieldGroup>

                <FieldGroup label="Presupuesto estimado">
                  <select
                    name="presupuesto"
                    defaultValue=""
                    className="h-12 w-full rounded-xl border border-line bg-ink-soft/40 px-4 text-base text-off transition-colors focus:border-periwinkle focus:outline-none"
                  >
                    <option value="" disabled>
                      Selecciona un rango
                    </option>
                    {presupuesto.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </FieldGroup>

                <FieldGroup label="Cuéntanos del reto">
                  <textarea
                    name="mensaje"
                    rows={6}
                    placeholder="¿Qué problema queremos resolver? ¿Qué intentaste antes? ¿Cuándo necesitas resultados?"
                    className="w-full resize-none rounded-xl border border-line bg-ink-soft/40 px-4 py-3 text-base text-off placeholder:text-off/35 transition-colors focus:border-periwinkle focus:outline-none"
                  />
                </FieldGroup>

                <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
                  <p className="max-w-md text-xs text-muted">
                    Al enviar este formulario aceptas nuestro{" "}
                    <a className="underline hover:text-periwinkle" href="/aviso-privacidad">
                      aviso de privacidad
                    </a>
                    .
                  </p>
                  <button
                    type="submit"
                    className="inline-flex h-14 items-center gap-2 rounded-full bg-periwinkle px-8 font-display text-base font-medium tracking-tight text-navy transition-all hover:bg-mist active:scale-[0.98]"
                  >
                    Enviar mensaje <ArrowUpRight size={18} />
                  </button>
                </div>
              </form>
            </div>

            {/* Direct contact panel */}
            <aside className="lg:col-span-5">
              <Reveal>
                <div className="rounded-3xl border border-line bg-ink-soft/40 p-8 lg:p-10">
                  <h2 className="font-display text-2xl font-medium tracking-tight">
                    O escríbenos directo
                  </h2>
                  <p className="mt-3 text-muted text-pretty">
                    Si prefieres saltarte el formulario, todos los caminos llegan al mismo lugar.
                  </p>

                  <ul className="mt-10 space-y-6">
                    <ContactRow
                      icon={Mail}
                      label="Email"
                      value={site.contact.email}
                      href={`mailto:${site.contact.email}`}
                    />
                    <ContactRow
                      icon={Phone}
                      label="Llamada / WhatsApp"
                      value={site.contact.phone}
                      href={`tel:${site.contact.phone.replace(/\s/g, "")}`}
                      secondary={site.contact.phoneAlt}
                      secondaryHref={`tel:${site.contact.phoneAlt.replace(/\s/g, "")}`}
                    />
                    <ContactRow
                      icon={MapPin}
                      label="Oficina"
                      value={`${site.contact.address.street}, ${site.contact.address.neighborhood}`}
                      secondary={`${site.contact.address.city}, ${site.contact.address.state} ${site.contact.address.zip}`}
                    />
                  </ul>

                  <div className="mt-10 border-t border-line pt-8">
                    <ButtonLink
                      href="https://maps.google.com/?q=Simón+Bolívar+224+Monterrey"
                      target="_blank"
                      variant="secondary"
                      size="md"
                      className="w-full"
                    >
                      <MapPin size={16} /> Cómo llegar
                    </ButtonLink>
                  </div>
                </div>

                <div className="mt-6 rounded-3xl border border-periwinkle/30 bg-periwinkle/[0.05] p-8 lg:p-10">
                  <MessageSquare size={24} className="text-periwinkle" />
                  <h3 className="mt-5 font-display text-xl font-medium tracking-tight">
                    Tiempo de respuesta
                  </h3>
                  <p className="mt-3 text-muted text-pretty">
                    Respondemos en menos de 24 horas hábiles. Si urge antes, llámanos directo.
                  </p>
                </div>
              </Reveal>
            </aside>
          </div>
        </Container>
      </section>
    </>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <FieldGroup label={label} required={required}>
      <input
        name={name}
        type={type}
        required={required}
        className="h-12 w-full rounded-xl border border-line bg-ink-soft/40 px-4 text-base text-off placeholder:text-off/35 transition-colors focus:border-periwinkle focus:outline-none"
      />
    </FieldGroup>
  );
}

function FieldGroup({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted">
        {label}
        {required && <span className="ml-1 text-periwinkle">*</span>}
      </span>
      {children}
    </label>
  );
}

function ContactRow({
  icon: Icon,
  label,
  value,
  href,
  secondary,
  secondaryHref,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  value: string;
  href?: string;
  secondary?: string;
  secondaryHref?: string;
}) {
  const content = (
    <span className="block hover:text-periwinkle">{value}</span>
  );
  return (
    <li className="flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-line bg-ink text-periwinkle">
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <div className="text-xs uppercase tracking-[0.25em] text-muted">
          {label}
        </div>
        <div className="mt-1 font-display text-lg leading-tight">
          {href ? <a href={href}>{content}</a> : content}
          {secondary && (
            <span className="mt-1 block text-sm text-muted">
              {secondaryHref ? (
                <a href={secondaryHref} className="hover:text-periwinkle">
                  {secondary}
                </a>
              ) : (
                secondary
              )}
            </span>
          )}
        </div>
      </div>
    </li>
  );
}
