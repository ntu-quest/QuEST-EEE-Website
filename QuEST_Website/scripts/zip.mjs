/* ---------------------------------------------------------------------------
 * A minimal ZIP writer.
 *
 * The offline bundle used to shell out to `zip`, which is present on a Mac and
 * on GitHub's runners but is not guaranteed on every build image. This is the
 * whole format we need — deflate, no encryption, no zip64 — in about a hundred
 * lines, so the build depends on nothing outside node.
 * ------------------------------------------------------------------------- */

import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import { deflateRaw } from 'node:zlib';
import { promisify } from 'node:util';
import path from 'node:path';

const compress = promisify(deflateRaw);

/* CRC-32, table-driven. */
const TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buffer) {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buffer.length; i++) c = TABLE[(c ^ buffer[i]) & 0xFF] ^ (c >>> 8);
  return (c ^ 0xFFFFFFFF) >>> 0;
}

/* MS-DOS date and time, which is what the format stores. */
function dosStamp(date) {
  const time = ((date.getHours() << 11) | (date.getMinutes() << 5) | (date.getSeconds() / 2)) & 0xFFFF;
  const day = (((date.getFullYear() - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate()) & 0xFFFF;
  return { time, day };
}

async function walk(dir, base = dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name === '.DS_Store') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full, base));
    else out.push({ full, name: path.relative(base, full).split(path.sep).join('/') });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Zip a directory. Entries are stored under `prefix/`, so unzipping produces a
 * single folder rather than spraying files into the current directory.
 */
export async function zipDirectory(dir, destination, prefix) {
  const files = await walk(dir);
  const locals = [];
  const centrals = [];
  let offset = 0;

  for (const file of files) {
    const raw = await readFile(file.full);
    const deflated = await compress(raw, { level: 9 });
    /* Deflate can grow incompressible data; store it as-is when it does. */
    const stored = deflated.length >= raw.length;
    const body = stored ? raw : deflated;
    const name = Buffer.from(prefix ? `${prefix}/${file.name}` : file.name, 'utf8');
    const { time, day } = dosStamp((await stat(file.full)).mtime);
    const crc = crc32(raw);

    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034B50, 0);      // local file header signature
    local.writeUInt16LE(20, 4);              // version needed
    local.writeUInt16LE(0, 6);               // flags
    local.writeUInt16LE(stored ? 0 : 8, 8);  // 0 = store, 8 = deflate
    local.writeUInt16LE(time, 10);
    local.writeUInt16LE(day, 12);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(body.length, 18);
    local.writeUInt32LE(raw.length, 22);
    local.writeUInt16LE(name.length, 26);
    local.writeUInt16LE(0, 28);              // extra field length
    locals.push(local, name, body);

    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014B50, 0);    // central directory signature
    central.writeUInt16LE(20, 4);            // version made by
    central.writeUInt16LE(20, 6);            // version needed
    central.writeUInt16LE(0, 8);
    central.writeUInt16LE(stored ? 0 : 8, 10);
    central.writeUInt16LE(time, 12);
    central.writeUInt16LE(day, 14);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(body.length, 20);
    central.writeUInt32LE(raw.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(0, 38);            // external attributes
    central.writeUInt32LE(offset, 42);       // offset of local header
    centrals.push(central, name);

    offset += local.length + name.length + body.length;
  }

  const centralBuffer = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054B50, 0);          // end of central directory
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralBuffer.length, 12);
  end.writeUInt32LE(offset, 16);

  const out = Buffer.concat([...locals, centralBuffer, end]);
  await writeFile(destination, out);
  return { files: files.length, bytes: out.length };
}
