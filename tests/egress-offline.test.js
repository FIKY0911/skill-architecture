#!/usr/bin/env node
/**
 * Zero-Egress & Offline Execution Test Suite (egress-offline.test.js)
 * Verifies that egress-guard.js blocks all outbound network protocols (TCP, TLS, HTTP, HTTPS, UDP, DNS, fetch)
 * and that policies/network-allowlist.json is strictly empty.
 */
'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const net = require('net');
const tls = require('tls');
const http = require('http');
const https = require('https');
const dgram = require('dgram');
const dns = require('dns');

const { isZeroEgressActive } = require('../scripts/egress-guard');

async function runTests() {
  let passed = 0;

  // 1. Guard active flag
  assert.strictEqual(isZeroEgressActive, true, 'isZeroEgressActive must be true');
  passed++;

  // 2. Network allowlist policy is empty
  const policyPath = path.resolve(__dirname, '../policies/network-allowlist.json');
  const policy = JSON.parse(fs.readFileSync(policyPath, 'utf8'));
  assert.strictEqual(policy.mode, 'strict-zero-egress', 'Policy mode must be strict-zero-egress');
  assert.deepStrictEqual(policy.allowed_hosts, [], 'allowed_hosts must be empty');
  assert.deepStrictEqual(policy.allowed_ports, [], 'allowed_ports must be empty');
  passed++;

  // 3. net.connect blocked
  assert.throws(
    () => net.connect(80, '1.1.1.1'),
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED' && err.name === 'EgressBlockedError',
    'net.connect must throw EgressBlockedError'
  );
  passed++;

  // 4. net.Socket.prototype.connect blocked
  assert.throws(
    () => {
      const sock = new net.Socket();
      sock.connect(443, 'example.com');
    },
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED',
    'net.Socket.connect must throw EgressBlockedError'
  );
  passed++;

  // 5. tls.connect blocked
  assert.throws(
    () => tls.connect(443, 'example.com'),
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED',
    'tls.connect must throw EgressBlockedError'
  );
  passed++;

  // 6. http.get / http.request blocked
  assert.throws(
    () => http.get('http://example.com'),
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED',
    'http.get must throw EgressBlockedError'
  );
  assert.throws(
    () => http.request('http://example.com'),
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED',
    'http.request must throw EgressBlockedError'
  );
  passed++;

  // 7. https.get / https.request blocked
  assert.throws(
    () => https.get('https://example.com'),
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED',
    'https.get must throw EgressBlockedError'
  );
  assert.throws(
    () => https.request('https://example.com'),
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED',
    'https.request must throw EgressBlockedError'
  );
  passed++;

  // 8. dgram.createSocket blocked
  assert.throws(
    () => dgram.createSocket('udp4'),
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED',
    'dgram.createSocket must throw EgressBlockedError'
  );
  passed++;

  // 9. dns.lookup and dns.resolve blocked
  assert.throws(
    () => dns.lookup('example.com', () => {}),
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED',
    'dns.lookup must throw EgressBlockedError'
  );
  assert.throws(
    () => dns.resolve('example.com', () => {}),
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED',
    'dns.resolve must throw EgressBlockedError'
  );
  passed++;

  // 10. globalThis.fetch blocked (returns rejected promise)
  if (typeof globalThis.fetch === 'function') {
    await assert.rejects(
      () => globalThis.fetch('https://example.com'),
      (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED' && err.name === 'EgressBlockedError',
      'fetch rejection must have ERR_ZERO_EGRESS_BLOCKED'
    );
    passed++;
  }

  console.log(JSON.stringify({ suite: 'egress-offline.test.js', status: 'PASSED', assertions: passed }));
  return { suite: 'egress-offline.test.js', status: 'PASSED', assertions: passed };
}

if (require.main === module) {
  runTests().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}

module.exports = { runTests };
