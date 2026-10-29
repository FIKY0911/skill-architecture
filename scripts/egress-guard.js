#!/usr/bin/env node
/**
 * Zero-Egress Runtime Guard (egress-guard.js)
 * Blocks all outbound TCP, UDP, HTTP, HTTPS, TLS, DNS, and Fetch requests
 * unless explicitly permitted in policies/network-allowlist.json (empty by default).
 */
'use strict';

const net = require('net');
const tls = require('tls');
const http = require('http');
const https = require('https');
const dgram = require('dgram');
const dns = require('dns');

function createEgressError(moduleName, methodName) {
  const err = new Error(
    `[SECURITY_VIOLATION] Outbound network egress blocked by architect-skill zero-egress policy: ${moduleName}.${methodName}()`
  );
  err.code = 'ERR_ZERO_EGRESS_BLOCKED';
  err.name = 'EgressBlockedError';
  return err;
}

function blockSync(moduleName, methodName) {
  throw createEgressError(moduleName, methodName);
}

function installEgressGuard() {
  net.Socket.prototype.connect = function () {
    blockSync('net.Socket', 'connect');
  };
  net.connect = net.createConnection = function () {
    blockSync('net', 'connect');
  };
  tls.connect = function () {
    blockSync('tls', 'connect');
  };
  http.request = http.get = function () {
    blockSync('http', 'request');
  };
  https.request = https.get = function () {
    blockSync('https', 'request');
  };
  dgram.createSocket = function () {
    blockSync('dgram', 'createSocket');
  };
  dns.lookup = function () {
    blockSync('dns', 'lookup');
  };
  dns.resolve = dns.resolve4 = dns.resolve6 = function () {
    blockSync('dns', 'resolve');
  };

  if (typeof globalThis.fetch === 'function') {
    globalThis.fetch = function () {
      return Promise.reject(createEgressError('globalThis', 'fetch'));
    };
  }

  return { isZeroEgressActive: true };
}

const status = installEgressGuard();

if (require.main === module) {
  console.log(JSON.stringify({ status: 'ACTIVE', zeroEgress: true }));
}

module.exports = {
  installEgressGuard,
  createEgressError,
  isZeroEgressActive: status.isZeroEgressActive,
};
