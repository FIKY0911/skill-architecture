#!/usr/bin/env node
/**
 * Preview-Safe Text Diagram Test Suite (diagrams.test.js)
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { validateTextDiagramContent, validateTextDiagramPath, findMissingTwins } = require('../scripts/validate-diagrams');
const { validateGeneratedOutput } = require('../scripts/validate-output');
const { validateMermaidContent } = require('../scripts/validate-mermaid');

function runTests() {
  let passed = 0;
  const root = path.resolve(__dirname, '..');
  const mdDir = path.join(root, 'assets/diagrams');
  const mmdDir = path.join(root, 'assets/uml');

  // 1. No .md diagram assets are required now
  const rep = validateTextDiagramPath(mdDir);
  assert.strictEqual(rep.checkedCount, 0, 'Expected 0 text diagram assets after removal');
  assert.strictEqual(rep.valid, true, JSON.stringify(rep.results.filter((r) => !r.valid)));
  // No missing twin check needed as .md files are not required
  passed++;

  // 2. Negative cases
  assert.strictEqual(validateTextDiagramContent('').valid, false);
  assert.strictEqual(validateTextDiagramContent('# T\n```mermaid\nflowchart TD\nA-->B\nB-->C\n```\n').valid, false, 'Mermaid-only must be rejected');
  assert.strictEqual(validateTextDiagramContent('# T\n```text\na\nb\nc\n').valid, false, 'Unclosed fence');
  assert.strictEqual(validateTextDiagramContent('# T\n```text\na\n```\n').valid, false, 'Too short');
  assert.strictEqual(validateTextDiagramContent('no title\n```text\na\nb\nc\n```\n').valid, false, 'Missing title');
  const leaked = '# T\n```text\npostgres://u:' + 'hunter22pw' + '@db.internal\nb\nc\n```\n';
  assert.strictEqual(validateTextDiagramContent(leaked).valid, false, 'Credential must be rejected');
  assert.strictEqual(validateTextDiagramContent('# T\n```text\na\nb\nc\n```\n').valid, true);
  passed++;

  // 3. Missing twin detection and output validator integration
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-diag-test-'));
  try {
    const docs = path.join(tmp, 'docs');
    fs.mkdirSync(path.join(docs, 'diagrams'), { recursive: true });
    fs.writeFileSync(path.join(docs, 'diagrams/flow.mmd'), 'flowchart TD\n A-->B\n', 'utf8');
    let out = validateGeneratedOutput(docs);
    assert.strictEqual(out.valid, true);
    assert.ok(out.warnings.some((w) => w.includes('flow.md')), 'Missing twin must warn');
    fs.writeFileSync(path.join(docs, 'diagrams/flow.md'), '# Flow\n```text\nA\n|\nB\n```\n', 'utf8');
    out = validateGeneratedOutput(docs);
    assert.strictEqual(out.valid, true);
    assert.ok(!out.warnings.some((w) => w.includes('flow.md')));
    fs.writeFileSync(path.join(docs, 'diagrams/flow.md'), 'broken', 'utf8');
    assert.strictEqual(validateGeneratedOutput(docs).valid, false, 'Invalid twin must fail');
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
  passed++;

  // 4. Mermaid ER cardinality braces are not counted as blocks, real imbalance still caught
  assert.strictEqual(validateMermaidContent('erDiagram\n A ||--o{ B : "has"\n B }o--|| A : "of"\n').valid, true);
  assert.strictEqual(validateMermaidContent('erDiagram\n A {\n  int id\n').valid, false);
  passed++;

  console.log(JSON.stringify({ suite: 'diagrams.test.js', status: 'PASSED', assertions: passed }));
}

if (require.main === module) runTests();
module.exports = { runTests };
