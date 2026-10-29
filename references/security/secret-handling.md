# Secret Handling & Zero-Credential Architecture

**Standard**: NIST SP 800-57 (Recommendation for Key Management) & OWASP Secrets Management Cheat Sheet  
**Target Subsystem**: `architect-skill` Security & Containment Layer

---

## 1. Core Architectural Axiom: Zero-Credential Exposure

`architect-skill` enforces an uncompromising **Zero-Credential Architecture**:
1. **No Host AI Credential Access**: The skill and its scripts are strictly prohibited from reading environment variables or configuration files belonging to the host AI agent (`ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `~/.claude/`, `~/.cursor/`, `~/.codex/`).
2. **No Application/APK Secret Access**: The skill is strictly prohibited from reading application secret files (`.env`, `.env.*`, `*.pem`, `*.key`, `*.keystore`, `*.jks`, `*.p12`, `*.pfx`, `secrets/`, `credentials/`).
3. **No Secret Persistence in Output**: Every document emitted to `./docs/` must contain **zero real credentials**. Connection strings, API keys, and tokens must use deterministic semantic placeholders (e.g., `[REDACTED:DB_PASSWORD]` or `{{SECRET_STRIPE_API_KEY}}`).

---

## 2. Secret Lifecycle & Redaction Pipeline

```
[Raw Context / User Input]
            │
            ▼
┌─────────────────────────────────────────┐
│ 1. Path & Scope Guard                   │
│    (policies/filesystem-scope.json)     │
│    Blocks .env, *.pem, *.key, *.jks     │
└───────────┬─────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│ 2. Regex Secret Scanner                 │
│    (scripts/secret-scan.js)             │
│    Applies policies/redaction-rules.json│
└───────────┬─────────────────────────────┘
            │
            ▼
┌─────────────────────────────────────────┐
│ 3. Deterministic Redaction & Audit Log  │
│    Replaces value -> [REDACTED:<TYPE>]  │
│    Logs event without secret payload    │
└─────────────────────────────────────────┘
```

---

## 3. Canonical Redaction Rules

| Rule ID | Secret Category | Detection Pattern Summary | Masked Placeholder |
| :--- | :--- | :--- | :--- |
| `RULE-AWS-KEY` | AWS IAM Access Key ID | `\b(AKIA\|ABIA\|ACCA\|ASIA)[0-9A-Z]{16}\b` | `[REDACTED:AWS_KEY]` |
| `RULE-AWS-SECRET` | AWS Secret Access Key | 40-char base64 assigned to `aws_secret_access_key` | `[REDACTED:AWS_SECRET]` |
| `RULE-GITHUB-TOKEN` | GitHub PAT / App Token | `\b(gh[pousr]_[A-Za-z0-9_]{36,255}\|github_pat_[A-Za-z0-9_]{82})\b` | `[REDACTED:GITHUB_TOKEN]` |
| `RULE-ANTHROPIC-KEY` | Anthropic API Key | `\bsk-ant-api03-[A-Za-z0-9_-]{93}AA\b` | `[REDACTED:ANTHROPIC_KEY]` |
| `RULE-OPENAI-KEY` | OpenAI Project/User Key | `\bsk-(proj-)?[A-Za-z0-9_-]{40,}\b` | `[REDACTED:OPENAI_KEY]` |
| `RULE-GEMINI-KEY` | Google Gemini / Cloud Key | `\bAIzaSy[0-9A-Za-z_-]{33}\b` | `[REDACTED:GEMINI_API_KEY]` |
| `RULE-PRIVATE-KEY` | PEM / OpenSSH Private Key | `-----BEGIN ... PRIVATE KEY-----` block | `[REDACTED:PRIVATE_KEY_BLOCK]` |
| `RULE-JWT-TOKEN` | JSON Web Token (JWT) | `\beyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\b` | `[REDACTED:JWT_TOKEN]` |
| `RULE-URI-PASSWORD` | Database / Broker URI | `(postgres\|mysql\|mongodb\|redis\|amqp)://user:pass@host` | `[REDACTED:DB_PASSWORD]` |
| `RULE-ANDROID-KEYSTORE` | Android APK Keystore Pass | `storePassword\|keyPassword\s*[:=]\s*["'][^"']+["']` | `[REDACTED:APK_KEYSTORE_SECRET]` |
| `RULE-GENERIC-SECRET` | Generic Secret Assignment | `(password\|secret\|api_key\|token)\s*[:=]\s*["'][^"']{8,}["']` | `[REDACTED:GENERIC_SECRET]` |

---

## 4. Safe Placeholder Patterns in Architecture Docs

When documenting environment variables or connection strings in `./docs/`, always use structural placeholders:

```ini
# SAFE EXAMPLE (Allowed in ./docs/)
DATABASE_URL="postgresql://app_user:{{SECRET_DB_PASSWORD}}@db.internal:5432/orders_db?sslmode=require"
REDIS_URL="rediss://:{{SECRET_REDIS_AUTH}}@cache.internal:6379/0"
JWT_PUBLIC_KEY_PATH="/etc/certs/jwt-public.pem"
```

Never include real development passwords, staging tokens, or base64-encoded private keys in examples.
