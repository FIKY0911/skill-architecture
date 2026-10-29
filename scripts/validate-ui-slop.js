#!/usr/bin/env node
'use strict';
const fs = require('fs');
const path = require('path');

const EXT = new Set(['.tsx', '.jsx', '.vue', '.svelte', '.html', '.css']);
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build']);
const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const RULES = [
  { id: 'S2', re: /\b(?:bg|text|border)-[a-z0-9-]+\/\d{1,3}\b|\bbg-opacity-\d+|bg-\[rgba?\(|bg-\[hsla?\(/, msg: 'tinted translucent background' },
  { id: 'S3', re: /\b(?:bg|text|border|shadow|rounded|ring|from|to|via)-\[[^\]]+\]/, msg: 'arbitrary value' },
  { id: 'S4', re: new RegExp('\\b(?:bg|text|border|ring|from|to|via|fill|stroke)-(?:' + PALETTE + ')-\\d{2,3}\\b'), msg: 'default palette color' },
  { id: 'S5', re: /style=(?:\{\{|")[^"}]*(?:color|background|box-shadow|boxShadow|border-radius|borderRadius)/i, msg: 'inline style color/shadow/radius' },
  { id: 'S1', re: /#[0-9a-fA-F]{3,8}\b|\b(?:rgb|rgba|hsl|hsla)\(/, msg: 'hardcoded color' },
  { id: 'S7', re: /\bbg-clip-text\b|\btext-transparent\b/, msg: 'gradient text' },
];

function isTokenFile(file, text) {
  return /theme-tokens|tokens?\.css$|globals?\.css$/i.test(path.basename(file)) && /:root|@theme/.test(text);
}

function scanText(file, text) {
  if (isTokenFile(file, text)) return [];
  const out = [];
  text.split('\n').forEach((line, i) => {
    const allow = line.match(/anti-slop-allow:\s*(S\d)/);
    for (const r of RULES) {
      if (allow && allow[1] === r.id) continue;
      const target = r.id === 'S1' && path.extname(file) === '.css' ? line.replace(/--[\w-]+\s*:[^;}]*/g, '') : line;
      if (r.re.test(target)) out.push({ file, line: i + 1, id: r.id, msg: r.msg });
    }
  });
  return out;
}

function walk(p, acc) {
  const st = fs.statSync(p);
  if (st.isDirectory()) {
    if (SKIP_DIRS.has(path.basename(p))) return acc;
    for (const e of fs.readdirSync(p)) walk(path.join(p, e), acc);
  } else if (EXT.has(path.extname(p))) acc.push(p);
  return acc;
}

function scan(target) {
  const v = [];
  for (const f of walk(target, [])) v.push(...scanText(f, fs.readFileSync(f, 'utf8')));
  return v;
}

if (require.main === module) {
  const target = process.argv[2] || '.';
  if (!fs.existsSync(target)) { console.error('Path not found: ' + target); process.exit(2); }
  const v = scan(target);
  v.forEach((x) => console.log(`${x.file}:${x.line} [${x.id}] ${x.msg}`));
  console.log(v.length ? `FAIL: ${v.length} anti-slop violation(s)` : 'OK: no anti-slop violations');
  process.exit(v.length ? 1 : 0);
}
module.exports = { scan, scanText };
