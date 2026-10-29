/**
 * Tier 2 - Boundary & Corner Cases: Malformed Inputs & Missing Paths
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT, TestContext } = require('../helpers/test-context.js');
const path = require('path');

const { validateGeneratedOutput } = require(path.join(PROJECT_ROOT, 'scripts/validate-output.js'));
const { validateSkillStructure } = require(path.join(PROJECT_ROOT, 'scripts/validate-structure.js'));
const { loadState } = require(path.join(PROJECT_ROOT, 'scripts/wizard-state.js'));

describe('Tier 2: Malformed Inputs & Non-Existent Directories', () => {

  test('TC-T2-MAL-01: validateGeneratedOutput reports invalid on non-existent docs directory', () => {
    const res = validateGeneratedOutput('/tmp/non-existent-architect-dir-999999');
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors[0].includes('does not exist'));
  });

  test('TC-T2-MAL-02: validateSkillStructure detects missing and 0-byte files in custom root', () => {
    const ctx = new TestContext('malformed-struct');
    ctx.setup();
    try {
      ctx.createFile('SKILL.md', ''); // 0-byte file
      const res = validateSkillStructure(ctx.baseDir);
      assert.strictEqual(res.valid, false);
      assert.ok(res.empty.includes('SKILL.md'), 'Must flag 0-byte SKILL.md as empty');
      assert.ok(res.missing.includes('skill.yaml'), 'Must flag missing skill.yaml');
    } finally {
      ctx.cleanup();
    }
  });

  test('TC-T2-MAL-03: loadState returns null when state file does not exist', () => {
    const res = loadState('/tmp/non-existent-wizard-state-99999.json');
    assert.strictEqual(res, null);
  });

});
