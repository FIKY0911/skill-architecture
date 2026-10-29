#!/usr/bin/env node
/**
 * Secure Credential Reference Intake (intake.js)
 * Registers symbolic placeholder names without reading or storing raw secret values.
 */
'use strict';

require('../scripts/egress-guard');

function createSymbolicReference(serviceName, secretType = 'API_KEY') {
  const cleanService = String(serviceName || 'SERVICE')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_');
  const cleanType = String(secretType || 'SECRET')
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '_');
  return {
    referenceHandle: `ref://${cleanService.toLowerCase()}/${cleanType.toLowerCase()}`,
    docPlaceholder: `{{SECRET_${cleanService}_${cleanType}}}`,
    storedValue: null,
  };
}

if (require.main === module) {
  console.log(JSON.stringify(createSymbolicReference(process.argv[2] || 'STRIPE', process.argv[3] || 'KEY'), null, 2));
}

module.exports = { createSymbolicReference };
