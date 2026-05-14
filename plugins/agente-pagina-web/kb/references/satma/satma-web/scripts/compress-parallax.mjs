/**
 * Re-encode the parallax-hero PNGs to WebP. Lossless mode for the
 * portraits/robot because the hero uses CSS `mix-blend-mode: screen`
 * (dark theme) and `multiply` (light theme) — both modes require the
 * source background to be pixel-pure (true black for screen, true
 * white for multiply). Lossy compression at quality 82 introduced
 * subtle gray noise that the blend revealed as a visible halo around
 * the figures (reported by user: "no carga bien la imagen de la mujer
 * en modo noche").
 *
 * Galaxy backgrounds (`1-light` for light, `2` for dark) don't go
 * through a blend mode — they sit at the bottom layer with `object-cover`,
 * fully opaque — so lossy is fine for those.
 *
 * Originals stay backed up under `_originals/`.
 */
import sharp from "sharp";
import { mkdir, copyFile, stat, rm } from "node:fs/promises";
import path from "node:path";

const SRC_DIR =
  "/Users/alejandromtz-flowwork/Movies/satma/SATMA PÁGINA WEB/satma-web/public/images/parallax-hero";
const BACKUP_DIR = path.join(SRC_DIR, "_originals");

/**
 * Per-file encoding strategy:
 *   - lossless: required when the image is composited via blend mode.
 *   - lossy q90: galaxy bgs — high quality but compressible since no blend.
 */
const FILES = [
  // Dark-mode trio (uses `screen` blend → needs true-black bg).
  { name: "2.png",        encoding: "lossy",    note: "dark galaxy bg" },
  { name: "1.png",        encoding: "lossless", note: "dark portrait (woman)" },
  { name: "robot.png",    encoding: "lossless", note: "dark robot reveal" },
  // Light-mode trio (uses `multiply` blend → needs true-white bg).
  { name: "1-light.png",  encoding: "lossy",    note: "light galaxy bg" },
  { name: "2-light.png",  encoding: "lossless", note: "light portrait" },
  { name: "3-light.png",  encoding: "lossless", note: "light robot" },
];

async function fileSize(p) {
  try {
    const s = await stat(p);
    return s.size;
  } catch {
    return 0;
  }
}

async function main() {
  await mkdir(BACKUP_DIR, { recursive: true });

  let totalBefore = 0;
  let totalAfter = 0;

  for (const f of FILES) {
    // Source: prefer the original under _originals/ if it exists (this
    // script may be re-run after we already migrated to webp once).
    const backup = path.join(BACKUP_DIR, f.name);
    const live = path.join(SRC_DIR, f.name);
    let src;
    if (await fileSize(backup)) src = backup;
    else if (await fileSize(live)) src = live;
    else {
      console.log(`✗ skip (missing): ${f.name}`);
      continue;
    }

    // Make sure backup exists for next time.
    if (src === live) await copyFile(live, backup);

    const baseName = f.name.replace(/\.png$/, "");
    const out = path.join(SRC_DIR, `${baseName}.webp`);

    const before = await fileSize(backup);

    if (f.encoding === "lossless") {
      await sharp(src).webp({ lossless: true, effort: 6 }).toFile(out);
    } else {
      // Bumped from 82 → 90 for the galaxy bgs too (still tiny).
      await sharp(src)
        .webp({ quality: 90, effort: 6, smartSubsample: true })
        .toFile(out);
    }

    // Remove the legacy PNG if it still lives at the SRC_DIR root.
    if (await fileSize(live)) await rm(live);

    const after = await fileSize(out);
    const pct = ((1 - after / before) * 100).toFixed(1);
    totalBefore += before;
    totalAfter += after;
    console.log(
      `✓ ${f.name.padEnd(16)} ${f.encoding.padEnd(8)} ${(before / 1024).toFixed(0).padStart(5)} KB → ${(after / 1024).toFixed(0).padStart(5)} KB  (-${pct}%)  · ${f.note}`,
    );
  }

  console.log("─".repeat(80));
  console.log(
    `Total: ${(totalBefore / 1024 / 1024).toFixed(2)} MB → ${(totalAfter / 1024 / 1024).toFixed(2)} MB ` +
      `(saved ${(((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)}%)`,
  );
}

await main();
