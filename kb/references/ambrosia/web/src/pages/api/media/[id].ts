import type { APIRoute } from 'astro';
import path from 'node:path';
import fs from 'node:fs/promises';
import { getCurrentUser } from '~/lib/auth';
import { can, logAudit, type Role } from '~/lib/users';
import { db } from '~/lib/db';

export const POST: APIRoute = async (ctx) => {
  try {
    const me = await getCurrentUser(ctx);
    if (!me || !can(me.role as Role, 'media.write')) {
      return new Response('Forbidden', { status: 403 });
    }

    const id = parseInt(ctx.params.id ?? '', 10);
    if (!id) return ctx.redirect('/admin/media?error=ID invalido', 302);

    const method = ctx.url.searchParams.get('_method')?.toUpperCase();
    if (method !== 'DELETE') return new Response('Method not allowed', { status: 405 });

    const item = db.prepare(`SELECT * FROM media WHERE id = ?`).get(id) as any;
    if (!item) return ctx.redirect('/admin/media?error=No existe', 302);

    // Borra el archivo físico
    const fsPath = path.resolve(process.cwd(), 'public' + item.path);
    try {
      await fs.unlink(fsPath);
    } catch {
      // archivo ya no existe en disco; OK, sigue
    }

    db.prepare(`DELETE FROM media WHERE id = ?`).run(id);

    logAudit({
      userId: me.id,
      action: 'delete_media',
      entity: 'media',
      entityId: id,
      details: { filename: item.filename },
      ip: ctx.clientAddress,
    });

    return ctx.redirect('/admin/media?flash=deleted', 302);
  } catch (err) {
    console.error('[api/media/[id]] POST error:', err);
    return new Response(JSON.stringify({ error: 'Server error', code: 'INTERNAL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
