/* ---------------------------------------------------------------------------
 * The booth bundle — BLUEPRINT §07 option B: port the shell, share the logic.
 *
 * ONE SOURCE OF TRUTH, TWO OUTPUTS.
 *
 *   booth-src/                the booth build, verbatim. NEVER edit anything
 *                             here to suit the website — edit it in the booth
 *                             repository and copy across, or the offline build
 *                             and the site will drift.
 *        │
 *        ├─→ public/demos/                  the shared runtime the site's demo
 *        │                                  pages load: physics.js, mathfmt.js,
 *        │                                  shared.js, shared.css, circuits/,
 *        │                                  data/. Copied byte for byte.
 *        │
 *        ├─→ public/demo-wire/<slug>.js     each page's own inline wiring,
 *        │                                  lifted out verbatim
 *        │
 *        ├─→ src/generated/demos.json       its markup blocks, so the Astro
 *        │                                  shell can reassemble them in the
 *        │                                  canonical section order
 *        │
 *        └─→ public/quest-demos-offline.zip the whole thing, for the USB stick
 *
 * Why the five HTML pages are NOT copied into public/demos/: the site's own
 * routes are /demos and /demos/<slug> (§04), and a static host asked for
 * /demos/grover will happily serve demos/grover.html instead of
 * demos/grover/index.html. The booth pages would silently shadow the ported
 * ones. They ship inside the zip, which is where §07 wanted the offline bundle
 * anyway. Nothing about the files themselves changes.
 *
 * The physics is never rewritten. physics.js and mathfmt.js are copied and
 * loaded unchanged, exactly as the booth loads them.
 * ------------------------------------------------------------------------- */

import { readFile, writeFile, mkdir, rm, cp } from 'node:fs/promises';
import path from 'node:path';
import { zipDirectory } from './zip.mjs';
const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'booth-src');
const RUNTIME = path.join(ROOT, 'public/demos');
const GEN = path.join(ROOT, 'src/generated');
const WIRE = path.join(ROOT, 'public/demo-wire');
const ZIP = path.join(ROOT, 'public/quest-demos-offline.zip');

const SLUGS = ['grover', 'bell', 'stern-gerlach', 'vqe-h2'];
/* Everything the site's demo pages load at runtime. The HTML pages are
   deliberately absent — see the header. */
const RUNTIME_FILES = [
  'physics.js', 'mathfmt.js', 'shared.js', 'shared.css',
  'quest-logo.png', 'quest-logo-light.png',
];
const RUNTIME_DIRS = ['circuits', 'data'];

/* -------------------------------------------------------- markup extraction */

/* Balanced-tag scanner. A regex cannot match nested <div>s, and every block we
   want has them. Returns { inner, outer, end } for the element starting at
   `from`, or null. */
function element(html, from) {
  const open = html.indexOf('>', from);
  if (open === -1) return null;
  const tag = html.slice(from + 1, open).split(/[\s>]/)[0];
  let depth = 1;
  let index = open + 1;
  const opener = new RegExp(`<${tag}[\\s>]`, 'g');
  const closer = new RegExp(`</${tag}>`, 'g');
  while (depth > 0) {
    opener.lastIndex = index;
    closer.lastIndex = index;
    const next = opener.exec(html);
    const close = closer.exec(html);
    if (!close) return null;
    if (next && next.index < close.index) { depth += 1; index = next.index + 1; }
    else { depth -= 1; index = close.index + close[0].length; }
  }
  return {
    inner: html.slice(open + 1, index - `</${tag}>`.length),
    outer: html.slice(from, index),
    end: index,
  };
}

/* Every element whose opening tag matches `pattern`, in document order,
   skipping any nested inside one already collected. */
function collect(html, pattern) {
  const out = [];
  let cursor = 0;
  const re = new RegExp(pattern, 'g');
  for (;;) {
    re.lastIndex = cursor;
    const match = re.exec(html);
    if (!match) break;
    const found = element(html, match.index);
    if (!found) break;
    out.push(found);
    cursor = found.end;
  }
  return out;
}

const one = (html, pattern) => collect(html, pattern)[0] ?? null;

/* ------------------------------------------------------------------- run it */

await mkdir(GEN, { recursive: true });
await mkdir(WIRE, { recursive: true });
await mkdir(RUNTIME, { recursive: true });

/* 1 — the shared runtime, byte for byte. */
for (const file of RUNTIME_FILES) {
  await cp(path.join(SRC, file), path.join(RUNTIME, file));
}
for (const dir of RUNTIME_DIRS) {
  await cp(path.join(SRC, dir), path.join(RUNTIME, dir), { recursive: true });
}
console.log(`  runtime: ${RUNTIME_FILES.length} files + ${RUNTIME_DIRS.join(', ')}`);

/* 2 — the markup and the wiring. */
const demos = {};

for (const slug of SLUGS) {
  const html = await readFile(path.join(SRC, `${slug}.html`), 'utf8');

  /* The actions under the headline ("Run one step", "Reset"). The frame around
     them is rebuilt; the buttons and their ids are the booth's. */
  const head = one(html, '<header class="station-head"');
  const actions = head ? one(head.inner, '<div class="button-row"') : null;

  const readout = one(html, '<div class="readout"');
  const controls = one(html, '<div class="controls"');

  /* Canvas panels in document order. Anything inside .controls is a knob, not
     a panel, so that block is removed first. */
  let body = html;
  if (controls) {
    body = body.slice(0, controls.end - controls.outer.length) + body.slice(controls.end);
  }
  const wrappers = collect(body, '<div class="panels[^"]*"');
  const loose = collect(body, '<section class="panel"');

  /* De-duplicate by position, not by object identity — a wrapper and a bare
     panel can hold identical markup. */
  const panels = [...wrappers, ...loose]
    .filter((block) => {
      const start = block.end - block.outer.length;
      return !wrappers.some((w) => {
        const wStart = w.end - w.outer.length;
        return wStart < start && block.end <= w.end;
      });
    })
    .sort((a, b) => (a.end - a.outer.length) - (b.end - b.outer.length))
    .map((block) => block.outer);

  const maths = one(html, '<div class="maths-body"');

  /* The booth's maths body uses <h4 class="maths-head"> because on a booth page
     it sits inside a <details> under the station's <h1>. In the site shell it
     sits under "The maths" <h2>, so h4 would skip a level and break the
     document outline. Only the tag changes; the class and the text are the
     booth's. */
  const mathsHtml = maths
    ? maths.inner
        .replace(/<h4 class="maths-head">/g, '<h3 class="maths-head">')
        .replace(/<\/h4>/g, '</h3>')
    : '';

  /* The page's own wiring, verbatim: the last inline <script> in the file.
     Everything before it is a src= reference to a shared file. */
  const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  const wiring = scripts.length ? scripts[scripts.length - 1][1] : '';
  await writeFile(
    path.join(WIRE, `${slug}.js`),
    `/* Extracted verbatim from booth-src/${slug}.html by scripts/booth.mjs.\n`
    + `   Do not edit this file — edit the booth page and rebuild, so the offline\n`
    + `   bundle and the website never disagree. */\n${wiring}`,
  );

  demos[slug] = {
    actions: actions ? actions.outer : '',
    readout: readout ? readout.outer : '',
    panels,
    controls: controls ? controls.inner : '',
    maths: mathsHtml,
  };

  if (!readout || !controls || !maths || panels.length === 0) {
    throw new Error(
      `${slug}: expected a readout, controls, the maths and at least one panel — `
      + `the booth page's structure has changed and the shell needs updating.`,
    );
  }
  console.log(`  ${slug}: ${panels.length} panel blocks, ${wiring.split('\n').length} lines of wiring`);
}

await writeFile(path.join(GEN, 'demos.json'), JSON.stringify(demos, null, 2));

/* 3 — the offline bundle. Unzips to a single `quest-demos/` folder: open
   index.html inside it and all four stations run, with no network. */
await rm(ZIP, { force: true });
const { files, bytes } = await zipDirectory(SRC, ZIP, 'quest-demos');
console.log(`  quest-demos-offline.zip — ${files} files, ${Math.round(bytes / 1024)} KB`);
