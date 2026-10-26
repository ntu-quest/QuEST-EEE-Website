#!/usr/bin/env node
/* ---------------------------------------------------------------------------
 * Build redesign/data/content.js from the site's own content.
 *
 *   node redesign/build-content.mjs        (run from QuEST_Website/)
 *
 * The prototype opens every page in place, so it needs the content those
 * pages would show. This reads it from the same places the Astro site does,
 * src/content/ and the arrays at the top of the few pages that keep their
 * copy inline, so the prototype cannot drift from the real site. Nothing is
 * written by hand here.
 *
 * Rules carried over from the site:
 *   - photographs with consent other than "granted" or "na" are left out;
 *   - email addresses are split into user and domain and only joined in the
 *     browser, as ObfuscatedMailto does;
 *   - the H2 table comes from booth-src/data, the file the booth tests check.
 * ------------------------------------------------------------------------- */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join, basename, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { toHast } from 'mdast-util-to-hast';
import { toHtml } from 'hast-util-to-html';

const HERE = dirname(fileURLToPath(import.meta.url));
const SITE = join(HERE, '..');
const CONTENT = join(SITE, 'src', 'content');

const markdown = (text) => toHtml(toHast(fromMarkdown(text.trim())));

function collection(name) {
  const dir = join(CONTENT, name);
  const out = {};
  for (const file of readdirSync(dir).filter((f) => !f.startsWith('._') && /\.mdx?$/.test(f)).sort()) {
    const raw = readFileSync(join(dir, file), 'utf8');
    const match = raw.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
    const data = match ? yaml.load(match[1]) : {};
    const body = match ? match[2] : raw;
    const id = basename(file).replace(/\.mdx?$/, '');
    out[id] = { id, ...data, html: body.trim() ? markdown(body) : '' };
  }
  return out;
}

/* Inline arrays from a page's frontmatter, e.g. `const BLOCKS = [ ... ];`.
   `media('x')` assignments are resolved to their ids so photos stay real. */
function pageArrays(file, names) {
  const src = readFileSync(join(SITE, 'src', file), 'utf8');
  const front = src.split(/^---$/m)[1] || '';
  const mediaVars = {};
  for (const m of front.matchAll(/const (\w+) = await media\('([^']+)'\);/g)) mediaVars[m[1]] = m[2];
  const out = {};
  for (const name of names) {
    const m = front.match(new RegExp(`const ${name} = (\\[[\\s\\S]*?\\n\\]);`));
    if (!m) throw new Error(`${file}: no ${name}`);
    let literal = m[1];
    for (const [variable, id] of Object.entries(mediaVars)) {
      literal = literal.replace(new RegExp(`(photo:\\s*)${variable}\\b`, 'g'), `$1'${id}'`);
    }
    out[name] = new Function(`return ${literal}`)();
  }
  return out;
}

function siteArray(name) {
  const src = readFileSync(join(SITE, 'src', 'lib', 'site.ts'), 'utf8');
  const m = src.match(new RegExp(`export const ${name} = (\\[[\\s\\S]*?\\n\\]) as const;`));
  if (!m) throw new Error(`site.ts: no ${name}`);
  return new Function(`return ${m[1]}`)();
}

/* ---- media: consented files only, resolved to the optimised outputs ------ */
const manifest = JSON.parse(readFileSync(join(SITE, 'public', 'images', 'manifest.json'), 'utf8'));
const media = {};
for (const [id, entry] of Object.entries(collection('media'))) {
  if (!['granted', 'na'].includes(entry.consent)) continue;
  const m = manifest[entry.file];
  if (!m) continue;
  const img = (name) => (existsSync(join(SITE, 'public', 'images', name)) ? `../public/images/${name}` : null);
  const src = img(`${m.base}.webp`);
  if (!src) continue;
  media[id] = {
    alt: entry.alt, caption: entry.caption || '', credit: entry.credit || '', usage: entry.usage || '', width: m.width, height: m.height,
    src, small: img(`${m.base}-640.webp`) || src,   /* small images have no 640 variant */
  };
}

/* ---- people: split addresses, keep the vacant opening as an opening ------- */
const people = {};
for (const [id, p] of Object.entries(collection('people'))) {
  const { email, ...rest } = p;
  const [user, domain] = typeof email === 'string' && email.includes('@') ? email.split('@') : [null, null];
  people[id] = { ...rest, user, domain, photo: rest.photo && media[rest.photo] ? rest.photo : null };
}

const h2 = JSON.parse(readFileSync(join(SITE, 'booth-src', 'data', 'h2_hamiltonian.json'), 'utf8'));
const routing = siteArray('ROUTING').map(({ about, role, user }) => ({ about, role, user, domain: 'e.ntu.edu.sg' }));

const data = {
  generated: 'redesign/build-content.mjs from src/content — do not hand-edit',
  media,
  projects: collection('projects'),
  events: collection('events'),
  demos: collection('demos'),
  resources: collection('resources'),
  stack: collection('stack'),
  news: Object.fromEntries(Object.entries(collection('news')).filter(([, n]) => (n.status || 'published') === 'published')),
  milestones: collection('milestones'),
  partners: collection('partners'),
  links: collection('links'),
  people,
  routing,
  pages: {
    ...pageArrays('pages/explore/what-we-do.astro', ['BLOCKS']),
    ...pageArrays('pages/research.astro', ['LADDER', 'PROCESS']),
    ...pageArrays('pages/about/culture.astro', ['BELIEFS']),
  },
  h2: { rows: h2.rows, defaultR: h2.defaultR, chemicalAccuracy: h2.chemicalAccuracy, source: h2.source },
};

mkdirSync(join(HERE, 'data'), { recursive: true });
const out = `/* ${data.generated} */\nwindow.QUEST = ${JSON.stringify(data)};\n`;
writeFileSync(join(HERE, 'data', 'content.js'), out);
const counts = Object.fromEntries(Object.entries(data).filter(([, v]) => v && typeof v === 'object' && !Array.isArray(v)).map(([k, v]) => [k, Object.keys(v).length]));
console.log(`wrote redesign/data/content.js (${(out.length / 1024).toFixed(1)} KB)`, counts);
