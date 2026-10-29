#!/usr/bin/env node
/**
 * Offline Mermaid Diagram Syntax Validator (validate-mermaid.js)
 * Checks .mmd files or inline Mermaid blocks for valid headers, balanced brackets/blocks,
 * and absence of XSS or credential leaks.
 */
'use strict';

require('./egress-guard');
const fs = require('fs');
const path = require('path');
const { scanText } = require('./secret-scan');

const VALID_HEADERS = [
  'sequenceDiagram',
  'erDiagram',
  'stateDiagram-v2',
  'stateDiagram',
  'C4Context',
  'C4Container',
  'C4Component',
  'C4Dynamic',
  'flowchart',
  'graph',
  'classDiagram',
  'xychart-beta',
];

function validateMermaidContent(content) {
  const errors = [];
  if (typeof content !== 'string' || !content.trim()) {
    return { valid: false, errors: ['Empty Mermaid diagram content'] };
  }

  const lines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith('%%'));

  if (lines.length === 0) {
    return { valid: false, errors: ['No non-comment lines in Mermaid diagram'] };
  }

  const firstLine = lines[0];
  const hasValidHeader = VALID_HEADERS.some(
    (h) => firstLine === h || firstLine.startsWith(h + ' ')
  );
  if (!hasValidHeader) {
    errors.push(`Invalid or unsupported Mermaid diagram header: "${firstLine}"`);
  }

  // Check for XSS / script injection
  if (/<script\b|javascript:|onerror\s*=/i.test(content)) {
    errors.push('Forbidden script or XSS directive detected in Mermaid diagram');
  }

  // Check for leaked secrets
  const secretCheck = scanText(content);
  if (!secretCheck.clean) {
    errors.push(`Credential detected inside Mermaid diagram (${secretCheck.findings.length} finding(s))`);
  }

  // Check balanced curly braces for ERDs / C4 boundaries
  // ER cardinality tokens (||--o{, }|..|{) and quoted labels are not block delimiters.
  const braceSource = content
    .replace(/"[^"\n]*"/g, '""')
    .replace(/[|o}{]{1,2}(?:--|\.\.)[|o}{]{1,2}/g, ' REL ');
  let braceBalance = 0;
  for (const ch of braceSource) {
    if (ch === '{') braceBalance++;
    else if (ch === '}') braceBalance--;
    if (braceBalance < 0) {
      errors.push('Unbalanced closing brace "}" detected');
      break;
    }
  }
  if (braceBalance !== 0) {
    errors.push(`Unbalanced curly braces in diagram (net balance: ${braceBalance})`);
  }

  // Check sequenceDiagram block balance (alt/opt/loop/par/rect/critical -> end)
  if (firstLine.startsWith('sequenceDiagram')) {
    let blockDepth = 0;
    for (const line of lines.slice(1)) {
      if (/^(alt|opt|loop|par|rect|critical)\b/.test(line)) {
        blockDepth++;
      } else if (/^end\b/.test(line)) {
        blockDepth--;
        if (blockDepth < 0) {
          errors.push('Unexpected "end" statement in sequenceDiagram');
          break;
        }
      }
    }
    if (blockDepth !== 0) {
      errors.push(`Unclosed control block in sequenceDiagram (depth: ${blockDepth})`);
    }
  }

  return {
    valid: errors.length === 0,
    header: firstLine,
    errors,
  };
}

function validateMermaidPath(targetPath) {
  const results = [];
  function walk(curr) {
    if (!fs.existsSync(curr)) return;
    const stat = fs.statSync(curr);
    if (stat.isDirectory()) {
      for (const entry of fs.readdirSync(curr)) {
        walk(path.join(curr, entry));
      }
    } else if (stat.isFile() && curr.endsWith('.mmd')) {
      const content = fs.readFileSync(curr, 'utf8');
      const res = validateMermaidContent(content);
      results.push({ file: curr, ...res });
    }
  }
  walk(targetPath);
  const allValid = results.every((r) => r.valid);
  return { valid: allValid, checkedCount: results.length, results };
}

if (require.main === module) {
  const target = process.argv[2] || path.resolve(__dirname, '../assets/uml');
  const report = validateMermaidPath(target);
  console.log(JSON.stringify(report, null, 2));
  if (!report.valid) {
    process.exit(1);
  }
}

module.exports = {
  validateMermaidContent,
  validateMermaidPath,
};
