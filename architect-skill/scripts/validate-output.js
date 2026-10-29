#!/usr/bin/env node
/**
 * Cross-Document Output Validator (validate-output.js)
 * Verifies ./docs/ hierarchy, Mermaid validity, and zero-credential compliance.
 */
'use strict';

require('./egress-guard');
const fs = require('fs');
const path = require('path');
const { scanFileOrDirectory } = require('./secret-scan');
const { validateMermaidPath } = require('./validate-mermaid');
const { validateTextDiagramPath, findMissingTwins } = require('./validate-diagrams');

const EXPECTED_DOCS_SUBDIRS = [
  'requirements',
  'architecture',
  'system-design',
  'diagrams',
  'ui',
];

function validateGeneratedOutput(docsDir) {
  const targetDir = path.resolve(docsDir || path.join(process.cwd(), 'docs'));
  const errors = [];
  const warnings = [];

  if (!fs.existsSync(targetDir)) {
    return {
      valid: false,
      errors: [`Output directory does not exist: ${targetDir}`],
      warnings,
    };
  }

  for (const sub of EXPECTED_DOCS_SUBDIRS) {
    const subPath = path.join(targetDir, sub);
    if (!fs.existsSync(subPath)) {
      warnings.push(`Missing optional/standard subdirectory: docs/${sub}`);
    }
  }

  // Secret scan check
  const secretReport = scanFileOrDirectory(targetDir, { mask: false });
  if (!secretReport.clean) {
    errors.push(`Unmasked credentials detected in ${secretReport.filesWithSecrets.length} file(s)`);
  }

  // Mermaid check
  const mermaidReport = validateMermaidPath(targetDir);
  if (!mermaidReport.valid) {
    for (const r of mermaidReport.results.filter((x) => !x.valid)) {
      errors.push(`Invalid Mermaid file ${r.file}: ${r.errors.join('; ')}`);
    }
  }

  // Preview-safe text twins: each docs/diagrams/*.mmd should have a *.md twin (warning if absent)
  const diagramsDir = path.join(targetDir, 'diagrams');
  for (const base of findMissingTwins(diagramsDir, diagramsDir)) {
    warnings.push(`docs/diagrams/${base}.mmd has no text twin ${base}.md (VSCode preview cannot render Mermaid)`);
  }
  const twinReport = validateTextDiagramPath(diagramsDir, { mmdDir: diagramsDir });
  for (const r of twinReport.results.filter((x) => !x.valid)) {
    errors.push(`Invalid text diagram ${r.file}: ${r.errors.join('; ')}`);
  }

  return {
    valid: errors.length === 0,
    docsDir: targetDir,
    errors,
    warnings,
    secretScanClean: secretReport.clean,
    mermaidDiagramsChecked: mermaidReport.checkedCount,
  };
}

if (require.main === module) {
  const argDir = process.argv[2] || path.resolve(process.cwd(), 'docs');
  const report = validateGeneratedOutput(argDir);
  console.log(JSON.stringify(report, null, 2));
  if (!report.valid) {
    process.exit(1);
  }
}

module.exports = { validateGeneratedOutput };
