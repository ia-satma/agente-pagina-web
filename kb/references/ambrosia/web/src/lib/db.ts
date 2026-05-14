/**
 * AMBROSIA CMS — Database layer (SQLite via better-sqlite3)
 *
 * Filosofía: SQLite file-based para máxima portabilidad y zero-config.
 * - En local: file en .data/ambrosia.db (gitignored)
 * - En Replit: archivo persiste en el container (.data/ persists)
 *
 * Migraciones idempotentes en initSchema() — corre en cada startup.
 */
import Database from 'better-sqlite3';
import path from 'node:path';
import fs from 'node:fs';
import bcrypt from 'bcryptjs';

// ─────────────────────────────────────────────────────────────────────
// Connection
// ─────────────────────────────────────────────────────────────────────

const env = (key: string): string | undefined =>
  (import.meta.env as any)[key] ?? process.env[key];

// .data/ no es servido por public/ ni por dist/, queda fuera del bundle
const DB_DIR = path.resolve(process.cwd(), '.data');
const DB_PATH = env('AMBROSIA_DB_PATH') ?? path.join(DB_DIR, 'ambrosia.db');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');     // mejor concurrency
db.pragma('foreign_keys = ON');      // integridad referencial
db.pragma('synchronous = NORMAL');   // balance perf/safety

// ─────────────────────────────────────────────────────────────────────
// Schema migrations
// ─────────────────────────────────────────────────────────────────────

const MIGRATIONS = [
  // v1 — initial
  `CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    email         TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    name          TEXT,
    role          TEXT NOT NULL DEFAULT 'editor', -- admin | editor | viewer
    active        INTEGER NOT NULL DEFAULT 1,
    created_at    INTEGER NOT NULL DEFAULT (unixepoch()),
    last_login_at INTEGER,
    created_by    INTEGER REFERENCES users(id) ON DELETE SET NULL
  );`,

  `CREATE TABLE IF NOT EXISTS media (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    filename     TEXT NOT NULL,
    path         TEXT NOT NULL UNIQUE,
    mime         TEXT NOT NULL,
    type         TEXT NOT NULL, -- image | video | document
    size_bytes   INTEGER NOT NULL,
    width        INTEGER,
    height       INTEGER,
    alt_text     TEXT,
    uploaded_by  INTEGER REFERENCES users(id) ON DELETE SET NULL,
    uploaded_at  INTEGER NOT NULL DEFAULT (unixepoch())
  );`,

  `CREATE TABLE IF NOT EXISTS settings (
    key         TEXT PRIMARY KEY,
    value       TEXT NOT NULL,             -- JSON serializado
    updated_at  INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_by  INTEGER REFERENCES users(id) ON DELETE SET NULL
  );`,

  `CREATE TABLE IF NOT EXISTS audit_log (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id    INTEGER REFERENCES users(id) ON DELETE SET NULL,
    action     TEXT NOT NULL,              -- login | logout | create_user | update_setting | upload_media | etc.
    entity     TEXT,                       -- users | media | settings | etc.
    entity_id  TEXT,
    details    TEXT,                       -- JSON
    ip         TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );`,

  `CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id, created_at DESC);`,
  `CREATE INDEX IF NOT EXISTS idx_media_type ON media(type, uploaded_at DESC);`,

  // v2 — custom pages (landings, press kits, eventos, legal, etc.)
  `CREATE TABLE IF NOT EXISTS pages (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    slug         TEXT NOT NULL UNIQUE,
    title_es     TEXT NOT NULL,
    title_en     TEXT,
    description_es TEXT,
    description_en TEXT,
    cover_image  TEXT,
    blocks       TEXT NOT NULL DEFAULT '[]',  -- JSON array de bloques
    status       TEXT NOT NULL DEFAULT 'draft', -- draft | published
    locale       TEXT NOT NULL DEFAULT 'es',   -- locale principal
    created_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    updated_by   INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at   INTEGER NOT NULL DEFAULT (unixepoch()),
    updated_at   INTEGER NOT NULL DEFAULT (unixepoch()),
    published_at INTEGER
  );`,

  `CREATE INDEX IF NOT EXISTS idx_pages_slug ON pages(slug);`,
  `CREATE INDEX IF NOT EXISTS idx_pages_status ON pages(status, updated_at DESC);`,
];

function initSchema() {
  for (const sql of MIGRATIONS) {
    db.exec(sql);
  }
}

// ─────────────────────────────────────────────────────────────────────
// Seed admin user (only if no users exist)
// ─────────────────────────────────────────────────────────────────────

function seedAdminIfEmpty() {
  const count = db.prepare('SELECT COUNT(*) AS n FROM users').get() as { n: number };
  if (count.n > 0) return;

  // Lee credenciales iniciales del env
  const email = env('AUTH_USER');
  const b64 = env('AUTH_PASS_HASH_B64');
  const raw = env('AUTH_PASS_HASH');
  const hash = b64 ? Buffer.from(b64, 'base64').toString('utf8') : raw;

  if (!email || !hash) {
    console.warn('[db] AUTH_USER y AUTH_PASS_HASH(_B64) no están seteados — no se puede crear admin inicial.');
    return;
  }

  db.prepare(`INSERT INTO users (email, password_hash, name, role, active)
              VALUES (?, ?, ?, 'admin', 1)`)
    .run(email.toLowerCase().trim(), hash, 'Administrador');

  console.log(`[db] ✓ Usuario admin inicial creado: ${email}`);
}

// ─────────────────────────────────────────────────────────────────────
// Default settings (toggles de visibilidad por defecto)
// ─────────────────────────────────────────────────────────────────────

const DEFAULT_VISIBILITY: Record<string, boolean> = {
  'visibility.home.hero':           true,
  'visibility.home.brandStatement': true,
  'visibility.home.worldsGrid':     true,
  'visibility.home.manifesto':      true,
  'visibility.home.bottleGallery':  true,
  'visibility.origen.hero':         true,
  'visibility.origen.diptychMito':  true,
  'visibility.origen.interlude':    true,
  'visibility.origen.diptychOrigen':true,
  'visibility.origen.ritual':       true,
  'visibility.origen.timeline':     true,
  'visibility.laSalsa.bottleShowcase': true,
  'visibility.laSalsa.tastingNotes':   true,
  'visibility.laSalsa.pairings':       true,
  'visibility.laSalsa.edicion':        true,
  'visibility.laSalsa.buyPoints':      true,
  'visibility.mesas.tablesSplit':      true,
  'visibility.mesas.restaurants':      true,
  'visibility.concierge.intent':       true,
  'visibility.concierge.form':         true,
  'visibility.footer.newsletter':      true,
};

function seedDefaultSettings() {
  const insert = db.prepare(`INSERT OR IGNORE INTO settings (key, value) VALUES (?, ?)`);
  for (const [key, value] of Object.entries(DEFAULT_VISIBILITY)) {
    insert.run(key, JSON.stringify(value));
  }
}

// ─────────────────────────────────────────────────────────────────────
// Init (corre una vez al primer import)
// ─────────────────────────────────────────────────────────────────────

initSchema();
seedAdminIfEmpty();
seedDefaultSettings();

export { db };
export default db;
