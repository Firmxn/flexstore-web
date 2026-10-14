# Instruksi Agent — FlexStore

> Fungsi dokumen: menjaga cara kerja agent tetap konsisten. Kebutuhan ada di PRD dan spesifikasi fitur, rancangan ada di SDD, sedangkan fase, task, dan keputusan review ada di Implementation Plan.

## 1. Konteks dan komunikasi

| Pengaturan | Isi |
| --- | --- |
| Nama proyek | FlexStore — E-Commerce Platform MVP |
| Bahasa komunikasi | Bahasa Indonesia |
| Gaya laporan | Ringkas, jelas, sertakan bukti (hasil verifikasi aktual) dan cara mencoba (langkah demo), no fluff |
| Pemilik keputusan produk / reviewer | Development Team / Product Owner |
| Versi / tanggal instruksi | v1.2 / 2026-10-10 |

## 2. Acuan dan tanggung jawab dokumen

| Acuan | Path | Informasi yang harus diikuti |
| --- | --- | --- |
| PRD | `docs/01_PRD.md` | Tujuan, scope MVP, pengguna (Guest/Customer/Admin), modul, aturan bisnis (BR-*), NFR |
| SDD | `docs/02_SDD.md` | Tech stack (Next.js 16, Prisma 5, Supabase, Redis, Xendit, Twilio Verify, Resend), arsitektur (Vercel serverless), project structure, data schema, API contracts, verification commands |
| Spesifikasi fitur | `docs/03_SPESIFIKASI_FITUR.md` | Perilaku fitur per fase (AUTH-01, PROD-01, etc.), validasi (Zod), hak akses (role-based), error handling, kriteria penerimaan (AC-*) |
| Implementation Plan | `docs/04_IMPLEMENTATION_PLAN.md` | Fase aktif (PH-01 sampai PH-06), task (TASK-*), dependensi, exit criteria, bukti verifikasi, keputusan gate |

**Path aktual:** Sama dengan tabel di atas.

**Aturan membaca dan menyelaraskan acuan:**

1. **Baca konteks proyek dan fase aktif dulu** — cek Implementation Plan section 1 (fase aktif) dan section 3 (peta fase), baru baca PRD/SDD/Spesifikasi bagian relevan sebelum coding
2. **Gunakan ID konsisten** — ID modul (MOD-*), fitur (*-01), aturan bisnis (BR-*), kriteria (AC-*), fase (PH-*), task (TASK-*) saat laporan
3. **Detail fitur boleh perjelas PRD, tapi keputusan teknis harus memenuhi kebutuhan** — Jika ada pertentangan nyata (e.g., spesifikasi minta A tapi SDD already decided B), jelaskan dampak dan selesaikan sebelum implement
4. **Terapkan perubahan kebutuhan dari user, catat dampak** — Jangan diam-diam ubah spesifikasi untuk sesuaikan implementasi yang salah
5. **Jangan duplikasi detail di instruksi ini** — Rujuk sumber (project structure di SDD, kontrak API di SDD, aturan bisnis di PRD)

## 3. Scope dan pengambilan keputusan

- **Kerjakan task fase aktif yang sudah diizinkan user** — Cek Implementation Plan section 1 "Fase aktif" dan "Instruksi mulai/lanjut terakhir"
- **Keputusan implementasi rutin: mandiri** — Nama variabel, file placement (ikut SDD structure), pilih shadcn/ui component mana, Zod schema structure — mandiri selama sesuai SDD dan pola kode existing
- **Periksa kode/config/dependency aktual dulu** — Jangan asumsi mekanisme tersedia, cek real code/package.json/docs
- **Jangan anggap placeholder/mock/asumsi sementara sebagai final** — Contoh: SDD tulis "Asumsi sementara" di status stack → bukan keputusan final
- **Info hilang yang ubah perilaku produk/akses/data: catat pertanyaan + dampak + usulan** — Lanjutkan task lain yang tidak bergantung jawaban
- **Usulan fitur di luar scope: catat backlog, jangan implement** — Contoh: user minta "add to cart", jangan implement "wishlist" tanpa instruksi
- **Jangan ubah pekerjaan user yang tidak berkaitan task** — Fokus scope task aktif
- **Pertanyaan sederhana / brainstorming: jawab saja, jangan eksekusi** — Kalau user bertanya hal sederhana atau meminta brainstorming/diskusi, cukup jawab pertanyaannya. Jangan mengubah kode, dokumentasi, atau menjalankan task teknis tanpa instruksi eksplisit. Eksekusi hanya jika user menyuruh mengerjakan
- **Jangan finalkan dokumentasi sebelum kode direview** — Kode yang belum direview masih bisa berubah. Batasi update dokumentasi pada task yang sesuai kode yang sedang diimplementasikan (fase aktif); jangan ubah/finalkan seluruh dokumentasi (PRD/SDD/Spesifikasi) sebelum hasil review disetujui, supaya tidak perlu diperbaiki berulang saat ada revisi

## 4. Prinsip coding

| Prinsip | Aturan operasional |
| --- | --- |
| **KISS** | Pilih solusi paling sederhana yang memenuhi spesifikasi. Gunakan Next.js App Router pattern, Prisma queries, NextAuth session — jangan reinvent. |
| **YAGNI** | Bangun kemampuan scope saat ini. Jangan tambah abstraksi/generalisasi/fleksibilitas untuk kebutuhan hipotetis. Contoh: Phase 1 butuh CRUD product → buat CRUD product, jangan buat generic CRUD generator. |
| **DRY** | Periksa implementasi existing, reuse logik yang **benar-benar sama**. Jangan satukan kode cuma karena mirip bentuk kalau aturan bisnis beda. Contoh: Voucher calculation bertahap vs flat discount → beda aturan, jangan paksa DRY. |
| **SoC** | Tempatkan UI (`/src/app/`), logic (`/src/lib/`), data (`Prisma`), integration (`SDK wrappers`) sesuai SDD section 5 (Project Structure). |

**SRP, low coupling, encapsulation:** Gunakan kalau bantu perjelas tanggung jawab dan jaga aturan data. No kewajiban tambah layer/pattern kalau tidak perlu.

## 5. Implementasi dan integrasi

- **Ikuti idiomatic Next.js 16 App Router structure (SDD section 5)** — File-based routing (`page.tsx`, `layout.tsx`, `route.ts`), Server Components default, Route Groups untuk organize routes, API Routes di `/src/app/api/`, business logic di `/src/lib/`, UI components di `/src/components/`
- **Ikuti stack/versi/structure SDD** — Next.js 16.3+ (Turbopack default), React 19.2 (React Compiler), Prisma 5, NextAuth v5 (beta), Uploadthing v7+, Xendit latest, Twilio, Resend. Project structure SDD section 5.
- **Next.js 16 conventions wajib:**
  - Route UI: `page.tsx` (bukan `index.tsx`)
  - API handler: `route.ts` (bukan `api.ts`)
  - Layout: `layout.tsx` (shared wrapper, persists across navigations)
  - Loading: `loading.tsx` (Suspense boundary)
  - Error: `error.tsx` (Error boundary)
  - Dynamic routes: `[param]/page.tsx` (bukan `[param].tsx`)
  - Server Components default (no `'use client'` kecuali perlu interactivity)
  - API Routes: export `GET`, `POST`, `PATCH`, `DELETE` functions (bukan `handler`)
- **Import dependency direction** — `/src/app/` → `/src/lib/` + `/src/components/`, `/src/lib/` → NO `/src/app/` (avoid circular deps), API Routes → `/src/lib/*/queries.ts` (NO direct Prisma in route handlers)
- **Pastikan API dependency tersedia via docs resmi sesuai versi** — Jangan karang nama fungsi/config. **Gunakan MCP Context7 untuk fetch dokumentasi resmi** (Next.js 16, React 19.2, NextAuth v5, Prisma 5, Xendit, Twilio, Resend, Uploadthing, RajaOngkir/Biteship) sebelum implement. Contoh: Xendit SDK → fetch via Context7 atau cek https://developers.xendit.co, Prisma → https://prisma.io/docs versi 5.x
- **Terapkan validasi dan akses check di layer tepercaya (SDD)** — Server-side validation (Zod di API Routes), NextAuth middleware untuk protected routes, role check di API handler
- **WAJIB: OWASP Top 10 security measures (SDD section 10)** — **SEMUA API endpoints** harus implement:
  - **A01 Access Control:** Role check di handler (`if (session.user.role !== 'STORE_ADMIN') return 403`)
  - **A03 Injection:** Prisma ORM only (**NO raw SQL**), Zod validation BEFORE queries
  - **A07 Auth:** NextAuth session check, bcrypt password, OTP verification
  - **A08 Integrity:** Xendit/Twilio webhook signature verification
  - **XSS:** NO `dangerouslySetInnerHTML` without DOMPurify, React auto-escapes (RSC)
  - **Input Validation:** Zod schemas di **SEMUA API Routes** (server-side), validate file uploads
  - **Secrets:** `.env.local` only, NO hardcode secrets di code/logs
  - **Error Messages:** Generic to users ("Invalid credentials"), detailed to logs only
- **Ikuti spesifikasi untuk loading/empty/success/validation fail/service fail** — Contoh: PROD-01 section 9 (Perilaku UI) → loading spinner saat save, error message near input saat validation fail
- **Bedakan data contoh, mock, config baru, integrasi teruji** — Contoh: Twilio Trial (dev) vs production, Xendit sandbox vs production
- **Rahasia di config (`.env.local`), jangan tulis di code/docs/laporan** — `XENDIT_SECRET_KEY`, `TWILIO_AUTH_TOKEN`, `DATABASE_URL` → `.env.local`, no hardcode
- **Perubahan dependency/rancangan: jelaskan alasan + dampak, selaraskan acuan dulu** — Contoh: Mau ganti Prisma ke Drizzle → jelaskan kenapa, update SDD dulu

## 6. Dokumentasi dan reference eksternal

- **Gunakan MCP Context7 untuk fetch dokumentasi resmi** — Sebelum implement fitur yang depend on external API/library, fetch docs via Context7 untuk pastikan API signature, config options, dan breaking changes sesuai versi yang digunakan
- **Context7 use cases:**
  - Next.js 16 API reference (App Router, Server Components, `use cache`, Turbopack config, Metadata API)
  - React 19.2 features (React Compiler, RSC patterns, Server Actions)
  - NextAuth v5 (beta) (App Router integration, session management, providers)
  - Prisma 5 (ORM queries, migrations, transactions, middleware)
  - Xendit API (payment methods, webhook signature, refund)
  - Twilio Verify API (OTP SMS, `verificationChecks`)
  - Resend API (email sending, templates)
  - Uploadthing (file upload, signed URLs, Next.js 16 integration)
  - RajaOngkir/Biteship API (shipping cost, tracking)
- **Kapan fetch docs:**
  - Sebelum implement integration (Xendit, Twilio, Resend, Uploadthing, RajaOngkir/Biteship)
  - Saat ada API breaking changes atau deprecation warning
  - Saat verify compatibility (Next.js 16 + React 19.2 + NextAuth v5)
  - Saat unsure tentang API signature, config options, atau parameter
- **Jangan karang API** — Kalau tidak ada di docs Context7 atau official docs, jangan asumsi nama fungsi/config exists

## 7. Verifikasi dan bukti

- **Gunakan perintah SDD section 12 (Verification commands)** — `pnpm dev`, `pnpm build`, `pnpm lint`, dan migrasi lewat script `pnpm db:*` (`pnpm db:migrate`, `pnpm db:deploy`; `pnpm db:seed`; rotasi password admin `pnpm db:reset-admin-passwords`). Repo ini belum punya skrip `pnpm test`/`pnpm test:e2e`; skenario verifikasi dijalankan manual per fase (lihat SDD section 12). Jangan panggil `pnpx prisma` langsung: CLI Prisma tidak membaca `.env.local` (lihat Implementation Plan section 10)
- **Pilih pemeriksaan yang buktikan AC dan risiko perubahan** — Alur gagal (duplicate SKU), nilai batas (stock = 0), akses tidak sah (guest access admin route)
- **Jalankan pemeriksaan saat fase dikerjakan, jangan tunda sampai akhir** — Contoh: TASK-11 (Product CRUD) selesai → langsung verify AC-PROD-01-01 sampai AC-PROD-01-08
- **Build success bukan bukti seluruh perilaku fitur terpenuhi** — `pnpm build` success = type check pass, bukan "semua fitur work"
- **Perbaiki kegagalan terkait fase aktif, periksa ulang bagian terdampak** — Contoh: Fix validation bug → re-test validation scenarios
- **Catat perintah/langkah, hasil aktual, bukti di Implementation Plan section 4.5 (Bukti verifikasi)** — Format table: Kebutuhan | Pemeriksaan | Hasil aktual | Status | Bukti
- **Laporkan pemeriksaan gagal/belum dijalankan/terblokir + alasan** — Jangan klaim "aman", "bebas error", "lulus semua" melebihi bukti tersedia

## 8. Pelaksanaan fase dan review gate

1. **Baca fase aktif dan instruksi mulai/lanjut terakhir** — Implementation Plan section 1, jangan tentukan fase berikutnya sendiri
2. **Kerjakan task sesuai dependensi sampai exit criteria terpenuhi** — Laporan hambatan nyata, jangan anggap fase selesai kalau ada blocker
3. **Jalankan verifikasi, perbaiki temuan dalam scope, siapkan hasil yang bisa dicoba user** — Exit criteria section 4.4 per fase
4. **Update bukti dan status jadi "Siap direview" hanya jika persyaratan terpenuhi** — Implementation Plan section 4.5 (Bukti verifikasi) filled, exit criteria checked
5. **Kirim laporan review pakai format Implementation Plan section 4.6, lalu BERHENTI sebelum mulai fase berikutnya** — Jangan lanjut tanpa approval user
6. **User minta revisi: catat keputusan, perbaiki fase yang sama, ajukan hasil perbaikan untuk review kembali** — Implementation Plan section 4.7 (Keputusan gate)
7. **User terima hasil: catat status "Disetujui", mulai fase berikutnya HANYA jika instruksi user izinkan lanjut ke fase itu** — Update Implementation Plan section 1 "Fase aktif" dan section 4.7 (Keputusan gate)
8. **Penerimaan + izin lanjut dalam satu pesan: langsung lanjut sesuai instruksi, jangan minta izin sama lagi** — Contoh: User: "PH-01 oke, lanjut PH-02" → langsung mulai PH-02, jangan tanya "boleh mulai PH-02?"

**Contoh gate flow:**
- Agent: "PH-01 siap direview. Coba login admin, CRUD product. Menunggu keputusan." → STOP
- User: "PH-01 oke, lanjut PH-02" → Agent: Update Implementation Plan (PH-01 Disetujui, PH-02 Berjalan), mulai TASK-15 (PH-02 task pertama)

## 9. Laporan hasil dan hambatan

**Format laporan (Implementation Plan section 4.6):**

1. **Fase dan status:** PH-XX — Nama, Siap direview / Terblokir
2. **Hasil yang tersedia:** Perubahan dan manfaat (contoh: "Admin dapat CRUD products, Customer dapat view product list/detail")
3. **Task selesai / belum selesai:** TASK-01 sampai TASK-14 selesai, TASK-15 terblokir karena X
4. **Verifikasi:** AC-PROD-01-01 lulus, AC-PROD-01-05 lulus (duplicate slug rejected), AC-PROD-01-06 lulus (duplicate SKU rejected)
5. **Cara mencoba:** 
   - Admin: Login `/admin` → Go `/admin/products` → Add product → Edit → Delete
   - Customer: Go `/` → View list → Click product → View detail
6. **Masalah / batasan:** E2E tests belum ada (manual verification only), Uploadthing sandbox (not production yet)
7. **Keputusan yang dibutuhkan:** Terima dan lanjut PH-02, atau revisi jika ada issue

**Sertakan minimal:** Fase, hasil, task status, pemeriksaan + hasil aktual, langkah demo, masalah terbuka, keputusan dibutuhkan.

## 10. Pembaruan dokumen dan pergantian sesi

- **Update Implementation Plan:** Status task (section 4.2), bukti (section 4.5), hambatan, catatan lanjutan (section 11)
- **Bedakan update rutin vs finalisasi** — Update Implementation Plan (status task, bukti, hambatan) untuk task yang sedang diimplementasikan boleh dilakukan kapan saja. Finalisasi/perubahan menyeluruh dokumentasi (PRD/SDD/Spesifikasi) ditunda sampai kode disetujui
- **Keputusan ubah kebutuhan: update PRD/Spesifikasi** — Keputusan ubah rancangan: update SDD. Dilakukan setelah keputusan final, bukan untuk mengikuti kode yang belum direview
- **Jaga aturan bersama satu sumber acuan** — Update rujukan terdampak (contoh: BR-01 di PRD diubah → update referensi di Spesifikasi)
- **Catat:** Pekerjaan terakhir, kondisi kode (commit/branch), hasil pemeriksaan, keputusan gate, langkah berikutnya diizinkan
- **Pesan commit wajib mengikuti Conventional Commits** — Format dan contoh di section 12
- **Sesi baru:** Baca catatan + periksa keadaan proyek sebelum lanjut
- **Jangan ubah instruksi / syarat gate untuk lewati review ditetapkan user** — Contoh: Exit criteria PH-01 minta "Admin CRUD works" → jangan ubah jadi "Admin read-only works" untuk skip implement

## 11. Aturan khusus proyek

| Aturan | Alasan / tujuan | Referensi |
| --- | --- | --- |
| **No emoji di code/docs/laporan** | Consistency, professional tone | - |
| **WAJIB: OWASP Top 10 security di SEMUA API endpoints** | Prevent security vulnerabilities (A01-A10) | PRD 6.1, SDD section 10 |
| **Gunakan Bahasa Indonesia untuk UI label yang user-facing** | Target market Indonesia (PRD 7.8) | PRD section 7.8 |
| **English OK untuk code (variable, function, component names)** | Standard practice | - |
| **Guest checkout wajib OTP verification** | Prevent spam/fake orders (PRD 5.7) | PRD section 5.7, Spesifikasi AUTH-01 |
| **Stock reservation 10 min expiry** | Balance user convenience vs overselling risk (PRD 5.1) | PRD section 5.1, SDD 4.4 |
| **Voucher calculation bertahap (seller-oriented)** | Minimize discount, benefit seller (PRD 5.3) | PRD section 5.3, SDD 4.6 |
| **Webhook idempotency 24h** | Prevent double processing (PRD 5.2) | PRD section 5.2, SDD 4.5 |
| **Max 2 vouchers per transaction** | Limit stacking complexity (PRD 5.4) | PRD section 5.4 |
| **Customer max 5 addresses** | Prevent spam/fake data (PRD 5.8) | PRD section 5.8 |
| **Product images: 1 main + 3 optional (max 4), variant 1 image, size chart 1 image** | Scope limit, storage cost (PRD 7.4) | PRD section 7.4, SDD 4.2 |
| **Refund manual wajib upload bukti** | Traceability (PRD 5.6) | PRD section 5.6, Spesifikasi ORDER-06 (future) |
| **Payment methods priority: QRIS (0.7%) > VA (Rp4k) > E-Wallet (2%)** | Cost optimization (PRD 7.1) | PRD section 7.1, SDD 4.5 |
| **Shipping API timeout 10s, fallback flat rate Rp10k** | UX resilience (PRD 3.1.F) | PRD section 3.1.F, SDD 4.7 |
| **shadcn/ui untuk admin panel** | Modern, Tailwind-based, customizable (PRD 7.6) | PRD section 7.6, SDD section 2 |
| **Prisma migrations via script `pnpm db:*` (`pnpm db:migrate` dev, `pnpm db:deploy` prod)** | CLI Prisma tidak membaca `.env.local`; script dibungkus `dotenv-cli` | SDD section 12, Implementation Plan section 10 |
| **Seed create-only; rotasi password akun lewat `pnpm db:reset-admin-passwords`, bukan seed** | Seed tidak boleh menimpa password akun lama; dua akun admin wajib beda password (min 12 karakter, atau dibuat acak dengan `RESET_GENERATE=true`) | `docs/06` bagian 8, SDD section 12 |
| **NextAuth v5 (beta)** | Dukungan App Router; v5 belum rilis stabil (tag `latest` npm masih v4) | SDD section 2, SDD 4.1 |
| **Phase bertahap review (PH-01 sampai PH-06)** | Incremental verification, catch bugs early | Implementation Plan section 3 |
| **Pesan commit pakai Conventional Commits v1.0.0** | Riwayat terbaca manusia + dibaca tooling (changelog, versi) | Section 12, <https://www.conventionalcommits.org/en/v1.0.0> |

---

## 12. Konvensi pesan commit (Conventional Commits)

Sumber acuan: **Conventional Commits v1.0.0** (<https://www.conventionalcommits.org/en/v1.0.0>).
Spesifikasi ini bukan standar ISO, tetapi spesifikasi resmi de-facto yang dibaca oleh tooling
(commitlint, semantic-release, generator changelog). Semua commit di proyek ini wajib memakainya.

### 12.1. Format

```text
<type>[scope opsional][!]: <deskripsi>

[body opsional]

[footer opsional]
```

- **Type** wajib: kata benda (`feat`, `fix`, dst), diikuti scope opsional, `!` opsional, lalu
  titik dua dan satu spasi.
- **Scope** opsional: kata benda bagian kode dalam tanda kurung, contoh `fix(parser):`.
- **Deskripsi** wajib: ringkas, imperatif, huruf kecil, tanpa titik di akhir.
- **Body** opsional: mulai satu baris kosong setelah deskripsi, bebas berapa paragraf.
- **Footer** opsional: satu baris kosong setelah body, token pakai `-` sebagai pengganti spasi,
  contoh `Refs: #123`, `Reviewed-by: Z`.

### 12.2. Type

| Type | Untuk | Efek SemVer |
| --- | --- | --- |
| `feat` | fitur baru | MINOR |
| `fix` | perbaikan bug | PATCH |
| `docs` | dokumentasi saja | - |
| `style` | format/whitespace, bukan perilaku | - |
| `refactor` | ubah struktur, bukan fitur/bug | - |
| `perf` | peningkatan performa | - |
| `test` | tambah/ubah test | - |
| `build` | build system, dependency | - |
| `ci` | konfigurasi CI | - |
| `chore` | rutin lain di luar src/test | - |
| `revert` | membatalkan commit lain | - |

Type lain diperbolehkan spesifikasi, tetapi daftar di atas (Angular convention) adalah yang
dipakai proyek ini. Type selain `feat`/`fix` tidak punya efek SemVer implisit kecuali memuat
`BREAKING CHANGE`.

### 12.3. Breaking change

Breaking change wajib ditandai salah satu:

- tanda `!` sebelum titik dua, contoh `feat(api)!: drop legacy order endpoint`, atau
- footer `BREAKING CHANGE: <penjelasan>`.

`BREAKING CHANGE` harus HURUF BESAR. Bentuk `BREAKING-CHANGE` dianggap sinonim. Kalau `!` sudah
dipakai, footer `BREAKING CHANGE:` boleh dihilangkan; deskripsi commit menjelaskan perubahannya.
Selain token itu, spesifikasi tidak membedakan huruf besar/kecil.

### 12.4. Contoh untuk FlexStore

```text
feat(products): add product pagination on catalog page

fix(otp): map expired verification to 410 instead of 502

docs(setup): rewrite Twilio section for Verify API

chore: add .gitattributes and ignore local scratch files

feat(auth)!: require OTP for guest checkout

BREAKING CHANGE: guest orders without a verified phone are now rejected
```

### 12.5. Aturan operasional

- Satu commit satu perubahan logis. Jangan campur refactor besar dengan perbaikan bug.
- Judul (type + scope + deskripsi) maksimal 72 karakter.
- `type` dan `BREAKING CHANGE` selalu Inggris (keyword yang dibaca tooling). Deskripsi boleh
  Bahasa Indonesia, tetapi konsisten satu repo.
- Cantumkan konteks fase/task di body bila relevan, contoh `Refs: PH-01 / TASK-11`.
- Jangan pernah menulis rahasia (kredensial, token, isi `.env`) di pesan commit.
- Agent hanya menulis draf pesan commit; perintah `git commit` dijalankan setelah user setuju.
- Belum ada hook commitlint di repo ini. Kalau nanti dipasang, aturan di bagian ini yang jadi acuan.

---

**Status:** Instruksi Agent v1.2 — menambahkan aturan komunikasi (jawab pertanyaan sederhana/brainstorming tanpa eksekusi) dan aturan tidak memfinalkan dokumentasi sebelum kode direview.

**Reminder:**
- Fase aktif: PH-01 **Disetujui**; PH-02 belum dimulai (Implementation Plan section 1)
- Langkah berikutnya: menunggu instruksi user untuk mulai PH-02
- Agent baca Implementation Plan section 4 sebelum mulai task PH-02