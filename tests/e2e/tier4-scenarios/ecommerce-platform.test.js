/**
 * Tier 4 - Real-World Scenario 1: High-Traffic B2C E-Commerce & Creator Monetization Platform
 * Exercises complete end-to-end blueprint generation following struktur-output-pengguna.txt.
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT, TestContext, readProjectFile } = require('../helpers/test-context.js');
const {
  assertMermaidValid,
  assertSecretRedacted,
  assertContains,
  assertValidJson,
  assertJsonSchema,
  assertZeroEgress,
  assertDirectoryTree,
} = require('../helpers/assertions.js');
const http = require('http');
const path = require('path');

const { initState, finalizeState } = require(path.join(PROJECT_ROOT, 'scripts/wizard-state.js'));
const { validateGeneratedOutput } = require(path.join(PROJECT_ROOT, 'scripts/validate-output.js'));

describe('Tier 4: Real-World Scenario - E-Commerce & Creator Monetization Platform', () => {

  test('TC-T4-ECO-01: Complete E-Commerce architecture blueprint generation and verification', () => {
    const ctx = new TestContext('ecommerce-scenario');
    ctx.setup();
    try {
      const docsDir = ctx.createDir('docs');
      const statePath = path.join(docsDir, '.architect-wizard-state.json');

      // 1. Initialize & finalize wizard
      initState(
        {
          project: 'creator-commerce-platform',
          requirements: ['PRD', 'BRD', 'SRD'],
          architecture: 'modular-monolith',
          ui_library: 'tailwind-shadcn',
          fe_aesthetic: 'neubrutalism',
        },
        statePath
      );
      const finalState = finalizeState(statePath);
      assertJsonSchema(finalState, {
        required: ['schema_version', 'status', 'tier', 'project_name', 'selections'],
        properties: {
          schema_version: { type: 'string' },
          status: { type: 'string' },
          project_name: { type: 'string' },
          selections: { type: 'object' },
        },
      });

      // 2. Generate full hierarchy per struktur-output-pengguna.txt
      ctx.createFile('docs/README.md', readProjectFile('assets/output/docs-index.template.md'));
      ctx.createFile('docs/.architect-manifest.json', readProjectFile('assets/output/manifest.template.json'));
      ctx.createFile('docs/requirements/PRD.md', readProjectFile('assets/output/requirements/PRD.template.md'));
      ctx.createFile('docs/requirements/BRD.md', readProjectFile('assets/output/requirements/BRD.template.md'));
      ctx.createFile('docs/requirements/SRD.md', readProjectFile('assets/output/requirements/SRD.template.md'));
      ctx.createFile('docs/architecture/decisions/ADR-001-modular-monolith.md', readProjectFile('assets/output/adr/ADR-000.template.md'));
      ctx.createFile('docs/architecture/modular-monolith/layer-rules.md', readProjectFile('assets/output/architecture/layer-rules.template.md'));
      ctx.createFile('docs/architecture/modular-monolith/directory-tree.md', readProjectFile('assets/output/architecture/directory-tree.template.md'));
      ctx.createFile('docs/architecture/modular-monolith/dependency-injection.md', readProjectFile('assets/output/architecture/dependency-injection.template.md'));
      ctx.createFile('docs/system-design/high-throughput/caching-lifecycle.md', readProjectFile('assets/output/system-design/caching-lifecycle.template.md'));
      ctx.createFile('docs/system-design/high-throughput/concurrency-locking.md', readProjectFile('assets/output/system-design/concurrency-locking.template.md'));
      ctx.createFile('docs/diagrams/c4/c4-container.mmd', readProjectFile('assets/uml/c4-container.mmd'));
      ctx.createFile('docs/diagrams/erd/domain-erd.mmd', readProjectFile('assets/uml/erd.mmd'));
      ctx.createFile('docs/diagrams/sequence/checkout.mmd', readProjectFile('assets/uml/sequence.mmd'));
      ctx.createFile('docs/ui/tailwind-shadcn/setup-guide.md', readProjectFile('assets/output/ui/setup-guide.template.md'));
      ctx.createFile('docs/ui/tailwind-shadcn/theme-tokens.md', readProjectFile('assets/output/ui/theme-tokens.template.md'));
      ctx.createFile('docs/ui/tailwind-shadcn/component-registry.md', readProjectFile('assets/output/ui/component-registry.template.md'));

      // 3. Validate output bundle and directory tree
      assertDirectoryTree(docsDir, [
        'README.md',
        '.architect-manifest.json',
        'requirements/PRD.md',
        'requirements/BRD.md',
        'requirements/SRD.md',
        'diagrams/c4/c4-container.mmd',
        'diagrams/erd/domain-erd.mmd',
        'diagrams/sequence/checkout.mmd',
        'ui/tailwind-shadcn/setup-guide.md',
      ]);

      const report = validateGeneratedOutput(docsDir);
      assert.strictEqual(report.valid, true, `Validation errors: ${report.errors.join('; ')}`);
      assert.strictEqual(report.warnings.length, 0, `Expected 0 warnings, got: ${report.warnings.join('; ')}`);
      assert.strictEqual(report.secretScanClean, true);
      assert.strictEqual(report.mermaidDiagramsChecked, 3);

      // 4. Verify domain content & zero-egress enforcement
      assertValidJson(ctx.readFile('docs/.architect-manifest.json'));
      assertMermaidValid(ctx.readFile('docs/diagrams/erd/domain-erd.mmd'));
      assertSecretRedacted(ctx.readFile('docs/requirements/PRD.md'));
      assertContains(ctx.readFile('docs/system-design/high-throughput/concurrency-locking.md'), 'fencing');
      assertZeroEgress(() => http.get('http://127.0.0.1:9999'));
    } finally {
      ctx.cleanup();
    }
  });

});
