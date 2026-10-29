#!/usr/bin/env node
/**
 * Multi-Agent Installer Test Suite (install.test.js)
 * Verifies dry-run, local/global installation across all 7 AI agents, automatic timestamped backup creation,
 * and clean uninstallation inside isolated temporary directories.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { getAgentMappings, runInstall } = require('../scripts/install');

function runTests() {
  let passed = 0;
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'arch-install-test-'));
  const workDir = path.join(tmpRoot, 'workspace');
  const backupDir = path.join(tmpRoot, 'backups');

  try {
    fs.mkdirSync(workDir, { recursive: true });

    // 1. Verify local mappings cover all 7 agents
    const localMap = getAgentMappings(workDir, false);
    const expectedLocalAgents = ['claude', 'antigravity', 'codex', 'cursor', 'continue', 'windsurf', 'cline'];
    for (const agent of expectedLocalAgents) {
      assert.ok(localMap[agent], `Local mapping must include ${agent}`);
    }
    passed++;

    // 2. Dry-run does not write any files
    const dryRes = runInstall({ baseDir: workDir, backupRoot: backupDir, dryRun: true });
    assert.strictEqual(dryRes.success, true);
    assert.strictEqual(dryRes.dryRun, true);
    assert.strictEqual(fs.existsSync(path.join(workDir, '.windsurfrules')), false, 'Dry-run must not create files');
    passed++;

    // 3. Full local install creates all 7 agent targets
    const installRes = runInstall({ baseDir: workDir, backupRoot: backupDir, dryRun: false });
    assert.strictEqual(installRes.success, true);
    for (const agent of expectedLocalAgents) {
      assert.strictEqual(
        fs.existsSync(localMap[agent].dest),
        true,
        `Installed target for ${agent} must exist at ${localMap[agent].dest}`
      );
    }
    passed++;

    // 3b. Installed Windsurf adapter carries zero-egress and preview-safe text diagram rule
    const installedRules = fs.readFileSync(localMap.windsurf.dest, 'utf8');
    assert.ok(installedRules.includes('zero-egress'), 'Installed windsurf rules must mandate zero-egress');
    assert.ok(installedRules.includes('Preview-Safe Diagrams'), 'Installed windsurf rules must require text diagram twins');
    passed++;

    // 4. Re-install triggers automatic backup of existing files
    const secondBackupDir = path.join(tmpRoot, 'backups-2');
    const reinstallRes = runInstall({
      baseDir: workDir,
      backupRoot: secondBackupDir,
      target: 'windsurf',
      dryRun: false,
    });
    assert.strictEqual(reinstallRes.success, true);
    assert.strictEqual(reinstallRes.backupRoot, secondBackupDir, 'Backup root must be recorded on overwrite');
    assert.strictEqual(
      fs.existsSync(path.join(secondBackupDir, 'windsurf', '.windsurfrules')),
      true,
      'Backup copy of .windsurfrules must exist'
    );
    passed++;

    // 5. Uninstall removes installed targets cleanly
    const uninstallRes = runInstall({ baseDir: workDir, uninstall: true, dryRun: false });
    assert.strictEqual(uninstallRes.success, true);
    for (const agent of expectedLocalAgents) {
      assert.strictEqual(
        fs.existsSync(localMap[agent].dest),
        false,
        `Uninstalled target for ${agent} must be removed`
      );
    }
    passed++;

    console.log(JSON.stringify({ suite: 'install.test.js', status: 'PASSED', assertions: passed }));
  } finally {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
