/**
 * Test Context and Environment Isolation Helper
 * Zero-dependency utilities for creating temp sandboxes and inspecting project state.
 */

const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const crypto = require('node:crypto');

const PROJECT_ROOT = path.resolve(__dirname, '../../..');

class TestContext {
  constructor(name = 'test-run') {
    this.id = crypto.randomBytes(6).toString('hex');
    this.baseDir = path.join(os.tmpdir(), `arch-skill-${name}-${this.id}`);
    this.createdDirs = [];
    this.createdFiles = [];
  }

  setup() {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
    return this.baseDir;
  }

  cleanup() {
    try {
      if (fs.existsSync(this.baseDir)) {
        fs.rmSync(this.baseDir, { recursive: true, force: true });
      }
    } catch (e) {
      // Ignore cleanup error in temp
    }
  }

  createDir(relativePath) {
    const fullPath = path.join(this.baseDir, relativePath);
    fs.mkdirSync(fullPath, { recursive: true });
    this.createdDirs.push(fullPath);
    return fullPath;
  }

  createFile(relativePath, content = '') {
    const fullPath = path.join(this.baseDir, relativePath);
    const parentDir = path.dirname(fullPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(fullPath, content, 'utf8');
    this.createdFiles.push(fullPath);
    return fullPath;
  }

  readFile(relativePath) {
    const fullPath = path.isAbsolute(relativePath) ? relativePath : path.join(this.baseDir, relativePath);
    return fs.readFileSync(fullPath, 'utf8');
  }

  fileExists(relativePath) {
    const fullPath = path.isAbsolute(relativePath) ? relativePath : path.join(this.baseDir, relativePath);
    return fs.existsSync(fullPath);
  }

  computeHash(content) {
    return crypto.createHash('sha256').update(content).digest('hex');
  }
}

function getProjectRoot() {
  return PROJECT_ROOT;
}

function readProjectFile(relativePath) {
  const fullPath = path.join(PROJECT_ROOT, relativePath);
  if (!fs.existsSync(fullPath)) {
    throw new Error(`Project file does not exist: ${relativePath}`);
  }
  return fs.readFileSync(fullPath, 'utf8');
}

function projectFileExists(relativePath) {
  return fs.existsSync(path.join(PROJECT_ROOT, relativePath));
}

module.exports = {
  PROJECT_ROOT,
  TestContext,
  getProjectRoot,
  readProjectFile,
  projectFileExists
};
