/**
 * Tier 2 - Boundary & Corner Cases: Secret Detection Precision & False-Positive Resistance
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT } = require('../helpers/test-context.js');
const path = require('path');

const { scanText } = require(path.join(PROJECT_ROOT, 'scripts/secret-scan.js'));

describe('Tier 2: Secret Detection Precision & Boundary Anchors', () => {

  test('TC-T2-SEC-01: Detects inline passwords in PostgreSQL, Redis, and MongoDB connection URIs', () => {
    const text = 'redis://default:MyRedisPass999@cache.internal:6379/0';
    const res = scanText(text);
    assert.strictEqual(res.clean, false);
    assert.ok(res.maskedText.includes('[REDACTED:DB_PASSWORD]'));
  });

  test('TC-T2-SEC-02: Detects Android Gradle storePassword and keyPassword declarations', () => {
    const gradle = 'storePassword "SuperSecretApkStorePass"\nkeyPassword = "SuperSecretApkKeyPass"';
    const res = scanText(gradle);
    assert.strictEqual(res.clean, false);
    assert.ok(res.maskedText.includes('[REDACTED:APK_KEYSTORE_SECRET]'));
  });

  test('TC-T2-SEC-03: Does not trigger false positives on already redacted placeholders', () => {
    const cleanText = 'api_key="[REDACTED:GENERIC_SECRET]" password="{{SECRET_DB_PASS}}"';
    const res = scanText(cleanText);
    assert.strictEqual(res.clean, true, 'Already redacted placeholders must not re-trigger scanner');
  });

  test('TC-T2-SEC-04: Does not trigger false positives on standard Git SHA-256 hashes or UUIDs', () => {
    const text = 'Commit: c21125f436ca6d87b781a7a90db2d7fd05753e7bd56b8364bd9dc325e94d915d, ID: 123e4567-e89b-12d3-a456-426614174000';
    const res = scanText(text);
    assert.strictEqual(res.clean, true);
  });

});
