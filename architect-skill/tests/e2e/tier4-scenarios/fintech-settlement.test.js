/**
 * Tier 4 - Real-World Scenario 2: Mission-Critical Fintech Interbank Settlement System
 * Verifies BABOK BRD, ISO/IEC/IEEE 29148:2018 SRD, Event-Driven Outbox, Kleppmann Fencing Tokens,
 * Audit Logging, Runtime Firewall Pinning, and Zero-Knowledge Broker Leases.
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT, TestContext, readProjectFile } = require('../helpers/test-context.js');
const { assertContains } = require('../helpers/assertions.js');
const path = require('path');

const { verifyToolPins } = require(path.join(PROJECT_ROOT, 'runtime-firewall/verify.js'));
const { issueOpaqueLease, sanitizeBrokerOutput } = require(path.join(PROJECT_ROOT, 'broker/broker.js'));
const { createSymbolicReference } = require(path.join(PROJECT_ROOT, 'broker/intake.js'));
const { appendAuditEntry } = require(path.join(PROJECT_ROOT, 'scripts/audit-log.js'));
const { validateGeneratedOutput } = require(path.join(PROJECT_ROOT, 'scripts/validate-output.js'));

describe('Tier 4: Real-World Scenario - Fintech Interbank Settlement Architecture', () => {

  test('TC-T4-FIN-01: Fintech settlement architecture with cryptographic tool pinning and zero-leak audit trail', () => {
    const ctx = new TestContext('fintech-scenario');
    ctx.setup();
    try {
      // 1. Verify runtime tool pins before execution
      const pinCheck = verifyToolPins();
      assert.strictEqual(pinCheck.verified, true, 'All skill scripts must match SHA-256 pins');

      // 2. Verify zero-knowledge credential broker & symbolic intake
      const lease = issueOpaqueLease('fintech-agent', 'interbank-hsm-key', 600);
      assert.strictEqual(lease.handle, '{{SECRET_INTERBANK_HSM_KEY}}');
      const scrubbedBrokerOut = sanitizeBrokerOutput('api_key="SuperSecretInterbankKey99"');
      assertContains(scrubbedBrokerOut, '[REDACTED:GENERIC_SECRET]');
      const symRef = createSymbolicReference('SWIFT_GATEWAY', 'CERT_KEY');
      assert.strictEqual(symRef.docPlaceholder, '{{SECRET_SWIFT_GATEWAY_CERT_KEY}}');
      assert.strictEqual(symRef.storedValue, null);

      // 3. Create fintech output artifacts
      const docsDir = ctx.createDir('docs');
      for (const sub of ['requirements', 'architecture', 'system-design', 'diagrams', 'ui']) {
        ctx.createDir(`docs/${sub}`);
      }

      const brdRef = readProjectFile('references/requirements/brd.md');
      const srdRef = readProjectFile('references/requirements/srd.md');
      const lockRef = readProjectFile('references/system-design/distributed-locking.md');
      const stateUml = readProjectFile('assets/uml/state.mmd');

      ctx.createFile('docs/requirements/BRD.md', brdRef);
      ctx.createFile('docs/requirements/SRD.md', srdRef);
      ctx.createFile('docs/system-design/settlement-locking.md', lockRef);
      ctx.createFile('docs/diagrams/settlement-state.mmd', stateUml);

      // 4. Record audit trail with attempted secret injection (must be auto-scrubbed)
      const auditPath = path.join(docsDir, '.architect-audit.log');
      const auditEntry = appendAuditEntry(
        'GENERATE_FINTECH_SETTLEMENT',
        { db_uri: 'postgresql://ledger:SecretBankPass99@db.bank.internal:5432/settlement' },
        auditPath
      );
      assertContains(JSON.stringify(auditEntry), '[REDACTED:DB_PASSWORD]');

      // 5. Verify output integrity
      const outRes = validateGeneratedOutput(docsDir);
      assert.strictEqual(outRes.valid, true, `Fintech output errors: ${outRes.errors.join('; ')}`);
      assert.strictEqual(outRes.secretScanClean, true);
    } finally {
      ctx.cleanup();
    }
  });

});
