#!/usr/bin/env node
/**
 * Preview-Safe Text Diagram Validator (validate-diagrams.js)
 * Mermaid is not rendered by the VSCode markdown preview. Every Mermaid (.mmd) diagram
 * therefore has a plain-text twin (.md with a fenced ```text block) that always renders.
 * Checks: title heading, closed non-empty text fence, no scripts/secrets, and .mmd/.md twin parity.
 */
'use strict';

require('./egress-guard');
const fs = require('fs');
const path = require('path');
const { scanText } = require('./secret-scan');

const FENCE_RE = /^```(\w*)\s*$/;

function validateTextDiagramContent(content) {
  const errors = [];
  if (typeof content !== 'string' || !content.trim()) {
    return { valid: false, errors: ['Empty text diagram document'], textBlocks: 0 };
  }
  const lines = content.split(/\r?\n/);
  if (!/^#\s+\S/.test(lines.find((l) => l.trim()) || '')) {
    errors.push('Text diagram must start with a Markdown "# Title" heading');
  }

  let open = null;
  let textBlocks = 0;
  let current = [];
  for (const line of lines) {
    const m = line.match(FENCE_RE);
    if (m && open === null) {
      open = m[1].toLowerCase();
      current = [];
    } else if (line.trim() === '```' && open !== null) {
      if (open === 'text' || open === 'ascii') {
        if (current.filter((l) => l.trim()).length < 3) {
          errors.push('Text diagram block must contain at least 3 non-empty lines');
        } else {
          textBlocks++;
        }
      }
      open = null;
    } else if (open !== null) {
      current.push(line);
    }
  }
  if (open !== null) errors.push('Unclosed code fence in text diagram');
  if (textBlocks === 0) errors.push('Text diagram must contain a fenced ```text block');

  if (/<script\b|javascript:|onerror\s*=/i.test(content)) {
    errors.push('Forbidden script or XSS directive detected in text diagram');
  }
  const secretCheck = scanText(content);
  if (!secretCheck.clean) {
    errors.push(`Credential detected inside text diagram (${secretCheck.findings.length} finding(s))`);
  }
  return { valid: errors.length === 0, errors, textBlocks };
}

function listFiles(dir, ext) {
  if (!fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) return [];
  return fs.readdirSync(dir).filter((f) => f.endsWith(ext)).sort();
}

/** Returns .mmd base names in mmdDir that lack a .md twin in mdDir. */
function findMissingTwins(mmdDir, mdDir) {
  return listFiles(mmdDir, '.mmd')
    .map((f) => f.slice(0, -4))
    .filter((base) => !fs.existsSync(path.join(mdDir, base + '.md')));
}

/** Validates every .md in dir (or only those twinning an .mmd when onlyTwins is set). */
function validateTextDiagramPath(dir, options = {}) {
  const twinBases = options.mmdDir
    ? new Set(listFiles(options.mmdDir, '.mmd').map((f) => f.slice(0, -4)))
    : null;
  const results = [];
  for (const f of listFiles(dir, '.md')) {
    if (twinBases && !twinBases.has(f.slice(0, -3))) continue;
    const file = path.join(dir, f);
    results.push({ file, ...validateTextDiagramContent(fs.readFileSync(file, 'utf8')) });
  }
  return { valid: results.every((r) => r.valid), checkedCount: results.length, results };
}

if (require.main === module) {
  const root = path.resolve(__dirname, '..');
  const mdDir = process.argv[2] || path.join(root, 'assets/diagrams');
  const mmdDir = process.argv[3] || path.join(root, 'assets/uml');
  const report = validateTextDiagramPath(mdDir);
  const out = { valid: report.valid, ...report };
  console.log(JSON.stringify(out, null, 2));
  if (!out.valid) process.exit(1);
}

module.exports = { validateTextDiagramContent, validateTextDiagramPath, findMissingTwins };
