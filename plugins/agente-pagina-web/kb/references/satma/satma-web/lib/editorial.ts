/**
 * Server-side helpers for reading Payload globals on the public pages.
 *
 * Each helper:
 *   • lazy-loads the Payload client via the singleton in `payload-client.ts`
 *   • returns the global as a typed shape with sensible fallbacks if the
 *     editor hasn't filled a field yet
 *   • throws nothing on failure — falls back to default copy so a missing
 *     global never crashes the public page
 *
 * Usage from any server component:
 *   const editorial = await getEditorial();
 *   <h2>{editorial.manifestoHeadline}</h2>
 */
import { getPayloadClient } from "@/lib/payload-client";

// ── Types — match the field shapes defined in
//    `payload/globals/Editorial.ts`. ─────────────────────────────────────

export type ManifestoPilar = { number: string; title: string; body: string };
export type ProcesoFase = { number: string; title: string; body: string };
export type AgenciaStat = {
  value: number;
  prefix?: string;
  suffix?: string;
  label: string;
};
export type AgenciaValor = { title: string; body: string };
export type SantiagoBioParagraph = { text: string };
export type SantiagoCredential = { label: string; value: string };

export type EditorialContent = {
  // Manifiesto
  manifestoEyebrow: string;
  manifestoHeadline: string;
  manifestoBody: string;
  manifestoPilares: ManifestoPilar[];
  // Proceso
  processEyebrow: string;
  processHeadline: string;
  processFases: ProcesoFase[];
  // CTA Final
  ctaEyebrow: string;
  ctaHeadline: string;
  ctaSubheadlineBefore: string;
  ctaSubheadlineEmphasis: string;
  ctaPrompt: string;
  ctaPrimaryLabel: string;
  ctaSecondaryLabel: string;
  // /agencia
  agenciaStats: AgenciaStat[];
  valoresEyebrow: string;
  valoresHeadline: string;
  valoresIntro: string;
  valores: AgenciaValor[];
  santiagoEyebrow: string;
  santiagoRolePill: string;
  santiagoBioParagraphs: SantiagoBioParagraph[];
  santiagoCredentials: SantiagoCredential[];
};

// ── Defaults — used as fallback when the global isn't fetched (e.g.
//    DB unavailable in a build context). Same copy as the original
//    hardcoded values, so the page never breaks. ─────────────────────────

const DEFAULTS: EditorialContent = {
  manifestoEyebrow: "Manifiesto",
  manifestoHeadline:
    "Evolucionamos. Pero seguimos siendo personas detrás de cada idea.",
  manifestoBody:
    "La inteligencia artificial cambió la velocidad del juego, no las reglas. Una marca con sentido sigue requiriendo a alguien que sepa por qué existe, qué promete y a quién mira a los ojos. Nosotros somos esos alguien — con mejores herramientas que nunca.",
  manifestoPilares: [
    { number: "01", title: "Estrategia", body: "Entendemos tu negocio, tu audiencia y tu competencia antes de proponer una sola idea. Las soluciones nacen del análisis, no del impulso." },
    { number: "02", title: "Creatividad", body: "La originalidad sigue siendo nuestro oficio. La IA acelera; nosotros decidimos qué historia vale la pena contar." },
    { number: "03", title: "Inteligencia", body: "Integramos herramientas de IA en cada fase: generación, análisis, automatización. Más velocidad, más profundidad, más impacto." },
  ],
  processEyebrow: "Cómo trabajamos",
  processHeadline: "Bien planeadas. Bien dirigidas. Bien ejecutadas.",
  processFases: [
    { number: "01", title: "Idea", body: "Todo empieza con una conversación honesta. Escuchamos el negocio, el reto y la ambición real." },
    { number: "02", title: "Análisis", body: "Auditamos audiencia, competencia y canales. La IA acelera la lectura de datos; nosotros leemos entre líneas." },
    { number: "03", title: "Estrategia", body: "Definimos objetivos, narrativa y plan de batalla. Realista en costos, ejecutable en tiempo." },
    { number: "04", title: "Ejecución", body: "Diseño, contenido, desarrollo, campañas. Equipos pequeños, ritmo alto, calidad innegociable." },
    { number: "05", title: "Optimización", body: "Medimos, aprendemos, ajustamos. La estrategia es viva: cada semana sumamos contexto." },
  ],
  ctaEyebrow: "Agenc.IA Creativa",
  ctaHeadline: "¡Enfócate en tu Core Business!",
  ctaSubheadlineBefore: "De lo demás nos encargamos",
  ctaSubheadlineEmphasis: "nosotros",
  ctaPrompt: "¿Listo para evolucionar?",
  ctaPrimaryLabel: "Empezar un proyecto",
  ctaSecondaryLabel: "Escribir un correo",
  agenciaStats: [
    { value: 10, prefix: "+", label: "Años de experiencia" },
    { value: 150, prefix: "+", label: "Proyectos entregados" },
    { value: 5, label: "Industrias dominadas" },
    { value: 100, suffix: "%", label: "Clientes recurrentes" },
  ],
  valoresEyebrow: "Cómo trabajamos",
  valoresHeadline: "Cuatro principios que no negociamos.",
  valoresIntro:
    "Son lo que nos hace satma. La diferencia entre una agencia que entrega y una que construye con vos.",
  valores: [
    { title: "Honestidad operativa", body: "Decimos lo que vemos, cobramos lo que vale, ejecutamos lo que prometemos. Sin humo, sin retórica de agencia." },
    { title: "Profundidad sectorial", body: "Antes de proponer, investigamos. Cinco industrias, cinco vocabularios, cinco maneras de mirar el mercado." },
    { title: "Tecnología al servicio", body: "La IA es nuestra herramienta, no nuestro discurso. Donde acelera, la usamos. Donde no, no la fingimos." },
    { title: "Talento mexicano", body: "Pensamos desde Monterrey, ejecutamos para todo el continente. Equipo local, ambición global." },
  ],
  santiagoEyebrow: "Founder",
  santiagoRolePill: "Managing Director · Fundador",
  santiagoBioParagraphs: [
    { text: "Fundé SATMA hace más de una década con una idea simple: construir una agencia que combine la disciplina del oficio con la velocidad de las herramientas modernas. La parte más importante de un proyecto sigue siendo entender el negocio del cliente — el resto es ejecución." },
    { text: "Mi trayectoria es de más de quince años en estrategia de marca y comunicación para sectores regulados: despachos jurídicos, sector médico, asociaciones empresariales y ONGs, retail y comunicación gubernamental. Cada vertical tiene reglas distintas y vocabulario propio. Saberlas usar — y saber cuándo no improvisar — es la diferencia entre crecer y quedarse igual." },
    { text: "En 2026 estamos integrando IA como herramienta operativa en cada disciplina. La parte humana — el criterio, la relación, la decisión estratégica — sigue siendo nuestra. La IA acelera; nosotros decidimos qué historia vale la pena contar." },
  ],
  santiagoCredentials: [
    { label: "Trayectoria", value: "+15 años · 5 verticales" },
    { label: "Base", value: "Monterrey · Nuevo León" },
    { label: "Idiomas", value: "Español · Inglés" },
  ],
};

/**
 * Load the Editorial global. Falls back to DEFAULTS on any error so a
 * misconfigured/empty global never blocks a page render.
 */
export async function getEditorial(): Promise<EditorialContent> {
  try {
    const payload = await getPayloadClient();
    const doc = (await payload.findGlobal({
      slug: "editorial" as never,
      overrideAccess: true,
      depth: 0,
    })) as unknown as Partial<EditorialContent>;

    // Merge field-by-field so missing/null fields fall back to defaults.
    return {
      manifestoEyebrow: doc.manifestoEyebrow || DEFAULTS.manifestoEyebrow,
      manifestoHeadline: doc.manifestoHeadline || DEFAULTS.manifestoHeadline,
      manifestoBody: doc.manifestoBody || DEFAULTS.manifestoBody,
      manifestoPilares:
        Array.isArray(doc.manifestoPilares) && doc.manifestoPilares.length > 0
          ? doc.manifestoPilares
          : DEFAULTS.manifestoPilares,
      processEyebrow: doc.processEyebrow || DEFAULTS.processEyebrow,
      processHeadline: doc.processHeadline || DEFAULTS.processHeadline,
      processFases:
        Array.isArray(doc.processFases) && doc.processFases.length > 0
          ? doc.processFases
          : DEFAULTS.processFases,
      ctaEyebrow: doc.ctaEyebrow || DEFAULTS.ctaEyebrow,
      ctaHeadline: doc.ctaHeadline || DEFAULTS.ctaHeadline,
      ctaSubheadlineBefore:
        doc.ctaSubheadlineBefore || DEFAULTS.ctaSubheadlineBefore,
      ctaSubheadlineEmphasis:
        doc.ctaSubheadlineEmphasis || DEFAULTS.ctaSubheadlineEmphasis,
      ctaPrompt: doc.ctaPrompt || DEFAULTS.ctaPrompt,
      ctaPrimaryLabel: doc.ctaPrimaryLabel || DEFAULTS.ctaPrimaryLabel,
      ctaSecondaryLabel: doc.ctaSecondaryLabel || DEFAULTS.ctaSecondaryLabel,
      agenciaStats:
        Array.isArray(doc.agenciaStats) && doc.agenciaStats.length > 0
          ? doc.agenciaStats
          : DEFAULTS.agenciaStats,
      valoresEyebrow: doc.valoresEyebrow || DEFAULTS.valoresEyebrow,
      valoresHeadline: doc.valoresHeadline || DEFAULTS.valoresHeadline,
      valoresIntro: doc.valoresIntro || DEFAULTS.valoresIntro,
      valores:
        Array.isArray(doc.valores) && doc.valores.length > 0
          ? doc.valores
          : DEFAULTS.valores,
      santiagoEyebrow: doc.santiagoEyebrow || DEFAULTS.santiagoEyebrow,
      santiagoRolePill: doc.santiagoRolePill || DEFAULTS.santiagoRolePill,
      santiagoBioParagraphs:
        Array.isArray(doc.santiagoBioParagraphs) &&
        doc.santiagoBioParagraphs.length > 0
          ? doc.santiagoBioParagraphs
          : DEFAULTS.santiagoBioParagraphs,
      santiagoCredentials:
        Array.isArray(doc.santiagoCredentials) &&
        doc.santiagoCredentials.length > 0
          ? doc.santiagoCredentials
          : DEFAULTS.santiagoCredentials,
    };
  } catch (err) {
    console.warn(
      "[editorial] failed to load global — falling back to defaults:",
      err,
    );
    return DEFAULTS;
  }
}

// ── Legal documents ───────────────────────────────────────────────────

export type LegalDocument = {
  title: string;
  lastUpdated: string;
  // Lexical body — typed as `unknown` because the editor's serialized
  // tree is opaque at our layer; the RichText component owns the schema.
  body?: unknown;
};

export async function getLegal(
  slug: "avisoPrivacidad" | "politicaCookies" | "contratoServicios",
): Promise<LegalDocument | null> {
  try {
    const payload = await getPayloadClient();
    const doc = (await payload.findGlobal({
      slug: slug as never,
      overrideAccess: true,
      depth: 0,
    })) as unknown as Partial<LegalDocument>;
    return {
      title: doc.title ?? "",
      lastUpdated: doc.lastUpdated ?? "",
      body: doc.body,
    };
  } catch (err) {
    console.warn(`[legal:${slug}] failed to load — returning null:`, err);
    return null;
  }
}

/**
 * Lexical's "empty" state still serializes as `{root: {children: [{...empty
 * paragraph...}]}}` so a null/undefined check is not enough — an editor
 * who creates the global without typing anything would otherwise wipe the
 * hardcoded fallback. We walk the tree and require at least one node with
 * real text content (or a structural node like list/upload/block).
 */
export function hasLexicalContent(body: unknown): boolean {
  const root = (body as { root?: { children?: unknown[] } })?.root;
  const children = root?.children;
  if (!Array.isArray(children) || children.length === 0) return false;
  const nodeHasText = (node: unknown): boolean => {
    if (!node || typeof node !== "object") return false;
    const n = node as {
      type?: string;
      text?: string;
      children?: unknown[];
    };
    // Text nodes with non-whitespace content
    if (n.type === "text" && typeof n.text === "string" && n.text.trim().length > 0) {
      return true;
    }
    // Structural nodes that count as content even without their own text
    if (
      n.type === "list" ||
      n.type === "horizontalrule" ||
      n.type === "block" ||
      n.type === "upload" ||
      n.type === "table"
    ) {
      return true;
    }
    // Recurse into children of paragraph/heading/listitem/link/etc.
    return Array.isArray(n.children) && n.children.some(nodeHasText);
  };
  return children.some(nodeHasText);
}
