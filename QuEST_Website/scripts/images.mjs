/* ---------------------------------------------------------------------------
 * Image pipeline — CLAUDE.md §Assets, BLUEPRINT §09 / §14.
 *
 * Reads public/images-src/ (originals, never shipped) and writes
 * public/images/ (AVIF + WebP, a 2000px cap and a 640px phone variant,
 * every file under 180 KB) plus public/images/manifest.json, which carries
 * intrinsic dimensions so every <img> can declare width and height and
 * nothing shifts as the page loads.
 *
 * Also converts the six generated physics GIFs to muted looping video with a
 * poster frame — as GIFs they are ~2.2 MB between them.
 *
 * Idempotent: skips anything already newer than its source.
 * ------------------------------------------------------------------------- */

import { readdir, mkdir, stat, writeFile, readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import path from 'node:path';
import sharp from 'sharp';

const run = promisify(execFile);
const ROOT = path.resolve(import.meta.dirname, '..');
/* NOT under public/ — Astro copies that folder wholesale, and these originals
   are 69 MB. They would have shipped. */
const SRC = path.join(ROOT, 'media-src');
const OUT = path.join(ROOT, 'public/images');
const GIF_SRC = path.resolve(ROOT, '../QCC_qfest/assets');
const VID_OUT = path.join(ROOT, 'public/video');

const MAX = 2000;
const PHONE = 640;
const BUDGET = 180 * 1024;

/* Quality ladder: step down until the file fits the budget. A photograph that
   will not fit at the lowest step gets reported rather than silently shipped. */
const LADDER = { avif: [62, 52, 44, 36, 30], webp: [80, 70, 60, 50, 42, 34] };

const manifest = {};
const oversize = [];

async function encode(input, base, width, fmt, label) {
  const dest = path.join(OUT, `${base}${label}.${fmt}`);
  for (const q of LADDER[fmt]) {
    const pipeline = sharp(input).resize({ width, withoutEnlargement: true });
    const buf = await (fmt === 'avif'
      ? pipeline.avif({ quality: q, effort: 6 })
      : pipeline.webp({ quality: q, effort: 5 })).toBuffer();
    if (buf.length <= BUDGET || q === LADDER[fmt].at(-1)) {
      await writeFile(dest, buf);
      if (buf.length > BUDGET) oversize.push(`${base}${label}.${fmt} — ${Math.round(buf.length / 1024)} KB`);
      return buf.length;
    }
  }
  return 0;
}

async function images() {
  await mkdir(OUT, { recursive: true });
  if (!existsSync(SRC)) {
    /* media-src/ holds the untouched originals and is deliberately not
       committed — several are 5–10 MB, and CLAUDE.md forbids committing an
       image over 500 KB. The optimised output in public/images/ IS committed,
       so a CI build has everything it needs and simply skips this step. */
    console.log('  (no media-src/ — using the committed optimised images)');
    return;
  }
  const files = (await readdir(SRC)).filter((f) => /\.(jpe?g|png)$/i.test(f));

  for (const file of files) {
    const input = path.join(SRC, file);
    const base = file.replace(/\.[^.]+$/, '');
    const meta = await sharp(input).metadata();
    const width = Math.min(meta.width, MAX);
    const height = Math.round((meta.height / meta.width) * width);

    manifest[file] = { width, height, base };

    const target = path.join(OUT, `${base}.avif`);
    if (existsSync(target)) {
      const [a, b] = await Promise.all([stat(input), stat(target)]);
      if (b.mtimeMs > a.mtimeMs) continue;
    }

    await Promise.all([
      encode(input, base, width, 'avif', ''),
      encode(input, base, width, 'webp', ''),
      meta.width > PHONE ? encode(input, base, PHONE, 'avif', '-640') : null,
      meta.width > PHONE ? encode(input, base, PHONE, 'webp', '-640') : null,
    ]);
    process.stdout.write(`  ${base} ${width}×${height}\n`);
  }

  /* Merge rather than replace, so a partial run does not drop known sizes. */
  const manifestPath = path.join(OUT, 'manifest.json');
  let existing = {};
  if (existsSync(manifestPath)) {
    try { existing = JSON.parse(await readFile(manifestPath, 'utf8')); } catch { /* rewrite */ }
  }
  await writeFile(manifestPath, JSON.stringify({ ...existing, ...manifest }, null, 2));
}

/* The six generated physics animations. Illustration beside the matching demo,
   never wallpaper — and every one gets a poster frame so reduced-motion users
   see a still rather than nothing. */
async function video() {
  /* Same again: the six source GIFs live in the booth repository (two are over
     500 KB) and the converted video is committed instead. ffmpeg is a local
     tool, not a CI dependency. */
  if (!existsSync(GIF_SRC)) {
    console.log('  (no GIF source — using the committed video)');
    return;
  }
  await mkdir(VID_OUT, { recursive: true });
  const gifs = (await readdir(GIF_SRC)).filter((f) => f.endsWith('.gif'));

  for (const gif of gifs) {
    const base = gif.replace(/\.gif$/, '');
    const src = path.join(GIF_SRC, gif);
    const mp4 = path.join(VID_OUT, `${base}.mp4`);
    if (existsSync(mp4)) {
      const [a, b] = await Promise.all([stat(src), stat(mp4)]);
      if (b.mtimeMs > a.mtimeMs) continue;
    }
    /* yuv420p and an even frame size, or Safari refuses to decode it. */
    const scale = 'scale=trunc(iw/2)*2:trunc(ih/2)*2';
    try {
      await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vf', scale,
        '-movflags', 'faststart', '-pix_fmt', 'yuv420p', '-crf', '30', '-an', mp4]);
      await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vf', scale,
        '-c:v', 'libvpx-vp9', '-crf', '38', '-b:v', '0', '-an',
        path.join(VID_OUT, `${base}.webm`)]);
      await run('ffmpeg', ['-y', '-loglevel', 'error', '-i', src, '-vframes', '1',
        path.join(VID_OUT, `${base}.png`)]);
      process.stdout.write(`  ${base} → mp4 + webm + poster\n`);
    } catch (error) {
      console.warn(`  ${base}: ${error.message.split('\n')[0]}`);
    }
  }
}

console.log('images:');
await images();
console.log('video:');
await video();
if (oversize.length) {
  console.warn('\nOver the 180 KB budget — crop or re-shoot these:');
  oversize.forEach((line) => console.warn(`  ${line}`));
}
