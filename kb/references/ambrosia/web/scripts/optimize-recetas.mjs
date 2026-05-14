/**
 * optimize-recetas.mjs
 * Convierte los PNGs originales del recetario (1122x1402, ~2.4MB) en WebP
 * optimizados a dos tamaños:
 *   - 800x800 cover (cards de grid en /recetario)
 *   - 1600x1000 cover (hero del detalle /recetario/[slug])
 *
 * Sale a:  public/recetas/<slug>.webp        (800x800, calidad 78)
 *          public/recetas/<slug>-hero.webp   (1600x1000, calidad 82)
 *
 * Conserva los .png originales para no romper nada en caso de rollback.
 */
import sharp from 'sharp';
import { readdir, stat } from 'node:fs/promises';
import { join, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = fileURLToPath(new URL('../public/recetas/', import.meta.url));

async function run() {
  const files = (await readdir(DIR)).filter((f) => f.endsWith('.png'));
  console.log(`Procesando ${files.length} PNGs...`);

  const results = [];
  for (const f of files) {
    const slug = basename(f, '.png');
    const src = join(DIR, f);

    // Card 800x800 cover
    const cardDst = join(DIR, `${slug}.webp`);
    await sharp(src)
      .resize(800, 800, { fit: 'cover', position: 'center' })
      .webp({ quality: 78, effort: 5 })
      .toFile(cardDst);

    // Hero 1600x1000 cover (aspect 16:10 — coincide con .recipe-intro__figure)
    const heroDst = join(DIR, `${slug}-hero.webp`);
    await sharp(src)
      .resize(1600, 1000, { fit: 'cover', position: 'center' })
      .webp({ quality: 82, effort: 5 })
      .toFile(heroDst);

    const before = (await stat(src)).size;
    const after = (await stat(cardDst)).size + (await stat(heroDst)).size;
    results.push({ slug, before, after, savings: ((before - after) / before * 100).toFixed(0) });
  }

  console.table(results.map((r) => ({
    slug: r.slug.padEnd(28),
    before: `${(r.before / 1024 / 1024).toFixed(2)} MB`,
    after:  `${(r.after / 1024 / 1024).toFixed(2)} MB`,
    saved:  `${r.savings}%`,
  })));

  const totalBefore = results.reduce((a, r) => a + r.before, 0);
  const totalAfter  = results.reduce((a, r) => a + r.after, 0);
  console.log(`\nTotal: ${(totalBefore/1024/1024).toFixed(1)} MB → ${(totalAfter/1024/1024).toFixed(1)} MB (${((totalBefore-totalAfter)/totalBefore*100).toFixed(0)}% menos).`);
}

run().catch((e) => { console.error(e); process.exit(1); });
