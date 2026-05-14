/**
 * AMBROSIA CMS — User management
 *
 * Roles:
 *  - admin   : todo (CRUD usuarios, media, settings, contenido)
 *  - editor  : contenido + media (no usuarios, no settings críticos)
 *  - viewer  : solo lectura del backend (preview)
 *
 * Solo `admin` puede crear/modificar otros usuarios.
 */
import bcrypt from 'bcryptjs';
import { db } from './db';

export type Role = 'admin' | 'editor' | 'viewer';

export interface User {
  id: number;
  email: string;
  name: string | null;
  role: Role;
  active: number;
  created_at: number;
  last_login_at: number | null;
  created_by: number | null;
}

export interface UserWithCreator extends User {
  created_by_email: string | null;
}

// ─── Permisos ────────────────────────────────────────────────────────

export const PERMISSIONS = {
  admin: ['users.read', 'users.write', 'content.read', 'content.write', 'media.read', 'media.write', 'settings.read', 'settings.write', 'audit.read', 'pages.read', 'pages.write'],
  editor: ['content.read', 'content.write', 'media.read', 'media.write', 'settings.read', 'pages.read', 'pages.write'],
  viewer: ['content.read', 'media.read', 'settings.read', 'pages.read'],
} as const;

export function can(role: Role, permission: string): boolean {
  return (PERMISSIONS[role] as readonly string[]).includes(permission);
}

// ─── Queries ─────────────────────────────────────────────────────────

export function findUserByEmail(email: string): User | undefined {
  return db
    .prepare(`SELECT * FROM users WHERE email = ? COLLATE NOCASE AND active = 1`)
    .get(email.toLowerCase().trim()) as User | undefined;
}

export function findUserById(id: number): User | undefined {
  return db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as User | undefined;
}

export function listUsers(): UserWithCreator[] {
  return db
    .prepare(`
      SELECT u.*, c.email AS created_by_email
      FROM users u
      LEFT JOIN users c ON c.id = u.created_by
      ORDER BY u.created_at DESC
    `)
    .all() as UserWithCreator[];
}

export function countUsers(): number {
  const r = db.prepare(`SELECT COUNT(*) AS n FROM users`).get() as { n: number };
  return r.n;
}

// ─── Mutations ───────────────────────────────────────────────────────

export interface CreateUserInput {
  email: string;
  password: string;
  name?: string;
  role: Role;
  createdBy: number;
}

export function createUser(input: CreateUserInput): User {
  const email = input.email.toLowerCase().trim();
  const hash = bcrypt.hashSync(input.password, 12);

  const r = db
    .prepare(`
      INSERT INTO users (email, password_hash, name, role, active, created_by)
      VALUES (?, ?, ?, ?, 1, ?)
    `)
    .run(email, hash, input.name ?? null, input.role, input.createdBy);

  return findUserById(Number(r.lastInsertRowid))!;
}

export interface UpdateUserInput {
  id: number;
  name?: string | null;
  role?: Role;
  active?: boolean;
  password?: string;
}

export function updateUser(input: UpdateUserInput): User {
  const sets: string[] = [];
  const values: any[] = [];

  if (input.name !== undefined) {
    sets.push('name = ?');
    values.push(input.name);
  }
  if (input.role !== undefined) {
    sets.push('role = ?');
    values.push(input.role);
  }
  if (input.active !== undefined) {
    sets.push('active = ?');
    values.push(input.active ? 1 : 0);
  }
  if (input.password !== undefined) {
    sets.push('password_hash = ?');
    values.push(bcrypt.hashSync(input.password, 12));
  }

  if (sets.length === 0) {
    return findUserById(input.id)!;
  }

  values.push(input.id);
  db.prepare(`UPDATE users SET ${sets.join(', ')} WHERE id = ?`).run(...values);
  return findUserById(input.id)!;
}

export function deleteUser(id: number) {
  db.prepare(`DELETE FROM users WHERE id = ?`).run(id);
}

export function markLogin(id: number) {
  db.prepare(`UPDATE users SET last_login_at = unixepoch() WHERE id = ?`).run(id);
}

// ─── Auth check ──────────────────────────────────────────────────────

export async function verifyUserPassword(email: string, plain: string): Promise<User | null> {
  const user = findUserByEmail(email);
  if (!user || !user.active) return null;
  const valid = await bcrypt.compare(plain, (user as any).password_hash);
  if (!valid) return null;
  return user;
}

// ─── Audit log ───────────────────────────────────────────────────────

export function logAudit(params: {
  userId: number | null;
  action: string;
  entity?: string;
  entityId?: string | number;
  details?: any;
  ip?: string;
}) {
  db.prepare(`
    INSERT INTO audit_log (user_id, action, entity, entity_id, details, ip)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    params.userId,
    params.action,
    params.entity ?? null,
    params.entityId ? String(params.entityId) : null,
    params.details ? JSON.stringify(params.details) : null,
    params.ip ?? null,
  );
}

export function recentAuditLog(limit = 50) {
  return db
    .prepare(`
      SELECT a.*, u.email AS user_email
      FROM audit_log a
      LEFT JOIN users u ON u.id = a.user_id
      ORDER BY a.created_at DESC
      LIMIT ?
    `)
    .all(limit);
}
