#!/usr/bin/env node
/**
 * Zero-Knowledge Credential Broker (broker.js)
 * Dispenses opaque reference handles (ref://<handle>) to AI agents.
 * Never exposes actual secret values to the LLM context or generated documentation.
 */
'use strict';

require('../scripts/egress-guard');
const crypto = require('crypto');
const { scanText } = require('../scripts/secret-scan');

const activeLeases = new Map();

function issueOpaqueLease(agentId, resourceName, ttlSeconds = 300) {
  const leaseId = 'lease_' + crypto.randomBytes(8).toString('hex');
  const handle = `{{SECRET_${String(resourceName).toUpperCase().replace(/[^A-Z0-9_]/g, '_')}}}`;
  const expiresAt = Date.now() + ttlSeconds * 1000;
  const record = { leaseId, agentId, resourceName, handle, expiresAt };
  activeLeases.set(leaseId, record);
  return record;
}

function sanitizeBrokerOutput(payload) {
  const str = typeof payload === 'string' ? payload : JSON.stringify(payload);
  return scanText(str).maskedText;
}

if (require.main === module) {
  const lease = issueOpaqueLease('architect-agent', process.argv[2] || 'DATABASE_PASSWORD');
  console.log(JSON.stringify(lease, null, 2));
}

module.exports = {
  issueOpaqueLease,
  sanitizeBrokerOutput,
};
