/* ---------------------------------------------------------------------------
 * Ship the "Quantum, from scratch." redesign (redesign/) into dist/ so that
 * Vercel serves the new redesign at `/` (and `/redesign/`), while keeping all
 * standalone Astro routes (/links, /events/*, /demos/*, etc.) live alongside it.
 * ------------------------------------------------------------------------- */

import { cp, mkdir } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const REDESIGN = path.join(ROOT, 'redesign');
const DIST = path.join(ROOT, 'dist');

const FILES = ['index.html', 'redesign.css', 'redesign.js', 'sheets.js', 'plots.js'];
const DIRS = ['assets', 'data'];

await mkdir(DIST, { recursive: true });
await mkdir(path.join(DIST, 'redesign'), { recursive: true });

for (const file of FILES) {
  await cp(path.join(REDESIGN, file), path.join(DIST, file));
  await cp(path.join(REDESIGN, file), path.join(DIST, 'redesign', file));
}
for (const dir of DIRS) {
  await cp(path.join(REDESIGN, dir), path.join(DIST, dir), { recursive: true });
  await cp(path.join(REDESIGN, dir), path.join(DIST, 'redesign', dir), { recursive: true });
}

/* redesign/index.html and data/content.js reference ../public/* and
   ../booth-src/physics.js, which resolve to /public/* and /booth-src/physics.js
   both from `/` and from `/redesign/`. */
await mkdir(path.join(DIST, 'booth-src'), { recursive: true });
await cp(path.join(ROOT, 'booth-src', 'physics.js'), path.join(DIST, 'booth-src', 'physics.js'));
await cp(path.join(ROOT, 'public'), path.join(DIST, 'public'), { recursive: true });

console.log('  redesign: shipped "Quantum, from scratch." to dist/ and dist/redesign/');
