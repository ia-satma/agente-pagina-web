import es from './es.json';
import en from './en.json';

export const translations = { es, en } as const;
export type Locale = keyof typeof translations;
export type Dict = typeof es;

/**
 * Devuelve el diccionario activo para el locale dado.
 * Default: 'es'
 */
export function t(locale: string | undefined = 'es'): Dict {
  const key = (locale === 'en' ? 'en' : 'es') as Locale;
  return translations[key];
}

export function otherLocale(locale: string): Locale {
  return locale === 'en' ? 'es' : 'en';
}

/**
 * Mapeo de slug interno (key) → ruta efectiva por locale.
 * Permite que el toggle ES/EN apunte al equivalente correcto.
 *
 * Reestructura "Clase Azul": 5 mundos canónicos.
 * Las rutas legacy se mantienen mientras dure la migración (FASE 5 las elimina).
 */
const ROUTES: Record<string, { es: string; en: string }> = {
  '':                    { es: '',                    en: '' },

  // ─── Mundos nuevos (canónicos) ───
  'origen':              { es: 'origen',              en: 'origin' },
  'la-salsa':            { es: 'la-salsa',            en: 'the-sauce' },
  'recetario':           { es: 'recetario',           en: 'recipe-book' },
  'mesas':               { es: 'mesas',               en: 'tables' },
  'mesas/restaurantes':  { es: 'mesas/restaurantes',  en: 'tables/restaurants' },
  'concierge':           { es: 'concierge',           en: 'concierge' },

  // ─── Legacy (eliminar en FASE 5) ───
  'historia':      { es: 'historia',      en: 'story' },
  'producto':      { es: 'producto',      en: 'product' },
  'coleccion':     { es: 'coleccion',     en: 'collection' },
  'horeca':        { es: 'horeca',        en: 'restaurants' },
  'diario':        { es: 'diario',        en: 'journal' },
  'contacto':      { es: 'contacto',      en: 'contact' },
  'donde-comprar': { es: 'donde-comprar', en: 'where-to-buy' },
};

export function pathFor(locale: Locale, slug: string = ''): string {
  const key = slug.replace(/^\/+/, '').replace(/\/$/, '');
  const route = ROUTES[key];
  const finalPath = route ? route[locale] : key;
  if (locale === 'es') return '/' + finalPath;
  return '/en/' + finalPath;
}

/**
 * Dado el path actual y el locale destino, devuelve la URL del equivalente.
 * Útil para el lang switcher.
 */
export function localizedHref(currentLocale: Locale, currentPath: string, targetLocale: Locale): string {
  // Quita prefijo /en/ o / inicial y trailing slash
  let stripped = currentPath.replace(/^\/(en\/?)?/, '').replace(/\/$/, '');
  // Encuentra la key cuyo valor en currentLocale coincide con stripped
  const entry = Object.entries(ROUTES).find(([, v]) => v[currentLocale] === stripped);
  const key = entry ? entry[0] : stripped;
  return pathFor(targetLocale, key);
}
