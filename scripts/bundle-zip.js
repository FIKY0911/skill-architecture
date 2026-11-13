#!/usr/bin/env node
/**
 * Bundle Builder for architect-skill (bundle-zip.js)
 * Packages the skill into a clean, standalone .zip archive ready for direct upload
 * into AI agents (e.g. Claude Projects, ChatGPT Custom GPTs, Cursor, Antigravity).
 *
 * Excludes: .git, node_modules, temp files, test caches, local credentials.
 */
'use strict';

require('./egress-guard');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const ROOT_DIR = path.resolve(__dirname, '..');
const OUTPUT_ZIP = path.join(ROOT_DIR, 'architect-skill.zip');

const EXCLUDE_PATTERNS = [
  '*.git*',
  '*node_modules*',
  '*.architect-wizard-state.json*',
  '*.DS_Store*',
  '*architect-skill.zip*',
  '*.tgz*',
  '*tests/fixtures/secret*',
  '*.env*',
  '*secrets*'
];

function buildZipBundle() {
  console.log('Building standalone architect-skill.zip bundle...');

  if (fs.existsSync(OUTPUT_ZIP)) {
    fs.unlinkSync(OUTPUT_ZIP);
  }

  // Use zip CLI or Python fallback
  try {
    const excludeFlags = EXCLUDE_PATTERNS.map((p) => `-x "${p}"`).join(' ');
    execSync(`zip -r "${OUTPUT_ZIP}" . ${excludeFlags}`, {
      cwd: ROOT_DIR,
      stdio: 'pipe',
    });
  } catch (err) {
    // Python 3 fallback
    const pyScript = `
import zipfile, os, fnmatch

root_dir = r"${ROOT_DIR}"
output_zip = r"${OUTPUT_ZIP}"
excludes = [${EXCLUDE_PATTERNS.map((p) => `"${p.replace(/\*/g, '')}"`).join(', ')}]

def is_excluded(path_str):
    for exc in excludes:
        if exc and exc in path_str:
            return True
    return False

with zipfile.ZipFile(output_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
    for root, dirs, files in os.walk(root_dir):
        rel_root = os.path.relpath(root, root_dir)
        if is_excluded(rel_root):
            continue
        for file in files:
            if is_excluded(file) or file.endswith('.zip') or file.endswith('.tgz'):
                continue
            full_path = os.path.join(root, file)
            arcname = os.path.relpath(full_path, root_dir)
            zipf.write(full_path, arcname)
`;
    execSync(`python3 -c '${pyScript}'`, { cwd: ROOT_DIR, stdio: 'inherit' });
  }

  if (fs.existsSync(OUTPUT_ZIP)) {
    const stats = fs.statSync(OUTPUT_ZIP);
    const sizeKB = (stats.size / 1024).toFixed(1);
    console.log(`✔ Bundle created successfully: architect-skill.zip (${sizeKB} KB)`);
    return { success: true, path: OUTPUT_ZIP, sizeKB };
  } else {
    throw new Error('Failed to create architect-skill.zip');
  }
}

if (require.main === module) {
  buildZipBundle();
}

module.exports = { buildZipBundle };
