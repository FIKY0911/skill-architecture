# Spesifikasi Formal: Wizard Orchestrator, Struktur Output `./docs/`, dan Adapter Multi-Agent

**Dokumen Referensi**: `spec_wizard.md`  
**Otoritas**: John McCarthy (The Formal Logician / Foundational Architect)  
**Target Komponen**: `architect-skill`  
**Status**: Spesifikasi Terverifikasi (Normatif & Autoritatif)  
**Tanggal**: 2026-10-28  

---

## 1. Prinsip Dasar dan Landasan Aksiomatis

Sistem `architect-skill` dirancang sebagai mesin inferensi arsitektural deterministik. Berbeda dengan pembuatan kode berbasis tebakan heuristik acak, sistem ini menerapkan prinsip *constructive minimalism* dan *formal traceability*: setiap artefak teknis yang dihasilkan pada direktori `./docs/` harus memiliki rantai keterlacakan (*traceability chain*) yang bermuara pada kebutuhan terverifikasi (PRD/BRD/SRD), keputusan arsitektur eksplisit (ADR), model data formal (ERD/C4), dan tata kelola keamanan *zero-egress*.

### Aksioma Desain
1. **Determinisme dan Keterlacakan**: Setiap entitas kode atau modul sistem wajib memiliki pemetaan langsung ke bab kebutuhan dan keputusan ADR terkait. Tidak ada artefak tanpa alasan komputasional atau bisnis yang eksplisit.
2. **Kemandirian Lingkungan (Zero-Egress & Local-First)**: Sistem beroperasi penuh secara lokal tanpa dependensi jaringan eksternal (*no outbound telemetry, no external API calls*). Keamanan aset dan kerahasiaan data pengguna bersifat mutlak.
3. **Agilitas Berjenjang (Two-Tier Architecture)**: Memisahkan secara tegas kebutuhan arsitektur cepat/tangkas (Tier 1) dengan kebutuhan tata kelola korporat skala besar (Tier 2).
4. **Universalitas Multi-Agent**: Format instruksi disesuaikan secara presisi dengan karakteristik sintaksis dan batasan runtime masing-masing dari 7 platform AI agent utama di industri.

---

## 2. Spesifikasi SKILL.md Wizard Orchestrator

File `architect-skill/SKILL.md` berfungsi sebagai orkestrator sentral (otak wizard) yang mengarahkan interaksi agen dengan pengguna. Wizard ini memandu pengguna melalui serangkaian evaluasi terstruktur untuk mengekstrak spesifikasi sistem, memvalidasi input, dan memproduksi bundel dokumentasi teknis pada direktori `./docs/`.

### 2.1 Mode Eksekusi: Tier 1 vs Tier 2

| Parameter Evaluasi | Tier 1: Rapid / Lightweight Architecture | Tier 2: Enterprise / Comprehensive Architecture |
| :--- | :--- | :--- |
| **Profil Sasaran** | MVP, startup fase awal, microservice mandiri, prototipe fungsional, utilitas internal. | Sistem misi-kritis, korporat multi-tim, sistem terdistribusi skala tinggi, kepatuhan regulasi formal. |
| **Waktu Siklus Interaksi** | 3 hingga 5 langkah ringkas (kurang dari 5 menit). | 6 fase mendalam dengan validasi berjenjang (15 hingga 30 menit). |
| **Kebutuhan Bisnis (BRD)** | Ditiadakan; disatukan secara ringkas ke dalam PRD. | Wajib (BABOK Guide IIBA compliant) dengan matriks RACI dan KPI bisnis terukur. |
| **Kebutuhan Sistem (SRD)** | Disederhanakan dalam bentuk acceptance criteria PRD. | Wajib (ISO/IEC/IEEE 29148:2018 compliant) dengan verifikasi formal setiap klausa. |
| **Dokumen Arsitektur** | `layer-rules.md`, `directory-tree.md`, 1x ADR fundamental. | `layer-rules.md`, `directory-tree.md`, `dependency-injection.md`, 2+ ADR terperinci. |
| **Desain Sistem Terdistribusi** | Konsep dasar (pilihan DB monolitik / schema dasar). | `caching-lifecycle.md` (Redis), `concurrency-locking.md` (fencing tokens), sharding, queues, rate-limiting. |
| **Diagram UML / C4** | Minimal 2 diagram: C4 Container dan ERD Relasional. | Minimal 5 diagram: C4 Container, Sequence (Auth/Core flow), ERD lengkap, State Machine, Activity diagram. |
| **Frontend & UI Spec** | Panduan setup UI library dan token tema visual terpilih. | Panduan setup, token tema visual senior, registri komponen, token aksesibilitas (WCAG). |
| **Validasi Silang** | Integritas sintaksis dasar dan manifest konsistensi. | Validasi matriks keterlacakan silang penuh (PRD <-> SRD <-> Diagram <-> ADR via `validate-output.js`). |

---

### 2.2 Arsitektur Pelacakan State (`scripts/wizard-state.js`)

Untuk mencegah hilangnya konteks selama percakapan panjang atau interupsi proses oleh pengguna, wizard didukung oleh mesin state deterministik berbasis file lokal.

#### Karakteristik Mesin State
- **Lokasi State Transien**: `.architect-wizard-state.json` (terletak pada direktori `./docs/` atau root proyek, wajib diabaikan oleh `.gitignore`).
- **Lokasi Manifest Final**: `./docs/.architect-manifest.json` (dihasilkan setelah wizard selesai atau mencapai checkpoint valid).
- **Format Payload State (`.architect-wizard-state.json`)**:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "wizard_version": "1.0.0",
  "session_id": "uuid-v4-identifier",
  "tier": "tier1",
  "status": "in_progress",
  "current_stage": "STAGE_2_ARCHITECTURE",
  "updated_at": "2026-10-28T17:00:00Z",
  "responses": {
    "project_name": "payment-gateway",
    "domain": "fintech",
    "architectural_pattern": "modular-monolith",
    "primary_language": "typescript",
    "runtime": "nodejs",
    "primary_database": "postgresql",
    "ui_library": "tailwind-shadcn",
    "ui_aesthetic": "bento-grid"
  },
  "completed_stages": [
    "STAGE_0_INIT",
    "STAGE_1_REQUIREMENTS"
  ],
  "generated_files": [
    "docs/requirements/PRD.md"
  ]
}
```

#### Operasi Antarmuka CLI `wizard-state.js`
1. `node scripts/wizard-state.js init --tier [tier1|tier2] --project [nama]`: Menginisialisasi sesi baru dan mengunci tier.
2. `node scripts/wizard-state.js get`: Mengembalikan representasi JSON dari state aktif saat ini.
3. `node scripts/wizard-state.js set --stage [STAGE_NAME] --key [KEY] --value [VALUE]`: Memperbarui atribut state secara atomik.
4. `node scripts/wizard-state.js record-file --path [DOC_PATH]`: Mencatat file yang berhasil diproduksi ke dalam manifest state.
5. `node scripts/wizard-state.js finalize`: Menghasilkan `./docs/.architect-manifest.json`, menulis log audit akhir, dan menghapus file state sementara.
6. `node scripts/wizard-state.js reset`: Membersihkan state sesi yang tertunda jika pengguna ingin memulai ulang secara bersih.

---

### 2.3 Alur Dialog Interaktif dan Pohon Keputusan (Decision Tree)

Wizard beroperasi melalui 6 tahapan terstruktur. Setiap tahapan memiliki aturan inferensi dan percabangan keputusan formal.

```
       [Mulai Wizard: /architect]
                   |
     +-------------v-------------+
     |   Deteksi State Aktif?   |
     +-------------+-------------+
            |              |
      [Ya]  |              | [Tidak]
            v              v
   (Tawarkan Resume)   [Stage 0: Pemilihan Tier (Tier 1 vs Tier 2)]
            |              |
            +-------+------+
                    |
     +--------------v---------------+
     | Tier 1 (Rapid) / Tier 2 (Ent)|
     +--------------+---------------+
                    |
       [Stage 1: Requirements Flow]
                    |
       [Stage 2: Arsitektur & Pola]
                    |
       [Stage 3: System Design & Data]
                    |
       [Stage 4: Frontend & UI Estetika]
                    |
       [Stage 5: Verifikasi & Handoff]
```

#### Tahap 0: Inisialisasi, Konteks Proyek, dan Pemilihan Tier
- **Prompt P0.1**: "Apakah Anda ingin membangun arsitektur cepat (Tier 1: MVP/Microservice/Prototipe) atau arsitektur komprehensif tingkat enterprise (Tier 2: Multi-tim/Misi-kritis/Kepatuhan Standar Formal)?"
  - Pilihan 1: `Tier 1: Rapid / Lightweight` -> Menetapkan flag `tier = "tier1"`.
  - Pilihan 2: `Tier 2: Enterprise / Comprehensive` -> Menetapkan flag `tier = "tier2"`.
- **Prompt P0.2**: Identitas Sistem:
  - Nama Proyek (string sanitasi: alfanumerik, tanda hubung).
  - Domain Bisnis (contoh: Fintech, E-Commerce, Healthcare, SaaS, Developer Tools).
  - Target Platform (Web, Mobile, Desktop, Headless API, CLI).

#### Tahap 1: Penggalian Kebutuhan (Requirements Elicitation)
- **Cabang Tier 1**:
  - Pertanyaan berfokus pada 3 nilai utama produk: Problem Statement, Target Pengguna Utama, dan 3 sampai 5 Fitur Kunci (Core Capabilities).
  - Output langsung: Menghasilkan `docs/requirements/PRD.md` format ringkas.
- **Cabang Tier 2**:
  - **P1.1 (Business Context - BRD)**: Sasaran strategis organisasi, metrik keberhasilan bisnis (ROI, penurunan churn, efisiensi operasional), regulasi kepatuhan (GDPR, PCI-DSS, HIPAA, OJK/BI jika relevan). Output: `docs/requirements/BRD.md`.
  - **P1.2 (Product Definition - PRD)**: Persona pengguna, user journey, batasan skop (in-scope vs out-of-scope), release phasing (v1, v2). Output: `docs/requirements/PRD.md`.
  - **P1.3 (System Requirements - SRD / ISO/IEC/IEEE 29148:2018)**: Kebutuhan fungsional formal dengan format sintaks "The system SHALL...", persyaratan non-fungsional terukur (latensi P99 < 100ms, ketersediaan 99.95%, throughput minimum 2000 RPS). Output: `docs/requirements/SRD.md`.
  - **P1.4 (Kebutuhan Kustom - Opsional)**: Penyusunan RFC teknis atau spesifikasi modul spesifik. Output: `docs/requirements/RFC-001-[nama].md`.

#### Tahap 2: Paradigma Arsitektur dan Pola Struktur
- **Prompt P2.1**: Pemilihan Paradigma Arsitektur Dasar:
  - Opsi A: `Modular Monolith` (Disarankan untuk sistem baru dengan batas domain yang berkembang, mengutamakan kemudahan refactoring dan kesederhanaan deployment).
  - Opsi B: `Clean Architecture / Hexagonal / Ports & Adapters` (Pemisahan ketat aturan bisnis inti dari framework dan database; dependensi mengarah ke dalam).
  - Opsi C: `Event-Driven Architecture` (Asinkronus murni, decoupling produsen dan konsumen melalui broker pesan).
  - Opsi D: `Feature-Sliced Design (FSD)` (Khusus untuk frontend skala besar atau aplikasi berpusat pada fitur domain).
- **Prompt P2.2**: Keputusan Arsitektur Formal (ADR):
  - Wizard mengidentifikasi trade-off utama berdasarkan pilihan pengguna dan merumuskan `ADR-001-architecture-style.md`.
  - Pada Tier 2, dilanjutkan dengan perumusan `ADR-002-database-selection.md` dan `ADR-003-state-management.md`.
- **Output Tahap 2**:
  - `docs/architecture/decisions/ADR-001-[topik].md`
  - `docs/architecture/[nama-arsitektur]/layer-rules.md` (Definisi batas antarlapis, apa yang boleh dan tidak boleh di-import).
  - `docs/architecture/[nama-arsitektur]/directory-tree.md` (Pohon folder nyata kode sumber proyek).
  - `docs/architecture/[nama-arsitektur]/dependency-injection.md` (Khusus Tier 2: pola registrasi dependensi dan siklus hidup service).

#### Tahap 3: Desain Sistem dan Ketahanan Terdistribusi (System Design & Data)
- **Cabang Tier 1**:
  - Penentuan skema basis data utama (Relasional PostgreSQL/MySQL vs Dokumen MongoDB/SQLite).
  - Pembuatan diagram ERD ringkas dan diagram kontainer C4.
  - Output: `docs/diagrams/data/erd.mmd` dan `docs/diagrams/architecture/c4-container.mmd`.
- **Cabang Tier 2**:
  - **P3.1 (Strategi Caching)**: Pilihan Redis, pola Cache-Aside vs Write-Through, strategi TTL, penanganan *cache stampede* / *thundering herd*. Output: `docs/system-design/[nama]/caching-lifecycle.md`.
  - **P3.2 (Konkurensi & Kunci Terdistribusi)**: Penanganan race condition, mekanisme distributed locking dengan fencing token wajib (mencegah komputasi tertunda menimpa state valid), optimistik vs pesimistik locking. Output: `docs/system-design/[nama]/concurrency-locking.md`.
  - **P3.3 (Skalabilitas RDBMS & Antrean Pesan)**: Strategi replikasi baca, partisi tabel, sharding, pola Dead Letter Queue (DLQ), retry exponential backoff. Output: `docs/system-design/[nama]/rdbms-scaling.md` dan `async-message-queue.md`.
  - **P3.4 (Diagram UML Komprehensif)**: Pembuatan 5 diagram Mermaid formal. Output pada folder `docs/diagrams/`.

#### Tahap 4: Desain Visual dan Rekayasa Frontend (FE Aesthetics)
- **Prompt P4.1**: Pemilihan Pustaka Komponen UI:
  - Pilihan: Tailwind CSS + shadcn/ui, DaisyUI, Mantine, Chakra UI, Ant Design, atau Material UI (MUI).
- **Prompt P4.2**: Pemilihan Tema Desain Visual Senior (FE Aesthetics):
  - Opsi 1: `Neubrutalism / Neo-Brutalism` (Batas tegas 2px-3px hitam solid, drop-shadow pejal `box-shadow: 4px 4px 0px #000`, warna aksen mencolok kontras tinggi, gaya Gumroad/Saweria).
  - Opsi 2: `Bento Grid / Linear-style Minimalist` (Layout modular modern, radius halus, dark mode dominan, border tipis aksen berpendar, gaya Linear.app / Raycast).
  - Opsi 3: `Glassmorphism & Aurora / Mesh Gradient` (Backdrop blur, translusen multi-layer, aksen gradien halus).
  - Opsi 4: `Swiss / International Typographic Style` (Editorial clean, tipografi sans-serif berbobot kuat, hierarki vertikal ketat, grid asimetris).
  - Opsi 5: `Modern SaaS Clean Enterprise` (Gaya Stripe/Vercel, palet netral terkalibrasi, spacing proporsional, komponen terstandarisasi).
  - Opsi 6: `Material Design 3` (Dynamic color, surface elevations, rounded pills).
  - Opsi 7: `Neumorphism / Soft UI` (Soft convex/concave shadows).
  - Opsi 8: `Retro / Cyberpunk / Terminal Aesthetics` (Monospace, dark background, CRT scanline highlights, aksen neon cyan/amber).
- **Output Tahap 4**:
  - `docs/ui/[nama-ui-framework]/setup-guide.md` (Petunjuk instalasi npm/yarn/pnpm, konfigurasi Tailwind).
  - `docs/ui/[nama-ui-framework]/theme-tokens.md` (Variabel CSS, token warna, border-radius, box-shadow konkret).
  - `docs/ui/[nama-ui-framework]/component-registry.md` (Registri komponen esensial: Button, Input, Modal, Table, Card sesuai tema terpilih).

#### Tahap 5: Sintesis Dokumen, Validasi Otomatis, dan Handoff
- Wizard mengeksekusi skrip validasi lokal:
  1. `node scripts/validate-mermaid.js`: Memastikan semua file `.mmd` yang dihasilkan bebas dari galat sintaks.
  2. `node scripts/validate-output.js`: Memverifikasi keterlacakan silang antar-dokumen.
  3. `node scripts/secret-scan.js`: Memindai seluruh direktori `./docs/` untuk memastikan tidak ada token rahasia, kata sandi, atau URL ber-kredensial yang tercatat.
- Pembuatan Metadata:
  - Menyusun indeks navigasi pada `docs/README.md`.
  - Mengompilasi manifest definitif pada `docs/.architect-manifest.json`.
  - Menulis ringkasan audit lokal pada `docs/.architect-audit.log`.
  - Memasang `docs/.gitignore`.
- Memberikan ringkasan akhir kepada pengguna disertai petunjuk eksekusi implementasi rekayasa perangkat lunak.

---

## 3. Spesifikasi Struktur Direktori Output `./docs/`

Sesuai dengan cetak biru pada `struktur-output-pengguna.txt`, struktur output yang wajib dibangun oleh wizard berada di dalam direktori `./docs/` pada workspace proyek pengguna.

```
./docs/
├── README.md                                   # Index & navigasi dokumen
├── .architect-manifest.json                    # Pilihan wizard, versi skill, daftar file, timestamp
├── .architect-audit.log                        # Audit lokal (tanpa nilai sensitif)
├── .gitignore                                  # Abaikan .env, *.pem, *.key, secrets/, state
│
├── requirements/
│   ├── PRD.md                                  # Frontmatter: status, owner, source_skill_version
│   ├── BRD.md                                  # Opsional (Wajib di Tier 2)
│   ├── SRD.md                                  # Opsional (Wajib di Tier 2)
│   └── [kustom].md                             # FRD.md / RFC-001.md (sanitized)
│
├── architecture/
│   ├── decisions/
│   │   ├── ADR-001-*.md
│   │   └── ADR-002-*.md
│   └── [nama-arsitektur]/
│       ├── layer-rules.md
│       ├── directory-tree.md
│       └── dependency-injection.md
│
├── system-design/
│   └── [nama-desain-sistem]/
│       ├── caching-lifecycle.md
│       └── concurrency-locking.md
│
├── diagrams/
│   └── [kategori-diagram]/
│       └── [nama-diagram].mmd                  # Tanpa connection string ber-kredensial
│
└── ui/
    └── [nama-ui-framework]/
        ├── setup-guide.md
        ├── theme-tokens.md
        └── component-registry.md
```

### 3.1 Spesifikasi Dokumen Root

#### 1. `docs/README.md`
- **Fungsi**: Titik masuk utama navigasi dokumentasi arsitektur bagi pengembang, arsitek, dan agen AI lain.
- **Struktur Konten**:
  - Header judul dan badge versi arsitektur.
  - Ringkasan Eksekutif Sistem (Tujuan produk, sasaran teknis).
  - Peta Navigasi Direktori Dokumen (Daftar tautan relatif ke seluruh file dalam `./docs/`).
  - Matriks Status Dokumen (Status: Draft, In Review, Approved).
  - Petunjuk Pemeliharaan Dokumentasi.

#### 2. `docs/.architect-manifest.json`
- **Fungsi**: Manifest status terstruktur mesin (machine-readable state) yang mendokumentasikan keputusan wizard, hash integritas, dan daftar seluruh artefak yang diproduksi.
- **Skema JSON Normatif**:
```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "generator": {
    "name": "architect-skill",
    "version": "1.0.0",
    "tier": "tier2"
  },
  "project": {
    "name": "enterprise-core",
    "domain": "fintech-settlement",
    "target_platform": "web-api"
  },
  "selections": {
    "architecture_style": "clean-architecture",
    "primary_language": "typescript",
    "database": "postgresql",
    "caching": "redis",
    "ui_library": "tailwind-shadcn",
    "ui_aesthetic": "bento-grid"
  },
  "generated_artifacts": [
    {
      "path": "requirements/PRD.md",
      "category": "requirements",
      "sha256": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
    },
    {
      "path": "architecture/decisions/ADR-001-architecture-style.md",
      "category": "architecture",
      "sha256": "a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e"
    }
  ],
  "security_scan": {
    "status": "passed",
    "findings_count": 0,
    "timestamp": "2026-10-28T17:05:00Z"
  },
  "created_at": "2026-10-28T17:05:00Z"
}
```

#### 3. `docs/.architect-audit.log`
- **Fungsi**: Catatan audit lokal append-only yang merekam setiap peristiwa eksekusi pembuatan dan modifikasi dokumen tanpa menyertakan kredensial atau payload sensitif.
- **Format Catatan**:
```
[2026-10-28T17:01:10Z] [INFO] Wizard initialized in mode: tier2, project: enterprise-core
[2026-10-28T17:02:15Z] [INFO] Generated artifact: docs/requirements/PRD.md (hash: e3b0c442...)
[2026-10-28T17:03:00Z] [INFO] Generated diagram: docs/diagrams/architecture/c4-container.mmd
[2026-10-28T17:04:40Z] [AUDIT] Secret scan executed: 0 sensitive patterns detected
[2026-10-28T17:05:00Z] [COMPLETE] Architecture suite generated successfully. Total files: 14
```

#### 4. `docs/.gitignore`
- **Fungsi**: Memastikan bahwa file sensitif, backup sementara, dan file state transien tidak pernah terunggah ke dalam repository kontrol versi pengguna.
- **Isi Standar**:
```gitignore
# State transien wizard
.architect-wizard-state.json

# File kredensial dan environment rahasia
.env
.env.*
*.pem
*.key
*.p12
*.pfx
secrets/
private/

# Backup direktori lokal
*.bak
*.tmp
```

---

### 3.2 Spesifikasi Subdirektori `requirements/`

Seluruh dokumen kebutuhan wajib menyertakan blok YAML Frontmatter di baris teratas dokumen guna menjamin keterlacakan status kepatuhan.

#### Skema Frontmatter Standar:
```yaml
---
title: "Product Requirements Document (PRD)"
document_id: "REQ-PRD-001"
status: "draft" # draft | in-review | approved | deprecated
owner: "Architecture Board / Lead Product Manager"
source_skill_version: "1.0.0"
tier: "tier2"
last_updated: "2026-10-28"
tags: ["requirements", "prd", "core-system"]
---
```

#### Komponen Dokumen Kebutuhan:
1. `PRD.md` (Product Requirements Document - Mengacu Standar Atlassian):
   - Ringkasan Eksekutif dan Latar Belakang.
   - Masalah Pengguna dan Sasaran Nilai (Value Proposition).
   - Profil Persona Pengguna.
   - Batasan Ruang Lingkup (In-Scope vs Out-of-Scope).
   - Fitur Inti dan Alur Kerja Pengguna (User Flows).
   - Kriteria Keberhasilan Rilis (Release Criteria & Acceptance Criteria).
2. `BRD.md` (Business Requirements Document - Mengacu Standar BABOK Guide IIBA):
   - Sasaran Strategis Bisnis dan Analisis Kebutuhan Pasar.
   - Analisis Biaya dan Manfaat (Financial & Operational Impact).
   - Matriks Pemangku Kepentingan (Stakeholder RACI Matrix: Responsible, Accountable, Consulted, Informed).
   - Kepatuhan Regulasi dan Batasan Operasional Korporat.
3. `SRD.md` (System Requirements Document - Mengacu Standar ISO/IEC/IEEE 29148:2018):
   - Klausa Kebutuhan Fungsional Formal: Menggunakan modalitas tegas ("The system SHALL authenticate...", "The system SHALL NOT store plain credentials...").
   - Kebutuhan Non-Fungsional (Kinerja, Skalabilitas, Ketersediaan, Keandalan).
   - Batasan Antarmuka Sistem Eksternal (API, Protokol Komunikasi, Format Data).
   - Batasan Kriptografi dan Manajemen Sesi Keamanan.
4. `[kustom].md` (contoh: `FRD.md` atau `RFC-001-payment-engine.md`):
   - Dokumen spesifikasi kebutuhan fungsional mendalam atau usulan teknis modular. Seluruh string yang dimasukkan wajib disanitasi oleh `sanitize-input.js` guna mencegah injeksi path atau payload karakter berbahaya.

---

### 3.3 Spesifikasi Subdirektori `architecture/`

#### 1. Keputusan Arsitektur (`architecture/decisions/ADR-*.md`)
Format ADR mengadopsi standar Michael Nygard:
- **Status**: Proposed / Accepted / Rejected / Deprecated / Superseded.
- **Konteks**: Masalah teknik atau arsitektur yang dihadapi beserta opsi solusi yang dipertimbangkan.
- **Keputusan**: Solusi terpilih yang diputuskan secara resmi.
- **Konsekuensi**: Dampak positif, dampak negatif, dan trade-off operasional/pemeliharaan.
- *Penamaan File*: `ADR-001-[nama-keputusan-kebab-case].md` (contoh: `ADR-001-modular-monolith-pattern.md`).

#### 2. Spesifikasi Pola Arsitektur Terpilih (`architecture/[nama-arsitektur]/`)
Folder dinamis sesuai pilihan wizard (contoh: `architecture/clean-architecture/` atau `architecture/modular-monolith/`):
- `layer-rules.md`:
  - Pembagian lapisan logis (misal: Domain Layer, Use-Case/Application Layer, Interface Adapters Layer, Infrastructure/Framework Layer).
  - Aturan Dependensi: Aturan tegas arah impor modul (*Dependency Rule*). Modul dalam tidak boleh mengenal modul luar.
  - Penegakan linting atau skrip verifikasi dependensi struktur.
- `directory-tree.md`:
  - Visualisasi struktur folder proyek yang konkret hingga level file inti.
  - Penjelasan tanggung jawab masing-masing folder (misal: `src/domain/entities`, `src/use-cases/ports`, `src/infrastructure/repositories`).
- `dependency-injection.md` (Khusus Tier 2):
  - Mekanisme penyuntikan dependensi (DI Container / Factory Pattern).
  - Siklus hidup service (Singleton, Transient, Scoped).
  - Dekoupling implementasi infrastruktur dari abstraksi port use-case.

---

### 3.4 Spesifikasi Subdirektori `system-design/`

Folder dinamis sesuai topik desain sistem terdistribusi (contoh: `system-design/distributed-core/`):
1. `caching-lifecycle.md`:
   - Arsitektur Cache Redis (Standalone, Sentinel, atau Cluster).
   - Pola Akses: Cache-Aside, Read-Through, Write-Through, Write-Behind.
   - Definisi TTL (Time-To-Live) per tipe entitas data.
   - Kebijakan Penggusuran (*Eviction Policy*, misal: `allkeys-lru`).
   - Mitigasi Kegagalan Cache: Penanganan *Cache Penetration* (Bloom Filter), *Cache Avalanche* (Jitter TTL), dan *Cache Breakdown* (Mutex locking).
2. `concurrency-locking.md`:
   - Penanganan Akses Simultan pada Sumber Daya Kritis (Saldo, Inventaris, State Mesin).
   - Penguncian Terdistribusi (*Distributed Locking*) dengan Redlock / Single-Instance Redis.
   - **Klausul Wajib Fencing Token**: Setiap akuisisi kunci harus menghasilkan token urutan monoton bertambah (*monotonically increasing fencing token*). Penyimpanan data penerima wajib menolak operasi jika token yang dibawa lebih kecil dari token transaksi terakhir yang berhasil disimpan.
   - Optimistic Concurrency Control (OCC) menggunakan atribut versi entitas (`version_id`).
3. `rdbms-scaling.md` & `async-message-queue.md` (Jika dipilih pada Tier 2):
   - Pola Read Replicas, Partitioning, Connection Pooling (PgBouncer).
   - RabbitMQ / Kafka / BullMQ: Pola Producer-Consumer, At-Least-Once Delivery, Idempotency Consumer, Dead Letter Queue (DLQ).

---

### 3.5 Spesifikasi Subdirektori `diagrams/`

Diagram disimpan dalam format Mermaid (`.mmd`) murni tanpa menyertakan kredensial atau connection string sensitif. Folder dikelompokkan berdasarkan kategori:
- `diagrams/architecture/c4-container.mmd`: Diagram arsitektur C4 Container yang memetakan relasi antara pengguna, Single Page Application (SPA), API Gateway, Backend Services, Database, dan Sistem Eksternal.
- `diagrams/data/erd.mmd`: Entity Relationship Diagram formal yang memetakan entitas data, primary keys, foreign keys, tipe data, dan kardinalitas relasi (1-to-1, 1-to-N, N-to-N).
- `diagrams/sequence/sequence-[nama-alur].mmd`: Diagram urutan pesan yang memetakan alur interaksi kritis antarmodul (misal: Alur Autentikasi OAuth2, Alur Checkout Transaksi).
- `diagrams/state/state-[nama-entitas].mmd`: Diagram state machine yang memodelkan siklus hidup entitas penting (misal: State Pesanan: `Draft -> Pending_Payment -> Processing -> Shipped -> Delivered / Cancelled`).
- `diagrams/activity/activity-[nama-proses].mmd`: Diagram aktivitas alur kerja bisnis dengan titik percabangan keputusan (*decision nodes*) dan swimlanes.

---

### 3.6 Spesifikasi Subdirektori `ui/`

Folder dinamis berdasarkan pustaka UI terpilih (contoh: `ui/tailwind-shadcn/`):
1. `setup-guide.md`:
   - Petunjuk integrasi dependensi npm/pnpm.
   - Konfigurasi file build (`tailwind.config.ts`, `components.json`, `postcss.config.js`).
   - Struktur direktori komponen (`components/ui`, `components/features`, `hooks`, `lib/utils`).
2. `theme-tokens.md`:
   - Definisi token desain visual senior yang dipilih pada wizard.
   - Spesifikasi variabel CSS (`:root` dan `.dark`).
   - Nilai token konkret:
     - Palet Warna (Primary, Secondary, Background, Surface, Border, Destructive, Accent).
     - Radius Border (`--radius`, border solid width).
     - Elevasi Bayangan (*Box Shadow Tokens*, misal: `shadow-neubrutalism-sm`, `shadow-bento-glow`).
     - Tipografi (Font Family, Font Scale, Line Heights).
3. `component-registry.md`:
   - Panduan spesifikasi implementasi komponen UI esensial.
   - Props interface (TypeScript), varian komponen, state interaktif (Hover, Focus-Visible, Disabled, Loading).
   - Kepatuhan Aksesibilitas: Atribut ARIA (`role`, `aria-expanded`, `aria-haspopup`), kontras warna minimum 4.5:1 (WCAG 2.1 AA).

---

## 4. Spesifikasi Instalasi pada 7 AI Agents

Berdasarkan `struktur-instalasi-pengguna.txt`, target instalasi mencakup 7 lingkungan agen AI terkemuka. Instalasi didukung dalam dua mode: **Global** (tersedia di seluruh sistem untuk pengguna) dan **Lokal Proyek** (terisolasi di dalam direktori workspace pengguna saat ini).

### 4.1 Pemetaan Target Jalur Instalasi

| No | AI Agent Platform | Mode Global | Mode Lokal Proyek | Tipe Integrasi |
| :--- | :--- | :--- | :--- | :--- |
| 1 | **Claude Code / Desktop** | `~/.claude/skills/architect-skill/` | `<proyek>/.claude/skills/architect-skill/` | Direktori Skill (Symlink / Salinan) |
| 2 | **Google Antigravity** | `~/.agy/skills/architect-skill/` | `<proyek>/.agy/skills/architect-skill/` | Direktori Skill (Symlink / Salinan) |
| 3 | **OpenAI Codex / CLI** | `~/.codex/skills/architect-skill/` | `<proyek>/.codex/skills/architect-skill/` | Direktori Skill (Symlink / Salinan) |
| 4 | **Cursor** | `~/.cursor/rules/architect-skill.mdc` | `<proyek>/.cursor/rules/architect-skill.mdc` | Single Rule MDC / .cursorrules |
| 5 | **Continue** | `~/.continue/prompts/architect-skill.prompt` | `<proyek>/.continue/prompts/architect-skill.prompt` | Slash Command Prompt Template |
| 6 | **Windsurf** | `~/.codeium/windsurf/memories/global_rules.md` | `<proyek>/.windsurfrules` | Cascade Workspace Rules |
| 7 | **Cline** | `~/.cline/rules/architect-skill.md` (ekstensi) | `<proyek>/.clinerules` | Workspace Agent Instructions |

---

### 4.2 Prosedur Backup Otomatis (`~/.architect-skill-backup/<timestamp>/`)

Sebelum skrip instalasi melakukan modifikasi, pembuatan symlink, atau penyalinan file ke target, skrip `scripts/install.js` wajib melakukan backup otomatis:
1. Skrip memeriksa apakah target instalasi telah ada sebelumnya.
2. Jika target telah ada (berupa file, symlink, atau direktori), skrip membuat direktori backup:
   `~/.architect-skill-backup/[YYYYMMDD-HHMMSS]/[agent_name]/`
3. Target lama dipindahkan atau disalin secara utuh ke direktori backup tersebut.
4. Operasi dicatat ke dalam log instalasi terminal agar pengguna dapat melakukan restorasi manual jika diperlukan.

---

### 4.3 Spesifikasi Perilaku Skrip `install.js` dan `install.sh`

Skrip utilitas instalasi dibangun menggunakan Node.js murni (*zero-dependency*) untuk menjamin portabilitas lintas platform (Linux, macOS, Windows).

#### Sintaks Perintah CLI:
```bash
# Instalasi Global untuk semua agen (default symlink)
node scripts/install.js --global --agent all

# Instalasi Lokal pada proyek saat ini menggunakan metode salin (copy)
node scripts/install.js --local --mode copy --agent claude,cursor,antigravity

# Dry-run simulasi tanpa mengubah sistem file
node scripts/install.js --global --dry-run

# Uninstall dan membersihkan symlink yang terpasang
node scripts/install.js --uninstall --agent all
```

#### Argumen CLI yang Didukung:
- `--target` / `-t` atau `--scope`: `global` (default) atau `local`.
- `--agent` / `-a`: `all` (default) atau daftar agen dipisahkan koma (`claude`, `cursor`, `continue`, `windsurf`, `cline`, `codex`, `antigravity`).
- `--mode` / `-m`: `symlink` (default pada Linux/macOS) atau `copy` (default otomatis di Windows jika hak administrator/symlink tidak tersedia).
- `--dry-run`: Menampilkan daftar aksi dan jalur tanpa mengeksekusi operasi sistem file.
- `--uninstall`: Menghapus symlink atau file yang terpasang dari instalasi sebelumnya.
- `--help` / `-h`: Menampilkan panduan penggunaan CLI.

---

## 5. Spesifikasi Adapter Multi-Agent

Direktori `architect-skill/adapters/` memuat adapter khusus yang memetakan kemampuan orkestrasi `SKILL.md` ke dalam format sintaksis yang dipahami oleh masing-masing runtime agen.

### 5.1 Format Adapter Claude Code / Desktop (`adapters/claude/SKILL.md`)
- **Sintaks**: Markdown dengan format YAML Frontmatter standar Claude Skill dan tag instruksi berbasis XML (`<guidelines>`, `<capabilities>`, `<command_routing>`).
- **Pola Pemanggilan**: Mendukung perintah slash `/architect`, `/architect tier1`, `/architect tier2`, `/architect validate`.
- **Aturan Eksekusi**: Agen Claude diarahkan untuk membaca `references/` dan memanfaatkan skrip `scripts/` untuk validasi deterministik.

### 5.2 Format Adapter Cursor (`adapters/cursor/architect-skill.mdc`)
- **Sintaks**: Standar file `.mdc` (Markdown for Cursor) dengan frontmatter wajib:
```yaml
---
description: "Senior Software Architect: Wizard Tier 1/Tier 2, PRD/BRD/SRD generation, system design, and UI aesthetics."
globs: "docs/**, src/**, package.json"
alwaysApply: false
---
```
- **Aturan Eksekusi**: Terpicu secara cerdas ketika pengguna meminta arsitektur, mendesain sistem, atau bekerja di dalam folder `docs/`. Menyediakan aturan pengabaian file rahasia (`.env`, `secrets/`) secara ketat.

### 5.3 Format Adapter Continue (`adapters/continue/architect-skill.prompt`)
- **Sintaks**: Template prompt Continue dengan parameter input:
```yaml
---
name: "architect"
description: "Generate structured architecture documents and system designs in ./docs/"
invocable: true
---
<system>
Anda adalah Senior Software Architect. Ikuti metodologi terstruktur dari architect-skill.
</system>

User request: {{{ input }}}
```
- **Aturan Eksekusi**: Dipanggil melalui slash command `/architect` pada antarmuka percakapan Continue IDE.

### 5.4 Format Adapter Windsurf (`adapters/windsurf/.windsurfrules`)
- **Sintaks**: Plain text / Markdown rules untuk Cascade AI Windsurf.
- **Aturan Eksekusi**: Mendefinisikan peran arsitek perangkat lunak senior, batasan izin file (*filesystem scope*), panduan pembuatan direktori `./docs/`, dan penolakan otomatis terhadap upaya membaca file kredensial proyek.

### 5.5 Format Adapter Cline (`adapters/cline/.clinerules`)
- **Sintaks**: Markdown system instructions untuk agen otonom Cline.
- **Aturan Eksekusi**: Karena Cline memiliki kapabilitas eksekusi terminal mandiri, aturan secara eksplisit memerintahkan Cline untuk:
  1. Menjalankan `node scripts/wizard-state.js` saat mengelola sesi wizard.
  2. Menjalankan `node scripts/validate-mermaid.js` setiap kali selesai membuat diagram `.mmd`.
  3. Menjalankan `node scripts/secret-scan.js` sebelum menyelesaikan tugas.

### 5.6 Format Adapter OpenAI Codex / CLI (`adapters/codex/SKILL.md`)
- **Sintaks**: Format instruksi sistem untuk integrasi CLI OpenAI Codex/Agent.
- **Aturan Eksekusi**: Mendefinisikan antarmuka CLI, parameter flag, dan pola output terstruktur.

### 5.7 Format Adapter Google Antigravity (`adapters/antigravity/SKILL.md`)
- **Sintaks**: Format resmi Antigravity Skill dengan YAML frontmatter:
```yaml
---
name: architect-skill
description: "Senior Software Architect & System Designer: Interactive Tier 1/2 wizard, PRD/BRD/SRD generation, clean architecture, system design, senior UI visual aesthetics, and zero-egress security."
---
```
- **Aturan Eksekusi**: Mendefinisikan pemisahan kerja agen (*Parent-Worker pattern*), isolasi penulisan (*scratch directories* vs *retained docs*), dan eksekusi skrip offline.

### 5.8 Matriks Kompatibilitas Adapter (`adapters/README.md`)

| AI Agent | Tipe Konfigurasi | Lokasi Global | Lokasi Lokal | Metode Pemicu | Validasi Skrip | Kepatuhan Offline |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Claude** | Skill Folder | `~/.claude/skills/` | `<proyek>/.claude/` | `/architect` | Didukung Penuh | 100% Zero-Egress |
| **Antigravity** | Skill Folder | `~/.agy/skills/` | `<proyek>/.agy/` | Skill Loader | Didukung Penuh | 100% Zero-Egress |
| **Codex** | Skill Folder | `~/.codex/skills/` | `<proyek>/.codex/` | CLI Command | Didukung Penuh | 100% Zero-Egress |
| **Cursor** | `.mdc` Rule | `~/.cursor/rules/` | `<proyek>/.cursor/rules/` | Context / Globs | Didukung (Terminal) | 100% Zero-Egress |
| **Continue** | `.prompt` File | `~/.continue/prompts/` | `<proyek>/.continue/` | Slash `/architect` | Panduan AI | 100% Zero-Egress |
| **Windsurf** | `.windsurfrules` | `~/.codeium/windsurf/`| `<proyek>/.windsurfrules` | Rules Trigger | Panduan AI | 100% Zero-Egress |
| **Cline** | `.clinerules` | Extension Storage | `<proyek>/.clinerules` | Autonomous Prompt| Didukung (Otonom) | 100% Zero-Egress |

---

## 6. Spesifikasi Integritas dan Gerbang Validasi

Untuk memastikan keandalan hasil yang diproduksi oleh wizard, sistem menerapkan tiga gerbang validasi (*quality gates*):

1. **Validasi Sintaks Diagram (`scripts/validate-mermaid.js`)**:
   - Memeriksa keabsahan sintaks blok Mermaid (tipe diagram `sequenceDiagram`, `erDiagram`, `stateDiagram-v2`, `C4Container`).
   - Memastikan tidak ada token koneksi, kata sandi, atau URI kredensial pada label diagram.
2. **Validasi Keterlacakan Silang (`scripts/validate-output.js`)**:
   - Memverifikasi konsistensi relasional antar-dokumen:
     - Setiap ID fitur pada `PRD.md` (misal: `FEAT-001`) wajib memiliki klausa padanan pada `SRD.md` (misal: `REQ-SYS-001`).
     - Entitas basis data pada `architecture/directory-tree.md` wajib tercantum pada `diagrams/data/erd.mmd`.
     - Pilihan arsitektur pada `ADR-001` wajib sinkron dengan folder arsitektur konkret yang dihasilkan.
3. **Validasi Pemindaian Rahasia (`scripts/secret-scan.js`)**:
   - Memindai seluruh artefak yang dihasilkan pada `./docs/` terhadap pola-pola sensitif (AWS Keys, Private Keys, JWT Tokens, Connection Strings dengan kata sandi, API Keys generik).
   - Melakukan masking otomatis jika ditemukan string mencurigakan, menggantinya dengan placeholder aman (misal: `[REDACTED_SECRET]`).

---

## 7. Fitur yang Ditemukan (Features Discovered)

Tabel berikut mendokumentasikan seluruh fitur teridentifikasi hasil investigasi spesifikasi.

| # | Kategori | Fitur | Deskripsi | Input | Output | Perilaku Galat | Ditemukan Melalui |
|---|----------|---------|-------------|--------|---------|----------------|-------------------|
| 1 | Wizard | Tier 1 Rapid Architecture | Jalur cepat pembuatan spesifikasi arsitektur untuk MVP atau microservice | Jawaban prompt P0-P4 ringkas | Dokumen PRD, ADR dasar, C4/ERD, UI setup | Mengulang prompt jika input tidak valid | `SKILL.md`, `ORIGINAL_REQUEST.md` |
| 2 | Wizard | Tier 2 Enterprise Architecture | Jalur komprehensif kepatuhan standar formal untuk sistem skala besar | Jawaban prompt P0-P5 mendalam | Bundel lengkap PRD, BRD, SRD, C4, Sequence, ERD, State, Caching, Locking, UI tokens | Menghentikan proses dan meminta klarifikasi batas domain | `SKILL.md`, `ORIGINAL_REQUEST.md` |
| 3 | State Management | Sesi Transien Wizard | Pelacakan status interaksi interaktif wizard yang dapat di-resume | Perintah CLI `wizard-state.js` | File `.architect-wizard-state.json` | Fallback ke inisialisasi baru jika file korup | `scripts/wizard-state.js`, `struktur-repo-skill.txt` |
| 4 | State Management | Manifest Final Generator | Perekaman metadata dokumen, hash integritas SHA-256, dan status scan | Sinyal penyelesaian wizard | File `./docs/.architect-manifest.json` | Gagal jika ada artefak yang hilang dari daftar | `struktur-output-pengguna.txt` |
| 5 | Audit & Governance | Audit Log Lokal | Pencatatan append-only seluruh tindakan generasi dokumen tanpa nilai rahasia | Log events internal | File `./docs/.architect-audit.log` | Mengabaikan penulisan jika permission disk ditolak | `struktur-output-pengguna.txt` |
| 6 | Protection | Proteksi Gitignore Output | Pengabaian otomatis file sensitif dan state transien pada `./docs/` | Template `.gitignore` | File `./docs/.gitignore` | Timpa ulang jika aturan esensial terhapus | `struktur-output-pengguna.txt` |
| 7 | Requirements | PRD Standar Atlassian | Spesifikasi produk terstruktur dengan frontmatter dan matriks fitur | Masukan problem & persona | `docs/requirements/PRD.md` | Menolak format tanpa kriteria penerimaan | `references/requirements/prd.md` |
| 8 | Requirements | BRD Standar BABOK | Spesifikasi kebutuhan bisnis strategis dan matriks stakeholder RACI | Sasaran bisnis & ROI | `docs/requirements/BRD.md` | Dibatalkan pada mode Tier 1 | `references/requirements/brd.md` |
| 9 | Requirements | SRD Standar ISO/IEC/IEEE 29148 | Spesifikasi formal sistem dengan klausa sintaks 'SHALL' | Parameter teknis terukur | `docs/requirements/SRD.md` | Gagal jika kebutuhan non-fungsional tidak terukur | `references/requirements/srd.md` |
| 10 | Requirements | Spesifikasi Kustom & Sanitasi | Pembuatan dokumen RFC/FRD dengan pembersihan nama file & path traversal | Judul dokumen pengguna | `docs/requirements/[kustom].md` | Melempar galat jika terdapat path traversal (`../`) | `scripts/sanitize-input.js` |
| 11 | Architecture | Format ADR Michael Nygard | Pencatatan keputusan arsitektur formal beserta trade-off teknis | Evaluasi opsi arsitektur | `docs/architecture/decisions/ADR-*.md` | Menolak status di luar standar formal | `assets/output/adr/` |
| 12 | Architecture | Penegakan Layer Rules | Definisi aturan isolasi batas lapisan modul perangkat lunak | Pola arsitektur terpilih | `architecture/[nama]/layer-rules.md` | Peringatan jika terdeteksi circular dependency | `references/architecture/` |
| 13 | Architecture | Struktur Pohon Direktori Nyata | Pemetaan hierarki folder sumber daya kode proyek | Pola arsitektur & bahasa | `architecture/[nama]/directory-tree.md` | Menolak pohon direktori tanpa deskripsi modul | `references/architecture/` |
| 14 | Architecture | Desain Dependency Injection | Pola manajemen ketergantungan dan siklus hidup service di Tier 2 | Bahasa & runtime sistem | `architecture/[nama]/dependency-injection.md`| Diabaikan pada mode Tier 1 | `references/architecture/` |
| 15 | System Design | Siklus Hidup Cache Redis | Panduan caching terstruktur, TTL, dan mitigasi stampede/avalanche | Beban query & read pattern | `system-design/[nama]/caching-lifecycle.md` | Peringatan jika TTL tidak didefinisikan | `references/system-design/caching-redis.md` |
| 16 | System Design | Locking dengan Fencing Token | Penguncian terdistribusi aman race-condition menggunakan token monotonik | Titik kritis konkurensi | `system-design/[nama]/concurrency-locking.md`| Wajib mencantumkan mekanisme validasi token | `references/system-design/distributed-locking.md` |
| 17 | System Design | Skalabilitas RDBMS & Antrean | Strategi replikasi, sharding, dan antrean DLQ terdistribusi | Skala throughput & beban | `system-design/[nama]/rdbms-scaling.md` | Menolak rancangan tanpa mitigasi antrean macet | `references/system-design/` |
| 18 | Diagrams | Diagram C4 Container Mermaid | Model visual komponen arsitektur sistem level kontainer | Deskripsi topologi sistem | `docs/diagrams/architecture/c4-container.mmd`| Galat jika sintaks Mermaid tidak valid | `assets/uml/c4-container.mmd` |
| 19 | Diagrams | Diagram ERD Relasional Mermaid | Model relasi data entitas formal dengan tipe atribut | Skema data sistem | `docs/diagrams/data/erd.mmd` | Galat jika ada entitas tanpa Primary Key | `assets/uml/erd.mmd` |
| 20 | Diagrams | Diagram Urutan Pesan (Sequence) | Pemodelan interaksi antarmuka protokol kritis | Skenario alur transaksi | `docs/diagrams/sequence/*.mmd` | Menolak connection string dalam pesan | `assets/uml/sequence.mmd` |
| 21 | Diagrams | Diagram State Machine Mermaid | Pemodelan transisi siklus hidup entitas bisnis | State & event transisi | `docs/diagrams/state/*.mmd` | Galat jika terdapat unreachable state | `assets/uml/state.mmd` |
| 22 | Diagrams | Diagram Aktivitas Alur Kerja | Pemodelan alur kerja bisnis dengan decision nodes | Logika percabangan | `docs/diagrams/activity/*.mmd` | Galat jika alur tidak memiliki node terminasi | `assets/uml/activity.mmd` |
| 23 | UI Engineering | Setup Guide UI Library | Panduan instalasi dan build tool untuk pustaka UI standar industri | Pilihan UI library | `docs/ui/[nama]/setup-guide.md` | Menolak pustaka tanpa dukungan dokumentasi resmi | `assets/ui/` |
| 24 | UI Engineering | Kurasi Desain Visual Senior | Penerapan token konkret gaya desain modern (Neubrutalism, Bento, dll) | Pilihan estetika tema | `docs/ui/[nama]/theme-tokens.md` | Fallback ke Clean SaaS jika tema tidak dikenal | `assets/ui/`, `ORIGINAL_REQUEST.md` |
| 25 | UI Engineering | Registri Komponen Standar | Dokumentasi props, varian, dan aksesibilitas ARIA komponen UI | Kebutuhan antarmuka | `docs/ui/[nama]/component-registry.md` | Peringatan jika standar kontras WCAG diabaikan | `assets/ui/` |
| 26 | Installation | Instalasi Global Multi-Agent | Pemasangan symlink ke direktori global sistem untuk seluruh agen | Flag `--global` CLI | Symlink pada `~/.claude/`, `~/.cursor/`, dll | Beralih ke mode copy jika symlink ditolak OS | `struktur-instalasi-pengguna.txt` |
| 27 | Installation | Instalasi Lokal Proyek | Pemasangan terisolasi langsung pada direktori kerja proyek pengguna | Flag `--local` CLI | File/symlink pada direktori `<proyek>/` | Gagal jika direktori proyek tidak dapat ditulis | `struktur-instalasi-pengguna.txt` |
| 28 | Installation | Backup Otomatis Timestamp | Pencadangan otomatis konfigurasi lama sebelum proses instalasi | Deteksi file eksisting | `~/.architect-skill-backup/[timestamp]/` | Abort instalasi jika pencadangan gagal dibuat | `struktur-instalasi-pengguna.txt` |
| 29 | Installation | Eksekusi Dry-Run Instalasi | Simulasi pengecekan jalur dan dependensi tanpa penulisan file fisik | Flag `--dry-run` CLI | Laporan stdout terminal | Kode keluar non-nol jika jalur tidak valid | `scripts/install.js` |
| 30 | Adapter | Adapter Claude Code / Desktop | Konfigurasi skill dengan instruksi XML dan routing slash commands | Template adapter | `adapters/claude/SKILL.md` | Fallback ke format teks standar jika XML korup | `adapters/claude/` |
| 31 | Adapter | Adapter Cursor (.mdc Rules) | Konfigurasi file `.mdc` dengan filter globs dan deskripsi rule | Template adapter | `adapters/cursor/architect-skill.mdc` | Mengabaikan eksekusi otomatis jika globs mismatch | `adapters/cursor/` |
| 32 | Adapter | Adapter Continue (.prompt) | Template prompt Continue dengan parameter substitusi `{{{ input }}}` | Template adapter | `adapters/continue/architect-skill.prompt` | Mengembalikan teks statis jika parser variabel gagal | `adapters/continue/` |
| 33 | Adapter | Adapter Windsurf Rules | Aturan interaksi agen Cascade untuk perlindungan workspace | Template adapter | `adapters/windsurf/.windsurfrules` | Gagal jika format teks tidak terbaca Cascade | `adapters/windsurf/` |
| 34 | Adapter | Adapter Cline Rules | Aturan sistem agen mandiri Cline dengan protokol eksekusi skrip | Template adapter | `adapters/cline/.clinerules` | Peringatan jika hak akses shell Cline dibatasi | `adapters/cline/` |
| 35 | Adapter | Adapter OpenAI Codex CLI | Spesifikasi instruksi CLI untuk eksekusi terstruktur model Codex | Template adapter | `adapters/codex/SKILL.md` | Galat jika parameter baris perintah tidak sesuai | `adapters/codex/` |
| 36 | Adapter | Adapter Google Antigravity | Format skill Antigravity dengan isolasi scratch dan task boundary | Template adapter | `adapters/antigravity/SKILL.md` | Menolak eksekusi jika aturan isolasi dilanggar | `adapters/antigravity/` |
| 37 | Adapter | Matriks Kompatibilitas Agent | Tabel referensi komprehensif kapabilitas per runtime AI agent | Data integrasi adapter | `adapters/README.md` | Peringatan jika ada adapter yang belum terdaftar | `adapters/README.md` |
| 38 | Validation | Verifikasi Sintaks Mermaid | Validasi parsing diagram offline tanpa memerlukan koneksi eksternal | File `.mmd` lokal | Laporan status validasi di terminal | Exit code 1 jika sintaks Mermaid invalid | `scripts/validate-mermaid.js` |
| 39 | Validation | Validasi Keterlacakan Silang | Pengecekan konsistensi referensi PRD ↔ SRD ↔ Diagram ↔ ADR | Seluruh file `./docs/` | Matriks keterlacakan dan verifikasi link | Exit code 1 jika ada dependensi tak bertuan | `scripts/validate-output.js` |
| 40 | Security | Pemindaian Rahasia Zero-Egress | Deteksi otomatis token, API key, dan koneksi ber-kredensial di `./docs/` | Seluruh file `./docs/` | Laporan scan atau auto-masking string | Menandai error dan memicu backup jika ada kebocoran | `scripts/secret-scan.js` |

---

## 8. Kasus-Kasus Tepi dan Skenario Anomali (Edge Cases)

Tabel berikut mendokumentasikan hasil investigasi analitis terhadap kondisi batas dan input tidak lazim.

| # | Fitur Terkait | Kondisi Input / Skenario Ekstrem | Perilaku Sistem yang Diobservasi & Ditetapkan |
|---|---------------|----------------------------------|-----------------------------------------------|
| 1 | Wizard Init | Proyek telah memiliki folder `./docs/` lengkap dari sesi terdahulu | Wizard mendeteksi `.architect-manifest.json`, menanyakan opsi kepada pengguna: [1] Resume sesi tertunda, [2] Tambah dokumen baru secara inkremental, [3] Overwrite total dengan pencadangan otomatis. Tidak pernah menimpa file tanpa konfirmasi. |
| 2 | Wizard State | Sesi terputus secara mendadak (Ctrl+C atau crash terminal) saat proses pembuatan | File `.architect-wizard-state.json` mencatat stage terakhir yang berhasil diselesaikan. Saat wizard dijalankan kembali, sistem memvalidasi integritas state dan melanjutkan dari tahapan terhenti tanpa mengulang dari nol. |
| 3 | Input Sanitization | Nama proyek atau nama dokumen kustom memuat karakter path traversal: `../../etc/passwd` | Skrip `sanitize-input.js` secara ketat menghapus karakter traversal (`..`, `/`, `\`), mengonversi string menjadi alfanumerik aman berkebab-case (`etc-passwd`), dan memastikan penulisan file terkunci hanya di dalam direktori `./docs/`. |
| 4 | Security & Secrets | Pengguna memasukkan connection string nyata dalam deskripsi: `postgres://admin:p@ssword123@db:5432/core` | Skrip `secret-scan.js` mencegat string tersebut, mengganti kata sandi dengan placeholder `postgres://admin:[REDACTED_PASSWORD]@db:5432/core`, dan mencatat insiden masking ke dalam `.architect-audit.log`. |
| 5 | Installation | Pengguna menjalankan instalasi symlink pada sistem operasi Windows tanpa hak Developer Mode / Administrator | Perintah symlink Windows melempar error `EPERM`. Skrip `install.js` menangkap exception tersebut secara elegan, memberikan peringatan ramah, dan otomatis beralih (*graceful fallback*) ke mode penyalinan file fisik (`copy`). |
| 6 | Installation | Target instalasi telah ada dan berisi konfigurasi kustom pengguna yang belum di-backup | Skrip mendeteksi keberadaan file target, menolak menimpa langsung, dan secara otomatis memindahkan file eksisting ke `~/.architect-skill-backup/[timestamp]/[agent]/` sebelum memasang adapter baru. |
| 7 | Diagrams | Diagram Mermaid memuat relasi rekursif atau karakter tanda kutip yang tidak tertutup | Skrip `validate-mermaid.js` mendeteksi ketidaksesuaian parsing string, menampilkan nomor baris galat secara spesifik, dan memicu wizard untuk memformat ulang diagram sebelum disimpan permanen. |
| 8 | Multi-Agent Adapters | Agent AI yang digunakan tidak memiliki dukungan bawaan untuk slash command (misal: Windsurf atau Cursor) | Adapter mengompilasi instruksi ke dalam format aturan kontekstual global (`.windsurfrules` atau `.cursor/rules/*.mdc`) yang aktif secara otomatis saat pengguna menyebut kata kunci arsitektur atau membuka file di dalam direktori `docs/`. |
| 9 | UI Aesthetics | Pengguna memilih pustaka UI Tailwind namun menginginkan tema Neumorphism yang membutuhkan shadow spesifik | Wizard menghasilkan konfigurasi ekstensi `tailwind.config.ts` kustom yang menyertakan token *dual light-source box-shadow* (`inset 5px 5px 10px #bebebe, inset -5px -5px 10px #ffffff`) pada file `theme-tokens.md`. |
| 10 | Cross-Doc Integrity | Fitur baru ditambahkan pada PRD namun tidak didefinisikan implementasi layernya pada `layer-rules.md` | Skrip `validate-output.js` menandai inkonsistensi referensial (*orphaned feature*), memberikan peringatan pada laporan manifest, dan menyarankan penambahan klausul aturan lapisan arsitektur terkait. |

---

## 9. Kesimpulan Rekayasa

Spesifikasi formal ini menetapkan cetak biru komprehensif bagi pembangunan orkestrator wizard, struktur output `./docs/`, target instalasi, dan adapter multi-agent pada `architect-skill`. Seluruh definisi di atas sepenuhnya berakar pada prinsip keterlacakan logis, pemisahan tanggung jawab yang modular, dan perlindungan keamanan *zero-egress*.
