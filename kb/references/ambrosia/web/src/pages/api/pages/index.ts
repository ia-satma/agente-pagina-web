import type { APIRoute } from 'astro';
import { getCurrentUser } from '~/lib/auth';
import { can, logAudit, type Role } from '~/lib/users';
import { createPage, findPageBySlug, isValidSlug, slugifyTitle, type Block } from '~/lib/pages';

export const POST: APIRoute = async (ctx) => {
  try {
    const me = await getCurrentUser(ctx);
    if (!me || !can(me.role as Role, 'pages.write')) {
      return new Response('Forbidden', { status: 403 });
    }

    const form = await ctx.request.formData();
    const titleEs = String(form.get('title_es') ?? '').trim();
    let slug = String(form.get('slug') ?? '').trim();
    const titleEn = String(form.get('title_en') ?? '').trim() || undefined;
    const descEs = String(form.get('description_es') ?? '').trim() || undefined;
    const descEn = String(form.get('description_en') ?? '').trim() || undefined;
    const coverImage = String(form.get('cover_image') ?? '').trim() || undefined;
    const status = (String(form.get('status') ?? 'draft') as 'draft' | 'published');

    if (!titleEs) {
      return ctx.redirect('/admin/paginas?flash=error&msg=Falta+titulo', 302);
    }

    if (!slug) slug = slugifyTitle(titleEs);
    if (!isValidSlug(slug)) {
      return ctx.redirect('/admin/paginas?flash=error&msg=Slug+invalido', 302);
    }
    if (findPageBySlug(slug)) {
      return ctx.redirect('/admin/paginas?flash=error&msg=Slug+ya+existe', 302);
    }

    const initialBlocks: Block[] = [
      { id: crypto.randomUUID(), type: 'hero', data: { title: titleEs, subtitle: descEs ?? '' } },
    ];

    const page = createPage({
      slug,
      title_es: titleEs,
      title_en: titleEn,
      description_es: descEs,
      description_en: descEn,
      cover_image: coverImage,
      blocks: initialBlocks,
      status,
      createdBy: me.id,
    });

    logAudit({
      userId: me.id,
      action: 'create_page',
      entity: 'pages',
      entityId: page.id,
      details: { slug, title_es: titleEs },
      ip: ctx.clientAddress,
    });

    return ctx.redirect(`/admin/paginas/${page.id}/editar?flash=created`, 302);
  } catch (err) {
    console.error('[api/pages] POST error:', err);
    return new Response(JSON.stringify({ error: 'Server error', code: 'INTERNAL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
