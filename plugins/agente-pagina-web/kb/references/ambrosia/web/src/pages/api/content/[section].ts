import type { APIRoute } from 'astro';
import { getCurrentUser } from '~/lib/auth';
import { can, logAudit, type Role } from '~/lib/users';
import { writeSection, type Locale } from '~/lib/i18n-cms';

export const POST: APIRoute = async (ctx) => {
  const me = await getCurrentUser(ctx);
  if (!me || !can(me.role as Role, 'content.write')) {
    return new Response(JSON.stringify({ error: 'Forbidden' }), { status: 403, headers: { 'content-type': 'application/json' } });
  }

  const localeParam = ctx.url.searchParams.get('lang') || 'es';
  const section = String(ctx.params.section ?? '');
  if (localeParam !== 'es' && localeParam !== 'en') {
    return new Response(JSON.stringify({ error: 'Invalid locale' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }
  if (!section || !/^[a-zA-Z][a-zA-Z0-9_-]*$/.test(section)) {
    return new Response(JSON.stringify({ error: 'Invalid section' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  let body: any;
  try {
    body = await ctx.request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400, headers: { 'content-type': 'application/json' } });
  }

  try {
    await writeSection(localeParam as Locale, section, body);
  } catch (err: any) {
    return new Response(JSON.stringify({ error: 'Write failed', detail: err?.message ?? String(err) }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  logAudit({
    userId: me.id,
    action: 'update_content',
    entity: 'i18n',
    entityId: `${localeParam}.${section}`,
    ip: ctx.clientAddress,
  });

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
