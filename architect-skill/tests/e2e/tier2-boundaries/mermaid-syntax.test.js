/**
 * Tier 2 - Boundary & Corner Cases: Mermaid Syntax Validation Edge Cases
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT } = require('../helpers/test-context.js');
const path = require('path');

const { validateMermaidContent } = require(path.join(PROJECT_ROOT, 'scripts/validate-mermaid.js'));

describe('Tier 2: Mermaid Syntax Edge Cases & Security Checks', () => {

  test('TC-T2-MMD-01: Rejects Mermaid diagrams with unbalanced curly braces', () => {
    const badErd = 'erDiagram\n  USERS {\n    uuid id PK\n';
    const res = validateMermaidContent(badErd);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes('Unbalanced curly braces')));
  });

  test('TC-T2-MMD-02: Rejects sequenceDiagram with unclosed alt/loop block', () => {
    const badSeq = 'sequenceDiagram\n  A->>B: Hello\n  alt Success\n    B-->>A: 200 OK';
    const res = validateMermaidContent(badSeq);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes('Unclosed control block')));
  });

  test('TC-T2-MMD-03: Rejects Mermaid diagrams containing XSS script tags or javascript: URIs', () => {
    const xssMmd = 'flowchart TD\n  A["<script>alert(1)</script>"] --> B';
    const res = validateMermaidContent(xssMmd);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes('XSS')));
  });

  test('TC-T2-MMD-04: Rejects Mermaid diagrams containing embedded credentials', () => {
    const leakedMmd = 'C4Container\n  ContainerDb(db, "DB", "postgres://user:SecretPass123@host:5432/db")';
    const res = validateMermaidContent(leakedMmd);
    assert.strictEqual(res.valid, false);
    assert.ok(res.errors.some((e) => e.includes('Credential detected')));
  });

});
