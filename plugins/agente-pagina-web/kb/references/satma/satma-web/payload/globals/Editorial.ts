import type { GlobalConfig } from "payload";
import { revalidateSettings } from "../hooks/revalidate.ts";

/**
 * Editorial global — concentra TODO el copy editorial del sitio que vivía
 * hardcoded en componentes. Cada tab corresponde a una sección visible:
 *
 *   • Manifiesto         → home + /agencia (sección "Evolucionamos")
 *   • Proceso            → home + /servicios + /agencia
 *   • CTA Final          → todas las páginas (cierre de scroll)
 *   • Página /agencia    → stats + valores + bio de Santiago
 *
 * Cada cambio dispara `revalidatePath` en la página afectada, así que
 * editás aquí → la página pública se actualiza al instante (~1s).
 *
 * Defaults: cada campo lleva el copy actual del sitio en producción —
 * si nunca abrís el admin, el sitio se ve idéntico a hoy.
 */
export const Editorial: GlobalConfig = {
  slug: "editorial",
  label: "Contenido editorial",
  admin: {
    group: "Configuración",
    description:
      "Copy editorial de las secciones del home y /agencia: manifiesto, proceso, slogan del CTA final, stats y valores. Cambiar aquí actualiza el sitio público al instante.",
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateSettings],
  },
  fields: [
    {
      type: "tabs",
      tabs: [
        // ─────────────────────────────────────────────────────────────
        // TAB 1 — Manifiesto
        // ─────────────────────────────────────────────────────────────
        {
          label: "Manifiesto",
          description:
            "Sección \"Evolucionamos. Pero seguimos siendo personas...\" — aparece en home y /agencia.",
          fields: [
            {
              name: "manifestoEyebrow",
              type: "text",
              label: "Eyebrow (etiqueta superior)",
              defaultValue: "Manifiesto",
            },
            {
              name: "manifestoHeadline",
              type: "textarea",
              label: "Titular",
              defaultValue:
                "Evolucionamos. Pero seguimos siendo personas detrás de cada idea.",
            },
            {
              name: "manifestoBody",
              type: "textarea",
              label: "Texto principal",
              defaultValue:
                "La inteligencia artificial cambió la velocidad del juego, no las reglas. Una marca con sentido sigue requiriendo a alguien que sepa por qué existe, qué promete y a quién mira a los ojos. Nosotros somos esos alguien — con mejores herramientas que nunca.",
            },
            {
              name: "manifestoPilares",
              type: "array",
              label: "Pilares (las 3 columnas)",
              minRows: 3,
              maxRows: 3,
              defaultValue: [
                {
                  number: "01",
                  title: "Estrategia",
                  body: "Entendemos tu negocio, tu audiencia y tu competencia antes de proponer una sola idea. Las soluciones nacen del análisis, no del impulso.",
                },
                {
                  number: "02",
                  title: "Creatividad",
                  body: "La originalidad sigue siendo nuestro oficio. La IA acelera; nosotros decidimos qué historia vale la pena contar.",
                },
                {
                  number: "03",
                  title: "Inteligencia",
                  body: "Integramos herramientas de IA en cada fase: generación, análisis, automatización. Más velocidad, más profundidad, más impacto.",
                },
              ],
              fields: [
                { name: "number", type: "text", label: "Número (ej. 01)" },
                { name: "title", type: "text", label: "Título" },
                { name: "body", type: "textarea", label: "Descripción" },
              ],
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────
        // TAB 2 — Proceso
        // ─────────────────────────────────────────────────────────────
        {
          label: "Proceso",
          description:
            "Sección \"Bien planeadas, bien dirigidas, bien ejecutadas\" — 5 fases del proyecto. Aparece en home + /servicios.",
          fields: [
            {
              name: "processEyebrow",
              type: "text",
              label: "Eyebrow",
              defaultValue: "Cómo trabajamos",
            },
            {
              name: "processHeadline",
              type: "text",
              label: "Titular",
              defaultValue:
                "Bien planeadas. Bien dirigidas. Bien ejecutadas.",
            },
            {
              name: "processFases",
              type: "array",
              label: "Fases (5 pasos del proceso)",
              minRows: 1,
              maxRows: 10,
              defaultValue: [
                { number: "01", title: "Idea", body: "Todo empieza con una conversación honesta. Escuchamos el negocio, el reto y la ambición real." },
                { number: "02", title: "Análisis", body: "Auditamos audiencia, competencia y canales. La IA acelera la lectura de datos; nosotros leemos entre líneas." },
                { number: "03", title: "Estrategia", body: "Definimos objetivos, narrativa y plan de batalla. Realista en costos, ejecutable en tiempo." },
                { number: "04", title: "Ejecución", body: "Diseño, contenido, desarrollo, campañas. Equipos pequeños, ritmo alto, calidad innegociable." },
                { number: "05", title: "Optimización", body: "Medimos, aprendemos, ajustamos. La estrategia es viva: cada semana sumamos contexto." },
              ],
              fields: [
                { name: "number", type: "text", label: "Número (ej. 01)" },
                { name: "title", type: "text", label: "Título" },
                { name: "body", type: "textarea", label: "Descripción" },
              ],
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────
        // TAB 3 — CTA Final
        // ─────────────────────────────────────────────────────────────
        {
          label: "CTA Final",
          description:
            "Cierre de cada página: el slogan grande sobre fondo periwinkle con los botones \"Empezar proyecto\" + \"Escribir correo\".",
          fields: [
            {
              name: "ctaEyebrow",
              type: "text",
              label: "Brand mark eyebrow",
              defaultValue: "Agenc.IA Creativa",
              admin: {
                description:
                  "Línea italic encima del headline. La separación con punto en \"Agenc.IA\" hace el wordplay agencia + IA.",
              },
            },
            {
              name: "ctaHeadline",
              type: "text",
              label: "Headline grande",
              defaultValue: "¡Enfócate en tu Core Business!",
            },
            {
              name: "ctaSubheadlineBefore",
              type: "text",
              label: "Sub-headline (antes del énfasis)",
              defaultValue: "De lo demás nos encargamos",
            },
            {
              name: "ctaSubheadlineEmphasis",
              type: "text",
              label: "Sub-headline (palabra en negrita)",
              defaultValue: "nosotros",
            },
            {
              name: "ctaPrompt",
              type: "text",
              label: "Pregunta chica antes de los botones",
              defaultValue: "¿Listo para evolucionar?",
            },
            {
              name: "ctaPrimaryLabel",
              type: "text",
              label: "Botón primario",
              defaultValue: "Empezar un proyecto",
            },
            {
              name: "ctaSecondaryLabel",
              type: "text",
              label: "Botón secundario",
              defaultValue: "Escribir un correo",
            },
          ],
        },

        // ─────────────────────────────────────────────────────────────
        // TAB 4 — Página /agencia
        // ─────────────────────────────────────────────────────────────
        {
          label: "Página /agencia",
          description:
            "Stats de trayectoria, los 4 valores operativos, y la bio extendida de Santiago Álvarez en /agencia.",
          fields: [
            {
              name: "agenciaStats",
              type: "array",
              label: "Stats de trayectoria (números arriba de la página)",
              minRows: 1,
              maxRows: 6,
              defaultValue: [
                { value: 10, prefix: "+", suffix: "", label: "Años de experiencia" },
                { value: 150, prefix: "+", suffix: "", label: "Proyectos entregados" },
                { value: 5, prefix: "", suffix: "", label: "Industrias dominadas" },
                { value: 100, prefix: "", suffix: "%", label: "Clientes recurrentes" },
              ],
              fields: [
                { name: "value", type: "number", label: "Número" },
                { name: "prefix", type: "text", label: "Prefijo (ej. +)", required: false },
                { name: "suffix", type: "text", label: "Sufijo (ej. %)", required: false },
                { name: "label", type: "text", label: "Etiqueta debajo" },
              ],
            },
            {
              name: "valoresEyebrow",
              type: "text",
              label: "Eyebrow de la sección Valores",
              defaultValue: "Cómo trabajamos",
            },
            {
              name: "valoresHeadline",
              type: "text",
              label: "Titular de Valores",
              defaultValue: "Cuatro principios que no negociamos.",
            },
            {
              name: "valoresIntro",
              type: "textarea",
              label: "Texto intro de Valores",
              defaultValue:
                "Son lo que nos hace satma. La diferencia entre una agencia que entrega y una que construye con vos.",
            },
            {
              name: "valores",
              type: "array",
              label: "Valores operativos (las 4 cards)",
              minRows: 1,
              maxRows: 8,
              defaultValue: [
                { title: "Honestidad operativa", body: "Decimos lo que vemos, cobramos lo que vale, ejecutamos lo que prometemos. Sin humo, sin retórica de agencia." },
                { title: "Profundidad sectorial", body: "Antes de proponer, investigamos. Cinco industrias, cinco vocabularios, cinco maneras de mirar el mercado." },
                { title: "Tecnología al servicio", body: "La IA es nuestra herramienta, no nuestro discurso. Donde acelera, la usamos. Donde no, no la fingimos." },
                { title: "Talento mexicano", body: "Pensamos desde Monterrey, ejecutamos para todo el continente. Equipo local, ambición global." },
              ],
              fields: [
                { name: "title", type: "text", label: "Título" },
                { name: "body", type: "textarea", label: "Descripción" },
              ],
            },
            {
              name: "santiagoEyebrow",
              type: "text",
              label: "Eyebrow de la sección Founder",
              defaultValue: "Founder",
            },
            {
              name: "santiagoRolePill",
              type: "text",
              label: "Pill de rol bajo el nombre",
              defaultValue: "Managing Director · Fundador",
            },
            {
              name: "santiagoBioParagraphs",
              type: "array",
              label: "Bio (párrafos de Santiago)",
              minRows: 1,
              maxRows: 6,
              defaultValue: [
                { text: "Fundé SATMA hace más de una década con una idea simple: construir una agencia que combine la disciplina del oficio con la velocidad de las herramientas modernas. La parte más importante de un proyecto sigue siendo entender el negocio del cliente — el resto es ejecución." },
                { text: "Mi trayectoria es de más de quince años en estrategia de marca y comunicación para sectores regulados: despachos jurídicos, sector médico, asociaciones empresariales y ONGs, retail y comunicación gubernamental. Cada vertical tiene reglas distintas y vocabulario propio. Saberlas usar — y saber cuándo no improvisar — es la diferencia entre crecer y quedarse igual." },
                { text: "En 2026 estamos integrando IA como herramienta operativa en cada disciplina. La parte humana — el criterio, la relación, la decisión estratégica — sigue siendo nuestra. La IA acelera; nosotros decidimos qué historia vale la pena contar." },
              ],
              fields: [
                { name: "text", type: "textarea", label: "Párrafo" },
              ],
            },
            {
              name: "santiagoCredentials",
              type: "array",
              label: "Credenciales (grid debajo de bio)",
              minRows: 1,
              maxRows: 4,
              defaultValue: [
                { label: "Trayectoria", value: "+15 años · 5 verticales" },
                { label: "Base", value: "Monterrey · Nuevo León" },
                { label: "Idiomas", value: "Español · Inglés" },
              ],
              fields: [
                { name: "label", type: "text", label: "Etiqueta (uppercase)" },
                { name: "value", type: "text", label: "Valor" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
