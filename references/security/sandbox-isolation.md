# Sandbox Isolation: Landlock LSM, Containers & MicroVMs

**Standard**: Linux Kernel Landlock LSM, OCI Runtime Spec, and AWS Firecracker MicroVM Architecture  
**Target Subsystem**: `architect-skill/sandbox/`

---

## 1. Comparative Isolation Matrix

| Isolation Technology | Kernel Sharing | Startup Latency | Memory Overhead | Network Confinement | Filesystem Confinement | Recommended Use Case |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Linux Landlock LSM** | Shared host kernel (unprivileged syscall filtering) | **< 1 ms** | **~0 MB** | TCP bind/connect port restrictions (ABI v4+) | Fine-grained path hierarchy allowlisting | Local CLI script execution (`scripts/*.js`) |
| **Docker / Podman (`--network=none`)** | Shared host kernel (cgroups v2 + namespaces + seccomp) | **150 – 500 ms** | **15 – 30 MB** | Complete virtual netns isolation (`lo` only) | Read-only rootfs + explicit bind mount (`./docs/`) | CI/CD pipelines & isolated batch generation |
| **MicroVM (Firecracker / Kata)** | Dedicated guest kernel via KVM hypervisor | **125 – 300 ms** | **64 – 128 MB** | Hardware-virtualized virtio-net disabled | Ephemeral block device | Multi-tenant cloud or untrusted third-party plugins |

---

## 2. Container Hardening Flags (`sandbox/run.sh`)

When running `architect-skill` inside Docker or Podman, the following security flags are mandatory:
- `--network=none`: Disables all external network interfaces.
- `--read-only`: Mounts the container root filesystem as read-only.
- `--user 10001:10001`: Executes as an unprivileged non-root UID/GID.
- `--cap-drop=ALL`: Drops all Linux capabilities (`CAP_NET_RAW`, `CAP_SYS_ADMIN`, etc.).
- `--security-opt=no-new-privileges:true`: Prevents privilege escalation via setuid/setgid binaries.
- `-v "$(pwd)/docs:/workspace/docs:rw"`: Grants write access exclusively to `./docs/`.
