/**
 * One-shot script to add the real SATMA team members to the Payload
 * `team` collection. Idempotent: if a member with the same name already
 * exists we skip it. The two generic placeholder rows that came with
 * the original seed ("Equipo creativo", "Equipo digital") are removed
 * so the public grid shows real people only.
 *
 * Run with:
 *   pnpm tsx scripts/seed-team.ts
 *
 * Order convention:
 *   0  → Santiago Álvarez (filtered out of the grid; he has his own bio)
 *   1+ → Real members shown in the grid
 *  99  → Generic placeholders (removed)
 */
import { getPayload } from "payload";
import config from "../payload.config.ts";

const NEW_MEMBERS: Array<{
  name: string;
  role: string;
  location: string;
  order: number;
}> = [
  {
    name: "Fatima Navarro",
    role: "Project Manager",
    location: "Monterrey, Nuevo León",
    order: 1,
  },
  {
    name: "Alejandro Martínez",
    role: "Producción",
    location: "Monterrey, Nuevo León",
    order: 2,
  },
  {
    name: "Luis Rodríguez",
    role: "Diseño Gráfico",
    location: "Monterrey, Nuevo León",
    order: 3,
  },
];

// Names of the placeholder rows from `scripts/seed.ts` that are now
// being replaced by real people. We delete them so the /agencia grid
// only shows actual humans.
const PLACEHOLDERS_TO_REMOVE = ["Equipo creativo", "Equipo digital"];

async function main() {
  const payload = await getPayload({ config });

  // ── Insert (or skip) each member ────────────────────────────────────
  for (const m of NEW_MEMBERS) {
    const existing = await payload.find({
      collection: "team",
      where: { name: { equals: m.name } },
      limit: 1,
      overrideAccess: true,
    });

    if (existing.docs.length > 0) {
      console.log(`✓ already exists: ${m.name}  → skipping`);
      continue;
    }

    const created = await payload.create({
      collection: "team",
      data: m,
      overrideAccess: true,
    });
    console.log(`+ created:        ${m.name}  (id=${created.id})`);
  }

  // ── Remove the generic placeholders ────────────────────────────────
  for (const placeholder of PLACEHOLDERS_TO_REMOVE) {
    const found = await payload.find({
      collection: "team",
      where: { name: { equals: placeholder } },
      limit: 1,
      overrideAccess: true,
    });
    if (found.docs.length === 0) continue;
    await payload.delete({
      collection: "team",
      id: found.docs[0].id,
      overrideAccess: true,
    });
    console.log(`- removed placeholder: ${placeholder}`);
  }

  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
