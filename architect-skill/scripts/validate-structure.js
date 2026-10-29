#!/usr/bin/env node
/**
 * Repository & Output Structure Validator (validate-structure.js)
 * Verifies required directories, adapters, references, assets, and scripts exist and are non-empty.
 */
'use strict';

require('./egress-guard');
const fs = require('fs');
const path = require('path');

const SKILL_ROOT = path.resolve(__dirname, '..');

const REQUIRED_PATHS = [
  'SKILL.md',
  'skill.yaml',
  'README.md',
  'CHANGELOG.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'PRIVACY.md',
  'LICENSE',
  '.gitignore',
  '.editorconfig',
  '.gitattributes',
  'adapters/claude/SKILL.md',
  'adapters/cursor/architect-skill.mdc',
  'adapters/continue/architect-skill.prompt',
  'adapters/windsurf/.windsurfrules',
  'adapters/cline/.clinerules',
  'adapters/codex/SKILL.md',
  'adapters/antigravity/SKILL.md',
  'adapters/README.md',
  'references/requirements/prd.md',
  'references/requirements/brd.md',
  'references/requirements/srd.md',
  'references/architecture/clean-architecture.md',
  'references/architecture/modular-monolith.md',
  'references/architecture/event-driven.md',
  'references/architecture/hexagonal.md',
  'references/architecture/fsd.md',
  'references/system-design/caching-redis.md',
  'references/system-design/distributed-locking.md',
  'references/system-design/rdbms-scaling.md',
  'references/system-design/async-message-queue.md',
  'references/system-design/rate-limiting.md',
  'references/security/threat-model.md',
  'references/security/secret-handling.md',
  'references/security/local-first.md',
  'references/security/trust-model.md',
  'references/security/sandbox-isolation.md',
  'references/security/prompt-injection.md',
  'references/security/tool-pinning.md',
  'assets/uml/sequence.mmd',
  'assets/uml/erd.mmd',
  'assets/uml/state.mmd',
  'assets/uml/c4-container.mmd',
  'assets/uml/activity.mmd',
  'assets/ui/ui-libraries.md',
  'assets/ui/fe-aesthetics.md',
  'assets/ui/tailwind-shadcn.md',
  'assets/ui/daisyui.md',
  'assets/ui/mantine.md',
  'assets/ui/chakra.md',
  'assets/ui/anti-slop.md',
  'scripts/validate-ui-slop.js',
  'scripts/validate-diagrams.js',

  'policies/network-allowlist.json',
  'policies/redaction-rules.json',
  'policies/filesystem-scope.json',
];

function validateSkillStructure(rootDir = SKILL_ROOT) {
  const missing = [];
  const empty = [];

  for (const rel of REQUIRED_PATHS) {
    const abs = path.join(rootDir, rel);
    if (!fs.existsSync(abs)) {
      missing.push(rel);
    } else {
      const stat = fs.statSync(abs);
      if (stat.isFile() && stat.size === 0) {
        empty.push(rel);
      }
    }
  }

  return {
    valid: missing.length === 0 && empty.length === 0,
    checkedCount: REQUIRED_PATHS.length,
    missing,
    empty,
  };
}

if (require.main === module) {
  const report = validateSkillStructure();
  console.log(JSON.stringify(report, null, 2));
  if (!report.valid) {
    process.exit(1);
  }
}

module.exports = {
  REQUIRED_PATHS,
  validateSkillStructure,
};
