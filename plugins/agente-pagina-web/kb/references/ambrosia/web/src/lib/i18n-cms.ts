/**
 * AMBROSIA CMS — Editor nativo de i18n (sin Decap).
 *
 * Read/write seguro de las secciones top-level de src/i18n/{es,en}.json.
 * Deep merge garantiza que las keys no editadas se preservan.
 */
import fs from 'node:fs/promises';
import path from 'node:path';

export type Locale = 'es' | 'en';
const REPO_ROOT = process.cwd();

export const SECTION_LABELS: Record<string, { es: string; en: string; desc?: string }> = {
  hero:         { es: 'Hero (Home)',          en: 'Hero (Home)',           desc: 'Bloque principal de la portada' },
  mito:         { es: 'Mito',                  en: 'Myth',                  desc: 'El elixir de los dioses (capítulo I)' },
  origen:       { es: 'Origen',                en: 'Origin',                desc: 'Historia y receta familiar' },
  ritual:       { es: 'Ritual',                en: 'Ritual',                desc: 'Una gota basta para transformar' },
  manifesto:    { es: 'Manifesto',             en: 'Manifesto',             desc: 'THE DIVINE SAUCE OF GODS' },
  interlude:    { es: 'Interlude',             en: 'Interlude',             desc: 'Cita editorial' },
  citation:     { es: 'Citation',              en: 'Citation',              desc: 'Testimonio editorial' },
  worlds:       { es: 'Mundos (5 cards)',      en: 'Worlds (5 cards)',      desc: 'Grid de los 5 mundos en la home' },
  nav:          { es: 'Navegación',            en: 'Navigation',            desc: 'Labels del menú principal' },
  footer:       { es: 'Footer',                en: 'Footer',                desc: 'Tagline + newsletter + créditos' },
  recipeTeaser: { es: 'Teaser de recetas',     en: 'Recipe teaser' },
  community:    { es: 'Comunidad / CTA',       en: 'Community / CTA' },
  closing:      { es: 'Cierre',                en: 'Closing' },
  edicion:      { es: 'Edición 2024 (specs)',  en: 'Edition 2024 (specs)', desc: '200ml · 90 días · 6 chiles' },
  sabor:        { es: 'Notas de cata',          en: 'Tasting notes',         desc: '8 notas' },
  maridajes:    { es: 'Maridajes',              en: 'Pairings',              desc: '5 maridajes' },
  donde:        { es: 'Distribución / boutique', en: 'Distribution / boutique', desc: 'Restaurantes + Jabalina + Carnes Ramos' },
  pages:        { es: 'Páginas internas',       en: 'Internal pages',        desc: 'Eyebrows + titles de cada mundo' },
};

function pathFor(locale: Locale): string {
  return path.resolve(REPO_ROOT, `src/i18n/${locale}.json`);
}

async function readAll(locale: Locale): Promise<Record<string, any>> {
  const raw = await fs.readFile(pathFor(locale), 'utf8');
  return JSON.parse(raw);
}

async function writeAll(locale: Locale, obj: Record<string, any>): Promise<void> {
  await fs.writeFile(pathFor(locale), JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

/** Lee una sección completa por su key top-level. */
export async function readSection(locale: Locale, section: string): Promise<any> {
  const all = await readAll(locale);
  return all[section];
}

/** Lista todas las secciones top-level disponibles con preview. */
export async function listSections(locale: Locale): Promise<Array<{
  key: string;
  label: string;
  desc?: string;
  preview: string;
}>> {
  const all = await readAll(locale);
  return Object.keys(all).map((key) => {
    const meta = SECTION_LABELS[key] ?? { es: key, en: key };
    const val = all[key];
    let preview = '';
    if (val && typeof val === 'object') {
      // Tomamos title o body o eyebrow como preview
      const candidates = [val.title, val.heading, val.eyebrow, val.body, val.tagline, val.quote];
      const first = candidates.find((x) => typeof x === 'string' && x.length > 0);
      preview = first ? stripTags(first).substring(0, 80) : `${Object.keys(val).length} campo${Object.keys(val).length !== 1 ? 's' : ''}`;
    } else if (typeof val === 'string') {
      preview = val.substring(0, 80);
    }
    return {
      key,
      label: meta[locale] ?? meta.es ?? key,
      desc: meta.desc,
      preview,
    };
  });
}

function stripTags(s: string): string {
  return s.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
}

/** Deep merge: preserva keys que no estén en el patch. Arrays se reemplazan completos. */
function deepMerge(base: any, patch: any): any {
  if (Array.isArray(patch)) return patch;
  if (patch === null || patch === undefined) return base;
  if (typeof patch !== 'object') return patch;
  if (typeof base !== 'object' || base === null || Array.isArray(base)) return patch;

  const out: any = { ...base };
  for (const [k, v] of Object.entries(patch)) {
    out[k] = deepMerge(base[k], v);
  }
  return out;
}

/** Escribe una sección completa con deep merge contra el archivo actual. */
export async function writeSection(locale: Locale, section: string, value: any): Promise<void> {
  const all = await readAll(locale);
  all[section] = deepMerge(all[section], value);
  await writeAll(locale, all);
}
