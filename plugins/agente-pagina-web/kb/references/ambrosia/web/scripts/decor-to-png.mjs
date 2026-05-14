#!/usr/bin/env node
/** Convierte los decor.webp a PNG (lossless, color exacto). */
import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DECOR_DIR = path.resolve(__dirname, '../public/images/decor');

const files = (await readdir(DECOR_DIR)).filter((f) => f.endsWith('.webp'));

for (const file of files) {
  const inPath = path.join(DECOR_DIR, file);
  const outPath = path.join(DECOR_DIR, file.replace(/\.webp$/, '.png'));
  await sharp(inPath).png({ compressionLevel: 9, palette: false }).toFile(outPath);
  const sizeIn = (await stat(inPath)).size;
  const sizeOut = (await stat(outPath)).size;
  console.log(`${file} → PNG: ${(sizeIn / 1024).toFixed(0)}KB → ${(sizeOut / 1024).toFixed(0)}KB`);
  await unlink(inPath);
}
console.log('Done. webp removed.');
