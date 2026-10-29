#!/usr/bin/env node
/**
 * Environment & Skill Integrity Diagnostic Utility (doctor.js)
 * Verifies Node.js runtime, zero-egress enforcement, structure compliance, and Mermaid assets.
 */
'use strict';

const { isZeroEgressActive } = require('./egress-guard');
const { validateSkillStructure } = require('./validate-structure');
const { validateMermaidPath } = require('./validate-mermaid');
const path = require('path');

function runDoctor() {
  const nodeVersion = process.versions.node;
  const major = parseInt(nodeVersion.split('.')[0], 10);
  const structure = validateSkillStructure();
  const mermaid = validateMermaidPath(path.resolve(__dirname, '../assets/uml'));

  const healthy = major >= 18 && isZeroEgressActive && structure.valid && mermaid.valid;
  return {
    healthy,
    nodeVersion,
    zeroEgressActive: isZeroEgressActive,
    structureValid: structure.valid,
    missingFiles: structure.missing,
    mermaidAssetsValid: mermaid.valid,
  };
}

if (require.main === module) {
  const report = runDoctor();
  console.log(JSON.stringify(report, null, 2));
  if (!report.healthy) {
    process.exit(1);
  }
}

module.exports = { runDoctor };
