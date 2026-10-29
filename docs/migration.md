# Migration & Version Upgrade Guide

## Upgrading `architect-skill`
1. Run `node scripts/install.js --global` or `--local`.
2. Existing agent rule files are automatically backed up to `~/.architect-skill-backup/<timestamp>/`.
3. Run `node scripts/doctor.js` and `node runtime-firewall/verify.js` to confirm SHA-256 pin integrity.
