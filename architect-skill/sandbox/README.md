# Execution Sandbox: Landlock LSM vs Docker vs MicroVM

## 1. Containment Architecture
The `sandbox/` directory provides OS-level and container-level isolation outside the AI agent runtime:
- `run.sh` / `run.ps1`: Launches Docker or Podman with `--network=none`, `--read-only`, `--cap-drop=ALL`, and `--user 10001:10001`.
- `Dockerfile`: Minimal Alpine Node.js image stripped of root privileges.
- `landlock-profile.json`: Unprivileged Linux Landlock LSM filesystem allowlist profile.

## 2. Guarantees
1. **Zero Network Egress**: Kernel network namespace has no outbound interface.
2. **Immutable Skill Code**: Root filesystem is mounted read-only; only `/workspace/docs` is writable.
3. **Zero Credential Exposure**: Host `.env`, `~/.ssh`, and AI agent config directories are never mounted into the container.
