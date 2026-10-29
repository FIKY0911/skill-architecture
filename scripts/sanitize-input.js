#!/usr/bin/env node
/**
 * Path & Input Sanitizer (sanitize-input.js)
 * Prevents directory traversal, null-byte injection, and access to blocked credential paths.
 */
'use strict';

require('./egress-guard');
const path = require('path');

const FORBIDDEN_PATTERNS = [
  /(^|[\\/])\.env($|\.)/i,
  /\.(pem|key|keystore|jks|p12|pfx)$/i,
  /(^|[\\/])id_(rsa|ed25519|ecdsa|dsa)/i,
  /(^|[\\/])(secrets|credentials|\.ssh|\.aws)([\\/]|$)/i,
  /(^|[\\/])\.(claude|cursor|codex)[\\/]/i,
];

function isBlockedCredentialPath(targetPath) {
  if (!targetPath || typeof targetPath !== 'string') return false;
  const normalized = targetPath.replace(/\\/g, '/');
  return FORBIDDEN_PATTERNS.some((rx) => rx.test(normalized));
}

function sanitizeIdentifier(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/\0/g, '')
    .replace(/[^a-zA-Z0-9._-]/g, '-')
    .replace(/\.{2,}/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 128);
}

function sanitizeRelativePath(inputPath, allowedRootDir) {
  if (typeof inputPath !== 'string' || !inputPath.trim()) {
    throw new Error('[SANITIZE_ERROR] Empty or non-string path provided');
  }
  if (inputPath.includes('\0')) {
    throw new Error('[SANITIZE_ERROR] Null byte detected in path');
  }
  if (isBlockedCredentialPath(inputPath)) {
    const err = new Error(`[SECURITY_VIOLATION] Access to credential path is strictly forbidden: ${inputPath}`);
    err.code = 'ERR_CREDENTIAL_PATH_BLOCKED';
    throw err;
  }

  const rootResolved = path.resolve(allowedRootDir || process.cwd());
  const cleaned = inputPath
    .replace(/\\/g, '/')
    .split('/')
    .filter((seg) => seg && seg !== '.' && seg !== '..')
    .join('/');

  const candidate = path.resolve(rootResolved, cleaned);
  if (!candidate.startsWith(rootResolved)) {
    throw new Error(`[SECURITY_VIOLATION] Path traversal outside allowed root rejected: ${inputPath}`);
  }
  return candidate;
}

if (require.main === module) {
  const arg = process.argv[2] || '';
  try {
    const safe = sanitizeRelativePath(arg, process.cwd());
    console.log(JSON.stringify({ valid: true, sanitizedPath: safe }));
  } catch (err) {
    console.error(JSON.stringify({ valid: false, error: err.message }));
    process.exit(1);
  }
}

module.exports = {
  sanitizeIdentifier,
  sanitizeRelativePath,
  isBlockedCredentialPath,
};
