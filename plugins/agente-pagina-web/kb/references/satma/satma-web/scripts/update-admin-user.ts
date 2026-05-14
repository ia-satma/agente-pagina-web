/**
 * One-shot script to set the admin user's email + password.
 *
 * Run with:
 *   pnpm tsx scripts/update-admin-user.ts
 *
 * Defaults match the production-ready credentials. Change locally if needed.
 */
import { getPayload } from "payload";
import config from "../payload.config.ts";

const NEW_EMAIL = process.env.ADMIN_EMAIL ?? "ia@satma.mx";
const NEW_PASSWORD = process.env.ADMIN_PASSWORD ?? "satmapower";

async function main() {
  const payload = await getPayload({ config });

  // Find any existing user (we expect 1 from the seed)
  const existing = await payload.find({
    collection: "users",
    limit: 1,
    overrideAccess: true,
  });

  if (existing.docs.length === 0) {
    // No user yet — create one
    const created = await payload.create({
      collection: "users",
      // The Users collection adds a custom `role` field on top of
      // Payload's auth defaults — the generated types don't include it
      // in the strict shape, so we cast through `never` to bypass.
      data: {
        email: NEW_EMAIL,
        password: NEW_PASSWORD,
        role: "admin",
      } as never,
      overrideAccess: true,
    });
    console.log(`✅ Created admin user id=${created.id} email=${created.email}`);
  } else {
    // Update existing user
    const u = existing.docs[0] as { id: number | string; email?: string };
    const updated = await payload.update({
      collection: "users",
      id: u.id,
      // The Users collection adds a custom `role` field on top of
      // Payload's auth defaults — the generated types don't include it
      // in the strict shape, so we cast through `never` to bypass.
      data: {
        email: NEW_EMAIL,
        password: NEW_PASSWORD,
        role: "admin",
      } as never,
      overrideAccess: true,
    });
    console.log(
      `✅ Updated user id=${updated.id} email=${updated.email} (was: ${u.email})`,
    );
  }

  process.exit(0);
}

main().catch((err) => {
  console.error("❌ Failed:", err);
  process.exit(1);
});
