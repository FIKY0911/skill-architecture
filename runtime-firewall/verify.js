#!/usr/bin/env node
/**
 * Runtime Tool Firewall & SHA-256 Pin Verifier (verify.js)
 * Computes cryptographic SHA-256 digests of scripts and verifies against tool-pins.json.
 */
'use strict';

require('../scripts/egress-guard');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const SKILL_ROOT = path.resolve(__dirname, '..');
const PINS_PATH = path.resolve(__dirname, 'tool-pins.json');

const PINNED_FILES = [
  'scripts/egress-guard.js',
  'scripts/sanitize-input.js',
  'scripts/secret-scan.js',
  'scripts/audit-log.js',
  'scripts/validate-mermaid.js',
  'scripts/validate-structure.js',
  'scripts/validate-output.js',
  'scripts/wizard-state.js',
  'scripts/install.js',
  'scripts/doctor.js',
];

function computeSha256(filePath) {
  const bytes = fs.readFileSync(filePath);
  return crypto.createHash('sha256').update(bytes).digest('hex');
}

function generateToolPins() {
  const pins = {};
  for (const rel of PINNED_FILES) {
    const abs = path.join(SKILL_ROOT, rel);
    if (fs.existsSync(abs)) {
      pins[rel] = computeSha256(abs);
    }
  }
  const payload = {
    schema_version: '1.0.0',
    algorithm: 'SHA-256',
    pins,
  };
  fs.writeFileSync(PINS_PATH, JSON.stringify(payload, null, 2) + '\n', 'utf8');
  return payload;
}

function verifyToolPins() {
  if (!fs.existsSync(PINS_PATH)) {
    generateToolPins();
  }
  const registry = JSON.parse(fs.readFileSync(PINS_PATH, 'utf8'));
  const mismatches = [];
  for (const [rel, expectedHash] of Object.entries(registry.pins || {})) {
    const abs = path.join(SKILL_ROOT, rel);
    if (!fs.existsSync(abs)) {
      mismatches.push({ file: rel, reason: 'MISSING_FILE' });
      continue;
    }
    const actualHash = computeSha256(abs);
    if (actualHash !== expectedHash) {
      mismatches.push({ file: rel, reason: 'HASH_DRIFT', expectedHash, actualHash });
    }
  }
  return {
    verified: mismatches.length === 0,
    checkedCount: Object.keys(registry.pins || {}).length,
    mismatches,
  };
}

if (require.main === module) {
  if (process.argv.includes('--update')) {
    console.log(JSON.stringify(generateToolPins(), null, 2));
  } else {
    const report = verifyToolPins();
    console.log(JSON.stringify(report, null, 2));
    if (!report.verified) process.exit(1);
  }
}

module.exports = {
  computeSha256,
  generateToolPins,
  verifyToolPins,
};
