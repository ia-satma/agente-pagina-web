import type { APIRoute } from 'astro';
import { getCurrentUser } from '~/lib/auth';
import { can, logAudit, type Role } from '~/lib/users';
import { listSettings, setSetting } from '~/lib/settings';

/**
 * Recibe el form de configuracion.
 * - visibility.* → booleanos (checkbox)
 * - social.* → strings (URL)
 * - gallery.home → JSON array (de admin/galeria-home)
 */
export const POST: APIRoute = async (ctx) => {
  const me = await getCurrentUser(ctx);
  if (!me || !can(me.role as Role, 'settings.write')) {
    return new Response('Forbidden', { status: 403 });
  }

  const form = await ctx.request.formData();
  let totalChanges = 0;

  // 1) Visibility checkboxes: si NO viene en el form → false
  const visibilityKeys = listSettings()
    .filter((s) => s.key.startsWith('visibility.'))
    .map((s) => s.key);
  for (const key of visibilityKeys) {
    const next = form.has(key);
    setSetting(key, next, me.id);
    totalChanges++;
  }

  // 2) Social URLs: cada campo del form que empiece con 'social.' se guarda
  const socialPlatforms = ['instagram', 'facebook', 'twitter', 'tiktok', 'youtube', 'email'];
  for (const p of socialPlatforms) {
    const key = `social.${p}`;
    if (form.has(key)) {
      const value = String(form.get(key) ?? '').trim();
      setSetting(key, value, me.id);
      totalChanges++;
    }
  }

  // 2b) ElevenLabs agent_id (string)
  if (form.has('elevenlabs.agentId')) {
    const value = String(form.get('elevenlabs.agentId') ?? '').trim();
    setSetting('elevenlabs.agentId', value, me.id);
    totalChanges++;
  }

  // 3) Gallery JSON (string del textarea)
  if (form.has('gallery.home')) {
    const raw = String(form.get('gallery.home') ?? '').trim();
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          setSetting('gallery.home', parsed, me.id);
          totalChanges++;
        }
      } catch (e) {
        return ctx.redirect('/admin/configuracion?flash=error', 302);
      }
    } else {
      // vacio → reset al fallback hardcodeado
      setSetting('gallery.home', [], me.id);
      totalChanges++;
    }
  }

  logAudit({
    userId: me.id,
    action: 'update_settings',
    entity: 'settings',
    details: { changed: totalChanges },
    ip: ctx.clientAddress,
  });

  return ctx.redirect('/admin/configuracion?flash=saved', 302);
};
