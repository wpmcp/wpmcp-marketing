#!/usr/bin/env node
/**
 * House rule guard: NO em-dashes (U+2014 "—") or en-dashes (U+2013 "–") in
 * shipped content. Use a comma or a plain hyphen instead.
 *
 * Scans source (src, docs) and, if present, the built output (dist/**\/*.html).
 * Exits non-zero on any offender so it fails `npm run build` and CI.
 * Zero dependencies.
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const SCAN = [
  { dir: 'src', exts: ['.astro', '.ts', '.js', '.css', '.md'] },
  { dir: 'docs', exts: ['.md'] },
  { dir: 'dist', exts: ['.html'] },
];
const BANNED = /[—–]/; // em-dash, en-dash
const SKIP = new Set(['node_modules', '.git', '.astro']);

function walk(dir, exts, out) {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (SKIP.has(name)) continue;
    const p = join(dir, name);
    const s = statSync(p);
    if (s.isDirectory()) walk(p, exts, out);
    else if (exts.includes(extname(p))) out.push(p);
  }
}

const files = [];
for (const { dir, exts } of SCAN) walk(dir, exts, files);

const offenders = [];
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  lines.forEach((line, i) => {
    if (BANNED.test(line)) {
      offenders.push(`${f}:${i + 1}: ${line.trim().slice(0, 120)}`);
    }
  });
}

if (offenders.length) {
  console.error(`\n✗ Found ${offenders.length} em-dash / en-dash violation(s). Use a comma or plain hyphen:\n`);
  for (const o of offenders) console.error('  ' + o);
  console.error('');
  process.exit(1);
}
console.log(`✓ No em/en dashes in ${files.length} scanned files.`);
