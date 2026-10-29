/**
 * Tier 3 - Cross-Feature Combinations: Multi-Agent Installer -> Symlink/Copy -> Automated Backup Pipeline
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { PROJECT_ROOT, TestContext } = require('../helpers/test-context.js');
const path = require('path');

const { runInstall, getAgentMappings } = require(path.join(PROJECT_ROOT, 'scripts/install.js'));

describe('Tier 3: Multi-Agent Installer & Backup Lifecycle Pipeline', () => {

  test('TC-T3-INS-01: Local and Global installation, overwrite backup, and clean uninstallation', () => {
    const ctx = new TestContext('install-pipeline');
    ctx.setup();
    try {
      const projectDir = ctx.createDir('project');
      const homeDir = ctx.createDir('home');
      const backupDir = path.join(ctx.baseDir, 'backups');

      // 1. Pre-populate a custom .windsurfrules file to trigger backup
      ctx.createFile('project/.windsurfrules', '# Legacy user rule');

      // 2. Run local install across all 7 agents
      const localRes = runInstall({ baseDir: projectDir, backupRoot: backupDir, global: false });
      assert.strictEqual(localRes.success, true);
      assert.strictEqual(localRes.backupRoot, backupDir, 'Backup root must be active due to pre-existing .windsurfrules');
      assert.strictEqual(ctx.fileExists('backups/windsurf/.windsurfrules'), true, 'Pre-existing file must be backed up');

      const localMappings = getAgentMappings(projectDir, false);
      for (const agent of Object.keys(localMappings)) {
        assert.strictEqual(ctx.fileExists(localMappings[agent].dest), true, `Local ${agent} target must exist`);
      }

      // 3. Run global install into simulated home directory
      const globalRes = runInstall({ baseDir: homeDir, backupRoot: path.join(ctx.baseDir, 'global-bk'), global: true });
      assert.strictEqual(globalRes.success, true);
      const globalMappings = getAgentMappings(homeDir, true);
      for (const agent of Object.keys(globalMappings)) {
        assert.strictEqual(ctx.fileExists(globalMappings[agent].dest), true, `Global ${agent} target must exist`);
      }

      // 4. Uninstall local targets
      const unRes = runInstall({ baseDir: projectDir, uninstall: true });
      assert.strictEqual(unRes.success, true);
      assert.strictEqual(ctx.fileExists('project/.windsurfrules'), false);
    } finally {
      ctx.cleanup();
    }
  });

});
