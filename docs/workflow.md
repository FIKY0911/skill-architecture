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
