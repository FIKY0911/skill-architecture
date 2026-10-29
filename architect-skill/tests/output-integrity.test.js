#!/usr/bin/env node
/**
 * Repository Structure, Mermaid Syntax, Wizard State & Output Integrity Test Suite (output-integrity.test.js)
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { validateSkillStructure } = require('../scripts/validate-structure');
const { validateMermaidContent, validateMermaidPath } = require('../scripts/validate-mermaid');
const { validateGeneratedOutput } = require('../scripts/validate-output');
const { initState, updateState, finalizeState } = require('../scripts/wizard-state');
const { runDoctor } = require('../scripts/doctor');
const { verifyToolPins } = require('../runtime-firewall/verify');

function runTests() {
  let passed = 0;

  // 1. Validate repository structure
  const structRes = validateSkillStructure();
  assert.strictEqual(
    structRes.valid,
    true,
    `Structure validation failed. Missing: ${structRes.missing.join(', ')}; Empty: ${structRes.empty.join(', ')}`
  );
  passed++;

  // 2. Validate raw Mermaid assets in assets/uml/
  const umlPath = path.resolve(__dirname, '../assets/uml');
  const umlRes = validateMermaidPath(umlPath);
  assert.strictEqual(umlRes.valid, true, 'All assets/uml/*.mmd must be valid');
  assert.strictEqual(umlRes.checkedCount, 5, 'Expected 5 Mermaid UML assets');
  passed++;

  // 3. Validate valid & invalid Mermaid fixtures
  const validFixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/mermaid/sample.mmd'), 'utf8');
  const invalidFixture = fs.readFileSync(path.resolve(__dirname, 'fixtures/mermaid/invalid.mmd'), 'utf8');
  assert.strictEqual(validateMermaidContent(validFixture).valid, true, 'sample.mmd fixture must be valid');
  assert.strictEqual(validateMermaidContent(invalidFixture).valid, false, 'invalid.mmd fixture must be rejected');
  passed++;

  // 4. Test wizard state lifecycle and mock generated output validation
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-output-test-'));
  try {
    const mockDocs = path.join(tmpRoot, 'docs');
    const stateFile = path.join(mockDocs, '.architect-wizard-state.json');
    const wizardFixture = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'fixtures/wizard/mock-input.json'), 'utf8')
    );

    const init = initState(
      {
        project: wizardFixture.project_name,
        requirements: wizardFixture.selections.requirements,
        architecture: wizardFixture.selections.architecture_style,
        ui_library: wizardFixture.selections.ui_library,
        fe_aesthetic: wizardFixture.selections.fe_aesthetic,
      },
      stateFile
    );
    assert.strictEqual(init.status, 'in_progress');
    assert.strictEqual(init.selections.fe_aesthetic, 'neubrutalism');

    updateState({ current_stage: 3 }, stateFile);
    const done = finalizeState(stateFile);
    assert.strictEqual(done.status, 'completed');
    passed++;

    // Populate standard subdirectories and valid Mermaid diagram in mockDocs
    for (const sub of ['requirements', 'architecture', 'system-design', 'diagrams', 'ui']) {
      fs.mkdirSync(path.join(mockDocs, sub), { recursive: true });
    }
    fs.writeFileSync(path.join(mockDocs, 'requirements/PRD.md'), '# PRD\nClean content without secrets.\n', 'utf8');
    fs.writeFileSync(path.join(mockDocs, 'diagrams/flow.mmd'), validFixture, 'utf8');

    const outReport = validateGeneratedOutput(mockDocs);
    assert.strictEqual(outReport.valid, true, `Output validation failed: ${outReport.errors.join('; ')}`);
    assert.strictEqual(outReport.secretScanClean, true);
    assert.strictEqual(outReport.mermaidDiagramsChecked, 1);
    passed++;
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }

  // 5. Verify doctor and tool pins
  const docRes = runDoctor();
  assert.strictEqual(docRes.healthy, true, 'Doctor check must report healthy: true');
  const pinRes = verifyToolPins();
  assert.strictEqual(pinRes.verified, true, 'Tool pins SHA-256 verification must pass');
  passed++;

  console.log(JSON.stringify({ suite: 'output-integrity.test.js', status: 'PASSED', assertions: passed }));
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
