#!/usr/bin/env node
/**
 * Procesa isotipo correcto: convierte fondo blanco a transparente.
 * Source: /AMBROSIA - WEB /isotipo 1024.png (woodcut hand + bottle + lightning)
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN  = '/Users/alejandromtz-flowwork/Movies/satma/AMBROSIA - WEB /isotipo 1024.png';
const OUT = path.resolve(__dirname, '../src/assets/brand/isotype.png');

const input = sharp(IN);
const meta = await input.metadata();
console.log('Input:', meta.width + 'x' + meta.height, meta.channels + ' channels');

const { data, info } = await input
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

console.log('Processing', info.width * info.height, 'pixels...');

const out = Buffer.alloc(data.length);
const THRESHOLD = 240;
const SOFT = 30;

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];
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
  .toFile(OUT);

console.log('Output:', OUT);
