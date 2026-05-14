import type { APIRoute } from 'astro';
import { getCurrentUser } from '~/lib/auth';
import { can, createUser, findUserByEmail, logAudit, type Role } from '~/lib/users';

export const POST: APIRoute = async (ctx) => {
  try {
    const me = await getCurrentUser(ctx);
    if (!me || !can(me.role as Role, 'users.write')) {
      return new Response('Forbidden', { status: 403 });
    }

    const form = await ctx.request.formData();
    const email = String(form.get('email') ?? '').trim();
    const password = String(form.get('password') ?? '');
    const name = String(form.get('name') ?? '').trim() || undefined;
    const role = String(form.get('role') ?? 'editor') as Role;

    if (!email || !password || password.length < 8) {
      return ctx.redirect('/admin/usuarios?flash=error', 302);
    }
    if (!['admin', 'editor', 'viewer'].includes(role)) {
      return ctx.redirect('/admin/usuarios?flash=error', 302);
    }
    if (findUserByEmail(email)) {
      return ctx.redirect('/admin/usuarios?flash=error', 302);
    }

    const u = createUser({ email, password, name, role, createdBy: me.id });
    logAudit({
      userId: me.id,
      action: 'create_user',
      entity: 'users',
      entityId: u.id,
      details: { email: u.email.replace(/(.{2}).*@/, '$1***@'), role: u.role },
      ip: ctx.clientAddress,
    });

    return ctx.redirect('/admin/usuarios?flash=created', 302);
  } catch (err) {
    console.error('[api/users] POST error:', err);
    return new Response(JSON.stringify({ error: 'Server error', code: 'INTERNAL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
