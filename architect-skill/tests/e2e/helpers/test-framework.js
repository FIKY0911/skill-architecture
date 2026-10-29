/**
 * Zero-dependency standalone test framework harness
 * Compatible with Node.js 18+
 */

const assert = require('node:assert');

const suites = [];
let currentSuite = null;

function describe(name, fn) {
  const suite = {
    name,
    tests: [],
    beforeAllHooks: [],
    afterAllHooks: [],
    beforeEachHooks: [],
    afterEachHooks: []
  };
  suites.push(suite);

  const prevSuite = currentSuite;
  currentSuite = suite;
  try {
    fn();
  } finally {
    currentSuite = prevSuite;
  }
}

function test(name, fn) {
  if (!currentSuite) {
    describe('Default Suite', () => {
      test(name, fn);
    });
    return;
  }
  currentSuite.tests.push({ name, fn });
}

const it = test;

function beforeAll(fn) {
  if (currentSuite) currentSuite.beforeAllHooks.push(fn);
}

function afterAll(fn) {
  if (currentSuite) currentSuite.afterAllHooks.push(fn);
}

function beforeEach(fn) {
  if (currentSuite) currentSuite.beforeEachHooks.push(fn);
}

function afterEach(fn) {
  if (currentSuite) currentSuite.afterEachHooks.push(fn);
}

async function runSuite(suite, options = {}) {
  const verbose = options.verbose || false;
  const filter = options.filter ? new RegExp(options.filter, 'i') : null;
  const results = {
    name: suite.name,
    total: 0,
    passed: 0,
    failed: 0,
    tests: []
  };

  for (const hook of suite.beforeAllHooks) {
    await hook();
  }

  for (const t of suite.tests) {
    if (filter && !filter.test(t.name) && !filter.test(suite.name)) {
      continue;
    }

    results.total++;
    const testResult = { name: t.name, status: 'PASSED', durationMs: 0, error: null };
    const startTime = Date.now();

    try {
      for (const hook of suite.beforeEachHooks) {
        await hook();
      }

      await t.fn();

      for (const hook of suite.afterEachHooks) {
        await hook();
      }

      testResult.status = 'PASSED';
      results.passed++;
      testResult.durationMs = Date.now() - startTime;
      if (verbose) {
        console.log(`    \x1b[32m✓\x1b[0m ${t.name} (${testResult.durationMs}ms)`);
      }
    } catch (err) {
      testResult.status = 'FAILED';
      testResult.error = err;
      testResult.durationMs = Date.now() - startTime;
      results.failed++;
      console.log(`    \x1b[31m✗\x1b[0m ${t.name} (${testResult.durationMs}ms)`);
      console.log(`      \x1b[31mError:\x1b[0m ${err.message}`);
      if (verbose && err.stack) {
        console.log(`      ${err.stack.split('\n').slice(1, 4).join('\n      ')}`);
      }
    }

    results.tests.push(testResult);
  }

  for (const hook of suite.afterAllHooks) {
    await hook();
  }

  return results;
}

async function runAll(options = {}) {
  const summary = {
    totalSuites: suites.length,
    totalTests: 0,
    passed: 0,
    failed: 0,
    durationMs: 0,
    suiteResults: []
  };

  const startTime = Date.now();

  for (const suite of suites) {
    console.log(`\n\x1b[1m\x1b[36m▶ Suite: ${suite.name}\x1b[0m`);
    const suiteRes = await runSuite(suite, options);
    summary.totalTests += suiteRes.total;
    summary.passed += suiteRes.passed;
    summary.failed += suiteRes.failed;
    summary.suiteResults.push(suiteRes);
  }

  summary.durationMs = Date.now() - startTime;
  return summary;
}

function getSuites() {
  return suites;
}

function clearSuites() {
  suites.length = 0;
  currentSuite = null;
}

// Auto-run if executed directly as main script or if a .test.js file is the main entrypoint
if (require.main === module || (require.main && require.main.filename && require.main.filename.endsWith('.test.js'))) {
  setImmediate(async () => {
    const summary = await runAll({ verbose: true });
    console.log('\n----------------------------------------');
    console.log(`Tests: ${summary.passed} passed, ${summary.failed} failed, ${summary.totalTests} total`);
    console.log(`Duration: ${summary.durationMs}ms`);
    process.exit(summary.failed > 0 ? 1 : 0);
  });
}

module.exports = {
  describe,
  test,
  it,
  beforeAll,
  afterAll,
  beforeEach,
  afterEach,
  assert,
  runSuite,
  runAll,
  getSuites,
  clearSuites
};
