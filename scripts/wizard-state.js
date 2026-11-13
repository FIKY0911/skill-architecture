#!/usr/bin/env node
/**
 * Wizard State Manager (wizard-state.js)
 * Manages session state persistence for Tier 1 and Tier 2 interactive wizard turns.
 * Supports state pivots (revising architecture style, UI framework, or visual aesthetic mid-flight).
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

const VALID_ARCHITECTURES = [
  'clean-architecture',
  'modular-monolith',
  'event-driven',
  'hexagonal',
  'fsd',
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
    current_stage: options.skip_requirements || options.existing_requirements ? 2 : (options.stage !== undefined ? options.stage : 0),
    selections: {
      requirements: options.requirements || ['PRD', 'BRD', 'SRD'],
      requirements_source: options.skip_requirements || options.existing_requirements ? 'provided' : 'elicited',
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

function pivotStage(pivotOptions = {}, stateFilePath = DEFAULT_STATE_PATH) {
  const current = loadState(stateFilePath) || initState({}, stateFilePath);
  const patch = { selections: {} };

  if (pivotOptions.stage !== undefined) {
    patch.current_stage = Number(pivotOptions.stage);
  }

  if (pivotOptions.architecture) {
    patch.selections.architecture_style = pivotOptions.architecture;
    if (patch.current_stage === undefined) patch.current_stage = 2;
  }

  if (pivotOptions.ui_library) {
    patch.selections.ui_library = VALID_UI_LIBRARIES.includes(pivotOptions.ui_library)
      ? pivotOptions.ui_library
      : current.selections.ui_library;
    if (patch.current_stage === undefined) patch.current_stage = 4;
  }

  if (pivotOptions.fe_aesthetic) {
    patch.selections.fe_aesthetic = VALID_AESTHETICS.includes(pivotOptions.fe_aesthetic)
      ? pivotOptions.fe_aesthetic
      : current.selections.fe_aesthetic;
    if (patch.current_stage === undefined) patch.current_stage = 4;
  }

  return updateState(patch, stateFilePath);
}

function finalizeState(stateFilePath = DEFAULT_STATE_PATH) {
  return updateState({ status: 'completed', current_stage: 5 }, stateFilePath);
}

if (require.main === module) {
  const cmd = process.argv[2] || 'status';
  if (cmd === 'init') {
    const args = process.argv.slice(3);
    const opts = { project: 'architect-project' };
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--tier' && args[i + 1]) opts.tier = args[++i];
      else if (args[i] === '--project' && args[i + 1]) opts.project = args[++i];
      else if (args[i] === '--skip-requirements' || args[i] === '--existing-requirements') opts.skip_requirements = true;
      else if (!args[i].startsWith('--')) opts.project = args[i];
    }
    const res = initState(opts);
    console.log(JSON.stringify(res, null, 2));
  } else if (cmd === 'pivot' || cmd === 'revise') {
    const args = process.argv.slice(3);
    const opts = {};
    for (let i = 0; i < args.length; i++) {
      if (args[i] === '--stage' && args[i + 1]) opts.stage = args[++i];
      else if (args[i] === '--architecture' && args[i + 1]) opts.architecture = args[++i];
      else if (args[i] === '--ui-library' && args[i + 1]) opts.ui_library = args[++i];
      else if (args[i] === '--aesthetic' && args[i + 1]) opts.fe_aesthetic = args[++i];
    }
    const res = pivotStage(opts);
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
  VALID_ARCHITECTURES,
  initState,
  loadState,
  updateState,
  pivotStage,
  finalizeState,
};
