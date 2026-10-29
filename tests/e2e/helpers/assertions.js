/**
 * Extended Domain Assertions
 * Provides robust validation for Mermaid syntax, secret redaction, frontmatter, and schema checks.
 */

const assert = require('node:assert');

// Known credential patterns for secret leak detection
const SENSITIVE_PATTERNS = [
  { name: 'AWS Access Key', regex: /\b(AKIA|ABIA|ACCA|ASIA)[0-9A-Z]{16}\b/ },
  { name: 'AWS Secret Key Assignment', regex: /(?:aws_secret_access_key|aws_sec_key|secret_key)\s*[:=]\s*["']?([A-Za-z0-9/+=]{40})["']?/i },
  { name: 'GitHub Personal Token', regex: /\bghp_[0-9a-zA-Z]{36}\b/ },
  { name: 'GitHub Fine-Grained Token', regex: /\bgithub_pat_[0-9a-zA-Z_]{82}\b/ },
  { name: 'Anthropic Key', regex: /\bsk-ant-api03-[A-Za-z0-9_-]{93}AA\b/ },
  { name: 'OpenAI Project Key', regex: /\bsk-proj-[a-zA-Z0-9_-]{40,}\b/ },
  { name: 'Google API Key', regex: /\bAIzaSy[0-9A-Za-z_-]{33}\b/ },
  { name: 'JWT Token', regex: /\beyJ[A-Za-z0-9-_]{10,}\.eyJ[A-Za-z0-9-_]{10,}\.[A-Za-z0-9-_]{10,}\b/ },
  { name: 'Private Key Header', regex: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/ },
  { name: 'Database Password URI', regex: /(?:postgres|postgresql|mysql|mongodb|redis):\/\/[^:\s]+:([^@\s]+)@[a-zA-Z0-9.-]+/i }
];

function assertSecretRedacted(content, contextMessage = '') {
  for (const { name, regex } of SENSITIVE_PATTERNS) {
    const match = regex.exec(content);
    if (match) {
      // Check if it's already masked (e.g. [REDACTED:...] or placeholder)
      const matchedStr = match[0];
      if (!matchedStr.includes('[REDACTED') && !matchedStr.includes('{{SECRET_')) {
        assert.fail(`Secret leakage detected: ${name} found in content. Match: "${matchedStr.slice(0, 15)}...". ${contextMessage}`);
      }
    }
  }
}

function assertMermaidValid(content, contextMessage = '') {
  const trimmed = content.trim();
  const validDiagramTypes = [
    'sequenceDiagram',
    'erDiagram',
    'stateDiagram',
    'stateDiagram-v2',
    'C4Context',
    'C4Container',
    'C4Component',
    'flowchart',
    'graph'
  ];

  const firstNonEmptyLine = trimmed.split('\n').map(l => l.trim()).find(l => l.length > 0 && !l.startsWith('%%'));
  assert.ok(firstNonEmptyLine, `Mermaid content is empty. ${contextMessage}`);

  const hasValidType = validDiagramTypes.some(type => firstNonEmptyLine.startsWith(type));
  assert.ok(hasValidType, `Mermaid diagram must start with a recognized diagram keyword (${validDiagramTypes.join(', ')}). Found: "${firstNonEmptyLine}". ${contextMessage}`);

  // Check brackets balance
  const braceSource = trimmed
    .replace(/"[^"\n]*"/g, '""')
    .replace(/[|o}{]{1,2}(?:--|\.\.)[|o}{]{1,2}/g, ' REL ');
  const openBrackets = (braceSource.match(/\{/g) || []).length;
  const closeBrackets = (braceSource.match(/\}/g) || []).length;
  assert.strictEqual(openBrackets, closeBrackets, `Unbalanced curly braces in Mermaid diagram: ${openBrackets} '{' vs ${closeBrackets} '}'. ${contextMessage}`);

  // Check alt / opt / loop end blocks for sequence diagrams
  if (firstNonEmptyLine.startsWith('sequenceDiagram')) {
    const blockOpeners = (trimmed.match(/\b(alt|opt|loop|par|critical|group)\b/g) || []).length;
    const blockClosers = (trimmed.match(/\bend\b/g) || []).length;
    assert.ok(blockClosers >= blockOpeners, `Missing 'end' for blocks in sequence diagram: ${blockOpeners} openers vs ${blockClosers} closers. ${contextMessage}`);
  }
}

function assertFrontmatter(content, requiredKeys = [], contextMessage = '') {
  const lines = content.split('\n');
  assert.strictEqual(lines[0].trim(), '---', `Markdown file must begin with YAML frontmatter delimiter '---'. ${contextMessage}`);

  let closeIndex = -1;
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      closeIndex = i;
      break;
    }
  }
  assert.ok(closeIndex > 0, `Markdown frontmatter must have closing delimiter '---'. ${contextMessage}`);

  const frontmatterBody = lines.slice(1, closeIndex).join('\n');
  for (const key of requiredKeys) {
    const regex = new RegExp(`^\\s*${key}\\s*:`, 'm');
    assert.ok(regex.test(frontmatterBody), `Missing required frontmatter key: "${key}". ${contextMessage}`);
  }
}

function assertContains(text, substring, message = '') {
  assert.ok(text.includes(substring), `Expected text to contain: "${substring}". ${message}`);
}

function assertMatches(text, regex, message = '') {
  assert.ok(regex.test(text), `Expected text to match pattern: ${regex}. ${message}`);
}

function assertDoesNotMatch(text, regex, message = '') {
  assert.ok(!regex.test(text), `Expected text NOT to match pattern: ${regex}. ${message}`);
}

function assertValidJson(content, contextMessage = '') {
  try {
    return JSON.parse(content);
  } catch (err) {
    assert.fail(`Invalid JSON: ${err.message}. ${contextMessage}`);
  }
}

function assertJsonSchema(data, schema = {}, contextMessage = '') {
  assert.ok(data && typeof data === 'object', `Expected JSON object. ${contextMessage}`);
  if (Array.isArray(schema.required)) {
    for (const reqKey of schema.required) {
      assert.ok(
        Object.prototype.hasOwnProperty.call(data, reqKey),
        `Missing required JSON property "${reqKey}". ${contextMessage}`
      );
    }
  }
  if (schema.properties && typeof schema.properties === 'object') {
    for (const [key, propSpec] of Object.entries(schema.properties)) {
      if (Object.prototype.hasOwnProperty.call(data, key) && propSpec.type) {
        const actualType = Array.isArray(data[key]) ? 'array' : typeof data[key];
        assert.strictEqual(
          actualType,
          propSpec.type,
          `Property "${key}" expected type "${propSpec.type}", got "${actualType}". ${contextMessage}`
        );
      }
    }
  }
}

function assertZeroEgress(fn, contextMessage = '') {
  require('../../../scripts/egress-guard');
  assert.throws(
    () => fn(),
    (err) => err.code === 'ERR_ZERO_EGRESS_BLOCKED' || err.name === 'EgressBlockedError',
    `Expected network operation to be blocked by egress-guard. ${contextMessage}`
  );
}

function assertDirectoryTree(baseDir, expectedFiles = [], contextMessage = '') {
  const fs = require('node:fs');
  const path = require('node:path');
  for (const rel of expectedFiles) {
    const full = path.join(baseDir, rel);
    assert.ok(fs.existsSync(full), `Expected path "${rel}" to exist inside "${baseDir}". ${contextMessage}`);
  }
}

module.exports = {
  assertSecretRedacted,
  assertMermaidValid,
  assertFrontmatter,
  assertContains,
  assertMatches,
  assertDoesNotMatch,
  assertValidJson,
  assertJsonSchema,
  assertZeroEgress,
  assertDirectoryTree
};
