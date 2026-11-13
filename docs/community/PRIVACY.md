# Privacy Policy: architect-skill

**Effective Date**: 2026-10-28  
**Version**: 1.0.0

---

## 1. Fundamental Privacy Guarantee: Local-First & Zero-Egress

`architect-skill` is engineered on the axiomatic principle of absolute data sovereignty. Software architecture specifications, entity models, database schemas, and business logic often contain proprietary intellectual property. 

Our privacy promise is straightforward:
- **No Data Leaves Your Machine**: `architect-skill` performs all operations strictly on your local computer.
- **Zero Telemetry**: We do not collect metrics, usage statistics, crash reports, IP addresses, or device fingerprints.
- **Zero Third-Party Beacons**: No tracking pixels, analytics scripts, or remote logging services exist in the repository.
- **No Cloud Dependencies**: The skill operates 100% offline without requiring internet access.

---

## 2. Information Handled by architect-skill

### 2.1 Workspace Data
- **What is accessed**: Only the files explicitly required for software architecture generation, namely the internal reference templates in `references/`, `assets/`, and the target destination folder `./docs/`.
- **Where it is stored**: All generated documents, diagrams, and manifests are written exclusively to `./docs/` within your local workspace.
- **Retention**: You maintain 100% ownership and control over the generated files. Deleting `./docs/` completely purges all generated artifacts.

### 2.2 Credentials and Secrets
- **Zero-Access Mandate**: `architect-skill` is programmed to never read, process, or store passwords, API keys, private certificates, or environment files (`.env`).
- **Automated Masking**: If an AI agent accidentally attempts to insert a credential into an architecture document, the built-in secret scanner replaces the value with a safe placeholder before writing to disk.

### 2.3 Transient State and Audit Logs
- **Wizard State**: Temporary conversational state is written to `.architect-wizard-state.json` solely to allow resumption across multi-turn prompts. It is ignored by Git and can be deleted at any time with `node scripts/wizard-state.js reset`.
- **Local Audit Log**: An append-only audit trail is kept at `docs/.architect-audit.log` containing event timestamps, action names, and output paths. No user prompt text or sensitive values are recorded.

---

## 3. Compliance and Standards Alignment

`architect-skill` is designed to assist organizations in meeting stringent global privacy frameworks:
- **GDPR (General Data Protection Regulation)**: Complies with Article 25 (Data protection by design and by default) by executing completely offline without processing personal identifiable information (PII).
- **HIPAA & PCI-DSS**: Compatible with air-gapped secure development enclaves where external network transmission of architecture documents is legally prohibited.
- **SOC 2 Type II**: Supports local auditability through deterministic generation manifests (`.architect-manifest.json`) and SHA-256 verification hashes.

---

## 4. Inquiries

Because `architect-skill` does not operate servers, collect databases, or maintain user accounts, we do not hold any personal data about you. For questions regarding the open-source code and security architecture, please inspect the source code directly or consult `SECURITY.md`.
