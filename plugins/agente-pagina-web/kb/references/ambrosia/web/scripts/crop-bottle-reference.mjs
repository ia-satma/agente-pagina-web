#!/usr/bin/env node
/**
 * Crop la botella canónica de composition-1.png para usarla como reference.
 * La botella ocupa la mitad izquierda (vertical), aproximadamente columnas 50-280, filas 60-450.
 */
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN  = path.resolve(__dirname, '../public/images/brand/composition-1.png');
const OUT = path.resolve(__dirname, '../../bottle-reference.png');

const meta = await sharp(IN).metadata();
console.log('Source:', meta.width + 'x' + meta.height);

// La botella en composition-1.png está aprox en x=80-280 / y=80-450 (de 600x450 imagen)
// Calculamos proporcionalmente
const left   = Math.round(meta.width * 0.13);
const top    = Math.round(meta.height * 0.18);
const width  = Math.round(meta.width * 0.30);
const height = Math.round(meta.height * 0.78);

console.log(`Crop: left=${left}, top=${top}, width=${width}, height=${height}`);

await sharp(IN)
  .extract({ left, top, width, height })
  // Aumenta resolución para que la referencia sea nítida
  .resize({ width: 800, withoutEnlargement: false })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

console.log('Saved bottle reference to:', OUT);
