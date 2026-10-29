#!/usr/bin/env node
/**
 * Cross-Platform Multi-Agent Installer (install.js)
 * Supports --global, --local, --uninstall, --dry-run, --target <agent>.
 * Creates automatic timestamped backups in ~/.architect-skill-backup/<timestamp>/.
 */
'use strict';

require('./egress-guard');
const fs = require('fs');
const os = require('os');
const path = require('path');
const readline = require('readline');

const SKILL_ROOT = path.resolve(__dirname, '..');

const AGENT_ALIASES = {
  agy: 'antigravity',
  antigravity: 'antigravity',
  claude: 'claude',
  codex: 'codex',
  cursor: 'cursor',
  continue: 'continue',
  windsurf: 'windsurf',
  cline: 'cline',
  all: null,
};

const AGENT_CATALOG = [
  {
    id: 'antigravity',
    name: 'Google Antigravity (AGY)',
    binaries: ['agy', 'antigravity'],
    probeDirs: ['.gemini/antigravity-cli', '.gemini', '.agy'],
  },
  {
    id: 'claude',
    name: 'Claude Code & Desktop',
    binaries: ['claude'],
    probeDirs: ['.claude', '.config/Claude'],
  },
  {
    id: 'cursor',
    name: 'Cursor IDE',
    binaries: ['cursor'],
    probeDirs: ['.cursor', '.config/Cursor'],
  },
  {
    id: 'windsurf',
    name: 'Codeium Windsurf',
    binaries: ['windsurf'],
    probeDirs: ['.codeium/windsurf', '.windsurf', '.config/Windsurf'],
  },
  {
    id: 'continue',
    name: 'Continue.dev',
    binaries: [],
    probeDirs: ['.continue'],
    vscodeExtPrefix: 'continue.continue',
  },
  {
    id: 'cline',
    name: 'Cline Autonomous Agent',
    binaries: [],
    probeDirs: [],
    vscodeExtPrefix: 'saoudrizwan.claude-dev',
  },
  {
    id: 'codex',
    name: 'OpenAI Codex CLI',
    binaries: ['codex'],
    probeDirs: ['.codex'],
  },
];

function commandExistsInPath(binName) {
  const pathEnv = process.env.PATH || '';
  const pathDirs = pathEnv.split(path.delimiter).filter(Boolean);
  for (const dir of pathDirs) {
    const fullPath = path.join(dir, binName);
    try {
      if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
        return fullPath;
      }
    } catch (_) {
      // ignore inaccessible PATH entry
    }
  }
  return null;
}

function hasVsCodeExtension(homeDir, extPrefix) {
  if (!extPrefix) return null;
  const extRoots = [
    path.join(homeDir, '.vscode/extensions'),
    path.join(homeDir, '.cursor/extensions'),
    path.join(homeDir, '.windsurf/extensions'),
    path.join(homeDir, '.antigravity/extensions'),
  ];
  for (const root of extRoots) {
    try {
      if (!fs.existsSync(root)) continue;
      const entries = fs.readdirSync(root);
      const match = entries.find((e) => e.toLowerCase().startsWith(extPrefix.toLowerCase()));
      if (match) return path.join(root, match);
    } catch (_) {
      // ignore
    }
  }
  return null;
}

function detectInstalledAgents(homeDir = os.homedir(), projectDir = process.cwd()) {
  const globalMap = getAgentMappings(homeDir, true);
  const localMap = getAgentMappings(projectDir, false);

  return AGENT_CATALOG.map((meta, idx) => {
    const reasons = [];
    for (const bin of meta.binaries) {
      const binPath = commandExistsInPath(bin);
      if (binPath) reasons.push(`binary: ${binPath}`);
    }
    for (const relDir of meta.probeDirs) {
      const fullDir = path.join(homeDir, relDir);
      if (fs.existsSync(fullDir)) reasons.push(`dir: ~/${relDir}`);
    }
    const extMatch = hasVsCodeExtension(homeDir, meta.vscodeExtPrefix);
    if (extMatch) reasons.push(`ext: ${path.basename(extMatch)}`);

    const globalCfg = globalMap[meta.id];
    const localCfg = localMap[meta.id];
    const skillInstalledGlobal = Boolean(globalCfg && fs.existsSync(globalCfg.dest));
    const skillInstalledLocal = Boolean(localCfg && fs.existsSync(localCfg.dest));

    return {
      index: idx + 1,
      id: meta.id,
      name: meta.name,
      detected: reasons.length > 0,
      reasons,
      skillInstalledGlobal,
      skillInstalledLocal,
    };
  });
}

function normalizeTarget(rawTarget) {
  if (!rawTarget) return null;
  const key = String(rawTarget).toLowerCase().trim();
  return Object.prototype.hasOwnProperty.call(AGENT_ALIASES, key) ? AGENT_ALIASES[key] : key;
}

function getAgentMappings(baseDir, isGlobal) {
  if (isGlobal) {
    return {
      claude: { src: SKILL_ROOT, dest: path.join(baseDir, '.claude/skills/architect-skill'), type: 'dir' },
      antigravity: {
        src: SKILL_ROOT,
        dest: path.join(baseDir, '.agy/skills/architect-skill'),
        extraDests: [
          path.join(baseDir, '.gemini/config/skills/architect-skill'),
          path.join(baseDir, '.gemini/skills/architect-skill'),
        ],
        type: 'dir',
      },
      codex: { src: SKILL_ROOT, dest: path.join(baseDir, '.codex/skills/architect-skill'), type: 'dir' },
      cursor: { src: path.join(SKILL_ROOT, 'adapters/cursor/architect-skill.mdc'), dest: path.join(baseDir, '.cursor/rules/architect-skill.mdc'), type: 'file' },
      continue: { src: path.join(SKILL_ROOT, 'adapters/continue/architect-skill.prompt'), dest: path.join(baseDir, '.continue/prompts/architect-skill.prompt'), type: 'file' },
      windsurf: { src: path.join(SKILL_ROOT, 'adapters/windsurf/.windsurfrules'), dest: path.join(baseDir, '.codeium/windsurf/.windsurfrules'), type: 'file' },
    };
  }
  return {
    claude: { src: SKILL_ROOT, dest: path.join(baseDir, '.claude/skills/architect-skill'), type: 'dir' },
    antigravity: {
      src: SKILL_ROOT,
      dest: path.join(baseDir, '.agy/skills/architect-skill'),
      extraDests: [
        path.join(baseDir, '.agents/skills/architect-skill'),
      ],
      type: 'dir',
    },
    codex: { src: SKILL_ROOT, dest: path.join(baseDir, '.codex/skills/architect-skill'), type: 'dir' },
    cursor: { src: path.join(SKILL_ROOT, 'adapters/cursor/architect-skill.mdc'), dest: path.join(baseDir, '.cursor/rules/architect-skill.mdc'), type: 'file' },
    continue: { src: path.join(SKILL_ROOT, 'adapters/continue/architect-skill.prompt'), dest: path.join(baseDir, '.continue/prompts/architect-skill.prompt'), type: 'file' },
    windsurf: { src: path.join(SKILL_ROOT, 'adapters/windsurf/.windsurfrules'), dest: path.join(baseDir, '.windsurfrules'), type: 'file' },
    cline: { src: path.join(SKILL_ROOT, 'adapters/cline/.clinerules'), dest: path.join(baseDir, '.clinerules'), type: 'file' },
  };
}

function runInstall(options = {}) {
  const isGlobal = Boolean(options.global);
  const dryRun = Boolean(options.dryRun);
  const uninstall = Boolean(options.uninstall);
  const baseDir = options.baseDir || (isGlobal ? os.homedir() : process.cwd());
  const backupRoot = options.backupRoot || path.join(os.homedir(), '.architect-skill-backup', String(Date.now()));
  const normalizedTarget = normalizeTarget(options.target);
  const mappings = getAgentMappings(baseDir, isGlobal);
  const actions = [];

  for (const [agent, cfg] of Object.entries(mappings)) {
    if (normalizedTarget && normalizedTarget !== agent) continue;

    const allTargets = [cfg.dest, ...(cfg.extraDests || [])];

    for (const targetDest of allTargets) {
      if (uninstall) {
        actions.push({ agent, action: 'uninstall', target: targetDest, dryRun });
        if (!dryRun && fs.existsSync(targetDest)) {
          fs.rmSync(targetDest, { recursive: true, force: true });
        }
        continue;
      }

      if (fs.existsSync(targetDest)) {
        const relSubpath = targetDest === cfg.dest ? path.basename(targetDest) : path.relative(baseDir, targetDest);
        const backupDest = path.join(backupRoot, agent, relSubpath);
        actions.push({ agent, action: 'backup', from: targetDest, to: backupDest, dryRun });
        if (!dryRun) {
          fs.mkdirSync(path.dirname(backupDest), { recursive: true });
          fs.cpSync(targetDest, backupDest, { recursive: true });
          fs.rmSync(targetDest, { recursive: true, force: true });
        }
      }

      actions.push({ agent, action: 'install', source: cfg.src, target: targetDest, dryRun });
      if (!dryRun) {
        fs.mkdirSync(path.dirname(targetDest), { recursive: true });
        try {
          fs.symlinkSync(cfg.src, targetDest, cfg.type === 'dir' ? 'junction' : 'file');
        } catch (_) {
          fs.cpSync(cfg.src, targetDest, { recursive: true });
        }
      }
    }
  }

  return {
    success: true,
    mode: isGlobal ? 'global' : 'local',
    target: normalizedTarget || 'all',
    dryRun,
    uninstall,
    backupRoot: actions.some((a) => a.action === 'backup') ? backupRoot : null,
    actions,
  };
}

function registerGlobalCli(homeDir = os.homedir(), dryRun = false) {
  const binDir = path.join(homeDir, '.local', 'bin');
  const scriptSrc = path.join(SKILL_ROOT, 'run-skill-architect.sh');
  const targets = [
    path.join(binDir, 'run-skill-architect.sh'),
    path.join(binDir, 'run-skill-architect'),
  ];
  const installed = [];
  if (!dryRun) {
    fs.mkdirSync(binDir, { recursive: true });
  }
  for (const dest of targets) {
    if (!dryRun) {
      if (fs.existsSync(dest) || fs.lstatSync(dest, { throwIfNoEntry: false })) {
        fs.rmSync(dest, { recursive: true, force: true });
      }
      try {
        fs.symlinkSync(scriptSrc, dest, 'file');
      } catch (_) {
        fs.cpSync(scriptSrc, dest);
        fs.chmodSync(dest, 0o755);
      }
    }
    installed.push(dest);
  }
  return { binDir, source: scriptSrc, commands: installed, dryRun };
}

function createPromptAsker(rl) {
  const lines = [];
  const waiters = [];
  let closed = false;

  rl.on('line', (line) => {
    if (waiters.length > 0) {
      const resolve = waiters.shift();
      resolve(String(line || '').trim());
    } else {
      lines.push(String(line || '').trim());
    }
  });

  rl.on('close', () => {
    closed = true;
    while (waiters.length > 0) {
      const resolve = waiters.shift();
      resolve('');
    }
  });

  return function ask(promptText) {
    process.stdout.write(promptText);
    if (lines.length > 0) {
      const next = lines.shift();
      process.stdout.write(`${next}\n`);
      return Promise.resolve(next);
    }
    if (closed) {
      return Promise.resolve('');
    }
    return new Promise((resolve) => {
      waiters.push(resolve);
    });
  };
}

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
};

function stripAnsi(str) {
  return String(str).replace(/\x1b\[[0-9;]*m/g, '');
}

function padCell(text, width) {
  const visibleLen = stripAnsi(text).length;
  const diff = width - visibleLen;
  return diff > 0 ? text + ' '.repeat(diff) : text;
}

function truncateText(str, maxLen) {
  const s = String(str || '');
  return s.length <= maxLen ? s : `${s.slice(0, maxLen - 1)}…`;
}

function shortenHome(p, homeDir) {
  if (!p) return '';
  return p.startsWith(homeDir) ? `~${p.slice(homeDir.length)}` : p;
}

async function runInteractiveCLI(cliOptions = {}) {
  const homeDir = os.homedir();
  const projectDir = process.cwd();
  const detectedList = detectInstalledAgents(homeDir, projectDir);
  const detectedOnly = detectedList.filter((a) => a.detected);

  const COL = {
    no: 4,
    agent: 27,
    id: 13,
    host: 16,
    skill: 15,
    source: 26,
  };

  const hBorder = (l, m, r) =>
    `${C.gray}${l}${'─'.repeat(COL.no + 2)}${m}${'─'.repeat(COL.agent + 2)}${m}${'─'.repeat(COL.id + 2)}${m}${'─'.repeat(COL.host + 2)}${m}${'─'.repeat(COL.skill + 2)}${m}${'─'.repeat(COL.source + 2)}${r}${C.reset}`;

  const renderRow = (c1, c2, c3, c4, c5, c6) =>
    `${C.gray}│${C.reset} ${padCell(c1, COL.no)} ${C.gray}│${C.reset} ${padCell(c2, COL.agent)} ${C.gray}│${C.reset} ${padCell(c3, COL.id)} ${C.gray}│${C.reset} ${padCell(c4, COL.host)} ${C.gray}│${C.reset} ${padCell(c5, COL.skill)} ${C.gray}│${C.reset} ${padCell(c6, COL.source)} ${C.gray}│${C.reset}`;

  console.log('');
  console.log(`${C.brightCyan}╔═════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗${C.reset}`);
  console.log(`${C.brightCyan}║${C.reset}  ${C.bold}${C.brightWhite}ARCHITECT-SKILL${C.reset} ${C.gray}│${C.reset} ${C.brightYellow}Interactive Multi-Agent Installer & Auto-Detector${C.reset}                                            ${C.brightCyan}║${C.reset}`);
  console.log(`${C.brightCyan}╚═════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝${C.reset}`);
  console.log(`  ${C.gray}•${C.reset} ${C.bold}Repository Root :${C.reset} ${C.cyan}${shortenHome(SKILL_ROOT, homeDir)}${C.reset}`);
  console.log(`  ${C.gray}•${C.reset} ${C.bold}Active Directory:${C.reset} ${C.cyan}${shortenHome(projectDir, homeDir)}${C.reset}`);
  console.log(`  ${C.gray}•${C.reset} ${C.bold}Detected Agents :${C.reset} ${C.brightGreen}${detectedOnly.length} dari ${detectedList.length} AI Agent terdeteksi di laptop Anda${C.reset}\n`);

  console.log(hBorder('┌', '┬', '┐'));
  console.log(
    renderRow(
      `${C.bold}${C.brightWhite}No${C.reset}`,
      `${C.bold}${C.brightWhite}AI Agent / IDE Platform${C.reset}`,
      `${C.bold}${C.brightWhite}Target ID${C.reset}`,
      `${C.bold}${C.brightWhite}Status di Laptop${C.reset}`,
      `${C.bold}${C.brightWhite}Status Skill${C.reset}`,
      `${C.bold}${C.brightWhite}Bukti Deteksi${C.reset}`
    )
  );
  console.log(hBorder('├', '┼', '┤'));

  for (const item of detectedList) {
    const noCell = item.detected
      ? `${C.bold}${C.brightCyan}[${item.index}]${C.reset}`
      : `${C.gray}[${item.index}]${C.reset}`;

    const nameCell = item.detected
      ? `${C.bold}${C.brightWhite}${item.name}${C.reset}`
      : `${C.gray}${item.name}${C.reset}`;

    const idCell = item.detected
      ? `${C.yellow}${item.id}${C.reset}`
      : `${C.gray}${item.id}${C.reset}`;

    const hostCell = item.detected
      ? `${C.bold}${C.brightGreen}● TERDETEKSI${C.reset}`
      : `${C.gray}○ Belum Ada${C.reset}`;

    const installBadges = [];
    if (item.skillInstalledGlobal) installBadges.push('Global');
    if (item.skillInstalledLocal) installBadges.push('Lokal');
    const skillCell =
      installBadges.length > 0
        ? `${C.brightCyan}✓ ${installBadges.join('+')} Aktif${C.reset}`
        : `${C.gray}- Belum Pasang${C.reset}`;

    const rawReason = item.detected
      ? item.reasons.map((r) => shortenHome(r.replace(/^(binary|dir|ext):\s*/, ''), homeDir)).join(', ')
      : '-';
    const sourceCell = item.detected
      ? `${C.white}${truncateText(rawReason, COL.source)}${C.reset}`
      : `${C.gray}-${C.reset}`;

    console.log(renderRow(noCell, nameCell, idCell, hostCell, skillCell, sourceCell));
  }

  console.log(hBorder('└', '┴', '┘'));

  const detectedIdsStr = detectedOnly.map((a) => `${C.brightGreen}${a.id}${C.reset}`).join(', ') || `${C.gray}tidak ada${C.reset}`;

  console.log(`\n${C.bold}${C.brightWhite}PILIHAN AKSI INSTALASI:${C.reset}`);
  console.log(`  ${C.bold}${C.brightGreen}[d]${C.reset}  Install ke ${C.bold}SEMUA Agent yang TERDETEKSI${C.reset} (${detectedIdsStr}) ${C.brightYellow}★ Rekomendasi${C.reset}`);
  console.log(`  ${C.bold}${C.brightCyan}[a]${C.reset}  Install ke ${C.bold}SEMUA 7 Agent${C.reset} sekaligus`);
  console.log(`  ${C.bold}${C.brightYellow}[1-7]${C.reset} Pilih spesifik: ketik ${C.bold}nomor${C.reset} (misal: ${C.cyan}1${C.reset} atau ${C.cyan}1,2,5${C.reset}) atau ${C.bold}ID agent${C.reset} (misal: ${C.cyan}agy,claude${C.reset})`);
  console.log(`  ${C.bold}${C.magenta}[g]${C.reset}  Sinkronkan command global ${C.cyan}run-skill-architect.sh${C.reset} ke ${C.cyan}~/.local/bin${C.reset} (PATH)`);
  console.log(`  ${C.bold}${C.red}[u]${C.reset}  Uninstall / cabut ${C.bold}architect-skill${C.reset}`);
  console.log(`  ${C.bold}${C.gray}[q]${C.reset}  Batal / Keluar`);
  console.log(`${C.gray}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────${C.reset}`);

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const askQuestion = createPromptAsker(rl);
  try {
    const rawChoice = (await askQuestion(`\n${C.bold}${C.brightCyan}❯${C.reset} ${C.bold}Masukkan pilihan Anda${C.reset} ${C.gray}[default: d]${C.reset}: `)) || 'd';
    const choice = rawChoice.toLowerCase();

    if (choice === 'q' || choice === 'exit') {
      console.log(`\n${C.yellow}⚠ Instalasi dibatalkan.${C.reset}\n`);
      return { cancelled: true };
    }

    if (choice === 'g') {
      const reg = registerGlobalCli(homeDir, Boolean(cliOptions.dryRun));
      console.log(`\n${C.brightGreen}✔ [SUKSES] Command global terdaftar di PATH:${C.reset}`);
      for (const cmd of reg.commands) console.log(`  ${C.cyan}→ ${shortenHome(cmd, homeDir)}${C.reset}`);
      console.log(`${C.white}Sekarang Anda bisa menjalankan ${C.bold}run-skill-architect.sh${C.reset}${C.white} dari direktori mana saja tanpa ${C.yellow}./${C.reset}!`);
      return reg;
    }

    let isUninstall = Boolean(cliOptions.uninstall);
    let targetSelection = choice;
    if (choice === 'u') {
      isUninstall = true;
      targetSelection =
        (await askQuestion(
          `${C.bold}${C.red}❯${C.reset} ${C.bold}Pilih agent yang ingin di-uninstall${C.reset} (${C.brightGreen}[d]${C.reset} Terdeteksi / ${C.brightCyan}[a]${C.reset} Semua / ${C.brightYellow}[1-7]${C.reset} Nomor) ${C.gray}[default: a]${C.reset}: `
        )) || 'a';
    }

    let selectedAgents = [];
    if (targetSelection === 'd') {
      selectedAgents = detectedOnly.map((a) => a.id);
      if (selectedAgents.length === 0) {
        console.log(`${C.yellow}⚠ Tidak ada agent yang terdeteksi otomatis. Menggunakan seluruh agent.${C.reset}`);
        selectedAgents = detectedList.map((a) => a.id);
      }
    } else if (targetSelection === 'a' || targetSelection === 'all') {
      selectedAgents = detectedList.map((a) => a.id);
    } else {
      const tokens = targetSelection.split(/[\s,]+/).filter(Boolean);
      for (const tok of tokens) {
        const num = Number(tok);
        if (!Number.isNaN(num) && num >= 1 && num <= detectedList.length) {
          selectedAgents.push(detectedList[num - 1].id);
        } else {
          const norm = normalizeTarget(tok);
          if (norm && detectedList.some((a) => a.id === norm)) {
            selectedAgents.push(norm);
          }
        }
      }
      selectedAgents = Array.from(new Set(selectedAgents));
    }

    if (selectedAgents.length === 0) {
      console.log(`\n${C.red}✖ Pilihan agent tidak valid.${C.reset}\n`);
      return { cancelled: true, reason: 'INVALID_SELECTION' };
    }

    let isGlobal = true;
    if (cliOptions.global) {
      isGlobal = true;
    } else if (cliOptions.local) {
      isGlobal = false;
    } else {
      console.log(`\n${C.bold}${C.brightWhite}PILIH CAKUPAN INSTALASI:${C.reset}`);
      console.log(`  ${C.bold}${C.brightGreen}[1]${C.reset} ${C.bold}Global (~/)${C.reset}         — Tersedia di seluruh proyek pada laptop ini ${C.brightYellow}★ Rekomendasi${C.reset}`);
      console.log(`  ${C.bold}${C.brightCyan}[2]${C.reset} ${C.bold}Lokal Proyek (./)${C.reset}   — Hanya dipasang di folder aktif (${C.cyan}${shortenHome(projectDir, homeDir)}${C.reset})`);
      const scopeAns = (await askQuestion(`\n${C.bold}${C.brightCyan}❯${C.reset} ${C.bold}Pilih cakupan${C.reset} ${C.gray}[default: 1]${C.reset}: `)) || '1';
      isGlobal = scopeAns !== '2' && scopeAns.toLowerCase() !== 'local' && scopeAns.toLowerCase() !== 'l';
    }

    const results = [];
    for (const agentId of selectedAgents) {
      const res = runInstall({
        global: isGlobal,
        local: !isGlobal,
        dryRun: Boolean(cliOptions.dryRun),
        uninstall: isUninstall,
        target: agentId,
      });
      results.push(res);
    }

    const cliReg = registerGlobalCli(homeDir, Boolean(cliOptions.dryRun));

    console.log('');
    console.log(`${C.brightGreen}╔═════════════════════════════════════════════════════════════════════════════════════════════════════════════════╗${C.reset}`);
    console.log(`${C.brightGreen}║${C.reset}  ${C.bold}${C.brightWhite}RINGKASAN ${isUninstall ? 'UNINSTALL' : 'INSTALASI'} (${isGlobal ? 'CAKUPAN GLOBAL' : 'CAKUPAN LOKAL PROYEK'})${C.reset}`);
    console.log(`${C.brightGreen}╚═════════════════════════════════════════════════════════════════════════════════════════════════════════════════╝${C.reset}`);
    for (const res of results) {
      for (const act of res.actions) {
        if (act.action === 'install') {
          console.log(`  ${C.brightGreen}✔ [INSTALLED]${C.reset} ${C.bold}${act.agent.padEnd(12)}${C.reset} ${C.gray}→${C.reset} ${C.cyan}${shortenHome(act.target, homeDir)}${C.reset}`);
        } else if (act.action === 'uninstall') {
          console.log(`  ${C.red}✔ [REMOVED]  ${C.reset} ${C.bold}${act.agent.padEnd(12)}${C.reset} ${C.gray}→${C.reset} ${C.cyan}${shortenHome(act.target, homeDir)}${C.reset}`);
        } else if (act.action === 'backup') {
          console.log(`  ${C.yellow}↺ [BACKUP]   ${C.reset} ${C.bold}${act.agent.padEnd(12)}${C.reset} ${C.gray}→${C.reset} ${C.gray}${shortenHome(act.to, homeDir)}${C.reset}`);
        }
      }
    }
    console.log(`${C.gray}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────${C.reset}`);
    console.log(`  ${C.brightCyan}⚡ [GLOBAL CLI]${C.reset} Aktif di PATH: ${C.bold}${C.brightWhite}run-skill-architect.sh${C.reset} & ${C.bold}${C.brightWhite}run-skill-architect${C.reset}`);
    console.log(`${C.gray}───────────────────────────────────────────────────────────────────────────────────────────────────────────────────${C.reset}\n`);

    return {
      success: true,
      interactive: true,
      mode: isGlobal ? 'global' : 'local',
      uninstall: isUninstall,
      selectedAgents,
      results,
      cliReg,
    };
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);
  const targetIdx = args.indexOf('--target');
  const agentIdx = args.indexOf('--agent');
  let targetArg = null;
  if (targetIdx !== -1) targetArg = args[targetIdx + 1];
  else if (agentIdx !== -1) targetArg = args[agentIdx + 1];

  if (args.includes('--detect')) {
    const detected = detectInstalledAgents();
    console.log(JSON.stringify({ detectedAgents: detected.filter((a) => a.detected).map((a) => a.id), agents: detected }, null, 2));
  } else if (args.includes('--register-cli')) {
    const reg = registerGlobalCli(os.homedir(), args.includes('--dry-run'));
    console.log(JSON.stringify(reg, null, 2));
  } else if (args.includes('--interactive') || args.includes('-i')) {
    runInteractiveCLI({
      global: args.includes('--global'),
      local: args.includes('--local'),
      dryRun: args.includes('--dry-run'),
      uninstall: args.includes('--uninstall'),
    }).catch((err) => {
      console.error(err);
      process.exit(1);
    });
  } else if (args.includes('--detected')) {
    const isGlobal = args.includes('--global') || !args.includes('--local');
    const detected = detectInstalledAgents().filter((a) => a.detected);
    const results = detected.map((a) =>
      runInstall({
        global: isGlobal,
        local: !isGlobal,
        dryRun: args.includes('--dry-run'),
        uninstall: args.includes('--uninstall'),
        target: a.id,
      })
    );
    const cliReg = registerGlobalCli(os.homedir(), args.includes('--dry-run'));
    console.log(JSON.stringify({ success: true, mode: isGlobal ? 'global' : 'local', detectedAgents: detected.map((a) => a.id), results, cliReg }, null, 2));
  } else {
    const res = runInstall({
      global: args.includes('--global'),
      local: args.includes('--local') || !args.includes('--global'),
      dryRun: args.includes('--dry-run'),
      uninstall: args.includes('--uninstall'),
      target: targetArg,
    });
    console.log(JSON.stringify(res, null, 2));
  }
}

module.exports = {
  detectInstalledAgents,
  getAgentMappings,
  normalizeTarget,
  registerGlobalCli,
  runInstall,
  runInteractiveCLI,
};
