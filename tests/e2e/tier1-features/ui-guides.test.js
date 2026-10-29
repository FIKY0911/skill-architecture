/**
 * Tier 1 - Feature Coverage: UI Libraries & 8 Senior Frontend Aesthetics
 * Verifies 6 UI framework integration guides and 8 visual aesthetic token sets (including Neubrutalism / Saweria.co style).
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { readProjectFile, projectFileExists } = require('../helpers/test-context.js');
const { assertContains } = require('../helpers/assertions.js');

describe('Tier 1: UI Libraries & Senior Frontend Aesthetics Subsystem', () => {

  test('TC-T1-UIG-01: ui-libraries.md covers all 6 official UI component frameworks', () => {
    assert.ok(projectFileExists('assets/ui/ui-libraries.md'), 'ui-libraries.md must exist');
    const content = readProjectFile('assets/ui/ui-libraries.md');
    const libraries = ['shadcn/ui', 'DaisyUI', 'Mantine', 'Chakra UI', 'Ant Design', 'Material UI'];
    for (const lib of libraries) {
      assertContains(content, lib, `ui-libraries.md must document ${lib}`);
    }
  });

  test('TC-T1-UIG-02: Individual UI guides exist for Tailwind+shadcn, DaisyUI, Mantine, and Chakra', () => {
    const files = [
      'assets/ui/tailwind-shadcn.md',
      'assets/ui/daisyui.md',
      'assets/ui/mantine.md',
      'assets/ui/chakra.md',
    ];
    for (const f of files) {
      assert.ok(projectFileExists(f), `${f} must exist`);
      assert.ok(readProjectFile(f).length > 200, `${f} must have substantive content`);
    }
  });

  test('TC-T1-UIG-03: fe-aesthetics.md documents all 8 curated senior frontend aesthetics', () => {
    assert.ok(projectFileExists('assets/ui/fe-aesthetics.md'), 'fe-aesthetics.md must exist');
    const content = readProjectFile('assets/ui/fe-aesthetics.md');
    const styles = [
      'Neubrutalism',
      'Bento Grid',
      'Glassmorphism',
      'Swiss',
      'Modern SaaS',
      'Material Design 3',
      'Neumorphism',
      'Retro',
    ];
    for (const s of styles) {
      assertContains(content, s, `fe-aesthetics.md must include ${s}`);
    }
  });

  test('TC-T1-UIG-04: Neubrutalism aesthetic includes hard offset shadows, thick black borders, and Saweria reference', () => {
    const content = readProjectFile('assets/ui/fe-aesthetics.md');
    assertContains(content, 'Saweria', 'Neubrutalism must reference Saweria.co');
    assertContains(content, '0px 0px #000000', 'Neubrutalism must specify zero-blur hard offset shadows');
    assertContains(content, 'border-black', 'Neubrutalism must include solid black border classes');
  });

  test('TC-T1-UIG-05: Glassmorphism and Neumorphism include accessibility and contrast guardrails', () => {
    const content = readProjectFile('assets/ui/fe-aesthetics.md');
    assertContains(content, 'backdrop-blur', 'Glassmorphism must specify backdrop-blur tokens');
    assertContains(content, 'WCAG', 'FE aesthetics must include WCAG accessibility contrast warnings');
  });

  test('TC-T1-UIG-06: Output UI templates exist for setup-guide, theme-tokens, and component-registry', () => {
    const templates = [
      'assets/output/ui/setup-guide.template.md',
      'assets/output/ui/theme-tokens.template.md',
      'assets/output/ui/component-registry.template.md',
    ];
    for (const t of templates) {
      assert.ok(projectFileExists(t), `Output UI template ${t} must exist`);
    }
  });

});
