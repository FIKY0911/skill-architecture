#!/usr/bin/env node
/**
 * Append-Only Zero-Leak Audit Logger (audit-log.js)
 * Scrubs any sensitive strings via secret-scan before writing JSONL entries.
 */
'use strict';

require('./egress-guard');
const fs = require('fs');
const path = require('path');
const { scanText } = require('./secret-scan');

function appendAuditEntry(action, details = {}, logFilePath) {
  const defaultLogPath = path.resolve(process.cwd(), 'docs/.architect-audit.log');
  const targetLog = logFilePath || defaultLogPath;
  const dir = path.dirname(targetLog);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const rawPayload = JSON.stringify({
    timestamp: new Date().toISOString(),
    action: String(action),
    details,
  });

  const { maskedText } = scanText(rawPayload);
  fs.appendFileSync(targetLog, maskedText + '\n', 'utf8');
  return JSON.parse(maskedText);
}

if (require.main === module) {
  const action = process.argv[2] || 'CLI_AUDIT_EVENT';
  const entry = appendAuditEntry(action, { argv: process.argv.slice(3) });
  console.log(JSON.stringify(entry));
}

module.exports = { appendAuditEntry };
