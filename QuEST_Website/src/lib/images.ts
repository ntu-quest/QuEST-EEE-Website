/* Intrinsic dimensions for every optimised image, so <img> can always declare
   width and height and nothing shifts as the page loads. Written by
   scripts/images.mjs; run `npm run images` after adding a file. */
import manifest from '../../public/images/manifest.json';

type Entry = { width: number; height: number; base: string };
const table = manifest as Record<string, Entry>;

export function imageFor(file: string) {
  const entry = table[file];
  if (!entry) {
    throw new Error(
      `No optimised image for "${file}". Add it to public/images-src/ and run \`npm run images\`.`
    );
  }
  return entry;
}

export function hasImage(file: string) {
  return Boolean(table[file]);
}
