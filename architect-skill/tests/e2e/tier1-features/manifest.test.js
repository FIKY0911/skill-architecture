/**
 * Tier 1 - Feature Coverage: Manifest & Root Metadata
 * Verifies core configuration, skill.yaml manifest, and governance files in isolation.
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { readProjectFile, projectFileExists } = require('../helpers/test-context.js');
const { assertContains, assertMatches } = require('../helpers/assertions.js');

describe('Tier 1: Core Root Metadata & Manifest', () => {

  test('TC-T1-MAN-01: skill.yaml exists and declares schema_version 1.0', () => {
    assert.ok(projectFileExists('skill.yaml'), 'skill.yaml must exist at project root');
    const content = readProjectFile('skill.yaml');
    assertMatches(content, /schema_version\s*:\s*["']?1\.0["']?/, 'skill.yaml must declare schema_version: "1.0"');
  });

  test('TC-T1-MAN-02: skill.yaml metadata specifies required identity fields', () => {
    const content = readProjectFile('skill.yaml');
    assertMatches(content, /name\s*:\s*["']?architect-skill["']?/, 'Metadata name must be architect-skill');
    assertMatches(content, /version\s*:\s*["']?1\.0\.0["']?/, 'Metadata version must be 1.0.0');
    assertMatches(content, /license\s*:\s*["']?MIT["']?/, 'Metadata license must be MIT');
    assertMatches(content, /author\s*:\s*.+/, 'Metadata must specify author');
    assertContains(content, 'architecture', 'Metadata tags must include architecture');
    assertContains(content, 'system-design', 'Metadata tags must include system-design');
    assertContains(content, 'zero-egress', 'Metadata tags must include zero-egress');
  });

  test('TC-T1-MAN-03: skill.yaml compatibility lists all 7 target AI platforms', () => {
    const content = readProjectFile('skill.yaml');
    const requiredPlatforms = [
      'claude',
      'cursor',
      'continue',
      'windsurf',
      'cline',
      'codex',
      'antigravity'
    ];

    for (const platform of requiredPlatforms) {
      assertContains(content, `id: "${platform}"`, `Compatibility must define platform id "${platform}"`);
    }
  });

  test('TC-T1-MAN-04: skill.yaml permissions enforce zero network egress', () => {
    const content = readProjectFile('skill.yaml');
    assertMatches(content, /egress\s*:\s*["']?none["']?/, 'Network egress must be explicitly set to "none"');
    assertMatches(content, /ingress\s*:\s*["']?none["']?/, 'Network ingress must be explicitly set to "none"');
    assertMatches(content, /allowlist\s*:\s*\[\s*\]/, 'Network allowlist must be strictly empty');
  });

  test('TC-T1-MAN-05: skill.yaml filesystem scope explicitly forbids credential files', () => {
    const content = readProjectFile('skill.yaml');
    const forbiddenPatterns = [
      '.env',
      '*.pem',
      '*.key',
      'secrets',
      'credentials',
      '.ssh',
      '.aws'
    ];

    for (const pattern of forbiddenPatterns) {
      assertContains(content, pattern, `skill.yaml must explicitly forbid access to pattern "${pattern}"`);
    }
  });

  test('TC-T1-MAN-06: Root governance and legal documents exist and are populated', () => {
    const requiredFiles = [
      'SKILL.md',
      'README.md',
      'CHANGELOG.md',
      'CONTRIBUTING.md',
      'SECURITY.md',
      'PRIVACY.md',
      'LICENSE'
    ];

    for (const file of requiredFiles) {
      assert.ok(projectFileExists(file), `Required root file ${file} must exist`);
      const content = readProjectFile(file);
      assert.ok(content.trim().length > 50, `Root file ${file} must contain meaningful content`);
    }
  });

  test('TC-T1-MAN-07: .gitignore rigorously excludes secrets, environments, and caches', () => {
    if (projectFileExists('.gitignore')) {
      const content = readProjectFile('.gitignore');
      assertContains(content, '.env', '.gitignore must exclude .env');
      assertContains(content, '*.pem', '.gitignore must exclude *.pem');
      assertContains(content, '*.key', '.gitignore must exclude *.key');
      assertContains(content, 'secrets/', '.gitignore must exclude secrets/');
      assertContains(content, '.wizard-state', '.gitignore must exclude wizard state files');
    }
  });

  test('TC-T1-MAN-08: SKILL.md contains valid frontmatter and core orchestrator phases', () => {
    assert.ok(projectFileExists('SKILL.md'), 'SKILL.md must exist');
    const content = readProjectFile('SKILL.md');
    assertMatches(content, /^---\s*\n/m, 'SKILL.md must start with YAML frontmatter');
    assertContains(content, 'name: "architect-skill"', 'SKILL.md frontmatter must contain name');
    assertContains(content, 'Tier 1', 'SKILL.md must document Tier 1 workflow');
    assertContains(content, 'Tier 2', 'SKILL.md must document Tier 2 workflow');
    assertContains(content, 'Zero-Egress', 'SKILL.md must mandate Zero-Egress constraint');
  });

});
