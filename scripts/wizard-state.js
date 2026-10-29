#!/usr/bin/env node
/**
 * Wizard State Manager (wizard-state.js)
 * Manages session state persistence for Tier 1 and Tier 2 interactive wizard turns.
 */
'use strict';

require('./egress-guard');
const fs = require('fs');
const path = require('path');
const { sanitizeIdentifier } = require('./sanitize-input');
const { scanText } = require('./secret-scan');

const DEFAULT_STATE_PATH = path.resolve(process.cwd(), 'docs/.architect-wizard-state.json');

const VALID_AESTHETICS = [
  'neubrutalism',
  'bento-grid',
  'glassmorphism',
  'swiss-editorial',
  'clean-saas',
  'material-3',
  'neumorphism',
  'retro-terminal',
];

const VALID_UI_LIBRARIES = [
  'tailwind-shadcn',
  'daisyui',
  'mantine',
  'chakra',
  'antd',
  'mui',
];

function initState(options = {}, stateFilePath = DEFAULT_STATE_PATH) {
  const dir = path.dirname(stateFilePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const state = {
    schema_version: '1.0.0',
    status: 'in_progress',
    tier: options.tier === 'tier1' ? 'tier1' : 'tier2',
    project_name: sanitizeIdentifier(options.project || 'enterprise-system'),
    current_stage: 0,
    selections: {
      requirements: options.requirements || ['PRD', 'BRD', 'SRD'],
      architecture_style: options.architecture || 'clean-architecture',
      ui_library: VALID_UI_LIBRARIES.includes(options.ui_library)
        ? options.ui_library
        : 'tailwind-shadcn',
      fe_aesthetic: VALID_AESTHETICS.includes(options.fe_aesthetic)
        ? options.fe_aesthetic
        : 'neubrutalism',
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { maskedText } = scanText(JSON.stringify(state, null, 2));
  fs.writeFileSync(stateFilePath, maskedText, 'utf8');
  return JSON.parse(maskedText);
}

function loadState(stateFilePath = DEFAULT_STATE_PATH) {
  if (!fs.existsSync(stateFilePath)) return null;
  return JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
}

function updateState(patch = {}, stateFilePath = DEFAULT_STATE_PATH) {
  const current = loadState(stateFilePath) || initState({}, stateFilePath);
  const updated = {
    ...current,
    ...patch,
    selections: {
      ...(current.selections || {}),
      ...(patch.selections || {}),
    },
    updated_at: new Date().toISOString(),
  };
  const { maskedText } = scanText(JSON.stringify(updated, null, 2));
  fs.writeFileSync(stateFilePath, maskedText, 'utf8');
  return JSON.parse(maskedText);
}

function finalizeState(stateFilePath = DEFAULT_STATE_PATH) {
  return updateState({ status: 'completed', current_stage: 5 }, stateFilePath);
}

if (require.main === module) {
  const cmd = process.argv[2] || 'status';
  if (cmd === 'init') {
    const res = initState({ project: process.argv[3] || 'architect-project' });
    console.log(JSON.stringify(res, null, 2));
  } else if (cmd === 'finalize') {
    const res = finalizeState();
    console.log(JSON.stringify(res, null, 2));
  } else {
    console.log(JSON.stringify(loadState() || { status: 'no_active_session' }, null, 2));
  }
}

module.exports = {
  VALID_AESTHETICS,
  VALID_UI_LIBRARIES,
  initState,
  loadState,
  updateState,
  finalizeState,
};
