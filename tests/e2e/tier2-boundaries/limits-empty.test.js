/**
 * Tier 2 - Boundary & Corner Cases: Empty Inputs & Extreme Lengths
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT } = require('../helpers/test-context.js');
const path = require('path');

const { scanText } = require(path.join(PROJECT_ROOT, 'scripts/secret-scan.js'));
const { validateMermaidContent } = require(path.join(PROJECT_ROOT, 'scripts/validate-mermaid.js'));
const { sanitizeIdentifier, sanitizeRelativePath } = require(path.join(PROJECT_ROOT, 'scripts/sanitize-input.js'));

describe('Tier 2: Empty Inputs & Extreme Sizes', () => {

  test('TC-T2-LIM-01: scanText handles empty strings and non-string inputs gracefully', () => {
    const emptyRes = scanText('');
    assert.strictEqual(emptyRes.clean, true);
    assert.strictEqual(emptyRes.findings.length, 0);

    const nullRes = scanText(null);
    assert.strictEqual(nullRes.clean, true);
    assert.strictEqual(nullRes.maskedText, '');
  });

  test('TC-T2-LIM-02: validateMermaidContent rejects empty and comment-only diagrams', () => {
    assert.strictEqual(validateMermaidContent('').valid, false);
    assert.strictEqual(validateMermaidContent('   \n  ').valid, false);
    assert.strictEqual(validateMermaidContent('%% only a comment\n%% second comment').valid, false);
  });

  test('TC-T2-LIM-03: sanitizeIdentifier truncates >128 char inputs and handles empty strings', () => {
    assert.strictEqual(sanitizeIdentifier(''), '');
    assert.strictEqual(sanitizeIdentifier(undefined), '');
    const longStr = 'a'.repeat(500);
    const sanitized = sanitizeIdentifier(longStr);
    assert.strictEqual(sanitized.length, 128);
  });

  test('TC-T2-LIM-04: sanitizeRelativePath rejects empty or whitespace-only paths', () => {
    assert.throws(() => sanitizeRelativePath('', PROJECT_ROOT), /Empty or non-string path/);
    assert.throws(() => sanitizeRelativePath('   ', PROJECT_ROOT), /Empty or non-string path/);
  });

  test('TC-T2-LIM-05: scanText processes large 5,000-line markdown document within 500ms', () => {
    const largeDoc = Array.from({ length: 5000 }, (_, i) => `Line ${i}: Clean architectural specification text.`).join('\n');
    const start = Date.now();
    const res = scanText(largeDoc);
    const elapsed = Date.now() - start;
    assert.strictEqual(res.clean, true);
    assert.ok(elapsed < 1000, `Expected <1000ms for 5000 lines, took ${elapsed}ms`);
  });

});
