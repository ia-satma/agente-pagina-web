/**
 * Middleware global — AMBROSIA CMS
 *
 * Protege /admin/* y /api/* (excepto endpoints públicos).
 * Carga el user actual y lo expone en Astro.locals para todas las rutas.
 */
import { defineMiddleware } from 'astro:middleware';
import { getCurrentUser } from '~/lib/auth';

const PUBLIC_AUTH_PATHS = ['/admin/login', '/api/auth/login'];

export const onRequest = defineMiddleware(async (ctx, next) => {
  const path = ctx.url.pathname;

  // Carga user si hay sesión (no bloqueante)
  const user = await getCurrentUser(ctx);
  (ctx.locals as any).user = user;

  // Rutas protegidas
  const isAdmin = path === '/admin' || path.startsWith('/admin/');
  const isApiAuth = path.startsWith('/api/auth');
  const isApiProtected = path.startsWith('/api/') && !isApiAuth && path !== '/api/auth/login';
  const isProtected = (isAdmin || isApiProtected) && !PUBLIC_AUTH_PATHS.some((p) => path === p);

  if (!isProtected) return next();

  if (!user) {
    // Sin sesión → para HTML, redirige; para API, 401 JSON.
    if (ctx.request.headers.get('accept')?.includes('text/html')) {
      const returnTo = encodeURIComponent(path + ctx.url.search);
      return ctx.redirect(`/admin/login?returnTo=${returnTo}`, 302);
    }
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  // RBAC granular: rutas admin-only que viewers/editors no deben tocar.
  // Si el rol es insuficiente → redirige al dashboard con flash de error.
  const ADMIN_ONLY = ['/admin/usuarios', '/admin/configuracion', '/admin/actividad'];
  const needsAdminRole = ADMIN_ONLY.some((p) => path === p || path.startsWith(p + '/'));
  if (needsAdminRole && (user as any).role !== 'admin') {
    if (ctx.request.headers.get('accept')?.includes('text/html')) {
      return ctx.redirect('/admin/?flash=forbidden', 302);
    }
    return new Response(JSON.stringify({ error: 'Forbidden', code: 'INSUFFICIENT_ROLE' }), {
      status: 403,
      headers: { 'content-type': 'application/json' },
    });
  }

  return next();
});

declare global {
  namespace App {
    interface Locals {
      user: import('~/lib/users').User | null;
    }
  }
}
