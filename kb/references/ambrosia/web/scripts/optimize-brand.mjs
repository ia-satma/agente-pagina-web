/**
 * optimize-brand.mjs
 * Optimiza las 4 imágenes brand de gran formato (8-10MB cada una) a WebP.
 *
 * Tamaños:
 *   - Diptych (mexica-goddess, still-life): 1200x1600 — aspect 3:4
 *   - BrandFeature (label-macro, museum-pedestal): 1920x1280 — aspect 3:2 ancho
 *
 * Conserva el .png original SOLO si rollback es necesario (no, los borramos).
 */
import sharp from 'sharp';
import { readdir, stat, unlink } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../public/images/brand/', import.meta.url));

// Tamaños por imagen — cada uno con su aspect ratio óptimo en pantalla.
const TARGETS = {
  'mexica-goddess.png':  { w: 1200, h: 1600, q: 82 },
  'still-life.png':      { w: 1200, h: 1600, q: 82 },
  'label-macro.png':     { w: 1920, h: 1280, q: 84 },
  'museum-pedestal.png': { w: 1600, h: 1200, q: 82 },
};

async function run() {
  const results = [];
  for (const [src, t] of Object.entries(TARGETS)) {
    const srcPath = join(DIR, src);
    const dstPath = join(DIR, src.replace(/\.png$/, '.webp'));

    await sharp(srcPath)
      .resize(t.w, t.h, { fit: 'cover', position: 'center' })
      .webp({ quality: t.q, effort: 5 })
      .toFile(dstPath);

    const before = (await stat(srcPath)).size;
    const after = (await stat(dstPath)).size;
    results.push({
      src: src.padEnd(28),
      before: `${(before / 1024 / 1024).toFixed(2)} MB`,
      after:  `${(after / 1024 / 1024).toFixed(2)} MB`,
      saved:  `${((before - after) / before * 100).toFixed(0)}%`,
    });

    // Borra el PNG original
    await unlink(srcPath);
  }
  console.table(results);

  const totalBefore = (await Promise.all(Object.keys(TARGETS).map(async (k) => 0))).reduce((a, b) => a + b, 0);
  console.log('\nPNGs originales eliminados.');
}

run().catch((e) => { console.error(e); process.exit(1); });
