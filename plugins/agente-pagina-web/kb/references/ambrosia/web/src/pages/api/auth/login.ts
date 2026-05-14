import type { APIRoute } from 'astro';
import { authenticate, createSession } from '~/lib/auth';
import { logAudit } from '~/lib/users';

export const POST: APIRoute = async (ctx) => {
  const form = await ctx.request.formData();
  const email = String(form.get('email') ?? '').trim();
  const password = String(form.get('password') ?? '');
  const returnTo = ctx.url.searchParams.get('returnTo') || '/admin/';

  const user = await authenticate(email, password);

  if (!user) {
    // Delay constante anti-timing leak (~220ms baseline)
    await new Promise((r) => setTimeout(r, 220));
    logAudit({
      userId: null,
      action: 'login_failed',
      entity: 'auth',
      // Anonimizamos email manteniendo trazabilidad (primeros 2 chars + ***@dominio)
      details: { email: email.replace(/(.{2}).*@/, '$1***@') || '[empty]' },
      ip: ctx.clientAddress,
    });
    return ctx.redirect(
      `/admin/login?error=invalid&returnTo=${encodeURIComponent(returnTo)}`,
      302,
    );
  }

  await createSession(ctx, user);
  logAudit({
    userId: user.id,
    action: 'login',
    entity: 'auth',
    ip: ctx.clientAddress,
  });

  // Validate returnTo es path interno
  const safeReturn =
    returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/admin/';
  return ctx.redirect(safeReturn, 302);
};
