# Handoff Report: Spesifikasi Wizard, Output ./docs/, dan Multi-Agent Adapters

**Penulis**: `spec_miner_wizard` (Teamwork Specification Miner)  
**Penerima**: `orchestrator` (`a6c14bb5-7181-4c02-8e19-84b86b78ae45`)  
**Tipe Handoff**: Hard Handoff (Tugas Selesai Penuh)  
**Tanggal**: 2026-10-28  

---

## 1. Observation (Observasi Nyata)

Berdasarkan investigasi empiris pada berkas-berkas otoritatif dalam sistem:

1. **`ORIGINAL_REQUEST.md` (Baris 18-20, 50-55)**:
   > "1. File root: `SKILL.md` (orkestrator wizard Tier 1 & Tier 2)..."
   > "2. Direktori `adapters/`: implementasi adapter khusus per agent (`claude/SKILL.md`, `cursor/architect-skill.mdc`, `continue/architect-skill.prompt`, `windsurf/.windsurfrules`, `cline/.clinerules`, `codex/SKILL.md`, `antigravity/SKILL.md`, dan matriks `README.md`)."
   > "- [ ] File orkestrator `architect-skill/SKILL.md` memuat logika orkestrasi lengkap Tier 1 & Tier 2 wizard untuk menghasilkan dokumen arsitektur ke `./docs/` sesuai `struktur-output-pengguna.txt`."

2. **`struktur-output-pengguna.txt` (Baris 1-36)**:
   Hierarki dokumen `./docs/` terdiri dari:
   - Root metadata: `README.md`, `.architect-manifest.json`, `.architect-audit.log`, `.gitignore`.
   - `requirements/`: `PRD.md` (frontmatter: status, owner, source_skill_version), `BRD.md` (opsional), `SRD.md` (opsional), `[kustom].md` (FRD.md/RFC-001.md sanitized).
   - `architecture/`: `decisions/ADR-001-*.md`, `ADR-002-*.md`, dan `[nama-arsitektur]/layer-rules.md`, `directory-tree.md`, `dependency-injection.md`.
   - `system-design/`: `[nama-desain-sistem]/caching-lifecycle.md`, `concurrency-locking.md`.
   - `diagrams/`: `[kategori-diagram]/[nama-diagram].mmd` (tanpa connection string ber-kredensial).
   - `ui/`: `[nama-ui-framework]/setup-guide.md`, `theme-tokens.md`, `component-registry.md`.

3. **`struktur-instalasi-pengguna.txt` (Baris 1-20)**:
   - Jalur Global:
     `~/.claude/skills/architect-skill/` -> symlink ke repo.
     `~/.agy/skills/architect-skill/` -> symlink ke repo.
     `~/.codex/skills/architect-skill/` -> symlink ke repo.
     `~/.cursor/rules/architect-skill.mdc` -> symlink ke `adapters/cursor/...`.
     `~/.continue/prompts/architect-skill.prompt` -> symlink ke `adapters/continue/...`.
     `~/.codeium/windsurf/` -> symlink ke `adapters/windsurf/...`.
   - Jalur Lokal Proyek:
     `<proyek>/.claude/skills/architect-skill/`, `<proyek>/.agy/skills/architect-skill/`, `<proyek>/.codex/skills/architect-skill/`, `<proyek>/.cursor/rules/architect-skill.mdc`, `<proyek>/.continue/prompts/architect-skill.prompt`, `<proyek>/.windsurfrules`, `<proyek>/.clinerules`.
   - Mekanisme Pencadangan:
     `~/.architect-skill-backup/<timestamp>/` otomatis saat instalasi.

4. **Karakteristik Format Agen Nyata**:
   - Inspeksi pada skill aktif sistem (`/home/fiky/.gemini/config/skills/compact/SKILL.md`) membuktikan keberadaan frontmatter YAML standar (`name`, `description`) diikuti instruksi markdown terstruktur.
   - Peran agen otonom (Cline) menuntut instruksi sistem berbasis skrip terminal lokal (`scripts/wizard-state.js`, `scripts/validate-mermaid.js`, `scripts/secret-scan.js`).

---

## 2. Logic Chain (Rantai Penalaran Logis)

1. Dari Observasi 1 dan 2, `SKILL.md` tidak sekadar instruksi statis, melainkan mesin orkestrasi dialog (wizard) yang harus mampu mengeksekusi dua profil alur kerja berbeda: Tier 1 (tangkas/cepat, 3 sampai 5 prompt, PRD ringkas, ADR dasar, C4 & ERD) dan Tier 2 (enterprise formal, 6 fase mendalam, BRD BABOK, SRD ISO/IEC/IEEE 29148, distributed locking dengan fencing tokens, siklus cache Redis, 5 diagram UML, dan registri UI).
2. Dari kebutuhan interaktivitas dan kemungkinan interupsi sesi percakapan, pelacakan state deterministik via `scripts/wizard-state.js` menjadi kebutuhan esensial. State transien disimpan pada `.architect-wizard-state.json` dan manifest final yang terverifikasi diterbitkan ke `./docs/.architect-manifest.json`.
3. Dari Observasi 2 dan regulasi keamanan *zero-egress*, seluruh diagram `.mmd` dan dokumen arsitektur dilarang memuat rahasia atau URL ber-kredensial. Oleh karena itu, skrip `secret-scan.js` dan aturan `.gitignore` pada `./docs/` bertindak sebagai gerbang keamanan wajib.
4. Dari Observasi 3, instalasi pada 7 platform agen AI membutuhkan pembedaan yang ketat antara entitas folder skill (`claude`, `antigravity`, `codex`) dan entitas berkas konfigurasi tunggal (`cursor`, `continue`, `windsurf`, `cline`).
5. Dari Observasi 3, proses instalasi berisiko menimpa konfigurasi eksisting milik pengguna. Aksioma keandalan mengharuskan penciptaan mekanisme pencadangan otomatis ber-timestamp pada `~/.architect-skill-backup/[timestamp]/` sebelum symlink atau operasi penulisan file dijalankan.
6. Dari Observasi 4, adapter per agent harus disesuaikan secara presisi:
   - Claude: Mendukung slash command `/architect`, tag XML.
   - Cursor: Frontmatter `.mdc` dengan filter `globs`.
   - Continue: Frontmatter `.prompt` dengan substitusi `{{{ input }}}`.
   - Windsurf: Aturan proteksi direktori pada `.windsurfrules`.
   - Cline: Aturan eksekusi skrip validasi otonom pada `.clinerules`.
   - Codex: Instruksi CLI sistem.
   - Antigravity: Standar YAML frontmatter dengan batas isolasi scratch.

---

## 3. Caveats (Batasan & Asumsi)

1. **Hak Akses Sistem Operasi Windows**: Pembuatan symlink pada OS Windows memerlukan hak Developer Mode atau hak Administrator. Jika hak ini tidak terpenuhi, skrip `install.js` diasumsikan melakukan fallback otomatis ke mode penyalinan fisik (`copy`).
2. **Ketiadaan Dependencies Eksternal**: Sesuai mandat arsitektur, seluruh skrip pendukung wizard (`wizard-state.js`, `install.js`, `sanitize-input.js`, `validate-output.js`) harus dibangun dengan Node.js murni (*zero-dependency*) tanpa paket `npm install`.

---

## 4. Conclusion (Kesimpulan)

Investigasi spesifikasi wizard, struktur output `./docs/`, instalasi 7 agen AI, dan adapter multi-agent telah selesai secara tuntas dan komprehensif. Seluruh temuan, alur logika, skema berkas, pohon keputusan, 40 fitur teridentifikasi, dan 10 kasus batas ekstrem telah dibukukan dalam dokumen autoritatif:
`/home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/spec_miner_wizard/spec_wizard.md`.

Dokumen tersebut siap dijadikan acuan langsung bagi subagent implementer (Tahap 2 dan seterusnya).

---

## 5. Verification Method (Metode Verifikasi Independen)

Untuk memverifikasi keabsahan laporan spesifikasi ini secara independen:

1. **Inspeksi Berkas Spesifikasi**:
   Periksa keberadaan dan kelengkapan bab pada berkas:
   `/home/fiky/Documents/Latihan Agent/SKILL/.agents/teamwork/spec_miner_wizard/spec_wizard.md`
   Pastikan mencakup:
   - Spesifikasi alur Tier 1 dan Tier 2 SKILL.md.
   - Skema JSON `.architect-manifest.json` dan state transien.
   - Hierarki lengkap direktori `./docs/` sesuai `struktur-output-pengguna.txt`.
   - Spesifikasi instalasi 7 agen sesuai `struktur-instalasi-pengguna.txt`.
   - Matriks adapter dan format spesifik 7 agen AI.
   - Tabel 40 Fitur Teridentifikasi dan 10 Kasus Batas (Edge Cases).

2. **Kondisi Invalidasi**:
   Spesifikasi ini dinyatakan tidak valid apabila ditemukan:
   - Dependensi jaringan luar (*egress network dependency*) pada skrip atau alur wizard.
   - Absensi salah satu dari 7 agen target instalasi.
   - Format struktur output `./docs/` yang menyimpang dari cetak biru `struktur-output-pengguna.txt`.
