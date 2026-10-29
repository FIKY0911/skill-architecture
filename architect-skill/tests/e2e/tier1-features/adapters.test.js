/**
 * Tier 1 - Feature Coverage: Agent Adapters Subsystem
 * Verifies adapter configuration, format syntax, and installation matrix for all 7 AI platforms.
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { readProjectFile, projectFileExists } = require('../helpers/test-context.js');
const { assertContains, assertMatches } = require('../helpers/assertions.js');

describe('Tier 1: Multi-Agent Adapters Subsystem', () => {

  test('TC-T1-ADP-01: Claude adapter implements structured XML tags and slash command routing', () => {
    assert.ok(projectFileExists('adapters/claude/SKILL.md'), 'Claude adapter must exist');
    const content = readProjectFile('adapters/claude/SKILL.md');
    assertMatches(content, /<role>[\s\S]*<\/role>/i, 'Claude adapter must contain <role> tag');
    assertMatches(content, /<instructions>[\s\S]*<\/instructions>/i, 'Claude adapter must contain <instructions> tag');
    assertMatches(content, /<guidelines>[\s\S]*<\/guidelines>/i, 'Claude adapter must contain <guidelines> tag');
    assertContains(content, '/architect', 'Claude adapter must document /architect slash command');
    assertContains(content, 'zero-egress', 'Claude adapter must enforce zero-egress');
  });

  test('TC-T1-ADP-02: Cursor adapter adheres to .mdc rule schema and globs', () => {
    assert.ok(projectFileExists('adapters/cursor/architect-skill.mdc'), 'Cursor adapter must exist');
    const content = readProjectFile('adapters/cursor/architect-skill.mdc');
    assertMatches(content, /^---\s*\n/m, 'Cursor MDC rule must start with YAML frontmatter');
    assertMatches(content, /description\s*:\s*.+/i, 'Cursor rule must provide a description');
    assertMatches(content, /globs\s*:\s*.+/i, 'Cursor rule must specify file globs');
    assertContains(content, 'docs/**', 'Cursor rule globs or instructions must mention docs/**');
    assertContains(content, 'secrets', 'Cursor rule must explicitly warn against reading secrets or .env');
  });

  test('TC-T1-ADP-03: Continue.dev prompt adapter defines invocable flag and parameter tags', () => {
    assert.ok(projectFileExists('adapters/continue/architect-skill.prompt'), 'Continue prompt adapter must exist');
    const content = readProjectFile('adapters/continue/architect-skill.prompt');
    assertMatches(content, /name\s*:\s*["']?architect["']?/i, 'Continue prompt name must be architect');
    assertMatches(content, /invocable\s*:\s*true/i, 'Continue prompt must be marked invocable: true');
    assertContains(content, '{{{ input }}}', 'Continue prompt must contain {{{ input }}} parameter placeholder');
  });

  test('TC-T1-ADP-04: Windsurf Cascade rules adapter defines boundary and output targets', () => {
    assert.ok(projectFileExists('adapters/windsurf/.windsurfrules'), 'Windsurf .windsurfrules must exist');
    const content = readProjectFile('adapters/windsurf/.windsurfrules');
    assertContains(content, './docs/', 'Windsurf rules must target ./docs/ for output generation');
    assertContains(content, 'zero-egress', 'Windsurf rules must mandate zero-egress');
    assertContains(content, '.env', 'Windsurf rules must forbid access to .env');
  });

  test('TC-T1-ADP-05: Cline autonomous agent rules mandate validation script executions', () => {
    assert.ok(projectFileExists('adapters/cline/.clinerules'), 'Cline .clinerules must exist');
    const content = readProjectFile('adapters/cline/.clinerules');
    assertContains(content, 'validate-mermaid.js', 'Cline rules must instruct executing validate-mermaid.js');
    assertContains(content, 'secret-scan.js', 'Cline rules must instruct executing secret-scan.js');
    assertContains(content, 'wizard-state.js', 'Cline rules must instruct state management via wizard-state.js');
  });

  test('TC-T1-ADP-06: OpenAI Codex and Google Antigravity adapters specify runtime constraints', () => {
    assert.ok(projectFileExists('adapters/codex/SKILL.md'), 'Codex adapter must exist');
    assert.ok(projectFileExists('adapters/antigravity/SKILL.md'), 'Antigravity adapter must exist');

    const codexContent = readProjectFile('adapters/codex/SKILL.md');
    assertContains(codexContent, 'architect-skill', 'Codex adapter must identify architect-skill');

    const agyContent = readProjectFile('adapters/antigravity/SKILL.md');
    assertContains(agyContent, 'architect-skill', 'Antigravity adapter must identify architect-skill');
    assertMatches(agyContent, /^---\s*\n/m, 'Antigravity adapter must start with YAML frontmatter');
  });

  test('TC-T1-ADP-07: adapters/README.md provides exhaustive 7-agent compatibility matrix', () => {
    assert.ok(projectFileExists('adapters/README.md'), 'adapters/README.md must exist');
    const content = readProjectFile('adapters/README.md');
    const agents = ['Claude', 'Cursor', 'Continue', 'Windsurf', 'Cline', 'Codex', 'Antigravity'];

    for (const agent of agents) {
      assertContains(content, agent, `Adapter matrix must list support for ${agent}`);
    }
    assertContains(content, '~/.architect-skill-backup', 'Adapter guide must document automatic backup folder path');
  });

});
