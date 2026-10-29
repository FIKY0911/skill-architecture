/**
 * Tier 3 - Cross-Feature Combinations: Secret Detection -> Redaction -> Output Validation Pipeline
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT, TestContext } = require('../helpers/test-context.js');
const path = require('path');

const { scanFileOrDirectory } = require(path.join(PROJECT_ROOT, 'scripts/secret-scan.js'));
const { validateGeneratedOutput } = require(path.join(PROJECT_ROOT, 'scripts/validate-output.js'));

describe('Tier 3: Secret Redaction & Output Verification Pipeline', () => {

  test('TC-T3-SEC-01: Dirty output fails validation initially, gets scrubbed via --mask, and passes validation', () => {
    const ctx = new TestContext('redaction-pipeline');
    ctx.setup();
    try {
      const docsDir = ctx.createDir('docs');
      for (const sub of ['requirements', 'architecture', 'system-design', 'diagrams', 'ui']) {
        ctx.createDir(`docs/${sub}`);
      }

      ctx.createFile(
        'docs/system-design/caching-lifecycle.md',
        '# Redis Config\nConnection: redis://default:MyLeakedPass999@redis.internal:6379\nAWS_KEY=AKIAIOSFODNN7EXAMPLE\n'
      );

      // 1. Output validation must fail before masking
      const beforeVal = validateGeneratedOutput(docsDir);
      assert.strictEqual(beforeVal.valid, false, 'Must fail output validation when unmasked secrets exist');
      assert.strictEqual(beforeVal.secretScanClean, false);

      // 2. Run secret-scan with mask: true
      const maskRes = scanFileOrDirectory(docsDir, { mask: true });
      assert.strictEqual(maskRes.clean, false);
      assert.strictEqual(maskRes.filesWithSecrets[0].masked, true);

      // 3. Re-validate output after masking
      const afterVal = validateGeneratedOutput(docsDir);
      assert.strictEqual(afterVal.valid, true, 'Must pass output validation after secrets are masked');
      assert.strictEqual(afterVal.secretScanClean, true);

      const scrubbedContent = ctx.readFile('docs/system-design/caching-lifecycle.md');
      assert.ok(scrubbedContent.includes('[REDACTED:DB_PASSWORD]'));
      assert.ok(scrubbedContent.includes('[REDACTED:AWS_KEY]'));
    } finally {
      ctx.cleanup();
    }
  });

});
