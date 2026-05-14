import type { APIRoute } from 'astro';
import { destroySession, getCurrentUser } from '~/lib/auth';
import { logAudit } from '~/lib/users';

const handler: APIRoute = async (ctx) => {
  const user = await getCurrentUser(ctx);
  if (user) {
    logAudit({ userId: user.id, action: 'logout', entity: 'auth' });
  }
  await destroySession(ctx);
  return ctx.redirect('/admin/login', 302);
};

export const GET = handler;
export const POST = handler;
