import type { APIRoute } from 'astro';
import { getCurrentUser } from '~/lib/auth';
import {
  can,
  deleteUser,
  findUserById,
  logAudit,
  updateUser,
  type Role,
} from '~/lib/users';

/**
 * PATCH/DELETE via POST + _method query (HTML forms no soportan PATCH/DELETE).
 */
export const POST: APIRoute = async (ctx) => {
  try {
    const me = await getCurrentUser(ctx);
    if (!me || !can(me.role as Role, 'users.write')) {
      return new Response('Forbidden', { status: 403 });
    }

    const targetId = parseInt(ctx.params.id ?? '', 10);
    if (!targetId || targetId === me.id) {
      return ctx.redirect('/admin/usuarios?flash=error', 302);
    }
    const target = findUserById(targetId);
    if (!target) return ctx.redirect('/admin/usuarios?flash=error', 302);

    const method = ctx.url.searchParams.get('_method')?.toUpperCase();

    if (method === 'DELETE') {
      deleteUser(targetId);
      logAudit({
        userId: me.id,
        action: 'delete_user',
        entity: 'users',
        entityId: targetId,
        details: { email: target.email.replace(/(.{2}).*@/, '$1***@') },
        ip: ctx.clientAddress,
      });
      return ctx.redirect('/admin/usuarios?flash=deleted', 302);
    }

    if (method === 'PATCH') {
      const form = await ctx.request.formData();
      const patch: Parameters<typeof updateUser>[0] = { id: targetId };

      if (form.has('role')) {
        const r = String(form.get('role')) as Role;
        if (['admin', 'editor', 'viewer'].includes(r)) patch.role = r;
      }
      if (form.has('active')) {
        patch.active = form.get('active') === '1';
      }
      if (form.has('name')) {
        patch.name = String(form.get('name')).trim() || null;
      }
      if (form.has('password')) {
        const p = String(form.get('password'));
        if (p.length >= 8) patch.password = p;
      }

      updateUser(patch);
      // Audit log: nunca exponer el password en details
      const auditDetails = { ...patch };
      if ('password' in auditDetails) auditDetails.password = '[redacted]' as any;
      logAudit({
        userId: me.id,
        action: 'update_user',
        entity: 'users',
        entityId: targetId,
        details: auditDetails,
        ip: ctx.clientAddress,
      });
      return ctx.redirect('/admin/usuarios?flash=updated', 302);
    }

    return new Response('Method not allowed', { status: 405 });
  } catch (err) {
    console.error('[api/users/[id]] POST error:', err);
    return new Response(JSON.stringify({ error: 'Server error', code: 'INTERNAL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
