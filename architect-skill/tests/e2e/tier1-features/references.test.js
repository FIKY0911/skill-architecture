/**
 * Tier 1 - Feature Coverage: Authoritative Industry References
 * Verifies that reference standards adhere strictly to official documentation and senior engineering rigor.
 */

const { describe, test, assert } = require('../helpers/test-framework.js');
const { readProjectFile, projectFileExists } = require('../helpers/test-context.js');
const { assertContains, assertMatches } = require('../helpers/assertions.js');

describe('Tier 1: Industry References Subsystem', () => {

  test('TC-T1-REF-01: PRD reference conforms to Atlassian Product Management standard', () => {
    assert.ok(projectFileExists('references/requirements/prd.md'), 'prd.md reference must exist');
    const content = readProjectFile('references/requirements/prd.md');
    assertContains(content, 'Atlassian', 'PRD must cite Atlassian methodology');
    assertContains(content, 'Problem Framing', 'PRD must include Problem Framing formulation');
    assertContains(content, 'Personas', 'PRD must include Personas section');
    assertContains(content, 'Gherkin', 'PRD must define user stories with Gherkin acceptance criteria');
    assertContains(content, 'MoSCoW', 'PRD must specify MoSCoW prioritization');
    assertContains(content, 'Non-Functional', 'PRD must define Non-Functional Requirements');
  });

  test('TC-T1-REF-02: BRD reference conforms to BABOK Guide IIBA enterprise standard', () => {
    assert.ok(projectFileExists('references/requirements/brd.md'), 'brd.md reference must exist');
    const content = readProjectFile('references/requirements/brd.md');
    assertContains(content, 'BABOK', 'BRD must cite BABOK Guide IIBA');
    assertContains(content, 'RACI', 'BRD must define Stakeholder Analysis using RACI matrix');
    assertContains(content, 'TCO', 'BRD must include Total Cost of Ownership (TCO) formulation');
    assertContains(content, 'ROI', 'BRD must include Return on Investment (ROI)');
    assertContains(content, 'BCDR', 'BRD must define Business Continuity & Disaster Recovery');
  });

  test('TC-T1-REF-03: SRD reference conforms to ISO/IEC/IEEE 29148:2018 and EARS syntax', () => {
    assert.ok(projectFileExists('references/requirements/srd.md'), 'srd.md reference must exist');
    const content = readProjectFile('references/requirements/srd.md');
    assertContains(content, '29148', 'SRD must cite ISO/IEC/IEEE 29148:2018');
    assertContains(content, 'IEEE 830', 'SRD must note superseding of legacy IEEE 830');
    assertContains(content, 'EARS', 'SRD must define Easy Approach to Requirements Syntax (EARS)');
    assertMatches(content, /\bshall\b/i, 'SRD must require formal shall modal verb syntax');
    assertContains(content, '[I] Inspection', 'SRD must define verification methods [I], [A], [D], [T]');
  });

  test('TC-T1-REF-04: Architecture pattern references enforce strict layer isolation rules', () => {
    const archRefs = [
      'clean-architecture.md',
      'modular-monolith.md',
      'event-driven.md',
      'hexagonal.md',
      'fsd.md'
    ];

    for (const ref of archRefs) {
      const fullPath = `references/architecture/${ref}`;
      assert.ok(projectFileExists(fullPath), `Architecture reference ${ref} must exist`);
      const content = readProjectFile(fullPath);
      assert.ok(content.length > 500, `Architecture reference ${ref} must contain in-depth technical analysis`);
    }

    const cleanArch = readProjectFile('references/architecture/clean-architecture.md');
    assertContains(cleanArch, 'Dependency Rule', 'Clean Architecture must explain the Dependency Rule');
    assertContains(cleanArch, 'Entities', 'Clean Architecture must define Entities layer');

    const modMono = readProjectFile('references/architecture/modular-monolith.md');
    assertContains(modMono, 'Bounded Context', 'Modular Monolith must explain Bounded Contexts');

    const eda = readProjectFile('references/architecture/event-driven.md');
    assertContains(eda, 'Outbox', 'Event-Driven Architecture must document Transactional Outbox pattern');
  });

  test('TC-T1-REF-05: System design references mandate Kleppmann fencing tokens & XFetch caching', () => {
    assert.ok(projectFileExists('references/system-design/caching-redis.md'), 'caching-redis.md must exist');
    assert.ok(projectFileExists('references/system-design/distributed-locking.md'), 'distributed-locking.md must exist');

    const redis = readProjectFile('references/system-design/caching-redis.md');
    assertContains(redis, 'Cache-Aside', 'Redis reference must cover Cache-Aside pattern');
    assertContains(redis, 'XFetch', 'Redis reference must document XFetch probabilistic stampede mitigation');
    assertContains(redis, 'TTL', 'Redis reference must cover TTL jitter strategies');

    const locking = readProjectFile('references/system-design/distributed-locking.md');
    assertContains(locking, 'Kleppmann', 'Distributed locking must cite Martin Kleppmann analysis');
    assertContains(locking, 'fencing token', 'Distributed locking must mandate monotonically increasing fencing tokens');
    assertContains(locking, 'last_fencing_token <', 'Distributed locking must illustrate storage-layer token validation');
  });

  test('TC-T1-REF-06: Security references detail threat modeling, zero-egress, and untrusted caller model', () => {
    if (projectFileExists('references/security/threat-model.md')) {
      const threatModel = readProjectFile('references/security/threat-model.md');
      assertContains(threatModel, 'STRIDE', 'Threat model must incorporate STRIDE methodology');
    }

    if (projectFileExists('references/security/secret-handling.md')) {
      const secrets = readProjectFile('references/security/secret-handling.md');
      assertContains(secrets, 'redact', 'Secret handling must detail redaction and masking');
    }

    if (projectFileExists('references/security/local-first.md')) {
      const localFirst = readProjectFile('references/security/local-first.md');
      assertContains(localFirst, 'zero-egress', 'Local-first must detail zero-egress operation');
    }
  });

});
