#!/usr/bin/env node
/**
 * Alias for egress-offline.test.js (offline.test.js)
 */
'use strict';

const { runTests } = require('./egress-offline.test.js');

if (require.main === module) {
  runTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { runTests };
