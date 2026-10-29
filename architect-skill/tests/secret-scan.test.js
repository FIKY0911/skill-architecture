#!/usr/bin/env node
/**
 * Secret Scanner & Credential Protection Test Suite (secret-scan.test.js)
 * Verifies detection and masking of AWS keys, GitHub tokens, Anthropic/OpenAI/Gemini keys,
 * JWTs, Private Keys, DB passwords, Android APK keystore secrets, and path blocking in sanitize-input.js.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { scanText, scanFileOrDirectory } = require('../scripts/secret-scan');
const { isBlockedCredentialPath, sanitizeRelativePath } = require('../scripts/sanitize-input');

function runTests() {
  let passed = 0;

  // 1. Scan dummy.env fixture
  const fixturePath = path.resolve(__dirname, 'fixtures/secrets/dummy.env');
  const rawDummy = fs.readFileSync(fixturePath, 'utf8');
  const scanRes = scanText(rawDummy);

  assert.strictEqual(scanRes.clean, false, 'dummy.env must be flagged as containing secrets');
  assert.ok(scanRes.findings.length >= 11, `Expected at least 11 secret findings, got ${scanRes.findings.length}`);
  assert.ok(scanRes.maskedText.includes('[REDACTED:AWS_KEY]'), 'AWS Key must be masked');
  assert.ok(scanRes.maskedText.includes('[REDACTED:AWS_SECRET]'), 'AWS Secret must be masked');
  assert.ok(scanRes.maskedText.includes('[REDACTED:GITHUB_TOKEN]'), 'GitHub token must be masked');
  assert.ok(scanRes.maskedText.includes('[REDACTED:ANTHROPIC_KEY]'), 'Anthropic key must be masked');
  assert.ok(scanRes.maskedText.includes('[REDACTED:OPENAI_KEY]'), 'OpenAI key must be masked');
  assert.ok(scanRes.maskedText.includes('[REDACTED:GEMINI_API_KEY]'), 'Gemini key must be masked');
  assert.ok(scanRes.maskedText.includes('[REDACTED:JWT_TOKEN]'), 'JWT must be masked');
  assert.ok(scanRes.maskedText.includes('[REDACTED:PRIVATE_KEY_BLOCK]'), 'Private key block must be masked');
  assert.ok(scanRes.maskedText.includes('[REDACTED:DB_PASSWORD]'), 'Database password must be masked');
  assert.ok(scanRes.maskedText.includes('[REDACTED:APK_KEYSTORE_SECRET]'), 'Android keystore password must be masked');
  assert.ok(scanRes.maskedText.includes('[REDACTED:GENERIC_SECRET]'), 'Generic secret must be masked');
  passed++;

  // 2. Verify masked text passes re-scan cleanly
  const rescan = scanText(scanRes.maskedText);
  assert.strictEqual(rescan.clean, true, 'Masked text must pass subsequent secret scan with zero findings');
  passed++;

  // 3. Benign text has zero false positives
  const benign = 'const userId = "550e8400-e29b-41d4-a716-446655440000"; const url = "postgresql://localhost:5432/mydb";';
  const benignRes = scanText(benign);
  assert.strictEqual(benignRes.clean, true, 'Benign UUIDs and passwordless DB URLs must not trigger false positives');
  passed++;

  // 4. File masking in isolated temp directory
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-secret-test-'));
  try {
    const dirtyFile = path.join(tmpDir, 'leaked.md');
    fs.writeFileSync(dirtyFile, rawDummy, 'utf8');

    const dirScanBefore = scanFileOrDirectory(tmpDir, { mask: true });
    assert.strictEqual(dirScanBefore.clean, false, 'Initial directory scan must report dirty file');
    assert.strictEqual(dirScanBefore.filesWithSecrets.length, 1, 'Exactly 1 dirty file expected');

    const dirScanAfter = scanFileOrDirectory(tmpDir, { mask: false });
    assert.strictEqual(dirScanAfter.clean, true, 'Directory scan after masking must be clean');
    passed++;
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }

  // 5. Blocked credential paths in sanitize-input.js (AI credentials & APK keystores)
  const blockedTargets = [
    '.env',
    '.env.production',
    'config/release.keystore',
    'android/app/signing.jks',
    'certs/server.pem',
    '~/.ssh/id_rsa',
    '~/.aws/credentials',
    '.claude/credentials.json',
  ];
  for (const target of blockedTargets) {
    assert.strictEqual(isBlockedCredentialPath(target), true, `Path "${target}" must be blocked`);
    assert.throws(
      () => sanitizeRelativePath(target, process.cwd()),
      (err) => err.code === 'ERR_CREDENTIAL_PATH_BLOCKED',
      `sanitizeRelativePath must throw ERR_CREDENTIAL_PATH_BLOCKED for "${target}"`
    );
  }
  passed++;

  console.log(JSON.stringify({ suite: 'secret-scan.test.js', status: 'PASSED', assertions: passed }));
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
