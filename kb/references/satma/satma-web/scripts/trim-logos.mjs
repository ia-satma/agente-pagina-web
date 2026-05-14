import sharp from "sharp";

const optimizations = [
  { file: "public/images/satma-wordmark.png",   width: 1600 },
  { file: "public/images/satma-isotype.png",    width: 800 },
  { file: "public/images/brujeria-wordmark.png", width: 1200 },
  { file: "public/images/brujeria-mascot.png",  width: 1000 },
];

for (const o of optimizations) {
  const buf = await sharp(o.file)
    .resize({ width: o.width, withoutEnlargement: true })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
  await sharp(buf).toFile(o.file);
  console.log("optimized", o.file);
}
