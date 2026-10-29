/**
 * Tier 1 - Feature Coverage: Zero-Dependency Utility Scripts
 * Verifies exports and functional contracts of all 10 Node.js scripts in scripts/.
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT, TestContext } = require('../helpers/test-context.js');
const path = require('path');

describe('Tier 1: Zero-Dependency Utility Scripts Subsystem', () => {

  test('TC-T1-SCR-01: egress-guard.js activates zero-egress interception and exports status', () => {
    const guard = require(path.join(PROJECT_ROOT, 'scripts/egress-guard.js'));
    assert.strictEqual(guard.isZeroEgressActive, true, 'isZeroEgressActive must be true');
    assert.strictEqual(typeof guard.installEgressGuard, 'function');
  });

  test('TC-T1-SCR-02: sanitize-input.js sanitizes identifiers and blocks credential paths', () => {
    const sanitizer = require(path.join(PROJECT_ROOT, 'scripts/sanitize-input.js'));
    assert.strictEqual(sanitizer.sanitizeIdentifier('My Project!!@#'), 'My-Project');
    assert.strictEqual(sanitizer.isBlockedCredentialPath('.env'), true);
    assert.strictEqual(sanitizer.isBlockedCredentialPath('docs/PRD.md'), false);
  });

  test('TC-T1-SCR-03: secret-scan.js loads redaction rules and masks sensitive tokens', () => {
    const scanner = require(path.join(PROJECT_ROOT, 'scripts/secret-scan.js'));
    const rules = scanner.loadRules();
    assert.ok(Array.isArray(rules) && rules.length >= 10, 'Must load at least 10 redaction rules');
    const res = scanner.scanText('token = ghp_1234567890abcdefghijklmnopqrstuvwxyz');
    assert.strictEqual(res.clean, false);
    assert.ok(res.maskedText.includes('[REDACTED:GITHUB_TOKEN]'));
  });

  test('TC-T1-SCR-04: validate-mermaid.js validates diagram headers and braces', () => {
    const mermaid = require(path.join(PROJECT_ROOT, 'scripts/validate-mermaid.js'));
    const valid = mermaid.validateMermaidContent('sequenceDiagram\n  A->>B: ping');
    assert.strictEqual(valid.valid, true);
    const invalid = mermaid.validateMermaidContent('unknownHeader\n  A-->B');
    assert.strictEqual(invalid.valid, false);
  });

  test('TC-T1-SCR-05: validate-structure.js confirms 100% blueprint presence', () => {
    const struct = require(path.join(PROJECT_ROOT, 'scripts/validate-structure.js'));
    const report = struct.validateSkillStructure(PROJECT_ROOT);
    assert.strictEqual(report.valid, true);
    assert.strictEqual(report.missing.length, 0);
  });

  test('TC-T1-SCR-06: audit-log.js appends scrubbed JSONL entries without leaking secrets', () => {
    const logger = require(path.join(PROJECT_ROOT, 'scripts/audit-log.js'));
    const ctx = new TestContext('audit-log');
    ctx.setup();
    try {
      const logFile = path.join(ctx.baseDir, '.architect-audit.log');
      const entry = logger.appendAuditEntry('TEST_EVENT', { key: 'AKIAIOSFODNN7EXAMPLE' }, logFile);
      assert.strictEqual(entry.details.key, '[REDACTED:AWS_KEY]');
      assert.strictEqual(ctx.fileExists('.architect-audit.log'), true);
    } finally {
      ctx.cleanup();
    }
  });

  test('TC-T1-SCR-07: doctor.js reports full environment and skill health', () => {
    const doctor = require(path.join(PROJECT_ROOT, 'scripts/doctor.js'));
    const res = doctor.runDoctor();
    assert.strictEqual(res.healthy, true);
    assert.strictEqual(res.zeroEgressActive, true);
  });

});
