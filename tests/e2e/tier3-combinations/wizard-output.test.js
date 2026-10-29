/**
 * Tier 3 - Cross-Feature Combinations: Wizard State -> Output Hydration -> Output Validation Pipeline
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT, TestContext, readProjectFile } = require('../helpers/test-context.js');
const path = require('path');

const { initState, updateState, finalizeState } = require(path.join(PROJECT_ROOT, 'scripts/wizard-state.js'));
const { validateGeneratedOutput } = require(path.join(PROJECT_ROOT, 'scripts/validate-output.js'));
const { appendAuditEntry } = require(path.join(PROJECT_ROOT, 'scripts/audit-log.js'));

describe('Tier 3: Wizard State to Output Generation & Validation Pipeline', () => {

  test('TC-T3-WIZ-01: Full wizard session initializes state, hydrates templates, logs audit, and validates cleanly', () => {
    const ctx = new TestContext('wizard-pipeline');
    ctx.setup();
    try {
      const docsDir = ctx.createDir('docs');
      const stateFile = path.join(docsDir, '.architect-wizard-state.json');
      const auditFile = path.join(docsDir, '.architect-audit.log');

      // 1. Initialize wizard state with Neubrutalism & Tailwind+shadcn
      const st = initState(
        {
          project: 'Creator Tip Platform',
          requirements: ['PRD', 'BRD', 'SRD'],
          architecture: 'clean-architecture',
          ui_library: 'tailwind-shadcn',
          fe_aesthetic: 'neubrutalism',
        },
        stateFile
      );
      assert.strictEqual(st.project_name, 'Creator-Tip-Platform');
      assert.strictEqual(st.selections.fe_aesthetic, 'neubrutalism');

      // 2. Hydrate output subdirectories from templates
      for (const sub of ['requirements', 'architecture', 'system-design', 'diagrams', 'ui']) {
        ctx.createDir(`docs/${sub}`);
      }
      const prdTemplate = readProjectFile('assets/output/requirements/PRD.template.md');
      const seqTemplate = readProjectFile('assets/uml/sequence.mmd');
      ctx.createFile('docs/requirements/PRD.md', prdTemplate.replace(/\{\{PROJECT_NAME\}\}/g, st.project_name));
      ctx.createFile('docs/diagrams/checkout.mmd', seqTemplate);

      // 3. Finalize state and record audit log
      updateState({ current_stage: 4 }, stateFile);
      const finalSt = finalizeState(stateFile);
      assert.strictEqual(finalSt.status, 'completed');
      appendAuditEntry('WIZARD_COMPLETED', { project: st.project_name }, auditFile);

      // 4. Validate generated output
      const validation = validateGeneratedOutput(docsDir);
      assert.strictEqual(validation.valid, true, `Expected valid output, errors: ${validation.errors.join('; ')}`);
      assert.strictEqual(validation.secretScanClean, true);
      assert.strictEqual(validation.mermaidDiagramsChecked, 1);
    } finally {
      ctx.cleanup();
    }
  });

});
