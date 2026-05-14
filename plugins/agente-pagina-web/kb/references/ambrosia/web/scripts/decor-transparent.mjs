#!/usr/bin/env node
/**
 * Procesa los PNG decor para hacer el fondo cream transparente.
 * Los originales tienen fondo cream sólido + nubes painterly violet.
 * Aquí: pixels claros (cream) → alpha 0; pixels oscuros (violet) → preserve.
 */
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DECOR_DIR = path.resolve(__dirname, '../public/images/decor');

const files = (await readdir(DECOR_DIR)).filter((f) => f.endsWith('.png'));

const THRESHOLD = 235;  // luminosidad >= 235 → transparente (cream)
const SOFT = 35;        // soft-edge entre 200 y 235

for (const file of files) {
  const inPath = path.join(DECOR_DIR, file);
  const { data, info } = await sharp(inPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = Buffer.alloc(data.length);
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];
    // Luminancia perceptual
    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    let newAlpha;
    if (lum >= THRESHOLD) {
      newAlpha = 0;
    } else if (lum >= THRESHOLD - SOFT) {
      newAlpha = Math.round(a * (1 - (lum - (THRESHOLD - SOFT)) / SOFT));
    } else {
      newAlpha = a;
    }
    out[i]     = r;
    out[i + 1] = g;
    out[i + 2] = b;
    out[i + 3] = newAlpha;
  }

  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(inPath);  // overwrite

  const sizeOut = (await stat(inPath)).size;
  console.log(`${file}: alpha applied → ${(sizeOut / 1024).toFixed(0)}KB`);
}
console.log('Done. cream backgrounds removed.');
