#!/usr/bin/env node
/**
 * Alias for output-integrity.test.js (output.test.js)
 */
'use strict';

const { runTests } = require('./output-integrity.test.js');

if (require.main === module) {
  runTests();
}

module.exports = { runTests };
