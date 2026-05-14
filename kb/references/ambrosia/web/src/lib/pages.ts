/**
 * AMBROSIA CMS — Custom Pages (landings, eventos, press kits, legal).
 *
 * Cada página tiene un slug único, título en ES/EN, descripción y un array
 * de "bloques" (JSON) que el renderer público convierte a HTML editorial.
 *
 * Tipos de bloque soportados:
 *  - hero        : title + subtitle + cover image opcional
 *  - section     : heading + body (markdown)
 *  - image       : full-width image + caption
 *  - quote       : pull-quote editorial
 *  - cta         : button con label + href
 *  - divider     : separador floral / línea
 */
import { db } from './db';

export type BlockType = 'hero' | 'section' | 'image' | 'quote' | 'cta' | 'divider';

export interface Block {
  id: string;       // uuid local del bloque
  type: BlockType;
  data: Record<string, any>;
}

export interface Page {
  id: number;
  slug: string;
  title_es: string;
  title_en: string | null;
  description_es: string | null;
  description_en: string | null;
  cover_image: string | null;
  blocks: Block[];
  status: 'draft' | 'published';
  locale: string;
  created_by: number | null;
  updated_by: number | null;
  created_at: number;
  updated_at: number;
  published_at: number | null;
}

interface PageRow extends Omit<Page, 'blocks'> {
  blocks: string;
}

function rowToPage(row: PageRow): Page {
  let blocks: Block[] = [];
  try {
    blocks = JSON.parse(row.blocks) || [];
  } catch {
    blocks = [];
  }
  return { ...row, blocks };
}

// ─── Validation ───────────────────────────────────────────────────────

const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,60}[a-z0-9])?$/;

export function isValidSlug(slug: string): boolean {
  return SLUG_RE.test(slug);
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '') // strip accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 60);
}

// ─── Queries ──────────────────────────────────────────────────────────

export function listPages(opts?: { status?: 'draft' | 'published' }): Page[] {
  const rows = opts?.status
    ? db.prepare(`SELECT * FROM pages WHERE status = ? ORDER BY updated_at DESC`).all(opts.status)
    : db.prepare(`SELECT * FROM pages ORDER BY updated_at DESC`).all();
  return (rows as PageRow[]).map(rowToPage);
}

export function findPageById(id: number): Page | undefined {
  const row = db.prepare(`SELECT * FROM pages WHERE id = ?`).get(id) as PageRow | undefined;
  return row ? rowToPage(row) : undefined;
}

export function findPageBySlug(slug: string): Page | undefined {
  const row = db.prepare(`SELECT * FROM pages WHERE slug = ?`).get(slug) as PageRow | undefined;
  return row ? rowToPage(row) : undefined;
}

// ─── Mutations ────────────────────────────────────────────────────────

export interface CreatePageInput {
  slug: string;
  title_es: string;
  title_en?: string;
  description_es?: string;
  description_en?: string;
  cover_image?: string;
  blocks?: Block[];
  status?: 'draft' | 'published';
  createdBy: number;
}

export function createPage(input: CreatePageInput): Page {
  const r = db.prepare(`
    INSERT INTO pages (slug, title_es, title_en, description_es, description_en, cover_image, blocks, status, created_by, updated_by, published_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    input.slug,
    input.title_es,
    input.title_en ?? null,
    input.description_es ?? null,
    input.description_en ?? null,
    input.cover_image ?? null,
    JSON.stringify(input.blocks ?? []),
    input.status ?? 'draft',
    input.createdBy,
    input.createdBy,
    input.status === 'published' ? Math.floor(Date.now() / 1000) : null,
  );
  return findPageById(Number(r.lastInsertRowid))!;
}

export interface UpdatePageInput {
  id: number;
  slug?: string;
  title_es?: string;
  title_en?: string | null;
  description_es?: string | null;
  description_en?: string | null;
  cover_image?: string | null;
  blocks?: Block[];
  status?: 'draft' | 'published';
  updatedBy: number;
}

export function updatePage(input: UpdatePageInput): Page {
  const sets: string[] = ['updated_at = unixepoch()'];
  const values: any[] = [];

  if (input.slug !== undefined)        { sets.push('slug = ?');        values.push(input.slug); }
  if (input.title_es !== undefined)    { sets.push('title_es = ?');    values.push(input.title_es); }
  if (input.title_en !== undefined)    { sets.push('title_en = ?');    values.push(input.title_en); }
  if (input.description_es !== undefined) { sets.push('description_es = ?'); values.push(input.description_es); }
  if (input.description_en !== undefined) { sets.push('description_en = ?'); values.push(input.description_en); }
  if (input.cover_image !== undefined) { sets.push('cover_image = ?'); values.push(input.cover_image); }
  if (input.blocks !== undefined)      { sets.push('blocks = ?');      values.push(JSON.stringify(input.blocks)); }
  if (input.status !== undefined) {
    sets.push('status = ?'); values.push(input.status);
    if (input.status === 'published') {
      sets.push('published_at = unixepoch()');
    }
  }
  sets.push('updated_by = ?'); values.push(input.updatedBy);

  values.push(input.id);
  db.prepare(`UPDATE pages SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return findPageById(input.id)!;
}

export function deletePage(id: number) {
  db.prepare(`DELETE FROM pages WHERE id = ?`).run(id);
}
