import type { APIRoute } from 'astro';
import path from 'node:path';
import fs from 'node:fs/promises';
import { getCurrentUser } from '~/lib/auth';
import { can, logAudit, type Role } from '~/lib/users';
import { db } from '~/lib/db';

const MAX_BYTES = 25 * 1024 * 1024; // 25 MB
const ALLOWED_TYPES = /^(image\/(png|jpe?g|webp|gif|avif|svg\+xml))|video\/(mp4|webm|quicktime)$/;
const UPLOAD_DIR = path.resolve(process.cwd(), 'public/images/cms');

function safeFilename(original: string): string {
  const ext = path.extname(original).toLowerCase();
  const stem = path.basename(original, ext).replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  const timestamp = Date.now();
  return `${timestamp}-${stem}${ext}`;
}

export const POST: APIRoute = async (ctx) => {
  try {
    const me = await getCurrentUser(ctx);
    if (!me || !can(me.role as Role, 'media.write')) {
      return new Response('Forbidden', { status: 403 });
    }

    let form;
    try {
      form = await ctx.request.formData();
    } catch {
      return ctx.redirect('/admin/media?error=Form invalido', 302);
    }

    const file = form.get('file') as File | null;
    const alt = String(form.get('alt') ?? '').trim() || null;

    if (!file || typeof file === 'string') {
      return ctx.redirect('/admin/media?error=No se recibio archivo', 302);
    }
    if (file.size > MAX_BYTES) {
      return ctx.redirect(`/admin/media?error=Archivo muy grande (${(file.size / 1024 / 1024).toFixed(1)} MB > 25 MB)`, 302);
    }
    if (!ALLOWED_TYPES.test(file.type)) {
      return ctx.redirect(`/admin/media?error=Tipo no permitido (${file.type})`, 302);
    }

    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    const filename = safeFilename(file.name);
    const filepath = path.join(UPLOAD_DIR, filename);
    const publicPath = `/images/cms/${filename}`;

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filepath, buf);

    const type = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document';

    const r = db.prepare(`
      INSERT INTO media (filename, path, mime, type, size_bytes, alt_text, uploaded_by)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(file.name, publicPath, file.type, type, file.size, alt, me.id);

    logAudit({
      userId: me.id,
      action: 'upload_media',
      entity: 'media',
      entityId: Number(r.lastInsertRowid),
      details: { filename: file.name, size: file.size, type },
      ip: ctx.clientAddress,
    });

    return ctx.redirect('/admin/media?flash=uploaded', 302);
  } catch (err) {
    console.error('[api/media/upload] POST error:', err);
    return new Response(JSON.stringify({ error: 'Server error', code: 'INTERNAL' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
