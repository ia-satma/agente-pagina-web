/**
 * One-shot: compress Fatima's portraits (dark + light variants) into
 * WebP and write them next to the originals so the upload script can
 * read them. Quality 85 — these are content photos, not blend-mode
 * layers, so lossy is fine and gives ~85-90% size reduction.
 */
import sharp from "sharp";
import path from "node:path";
import { stat } from "node:fs/promises";

const SRC_DIR = "/Users/alejandromtz-flowwork/Movies/satma/SATMA PÁGINA WEB/fotos personas";
const FILES = [
  { in: "fatima1.png", out: "fatima-dark.webp", note: "dark mode" },
  { in: "fatima2.png", out: "fatima-light.webp", note: "light mode" },
];

for (const f of FILES) {
  const src = path.join(SRC_DIR, f.in);
  const out = path.join(SRC_DIR, f.out);
  const before = (await stat(src)).size;
  await sharp(src).webp({ quality: 85, effort: 6 }).toFile(out);
  const after = (await stat(out)).size;
  const pct = ((1 - after / before) * 100).toFixed(1);
  console.log(
    `✓ ${f.in.padEnd(14)} ${(before / 1024).toFixed(0).padStart(5)} KB → ${f.out.padEnd(20)} ${(after / 1024).toFixed(0).padStart(5)} KB  (-${pct}%) · ${f.note}`,
  );
}
