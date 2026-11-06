# Workflow Dokumentasi

Dokumen ini menjelaskan alur kerja proyek secara **high‑level** dan menghubungkan semua bagian dokumentasi yang ada.

---

## 1. Ringkasan Umum

Proyek ini terdiri dari beberapa domain utama:

- **Arsitektur** – menampilkan keputusan arsitektural dan diagram C4.
- **Diagram** – diagram‑diagram UML/flow yang di‑render dengan Mermaid.
- **Requirement** – Business Requirement Document (BRD), Product Requirement Document (PRD), dan System Requirement Document (SRD).
- **Desain Sistem** – pola, komponen, dan strategi implementasi.
- **UI** – komponen UI, tema, dan panduan styling.

Alur kerja dimulai dari **Requirement** → **Arsitektur** → **Desain Sistem** → **Implementasi** → **UI** → **Testing** → **Release**.

### Visualisasi Alur Kerja Sistem (End-to-End Workflow Diagram)

```mermaid
flowchart TD
    classDef startClass fill:#1e293b,stroke:#38bdf8,stroke-width:2px,color:#f8fafc;
    classDef stageClass fill:#0f172a,stroke:#818cf8,stroke-width:1.5px,color:#f8fafc;
    classDef decisionClass fill:#312e81,stroke:#c084fc,stroke-width:2px,color:#f8fafc;
    classDef fasttrackClass fill:#064e3b,stroke:#34d399,stroke-width:2px,color:#f8fafc;
    classDef verifyClass fill:#1c1917,stroke:#f59e0b,stroke-width:1.5px,color:#f8fafc;
    classDef doneClass fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#f8fafc;

    subgraph Phase1 ["1. Input & Elicitation Gate"]
        START([User / Developer Prompt]) :::startClass --> CHK_REQ{Sudah Ada Dokumen Kebutuhan?<br/>PRD / BRD / SRD} :::decisionClass
        CHK_REQ -- Ya: Fast-Track --> FAST_TRACK[Auto-Ingest Dokumen Kebutuhan Langsung<br/>Lewati Tahap 1 Langsung ke Arsitektur] :::fasttrackClass
        CHK_REQ -- Belum: Tahap 1 --> STAGE1[Stage 1: Elisitasi Kebutuhan Formal<br/>- PRD Atlassian Agile<br/>- BRD BABOK Guide v3<br/>- SRD ISO/IEC/IEEE 29148 EARS] :::stageClass
    end

    subgraph Governance ["Dual-Track Token Economy & Approval Gate"]
        GOV_CHK{Tipe Permintaan} :::decisionClass
        GOV_CHK -- Non-Teknis / Sepele --> QUICK_RESP[Respons Ringkas: Kesimpulan Langsung] :::stageClass
        GOV_CHK -- Teknis Berat --> DEEP_ANALYSIS[Analisis Mendalam First-Principles] :::stageClass
        DEEP_ANALYSIS --> DEV_APPROVE{Persetujuan Developer?} :::decisionClass
        DEV_APPROVE -- Revisi --> DEEP_ANALYSIS
        DEV_APPROVE -- Disetujui --> STAGE2
    end

    FAST_TRACK --> STAGE2[Stage 2: Architectural Paradigm & Boundaries<br/>- Clean Architecture & Hexagonal<br/>- Modular Monolith & FSD v2.1<br/>- Event-Driven Architecture<br/>- Michael Nygard ADRs] :::stageClass
    STAGE1 --> STAGE2

    subgraph Phase2 ["2. Engineering Design & Modeling"]
        STAGE2 --> STAGE3[Stage 3: Distributed System Design<br/>- Kleppmann Monotonic Fencing Tokens<br/>- Redis XFetch Anti-Stampede Caching<br/>- RDBMS Read/Write Split & Pool Sizing<br/>- Kafka/RabbitMQ Async Queues] :::stageClass
        STAGE3 --> STAGE4[Stage 4: Senior Frontend & UI Frameworks<br/>- 6 Frameworks: shadcn, DaisyUI, Mantine, dll.<br/>- 8 Aesthetics: Bento Grid, Neubrutalism, dll.] :::stageClass
        STAGE4 --> STAGE5[Stage 5: Visual UML & Mermaid Modeling<br/>- C4 Container Architecture<br/>- Sequence, ERD, State, & Activity Flow] :::stageClass
    end

    subgraph Phase3 ["3. Automated Verification & Isolation Gate"]
        STAGE5 --> STAGE6[Stage 6: Output Verification & Sandboxing<br/>- Zero-Egress Network Neutralization<br/>- Secret Scanner: Masking .env & Token<br/>- SHA-256 Tool Pinning Verification] :::verifyClass
        STAGE6 --> CHK_VALID{Semua Audit Lulus?} :::decisionClass
        CHK_VALID -- Gagal --> REMEDIATE[Auto-Scrub & Remediasi Artefak] :::verifyClass
        REMEDIATE --> STAGE6
        CHK_VALID -- Lulus --> ARTIFACTS([Kompilasi Direktori ./docs/<br/>100% Bersih, Tervalidasi & Siap Eksekusi]) :::doneClass
    end
```

> **Catatan Fast-Track Requirement:** Jika pengguna sudah memiliki atau melampirkan salah satu atau seluruh dokumen kebutuhan (`PRD.md`, `BRD.md`, `SRD.md`), sistem akan langsung membaca dokumen tersebut dan melompat langsung ke tahap **Arsitektur** tanpa menanyakan opsi pembuatan dokumen kebutuhan kembali.

> **Prinsip Dual-Track Token & Context Economy:** Pertanyaan sepele atau non-teknis diselesaikan secara ringkas dengan kesimpulan tingkat tinggi demi efisiensi token. Untuk masalah teknis berat, agen melakukan analisis komprehensif hingga tuntas dan **wajib meminta persetujuan developer** sebelum melakukan perubahan berkas atau sistem.

> **Isolasi Privasi Lokal 100%:** Seluruh memori, riwayat desain, dan artefak wajib disimpan secara lokal tanpa tersinkronisasi ke cloud, mencegah kebocoran data untuk pelatihan AI.

---

## 2. Hubungan Antara Dokumen

| Tahap | Dokumen Terkait | Deskripsi Singkat |
|-------|-----------------|-------------------|
| **Requirement** | [docs/requirements/README.md](file:///home/fiky/Documents/Latihan%20Agent/SKILL/docs/requirements/README.md) | Spesifikasi kebutuhan bisnis, produk, dan sistem. |
| **Arsitektur** | [docs/architecture/README.md](file:///home/fiky/Documents/Latihan%20Agent/SKILL/docs/architecture/README.md) | Keputusan arsitektur, diagram C4, dan pemetaan modul. |
| **Diagram** | [docs/diagrams/README.md](file:///home/fiky/Documents/Latihan%20Agent/SKILL/docs/diagrams/README.md) | Diagram Mermaid (activity, sequence, state, dll). |
| **Desain Sistem** | [docs/system-design/README.md](file:///home/fiky/Documents/Latihan%20Agent/SKILL/docs/system-design/README.md) | Rincian desain komponen, pola, dan strategi skalabilitas. |
| **UI** | [docs/ui/README.md](file:///home/fiky/Documents/Latihan%20Agent/SKILL/docs/ui/README.md) | Panduan UI, komponen, dan tema. |
| **Lisensi** | [LICENSE](file:///home/fiky/Documents/Latihan%20Agent/SKILL/LICENSE) | Lisensi MIT yang mengatur penggunaan kode. |

Setiap dokumen memiliki tautan **Back‑Reference** ke dokumen lain yang relevan. Misalnya, `docs/architecture/README.md` mencantumkan link ke `docs/requirements/README.md` untuk menegaskan bahwa keputusan arsitektur didasarkan pada kebutuhan yang telah didefinisikan.

---

## 3. Contoh Navigasi

1. **Mulai dari Requirement** → buka `docs/requirements/README.md`.
2. Lihat keputusan arsitektur pada `docs/architecture/README.md` (terkait dengan requirement).
3. Telusuri diagram‑diagram terkait di `docs/diagrams/README.md` untuk visualisasi.
4. Baca detail desain sistem di `docs/system-design/README.md`.
5. Implementasi UI mengacu pada `docs/ui/README.md`.
6. Pada akhir fase, periksa lisensi di `LICENSE`.

---

## 4. Lisensi MIT

Seluruh kode sumber dan dokumentasi dalam proyek ini dilisensikan di bawah **MIT License**. Lihat file lengkapnya di [LICENSE](file:///home/fiky/Documents/Latihan%20Agent/SKILL/LICENSE).

---

## 5. Panduan Pemeliharaan

- Setiap perubahan pada **Requirement** harus di‑update di `docs/requirements/README.md` dan ditandai di diagram arsitektur.
- Saat menambah modul baru, buat diagram Mermaid baru di `docs/diagrams/` dan perbarui `docs/architecture/README.md`.
- Dokumentasi UI harus selalu konsisten dengan tema yang didefinisikan di `docs/ui/`.

---

*Dibuat menggunakan format Markdown standar, dengan tautan relatif yang dapat dibuka di editor atau viewer GitHub.*
