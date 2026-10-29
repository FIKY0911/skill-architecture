#!/usr/bin/env node
/**
 * Secret Scanner & Redaction Engine (secret-scan.js)
 * Scans text or files for credentials using policies/redaction-rules.json.
 * Zero-dependency Node.js module. Never accesses host AI or APK secret files directly unless passed for redaction.
 */
'use strict';

require('./egress-guard');
const fs = require('fs');
const path = require('path');

const RULES_PATH = path.resolve(__dirname, '../policies/redaction-rules.json');

function loadRules() {
  const raw = fs.readFileSync(RULES_PATH, 'utf8');
  const parsed = JSON.parse(raw);
  return (parsed.rules || []).map((r) => ({
    id: r.id,
    description: r.description,
    regex: new RegExp(r.pattern, r.flags || 'g'),
    replacement: r.replacement,
  }));
}

function scanText(text, customRules) {
  if (typeof text !== 'string') {
    return { clean: true, findings: [], maskedText: '' };
  }
  const rules = customRules || loadRules();
  const findings = [];
  let maskedText = text;

  for (const rule of rules) {
    const rx = new RegExp(rule.regex.source, rule.regex.flags);
    let match;
    while ((match = rx.exec(text)) !== null) {
      findings.push({
        ruleId: rule.id,
        description: rule.description,
        index: match.index,
        redactedPreview: rule.replacement,
      });
      if (!rx.global) break;
    }
    maskedText = maskedText.replace(new RegExp(rule.regex.source, rule.regex.flags), rule.replacement);
  }

  return {
    clean: findings.length === 0,
    findings,
    maskedText,
  };
}

function scanFileOrDirectory(targetPath, options = {}) {
  const rules = loadRules();
  const results = [];

  function walk(curr) {
    if (!fs.existsSync(curr)) return;
    const stat = fs.statSync(curr);
    if (stat.isDirectory()) {
      const base = path.basename(curr);
      if (base === 'node_modules' || base === '.git') return;
      for (const entry of fs.readdirSync(curr)) {
        walk(path.join(curr, entry));
      }
    } else if (stat.isFile()) {
      const content = fs.readFileSync(curr, 'utf8');
      const scanRes = scanText(content, rules);
      if (!scanRes.clean) {
        if (options.mask) {
          fs.writeFileSync(curr, scanRes.maskedText, 'utf8');
        }
        results.push({
          file: curr,
          findingsCount: scanRes.findings.length,
          findings: scanRes.findings,
          masked: Boolean(options.mask),
        });
      }
    }
  }

  walk(targetPath);
  return {
    clean: results.length === 0,
    filesWithSecrets: results,
  };
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const isCheck = args.includes('--check');
  const isMask = args.includes('--mask');
  const targetArg = args.find((a) => !a.startsWith('--')) || path.resolve(process.cwd(), 'docs');

  const report = scanFileOrDirectory(targetArg, { mask: isMask });
  console.log(JSON.stringify(report, null, 2));
  if (isCheck && !report.clean) {
    process.exit(1);
  }
}

module.exports = {
  loadRules,
  scanText,
  scanFileOrDirectory,
};
