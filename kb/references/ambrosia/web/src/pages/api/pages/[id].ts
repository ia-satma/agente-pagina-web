import type { APIRoute } from 'astro';
import { getCurrentUser } from '~/lib/auth';
import { can, logAudit, type Role } from '~/lib/users';
import { deletePage, findPageById, isValidSlug, updatePage, type Block } from '~/lib/pages';

export const POST: APIRoute = async (ctx) => {
  const me = await getCurrentUser(ctx);
  if (!me || !can(me.role as Role, 'pages.write')) {
    return new Response('Forbidden', { status: 403 });
  }

  const id = parseInt(ctx.params.id ?? '', 10);
  if (!id) return ctx.redirect('/admin/paginas?flash=error', 302);
  const existing = findPageById(id);
  if (!existing) return ctx.redirect('/admin/paginas?flash=error', 302);

  const method = ctx.url.searchParams.get('_method')?.toUpperCase();

  if (method === 'DELETE') {
    deletePage(id);
    logAudit({
      userId: me.id,
      action: 'delete_page',
      entity: 'pages',
      entityId: id,
      details: { slug: existing.slug, title: existing.title_es },
      ip: ctx.clientAddress,
    });
    return ctx.redirect('/admin/paginas?flash=deleted', 302);
  }

  // PATCH (default) → actualizar
  const ct = ctx.request.headers.get('content-type') ?? '';
  let patch: Parameters<typeof updatePage>[0] = { id, updatedBy: me.id };

  if (ct.includes('application/json')) {
    // Block builder envía JSON (blocks)
    const body = await ctx.request.json();
    if (Array.isArray(body.blocks)) patch.blocks = body.blocks as Block[];
    if (typeof body.title_es === 'string') patch.title_es = body.title_es;
    if (typeof body.title_en === 'string' || body.title_en === null) patch.title_en = body.title_en;
    if (typeof body.description_es === 'string' || body.description_es === null) patch.description_es = body.description_es;
    if (typeof body.description_en === 'string' || body.description_en === null) patch.description_en = body.description_en;
    if (typeof body.cover_image === 'string' || body.cover_image === null) patch.cover_image = body.cover_image;
    if (body.status === 'draft' || body.status === 'published') patch.status = body.status;
    if (typeof body.slug === 'string' && body.slug !== existing.slug) {
      if (!isValidSlug(body.slug)) return new Response(JSON.stringify({ error: 'invalid slug' }), { status: 400 });
      patch.slug = body.slug;
    }
  } else {
    // Form normal (metadata edit)
    const form = await ctx.request.formData();
    if (form.has('title_es'))       patch.title_es = String(form.get('title_es'));
    if (form.has('title_en'))       patch.title_en = String(form.get('title_en')).trim() || null;
    if (form.has('description_es')) patch.description_es = String(form.get('description_es')).trim() || null;
    if (form.has('description_en')) patch.description_en = String(form.get('description_en')).trim() || null;
    if (form.has('cover_image'))    patch.cover_image = String(form.get('cover_image')).trim() || null;
    if (form.has('status')) {
      const s = String(form.get('status'));
      if (s === 'draft' || s === 'published') patch.status = s;
    }
    if (form.has('slug')) {
      const newSlug = String(form.get('slug')).trim();
      if (newSlug && newSlug !== existing.slug) {
        if (!isValidSlug(newSlug)) return ctx.redirect(`/admin/paginas/${id}/editar?flash=error&msg=Slug+invalido`, 302);
        patch.slug = newSlug;
      }
    }
  }

  const updated = updatePage(patch);
  logAudit({
    userId: me.id,
    action: 'update_page',
    entity: 'pages',
    entityId: id,
    details: { slug: updated.slug, status: updated.status },
    ip: ctx.clientAddress,
  });

  if (ct.includes('application/json')) {
    return new Response(JSON.stringify({ ok: true, page: updated }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }
  return ctx.redirect(`/admin/paginas/${id}/editar?flash=updated`, 302);
};
