/**
 * Tier 2 - Boundary & Corner Cases: Path Traversal & Credential File Access Prevention
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT } = require('../helpers/test-context.js');
const path = require('path');

const { sanitizeRelativePath, isBlockedCredentialPath } = require(path.join(PROJECT_ROOT, 'scripts/sanitize-input.js'));

describe('Tier 2: Path Traversal & Forbidden Credential Paths', () => {

  test('TC-T2-PTR-01: Null byte injection in path is strictly rejected', () => {
    assert.throws(
      () => sanitizeRelativePath('docs/PRD.md\0.txt', PROJECT_ROOT),
      /Null byte detected/
    );
  });

  test('TC-T2-PTR-02: Relative traversal sequences (../ and ..\\) are neutralized within allowedRootDir', () => {
    const allowedRoot = path.join(PROJECT_ROOT, 'docs');
    const resolved = sanitizeRelativePath('../../../../etc/passwd', allowedRoot);
    assert.ok(resolved.startsWith(allowedRoot), `Resolved path "${resolved}" must remain inside "${allowedRoot}"`);
  });

  test('TC-T2-PTR-03: Host AI and cloud credential paths are strictly blocked', () => {
    const forbidden = [
      '~/.ssh/id_ed25519',
      '~/.aws/credentials',
      '.claude/settings.json',
      '.cursor/Auth',
      '.codex/token',
    ];
    for (const p of forbidden) {
      assert.strictEqual(isBlockedCredentialPath(p), true, `Must block ${p}`);
      assert.throws(() => sanitizeRelativePath(p, PROJECT_ROOT), /ERR_CREDENTIAL_PATH_BLOCKED|strictly forbidden/);
    }
  });

  test('TC-T2-PTR-04: Target application and Android APK signing secrets are strictly blocked', () => {
    const apkSecrets = [
      '.env',
      '.env.local',
      'android/app/release.keystore',
      'signing/upload-key.jks',
      'certs/client.p12',
      'certs/private.pfx',
      'secrets/db-pass.txt',
    ];
    for (const p of apkSecrets) {
      assert.strictEqual(isBlockedCredentialPath(p), true, `Must block application/APK secret path ${p}`);
    }
  });

});
