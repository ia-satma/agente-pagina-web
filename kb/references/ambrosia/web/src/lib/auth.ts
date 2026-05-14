/**
 * AMBROSIA CMS — Auth (sessions + role-based access)
 *
 * Cookie firmada (iron-session). Cada sesión guarda el user id + role.
 * Los usuarios viven en SQLite (ver lib/users.ts), no en env vars.
 */
import { getIronSession, type SessionOptions } from 'iron-session';
import type { APIContext, AstroGlobal } from 'astro';
import { findUserById, markLogin, verifyUserPassword, type Role, type User, can } from './users';

const env = (key: string): string | undefined =>
  (import.meta.env as any)[key] ?? process.env[key];

export interface AmbrosiaSession {
  userId?: number;
  email?: string;
  role?: Role;
  loggedAt?: number;
}

export const sessionOptions: SessionOptions = {
  password: env('SESSION_SECRET') ?? 'dev-only-secret-min-32-chars-long-padding-padding-extra',
  cookieName: 'ambrosia_admin',
  cookieOptions: {
    secure: env('NODE_ENV') === 'production',
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8 horas
  },
};

export async function getSession(ctx: APIContext | AstroGlobal) {
  return await getIronSession<AmbrosiaSession>((ctx as any).cookies, sessionOptions);
}

/** Verifica credenciales contra la BD. Devuelve el user si OK. */
export async function authenticate(email: string, password: string): Promise<User | null> {
  return verifyUserPassword(email, password);
}

/** Carga el user de la BD a partir de la sesión. Null si no hay o el user fue desactivado. */
export async function getCurrentUser(ctx: APIContext | AstroGlobal): Promise<User | null> {
  const session = await getSession(ctx);
  if (!session.userId) return null;
  const user = findUserById(session.userId);
  if (!user || !user.active) return null;
  return user;
}

/** Crea la sesión tras un login exitoso. */
export async function createSession(ctx: APIContext | AstroGlobal, user: User) {
  const session = await getSession(ctx);
  session.userId = user.id;
  session.email = user.email;
  session.role = user.role as Role;
  session.loggedAt = Date.now();
  await session.save();
  markLogin(user.id);
}

/** Destruye la sesión actual. */
export async function destroySession(ctx: APIContext | AstroGlobal) {
  const session = await getSession(ctx);
  session.destroy();
}

/** Helper para guards de permisos en pages/APIs. Throw si no autorizado. */
export async function requirePermission(
  ctx: APIContext | AstroGlobal,
  permission: string,
): Promise<User> {
  const user = await getCurrentUser(ctx);
  if (!user) {
    throw new Response(null, { status: 401, headers: { Location: '/admin/login' } });
  }
  if (!can(user.role as Role, permission)) {
    throw new Response('Forbidden', { status: 403 });
  }
  return user;
}
