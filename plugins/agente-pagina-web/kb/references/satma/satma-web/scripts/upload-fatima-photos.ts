/**
 * One-shot: upload Fatima's two compressed WebP portraits to the
 * Payload `media` collection, then link them on her `team` doc as
 * `photo` (dark) and `photoLight` (light). Idempotent: if a media
 * row with the same filename exists we reuse it rather than create
 * a duplicate.
 *
 * Run with:
 *   pnpm tsx scripts/upload-fatima-photos.ts
 */
import { getPayload } from "payload";
import { readFile } from "node:fs/promises";
import path from "node:path";
import config from "../payload.config.ts";

const SRC_DIR = "/Users/alejandromtz-flowwork/Movies/satma/SATMA PÁGINA WEB/fotos personas";
const FILES = [
  {
    file: "fatima-dark.webp",
    alt: "Foto de Fatima Navarro, Project Manager de SATMA — versión modo noche con fondo oscuro",
  },
  {
    file: "fatima-light.webp",
    alt: "Foto de Fatima Navarro, Project Manager de SATMA — versión modo día con fondo claro",
  },
];

async function findOrUploadMedia(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload: any,
  filename: string,
  alt: string,
): Promise<string | number> {
  // Reuse if already uploaded.
  const existing = await payload.find({
    collection: "media",
    where: { filename: { equals: filename } },
    limit: 1,
    overrideAccess: true,
  });
  if (existing.docs.length > 0) {
    console.log(`✓ media exists: ${filename}  → id=${existing.docs[0].id}`);
    return existing.docs[0].id;
  }

  const buffer = await readFile(path.join(SRC_DIR, filename));
  const created = await payload.create({
    collection: "media",
    data: { alt },
    file: {
      data: buffer,
      mimetype: "image/webp",
      name: filename,
      size: buffer.byteLength,
    },
    overrideAccess: true,
  });
  console.log(`+ media uploaded: ${filename}  → id=${created.id}`);
  return created.id;
}

async function main() {
  const payload = await getPayload({ config });

  // 1. Upload (or reuse) both media rows.
  const [darkId, lightId] = await Promise.all(
    FILES.map((f) => findOrUploadMedia(payload, f.file, f.alt)),
  );

  // 2. Find Fatima's team doc.
  const fatima = await payload.find({
    collection: "team",
    where: { name: { equals: "Fatima Navarro" } },
    limit: 1,
    overrideAccess: true,
  });
  if (fatima.docs.length === 0) {
    throw new Error("Fatima Navarro not found in `team` — run seed-team.ts first.");
  }
  const fatimaId = fatima.docs[0].id;

  // 3. Link both photos.
  await payload.update({
    collection: "team",
    id: fatimaId,
    data: {
      photo: darkId,
      photoLight: lightId,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any,
    overrideAccess: true,
  });
  console.log(
    `✓ linked photos to Fatima:  photo=${darkId}  photoLight=${lightId}`,
  );

  console.log("\nDone.");
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
