// Prepares Talha's photos for the site.
//
// FACE PRESERVATION — the rule this script exists to enforce:
//   * Nothing here generates, redraws, reshapes, smooths or recolours a face.
//   * The only operations are: crop, background removal via an alpha mask,
//     and re-encoding to WebP. Every visible pixel of Talha is his original
//     pixel from photos/original.
//   * After writing, the face region of each output is compared back to the
//     source and the script fails if the difference is more than encoder noise.
//
// usage: npm run photos   (macOS — the cut-out mask uses Apple's Vision framework)

import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = path.join(root, 'photos/original/talha-02.png');
const OUT = path.join(root, 'src/assets/photos');

// The area of the source file that is photograph (the whole frame for the studio portrait).
const PHOTO = { left: 0, top: 0, width: 1145, height: 1374 };
// Face bounding box inside PHOTO, used only for the fidelity check.
const FACE = { left: 370, top: 215, width: 420, height: 640 };
// Maximum mean per-channel difference (0–255) tolerated between source and output.
const MAX_FACE_DRIFT = 2.5;

const work = mkdtempSync(path.join(tmpdir(), 'talha-photos-'));
mkdirSync(OUT, { recursive: true });

const photoPath = path.join(work, 'photo.png');
const maskPath = path.join(work, 'mask.png');

await sharp(SOURCE).extract(PHOTO).png().toFile(photoPath);
execFileSync('swift', [path.join(root, 'scripts/person-mask.swift'), photoPath, maskPath], {
  stdio: 'inherit',
});

const { width, height } = PHOTO;
const rgb = await sharp(photoPath).removeAlpha().raw().toBuffer();

// Tighten the mask edge by roughly a pixel so no white wall fringes the hair.
const alpha = await sharp(maskPath)
  .greyscale()
  .blur(0.8)
  .linear(1.7, -0.32 * 255)
  .toColourspace('b-w')
  .raw()
  .toBuffer();

const cutout = await sharp(rgb, { raw: { width, height, channels: 3 } })
  .joinChannel(alpha, { raw: { width, height, channels: 1 } })
  .png()
  .toBuffer();

const webp = { quality: 96, alphaQuality: 100, effort: 6, smartSubsample: true };

// Each output is a plain crop of the photo (cut-out or untouched).
const outputs = [
  // Head and shoulders, background removed — hero and poster frame.
  { name: 'talha-cutout', input: cutout, crop: { left: 0, top: 186, width: 1145, height: 1188 } },
  // Tighter crop of the same cut-out — close-up frame.
  { name: 'talha-close', input: cutout, crop: { left: 235, top: 190, width: 700, height: 910 } },
  // The photograph exactly as supplied, background included — "original" frame.
  { name: 'talha-original', input: photoPath, crop: { left: 132, top: 120, width: 880, height: 1100 } },
];

for (const { name, input, crop } of outputs) {
  const file = path.join(OUT, `${name}.webp`);
  await sharp(input).extract(crop).webp(webp).toFile(file);

  const drift = await faceDrift(file, crop);
  const verdict = drift <= MAX_FACE_DRIFT ? 'ok' : 'FAILED';
  console.log(`${name}.webp  ${crop.width}x${crop.height}  face drift ${drift.toFixed(2)}/255  ${verdict}`);
  if (!(drift <= MAX_FACE_DRIFT)) {
    throw new Error(`${name}: face pixels differ from the original by more than encoder noise`);
  }
}

rmSync(work, { recursive: true, force: true });

// Mean absolute RGB difference between the source face and the same region of an output.
async function faceDrift(file, crop) {
  const region = {
    left: FACE.left - crop.left,
    top: FACE.top - crop.top,
    width: FACE.width,
    height: FACE.height,
  };
  const [original, written] = await Promise.all([
    sharp(photoPath).extract(FACE).removeAlpha().raw().toBuffer(),
    sharp(file).extract(region).flatten({ background: '#000' }).removeAlpha().raw().toBuffer(),
  ]);
  // Compare only pixels the mask keeps fully opaque, so cut-out edges don't count.
  const keep = await sharp(alpha, { raw: { width, height, channels: 1 } })
    .extract(FACE)
    .toColourspace('b-w')
    .raw()
    .toBuffer({ resolveWithObject: true });
  const pixels = FACE.width * FACE.height;
  let total = 0;
  let count = 0;
  for (let i = 0; i < pixels; i += 1) {
    if (keep.data[i * keep.info.channels] < 255) continue;
    for (let c = 0; c < 3; c += 1) total += Math.abs(original[i * 3 + c] - written[i * 3 + c]);
    count += 3;
  }
  // No comparable pixels means the check could not run — treat that as a failure.
  return count ? total / count : Infinity;
}
