#!/usr/bin/env node
/**
 * Standalone 4-Tier Requirement-Driven E2E Test Runner (runner.js)
 * Supports --tier <1|2|3|4>, --filter <pattern>, --verbose
 */
'use strict';

require('../../scripts/egress-guard');
const fs = require('fs');
const path = require('path');
const { runAll, clearSuites } = require('./helpers/test-framework');

const TIER_DIRS = {
  '1': 'tier1-features',
  '2': 'tier2-boundaries',
  '3': 'tier3-combinations',
  '4': 'tier4-scenarios',
};

async function main() {
  const args = process.argv.slice(2);
  const tierIdx = args.indexOf('--tier');
  const filterIdx = args.indexOf('--filter');
  const selectedTier = tierIdx !== -1 ? String(args[tierIdx + 1]) : null;
  const filterPattern = filterIdx !== -1 ? args[filterIdx + 1] : null;
  const verbose = args.includes('--verbose') || true;

  clearSuites();

  const tiersToLoad = selectedTier && TIER_DIRS[selectedTier]
    ? [TIER_DIRS[selectedTier]]
    : Object.values(TIER_DIRS);

  for (const dirName of tiersToLoad) {
    const fullDir = path.join(__dirname, dirName);
    if (!fs.existsSync(fullDir)) continue;
    const files = fs.readdirSync(fullDir).filter((f) => f.endsWith('.test.js')).sort();
    for (const file of files) {
      require(path.join(fullDir, file));
    }
  }

  const summary = await runAll({ verbose, filter: filterPattern });
  console.log('\n============================================================');
  console.log(
    `E2E SUMMARY: ${summary.passed}/${summary.totalTests} passed (${summary.failed} failed) across ${summary.totalSuites} suites in ${summary.durationMs}ms`
  );
  console.log('============================================================');

  if (summary.failed > 0) {
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { main };
