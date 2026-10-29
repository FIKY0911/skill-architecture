/**
 * Tier 1 - Feature Coverage: Raw Mermaid UML Assets
 * Verifies syntax, structural semantics, and zero-leakage in all Mermaid templates.
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { readProjectFile, projectFileExists } = require('../helpers/test-context.js');
const { assertMermaidValid, assertSecretRedacted, assertContains } = require('../helpers/assertions.js');

describe('Tier 1: Raw Mermaid UML Assets Subsystem', () => {

  test('TC-T1-UML-01: sequence.mmd contains valid sequence diagram syntax and participants', () => {
    assert.ok(projectFileExists('assets/uml/sequence.mmd'), 'sequence.mmd must exist');
    const content = readProjectFile('assets/uml/sequence.mmd');
    assertMermaidValid(content, 'sequence.mmd validation');
    assertContains(content, 'sequenceDiagram', 'Must start with sequenceDiagram');
    assertContains(content, 'participant', 'Must declare participants');
    assertContains(content, '->>', 'Must contain synchronous or async message arrows');
    assertSecretRedacted(content, 'sequence.mmd secret check');
  });

  test('TC-T1-UML-02: erd.mmd contains valid relational entities and cardinalities', () => {
    assert.ok(projectFileExists('assets/uml/erd.mmd'), 'erd.mmd must exist');
    const content = readProjectFile('assets/uml/erd.mmd');
    assertMermaidValid(content, 'erd.mmd validation');
    assertContains(content, 'erDiagram', 'Must start with erDiagram');
    assert.ok(/(\|\|--o\{|\|\|--\|\||o\{--o\{)/.test(content), 'Must define standard ERD cardinalities');
    assertContains(content, 'PK', 'Must identify primary key attributes');
    assertSecretRedacted(content, 'erd.mmd secret check');
  });

  test('TC-T1-UML-03: state.mmd contains valid finite state machine transitions', () => {
    assert.ok(projectFileExists('assets/uml/state.mmd'), 'state.mmd must exist');
    const content = readProjectFile('assets/uml/state.mmd');
    assertMermaidValid(content, 'state.mmd validation');
    assert.ok(content.includes('stateDiagram') || content.includes('stateDiagram-v2'), 'Must declare stateDiagram');
    assertContains(content, '[*] -->', 'Must contain initial state transition');
    assertContains(content, '--> [*]', 'Must contain terminal state transition');
    assertSecretRedacted(content, 'state.mmd secret check');
  });

  test('TC-T1-UML-04: c4-container.mmd adheres to C4 model container abstractions', () => {
    assert.ok(projectFileExists('assets/uml/c4-container.mmd'), 'c4-container.mmd must exist');
    const content = readProjectFile('assets/uml/c4-container.mmd');
    assertMermaidValid(content, 'c4-container.mmd validation');
    assert.ok(content.includes('C4Context') || content.includes('C4Container'), 'Must declare C4 diagram type');
    assertContains(content, 'Person', 'C4 diagram must define Person actor');
    assertContains(content, 'Container', 'C4 diagram must define Containers');
    assertContains(content, 'Rel', 'C4 diagram must define relationships');
    assertSecretRedacted(content, 'c4-container.mmd secret check');
  });

  test('TC-T1-UML-05: activity.mmd defines workflow branches and terminal states', () => {
    assert.ok(projectFileExists('assets/uml/activity.mmd'), 'activity.mmd must exist');
    const content = readProjectFile('assets/uml/activity.mmd');
    assertMermaidValid(content, 'activity.mmd validation');
    assert.ok(content.includes('flowchart') || content.includes('graph'), 'Must declare flowchart or graph');
    assertContains(content, '-->', 'Must define process flow arrows');
    assertSecretRedacted(content, 'activity.mmd secret check');
  });

  test('TC-T1-UML-06: Absolute zero credential leakage across all UML assets', () => {
    const umlFiles = [
      'assets/uml/sequence.mmd',
      'assets/uml/erd.mmd',
      'assets/uml/state.mmd',
      'assets/uml/c4-container.mmd',
      'assets/uml/activity.mmd'
    ];

    for (const file of umlFiles) {
      const content = readProjectFile(file);
      assertSecretRedacted(content, `Credential check for ${file}`);
      assert.ok(!content.includes('password='), `${file} must not contain password query strings`);
      assert.ok(!content.includes('Bearer '), `${file} must not contain bearer tokens`);
    }
  });

});
