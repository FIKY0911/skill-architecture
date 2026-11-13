# architect-skill

<div align="center">

**🌐 Language / Bahasa:**
[🇺🇸 English](README.md) • [🇮🇩 Bahasa Indonesia](README.id.md)

</div>

> Generator arsitektur perangkat lunak dan kerangka spesifikasi kelas enterprise, berbasis lokal, zero-egress untuk agen AI.

[![Zero-Egress Guaranteed](https://img.shields.io/badge/Security-Zero--Egress-success?style=flat-square)](SECURITY.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](LICENSE)
[![Runtime: Node.js 18+](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-green?style=flat-square)](https://nodejs.org)
[![Agents: 7 Platforms](https://img.shields.io/badge/Agents-Claude%20%7C%20Cursor%20%7C%20Continue%20%7C%20Windsurf%20%7C%20Cline%20%7C%20Codex%20%7C%20Antigravity-orange?style=flat-square)](adapters/README.md)

---

## 1. Ikhtisar & Filosofi Inti

`architect-skill` adalah toolkit arsitektur perangkat lunak yang otoritatif, dirancang untuk beroperasi di tujuh lingkungan pengkodean AI utama: Claude Code & Desktop, Cursor IDE, Continue.dev, Codeium Windsurf, Cline Autonomous Agent, OpenAI Codex CLI, dan Google Antigravity.

Tidak seperti prompt AI biasa yang menghasilkan saran kode dangkal atau membuat asumsi tanpa dasar, `architect-skill` beroperasi sebagai mesin inferensi arsitektur yang deterministik. Ia menyintesis spesifikasi kelas enterprise, skema data, pengaman sistem terdistribusi, dan token UI visual ke dalam hierarki `./docs/` yang terorganisir di dalam proyek Anda.

### Prinsip-Prinsip Fundamental:
1. **Primasi Logika atas Heuristik**: Semua paradigma arsitektur, trade-off desain sistem, dan klausul kebutuhan berakar pada standar formal (ISO/IEC/IEEE 29148:2018, BABOK Guide v3, Atlassian Agile PRD, Robert C. Martin, Martin Fowler, Martin Kleppmann).
2. **Zero-Egress & Local-First Absolut**: Eksekusi 100% offline. Tidak ada permintaan jaringan keluar, tidak ada telemetri jarak jauh, tidak ada ketergantungan API eksternal.
3. **Perlindungan Kredensial Absolut**: Skill ini secara struktural dilarang membaca file `.env`, sertifikat, kunci privat, atau token autentikasi agen. Pemindaian rahasia bawaan dan penyamaran otomatis menetralisir kredensial yang tersesat sebelum operasi penulisan.
4. **Minimalisme Konstruktif**: Implementasi Node.js murni tanpa dependensi npm eksternal (`zero-dependency`), mengeliminasi risiko rantai pasok perangkat lunak.

---

## 2. Kerangka Eksekusi Dua Tingkat

`architect-skill` menyediakan dua tingkat operasional yang terkalibrasi:

| Atribut | Tingkat 1: Arsitektur Cepat / Ringan | Tingkat 2: Arsitektur Enterprise / Komprehensif |
|---|---|---|
| **Cakupan Target** | MVP, prototipe awal, layanan mikro mandiri, utilitas CLI internal | Sistem mission-critical, kluster terdistribusi, platform enterprise berregulasi |
| **Waktu Interaksi** | 3 hingga 5 langkah cepat (< 5 menit) | 6 tahap validasi mendalam (15 hingga 30 menit) |
| **Cakupan Kebutuhan** | `PRD.md` terpadu dengan framing masalah dan kriteria penerimaan | `BRD.md` lengkap (BABOK RACI/ROI), `PRD.md` (Atlassian), dan `SRD.md` (ISO 29148 EARS clauses) |
| **Cakupan Arsitektur** | `layer-rules.md`, `directory-tree.md`, 1x ADR inti | Aturan layer, pohon direktori, `dependency-injection.md`, 3+ ADR komprehensif |
| **Desain Sistem** | Pemilihan skema database utama dan caching dasar | Siklus hidup caching Redis, distributed locking dengan fencing tokens, skalabilitas RDBMS, antrean pesan |
| **Diagram (Mermaid + teks kembar)** | 2 diagram: C4 Container dan ERD Relasional | 5 diagram: C4 Container, Sequence, ERD, State Machine, alur Activity. Masing-masing dikirim sebagai Mermaid `.mmd` ditambah kembar ASCII `.md` yang dirender di pratinjau VSCode |
| **Frontend & UI** | Panduan pengaturan framework UI dan token tema | Panduan pengaturan, token tema, registri komponen lengkap dengan aksesibilitas ARIA/WCAG |
| **Gerbang Verifikasi** | Validasi sintaks dasar dan kompilasi manifes | Verifikasi keterlacakan semantik lintas dokumen (`validate-output.js`) |

---

## 3. Ekosistem Agen AI yang Didukung

`architect-skill` menyediakan adapter yang disesuaikan untuk 7 platform agen:

| Platform | File Adapter | Lokasi Global | Lokasi Proyek | Mekanisme Pemicu |
|---|---|---|---|---|
| **Claude Code & Desktop** | `adapters/claude/SKILL.md` | `~/.claude/skills/architect-skill/` | `<project>/.claude/skills/architect-skill/` | `/architect` |
| **Cursor IDE** | `adapters/cursor/architect-skill.mdc` | `~/.cursor/rules/architect-skill.mdc` | `<project>/.cursor/rules/architect-skill.mdc` | Context / Globs |
| **Continue.dev** | `adapters/continue/architect-skill.prompt` | `~/.continue/prompts/architect-skill.prompt` | `<project>/.continue/prompts/architect-skill.prompt` | `/architect` |
| **Codeium Windsurf** | `adapters/windsurf/.windsurfrules` | `~/.codeium/windsurf/memories/global_rules.md` | `<project>/.windsurfrules` | Cascade Trigger |
| **Cline Autonomous** | `adapters/cline/.clinerules` | Konfigurasi ekstensi | `<project>/.clinerules` | Aturan Otonom |
| **OpenAI Codex CLI** | `adapters/codex/SKILL.md` | `~/.codex/skills/architect-skill/` | `<project>/.codex/skills/architect-skill/` | Perintah CLI |
| **Google Antigravity** | `adapters/antigravity/SKILL.md` | `~/.agy/skills/architect-skill/` | `<project>/.agy/skills/architect-skill/` | Skill Loader |

Pemetaan instalasi terperinci didokumentasikan di [`adapters/README.md`](adapters/README.md).

---

## 4. Instalasi & Manajemen Siklus Hidup

Toolkit ini menyertakan installer zero-dependency yang kompatibel dengan Linux, macOS, dan Windows.

### Instalasi Shell Otomatis (Linux / macOS):
```bash
# Instalasi global untuk semua agen (membuat symlink)
./scripts/install.sh --global

# Instalasi lokal di repositori proyek saat ini
./scripts/install.sh --local

# Inspeksi dry-run
./scripts/install.sh --global --dry-run
```

### Instalasi Node.js Langsung (Lintas Platform):
```bash
# Pratinjau rencana instalasi tanpa memodifikasi disk (--dry-run)
node scripts/install.js --global --dry-run

# Instal secara global untuk semua 7 agen AI di home pengguna (~/...)
node scripts/install.js --global

# Instal secara global atau lokal untuk satu agen AI tertentu (claude | antigravity | codex | cursor | continue | windsurf | cline)
node scripts/install.js --global --target antigravity
node scripts/install.js --local --target cursor

# Hapus instalasi dan bersihkan tautan yang terpasang
node scripts/install.js --global --uninstall
node scripts/install.js --local --uninstall
```

Untuk detail konfigurasi lengkap (pengaturan per-agen, kebijakan keamanan kustom, dan daftar periksa penerbitan GitHub), lihat [`docs/quickstart.md`](docs/quickstart.md).

### Perlindungan Backup Otomatis:
Sebelum memodifikasi atau menimpa konfigurasi agen apa pun, installer membuat backup bertanda waktu di:
`~/.architect-skill-backup/<timestamp>/<agent_name>/`

---

## 5. Basis Pengetahuan Arsitektur & Standar

### 5.1 Rekayasa Kebutuhan Formal
- **PRD (Product Requirements Document)**: Mengikuti kerangka agile Atlassian dengan framing masalah, persona pengguna, kriteria penerimaan Gherkin, dan prioritisasi MoSCoW.
- **BRD (Business Requirements Document)**: Mengikuti BABOK Guide v3 dengan keselarasan strategis, matriks RACI pemangku kepentingan, kalkulasi keuangan TCO/ROI, dan batasan kepatuhan.
- **SRD (System Requirements Document)**: Mengikuti ISO/IEC/IEEE 29148:2018 (menggantikan IEEE 830) yang memberlakukan sintaks EARS (Ubiquitous, Event-driven, State-driven, Unwanted, Optional) dan matriks verifikasi IV&V.

### 5.2 Paradigma Arsitektur
- **Clean Architecture**: 4 lapisan onion konsentris dengan Aturan Inversi Ketergantungan yang ketat dan boundary DTO.
- **Modular Monolith**: Bounded context dalam satu unit deployment, facade antarmuka publik, dan isolasi skema logis.
- **Event-Driven Architecture (EDA)**: Domain event, Event-Carried State Transfer (ECST), pola Transactional Outbox, dan orkestrasi Saga.
- **Hexagonal Architecture**: Decoupling Ports and Adapters antara inti aplikasi dengan infrastruktur driving dan driven.
- **Feature-Sliced Design (FSD v2.1)**: Model layer hierarkis ketat (`app`, `pages`, `widgets`, `features`, `entities`, `shared`) untuk sistem frontend dan full-stack skala besar.

### 5.3 Ketelitian Desain Sistem Terdistribusi
- **Redis Caching**: Cache-Aside, Write-Through, Write-Behind, TTL jitter, dan algoritma kedaluwarsa awal probabilistik XFetch untuk mencegah cache stampede.
- **Distributed Locking**: Fencing token yang meningkat secara monoton oleh Kleppmann yang diperiksa di lapisan database untuk mencegah split-brain writes di bawah jeda GC.
- **Skalabilitas RDBMS**: Pemisahan Read/Write dengan mitigasi replica lag, ukuran connection pool PgBouncer/HikariCP, dan horizontal sharding.
- **Antrean Pesan Asinkron**: Pola Kafka, RabbitMQ, dan AWS SQS dengan Dead Letter Queue (DLQ) dan jitter backoff eksponensial.
- **Rate Limiting Terdistribusi**: Algoritma Sliding Window Counter dan Token Bucket yang diimplementasikan melalui skrip Lua Redis.

### 5.4 Estetika Frontend Senior & Framework UI
Mengintegrasikan 6 library komponen UI resmi (Tailwind + shadcn/ui, DaisyUI, Mantine, Chakra UI, Ant Design, MUI) dan 8 tema estetika desain senior yang dikurasi:
1. **Neubrutalism / Neo-Brutalism**: Border hitam tebal 3px, hard drop-shadow solid tanpa blur (`box-shadow: 4px 4px 0px #000`), aksen jenuh yang vibrant.
2. **Bento Grid / Linear-style**: Kanvas gelap modular (`#09090B`), border tembus pandang yang halus, gradien sorotan ambient yang bercahaya.
3. **Glassmorphism & Aurora Gradient**: Blur backdrop kaca beku berlapis-lapis (`backdrop-blur-xl`), pencahayaan ungu/cyan selestial yang vibrant.
4. **Swiss / International Typographic Style**: Kisi arsitektur tegas, tipografi grotesque tebal, tanpa ornamen, aksen merah/hitam.
5. **Modern SaaS Clean Enterprise**: Netral slate yang seimbang, border 1px yang tajam, elevasi halus, lencana status yang aksesibel.
6. **Material Design 3**: Palet tonal dinamis, elevasi tint permukaan, pemicu aksi berbentuk pil.
7. **Neumorphism / Soft UI**: Bayangan lembut berarah berlawanan pada permukaan netral yang kontinyu (dengan penguatan teks kontras tinggi yang wajib).
8. **Retro / Cyberpunk / Terminal**: Tipografi monospaced, scanline CRT, aksen neon hijau fosfor/amber pada permukaan hitam pekat.

---

## 6. Hierarki Output yang Dihasilkan (`./docs/`)

Saat dieksekusi, `architect-skill` mengkompilasi dokumentasi teknis Anda ke dalam `./docs/`:

```
./docs/
├── README.md                          # Portal navigasi utama dan indeks dokumentasi
├── .architect-manifest.json           # Metadata yang dapat dibaca mesin, pilihan opsi, dan hash SHA-256
├── .architect-audit.log               # Log peristiwa append-only lokal (zero credential leakage)
├── .gitignore                         # Pengecualian level output untuk rahasia, kunci, dan status sementara
│
├── requirements/
│   ├── PRD.md                         # Product Requirements Document (Atlassian)
│   ├── BRD.md                         # Business Requirements Document (BABOK - Tingkat 2)
│   ├── SRD.md                         # System Requirements Document (ISO/IEC/IEEE 29148 - Tingkat 2)
│   └── [custom].md                    # Kebutuhan kustom atau RFC yang telah disanitasi
│
├── architecture/
│   ├── decisions/
│   │   ├── ADR-001-*.md               # Architecture Decision Records
│   │   └── ADR-002-*.md
│   └── [selected-architecture]/
│       ├── layer-rules.md             # Aturan batas dan batasan impor
│       ├── directory-tree.md          # Pohon kodebase proyek konkret
│       └── dependency-injection.md    # Lifetime layanan dan registrasi DI (Tingkat 2)
│
├── system-design/
│   └── [selected-design]/
│       ├── caching-lifecycle.md       # Pola caching Redis dan kebijakan TTL
│       ├── concurrency-locking.md     # Distributed locking dengan fencing tokens
│       └── rdbms-scaling.md           # Read replica, partisi, dan connection pool
│
├── diagrams/
│   ├── architecture/
│   │   └── c4-container.mmd           # Diagram container model C4
│   ├── data/
│   │   └── erd.mmd                    # Diagram Entity Relationship Relasional
│   ├── sequence/
│   │   └── sequence-auth-flow.mmd     # Diagram sequence protokol dan transaksi
│   └── state/
│       └── state-lifecycle.mmd        # Model finite state machine
│
└── ui/
    └── [selected-ui-framework]/
        ├── setup-guide.md             # Konfigurasi build dan dependensi
        ├── theme-tokens.md            # Properti kustom CSS dan token desain
        └── component-registry.md      # Spesifikasi komponen UI dan aksesibilitas ARIA
```

---

## 7. Utilitas Verifikasi & Diagnostik

Toolkit menyediakan skrip verifikasi zero-dependency otomatis:

```bash
# Verifikasi kesehatan lingkungan, izin, dan integritas skrip
node scripts/doctor.js

# Validasi sintaks diagram UML Mermaid di seluruh aset dan output yang dihasilkan
node scripts/validate-mermaid.js

# Validasi diagram teks yang aman untuk pratinjau (kembar ASCII .md yang dirender di pratinjau VSCode tanpa Mermaid)
node scripts/validate-diagrams.js

# Validasi struktur repositori terhadap blueprint
node scripts/validate-structure.js

# Validasi konsistensi semantik lintas dokumen (PRD <-> SRD <-> ERD <-> ADR)
node scripts/validate-output.js

# Jalankan pemindai rahasia untuk mendeteksi dan menyamarkan pola kredensial
node scripts/secret-scan.js --check
```

---

## 8. Keamanan & Tata Kelola

- **Penegakan Zero-Egress**: Dipantau oleh `scripts/egress-guard.js`. Soket jaringan keluar yang tidak sah segera memunculkan error fatal.
- **Perlindungan Kredensial**: Dipantau oleh `scripts/secret-scan.js` dan `policies/redaction-rules.json`.
- **Isolasi Filesystem**: Dipantau oleh `policies/filesystem-scope.json`.
- **Pinning Integritas**: Dipantau oleh `runtime-firewall/tool-firewall.js`.

Untuk pengungkapan kerentanan keamanan, tinjau [`SECURITY.md`](SECURITY.md).  
Untuk detail kedaulatan data lokal, tinjau [`PRIVACY.md`](PRIVACY.md).

---

## 9. Lisensi

Proyek ini dilisensikan di bawah [MIT License](LICENSE).
