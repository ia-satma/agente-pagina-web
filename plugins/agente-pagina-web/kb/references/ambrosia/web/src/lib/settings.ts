/**
 * AMBROSIA CMS — Settings (key-value JSON store)
 *
 * Cualquier toggle, flag o configuración global vive aquí.
 * Lectura optimizada con cache en memoria (LRU implícito por restart).
 */
import { db } from './db';

let cache: Map<string, any> | null = null;

function loadCache() {
  cache = new Map();
  const rows = db.prepare(`SELECT key, value FROM settings`).all() as { key: string; value: string }[];
  for (const r of rows) {
    try {
      cache.set(r.key, JSON.parse(r.value));
    } catch {
      cache.set(r.key, r.value);
    }
  }
}

export function getSetting<T = any>(key: string, fallback?: T): T {
  if (!cache) loadCache();
  if (cache!.has(key)) return cache!.get(key) as T;
  return fallback as T;
}

export function setSetting(key: string, value: any, userId?: number) {
  const json = JSON.stringify(value);
  db.prepare(`
    INSERT INTO settings (key, value, updated_by) VALUES (?, ?, ?)
    ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = unixepoch(), updated_by = excluded.updated_by
  `).run(key, json, userId ?? null);
  if (cache) cache.set(key, value);
}

export function listSettings(): Array<{ key: string; value: any }> {
  if (!cache) loadCache();
  return Array.from(cache!.entries()).map(([key, value]) => ({ key, value }));
}

/** Helper para componentes Astro: `isVisible('home.hero')`. */
export function isVisible(section: string): boolean {
  return getSetting<boolean>(`visibility.${section}`, true);
}

/**
 * Redes sociales editables desde admin/configuracion.
 * Retorna solo las que tienen URL configurada (no vacias).
 * Las URLs se editan via setSetting('social.instagram', 'https://...').
 */
export type SocialPlatform = 'instagram' | 'facebook' | 'twitter' | 'tiktok' | 'youtube' | 'email';
export interface SocialLink {
  platform: SocialPlatform;
  url: string;
  label: string;
}
export function getSocialLinks(): SocialLink[] {
  const platforms: { key: SocialPlatform; label: string; default?: string }[] = [
    { key: 'instagram', label: 'Instagram' },
    { key: 'facebook',  label: 'Facebook' },
    { key: 'twitter',   label: 'X' },
    { key: 'tiktok',    label: 'TikTok' },
    { key: 'youtube',   label: 'YouTube' },
    { key: 'email',     label: 'Email', default: 'mailto:concierge@ambrosiasauceofgods.com' },
  ];
  const links: SocialLink[] = [];
  for (const p of platforms) {
    const url = getSetting<string>(`social.${p.key}`, p.default ?? '');
    if (url && url.trim()) {
      links.push({ platform: p.key, url: url.trim(), label: p.label });
    }
  }
  return links;
}

/**
 * ElevenLabs Conversational AI — agente de voz integrado al ChatBubble.
 * Configurable desde /admin/configuracion. Si no hay agent_id, el panel
 * del chat no muestra el boton "Hablar con el agente".
 */
export function getElevenLabsAgentId(): string {
  return getSetting<string>('elevenlabs.agentId', '') || '';
}

/**
 * Imagenes editables de la galeria del home (BottleGallery).
 * Retorna array con fallback a las 4 hardcodeadas si no hay configuradas.
 */
export interface GalleryImage {
  src: string;
  alt_es: string;
  alt_en: string;
  caption_es: string;
  caption_en: string;
  href: string;
  linkLabel_es: string;
  linkLabel_en: string;
}
export function getGalleryImages(): GalleryImage[] {
  const stored = getSetting<GalleryImage[]>('gallery.home', []);
  if (Array.isArray(stored) && stored.length > 0) return stored;
  return [];  // El componente usa su fallback hardcodeado si esto esta vacio
}
