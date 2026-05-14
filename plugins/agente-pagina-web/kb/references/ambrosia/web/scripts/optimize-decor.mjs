#!/usr/bin/env node
/**
 * Optimiza las 8 ilustraciones decor a WebP quality 85.
 * Reduce ~1.4MB → ~150KB cada una.
 */
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DECOR_DIR = path.resolve(__dirname, '../public/images/decor');

const files = (await readdir(DECOR_DIR)).filter((f) => f.endsWith('.png'));

for (const file of files) {
  const inPath = path.join(DECOR_DIR, file);
  const outPath = path.join(DECOR_DIR, file.replace(/\.png$/, '.webp'));
  await sharp(inPath).webp({ quality: 85, effort: 6 }).toFile(outPath);
  const sizeIn = (await stat(inPath)).size;
  const sizeOut = (await stat(outPath)).size;
  console.log(`${file}: ${(sizeIn / 1024).toFixed(0)}KB → ${(sizeOut / 1024).toFixed(0)}KB (${((sizeOut / sizeIn) * 100).toFixed(0)}%)`);
}
console.log('Done');
