# Implementation Plan — FlexStore

> Fungsi dokumen: mengubah kebutuhan menjadi fase dan task, menentukan urutan serta dependensi, dan mencatat bukti hasil berikut keputusan review. Setiap fase menghasilkan sesuatu yang bisa diperiksa.

## 1. Identitas dan kondisi sekarang

| Isian | Jawaban |
| --- | --- |
| Proyek / target rilis | FlexStore MVP |
| Versi / tanggal rencana | v1.0 / 2026-10-09 |
| Versi PRD, SDD, dan spesifikasi | PRD v1.1, SDD v1.0, Spesifikasi Fitur v1.3 |
| Reviewer / pemilik keputusan gate | Development Team / Product Owner |
| Fase aktif | PH-07 — Customer Management (Akun + Alamat) — **Siap direview**. PH-01..PH-06 **Disetujui** (bagian 4.7, 5.7, 6.7, 7.7, 8.5, 9.5); revisi PH-03 pasca-persetujuan (perbaikan OTP guest + redesign urutan alamat) tercatat di bagian 6.8 |
| Task aktif / terakhir | PH-07 — TASK-67 sampai TASK-79 selesai; verifikasi otomatis lulus (bagian 12.4), uji klik-through manual menunggu pengguna |
| Instruksi mulai / lanjut terakhir | User: "mulai phase 1" (2026-10-09), "lanjutkan" (2026-10-09), "sudah bisa saya coba akses?" (2026-10-09), "perbaiki di PH-01" + "error.tsx tambahkan di PH-01" (2026-10-09), "opsi 1 gua setuju" (2026-10-10), "jalankan 1 dan 2 dulu" (2026-10-10), "jika ada masalah kredensial yang diperlukan, skip dulu, dan lanjutkan coding sampai selesai" (2026-10-10), "oke next lanjut ke phase 4?" (2026-10-10), "lanjutkan" (2026-10-10, memulai PH-05), "kerjakan phase 6" (2026-10-11), "next ph 7" (2026-10-11, menerima PH-06 sekaligus memulai PH-07) |
| Hambatan saat ini | Tidak ada yang memblokir. Catatan: (a) email produksi butuh domain Resend terverifikasi (`EMAIL_FROM`); (b) webhook Xendit tidak sampai ke `localhost` (rekonsiliasi menutupi); (c) DB Supabase kadang `P1001` saat dev (retry) |

## 2. Status dan aturan gate

| Status fase | Arti |
| --- | --- |
| Belum dimulai | Belum dikerjakan |
| Berjalan | Task fase sedang dikerjakan atau diperbaiki |
| Terblokir | Pekerjaan tidak dapat maju karena hambatan yang dicatat |
| Siap direview | Exit criteria terpenuhi dan bukti disiapkan; menunggu review pengguna |
| Perlu revisi | Review menemukan pekerjaan yang harus diperbaiki dalam fase ini |
| Disetujui | Reviewer menerima hasil; keputusan dan cakupannya sudah dicatat |

**Aturan gate:**
- Agent berhenti setelah melaporkan hasil fase dan menunggu keputusan pengguna
- Fase berikutnya dimulai setelah ada instruksi pengguna yang mengizinkannya
- Instruksi "fase ini oke, lanjut fase berikutnya" cukup untuk menerima hasil sekaligus memberi izin lanjut
- Jika review meminta perbaikan, kerjakan dalam fase yang sama dan laporkan ulang

## 3. Peta fase

| ID | Nama Fase | Hasil yang bisa dicoba | Modul / Fitur | Prasyarat | Status |
| --- | --- | --- | --- | --- | --- |
| PH-01 | Foundation (Auth + Product) | Admin/Customer login, CRUD products, view product list | MOD-AUTH (AUTH-01, AUTH-02, AUTH-03), MOD-PROD (PROD-01, PROD-02, PROD-03, PROD-04, PROD-05) | Setup project, DB, Redis, Supabase, Upstash | **Disetujui** (2026-10-10) |
| PH-02 | Shopping Flow (Cart + Shipping) | Add to cart, update/remove cart, calculate shipping cost | MOD-CART (CART-01, CART-02, CART-03, CART-04), MOD-SHIP (SHIP-01) | PH-01 disetujui | **Disetujui** (2026-10-10) |
| PH-03 | Checkout (Order Creation) | Guest checkout (OTP), Customer checkout, order history, track order | MOD-ORDER (ORDER-01, ORDER-02, ORDER-03, ORDER-04) | PH-02 disetujui | **Disetujui** (2026-10-10) |
| PH-04 | Payment Integration | Create payment (Xendit), webhook handler, stock reservation release | MOD-PAY (PAY-01, PAY-02) | PH-03 disetujui, Xendit sandbox setup | **Disetujui** (2026-10-10) |
| PH-05 | Core Features (Voucher + Notification + Invoice) | Apply voucher, voucher CRUD, email notification, invoice PDF | MOD-VOUCH (VOUCH-01, VOUCH-02), MOD-NOTIF (NOTIF-01), MOD-INV (INV-01) | PH-04 disetujui, Resend setup | **Disetujui** (2026-10-11) |
| PH-06 | Polish MVP (Reports + Config + Advanced) | Kelola pesanan admin (status, resi, status pembayaran), sales report (5 laporan PRD 4.11), store settings + template alasan penolakan, shipping tracking, tracking pesanan customer (daftar dalam perjalanan + detail, ORDER-08), cancel/refund, pickup, voucher dibatasi produk/kategori, email lanjutan (shipped/cancel/refund) | MOD-SHIP (SHIP-02, SHIP-03), MOD-ORDER (ORDER-05, ORDER-06, ORDER-07, ORDER-08), MOD-REPORT (REPORT-01), MOD-CONFIG (CONFIG-01), MOD-VOUCH (lanjutan VOUCH-01), MOD-PROD (lanjutan PROD-01), MOD-NOTIF (lanjutan NOTIF-01) | PH-05 disetujui | **Disetujui** (2026-10-11) |
| PH-07 | Customer Management (Akun + Alamat) | Simpan/ubah/hapus alamat (maks 5), pilih alamat saat checkout, pesan lagi dari pesanan lama, set password (guest isi email), reset password, preferensi notifikasi | MOD-CUST (CUST-01, CUST-02), MOD-ORDER (lanjutan ORDER-03), MOD-AUTH (AUTH-04, AUTH-05) | PH-03 + PH-05 disetujui (email untuk set/reset password; diubah dari "hanya PH-03" oleh audit 2026-10-10) | **Siap direview** (2026-10-11) |
| PH-08 | Site Admin (Platform Configuration) | Login Site Admin, kelola akun Store Admin, konfigurasi payment gateway (Xendit), konfigurasi shipping provider (RajaOngkir), pengaturan platform | MOD-SITE (SITE-01, SITE-02, SITE-03, SITE-04) | PH-05 disetujui (disarankan setelah PH-06) | Belum dimulai |

**Phase Checkpoint:**
- **PH-01:** Admin bisa CRUD products, Customer bisa register/login/view products → Foundation ready
- **PH-02:** User bisa add to cart, calculate shipping → Shopping flow ready
- **PH-03:** User bisa checkout (guest + customer), stock reserved → Checkout ready (no payment)
- **PH-04:** Payment flow, webhook, stock deduction work → Payment integration complete
- **PH-05:** Voucher calculation, email, invoice work → Core features complete
- **PH-06:** Reports (5 laporan PRD 4.11), settings + template alasan penolakan, kelola pesanan admin, shipping tracking, tracking pesanan customer tanpa input data (ORDER-08), cancel/refund, pickup, cakupan voucher per produk/kategori, email lanjutan work → MVP complete
- **PH-07:** Customer bisa menyimpan alamat, memilihnya saat checkout, pesan lagi, set/reset password, atur preferensi notifikasi → fitur akun customer ready
- **PH-08:** Site Admin bisa login dan mengonfigurasi platform (payment gateway, shipping provider, akun Store Admin) → kriteria sukses PRD #10 ready

---

## 4. Rincian Fase: PH-01 — Foundation (Auth + Product)

### 4.1. Tujuan dan batas

- **Tujuan:** Admin dan Customer dapat login, Admin dapat CRUD products (category, brand, variants), Customer dapat view product list/detail
- **Termasuk:** 
  - Setup project (Next.js 16 App Router **following idiomatic structure per SDD section 5**, Prisma, Supabase, Redis/Upstash)
  - Auth: Guest OTP verification, Customer registration, Customer login
  - Product: CRUD (create, update, delete), Category/Brand management, Product list/detail (customer view)
- **Tidak termasuk:** Cart, Order, Payment (Phase 2-4)
- **Project structure requirement:** Follow **idiomatic Next.js 16 App Router conventions** (SDD section 5) — file-based routing (`page.tsx`, `layout.tsx`, `route.ts`), Server Components default, Route Groups `(storefront)` + `admin`, API Routes di `/src/app/api/`, business logic di `/src/lib/`, UI components di `/src/components/`
- **Referensi kebutuhan:** 
  - PRD 3.1.A (Product Management), PRD 4.1 (Authentication)
  - SDD 4.1 (MOD-AUTH), SDD 4.2 (MOD-PROD), **SDD 5 (Project Structure — idiomatic Next.js 16)**
  - Spesifikasi: AUTH-01, AUTH-02, AUTH-03, PROD-01, PROD-02, PROD-03, PROD-04, PROD-05
- **Prasyarat:** 
  - Next.js 16, Node.js 20+, pnpm
  - Supabase account (PostgreSQL)
  - Upstash account (Redis)
  - Twilio Verify Service (akun Trial cukup untuk dev; uji terbukti berjalan ke nomor yang dipakai mendaftar akun — lihat catatan Verified Caller ID di section 10)
  - Uploadthing account (image storage)
- **Langkah demo singkat:** 
  1. Guest: Verify phone via OTP → Success
  2. Customer: Register → Login → View product list → View product detail
  3. Admin: Login → Add product (with variants, images) → View product list → Edit product → Delete product
  4. Admin: Add category → Add brand → Assign to product
- **Estimasi:** 3-5 hari (asumsi: 1 developer, no blocker)

### 4.2. Daftar task

| ID | Pekerjaan / hasil | Fitur | Bergantung pada | Status | Bukti |
| --- | --- | --- | --- | --- | --- |
| TASK-01 | Setup project: Next.js 16 App Router (idiomatic structure per SDD section 5), Prisma, Tailwind, shadcn/ui | - | - | Selesai | `pnpm build` exit 0, 22 route, struktur sesuai SDD section 5 |
| TASK-02 | Setup database: Prisma schema, Supabase connection, migrations | - | TASK-01 | Selesai | Migrasi `20261009111500_init` ter-baseline; `migrate status` = "Database schema is up to date!"; seed membuat 6 kategori/produk |
| TASK-03 | Setup Redis: Upstash client, connection test | - | TASK-01 | Selesai | `/api/otp/send` mengembalikan `502 SEND_FAILED` (bukan error Redis) → client Redis aktif |
| TASK-04 | Setup auth: NextAuth.js v5, credentials provider, session | AUTH-01, AUTH-02, AUTH-03 | TASK-02 | Selesai | Login admin & customer → `302` + sesi berisi `role`; `ƒ Proxy (Middleware)` aktif di build |
| TASK-05 | Implement AUTH-01: Guest OTP verification (Twilio Verify) | AUTH-01 | TASK-03, TASK-04 | Selesai | `src/lib/auth/otp.ts` memakai **Twilio Verify** (`client.verify.v2`), bukan Messaging API: Twilio yang membuat dan memeriksa kode, Redis hanya menyimpan SID sesi (TTL 5 menit). Terbukti end-to-end: kirim `200` + SMS sampai ke HP (pengirim tampil `TWVerify`), verifikasi `200 {"verified":true}` dua kali dengan kode berbeda. Cabang gagal ikut terbukti: `410 OTP_EXPIRED`, `400 OTP_INVALID`, `429 RATE_LIMITED`. Bukti lengkap di bagian 4.5 |
| TASK-06 | Implement AUTH-02: Customer registration | AUTH-02 | TASK-04 | Selesai | `POST /api/auth/register` → `201`, user dibuat, bisa login |
| TASK-07 | Implement AUTH-03: Customer login | AUTH-03 | TASK-04, TASK-06 | Selesai | Login customer → sesi `role: CUSTOMER` |
| TASK-08 | Setup Uploadthing: Image upload, storage | PROD-01 | TASK-01 | Selesai (kode) | Gate auth terverifikasi: `403` tanpa sesi, `200` dengan sesi; unggah berkas nyata belum diuji |
| TASK-09 | Implement PROD-04: Category CRUD (Admin) | PROD-04 | TASK-02, TASK-04 | Selesai | `GET /api/admin/categories` dengan sesi → `200`; `401` tanpa sesi. Data seed tampil di form produk |
| TASK-10 | Implement PROD-05: Brand CRUD (Admin) | PROD-05 | TASK-02, TASK-04 | Selesai | `401` tanpa sesi; 3 brand seed tampil di katalog |
| TASK-11 | Implement PROD-01: Product CRUD (Admin) | PROD-01 | TASK-02, TASK-04, TASK-08, TASK-09, TASK-10 | Selesai | Create `201`, Edit `200`, Delete `200 {"deleted":true}`; slug duplikat `409`, SKU duplikat `409`, 0 variant `400`, 0 gambar `400` |
| TASK-12 | Implement PROD-02: Product list (Customer) | PROD-02 | TASK-11 | Selesai | `/products` menampilkan 5 produk `ACTIVE` (1 `DRAFT` tidak tampil), paginasi + pencarian |
| TASK-13 | Implement PROD-03: Product detail (Customer) | PROD-03 | TASK-11 | Selesai | `/products/kaos-polos-katun-combed-30s` → `200` dengan varian, harga, stok, gambar |
| TASK-14 | Verify PH-01 exit criteria | All | All tasks | Selesai | 24/24 pemeriksaan akses-kontrol/validasi + seluruh alur CRUD & auth terverifikasi |

### 4.3. Kartu task (sample: TASK-11 — Product CRUD)

| Isian | Detail |
| --- | --- |
| Tujuan | Admin dapat create, update, delete product dengan variants dan images |
| Referensi kebutuhan | Spesifikasi PROD-01, AC-PROD-01-01 sampai AC-PROD-01-08, SDD 4.2 |
| Lingkup perubahan | Admin product form (create/edit), product list admin, API routes `/api/admin/products`, Prisma operations, image upload (Uploadthing) |
| Di luar lingkup | Customer product view (TASK-12, TASK-13), bulk import, structured variant attributes |
| Ketergantungan | TASK-02 (DB schema), TASK-04 (Auth), TASK-08 (Uploadthing), TASK-09 (Category), TASK-10 (Brand) |
| Area kode | `/src/app/admin/products/`, `/src/lib/products/`, `/src/app/api/admin/products/`, Prisma schema (Product, ProductVariant, ProductImage) |
| Hasil yang diserahkan | Admin product CRUD UI, API routes, validation (Zod), Prisma mutations |
| Kriteria selesai task | AC-PROD-01-01 sampai AC-PROD-01-08 lulus (see Spesifikasi PROD-01 section 10) |
| Cara verifikasi | Manual: Login as Admin → Add product → Edit → Delete. Automated: Unit test validation, E2E test (optional Phase 1) |
| Penanggung jawab | Agent / Developer |
| Hambatan / catatan | Tidak ada |

*Kartu task lainnya (TASK-01 sampai TASK-13) dibuat dengan format serupa saat fase dimulai.*

### 4.4. Exit criteria PH-01

- [x] TASK-01 sampai TASK-13 selesai dan tercatat
- [x] Kriteria penerimaan fitur AUTH-01, AUTH-02, AUTH-03, PROD-01, PROD-02, PROD-03, PROD-04, PROD-05 diperiksa
- [x] Alur demo PH-01 dapat dijalankan (Guest OTP, Customer register/login, Admin CRUD products) — Guest OTP terbukti end-to-end (kirim `200` + SMS diterima, verifikasi `200 {"verified":true}`), customer register/login dan admin CRUD sudah jalan
- [x] Database migrations applied, seed data created — migrasi `20261009111500_init`, seed 6 produk + 4 kategori + 3 brand + 1 admin
- [x] `pnpm dev` runs without error
- [x] `pnpm build` success (type check pass) — exit 0, 22 route
- [x] NextAuth session works (login persists after reload) — sesi berisi `id` + `role`, bertahan lewat cookie
- [ ] Uploadthing image upload works — **sebagian:** gate auth terverifikasi (`403` tanpa sesi, `200` dengan sesi); unggah berkas nyata belum diuji. Diterima saat approval PH-01 (2026-10-10); diuji saat kunci API nyata tersedia
- [x] Admin CRUD: Create product → Edit → Delete works, validation (duplicate slug/SKU) works
- [x] Customer view: Product list displayed, product detail displayed
- [x] No unhandled errors in console/logs
- [x] **Security checklist (OWASP Top 10 — SDD section 10):**
  - [x] A01 Access Control: Guest tidak bisa akses `/admin/*` (307 → `/login`); Customer yang sudah login **juga** tidak bisa (`302` → `/` untuk halaman, `403` untuk API admin); role check di semua handler admin
  - [x] A03 Injection: All API routes use Prisma (NO raw SQL — 0 match `$queryRaw`/`$executeRaw`), Zod validation BEFORE Prisma queries
  - [x] A07 Auth: Password hashed (bcrypt), OTP verified (Twilio), session persists (NextAuth)
  - [x] XSS: NO `dangerouslySetInnerHTML` in code (0 match), React auto-escapes
  - [x] Input Validation: Zod schemas di semua API Routes — 9/11 route; 2 pengecualian sah (`/api/auth/[...nextauth]`, `/api/uploadthing`, lihat bagian 10)
  - [x] Secrets: NO hardcoded secrets in code — 0 match pola token/DSN; `.env*` di `.gitignore` dengan `!.env.example`
  - [x] Error Messages: Generic to users ("Gagal kirim OTP, coba lagi", "Slug sudah digunakan"), detailed to logs only

**Kesimpulan:** seluruh kriteria terpenuhi kecuali satu butir yang bergantung pada layanan eksternal —
unggah berkas Uploadthing. Itu pun bukan cacat kode:

- **OTP:** **terbukti end-to-end.** Kode memakai Twilio Verify, konfigurasinya diperiksa langsung ke
  API (service `Try It Out Verify Service` ada, SID di `.env.local` cocok, channel `sms`), lalu
  pengujian nyata dijalankan: kirim `200` dengan SMS yang benar-benar sampai ke HP, dan verifikasi
  `200 {"verified":true}` dua kali dengan kode berbeda. Cabang gagal (`410`/`400`/`429`) ikut terbukti.
- **Uploadthing:** gate auth sudah terbukti bekerja (`403` tanpa sesi, `200` dengan sesi admin);
  hanya unggah berkas nyata yang belum dilakukan. **Dikeluarkan dari daftar butir terbuka saat
  approval PH-01** (2026-10-10) — tidak memblokir, diuji saat kunci API nyata tersedia.

Satu butir di luar daftar exit criteria ikut ditutup selama verifikasi: **`error.tsx` dan
`global-error.tsx` ditambahkan** dan diuji dengan database yang sengaja dimatikan. Satu catatan
diselesaikan tanpa perbaikan karena memang bukan cacat kode: **soft 404 slug produk** — status `200`
alih-alih `404` adalah perilaku PPR yang terdokumentasi dan sudah dibuktikan tidak dapat diperbaiki
dari dalam halaman selama `cacheComponents: true` aktif. **User menyetujui diterima apa adanya
(opsi 1) pada 2026-10-10** (bagian 4.7). Keduanya dirinci di bagian 4.5.

### 4.5. Bukti verifikasi

**Lingkungan:** dev server `localhost:3000` dan build produksi (`pnpm build` + `pnpm start`),
database Supabase aktif (migrasi + seed dijalankan), 2026-10-09.

> Sebagian pemeriksaan (soft 404, error boundary) **hanya sahih di mode produksi**. Di mode dev
> rute dirender ulang per request sehingga hasilnya berbeda; kesimpulan di bawah diambil dari
> `pnpm start`, bukan `pnpm dev`.

| Kebutuhan | Pemeriksaan | Hasil aktual | Status | Bukti |
| --- | --- | --- | --- | --- |
| AC-AUTH-01-01 | Guest input valid phone, click Send OTP | `POST /api/otp/send` → `200`. SMS **benar-benar sampai** ke `+6285813386371`; pengirim tampil di HP sebagai `TWVerify` (penanda Twilio Verify di akun Trial). Resend juga bekerja: pengiriman kedua tetap `200` dan menghasilkan kode baru | **Lulus** | uji nyata + log dev server |
| AC-AUTH-01-02 | Guest input correct OTP, click Verify | `POST /api/otp/verify` → `200 {"verified":true}`, dua kali dengan dua kode berbeda (`739117`, `978711`). Cabang lain ikut terbukti: `410 OTP_EXPIRED` (TTL 5 menit), `400 OTP_INVALID` (kode salah), `429 RATE_LIMITED` (batas 3 kirim/jam) | **Lulus** | uji nyata |
| AC-AUTH-01-01/02 (catatan) | Status Verified Caller ID saat uji | `client.outgoingCallerIds.list()` mengembalikan **0 nomor**, tetapi SMS tetap sampai ke `+6285813386371`. Dugaannya nomor itu adalah nomor pendaftaran akun Twilio, yang otomatis diverifikasi dan tidak muncul di daftar OutgoingCallerIds. Untuk nomor uji **kedua dan seterusnya**, syarat Verified Caller ID tetap berlaku | Informasi | pemeriksaan API read-only |
| AC-AUTH-02-01 | Customer fill registration form, submit | `POST /api/auth/register` → `201 {"id":"98ac2aca-...","name":"Customer Uji","email":"customer.uji@example.com"}`; akun langsung bisa login | Lulus | curl |
| AC-AUTH-03-01 | Customer login with valid credentials | `302` → `/`; sesi `{"name":"Customer Uji","role":"CUSTOMER","id":"98ac2aca-..."}` | Lulus | curl |
| AC-PROD-01-01 | Admin fill valid product form, save | `POST /api/admin/products` → `201` dengan produk lengkap (varian, gambar, `totalStock: 10`) | Lulus | curl |
| AC-PROD-01-05 | Admin use duplicate slug | → `409 {"error":"DUPLICATE","message":"Slug sudah digunakan","field":"slug"}` | Lulus | curl |
| AC-PROD-01-06 | Admin use duplicate SKU in variant | → `409 {"error":"DUPLICATE","message":"SKU sudah digunakan","field":"sku"}` | Lulus | curl |
| AC-PROD-01-07 | Admin save with 0 variants | → `400 {"error":"VALIDATION_ERROR","message":"Minimal 1 variant","field":"variants"}` | Lulus | curl |
| — | Admin edit produk | `PATCH /api/admin/products/:id` → `200`, nama/status/stok berubah | Lulus | curl |
| — | Admin hapus produk | `DELETE` dengan sesi → `200 {"deleted":true}`; `GET` berikutnya → `404` | Lulus | curl |
| — | Validasi wajib gambar | `POST` tanpa gambar → `400 "Minimal 1 gambar"` | Lulus | curl |
| AC-PROD-02-01 | Customer view product list | `/products` → `200`, menampilkan 5 produk `ACTIVE` beserta harga (`Rp 79.000 - Rp 84.000` dst), kategori, brand, stok. Produk `DRAFT` **tidak** tampil (benar) | Lulus | curl |
| AC-PROD-03-01 | Customer click product, view detail | `/products/kaos-polos-katun-combed-30s` → `200` dengan varian, SKU, harga, stok, gambar | Lulus | curl |
| — | Build & type check | `pnpm build` exit 0, 22 route | Lulus | build log |
| — | Lint | `pnpm lint` exit 0 | Lulus | lint log |
| — | Migrasi database | Migrasi `20261009111500_init` di-baseline; `prisma migrate status` → "Database schema is up to date!"; drift terhadap schema = 0 | Lulus | prisma output |
| — | Seed | 1 admin, 4 kategori, 3 brand, 6 produk (5 `ACTIVE`, 1 `DRAFT`); idempoten (run kedua = "diperbarui", bukan duplikat) | Lulus | seed output |
| — | **A01** guest → `/admin/*` | 5 halaman → `307` ke `/login`; API admin → `401` | Lulus | curl |
| — | **A01** customer login → `/admin/*` | Halaman → `302` ke `/`; `GET /api/admin/products` → `403` | Lulus | curl |
| — | **A01** Uploadthing tanpa sesi | `POST /api/uploadthing?actionType=upload&slug=productImage` → `403`; dengan sesi admin → `200` | Lulus | curl |
| — | **A03** tidak ada raw SQL | 0 match `$queryRaw`/`$executeRaw` di `src/` dan `prisma/` | Lulus | grep |
| — | **XSS** | 0 match `dangerouslySetInnerHTML` | Lulus | grep |
| — | **Secrets** | 0 match pola token Twilio/Uploadthing/AUTH_SECRET/DSN. `.env*` di `.gitignore`, `!.env.example` dikecualikan | Lulus | grep + `.gitignore` |
| — | Halaman publik | `/`, `/products`, `/login`, `/register` → `200` | Lulus | curl |

**Cacat yang ditemukan dan diperbaiki selama verifikasi:**

| Cacat | Dampak | Perbaikan | Verifikasi |
| --- | --- | --- | --- |
| **Seed membuat admin dengan password kosong** | `.env.local` berisi `SEED_ADMIN_PASSWORD=""`; operator `??` hanya jatuh ke nilai acak untuk `null`/`undefined`, sehingga string kosong dipakai apa adanya. Admin dibuat dengan password kosong dan password acak tidak pernah dicetak | `prisma/seed.ts` memakai `\|\|` + `trim()` dan menolak password kosong. Akun rusak dihapus, seed dijalankan ulang | Password acak sekarang tercetak; login admin berhasil |
| Penolakan akses Uploadthing mengembalikan `500` | Penolakan auth tercatat sebagai error server | `UploadThingError` diberi `code: "FORBIDDEN"` eksplisit (`src/lib/uploadthing/core.ts`) | `500` → `403` |
| Pesan validasi berbahasa Inggris ("Required") | Pesan ke pengguna tidak konsisten | `required_error`/`invalid_type_error` Indonesia di semua schema Zod | `400 "Nama wajib diisi"` |
| `pnpx prisma` tidak membaca `.env.local` | Perintah migrasi di dokumen gagal `P1012` | Script `db:*` dibungkus `dotenv-cli` (termasuk `db:deploy` yang sebelumnya terlewat) | `pnpm db:*` berfungsi |
| Prefix `whatsapp:` ganda pada `TWILIO_WHATSAPP_FROM` menghasilkan alamat `whatsapp:whatsapp:+62...` | Dulu: alamat pengirim tidak valid dengan pesan error yang menyesatkan | **Digantikan, bukan diperbaiki.** Seluruh `deliverOtp` beserta `toWhatsappAddress()` dihapus saat `src/lib/auth/otp.ts` ditulis ulang memakai Twilio Verify. `TWILIO_WHATSAPP_FROM`, `TWILIO_PHONE_NUMBER`, dan `TWILIO_CONTENT_SID` kini tidak dibaca kode mana pun, jadi cacat ini tidak mungkin muncul lagi | 0 referensi ke `deliverOtp`/`toWhatsappAddress` di `src/`; hanya `TWILIO_VERIFY_SERVICE_SID` dan `TWILIO_VERIFY_CHANNEL` yang dibaca |
| `loading.tsx` di level grup `(storefront)` membungkus **semua** halaman storefront dengan skeleton grid produk | `/login`, `/register` menampilkan kerangka produk yang tidak relevan saat memuat | Berkas dihapus. Halaman yang memang butuh loading UI sudah punya boundary `<Suspense>` sendiri | `pnpm build` exit 0; halaman publik tetap `200` |
| Tidak ada `error.tsx` / `global-error.tsx` | Kegagalan render (mis. database mati) menampilkan halaman error bawaan Next.js, bukan pesan ramah berbahasa Indonesia | Ditambahkan `src/app/error.tsx` (boundary untuk seluruh route) dan `src/app/global-error.tsx` (kegagalan root layout; menyediakan `<html>`/`<body>` sendiri). Keduanya memakai `retry` dan mencatat detail hanya ke console | Dengan `DATABASE_URL` diarahkan ke host mati: server mencatat `prisma:error ... Can't reach database server` + `digest: '1562576419'`; respons ke klien `<html id="__next_error__">` + `noindex`, **tanpa** pesan server (0 match `findFirst`/`127.0.0.1:1`) |
| Komentar pada rute detail produk mengklaim `instant = false` membuat rute *blocking* | Klaim itu keliru dan menyesatkan pembaca berikutnya | Komentar ditulis ulang: `instant = false` hanya mengizinkan akses `params` di luar Suspense, **bukan** mengubah status HTTP | Penanda build tetap `◐` (Partial Prerender) |

**Cacat diketahui, belum diperbaiki:**

| Cacat | Dampak | Alasan |
| --- | --- | --- |
| Slug produk tidak ada → **soft 404**: UI not-found benar, status HTTP `200`. `/products/tidak-ada-sama-sekali` → `200` + `<meta name="robots" content="noindex">` | Status HTTP tidak sesuai untuk pemantauan/klien non-browser. Mesin pencari tidak mengindeks (Next.js menitipkan `noindex`) | Bukan bug aplikasi melainkan perilaku PPR yang terdokumentasi: *"Before streaming starts, Next.js returns a 404 status code. After streaming starts, the status code remains 200 and the not-found UI renders in the response."* Selama `cacheComponents: true`, rute ini selalu PPR — shell di-prerender dan dikirim lebih dulu dengan `200`. Sudah diuji dan **tidak** dapat diperbaiki dari dalam halaman: (a) `instant = false` tidak mengubah penanda `◐`; (b) `dynamic`/`force-dynamic`/`dynamicParams`/`revalidate` ditolak saat build karena tidak kompatibel dengan `cacheComponents`; (c) mengeluarkan `<Header />` dari layout pun tidak mengubah hasil, jadi Suspense di dalam Header bukan penyebabnya. Satu-satunya jalur yang didokumentasikan adalah *request-time check di Proxy* — dan review 2026-10-10 mengoreksi biayanya: Edge bisa melakukannya lewat Supabase PostgREST via `fetch` (tanpa pindah ke runtime Node), tetapi tetap satu query per kunjungan. **Diputuskan:** terima `noindex` (opsi 1, bagian 4.7) |

- **Versi kode / commit:** Belum ada repository git — kode ada di working directory
- **Lingkungan:** Development (localhost:3000) dengan database Supabase aktif
- **Masalah terbuka:** tidak ada yang memblokir. Unggah berkas Uploadthing dengan berkas nyata
  belum diuji (kunci API `.env.local` masih placeholder) — dikeluarkan dari daftar butir terbuka saat
  approval PH-01, diuji begitu kunci nyata tersedia. Pengiriman dan pemeriksaan OTP **sudah tidak
  termasuk** — keduanya terbukti end-to-end di atas
- **Batas bukti:** E2E tests optional untuk PH-01 (manual verification prioritas). Seluruh alur demo
  sudah dijalankan manual lewat HTTP; verifikasi lewat browser belum dilakukan

### 4.6. Laporan untuk review

1. **Fase dan status:** PH-01 — Foundation, **Disetujui** (2026-10-10; laporan awal berstatus Siap direview, lihat bagian 4.7)
2. **Hasil yang tersedia:** Kerangka aplikasi Next.js 16 (App Router, `cacheComponents`, PPR) dengan UI kit; NextAuth v5 + credentials provider + `proxy.ts` proteksi `/admin`; registrasi customer, OTP guest (Twilio), login; CRUD produk/kategori/brand untuk Store Admin; halaman katalog dan detail produk untuk customer; skema Prisma lengkap + migrasi + seed idempoten; panduan setup kredensial
3. **Task selesai / belum selesai:** TASK-01 sampai TASK-13 **selesai**. TASK-14 selesai; satu butir verifikasi masih menunggu layanan eksternal dan ditandai "Sebagian" di bagian 4.4/4.5 (unggah berkas Uploadthing). OTP sudah **Lulus**, tidak lagi menyandang status terblokir
4. **Verifikasi:** Seluruh alur demo dijalankan manual lewat HTTP terhadap database Supabase aktif —
   registrasi customer `201`, login customer `302` (`role: CUSTOMER`), login admin `302` (`role: STORE_ADMIN`),
   CRUD produk `201`/`200`/`200` + `404` setelah hapus, keempat cabang validasi `400`/`400`/`409`/`409`,
   `/products` menampilkan 5 produk `ACTIVE` (produk `DRAFT` benar tidak tampil). Akses kontrol A01:
   guest → `/admin/*` `307` ke `/login` dan API admin `401`; customer login → halaman `302` ke `/`,
   API `403`. Isolasi role ini juga berlaku di Uploadthing (`403` tanpa sesi admin). Alur OTP diuji
   nyata: kirim `200` + SMS diterima (pengirim `TWVerify`), verifikasi `200 {"verified":true}` dua kali
   dengan kode berbeda, ditambah cabang `410`/`400`/`429`. `pnpm lint` dan `pnpm build` exit 0
   (22 route). Rincian: bagian 4.5
5. **Cara mencoba:**
   - Jalankan `pnpm dev`, lalu buka `http://localhost:3000`
   - Guest OTP: tambahkan produk ke keranjang → buka `/checkout` → isi nomor HP → Kirim OTP → Verifikasi (**butuh sender Twilio diisi lebih dulu**, kalau kosong endpoint menjawab `502`)
   - Customer: buka `/register` → isi form → daftar → login di `/login`
   - Admin: login di `/login` dengan `admin@flexstore.local` / password yang tercetak saat `pnpm db:seed` → `/admin/products` → Tambah produk → Edit → Hapus
   - Customer: buka `/` dan `/products` → klik produk → lihat detail
   - Akses kontrol: buka `/admin/products` tanpa login → dialihkan ke `/login`
6. **Masalah / batasan:**
   - **OTP tidak lagi jadi masalah.** Pengiriman dan pemeriksaan sudah terbukti end-to-end (rincian bagian 4.5). Satu catatan yang tetap berlaku untuk uji berikutnya: di akun Trial, kirim ke nomor yang **belum** terverifikasi bisa dijawab sukses oleh API sementara pesannya dibuang diam-diam — jadi kalau nanti ada nomor uji selain `+6285813386371`, pastikan nomor itu terdaftar sebagai Verified Caller ID lebih dulu. Untuk nomor yang sekarang dipakai, syarat itu ternyata tidak menghalangi
   - Unggah gambar Uploadthing belum diuji dengan berkas nyata (kunci API masih placeholder); gerbang autentikasinya sudah terverifikasi `403`/`200`. **Dikeluarkan dari daftar butir terbuka saat approval PH-01** — tidak memblokir, diuji saat kunci nyata tersedia
   - Slug produk yang tidak ada menghasilkan status `200` (soft 404), bukan `404` — **terkonfirmasi di mode produksi**. Ini perilaku PPR yang terdokumentasi, bukan bug kode, dan tidak dapat diperbaiki dari dalam halaman selama `cacheComponents: true` aktif. Next.js sudah menitipkan `noindex`, jadi dampak nyatanya tinggal status HTTP. **Diputuskan 2026-10-10: diterima apa adanya** (opsi 1, bagian 4.6 poin 7/4.7)
   - `error.tsx` dan `global-error.tsx` sudah ditambahkan dan diuji dengan database mati. Yang terverifikasi: error ditangkap (tidak ada crash, tidak ada kebocoran pesan server ke klien) dan kerangka error dikirim dengan `noindex`. Tampilan akhirnya dihidrasi di sisi klien, jadi **tampilan visualnya belum diperiksa lewat browser**
   - Belum ada repository git, sehingga pemeriksaan `git grep` tidak dapat dijalankan
7. **Keputusan yang dibutuhkan:**
   - **OTP — sudah tutup, tidak ada keputusan yang dibutuhkan.** AC-AUTH-01-01 dan AC-AUTH-01-02 berstatus **Lulus** berdasarkan pengujian nyata. Yang tersisa hanya pertimbangan produksi: akun Trial membatasi 40 verifikasi, tidak bisa mengganti isi pesan, dan hanya boleh mengirim ke nomor yang terverifikasi. Ketiganya hilang setelah akun di-upgrade, jadi upgrade sebaiknya dilakukan sebelum uji coba terbuka — bukan sekarang
   - **Kalau nanti menguji dengan nomor lain:** di akun Trial, kirim ke nomor yang belum terverifikasi bisa dijawab sukses oleh API sementara pesannya dibuang diam-diam. Jadi "tidak ada error" bukan berarti OTP terkirim — penerimaan harus dipastikan dari HP tujuan
   - **Soft 404 pada detail produk — sudah diputuskan 2026-10-10: terima apa adanya (opsi 1).** Status tetap `200`, tetapi UI not-found benar dan Next.js menitipkan `noindex`; nol biaya tambahan, tidak ada perubahan kode. Opsi "paksa `404` sejati lewat Proxy" tidak dipilih. Catatan hasil review: kalau nanti berubah pikiran, jalur Proxy masih tersedia tanpa harus pindah ke runtime Node — Edge bisa melakukan cek keberadaan produk lewat Supabase PostgREST via `fetch` (Edge-safe), dengan konsekuensi tetap satu query per kunjungan `/products/*`
   - Konfirmasi apakah PH-01 disetujui untuk lanjut ke PH-02

### 4.7. Keputusan gate dan revisi

| Tanggal | Reviewer | Hasil | Keputusan | Catatan |
| --- | --- | --- | --- | --- |
| - | - | - | - | Belum ada review |
| 2026-10-10 | User | **PH-01 — Foundation DISETUJUI.** User: "jalankan 1 dan 2 dulu" setelah menyetujui opsi 1 soft 404 | Fase diterima; status PH-01 di section 1 dan 3 → **Disetujui**. Butir Uploadthing dengan berkas nyata dikeluarkan dari daftar butir terbuka (tetap "Sebagian", tidak memblokir, diuji saat kunci API nyata tersedia). `git init` ditunda atas permintaan user | Bukti verifikasi: `pnpm build` exit 0 (22 route), `pnpm lint` exit 0, seluruh alur demo dijalankan manual lewat HTTP (registrasi, login customer/admin, CRUD produk, akses kontrol, OTP end-to-end). Rincian: bagian 4.4/4.5 |
| 2026-10-10 | User | **Soft 404 slug produk — disetujui apa adanya (opsi 1).** User: "opsi 1 gua setuju" | Terima status `200` + `noindex` untuk `/products/<slug-tidak-ada>`. Tidak ada perubahan kode. Website mengindeks dengan benar (slug tidak terindeks karena `noindex`), UI not-found benar | Review ke docs resmi Next.js v16 mengonfirmasi klaim dokumentasi sebelumnya: dengan `cacheComponents: true` shell PPR dikirim lebih dulu dengan `200`, sehingga `notFound()` di dalam halaman tidak dapat mengubah status. Koreksi pada opsi 2: cek di Proxy **tidak wajib** pindah ke runtime Node — Supabase PostgREST via `fetch` bersifat Edge-safe, sehingga jalur `404` asli tetap tersedia tanpa migrasi runtime kalau nanti dibutuhkan (tetap 1 query/visit). Rincian: bagian 4.5, section 10 |

---

## 5. Rincian Fase: PH-02 — Shopping Flow (Cart + Shipping)

### 5.1. Tujuan dan batas

- **Tujuan:** User dapat add to cart, update/remove cart items, calculate shipping cost
- **Termasuk:** CART-01 (Add to Cart), CART-02 (Update Cart Item), CART-03 (Remove from Cart), CART-04 (Merge Guest Cart on Login — tambahan di luar indeks PRD), SHIP-01 (Calculate Shipping)
- **Tidak termasuk:** Checkout, Order, Payment (PH-03, PH-04)
- **Referensi:** Spesifikasi CART-01, CART-02, CART-03, CART-04, SHIP-01, SDD 4.3, SDD 4.7
- **Prasyarat:** PH-01 disetujui. RajaOngkir API key **opsional** — tanpa key/origin, ongkir memakai fallback tarif flat Rp10.000 (SDD section 9)
- **Langkah demo:** Add product to cart → Update quantity → Remove item → Calculate shipping cost
- **Estimasi:** 2-3 hari

### 5.2. Daftar task

| ID | Pekerjaan / hasil | Fitur | Bergantung pada | Status | Bukti |
| --- | --- | --- | --- | --- | --- |
| TASK-15 | Skema `CartItem` (snapshot harga, unique userId+variantId) + relasi + migrasi | CART-01, CART-02, CART-03, CART-04 | TASK-02 | Selesai | Migrasi `20261009204724_add_cart_items` diterapkan; `pnpm db:generate` sukses |
| TASK-16 | Lib cart: identitas (sesi/cookie guest), penyimpanan guest di Redis, query pengayaan, mutasi, validasi Zod | CART-01, CART-02, CART-03, CART-04 | TASK-15 | Selesai | `src/lib/cart/{session,guest,queries,mutations,validation,index}.ts`; cookie `flexstore_cart` httpOnly, TTL Redis 30 hari |
| TASK-17 | API `/api/cart` (GET/POST/PATCH/DELETE) | CART-01, CART-02, CART-03 | TASK-16 | Selesai | 14 pemeriksaan HTTP (G01-G14) lulus, termasuk `INSUFFICIENT_STOCK`, `PRODUCT_INACTIVE`, `VARIANT_NOT_FOUND` |
| TASK-18 | API `/api/cart/sync` (gabung guest → customer, idempoten) | CART-04 | TASK-16 | Selesai | `{"merged":1}` saat login; `{"merged":0}` pada panggilan kedua (C04/C06) |
| TASK-19 | Lib + API shipping: RajaOngkir Komerce v1, cache, fallback tarif flat, berat dari data varian | SHIP-01 | TASK-16 | Selesai | `POST /api/shipping` mode api → 9 opsi kurir asli; mode fallback → Rp10.000; `GET /api/shipping/cities` → 9 hasil; `weightGram` = jumlah (kuantitas x berat varian) |
| TASK-20 | UI cart: badge header, form tambah, baris item, ringkasan, sinkronisasi, halaman `/cart`, integrasi detail produk + layout + form login/registrasi | CART-01, CART-02, CART-03, CART-04, SHIP-01 | TASK-17, TASK-18, TASK-19 | Selesai | `/cart` `200` menampilkan item; detail produk memuat tombol "Tambah ke Keranjang"; keranjang kosong menampilkan ajakan belanja |
| TASK-21 | Konfigurasi env shipping + `.env.example` | SHIP-01 | TASK-19 | Selesai | `RAJAONGKIR_API_KEY`, `SHIPPING_ORIGIN_DISTRICT_ID`, `SHIPPING_WEIGHT_PER_ITEM_GRAM`, `SHIPPING_COURIERS` di `.env.example` dan `docs/06` bagian 6 |
| TASK-22 | Lint + build | Semua | TASK-15..21 | Selesai | `pnpm lint` exit 0; `pnpm build` exit 0 (27 rute) |
| TASK-23 | Verifikasi exit criteria PH-02 | Semua | TASK-22 | Selesai | 40 pemeriksaan HTTP lulus (guest, customer, merge, shipping, halaman); 0 galat prerender di log dev dan build |
| TASK-24 | Dokumentasi (spesifikasi CART-02/03/04, SHIP-01, setup RajaOngkir) + laporan review | Semua | TASK-23 | Selesai | `docs/03` v1.1, `docs/04` bagian 5, `docs/06` bagian 6 |

### 5.3. Kartu task (sample: TASK-19 — Shipping)

| Isian | Detail |
| --- | --- |
| Tujuan | Menghitung ongkos kirim dari lokasi toko ke kecamatan tujuan memakai RajaOngkir Komerce v1, dengan fallback tarif flat |
| Referensi kebutuhan | Spesifikasi SHIP-01, AC-SHIP-01-01 sampai AC-SHIP-01-09, SDD 4.7, SDD section 9 |
| Lingkup perubahan | `src/lib/shipping/{client,index,validation}.ts`, `src/app/api/shipping/route.ts`, `src/app/api/shipping/cities/route.ts`, env shipping |
| Di luar lingkup | Menyimpan pilihan ongkir ke pesanan (PH-03), lacak kiriman (SHIP-02), berat per produk |
| Ketergantungan | TASK-16 (berat dari keranjang), RajaOngkir Komerce API v1 (opsional) |
| Area kode | `/src/lib/shipping/`, `/src/app/api/shipping/` |
| Hasil yang diserahkan | Pencarian tujuan, hitung ongkir multi-kurir, cache Redis, fallback tarif flat, validasi Zod |
| Kriteria selesai task | AC-SHIP-01-01 sampai AC-SHIP-01-09 lulus (Spesifikasi SHIP-01 bagian 10) |
| Cara verifikasi | Manual: `POST /api/shipping` dengan tujuan valid (mode api) dan tanpa key (mode fallback); `GET /api/shipping/cities` |
| Penanggung jawab | Agent / Developer |
| Hambatan / catatan | Endpoint awal salah (`/calculate/district/domestic-cost` → `422`); diperbaiki ke `/calculate/domestic-cost`. Sempat memakai fallback karena `SHIPPING_ORIGIN_DISTRICT_ID` belum diisi; kini terisi `17590` (Cilandak Barat, Jakarta Selatan) dan mode API terbukti |

### 5.4. Exit criteria PH-02

- [x] TASK-15 sampai TASK-24 selesai dan tercatat
- [x] Kriteria penerimaan CART-01, CART-02, CART-03, CART-04, SHIP-01 diperiksa
- [x] Alur demo PH-02 dapat dijalankan (add to cart → update jumlah → hapus item → hitung ongkir)
- [x] Migrasi database diterapkan — `20261009204724_add_cart_items`
- [x] `pnpm dev` berjalan tanpa galat — 0 galat prerender setelah perbaikan `connection()`
- [x] `pnpm build` sukses (type check lulus) — exit 0, 27 rute
- [x] Keranjang guest bertahan lewat cookie (`flexstore_cart`) + Redis
- [x] Keranjang customer tersimpan di PostgreSQL dan bertahan antar sesi
- [x] Penggabungan keranjang guest → customer idempoten
- [x] Ongkir: mode API terbukti (9 opsi kurir asli) dan mode fallback Rp10.000 terbukti
- [x] Tidak ada galat tak tertangani di console/log
- [x] **Security checklist (OWASP Top 10 — SDD section 10):**
  - [x] A01 Access Control: identitas keranjang diambil dari sesi/cookie, **bukan** dari body — tidak ada cara menyentuh keranjang pengguna lain; berat ongkir dihitung server dari keranjang pemanggil; tidak ada endpoint admin baru di fase ini
  - [x] A03 Injection: seluruh query memakai Prisma (0 `$queryRaw`/`$executeRaw`); Zod memvalidasi body di 4 API route baru sebelum query
  - [x] A07 Auth: cookie guest httpOnly + `SameSite=lax` + `Secure` di produksi; nilai cookie divalidasi harus UUID sebelum dipakai sebagai kunci Redis (mencegah kunci liar) — berlaku juga di `/api/cart/sync` lewat `isGuestCartId`
  - [x] A08 Integrity: tidak ada webhook baru di fase ini (Xendit menyusul di PH-04)
  - [x] XSS: 0 match `dangerouslySetInnerHTML`
  - [x] Secrets: kunci RajaOngkir hanya dibaca di server (tanpa prefix `NEXT_PUBLIC_`), 0 hardcode di kode
  - [x] Error Messages: pesan generik berbahasa Indonesia ke pengguna, detail galat hanya ke log (`console.error`)
  - [x] A10 SSRF: base URL RajaOngkir ditulis tetap di `src/lib/shipping/client.ts`, bukan diambil dari input pengguna
  - [x] Penanganan galat: kegagalan tak terduga (Prisma/Redis) ditangkap `withRouteErrors` → `500 INTERNAL_ERROR` dengan pesan generik, detail hanya ke log; sinyal internal Next.js (`digest` `NEXT_*`, `DYNAMIC_SERVER_USAGE`) dilempar ulang, bukan ditelan

**Kesimpulan:** seluruh exit criteria terpenuhi. Kredensial ongkir kini lengkap: `SHIPPING_ORIGIN_DISTRICT_ID=17590`
(Cilandak Barat, Jakarta Selatan) sudah tertulis di `.env.local`, jadi ongkir memakai tarif asli
(`source: "api"`, 9 opsi kurir). Jalur fallback tarif flat Rp10.000 tetap dipertahankan sebagai
penanganan kegagalan (SDD section 9) dan masih diuji lewat tujuan tak dikenal.

### 5.5. Bukti verifikasi

**Lingkungan:** dev server `localhost:3000`, database Supabase aktif (migrasi + seed dijalankan),
2026-10-10. Verifikasi dijalankan lewat skrip Node (cookie jar manual) terhadap server nyata.

| Kebutuhan | Pemeriksaan | Hasil aktual | Status |
| --- | --- | --- | --- |
| AC-CART-01-01 | `GET /api/cart` tanpa cookie | `200 {"cart":{"items":[],"subtotal":0,"itemCount":0}}` | Lulus |
| AC-CART-01-01 | `POST /api/cart` add varian x2 | `200`, `itemCount: 2`, cookie guest dibuat | Lulus |
| AC-CART-01-05 | Muat ulang keranjang guest | Item bertahan lewat cookie | Lulus |
| AC-CART-01-02 | Tambah varian yang sama lagi (x3) | Quantity 2+3=5 | Lulus |
| AC-CART-01-03 | Tambah melebihi stok | `400 INSUFFICIENT_STOCK` "Stok tidak cukup (tersisa 5)" | Lulus |
| AC-CART-01-04 | Tambah varian produk `DRAFT` | `400 PRODUCT_INACTIVE` "Produk tidak tersedia" | Lulus |
| — | Varian tidak ada | `404 VARIANT_NOT_FOUND` | Lulus |
| — | Body kosong | `400 VALIDATION_ERROR` "Varian wajib dipilih" | Lulus |
| AC-CART-02-01 | `PATCH /api/cart` jumlah 4 | `200`, quantity 4 | Lulus |
| AC-CART-02-02 | `PATCH` jumlah 999 (> stok 25) | `400 INSUFFICIENT_STOCK` "tersisa 25" | Lulus |
| AC-CART-02-03 | `POST /api/cart` jumlah 0 | `400 VALIDATION_ERROR` "Jumlah minimal 1" | Lulus |
| AC-CART-03-02 | `DELETE /api/cart` item terakhir | `200`, `itemCount: 0` | Lulus |
| AC-SHIP-01-02 | `POST /api/shipping` saat keranjang kosong | `400 CART_EMPTY` | Lulus |
| — | `GET /api/shipping/cities?search=cilandak` | `200 configured:true`, 9 tujuan (ID kecamatan) | Lulus |
| AC-SHIP-01-04 | `POST /api/shipping` tanpa tujuan saat API aktif | `400 VALIDATION_ERROR` "Tujuan wajib dipilih" | Lulus |
| AC-SHIP-01-01 | `POST /api/shipping` tujuan `16034` (mode API) | `200 source:"api"`, 9 opsi kurir asli (SiCepat HALU 28000, J&T EZ, ...) | Lulus |
| AC-SHIP-01-06 | Tujuan tidak dikenal `999999999` | `200 source:"fallback"` Rp10.000 (galat API hanya ke log) | Lulus |
| — | `GET /api/shipping/cities?search=ab` | `400 VALIDATION_ERROR` "Ketik minimal 3 karakter" | Lulus |
| AC-CART-04-01 | Guest punya item, lalu login | `POST /api/cart/sync` → `{"merged":1}`; item muncul di keranjang customer | Lulus |
| AC-CART-04-02 | Registrasi (auto-login) | Item guest digabung ke keranjang customer | Lulus |
| AC-CART-04-03 | Panggil sync ulang | `{"merged":0}` (idempoten, tanpa duplikasi) | Lulus |
| AC-CART-04-04 / AC-CART-01-06 | Login dari sesi kedua | Item tetap ada (PostgreSQL) | Lulus |
| AC-CART-02-06 (regresi) | `PATCH /api/cart` (customer) varian yang tidak ada di keranjang | `404 VARIANT_NOT_FOUND` "Item tidak ada di keranjang" — sebelumnya `500` (Prisma `P2025`) | Lulus |
| — (regresi) | `POST /api/cart/sync` dengan cookie guest non-UUID | `200 {"merged":0}` tanpa galat | Lulus |
| AC-SHIP-01-09 (berat) | Respons `POST /api/shipping` | Hanya `source, cached, options`; tanpa `weightGram` | Lulus |
| AC-SHIP-01-07 (berat) | Keranjang A 2x `KP-30S-M` (200 g), tujuan `16034` | `source: "api"`, `cached: false` | Lulus |
| AC-SHIP-01-07 (berat) | Keranjang B 1x `SN-CV-42` (850 g), tujuan sama | `cached: false` (berat beda -> kunci cache beda) | Lulus |
| AC-SHIP-01-08 (berat) | Keranjang B + body `weight: 1, weightGram: 1` | Nilai klien diabaikan; kunci tetap 850 g -> `cached: true` | Lulus |
| AC-SHIP-01-07 (berat) | Keranjang A diulang | `cached: true` (berat ikut kunci cache) | Lulus |
| — (berat) | Halaman `/cart` | Tidak memuat "Berat paket" maupun angka `kg` | Lulus |
| — (berat) | Form admin `/admin/products/new` | Memuat input "Berat (gram)" | Lulus |
| — (berat) | Form admin edit produk | Memuat input berat beserta nilai varian | Lulus |
| — | Halaman `/cart` dengan item | `200` menampilkan nama produk dan ringkasan | Lulus |
| — | Halaman detail produk | `200` memuat tombol "Tambah ke Keranjang" | Lulus |
| — | Halaman `/cart` guest baru | `200` menampilkan "Keranjang masih kosong" | Lulus |
| — | Cookie guest | `flexstore_cart=...; HttpOnly; SameSite=lax; Max-Age=2592000` | Lulus |
| — | Lint | `pnpm lint` exit 0 | Lulus |
| — | Build & type check | `pnpm build` exit 0, 27 rute (`/api/cart`, `/api/cart/sync`, `/api/shipping`, `/api/shipping/cities`, `/cart`) | Lulus |
| — | Galat prerender | 0 galat `crypto.getRandomValues()` di log dev dan build (setelah perbaikan `connection()`) | Lulus |
| — | **A03** raw SQL | 0 match `$queryRaw`/`$executeRaw` di `src/` dan `prisma/` | Lulus |
| — | **Secrets** | 0 hardcode kunci RajaOngkir; base URL tetap di kode; tidak ada `NEXT_PUBLIC_` untuk kredensial | Lulus |

**Cacat yang ditemukan dan diperbaiki (verifikasi + tinjauan ulang kode):**

| Cacat | Dampak | Perbaikan | Verifikasi |
| --- | --- | --- | --- |
| Endpoint ongkir memakai `/api/v1/calculate/district/domestic-cost` | API menjawab `422 Origin or Destination not found` untuk setiap ID hasil pencarian; ongkir asli tidak pernah muncul | Ganti ke `POST /api/v1/calculate/domestic-cost` (menerima ID hasil pencarian `destination/domestic-destination`, yaitu tingkat kecamatan) | `200 source:"api"` dengan 9 opsi kurir asli |
| `CartBadge` memicu `crypto.getRandomValues()` saat prerender `/products` | Overlay galat Next.js 16 saat navigasi walau status HTTP `200` | Tambah `await connection()` sebelum membaca identitas (pola sama seperti `HeaderUserMenu`) | 0 galat di log dev dan build |
| `CartPage` memicu `crypto.getRandomValues()` saat prerender `/cart` | Sama seperti di atas, khusus halaman `/cart` | Tambah `await connection()` di `CartPage` | 0 galat di log dev dan build |
| Urutan validasi route shipping | Keranjang kosong + tanpa tujuan menjawab `VALIDATION_ERROR`, padahal precondition yang gagal adalah keranjang kosong | Cek identitas/keranjang kosong lebih dulu, baru kewajiban `destinationId` | `400 CART_EMPTY` untuk keranjang kosong, `400 VALIDATION_ERROR` untuk keranjang berisi tanpa tujuan |
| **Tinjauan ulang kode (bukan hasil verifikasi otomatis):** `PATCH /api/cart` customer memakai `prisma.cartItem.update` tanpa cek baris | Prisma melempar `P2025` saat varian tidak ada di keranjang → route tanpa penangkap → `500`; jalur guest mengembalikan `404`. Terbukti: `{"rowExists":false,"result":"THROW","prismaCode":"P2025"}` | Ganti ke `prisma.cartItem.updateMany` + cek `count === 0` → `VARIANT_NOT_FOUND` | Uji regresi C08: `404 {"error":"VARIANT_NOT_FOUND"}` |
| Tidak ada penangkap galat di 4 route API baru | Kegagalan tak terduga Prisma/Redis bocor sebagai `500` mentah (tanpa bentuk `{ error, message }`) | Tambah `withRouteErrors` di `src/lib/utils/api.ts`, dipakai di `api/cart`, `api/cart/sync`, `api/shipping`, `api/shipping/cities` | Tidak ada galat tak tertangani di log dev setelah dijalankan ulang |
| `withRouteErrors` versi pertama menelan sinyal internal Next.js | `digest: 'NEXT_PRERENDER_INTERRUPTED'` tertangkap sebagai `500` saat prerender (`/api/shipping/cities` yang membaca `request.url`), padahal sinyal itu harus diteruskan | Tambah `isNextControlFlowError` — error ber-`digest` `NEXT_*` atau `DYNAMIC_SERVER_USAGE` dilempar ulang | Build bersih: 0 baris `unhandled route error` di log build |
| `POST /api/cart/sync` memakai nilai cookie langsung tanpa uji UUID | Tidak bisa dieksploitasi (kunci tetap `cart:guest:{nilai}`), tetapi berbeda dari `getCartIdentity` dan membuat klaim A07 di bagian 5.4 tidak akurat | Ekspor `isGuestCartId` dari `src/lib/cart/session.ts`, pakai di `getCartIdentity` dan route sync | Uji regresi C09: `200 {"merged":0}` untuk cookie non-UUID |

- **Versi kode / commit:** Repository git aktif (HEAD `50b9f70`); perubahan PH-02 belum di-commit
- **Lingkungan:** Development (localhost:3000) dengan database Supabase aktif dan Redis Upstash aktif
- **Masalah terbuka:** tidak ada yang memblokir. Kredensial ongkir lengkap di `.env.local`
  (`RAJAONGKIR_API_KEY` + `SHIPPING_ORIGIN_DISTRICT_ID=17590`); `POST /api/shipping` membalas
  `source: "api"` dengan 9 opsi kurir, dan halaman `/cart` menampilkan kotak pencarian tujuan
  (bukan catatan tarif flat)
- **Batas bukti:** verifikasi lewat browser belum dilakukan (pemeriksaan berbasis HTTP/HTML). Akun uji
  `qa.cart.*@example.com` beserta keranjangnya dihapus setelah verifikasi (7 akun dari dua putaran)
- **Belum ditangani (dicatat, bukan penghalang):** lost update keranjang guest (baca-ubah-tulis JSON
  tanpa lock), TOCTOU stok (reservasi atomik menyusul di PH-03), snapshot harga campur saat merge,
  tanpa rate limit pada proxy ongkir berbayar, item non-aktif masih ikut dihitung di subtotal/berat,
  `getCartItemCount` memuat keranjang penuh untuk badge, dan skrip verifikasi masih di luar repo

### 5.6. Laporan untuk review

1. **Fase dan status:** PH-02 — Shopping Flow (Cart + Shipping), **Berjalan** menuju Siap direview
2. **Hasil yang tersedia:** Keranjang untuk guest (Redis + cookie) dan customer (PostgreSQL); tambah,
   ubah jumlah, dan hapus item; penggabungan keranjang guest ke customer saat login/registrasi; badge
   keranjang di header; halaman `/cart` dengan ringkasan; pencarian tujuan dan hitung ongkos kirim
   (RajaOngkir Komerce v1) dengan cache dan fallback tarif flat; empat API route baru
3. **Task selesai / belum selesai:** TASK-15 sampai TASK-24 **selesai**. Tidak ada task tertunda.
   `SHIPPING_ORIGIN_DISTRICT_ID` sudah diisi (`17590`), jadi ongkir memakai tarif asli
4. **Verifikasi:** 40 pemeriksaan HTTP lulus (guest, customer, merge, shipping, halaman), termasuk
   keempat cabang galat keranjang (`INSUFFICIENT_STOCK`, `PRODUCT_INACTIVE`, `VARIANT_NOT_FOUND`,
   `VALIDATION_ERROR`), `CART_EMPTY`, mode API ongkir (9 opsi kurir asli), mode fallback Rp10.000,
   dan sync idempoten, plus dua uji regresi dari tinjauan ulang kode (`PATCH` item tak ada → `404`,
   sync cookie non-UUID → `200`) dan delapan pemeriksaan berat varian (berat dihitung dari data
   produk dan ikut kunci cache, body klien diabaikan, `weightGram` tidak ada di respons, berat tidak
   tampil di `/cart`, input berat ada di form admin). `pnpm lint`
   dan `pnpm build` exit 0 (27 rute). 0 galat prerender. Rincian: bagian 5.5
5. **Cara mencoba:**
   - Jalankan `pnpm dev`, buka `http://localhost:3000/products` → klik produk → pilih varian → "Tambah ke Keranjang"
   - Buka `/cart` → ubah jumlah dengan `+`/`-` → hapus item → isi tujuan lalu "Hitung Ongkos Kirim"
   - Admin: `/admin/products` → tambah/ubah produk → isi **"Berat (gram)"** per varian (dipakai untuk ongkir)
   - Guest: keranjang bertahan setelah reload; login/registrasi akan menggabungkan keranjang guest ke akun
   - Ongkir asli sudah aktif (`SHIPPING_ORIGIN_DISTRICT_ID=17590` di `.env.local`); ubah nilai itu kalau lokasi asal toko berbeda (lihat `docs/06` bagian 6)
6. **Masalah / batasan:**
   - Berat paket memakai berat varian (`ProductVariant.weightGram`, diisi admin di form produk).
     `SHIPPING_WEIGHT_PER_ITEM_GRAM` hanya cadangan untuk varian yang beratnya belum diisi
   - Pemilihan item untuk checkout (checkbox per baris) belum ada; direncanakan di PH-03 — lihat bagian 6
   - Pilihan ongkir belum disimpan ke pesanan; itu bagian ORDER-01/PH-03
   - Tanpa `SHIPPING_ORIGIN_DISTRICT_ID` (atau saat API gagal), semua hitungan memakai tarif flat Rp10.000. Jalur itu tidak lagi aktif di dev karena origin sudah diisi
7. **Keputusan yang dibutuhkan:**
   - Konfirmasi apakah PH-02 disetujui untuk lanjut ke PH-03 (Checkout)
   - Konfirmasi pesan commit yang sudah disiapkan (usulan: dua commit terpisah — kode dan dokumentasi; belum ada yang di-`git add`)

### 5.7. Keputusan gate dan revisi

| Tanggal | Reviewer | Hasil | Keputusan | Catatan |
| --- | --- | --- | --- | --- |
| 2026-10-10 | User | **PH-02 — Shopping Flow DISETUJUI.** User: "implementasi hingga phase 3 selesai" | Fase diterima; status PH-02 di section 1 dan 3 → **Disetujui**. PH-03 dimulai tanpa menunggu commit (perubahan PH-02 tetap di working directory) | Bukti: 40 pemeriksaan HTTP lulus, `pnpm lint`/`pnpm build` exit 0 (27 rute), 0 galat prerender. Rincian: bagian 5.5 |
| 2026-10-10 | User | **Keputusan pra-PH-03 dijawab** (lihat bagian 6.2): pesanan tanpa baris Payment; voucher disembunyikan; AC email pindah ke PH-05; pelepasan reservasi memakai mekanisme "paling optimal" (malas, tanpa penjadwal) | Diterapkan di cakupan PH-03 (bagian 6.2) | Alasan tiap keputusan tercatat di bagian 6.2 |
| 2026-10-10 | User | **Catatan Twilio Trial dikoreksi.** User: "seharusnya tetap tidak perlu upgrade, karena pola pengiriman OTP sudah berbeda" | Catatan "wajib upgrade" dicabut; uji OTP tetap memakai akun Trial dengan nomor yang sudah terdaftar (maks 5 nomor) | Pola pengiriman OTP kini lewat Twilio **Verify**, bukan Messaging API — batas "pesan pertama/Content Template" tidak berlaku, dan nomor pendaftaran akun tetap bisa menerima (bagian 4.5) |

---

## 6. Rincian Fase: PH-03 — Checkout (Order Creation)

### 6.1. Tujuan dan batas

- **Tujuan:** User dapat checkout (guest + customer), create order, view order history, track order
- **Termasuk:** ORDER-01 (Guest Checkout), ORDER-02 (Customer Checkout), ORDER-03 (Order History), ORDER-04 (Track Order)
- **Tidak termasuk:** Payment (PH-04)
- **Referensi:** Spesifikasi ORDER-01, ORDER-02, ORDER-03, ORDER-04, SDD 4.4
- **Prasyarat:** PH-02 disetujui
- **Langkah demo:** Checkout as guest (OTP) → Create order (Waiting Payment) → View order history → Track order (public)
- **Estimasi:** 3-4 hari
- **Catatan dari review PH-02 (2026-10-10):** checkout tidak memproses seluruh isi keranjang. Tambahkan **checkbox per baris** di `/cart` untuk memilih item yang di-checkout; default **tidak ada yang tercentang**, pilihan **tidak disimpan** (state React saja), dan tanpa tombol "pilih semua". Item yang tidak dicentang tidak masuk pesanan, dan ongkir dihitung hanya dari item terpilih. Lihat bagian 10.

### 6.2. Keputusan cakupan PH-03 (2026-10-10)

| Keputusan | Alasan | Dampak |
| --- | --- | --- |
| Pesanan dibuat **tanpa baris `Payment`** | Xendit baru ada di PH-04 | `POST /api/orders/create` hanya membuat Order + OrderItem; PAY-01 menyusul |
| Input **voucher disembunyikan** di `/checkout` | VOUCH-01 ada di PH-05 | Order punya kolom `discount` (default 0), nilainya tetap 0 sampai PH-05 |
| **AC-ORDER-01-05 (email)** dipindah ke PH-05 | NOTIF-01 ada di PH-05; `guestEmail` tetap disimpan di pesanan | Tidak ada pengiriman email di PH-03 |
| Reservasi stok dilepas **malas (lazy)**, bukan penjadwal | Vercel Cron paket Hobby hanya harian, tidak cocok untuk batas 10 menit; pelepasan malas tanpa infrastruktur tambahan dan idempoten | `releaseExpiredReservations()` dipanggil saat pesanan dibuat dan saat pesanan dibaca (riwayat, detail, lacak) |
| Stok **dikurangi saat pesanan dibuat**, dikembalikan saat reservasi kedaluwarsa | Prisma tidak bisa membandingkan dua kolom di `where` (aturan "tanpa raw SQL"), sehingga cara atomik yang tersedia adalah `stock: { decrement }` dengan syarat `stock >= qty` | PH-04 **tidak** mengurangi stok lagi saat pembayaran berhasil — cukup ubah status. Selaras dengan PRD 5.1 (stok tereservasi sejak order dibuat) |
| Alamat disimpan sebagai `shippingAddress` (JSON) per pesanan | MOD-CUST (alamat tersimpan, maks 5) belum punya fase di peta | Tidak ada tabel `Address` di PH-03. **Koreksi 2026-10-10:** kini ada di PH-07 (bagian 12) |

### 6.3. Daftar task

| ID | Pekerjaan / hasil | Fitur | Bergantung pada | Status | Bukti |
| --- | --- | --- | --- | --- | --- |
| TASK-25 | Skema `Order` + `OrderItem` + enum `OrderStatus` + relasi ke `User`/`ProductVariant` + migrasi | ORDER-01..04 | TASK-15 | Selesai | Migrasi `20261009231301_add_orders`; T05, T19 |
| TASK-26 | Penanda nomor HP terverifikasi di Redis (`phone-verified:{phone}`), di-set saat `POST /api/otp/verify` berhasil | ORDER-01 | TASK-16 | Selesai | `src/lib/auth/otp.ts` (`markPhoneVerified`/`isPhoneVerified`); T03, T04 |
| TASK-27 | Lib orders: validasi Zod, nomor pesanan `FS-YYYYMMDD-XXXXXX`, query, pembuatan pesanan dalam transaksi + reservasi stok atomik, pelepasan malas | ORDER-01..04 | TASK-25, TASK-26 | Selesai | `src/lib/orders/{validation,number,status,mutations,queries,reservations,rate-limit,index}.ts`; T04, T05, T17, T18, T19, T20, T22 |
| TASK-28 | API `POST /api/orders/create` | ORDER-01, ORDER-02 | TASK-27 | Selesai | `src/app/api/orders/create/route.ts`; T03, T04, T13, T17, T18 |
| TASK-29 | API `POST /api/orders/track` + pembatasan percobaan per IP | ORDER-04 | TASK-27 | Selesai | `src/app/api/orders/track/route.ts`; T07, T08, T09, T10, T11 |
| TASK-30 | Filter `variantIds` di `POST /api/shipping` (ongkir hanya dari item terpilih) | ORDER-01, ORDER-02 | TASK-19 | Selesai | `src/lib/shipping/validation.ts`, `src/app/api/shipping/route.ts`; T01, T01b, T02 |
| TASK-31 | UI checkbox per baris di `/cart` + tombol "Checkout (n)" (default kosong, tidak disimpan) | ORDER-01, ORDER-02 | TASK-30 | Selesai | `src/components/cart/{CartView,CartItemRow,CartSummary}.tsx`; pemeriksaan manual |
| TASK-32 | Halaman `/checkout` + form (guest: OTP inline; customer: data akun), pemilih kurir, ringkasan, tombol "Buat Pesanan" | ORDER-01, ORDER-02 | TASK-28, TASK-31 | Selesai | `src/app/(storefront)/checkout/page.tsx`, `src/components/checkout/CheckoutForm.tsx`, `src/components/shipping/` (pemilih tujuan/kurir; dipecah pada revisi 6.8); T04, T13 |
| TASK-33 | Halaman `/orders` + `/orders/[id]` (riwayat customer) | ORDER-03 | TASK-27 | Selesai | `src/app/(storefront)/orders/**`; T15, T16 |
| TASK-34 | Halaman publik `/track-order` | ORDER-04 | TASK-29 | Selesai | `src/app/(storefront)/track-order/page.tsx`, `src/components/orders/TrackOrderForm.tsx`; T07 |
| TASK-35 | Integrasi navigasi (tautan "Pesanan Saya", "Lacak Pesanan") | ORDER-03, ORDER-04 | TASK-33, TASK-34 | Selesai | `src/components/layout/HeaderUserMenu.tsx`; pemeriksaan manual |
| TASK-36 | Lint + build | Semua | TASK-25..35 | Selesai | `pnpm lint` exit 0; `pnpm build` exit 0 (33 rute) |
| TASK-37 | Verifikasi exit criteria PH-03 | Semua | TASK-36 | Selesai | 23 PASS / 0 FAIL (bagian 6.6) |
| TASK-38 | Dokumentasi (spesifikasi ORDER-02/03/04, revisi ORDER-01) + laporan review | Semua | TASK-37 | Selesai | `docs/03` v1.2; bagian 6.6 dan 6.7 |

### 6.4. Kartu task (sample: TASK-27 — Pembuatan pesanan + reservasi stok)

| Isian | Detail |
| --- | --- |
| Tujuan | Membuat pesanan dari item keranjang terpilih, mengurangi stok secara atomik (reservasi 10 menit), dan melepas reservasi yang kedaluwarsa |
| Referensi kebutuhan | Spesifikasi ORDER-01/ORDER-02 bagian 5-8, AC-ORDER-01-01..09, PRD 5.1, SDD 4.4 |
| Lingkup perubahan | `src/lib/orders/{validation,number,queries,mutations,reservations,index}.ts` |
| Di luar lingkup | Pembayaran (PH-04), voucher (PH-05), email (PH-05), alamat tersimpan |
| Ketergantungan | TASK-25 (skema), TASK-26 (verifikasi HP), TASK-19 (ongkir), TASK-16 (keranjang) |
| Area kode | `/src/lib/orders/` |
| Hasil yang diserahkan | `createOrder()` transaksional, `releaseExpiredReservations()`, `getOrdersForUser()`, `getOrderDetail()`, `findOrderForTracking()` |
| Kriteria selesai task | AC-ORDER-01-01, -04, -06, -07, -08, -09 dan AC-ORDER-02-01, -05 lulus |
| Cara verifikasi | HTTP: buat pesanan (stok turun), buat ulang saat stok 0 (`INSUFFICIENT_STOCK`), dua permintaan bersamaan (tanpa overselling), set `stockReservedUntil` ke masa lalu lalu baca riwayat (stok kembali + CANCELED) |
| Penanggung jawab | Agent / Developer |
| Hambatan / catatan | Reservasi memakai `updateMany({ where: { id, stock: { gte: qty } }, data: { stock: { decrement: qty } } })` dan memeriksa `count === 1`; seluruh langkah ada di satu `$transaction` |

### 6.5. Exit criteria PH-03

- [x] TASK-25 sampai TASK-38 selesai dan tercatat
- [x] Kriteria penerimaan ORDER-01, ORDER-02, ORDER-03, ORDER-04 diperiksa
- [x] Alur demo PH-03 dapat dijalankan (checkout guest dengan OTP → buat pesanan → riwayat customer → lacak publik)
- [x] Migrasi database diterapkan (`20261009231301_add_orders`)
- [x] `pnpm dev` berjalan tanpa galat; `pnpm build` sukses (type check lulus)
- [x] Checkbox pemilihan item: default kosong, tidak disimpan, ongkir hanya dari item terpilih
- [x] Stok tidak pernah overselling: dua permintaan bersamaan untuk stok 1 → satu berhasil
- [x] Reservasi kedaluwarsa dilepas (stok kembali, status CANCELED) tanpa penjadwal
- [x] Ongkir yang dipakai server berasal dari hitung ulang, bukan dari body klien
- [x] Tidak ada galat tak tertangani di console/log
- [x] **Security checklist (OWASP Top 10 — SDD section 10):**
  - [x] A01 Access Control: identitas diambil dari sesi/cookie, bukan body; riwayat hanya pesanan sendiri (`404` untuk pesanan orang lain); lacak publik butuh nomor pesanan **dan** nomor HP yang cocok
  - [x] A03 Injection: seluruh query memakai Prisma (0 `$queryRaw`/`$executeRaw`); Zod memvalidasi body di setiap route baru
  - [x] A07 Auth: guest wajib nomor HP terverifikasi (penanda server di Redis, tidak bisa dipalsukan klien)
  - [x] A04 Insecure Design / penyalahgunaan: lacak publik dibatasi 10 percobaan / 10 menit per IP
  - [x] XSS: 0 match `dangerouslySetInnerHTML`
  - [x] Secrets: tidak ada kredensial baru; 0 hardcode
  - [x] Error Messages: pesan generik berbahasa Indonesia; detail hanya ke log
  - [x] Penanganan galat: `withRouteErrors` dipakai di seluruh route baru

### 6.6. Bukti verifikasi

**Ringkasan:** 23 pemeriksaan HTTP otomatis **PASS**, 0 **FAIL**. `pnpm lint` exit 0. `pnpm build` exit 0 (33 rute, termasuk `ƒ /api/orders/create`, `ƒ /api/orders/track`, `ƒ /checkout`, `ƒ /orders`, `◐ /orders/[id]`, `◐ /track-order`). 0 galat tak tertangani di console dev server.

**Lingkungan:** dev server `localhost:3000`, PostgreSQL Supabase, Redis Upstash, RajaOngkir Komerce (mode API aktif, 9 opsi kurir). Skrip verifikasi sementara (`ph03-verify.mjs`, dihapus setelah dipakai) memakai Prisma hanya untuk menyiapkan data uji dan memeriksa hasil, bukan untuk mengubah perilaku aplikasi.

| No | Pemeriksaan | Kriteria penerimaan | Hasil | Bukti (ringkas) |
| --- | --- | --- | --- | --- |
| T01 | Ongkir hanya dari item terpilih | AC-ORDER-01-02 | Lulus | 3 panggilan `POST /api/shipping` (kaos / sneakers / semua) → 200, 9 opsi, `source=api` |
| T01b | Berat item terpilih jadi kunci cache | AC-ORDER-01-02 | Lulus | `cached=false` → ulang kaos `cached=true`; set berbeda tetap `false` |
| T02 | `variantIds` di luar keranjang | AC-ORDER-01-02 | Lulus | `400 {"error":"CART_EMPTY","message":"Tidak ada item terpilih"}` |
| T03 | Guest tanpa OTP | AC-ORDER-01-04 | Lulus | `403 {"error":"PHONE_NOT_VERIFIED"}` |
| T04 | Guest terverifikasi buat pesanan | AC-ORDER-01-01, -05 | Lulus | `201`, `orderNumber=FS-20261010-WH8ZQ2`, status `WAITING_PAYMENT`, subtotal 79000, ongkir 14000, total 93000 |
| T05 | Stok berkurang saat pesanan dibuat | AC-ORDER-01-07, PRD 5.1 | Lulus | stok kaos 25 → 24 |
| T06 | Item terpesan keluar dari keranjang guest | AC-ORDER-01-06 | Lulus | `cart.itemCount=0` |
| T07 | Lacak dengan nomor + HP cocok | AC-ORDER-04-01 | Lulus | `200`, 1 item, status `WAITING_PAYMENT` |
| T08 | Lacak dengan HP salah | AC-ORDER-04-02 | Lulus | `404 {"error":"NOT_FOUND"}` |
| T09 | Nomor pesanan tidak ada | AC-ORDER-04-02 | Lulus | `404 "Pesanan tidak ditemukan"` (generik) |
| T10 | Format nomor pesanan | AC-ORDER-04-03 | Lulus | `400 {"error":"VALIDATION_ERROR","field":"orderNumber"}` |
| T11 | Batas percobaan lacak per IP | AC-ORDER-04-04 | Lulus | percobaan ke-11 → `429`, total 429 = 1 |
| T12 | Customer daftar + masuk | AC-ORDER-02-01 | Lulus | register 201, login 302 |
| T13 | Customer buat pesanan tanpa OTP | AC-ORDER-02-01 | Lulus | `201`, `orderNumber=FS-20261010-HQT3T4`; keranjang awal 2 item |
| T14 | Hanya item terpilih keluar dari keranjang | AC-ORDER-02-05 | Lulus | `cart.itemCount=1` (sneakers tetap) |
| T15 | Riwayat + detail pesanan sendiri | AC-ORDER-03-01, -03 | Lulus | `/orders` 200 memuat nomor; `/orders/{id}` 200 memuat nomor |
| T16 | Pesanan orang lain tidak terlihat | AC-ORDER-03-04 | Lulus | detail & daftar customer lain tidak memuat nomor pesanan tersebut |
| T17 | Stok tidak cukup | AC-ORDER-01-08 | Lulus | `400 {"error":"INSUFFICIENT_STOCK","message":"Stok Kaos Polos Katun Combed 30s tidak cukup (tersisa 0)"}` |
| T18 | Dua pesanan bersamaan (stok 1) | AC-ORDER-01-09 | Lulus | sukses 1 / ditolak 1 (`INSUFFICIENT_STOCK`), stok akhir 0 |
| T19 | Reservasi kedaluwarsa dilepas | AC-ORDER-01-06 | Lulus | status `CANCELED` (track + DB), stok 22 → 23 |
| T20 | Pelepasan idempoten | AC-ORDER-01-06 | Lulus | stok tetap 23 setelah pelepasan kedua |
| T21 | Produk yang dipesan tidak bisa dihapus | integritas riwayat | Lulus | `409 {"error":"PRODUCT_IN_USE"}` |
| T22 | `totalStock` produk konsisten | PRD 5.1 | Lulus | totalStock produk kaos 65 = jumlah stok varian |

**Pemeriksaan manual (tidak otomatis):**

- `/cart`: checkbox per baris default **tidak tercentang**, tanpa tombol "pilih semua", pilihan hilang setelah reload (state React), tombol "Checkout (n item)" muncul setelah ada centang. Tidak ada lagi blok "Estimasi Ongkos Kirim" di sini (dipindah ke `/checkout` pada revisi 6.8).
- `/checkout`: guest menampilkan langkah OTP lebih dulu; customer langsung ke form dengan nama/email/no HP akun. Urutan input: nama + nomor HP penerima, lalu kecamatan tujuan, lalu kota/provinsi/kode pos (terisi otomatis, read-only), baru alamat lengkap; kurir baru bisa dihitung setelah kecamatan dipilih; tombol "Buat Pesanan" menolak tanpa kecamatan/kurir. Guest yang penanda OTP-nya hilang/kedaluwarsa dikembalikan ke langkah OTP saat server menjawab `403 PHONE_NOT_VERIFIED`.
- `/orders`, `/orders/[id]`, `/track-order`: tampilan status berlabel Indonesia (`Menunggu Pembayaran`, `Dibatalkan`), tautan "Pesanan" pada menu pengguna masuk dan "Lacak" untuk tamu.

**Catatan keamanan yang diperiksa:**

- `POST /api/orders/create` mengambil identitas dari sesi/cookie (`getCartIdentity`), bukan body; `variantIds` hanya menyaring keranjang, tidak menambah item.
- Ongkir dihitung ulang di server dari berat item terpilih; `courierCode` + `service` dicocokkan ke opsi hasil hitung server (`INVALID_SHIPPING_METHOD` bila tidak ada).
- Harga dan berat pesanan diambil dari varian saat pesanan dibuat, bukan dari snapshot keranjang.
- 0 `$queryRaw`/`$executeRaw`, 0 `dangerouslySetInnerHTML` di `src/`.
- Data uji dibersihkan: `orders=0`, `orderItems=0`, user `qa.ph03.*` = 0, stok seed kaos 25 / sneakers 5, `totalStock` seluruh produk cocok dengan jumlah varian.

### 6.7. Laporan untuk review

**Status:** PH-03 (Checkout — ORDER-01..04) **Disetujui** (2026-10-10). Commit: `e1f5ab9` (kode) dan `a0a7961` (docs).

**Hasil yang bisa dicoba:**

1. Guest: tambah produk → `/cart` centang item → "Checkout" → verifikasi OTP (Twilio Verify) → isi alamat → pilih tujuan + kurir → "Buat Pesanan" → nomor pesanan tampil → `/track-order`.
2. Customer: masuk → `/cart` centang sebagian item → "Checkout" → isi alamat → "Buat Pesanan" → `/orders` dan `/orders/[id]`.

**Keputusan yang sudah diterapkan (bagian 6.2):** pesanan tanpa baris `Payment`; input voucher disembunyikan; AC email ditunda ke PH-05; pelepasan reservasi **malas** (tanpa penjadwal); stok dikurangi saat pesanan dibuat.

**Keterbatasan yang diketahui pada fase ini (bukan regresi):**

- Pesanan berstatus `WAITING_PAYMENT` dengan reservasi 10 menit belum punya jalur pembayaran; pembayaran (PAY-01/PAY-02) menyusul di PH-04. Selisih 10 menit vs masa bayar 24 jam diselesaikan di PH-04.
- Email konfirmasi belum dikirim (`guestEmail` sudah disimpan) — PH-05/NOTIF-01.
- Voucher belum bisa dipakai (`discount` selalu 0) — PH-05/VOUCH-01.
- Alamat tersimpan (maks 5) belum ada; alamat disimpan per pesanan sebagai JSON.
- Item keranjang guest dihapus dari Redis **setelah** transaksi database; bila Redis gagal, item bisa tertinggal (akan bersih saat keranjang ditulis berikutnya).
- Pelepasan reservasi malas hanya berjalan saat ada aktivitas pesanan; tanpa aktivitas, stok baru kembali pada permintaan berikutnya.

**Keputusan yang dibutuhkan dari pengguna:**

1. Konfirmasi PH-03 disetujui untuk lanjut ke PH-04 (Payment Integration).
2. Konfirmasi pesan commit yang sudah disiapkan (usulan: dua commit terpisah — kode dan dokumentasi; belum ada yang di-`git add`).
3. Konfirmasi apakah `SHIPPING_ORIGIN_DISTRICT_ID=17590` (Cilandak, Jakarta Selatan) sudah sesuai lokasi asal toko.

### 6.8. Revisi pasca-persetujuan PH-03 (2026-10-10)

PH-03 sudah disetujui dan di-commit (`e1f5ab9` kode, `a0a7961` docs), tetapi dua hal dilaporkan pengguna setelahnya dan dikerjakan sebagai revisi (bukan fase baru). Kode revisi berada di working directory, menunggu commit.

**1. Bug: guest selalu ditolak `403 PHONE_NOT_VERIFIED` walau OTP sukses.**

- **Akar masalah:** `src/lib/auth/otp.ts` menulis penanda `redis.set(key, "1")` lalu membacanya dengan `value === "1"`. SDK Upstash men-JSON-parse nilai saat `get`, sehingga `"1"` kembali sebagai **number 1** dan perbandingan selalu `false`. Akibatnya setiap guest yang membuat pesanan ditolak, sekalipun baru lolos OTP.
- **Kenapa lolos verifikasi PH-03:** skrip uji `T04` menyemai penanda lewat REST mentah dengan `JSON.stringify("1")` (menyimpan string `"1"`), bukan lewat fungsi aplikasi. Bentuk itu satu-satunya yang lolos, sehingga jalur aplikasi asli tidak pernah teruji. Catatan lama di bagian 10 dan 11 bahkan membalik kesimpulannya dan ikut menutupi bug; keduanya sudah dikoreksi.
- **Bukti probe (fungsi aplikasi langsung ke Redis):** `markPhoneVerified` lalu `isPhoneVerified` → `false`; nilai mentah `1` bertipe `number`; `1 === "1"` → `false`. Setelah perbaikan: penanda `"verified"` → `true`, nomor tanpa penanda → `false`.
- **Perbaikan:** penanda diganti string non-JSON `"verified"` dan `isPhoneVerified` memakai `String(value) === "verified"`; `markPhoneVerified` tidak lagi menelan galat (verifikasi tidak boleh dilaporkan sukses bila penanda gagal tersimpan). Di `CheckoutForm`, respons `403 PHONE_NOT_VERIFIED` mengembalikan form ke langkah OTP.
- **Bukti end-to-end (dev server + Supabase + Redis + RajaOngkir):** keranjang guest `200` + cookie ter-set; `POST /api/shipping` `200 source:"api"` (opsi `sicepat:HALU`); nomor belum terverifikasi → `403 {"error":"PHONE_NOT_VERIFIED"}`; nomor terverifikasi → `201 orderNumber=FS-20261010-H8X6M5`; stok kembali setelah pembatalan. Data uji dibersihkan (`orders=0`, `payments=0`, `cartItems=0`).

**2. UX: alamat vs metode pengiriman tidak terhubung.**

- **Masalah:** kota/provinsi/kode pos diketik manual, padahal sumber ongkir adalah `destinationId` (ID kecamatan RajaOngkir); field manual hanya catatan dan tidak memengaruhi ongkir.
- **Perbaikan:** `searchDestinations` kini memetakan `province_name`/`city_name`/`district_name`/`subdistrict_name`/`zip_code` (sebelumnya hanya `id` + `label`). Urutan form checkout: penerima (nama, nomor HP) → kecamatan tujuan → kota/provinsi/kode pos (terisi otomatis, read-only; tetap editable bila API ongkir nonaktif) → alamat lengkap → catatan → email → kurir. Komponen pemilih dipecah: `DestinationPicker` (pencarian) + `CourierPicker` (tarif). Kunci cache pencarian naik ke `ship:search:v2:` karena bentuk entri berubah.
- **Verifikasi:** `GET /api/shipping/cities?search=cilandak` mengembalikan field baru (`cityName:"JAKARTA SELATAN"`, `provinceName:"DKI JAKARTA"`, `zipCode:"12430"`).

**3. UX: pemilih ongkir dipindah sepenuhnya ke `/checkout`.**

- **Masalah:** kotak "Estimasi Ongkos Kirim" + pencarian kecamatan ada di `/cart`, lalu `/checkout` meminta memilih kecamatan lagi. Pilihan di `/cart` juga tidak terbawa karena `destinationId` tidak pernah dikirim antar halaman.
- **Perbaikan:** blok ongkir dihapus dari ringkasan `/cart`; `CartSummary` hanya menampilkan subtotal + tombol Checkout. Pencarian kecamatan dan hitung kurir hanya ada di `/checkout`. Komponen gabungan `ShippingPicker.tsx` dihapus karena tidak terpakai lagi.
- **Verifikasi:** `/cart` tidak lagi memuat "Estimasi Ongkos Kirim"; `pnpm lint` exit 0; `pnpm build` exit 0.

**Pemeriksaan:** `pnpm lint` exit 0; `pnpm build` exit 0 (35 rute); probe OTP + end-to-end guest lulus; DB bersih.

---

## 7. Rincian Fase: PH-04 — Payment Integration

### 7.1. Tujuan dan batas

- **Tujuan:** Pembayaran Xendit berjalan; webhook memperbarui status `Payment` dan `Order`; stok **tidak** dikurangi lagi saat pembayaran sukses (sudah dipotong saat pesanan dibuat di PH-03)
- **Termasuk:** PAY-01 (Create Payment — Xendit Invoice API), PAY-02 (Webhook Handler)
- **Tidak termasuk:** Refund (PH-06), email notifikasi (PH-05), pemilihan metode per-channel
- **Referensi:** Spesifikasi PAY-01, PAY-02, SDD 4.4/4.5/6.2/6.3
- **Prasyarat:** PH-03 disetujui; akun Xendit (Test Mode) + `XENDIT_SECRET_KEY` + `XENDIT_WEBHOOK_TOKEN`
- **Langkah demo:** Buat pesanan → "Bayar Sekarang" → halaman invoice Xendit → bayar (Test Mode) → webhook PAID → status pesanan PROCESSING → stok tidak berubah
- **Estimasi:** 2-3 hari

### 7.2. Keputusan desain PH-04 (2026-10-10)

| Isian | Keputusan | Alasan |
| --- | --- | --- |
| Jalur Xendit | **Invoice API v2 (hosted page)** — `POST /v2/invoices` | Satu endpoint; Xendit yang menampilkan QRIS/VA/e-wallet. Kode dan state paling sedikit (KISS). Pemilihan per-channel (`/v3/payment_requests`) ditunda |
| Masa bayar | **Satu nilai** `XENDIT_INVOICE_DURATION` (detik, default 900 = 15 menit) untuk `invoice_duration` Xendit **dan** `stockReservedUntil` | Stok sudah dipotong saat pesanan dibuat, jadi lama stok tertahan = lama masa bayar. Dua nilai terpisah berisiko oversell |
| Stok saat PAID | **Tidak dikurangi lagi** | Stok sudah dipotong di PH-03 (reservasi). Webhook PAID hanya mengubah status |
| Idempotensi | Klaim baris `Payment` lewat `updateMany` bersyarat (`status: PENDING`) | Tidak butuh penanda Redis; tahan pengiriman ulang webhook |
| Otorisasi buat pembayaran | Customer: sesi pemilik pesanan. Guest: `phone` = `Order.guestPhone` | Selaras model kepercayaan ORDER-04 (lacak publik) |
| Titik masuk | `POST /api/payments/create`, `POST /api/webhooks/xendit` | Selaras SDD 4.5 |
| Jumlah | Selalu dari `Order.total` (server) | Klien tidak boleh menentukan nominal |

### 7.3. Daftar task

| ID | Task | Hasil | Status |
| --- | --- | --- | --- |
| TASK-39 | Model `Payment` + enum `PaymentStatus` + migrasi | Tabel `payments` | Selesai |
| TASK-40 | Klien Xendit + konfigurasi (`src/lib/payments/{config,client,validation}.ts`) | `createInvoice`, env | Selesai |
| TASK-41 | Mutasi pembayaran (`createPaymentForOrder`, `applyPaidPayment`, `applyExpiredPayment`) | `src/lib/payments/mutations.ts` | Selesai |
| TASK-42 | `POST /api/payments/create` | Endpoint + otorisasi + Zod | Selesai |
| TASK-43 | `POST /api/webhooks/xendit` | Verifikasi token + idempotensi | Selesai |
| TASK-44 | UI: `PayNowButton` + tombol di detail pesanan & sukses checkout | `src/components/payments/` | Selesai |
| TASK-45 | Selaraskan reservasi stok dengan masa bayar + `cancelOrderAndReleaseStock` | `src/lib/orders/{mutations,reservations}.ts` | Selesai |
| TASK-46 | Dokumentasi + verifikasi + laporan review PH-04 | docs/03, docs/04 | Selesai |

### 7.4. Kartu task (sample: TASK-41 — Mutasi pembayaran)

- **Tujuan:** Membuat invoice dan menyimpan `Payment`; menerapkan webhook secara idempoten
- **Langkah:** `createPaymentForOrder` (otorisasi → idempoten → `createInvoice` → upsert `Payment` → selaraskan `stockReservedUntil`); `applyPaidPayment` (PENDING → PAID, Order → PROCESSING); `applyExpiredPayment` (PENDING → EXPIRED, Order → CANCELED + stok kembali)
- **Berkas:** `src/lib/payments/{mutations,client,config,validation}.ts`, `src/lib/orders/reservations.ts`
- **Selesai bila:** webhook PAID/EXPIRED diterapkan sekali; pengiriman ulang `200 ALREADY_PROCESSED`

### 7.5. Exit criteria PH-04

- [x] `Payment` + `PaymentStatus` termigrasi (`20261010041046_add_payments`)
- [x] `POST /api/payments/create` mengembalikan `invoiceUrl` Xendit; jumlah dari `Order.total`
- [x] Otorisasi: `403` untuk bukan pemilik / nomor guest tidak cocok
- [x] Webhook memverifikasi `x-callback-token` (`401` bila salah, `503` bila belum dikonfigurasi)
- [x] Webhook PAID: `Payment=PAID`, `Order=PROCESSING`, **stok tidak berubah**
- [x] Webhook EXPIRED: `Payment=EXPIRED`, `Order=CANCELED`, stok dikembalikan
- [x] Idempotensi: webhook ulang `200 ALREADY_PROCESSED`
- [x] `stockReservedUntil` selaras dengan `expiry_date` invoice
- [x] 0 `$queryRaw`/`$executeRaw`; Zod di kedua route; tanpa hardcode secret
- [x] `pnpm lint` exit 0; `pnpm build` exit 0 (35 rute)
- [x] Data uji dibersihkan

### 7.6. Bukti verifikasi

Skrip verifikasi sementara (`ph04-verify.mjs`, `ph04-guest.mjs`, `ph04-dbcheck.mjs`, dihapus setelah dipakai) dijalankan terhadap server dev + database Supabase + Xendit Test Mode asli.

| Kode | Uji | Hasil |
| --- | --- | --- |
| V01 | Login admin (kredensial `identifier`) | `302`, sesi aktif |
| V02 | Tambah keranjang + hitung ongkir | `200`, opsi `source:"api"` |
| V03 | Buat pesanan | `201`, stok 25 → 24 |
| V04 | Buat pembayaran | `200`, `invoiceUrl` `https://checkout-staging.xendit.co/...` |
| V05 | Baris `Payment` | `PENDING`, `expiresAt` terisi |
| V06 | `stockReservedUntil` vs `expiry_date` | drift 0 ms |
| V07 | Buat pembayaran ulang | `200`, `invoiceUrl` sama (idempoten) |
| V08 | Webhook token salah | `401` |
| V09 | Webhook PAID | `200 APPLIED` |
| V10 | Status pesanan | `PROCESSING` |
| V11 | Status pembayaran | `PAID` + `paidAt` |
| V12 | Stok setelah PAID | tetap 24 (tidak dikurangi lagi) |
| V13 | Webhook PAID diulang | `200 ALREADY_PROCESSED` |
| V14 | Pesanan kedua + webhook EXPIRED | `200 APPLIED` |
| V15 | Status pesanan kedua | `CANCELED` |
| V16 | Stok setelah EXPIRED | 23 → 24 (kembali) |
| V17 | Buat pembayaran tanpa sesi | `403 FORBIDDEN` |
| V18 | OrderId tak ada | `404 ORDER_NOT_FOUND` |
| V19 | Body tidak valid | `400 VALIDATION_ERROR` |
| V20 | Guest nomor salah | `403` |
| V21 | Guest nomor cocok | `200` + `invoiceUrl` |
| V22 | Guest tanpa nomor | `403` |

**Total:** 29 PASS / 0 FAIL. Data uji dibersihkan (`orders=0`, `payments=0`, `cartItems=0`, stok seed kaos 25, `totalStock` produk cocok). `pnpm lint` exit 0; `pnpm build` exit 0 (35 rute, termasuk `ƒ /api/payments/create`, `ƒ /api/webhooks/xendit`). 0 galat tak tertangani di log dev.

### 7.7. Laporan untuk review

**Status:** PH-04 (Payment Integration — PAY-01, PAY-02) selesai dikerjakan, **siap direview**.

> **Disetujui 2026-10-10.** User: "lanjutkan" setelah laporan review PH-04 (implisit menerima hasil sekaligus memberi izin lanjut ke PH-05).

**Yang bisa dicoba:**

1. Buat pesanan (guest/customer) → klik "Bayar Sekarang" → dialihkan ke halaman invoice Xendit → bayar (Test Mode) → pesanan jadi "Diproses".
2. Biarkan invoice kedaluwarsa (atau kirim webhook EXPIRED) → pesanan "Dibatalkan", stok kembali.

**Prasyarat uji manual:** `XENDIT_SECRET_KEY` + `XENDIT_WEBHOOK_TOKEN` sudah diisi user; webhook publik (ngrok/cloudflared → `/api/webhooks/xendit`) atau tombol "Test webhook" dashboard Xendit. Verifikasi otomatis di 7.6 memanggil webhook langsung ke server dev (tanpa tunnel).

**Catatan:** `docs/04` dulu menulis `XENDIT_CALLBACK_TOKEN` — nama kanoniknya `XENDIT_WEBHOOK_TOKEN` (dipakai kode dan `.env.example`).

---

## 8. Rincian Fase: PH-05 — Core Features (Voucher + Notification + Invoice)

### 8.1. Tujuan dan batas

- **Tujuan:** Voucher calculation works (bertahap, stacking), email notifications sent, invoice PDF generated
- **Termasuk:** VOUCH-01 (Apply Voucher), VOUCH-02 (Voucher CRUD), NOTIF-01 (Email Notification), INV-01 (Invoice PDF)
- **Tidak termasuk:** Advanced voucher rules (future)
- **Referensi:** Spesifikasi VOUCH-01, VOUCH-02, NOTIF-01, INV-01, SDD 4.6, SDD 4.9, SDD 4.10
- **Prasyarat:** PH-04 disetujui, Resend account
- **Langkah demo:** Apply voucher at checkout → Discount calculated → Order created → Email sent → Invoice PDF generated
- **Estimasi:** 3-4 hari

*Task detail dirinci saat PH-04 selesai dan PH-05 dimulai.*

### 8.2. Keputusan desain (dasar implementasi)

1. **Skema voucher:** enum `VoucherType` (`PERCENTAGE`, `NOMINAL`, `SHIPPING`) + model `Voucher`, `VoucherCompatibility` (matriks stacking per pasangan), `VoucherUsage` (catatan pemakaian per pesanan/nomor HP). Relasi baru `Order.voucherUsages`. Migrasi `20261010125215_add_vouchers`.
2. **Kalkulasi bertahap (PRD 5.3):** nominal dulu, lalu persentase dihitung dari harga sisa (seller-oriented), dibatasi `maxDiscount`; urutan antar voucher sejenis memakai kode menaik supaya hasil konsisten; voucher ongkir dihitung terpisah dan tidak menyentuh potongan produk. Maksimal 2 voucher.
3. **Stacking = default menolak.** Pasangan voucher hanya boleh digabung bila admin mencatat baris `VoucherCompatibility` `isAllowed = true`. Pasangan tanpa baris tidak boleh digabung (explicit opt-in, seller-oriented).
4. **Kuota dijaga di transaksi.** Penambahan `usageCount` memakai `updateMany` bersyarat (`usageCount < usageLimit`); `count === 0` membatalkan seluruh transaksi. Mencegah kuota terlewati pada pesanan berbarengan.
5. **Pratinjau voucher dihitung server.** `POST /api/vouchers/validate` menghitung subtotal dari keranjang (bukan dari klien); `shippingCost` dari klien hanya untuk pratinjau voucher ongkir. Angka final selalu dihitung ulang saat pesanan dibuat.
6. **`EMAIL_FROM` dibaca dari env** (`getEmailFrom()`), default dev `onboarding@resend.dev`. Email dikirim lewat HTTP API Resend (`fetch`, tanpa SDK).
7. **Invoice = halaman HTML siap-cetak** (`/orders/[id]/invoice` + `PrintButton` `window.print()`), bukan `@react-pdf/renderer`. Deviasi dari SDD 4.10 (lihat bagian 10).

### 8.3. Daftar task

| ID | Task | Hasil |
| --- | --- | --- |
| TASK-47 | Skema voucher + migrasi | `prisma/schema.prisma`, `20261010125215_add_vouchers` |
| TASK-48 | Engine kalkulasi + eligibilitas | `src/lib/vouchers/{calculation,eligibility,validation,queries,mutations,index}.ts` |
| TASK-49 | API pratinjau voucher | `POST /api/vouchers/validate` |
| TASK-50 | CRUD voucher admin | `GET/POST /api/admin/vouchers`, `GET/PATCH/DELETE /api/admin/vouchers/[id]`, `/admin/vouchers` (list/new/edit), `VoucherForm`, link Sidebar |
| TASK-51 | Integrasi checkout | `orderCreateSchema.voucherCodes`, `createOrder` (diskon + `Order.discount` + `VoucherUsage` + `usageCount`), input voucher di `CheckoutForm` |
| TASK-52 | Email notifikasi (Resend) | `src/lib/notifications/`, `src/emails/`; konfirmasi pesanan (`/api/orders/create`) + pembayaran sukses (`applyPaidPayment`); non-blocking |
| TASK-53 | Invoice | `/orders/[id]/invoice`, `PrintButton`, tautan dari halaman pesanan |

### 8.4. Bukti verifikasi

`pnpm lint` exit 0; `pnpm build` exit 0 (rute baru: `ƒ /api/admin/vouchers`, `ƒ /api/admin/vouchers/[id]`, `ƒ /api/vouchers/validate`, `◐ /orders/[id]/invoice`). Skrip verifikasi sementara (dihapus setelah dipakai):

| Kode | Uji | Hasil |
| --- | --- | --- |
| E1-E13 | Engine: nominal tunggal, stacking default ditolak, stacking setelah kompatibilitas (nominal lalu persen dari sisa), voucher ongkir, min transaksi, kuota habis, batas per nomor HP, >2 voucher | 13 PASS / 0 FAIL |
| H1-H24 | HTTP: login customer/admin, admin POST 201, kode duplikat 409, list, 401 tanpa sesi, 403 customer, keranjang, validate valid/tak dikenal, tarif, buat pesanan dengan voucher 201 + `Order.discount` + `VoucherUsage` + `usageCount`, invoice 200, PATCH 200, DELETE 200 → 404 | 24 PASS / 0 FAIL |
| M1-M7 | Email: konfigurasi, template konfirmasi/pembayaran, `sendEmail` sukses (Resend), `applyPaidPayment` APPLIED → `PROCESSING`, webhook ulang `ALREADY_PROCESSED` | 7 PASS / 0 FAIL |

Catatan: jalur email terbukti **non-blocking** — pada uji H15 Resend menolak `403` (domain uji hanya bisa kirim ke alamat pemilik akun) namun pesanan tetap dibuat `201` dan kegagalan hanya tercatat di log server. Data uji dibersihkan (pesanan uji dihapus + stok dikembalikan; voucher uji dihapus).

### 8.5. Laporan untuk review

**Status:** PH-05 (VOUCH-01, VOUCH-02, NOTIF-01, INV-01) selesai dikerjakan, **siap direview**.

**Yang bisa dicoba:**

1. Login admin → menu **Voucher** → Tambah Voucher (jenis nominal/persentase/ongkir, periode, kuota, kompatibilitas stacking) → voucher tampil di daftar.
2. Customer: tambah produk ke keranjang → `/checkout` → isi kode voucher → diskon muncul di ringkasan → Buat Pesanan → halaman pesanan menampilkan baris "Diskon voucher" + tautan **Lihat Invoice**.
3. Invoice: `/orders/<id>/invoice` → tombol **Cetak / Simpan PDF**.

**Catatan untuk review:**
- Email hanya terkirim ke alamat pemilik akun Resend selama `EMAIL_FROM` masih `onboarding@resend.dev`. Untuk kirim ke pembeli mana pun, isi `EMAIL_FROM` dengan domain terverifikasi di Resend (lihat `docs/06`).
- Invoice berupa HTML siap-cetak; penyimpanan PDF dilakukan lewat dialog cetak browser.

---

## 9. Rincian Fase: PH-06 — Polish MVP (Reports + Config + Advanced)

### 9.1. Tujuan dan batas

- **Tujuan:** Admin reports work, store settings work, shipping tracking works, cancel/refund order works, voucher bisa dibatasi ke produk/kategori tertentu, admin bisa mengelola pesanan dan statusnya, email lanjutan terkirim, customer bisa melacak pesanan tanpa input data (ORDER-08)
- **Termasuk:** 
  - SHIP-02 (Shipping Tracking), ORDER-05 (Cancel Order), ORDER-06 (Refund), REPORT-01 (Sales Report), CONFIG-01 (Store Settings)
  - Lanjutan VOUCH-01 (cakupan voucher: produk eligible, produk dikecualikan, kategori — PRD 5.4 butir 1-3)
  - ORDER-07 (Admin Order Management — ID baru dari audit 2026-10-10: daftar + detail pesanan di `/admin/orders`, ubah status pesanan `SHIPPED`/`COMPLETED` + isi nomor resi, lihat status pembayaran — PRD 2.3/3.1.K/4.4). Tanpa fitur ini tidak ada pemilik transisi pesanan ke `SHIPPED`/`COMPLETED`; SHIP-02/ORDER-05/ORDER-06 di fase ini menggantung padanya sebagai tulang punggung UI admin
  - SHIP-03 (Pickup — PRD 3.1.F/3.1.J/4.7: opsi ambil di toko bila diaktifkan, tanpa ongkir)
  - ORDER-08 (Tracking Pesanan Customer — PRD 2.2/3.1.H: `/track-order` jadi dua jalur — guest isi form nomor pesanan + nomor HP (ORDER-04, sudah jalan, tidak berubah), customer login langsung lihat daftar seluruh pesanan dalam perjalanan tanpa input; tombol "Lacak Pesanan" di `/orders` — placeholder sejak 2026-10-10 — mengarah ke detail tracking per pesanan yang session-scoped, bukan ke form. Keputusan lengkap: bagian 10, baris ORDER-08)
  - Lanjutan PROD-01 (peran gambar: size chart / info tambahan, 1 opsional — PRD 3.1.A/7.4; `ProductImage` belum punya peran). Lanjutan PROD-02 (filter katalog) **sudah dikerjakan lebih awal pada 2026-10-10** — lihat bagian 10
  - Lanjutan NOTIF-01 (email order shipped + tracking link, cancellation approved/rejected, refund completed — PRD 3.1.I; 2 dari 6 jenis email sudah jalan sejak PH-05)
  - REPORT-01 diperluas mencakup lima laporan PRD 4.11 (sales, kinerja produk, stok, order, refund)
  - Template alasan penolakan pembatalan masuk CONFIG-01 (CRUD + nonaktifkan + pilih template atau manual — PRD 3.1.G/4.12/5.5)
- **Tidak termasuk:** Advanced analytics, multi-store (future), set/reset password customer (PH-07), konfigurasi platform Site Admin (PH-08)
- **Referensi:** Spesifikasi SHIP-02, ORDER-05, ORDER-06, ORDER-08, REPORT-01, CONFIG-01 (ditulis saat PH-06 dimulai), PRD 2.2, PRD 3.1.A/F/G/H/I/K, PRD 4.4, PRD 4.11, PRD 4.12, PRD 5.4, PRD 5.5, `docs/04` bagian 10 (keputusan cakupan produk voucher + audit 2026-10-10 + keputusan ORDER-08), SDD 4.7, SDD 4.11, SDD 4.12
- **Prasyarat:** PH-05 disetujui — mesin voucher, form voucher admin, `eligibility.ts`, dan email (Resend) sudah ada sejak PH-05
- **Langkah demo:** Admin buat sales report → Update store settings + template alasan → Admin ubah status pesanan jadi Dikirim + isi nomor resi → Customer dapat email shipped + bisa lacak (buka `/track-order`: daftar pesanan dalam perjalanan tanpa input; atau tombol Lacak di `/orders` → detail tracking) → Customer cancel order → Admin approve refund (upload bukti) → Customer pilih pickup saat checkout (bila diaktifkan) → Buat voucher khusus satu kategori dan buktikan voucher itu ditolak untuk produk di luar kategori
- **Estimasi:** 4-5 hari (naik dari 3-4 setelah audit 2026-10-10 menambah cakupan)

### 9.2. Keputusan desain (dasar implementasi)

1. **Pembatalan selalu lewat tinjauan admin (PRD 5.5).** `OrderStatus` ditambah `CANCEL_REQUESTED`; pembeli mengajukan (alasan free text), admin menyetujui atau menolak. Berlaku juga untuk pesanan belum dibayar.
2. **Refund hanya bila pembayaran `PAID`.** Baris `Refund` dibuat dengan `method: MANUAL`, `status: PENDING`; admin mengunggah bukti (`uploadthing` route `refundProof`, hanya STORE_ADMIN) → `COMPLETED`.
3. **Penolakan pembatalan** mengembalikan status ke `PROCESSING` (bila `PAID`) atau `WAITING_PAYMENT`; `cancelReason`/`cancelRequestedAt` tetap disimpan sebagai riwayat.
4. **Template alasan hanya untuk penolakan admin.** Alasan pembeli free text; template dipilih admin (atau isi manual) saat menolak.
5. **Satu endpoint aksi admin:** `PATCH /api/admin/orders/[id]` dengan discriminated union `SHIP | COMPLETE | APPROVE_CANCEL | REJECT_CANCEL | COMPLETE_REFUND`.
6. **StoreSetting = baris tunggal id `"default"`.** Baca memakai nilai bawaan tanpa menulis (tanpa efek samping); tulis via `upsert`.
7. **Cakupan voucher (PRD 5.4):** tanpa baris cakupan = seluruh keranjang (perilaku PH-05); dengan cakupan, dasar potongan = total baris eligible (produk eligible ∪ kategori) minus produk dikecualikan, dan `minTransaction` diuji terhadap total eligible. `VoucherProduct.kind` membedakan `ELIGIBLE`/`EXCLUDED`.
8. **Tracking pesanan customer session-scoped (ORDER-08).** `/track-order` menampilkan daftar pesanan dalam perjalanan tanpa input saat customer login; tombol Lacak di `/orders` menuju `/orders/[id]/tracking` (kepemilikan dari sesi, `404` generik). Guest tetap memakai form nomor pesanan + nomor HP.
9. **Pickup (SHIP-03):** `Order.fulfillment` (`DELIVERY`/`PICKUP`); saat `PICKUP`, ongkir 0, kurir/tujuan tidak dipakai, dan alamat cukup nama + nomor HP. Opsi muncul bila `StoreSetting.pickupEnabled`.
10. **Size chart (PROD-01):** `ProductImage.role` (`GALLERY`/`SIZE_CHART`); bagan ukuran satu gambar opsional, terpisah dari galeri di form admin dan halaman produk.

### 9.3. Daftar task

| ID | Task | Hasil |
| --- | --- | --- |
| TASK-54 | Skema + migrasi PH-06 | `prisma/schema.prisma`, `20261011090000_add_ph06_polish`, `20261011093000_add_voucher_scope_kind` |
| TASK-55 | CONFIG-01: pengaturan toko + template alasan | `src/lib/config/{validation,queries,mutations,index}.ts` |
| TASK-56 | ORDER-07: lib manajemen pesanan admin + validasi | `src/lib/orders/{admin,admin-validation}.ts` |
| TASK-57 | Reservasi pembatalan | `cancelRequestedOrderAndReleaseStock` di `src/lib/orders/reservations.ts` |
| TASK-58 | API PH-06 | `PATCH /api/admin/orders/[id]`, `GET/PATCH /api/admin/settings`, `/api/admin/cancellation-reasons` (+`/[id]`), `POST /api/orders/[id]/cancel` |
| TASK-59 | REPORT-01: lima laporan | `src/lib/reports/{queries,index}.ts` |
| TASK-60 | NOTIF-01 lanjutan + upload bukti refund | `src/emails/{order-shipped,cancellation,refund-completed}.ts`, `src/lib/notifications/order-emails.ts`, route `refundProof` di `src/lib/uploadthing/core.ts` |
| TASK-61 | VOUCH-01 lanjutan: cakupan produk/kategori | `src/lib/vouchers/{calculation,eligibility,queries,mutations,validation}.ts`, `VoucherForm`, `/api/vouchers/validate`, `createOrder` |
| TASK-62 | UI admin PH-06 | `/admin` (dasbor), `/admin/orders` (+`/[id]`), `/admin/settings`, `/admin/cancellation-reasons`, `/admin/reports`, `AdminOrderActions`, `StoreSettingsForm`, `CancellationReasonManager`, link Sidebar |
| TASK-63 | SHIP-03: pickup di checkout | `orderCreateSchema.fulfillment`, `createOrder` (ongkir 0), `CheckoutForm` (toggle + info pickup), `/checkout` (baca `getPickupSettings`) |
| TASK-64 | ORDER-05/06/08 storefront | `CancelOrderForm`, tampilan refund + resi di `/orders/[id]`, `/orders/[id]/tracking`, daftar in-transit di `/track-order`, `getOrderDetail`/`getGuestOrderDetail` (+`refunds`) |
| TASK-65 | PROD-01 lanjutan: size chart | `productSchema.sizeChartUrl`, `normalizeInput` (baris `SIZE_CHART`), `ImageUploader` (`max`), `ProductForm`, halaman produk, filter `GALLERY` di kartu/keranjang/pesanan |
| TASK-66 | Verifikasi + laporan review | `pnpm lint` + `pnpm build` + `prisma migrate deploy`/`generate` |

### 9.4. Bukti verifikasi

| Kode | Uji | Hasil |
| --- | --- | --- |
| V1 | `prisma migrate deploy` (2 migrasi PH-06) | Terpasang (`20261011090000_add_ph06_polish`, `20261011093000_add_voucher_scope_kind`) |
| V2 | `pnpm exec prisma generate` | exit 0 |
| V3 | `pnpm lint` | exit 0 (0 error, 0 warning) |
| V4 | `pnpm build` | exit 0; rute baru muncul: `/admin`, `/admin/cancellation-reasons`, `/admin/orders`, `/admin/orders/[id]`, `/admin/reports`, `/admin/settings`, `/api/admin/cancellation-reasons` (+`/[id]`), `/api/admin/orders/[id]`, `/api/admin/settings`, `/api/orders/[id]/cancel`, `/orders/[id]/tracking` |
| V5 | `pnpm exec tsc --noEmit` | Bersih setelah tipe rute Next diregenerasi build |
| V6 | Smoke test HTTP (dev server) | `PATCH /api/admin/settings` tanpa sesi → `401`; `PATCH /api/admin/orders/[id]` tanpa sesi → `401`; `GET /api/admin/cancellation-reasons` tanpa sesi → `401`; `POST /api/orders/[id]/cancel` tanpa cookie guest → `404` (kepemilikan disembunyikan); `GET /admin/orders` tanpa sesi → `307` |

Catatan: verifikasi V3-V4 adalah otomatis. Uji klik-through manual (alur admin ubah status → resi → email → cancel/refund → pickup → tracking customer) **belum dijalankan** dan perlu dilakukan pengguna sebelum approval.

### 9.5. Laporan untuk review

**Status:** PH-06 (SHIP-02, SHIP-03, ORDER-05, ORDER-06, ORDER-07, ORDER-08, REPORT-01, CONFIG-01, lanjutan VOUCH-01/PROD-01/NOTIF-01) selesai dikerjakan, **siap direview**.

**Yang bisa dicoba:**

1. Admin login → **Dasbor** (ringkasan 30 hari + status pesanan) → **Pesanan** (filter status + cari) → buka detail → **Tandai Dikirim** (isi resi) → **Tandai Selesai**.
2. Admin → **Template Alasan** (tambah/ubah/hapus) → **Pengaturan Toko** (informasi, kebijakan, aktifkan pickup).
3. Admin → **Laporan** (5 laporan, rentang tanggal).
4. Customer: `/orders` → tombol **Lacak** pada pesanan → `/orders/[id]/tracking`; atau `/track-order` menampilkan pesanan dalam perjalanan tanpa input.
5. Customer: detail pesanan → **Ajukan Pembatalan** (alasan) → admin **Setujui** (buat refund) atau **Tolak** (pilih template) → admin unggah bukti refund → status refund jadi Selesai.
6. Checkout: bila pickup diaktifkan, muncul pilihan **Ambil di toko** (ongkir 0, cukup nama + HP).
7. Voucher: buat voucher dengan cakupan satu kategori → buktikan voucher ditolak untuk produk di luar kategori.
8. Produk: unggah **Bagan Ukuran** di form produk → tampil sebagai bagian terpisah di halaman produk (bukan di galeri).

**Catatan untuk review:**
- Email lanjutan (shipped/cancel/refund) memakai jalur Resend yang sama; selama `EMAIL_FROM` masih `onboarding@resend.dev` hanya terkirim ke pemilik akun.
- Webhook Xendit tidak sampai ke `localhost`; rekonsiliasi pembayaran tetap menutupi lewat polling + `getInvoice`.
- Uji klik-through manual belum dijalankan (lihat 9.4).

---

## 10. Perubahan scope dan hambatan

| Tanggal | Perubahan / hambatan | Dampak | Keputusan | Dokumen terkait |
| --- | --- | --- | --- | --- |
| 2026-10-09 | **Hambatan `P1001` — SELESAI.** Prisma tidak dapat menjangkau Supabase (`aws-0-ap-southeast-1.pooler.supabase.com`). Penyebab tunggal: nilai di `DATABASE_URL`/`DIRECT_URL` masih berbentuk placeholder — dibungkus tanda kurung siku `[...]` dan mengandung kata penanda. Setelah user mengisi password yang sebenarnya, koneksi langsung berhasil | Sempat menghentikan TASK-14 | **Selesai** — password diisi user, migrasi di-baseline (`20261009111500_init`), seed dijalankan. Faktor sertifikat TLS terbukti bukan penyebab | `docs/06_SETUP_KREDENSIAL.md` bagian 1 |
| 2026-10-09 | Catatan diagnostik: pooler Supabase menyajikan rantai sertifikat yang tidak ada di trust store Node (`SELF_SIGNED_CERT_IN_CHAIN`) | Tidak ada — terbukti bukan penyebab `P1001` | **Tidak relevan lagi.** `P1001` hilang setelah password diperbaiki tanpa menyentuh konfigurasi TLS. Opsi `sslmode=require` tidak pernah dipakai (mematikan verifikasi sertifikat). Kalau muncul lagi, jalur amannya adalah CA Supabase resmi (`sslrootcert`) | - |
| 2026-10-09 | **Cacat ditemukan dan diperbaiki: seed membuat admin dengan password kosong.** `.env.local` berisi `SEED_ADMIN_PASSWORD=""`. Operator `??` di `prisma/seed.ts` hanya jatuh ke nilai acak untuk `null`/`undefined`, sedangkan variabel yang dikosongkan bernilai string kosong — jadi string kosong dianggap sah dan admin dibuat tanpa password, sementara password acak tidak pernah dicetak | Akun admin tidak dapat dipakai; tidak ada kredensial yang dilaporkan ke operator | Diganti `\|\|` + `trim()`, ditambah penjagaan eksplisit yang membatalkan seed bila password kosong. Akun rusak dihapus, seed dijalankan ulang | `prisma/seed.ts` |
| 2026-10-09 | Prisma CLI tidak membaca `.env.local` (`P1012`) | Perintah `pnpx prisma ...` di dokumen tidak berfungsi | Script `db:*` di `package.json` dibungkus `dotenv-cli`; `docs/06_SETUP_KREDENSIAL.md` diperbarui memakai `pnpm db:*` | `package.json`, `docs/06_SETUP_KREDENSIAL.md` |
| 2026-10-09 | Batas ukuran unggah Uploadthing **4MB**, bukan 5MB seperti spesifikasi PROD-01 | Berkas 4–5MB ditolak | Uploadthing hanya menerima ukuran kelipatan pangkat dua; 4MB dipilih agar tidak pernah melebihi batas spesifikasi. Tidak mengubah perilaku yang dijanjikan | `src/lib/uploadthing/core.ts` |
| 2026-10-09 | Rute `/verify-phone` tidak ada di pohon struktur SDD section 5 | Satu halaman tambahan di luar pohon yang direncanakan | Dipakai sebagai halaman demo AUTH-01, karena tujuan aslinya (`/checkout`) baru ada di PH-03 | `src/app/(storefront)/verify-phone/` |
| 2026-10-09 | AC-PROD-01-04 (soft delete produk) ditunda | Produk dihapus permanen, bukan di-soft-delete | Order belum ada di PH-01, sehingga alasan soft delete (integritas riwayat pesanan) belum berlaku. Ditinjau kembali di PH-03/PH-04 | - |
| 2026-10-09 | `export const instant = false` pada `src/app/admin/layout.tsx` | Area admin tidak di-prerender | Area admin seluruhnya butuh autentikasi dan tidak dapat di-prerender; tanpa ini build gagal | `src/app/admin/layout.tsx` — **Koreksi 2026-10-10:** penanda di layout saja **tidak cukup**; halaman anak tetap memicu galat validasi instant. Penanda harus ada di setiap `page.tsx` (lihat baris 2026-10-10) |
| 2026-10-09 | Dua API route tidak memakai Zod: `/api/auth/[...nextauth]` dan `/api/uploadthing` | Checklist "Zod di semua API Routes" tidak berlaku harfiah | Kedua route adalah handler pustaka (NextAuth, Uploadthing) yang memvalidasi masukannya sendiri; penjagaan role ada di `middleware()` Uploadthing. Tidak ada input pengguna yang di-parse tanpa validasi | `src/app/api/` |
| 2026-10-09 | **Soft 404 slug produk — investigasi tuntas, bukan bug kode.** `/products/<slug-tidak-ada>` menjawab `200` di mode produksi, dengan UI not-found benar dan `<meta name="robots" content="noindex">` | Status HTTP tidak sesuai untuk pemantauan/klien non-browser; mesin pencari tidak terpengaruh karena `noindex` | **Perilaku PPR yang terdokumentasi** (docs Next.js `loading.mdx` bagian "Status codes": *"Before streaming starts, Next.js returns a 404 status code. After streaming starts, the status code remains 200"*). Tiga dugaan diuji dan gugur: (a) `instant = false` di level `page.tsx` — penanda build tetap `◐`; (b) `dynamic`/`force-dynamic`/`dynamicParams`/`revalidate` — ditolak build karena tidak kompatibel dengan `cacheComponents`; (c) `<Header />` (yang berisi `<Suspense>`) dikeluarkan dari layout dan di-build ulang — hasil di produksi **tetap** `200` + `noindex`, jadi Suspense di Header bukan penyebabnya. `(storefront)/loading.tsx` yang disebut sebagai akar di catatan sebelumnya **sudah dihapus** dan tidak mengubah hasil. Satu-satunya jalur resmi yang tersisa adalah *request-time check di Proxy*, tetapi `src/proxy.ts` sengaja Edge-only + bebas Prisma. **Diputuskan 2026-10-10: diterima apa adanya (opsi 1)** — lihat bagian 4.7. Koreksi review: opsi Proxy tidak wajib pindah ke runtime Node; Supabase PostgREST via `fetch` bersifat Edge-safe sehingga jalur `404` asli tetap tersedia kalau nanti dibutuhkan | `src/app/(storefront)/products/[slug]/page.tsx`, `docs/04_IMPLEMENTATION_PLAN.md` bagian 4.5 |
| 2026-10-09 | **Diperbaiki: `error.tsx` dan `global-error.tsx` ditambahkan** | Sebelumnya kegagalan render menampilkan halaman error bawaan Next.js, bukan pesan berbahasa Indonesia | `src/app/error.tsx` (boundary seluruh route) dan `src/app/global-error.tsx` (kegagalan root layout — menyediakan `<html>`/`<body>` + impor `globals.css` sendiri, karena keduanya tidak diwariskan). Keduanya memakai `retry` (bukan `reset`) karena kegagalannya berupa pengambilan data, dan mencatat detail hanya ke console | `src/app/error.tsx`, `src/app/global-error.tsx` |
| 2026-10-09 | **Diperbaiki: `(storefront)/loading.tsx` dihapus.** Berkas itu berisi skeleton grid produk di level grup, sehingga membungkus **setiap** halaman storefront — termasuk `/login`, `/register`, `/verify-phone` | Halaman non-katalog menampilkan kerangka produk saat memuat | Berkas dihapus. Halaman yang memang butuh loading UI sudah punya boundary `<Suspense>` masing-masing | - |
| 2026-10-09 | **Cacat ditemukan dan diperbaiki: penolakan akses Uploadthing mengembalikan `500`.** `new UploadThingError("...")` tanpa `code` dipetakan ke `INTERNAL_SERVER_ERROR` | Penolakan autentikasi tercatat sebagai kesalahan server, bukan `403` | `UploadThingError` diberi `code: "FORBIDDEN"` eksplisit. Uploadthing tidak menyediakan kode `401`, jadi `403` dipakai untuk "belum login" dan "bukan admin" | `src/lib/uploadthing/core.ts` |
| 2026-10-09 | **Pindah jalur: OTP sekarang memakai Twilio Verify, bukan Messaging API.** `src/lib/auth/otp.ts` ditulis ulang; `deliverOtp`, `toWhatsappAddress()`, dan dukungan `TWILIO_CONTENT_SID` dihapus seluruhnya | Menutup rangkaian kebuntuan sebelumnya sekaligus. Kode OTP kini dibuat dan diperiksa server Twilio (`client.verify.v2`), jadi tidak ada template yang harus dibuat atau disetujui, dan tidak ada aturan "pesan pertama" yang bisa menolak pengiriman. Redis tidak lagi menyimpan kode, hanya SID sesi (TTL 5 menit, karena default Verify 10 menit) | Verify dipilih karena Messaging API memang jalur mati di akun Trial: WhatsApp menuntut Content Template (`400 21654`), API Content Template diblokir (`20003`), dan SMS butuh nomor pengirim yang belum dimiliki. `TWILIO_PHONE_NUMBER`, `TWILIO_WHATSAPP_FROM`, dan `TWILIO_CONTENT_SID` kini **tidak dibaca kode mana pun**; `.env.example` sudah menandainya legacy | `src/lib/auth/otp.ts`, `.env.example`, `docs/06_SETUP_KREDENSIAL.md` bagian 4 |
| 2026-10-09 | **Riwayat, tidak lagi berlaku: penolakan `400 ContentSid Required` (21654)** beserta diagnostik panjang di belakangnya (alamat `whatsapp:` ganda, nomor sandbox `+14155238886` yang salah, `POST` REST langsung untuk memisahkan salah kode dari salah akun) | Dulu: AC-AUTH-01-01/02 tidak dapat dibuktikan | Tidak relevan setelah pindah ke Verify. Dipertahankan sebagai riwayat supaya tidak ada yang mengulang diagnosis yang sama | - |
| 2026-10-09 | **Jebakan Twilio yang masih berlaku kalau suatu saat kembali ke Messaging API** (mis. notifikasi pesanan di PH-05): WhatsApp hanya mengizinkan teks bebas di dalam jendela 24 jam setelah pengguna mengirim pesan lebih dulu, dan Twilio punya **dua jenis template yang tidak kompatibel** — *Content Template* bisa dikirim lewat `ContentSid`, template di area *WhatsApp Templates* tidak | Bisa membuat orang mengejar template yang salah | Dicatat di `docs/06_SETUP_KREDENSIAL.md` bagian 4 dan section 11 | `docs/06_SETUP_KREDENSIAL.md` |
| 2026-10-09 | **Twilio mengaktifkan SMS geo permission untuk Indonesia** (email notifikasi "Fraud and Security Team", perubahan tercatat 2026-10-08 20:39 UTC-7, `Source IP: 127.0.0.1`) | Tidak ada — ini prasyarat yang memang dibutuhkan untuk mengirim SMS ke Indonesia, bukan penghambat | **Tidak membuka blokir OTP, dan ternyata tidak dibutuhkan.** Geo permission mengatur pengiriman **SMS**, sedangkan OTP lewat Twilio Verify. Pengujian setelahnya membuktikan OTP terkirim tanpa menyentuh pengaturan ini. Pemeriksaan akun (read-only) saat itu: tipe `Trial`, 0 nomor masuk, **0 verified caller ID**, 0 messaging service, Content Template API masih `20003` — dan kekosongan daftar verified caller ID itu **tidak** menghalangi pengiriman ke nomor pendaftaran (lihat bagian 4.5). Catatan keamanan: perubahan tercatat dari `Source IP: 127.0.0.1`, yang tidak mungkin berasal dari browser Console biasa — perlu dipastikan asalnya | - |
| 2026-10-09 | **AC-AUTH-01-01/02 berubah dari "Terblokir (sisi penyedia)" menjadi Lulus.** Uji nyata dijalankan ke `+6285813386371`: `POST /api/otp/send` → `200` dan SMS benar-benar diterima (pengirim tampil `TWVerify`); `POST /api/otp/verify` → `200 {"verified":true}` dua kali dengan kode berbeda (`739117`, `978711`), membuktikan resend menghasilkan kode baru. Cabang gagal ikut terbukti: `410 OTP_EXPIRED`, `400 OTP_INVALID`, `429 RATE_LIMITED` | Status AC sebelumnya keliru. Kekosongan `OutgoingCallerIds` (0 nomor) **bukan** bukti pengiriman akan gagal — nomor pendaftaran akun tetap bisa menerima walau tidak muncul di daftar itu | Dinyatakan **Lulus**; status "Terblokir" dicabut dari bagian 4.4, 4.5, 4.6, dan 11. Catatan Verified Caller ID tetap dipertahankan, tetapi hanya berlaku untuk nomor uji selain nomor pendaftaran | bagian 4.5, `docs/06_SETUP_KREDENSIAL.md` bagian 4 |
| 2026-10-09 | Belum ada repository git | `git grep` untuk pemeriksaan rahasia tidak dapat dijalankan; tidak ada commit sebagai bukti versi | Pemeriksaan diganti `grep` pada working directory. Perlu inisialisasi git sebelum PH-02 | - |
| 2026-10-10 | **Cacat ditemukan dan diperbaiki: `export const instant = false` pada `src/app/admin/layout.tsx` tidak mencegah galat validasi instant di halaman anak.** Membuka `/admin/brands` memunculkan *Next.js encountered uncached data during prerendering or a navigation*; `/admin/products` memunculkan varian *URL data* (`searchParams` di luar `<Suspense>`); `/admin` (halaman redirect) memunculkan *Could not validate `instant` because an error prevented the target segment from rendering* | Halaman admin tidak dirender bersih; overlay galat muncul saat navigasi, padahal status HTTP tetap `200` sehingga luput dari verifikasi berbasis status kode | Penanda `instant = false` **ditambahkan di masing-masing `page.tsx`** yang membaca data atau URL di luar `<Suspense>`: `admin/brands`, `admin/categories`, `admin/products`, `admin/products/new`, `admin/products/[id]/edit`, dan `admin/page.tsx` (redirect). Verifikasi: sesi admin nyata (`identifier` + password) lalu sapuan sebelas rute → semua `200`/`307` tanpa galat di log dev; `pnpm lint` dan `pnpm build` exit 0 | `src/app/admin/**/page.tsx` |
| 2026-10-10 | Password admin di-reset. `SEED_ADMIN_PASSWORD` sudah diisi di `.env.local`, tetapi `pnpm db:seed` mencetak *Admin sudah ada* dan tidak menyentuh akun lama, sehingga password acak dari seed pertama tetap berlaku dan login gagal (`CredentialsSignin`) | Akun admin tidak dapat dipakai walau variabel sudah diisi | Akun admin lama dihapus lewat skrip sekali pakai (`prisma/tmp-reset-admin.ts`, dihapus setelah dipakai — model `User` tidak punya relasi sehingga tidak ada data lain yang ikut terhapus), lalu `pnpm db:seed` membuat ulang akun dengan password dari env. Verifikasi: `POST /api/auth/callback/credentials` → `302` ke `/admin/brands`. Catatan: field kredensial bernama `identifier`, bukan `email` | `prisma/seed.ts` |
| 2026-10-10 | **Desain keranjang PH-02 (keputusan).** Customer memakai tabel `CartItem` di PostgreSQL (snapshot `price` saat item masuk, unique `userId` + `variantId`). Guest memakai Redis (`cart:guest:{uuid}`, TTL 30 hari) + cookie `flexstore_cart` (httpOnly, `SameSite=lax`, `Secure` di produksi) | Guest tidak butuh akun untuk berbelanja; customer dapat riwayat yang bertahan lintas sesi | Nilai cookie divalidasi harus UUID sebelum dipakai sebagai kunci Redis. Identitas selalu diambil dari sesi/cookie, **tidak pernah** dari body request | `prisma/schema.prisma`, `src/lib/cart/` |
| 2026-10-10 | **Ongkir memakai RajaOngkir Komerce v1** (`https://rajaongkir.komerce.id`), bukan Biteship | Hanya satu integrasi yang perlu dipelihara (YAGNI); PRD menyebut keduanya sebagai opsi | Biteship di-skip. Kunci dikirim sebagai header `key`. Base URL ditulis tetap di kode (OWASP A10 SSRF) | `src/lib/shipping/client.ts`, `docs/06` bagian 6 |
| 2026-10-10 | **Cacat ditemukan dan diperbaiki: endpoint ongkir salah.** Kode memakai `POST /api/v1/calculate/district/domestic-cost` | API menjawab `422 Origin or Destination not found` untuk setiap ID hasil pencarian, sehingga ongkir asli tidak pernah muncul | Endpoint `district` hanya menerima ID tingkat **district** dari kaskade provinsi/kota/district, sedangkan alur kita memakai pencarian langsung `destination/domestic-destination` yang mengembalikan ID tingkat **kecamatan**. Diganti ke `POST /api/v1/calculate/domestic-cost` | `200 source:"api"` dengan 9 opsi kurir asli |
| 2026-10-10 | **Cacat ditemukan dan diperbaiki: galat prerender `crypto.getRandomValues()` di `/products` dan `/cart`.** Next.js 16 (`cacheComponents`) menolak nilai acak yang muncul saat prerender | Overlay galat muncul saat navigasi walau status HTTP tetap `200`, jadi luput dari verifikasi berbasis status | NextAuth `auth()` memakai `crypto.getRandomValues()`. `CartBadge` dan `CartPage` ditandai request-time dengan `await connection()` (pola sama seperti `HeaderUserMenu`) | 0 galat di log dev dan build |
| 2026-10-10 | Berat paket dihitung seragam: `total kuantitas x SHIPPING_WEIGHT_PER_ITEM_GRAM` (default 1000 gram) | Ongkir belum memperhitungkan berat per produk | Skema produk belum punya kolom berat; ditinjau kembali saat dibutuhkan. Dicatat sebagai pertanyaan terbuka di Spesifikasi SHIP-01 | `src/lib/shipping/index.ts`, `docs/03` SHIP-01 bagian 13 |
| 2026-10-10 | **Urutan validasi route `/api/shipping` diperbaiki.** Sebelumnya kewajiban `destinationId` diperiksa sebelum keranjang kosong | Keranjang kosong + tanpa tujuan menjawab `VALIDATION_ERROR`, padahal precondition yang gagal adalah keranjang kosong | Cek identitas/keranjang kosong lebih dulu, baru kewajiban `destinationId` | `400 CART_EMPTY` vs `400 VALIDATION_ERROR` sesuai kondisi |
| 2026-10-10 | **Kredensial ongkir di-skip sesuai instruksi user** ("jika ada masalah kredensial yang diperlukan, skip dulu, dan lanjutkan coding sampai selesai"). `RAJAONGKIR_API_KEY` ternyata sudah terisi di `.env.local` (32 karakter); `SHIPPING_ORIGIN_DISTRICT_ID` belum | Mode API tidak bisa dipakai apa adanya | Coding tetap lanjut; fallback tarif flat Rp10.000 dipakai. Mode API tetap **dibuktikan** dengan origin sementara (`17590`) lewat process env dev server — **tidak** ditulis ke `.env.local` | `200 source:"api"` (9 opsi), `200 source:"fallback"` (Rp10.000) |
| 2026-10-10 | Data uji QA dibersihkan setelah verifikasi | Akun `qa.cart.*@example.com` beserta baris `cart_items`-nya tertinggal di database | Dihapus lewat skrip sekali pakai (`_cleanup-qa.ts`, dihapus setelah dipakai): putaran pertama `found: 6, deleted: 6`, putaran kedua `found: 1, deleted: 1` | Database kembali hanya berisi data seed |
| 2026-10-10 | **Tinjauan ulang kode setelah laporan review.** Tiga cacat ditemukan di luar cakupan verifikasi otomatis: (a) `PATCH /api/cart` customer memakai `prisma.cartItem.update` → Prisma `P2025` → `500` saat varian tidak ada di keranjang; (b) 4 route API baru tidak punya penangkap galat sehingga kegagalan Prisma/Redis bocor sebagai `500` mentah; (c) `POST /api/cart/sync` memakai nilai cookie tanpa uji UUID, berbeda dari `getCartIdentity` | (a) pengguna melihat pesan generik untuk kasus yang seharusnya `404`; (b) bentuk respons galat tidak seragam `{ error, message }`; (c) klaim A07 di dokumen tidak akurat | (a) `updateMany` + cek `count === 0` → `VARIANT_NOT_FOUND`; (b) helper `withRouteErrors` di `src/lib/utils/api.ts`; (c) ekspor `isGuestCartId` dari `src/lib/cart/session.ts` dan pakai di kedua jalur. Saat menambahkan wrapper, sinyal `NEXT_PRERENDER_INTERRUPTED` tertangkap keliru → ditambah `isNextControlFlowError` yang melempar ulang `digest` `NEXT_*`/`DYNAMIC_SERVER_USAGE` | Uji regresi C08 (`404`) dan C09 (`200`); `pnpm lint` exit 0; `pnpm build` exit 0 (27 rute, 0 baris `unhandled route error`); total 32 PASS / 0 FAIL |
| 2026-10-10 | **Kekurangan yang sengaja belum ditangani** (dicatat, tidak memblokir PH-02): lost update keranjang guest (baca-ubah-tulis JSON tanpa lock); TOCTOU stok (reservasi atomik di PH-03); snapshot harga campur saat merge; tanpa rate limit pada proxy ongkir berbayar; item non-aktif masih dihitung di subtotal/berat; `getCartItemCount` memuat keranjang penuh untuk badge; skrip verifikasi masih di luar repo | Kualitas dan ketahanan, bukan fungsi inti | Ditunda sesuai keputusan user: perbaiki A1-A3 sekarang, sisanya dicatat | Terdaftar di bagian 5.5 "Belum ditangani" dan bagian 11 |
| 2026-10-10 | **Origin ongkir diisi.** User memilih Cilandak, Jakarta Selatan sebagai lokasi asal toko | `SHIPPING_ORIGIN_DISTRICT_ID` kosong → `isShippingApiConfigured()` false → semua hitungan memakai fallback Rp10.000 | Cari ID lewat `GET /api/shipping/cities?search=cilandak` → pilih `17590` (CILANDAK BARAT, CILANDAK, JAKARTA SELATAN), tulis ke `.env.local` | `POST /api/shipping` → `200 source:"api"` dengan 9 opsi kurir (SiCepat HALU Rp14.000, dll); `/cart` menampilkan kotak pencarian tujuan dan bukan catatan tarif flat. Fallback tetap diuji lewat tujuan tak dikenal (`999999999` → `200 source:"fallback"`) |
| 2026-10-10 | **Berat paket dipindah ke data produk dan disembunyikan dari respons.** User: berat harus mengikuti barang aktual, tidak boleh ditentukan pengguna, dan tidak perlu dilihat customer/guest; lalu "weightgram ini tidak terpakai ... jika iya, hapus" | Sebelumnya berat = total kuantitas x 1000 gram (asumsi seragam, `SHIPPING_WEIGHT_PER_ITEM_GRAM`); tidak ada kolom berat di skema maupun input di form produk; respons `POST /api/shipping` memuat `weightGram` | Tambah `ProductVariant.weightGram` (Int, default 1000) + migrasi `20261009221836_add_variant_weight`; input "Berat (gram)" di form produk admin; `POST /api/shipping` menghitung jumlah (kuantitas x berat varian); baris "Berat paket" dihapus dari ringkasan keranjang; `weightGram` dihapus dari bentuk respons (`ShippingQuote` kini hanya `source`, `cached`, `options`) tetapi tetap dipakai server sebagai kunci cache dan parameter RajaOngkir | 8 pemeriksaan lulus: respons hanya `source,cached,options`; keranjang 400 g dan 850 g menghasilkan kunci cache berbeda (`cached: false` keduanya); keranjang sama diulang `cached: true`; body `weight`/`weightGram` dari klien diabaikan (kunci tetap 850 g -> `cached: true`); `/cart` tidak memuat "Berat paket"/`kg`; form admin punya input berat |
| 2026-10-10 | **Pemilihan item checkout ditunda ke PH-03, lalu DIKERJAKAN di PH-03.** User: "saya tidak ingin seluruh produk di keranjang langsung di checkout, berikan checkbox" lalu "checkbox untuk ph-03 saja" | Checkout belum ada saat itu | Selesai: checkbox per baris di `/cart` (`CartView` + `CartItemRow`), default kosong, state React saja (tidak disimpan), tanpa "pilih semua"; ongkir dan subtotal hanya dari item tercentang; tombol "Checkout (n item)" mengirim `?variantIds=...` | `src/components/cart/{CartView,CartItemRow,CartSummary}.tsx`, `src/app/(storefront)/cart/page.tsx`; T01, T02 |
| 2026-10-10 | **Keputusan cakupan PH-03 (lihat bagian 6.2).** Pesanan dibuat tanpa baris `Payment` (PH-04); input voucher disembunyikan dan `discount` tetap 0 (PH-05); AC email (`AC-ORDER-01-05`) dipindah ke PH-05; alamat disimpan per pesanan sebagai JSON | Cakupan PH-03 menyempit, tetapi tidak ada AC yang hilang — hanya dipindah ke fase yang memilikinya | Diterapkan di kode dan spesifikasi | `docs/03` ORDER-01 catatan cakupan; bagian 6.2 |
| 2026-10-10 | **Pelepasan reservasi stok memakai mekanisme malas (lazy), bukan penjadwal.** User: "gunakan yang paling optimal" | Vercel Cron paket Hobby hanya berjalan harian, tidak cocok untuk batas 10 menit; penjadwal juga menambah infrastruktur | `releaseExpiredReservations()` dipanggil saat pesanan dibuat dan saat pesanan dibaca (riwayat, detail, lacak). Klaim baris memakai `updateMany` bersyarat sehingga idempoten walau dua permintaan bersamaan | `src/lib/orders/reservations.ts`; T19, T20 |
| 2026-10-10 | **Stok dikurangi saat pesanan DIBUAT (reservasi), bukan saat pembayaran sukses.** Prisma tidak bisa membandingkan dua kolom di `where` (aturan "tanpa raw SQL"), jadi satu-satunya cara atomik yang tersedia adalah `stock: { decrement }` dengan syarat `stock >= qty` | PH-04 tidak lagi mengurangi stok saat pembayaran sukses — cukup mengubah status. Selaras PRD 5.1 (stok tereservasi sejak order dibuat) | `updateMany({ where: { id, stock: { gte: qty } }, data: { stock: { decrement: qty } } })` + cek `count === 0` di dalam `$transaction` | `src/lib/orders/mutations.ts`; T05, T17, T18 |
| 2026-10-10 | **Penanda nomor HP terverifikasi disimpan di Redis, bukan cookie.** Guest tidak boleh bisa memalsukan "sudah OTP" | Checkout guest butuh bukti verifikasi tanpa memaksa login | `phone-verified:{phone}` (TTL 1 jam) di-set saat `POST /api/otp/verify` sukses; `POST /api/orders/create` menolak guest tanpa penanda (`403 PHONE_NOT_VERIFIED`) | `src/lib/auth/otp.ts`; T03, T04 |
| 2026-10-10 | **Produk yang pernah dipesan tidak bisa dihapus.** FK `OrderItem.variantId` memakai `onDelete: Restrict`; penghapusan produk memakai cascade ke varian sehingga tertahan | Admin melihat galat yang jelas, bukan pesan "Data terkait tidak ditemukan" yang menyesatkan | Handler `DELETE /api/admin/products/[id]` menangkap `P2003` khusus → `409 PRODUCT_IN_USE` "Produk tidak bisa dihapus karena sudah pernah dipesan" | `src/app/api/admin/products/[id]/route.ts`; T21 |
| 2026-10-10 | **KOREKSI (lihat bagian 6.8): kesimpulan lama di baris ini salah dan justru menutupi bug.** Dulu dicatat "seeder menulis `1` (angka), aplikasi menulis `"1"` (string JSON)". Kenyataannya `redis.set(key, "1")` lewat SDK menulis byte `1` mentah, dan `get` men-JSON-parse-nya kembali menjadi **number 1**, sehingga `value === "1"` selalu `false` — setiap guest ditolak `403 PHONE_NOT_VERIFIED`. Seeder uji yang menulis `JSON.stringify("1")` justru menyimpan string `"1"` dan hanya bentuk itu yang lolos, sehingga jalur aplikasi asli tidak pernah teruji | Uji `T04` lolos secara palsu; bug baru ketahuan dari laporan pengguna | Kode diperbaiki: penanda diganti string non-JSON `"verified"` dan `isPhoneVerified` membandingkan `String(value) === "verified"`; `markPhoneVerified` tidak lagi menelan galat | `src/lib/auth/otp.ts`; bagian 6.8 |
| 2026-10-10 | **Jalur Xendit PH-04 dipilih: Invoice API v2 (hosted page).** PAY-01 Draft menyebut tiga metode per-channel (QRIS/VA/e-wallet) lewat satu endpoint | Rancangan spesifikasi bertabrakan dengan implementasi | Invoice API dipilih (KISS); pemilihan per-channel ditunda dan dicatat di pertanyaan terbuka PAY-01. Spesifikasi PAY-01/PAY-02 direvisi (v1.3) | `docs/03` PAY-01/PAY-02 |
| 2026-10-10 | **Masa bayar = masa reservasi stok = `XENDIT_INVOICE_DURATION` (default 900 detik).** User: "bisa 30 menit 40 menit tanpa harus buka code lagi?" | SDD 4.4 (10 menit) dan PAY-01 (24 jam) bertabrakan; dua nilai terpisah berisiko oversell | Satu nilai dari env; `stockReservedUntil` diselaraskan ke `expiry_date` invoice saat pembayaran dibuat. Ubah `.env.local` + restart, tanpa ubah kode | `src/lib/payments/config.ts`, `src/lib/orders/mutations.ts` |
| 2026-10-10 | **Webhook PAID tidak mengurangi stok.** Selaras keputusan PH-03 (stok dipotong saat pesanan dibuat) | SDD 4.4/4.5 dan PAY-02 Draft masih menulis "deduct stock saat payment success" | Kode tidak mengurangi stok; SDD 4.4/4.5/6.3 direvisi. Webhook EXPIRED membatalkan pesanan + mengembalikan stok lewat `cancelOrderAndReleaseStock` | `src/lib/payments/mutations.ts`, `src/lib/orders/reservations.ts` |
| 2026-10-10 | **Idempotensi webhook memakai klaim baris `Payment` di database, bukan penanda Redis** (PAY-02 Draft menyebut Redis 24 jam) | Menambah state Redis untuk hal yang bisa diselesaikan transaksi database | `updateMany({ where: { externalId, status: "PENDING" }, ... })`; `count === 0` -> `ALREADY_PROCESSED`. Redis tidak dipakai di MOD-PAY | `src/lib/payments/mutations.ts` |
| 2026-10-10 | **Nama token webhook kanonik: `XENDIT_WEBHOOK_TOKEN`.** `docs/04` masih menulis `XENDIT_CALLBACK_TOKEN` | Dua nama untuk hal yang sama membingungkan | Kode + `.env.example` memakai `XENDIT_WEBHOOK_TOKEN`; dokumen dibetulkan | `.env.example`, `src/lib/payments/config.ts` |
| 2026-10-10 | **Otorisasi buat pembayaran untuk guest memakai nomor HP pesanan** (`Order.guestPhone`), bukan penanda OTP | Guest tidak punya sesi; model kepercayaan lacak publik (ORDER-04) sudah memakai nomor HP | `403` bila nomor tidak cocok / tidak dikirim. Bukti V20-V22 | `src/lib/payments/mutations.ts` |
| 2026-10-10 | **`404 PAYMENT_NOT_FOUND` pada webhook membuat Xendit mengirim ulang.** Dibiarkan sesuai tabel kondisi gagal PAY-02 | Retry berulang untuk pembayaran tak dikenal | Dicatat di pertanyaan terbuka PAY-02; bisa diubah ke `200` bila mengganggu | `src/app/api/webhooks/xendit/route.ts` |
| 2026-10-10 | **Revisi pasca-persetujuan PH-03: bug OTP guest + redesign urutan alamat.** User: "sebagai guest ... sudah melewati [OTP], dan somehow ingin membuat pesanan masih muncul 'Verifikasi nomor HP terlebih dahulu'"; lalu "memilih kecamatan ... data kota, provinsi, kode pos terisi otomatis, kecuali alamat lengkap ... posisi input juga disesuaikan" | (1) Guest tidak bisa checkout sama sekali walau OTP sukses; (2) alamat memaksa mengetik kota/provinsi/kode pos manual padahal ongkir sudah ditentukan `destinationId` | (1) Perbaiki penanda Redis (`"verified"`), `markPhoneVerified` melempar galat, dan form checkout mereset ke langkah OTP saat `403 PHONE_NOT_VERIFIED`; (2) `ShippingDestination` diperluas (provinsi/kota/kecamatan/kelurahan/kode pos dari RajaOngkir), picker dipecah jadi `DestinationPicker` + `CourierPicker`, urutan form: penerima → kecamatan → kota/provinsi/kode pos (otomatis, read-only) → alamat lengkap | `src/lib/auth/otp.ts`, `src/lib/shipping/client.ts`, `src/components/shipping/{types,DestinationPicker,CourierPicker}.tsx`, `src/components/checkout/CheckoutForm.tsx`, `src/components/cart/{CartSummary,CartView}.tsx`; bagian 6.8 |
| 2026-10-10 | **MOD-CUST (alamat tersimpan, maks 5, PRD 5.8) akhirnya diberi rumah: PH-07 Customer Management.** Selama ini fitur ini tercatat "belum punya fase" di tiga tempat — `docs/03` ORDER-01 bagian 12, ORDER-02 bagian 12, dan pertanyaan terbuka ORDER-02 — sementara `docs/02` bagian 899 sudah menuliskan alur target "checkout (select saved address)" | Satu fitur wajib PRD tanpa fase; alamat terpaksa diketik ulang tiap checkout dan hanya tersimpan sebagai `shippingAddress` (JSON) per pesanan | Ditempatkan di **PH-07 terpisah**, bukan disisipkan ke PH-06 yang sudah memuat REPORT-01/CONFIG-01/SHIP-02/ORDER-05/06. Prasyaratnya hanya PH-03, jadi fase ini bisa dikerjakan kapan saja setelah PH-03 disetujui tanpa menunggu PH-04..PH-06. Rincian dan daftar task: bagian 12 | `docs/04` bagian 3 dan 12; `docs/03` ORDER-01/ORDER-02 bagian 12 |
| 2026-10-10 | **Keputusan desain awal PH-07** (dasar rancangan, bisa ditinjau ulang saat spesifikasi ditulis): (a) alamat tersimpan hanya untuk **customer login**, guest tetap mengetik per pesanan; (b) batas maksimal 5 alamat ditegakkan di **server** (Zod + pengecekan jumlah baris), bukan hanya di UI; (c) menyimpan alamat **tidak** mengubah pesanan lama — `Order.shippingAddress` tetap snapshot JSON; (d) baris `Address` menyimpan `destinationId` kecamatan supaya ongkir dihitung ulang tanpa pencarian RajaOngkir lagi | (a) sesuai PRD 5.8 yang hanya mengatur customer; (b) mencegah spam/data fiktif sesuai tujuan PRD; (c) riwayat pesanan tidak ikut berubah saat alamat diedit/dihapus; (d) mengulang hasil kerja PH-02/PH-03 | Disetujui sebagai dasar TASK-68..72 | PRD 5.8, SDD 4.8, SDD 6.2 |
| 2026-10-10 | **Halaman `/verify-phone` dihapus.** Sejak PH-03 verifikasi nomor HP guest dilakukan langsung di langkah OTP `/checkout` memakai komponen yang sama (`OtpVerificationForm`); halaman mandiri itu tidak lagi punya tautan masuk dan menjadi rute mati | Dua tempat verifikasi membingungkan, satu di antaranya tidak terjangkau | Halaman dihapus; `OtpVerificationForm` tetap satu-satunya sumber dan komentarnya diperbarui. Referensi lama di bagian 4.5/4.6, `README.md`, dan `docs/06_SETUP_KREDENSIAL.md` dirapikan | `src/app/(storefront)/verify-phone/`, `src/components/auth/OtpVerificationForm.tsx`, `README.md`, `docs/06_SETUP_KREDENSIAL.md` |
| 2026-10-10 | **PH-05 dimulai tanpa menunggu jawaban `EMAIL_FROM` dan format invoice.** User: "lanjutkan" | Dua pertanyaan terbuka (alamat pengirim Resend, `@react-pdf/renderer` vs HTML) tidak terjawab | Keputusan sementara yang aman: (a) `EMAIL_FROM` dibaca dari env, default `onboarding@resend.dev`; (b) invoice memakai halaman HTML siap-cetak (tanpa dependensi PDF). Keduanya bisa diubah tanpa menyentuh alur inti | `.env.example`, `src/lib/notifications/config.ts`, `src/app/(storefront)/orders/[id]/invoice/page.tsx` |
| 2026-10-10 | **Deviasi dari SDD 4.10: invoice tidak memakai `@react-pdf/renderer`.** SDD menulis invoice dihasilkan sebagai PDF di server | Menambah dependensi berat dan berisiko dengan React 19 | Invoice dirender sebagai halaman HTML siap-cetak (`/orders/[id]/invoice` + `window.print()`), pengguna menyimpan PDF lewat dialog cetak browser. KISS, tanpa dependensi baru | SDD 4.10 perlu direvisi saat dokumentasi dirapikan |
| 2026-10-10 | **Stacking voucher = default menolak.** PRD 5.4 menyebut kompatibilitas per pasangan tetapi tidak menentukan nilai bawaan | Menentukan perilaku pasangan voucher yang belum diatur admin | Pasangan tanpa baris `VoucherCompatibility` **tidak** boleh digabung; admin mencentang pasangan yang boleh lewat form voucher. Explicit opt-in (seller-oriented) | `src/lib/vouchers/eligibility.ts`, `src/components/admin/VoucherForm.tsx` |
| 2026-10-10 | **Kuota voucher dijaga di dalam transaksi pesanan.** Pemeriksaan kuota saat resolusi saja bisa dilewati oleh dua pesanan berbarengan | Risiko kuota terlewati (race) | Penambahan `usageCount` memakai `updateMany` bersyarat `usageCount < usageLimit`; `count === 0` melempar `INVALID_VOUCHER` dan membatalkan seluruh transaksi | `src/lib/orders/mutations.ts` |
| 2026-10-10 | **KOREKSI: role selain customer/guest bisa berbelanja.** `getCartIdentity` menerima sesi role apa pun, sehingga Store Admin mendapat keranjang database, bisa menambah item, menghitung ongkir, memakai voucher, dan membuat pesanan; `requireCustomerPage` juga mengizinkan role apa pun. Ketahuan dari laporan pengguna | Pelanggaran A01: batas peran Guest/Customer tidak ditegakkan di jalur belanja | Diganti `getCartAccess` yang mengembalikan `ok:false` untuk role non-customer (tidak jatuh ke keranjang guest); semua API belanja (`/api/cart`, `/api/cart/sync`, `/api/shipping`, `/api/vouchers/validate`, `/api/orders/create`) menjawab `403 FORBIDDEN` **sebelum** validasi body; halaman `/cart`, `/checkout`, `/orders`, `/orders/[id]`, `/orders/[id]/invoice` mengalihkan admin ke `/admin`; badge keranjang disembunyikan untuk non-customer | `src/lib/cart/session.ts`, `src/lib/auth/session.ts`, `src/app/api/{cart,cart/sync,shipping,vouchers/validate,orders/create}/route.ts`, `src/app/(storefront)/{cart,checkout,orders}/`, `src/components/layout/CartBadge.tsx`; uji peran 18 PASS/0 FAIL |
| 2026-10-10 | **Cakupan produk voucher ditunda (PRD 5.4 butir 1-3).** PRD menyebut tiap voucher bisa diatur "produk eligible", "produk yang dikecualikan", dan "kategori"; tiga butir itu tidak pernah turun ke spesifikasi fitur dan tidak masuk desain PH-05 | Bagian 8.1 menulis "Advanced voucher rules (future)" tanpa merinci, sehingga tidak ada task yang meminta penyaringan produk; ketahuan dari pertanyaan user "apakah sudah tertulis bahwa voucher bisa diatur ke produk mana saja" | Keputusan sementara: voucher berlaku untuk **seluruh produk di keranjang**; admin mengatur besaran, periode, kuota, batas per HP, maksimal potongan, dan kompatibilitas (5 dari 8 butir PRD 5.4 sudah jalan), sedangkan jangkauan produk/kategori dijadwalkan ke **PH-06 — Polish MVP (Reports + Config + Advanced), bagian 9**. PH-06 dipilih karena judulnya sudah memuat "Advanced" (sesuai redaksi bagian 8.1 "Advanced voucher rules (future)") dan prasyaratnya PH-05, sedangkan PH-07 sengaja tidak dipakai supaya tetap murni MOD-CUST dengan prasyarat PH-03. Butuh relasi baru `VoucherProduct`/`VoucherCategory`, perubahan `eligibility.ts`, dan form admin | `docs/01_PRD.md` 5.4, `docs/04` 8.1 dan 9.1, `prisma/schema.prisma` (model `Voucher`), `src/lib/vouchers/calculation.ts` |
| 2026-10-10 | **Audit PRD vs peta fase: 13 kebutuhan PRD belum punya task.** Dipicu pertanyaan user "apakah masih ada detail task yang belum ditulis pada dokumentasi implementasi task". **Tujuh tanpa rumah sama sekali:** admin order management (PRD 2.3/3.1.K/4.4 — admin hanya punya halaman Produk/Kategori/Brand/Voucher, tidak ada `/admin/orders`, dan tidak ada pemilik transisi pesanan `SHIPPED`/`COMPLETED`); re-order (PRD 2.2 — `docs/03` ORDER-01/02 bagian 12 mengecualikannya tanpa rumah pengganti); set password link (PRD 2.1/3.1.I/5.7 — `guestEmail` tersimpan sejak PH-03 tapi tidak ada alurnya); password reset (PRD 4.1); template alasan penolakan pembatalan (PRD 3.1.G/4.12/5.5); pickup (PRD 3.1.F/4.7); preferensi notifikasi customer (PRD 4.8). **Lima parsial/ambigu:** filter katalog (PRD 3.1.A — baru `search` + paginasi di `products/page.tsx` dan `listProductsSchema`); email notifikasi (PRD 3.1.I — 2 dari 6 jenis jalan: order created, payment success); size chart (PRD 3.1.A/7.4 — `ProductImage` tanpa peran gambar); cakupan REPORT-01 (PRD 4.11 menyebut 5 laporan, REPORT-01 hanya "Sales Report"); dashboard admin (PRD 3.1.K — `/admin` masih redirect) | Kebutuhan PRD tersebar tanpa pemilik task akan hilang dari rencana — pola yang sama dengan alamat tersimpan dan cakupan voucher sebelum dicatat | **Penempatan disetujui user 2026-10-10:** PH-06 += ORDER-07 (admin order management), SHIP-03 (pickup), filter katalog (PROD-02 lanjutan), size chart (PROD-01 lanjutan), email shipped/cancel/refund (NOTIF-01 lanjutan), REPORT-01 diperluas 5 laporan PRD 4.11, template alasan masuk CONFIG-01, dashboard admin ditangani saat PH-06 dirinci; PH-07 += re-order (ORDER-03 lanjutan), AUTH-04 (set password), AUTH-05 (password reset), CUST-02 (preferensi notifikasi) — prasyarat PH-07 berubah jadi PH-03 + PH-05 (fitur email). Set password menimbulkan pertanyaan desain (apakah pesanan guest lama ikut terikat ke akun baru) — dijawab saat spesifikasi PH-07 ditulis | `docs/04` bagian 3, 9.1, 12.1-12.3; `docs/01_PRD.md` 2.1, 2.2, 2.3, 3.1.A/F/G/I/K, 4.1, 4.4, 4.8, 4.11, 4.12, 5.5, 5.7 |
| 2026-10-10 | **Site Admin dipastikan ADA (keputusan user).** Audit menandai PRD kontradiktif: bagian 2.3 menulis "NO platform-level config (single-store MVP, no Site Admin role)" padahal bagian 1 (tujuan: memisahkan Site Admin vs Store Admin), 3.1.K (Site Admin features), 4.1 (daftar role eksplisit: Guest, Customer, Store Admin, Site Admin), dan kriteria sukses #10 meminta Site Admin mengonfigurasi payment gateway dan shipping provider; SDD 587 bahkan sudah mendesain `SITE_ADMIN` di enum role sejak awal | Autentikasi hanya punya role `STORE_ADMIN`; konfigurasi Xendit/RajaOngkir hanya lewat env; tidak ada manajemen akun Store Admin; kriteria sukses #10 tidak mungkin lulus tanpa fase ini | User: "site admin jelas ada sesuai prd awal". Baris PRD 2.3 "no Site Admin role" dikesampingkan — yang berlaku bagian 1/3.1.K/kriteria #10. Fase baru **PH-08 — Site Admin (Platform Configuration)** dibuat (bagian 13): SITE-01 platform settings, SITE-02 konfigurasi payment gateway, SITE-03 konfigurasi shipping provider, SITE-04 manajemen akun Store Admin. **PRD sudah direvisi 2026-10-10 (v1.1):** baris "3 role utama" (bagian 2) jadi 4 role, baris "no Site Admin role" (2.3) dicabut, bagian 2.4 Site Admin ditambah; `AGENTS.md` "3 roles only" dan matriks hak akses PROD-01 (`docs/03`) ikut dibetulkan. Catatan desain untuk PH-08: menyimpan kunci Xendit/RajaOngkir di database vs env adalah keputusan keamanan (A02) — dijawab saat fase dirinci | `docs/04` bagian 3 dan 13; `docs/01_PRD.md` 1, 2, 2.3, 2.4, 3.1.K, 4.1, 4.12, kriteria sukses #10; `docs/02_SDD.md` 587, 696; `AGENTS.md` |
| 2026-10-10 | **Redesign kartu katalog + tombol aksi cepat.** User: "redesign katalog produk seperti gambar tapi instead of nampilkan stock dan sold, ubah ke tombol keranjang dan beli"; lalu "5 produk ditemukan di sini, useless. hapus" | Kartu lama menampilkan badge stok, kategori, dan brand, tanpa aksi cepat. Baris "N produk ditemukan" dinilai tidak berguna | Kartu baru: gambar di tile abu (`p-3`, `rounded-lg`, `bg-muted`), nama (2 baris), harga, lalu tombol `Keranjang` (tambah ke keranjang) dan `Beli` (tambah lalu `router.push('/checkout?variantIds=...')`). Varian yang dipakai = varian pertama dengan stok > 0; tombol disabled "Stok habis" bila semua kosong. Badge stok/kategori/brand dan baris jumlah produk dihapus. Tombol disembunyikan untuk role non-customer (`canShop` dari `getCartAccess()`), konsisten dengan gerbang peran 2026-10-10 | `src/components/products/{ProductCard,ProductCardActions,ProductGrid}.tsx`, `src/app/(storefront)/products/page.tsx`, `src/app/(storefront)/page.tsx` |
| 2026-10-10 | **Filter katalog (PROD-02 lanjutan) ditarik dari PH-06 ke sekarang.** User: "pada katalog hanya ada fitur search, tanpa filter/sort? di prd harusnya ada" (PRD 3.1.A: filter by name, category, price range, sort) | PRD 3.1.A baru sebagian terpenuhi: `search` + paginasi jalan; kategori, kisaran harga, dan urutan belum ada. Audit 2026-10-10 sudah menaruh sisanya di PH-06 | User memilih "Implement sekarang". Ditambahkan: pil kategori (dari `Category`), filter kisaran harga, dan urutan (Terbaru/Harga termurah/Harga termahal/Nama A-Z) di `/products`; `catalogFilterSchema` (toleran, nilai rusak jatuh ke default) memvalidasi query string. `Product.minPrice` (Decimal, denormalisasi harga varian termurah — pola sama seperti `totalStock`) ditambah lewat migrasi `20261010140000_add_product_min_price` + backfill, karena Prisma 5.22 tidak mendukung `orderBy` agregat relasi (`_min` ditolak: "Unknown argument `_min`"). Urutan harga memakai `minPrice` untuk naik dan turun; `id` jadi pemecah seri. PH-06 kehilangan butir filter katalog (bagian 3, 9.1) | `src/lib/products/{validation,queries,mutations}.ts`, `src/components/products/{CategoryPills,CatalogFilters}.tsx`, `src/app/(storefront)/products/page.tsx`, `prisma/schema.prisma`, `prisma/seed.ts`, `prisma/migrations/20261010140000_add_product_min_price/`; `docs/03` PROD-02 |
| 2026-10-10 | **ORDER-08 — Tracking Pesanan Customer diberi rumah di PH-06 (menutup celah audit 13-kebutuhan).** User: "/track-order ... selain digunakan guest digunakan customer juga ... ketika tombol lacak pada order list ditekan akan mengarahkan ke detail tracking bukan ke track ordernya saja; track order customer akan menampilkan seluruh pesanan yang masih dalam perjalanan; untuk guest tetap seperti sekarang". Kebutuhan ini sebenarnya sudah dijanjikan PRD 2.2 ("Track shipping status", "Tracking order tanpa input data (langsung list order mereka)") dan PRD 3.1.H ("Customer: login langsung list order mereka (tanpa input data)"), tetapi tidak pernah turun ke spesifikasi/task: ORDER-04 didefinisikan guest-only dan tabel hak aksesnya menyuruh customer "disarankan pakai `/orders`"; ORDER-03 hanya daftar+detail; PH-06 tidak mencantumkan PRD 3.1.H di daftar referensinya; slot rute SDD bagian 5 (`track/[orderNumber]`, publik) tidak pernah dibangun — yang jalan hanya `/track-order` (form guest) | PRD 2.2/3.1.H tanpa pemilik task (pola yang sama dengan alamat tersimpan dan cakupan voucher sebelum dicatat); tombol "Lacak Pesanan" yang sudah dirender di `/orders` (placeholder, tanpa handler, 2026-10-10) tidak punya tujuan yang disepakati | **Ditempatkan di PH-06 sebagai ORDER-08 (MOD-ORDER)**, satu fase dengan SHIP-02 + ORDER-07 yang jadi sumber datanya (resi/posisi kurir). Perilaku yang disepakati: (a) `/track-order` jadi dua jalur — guest isi form nomor pesanan + nomor HP (ORDER-04, tidak berubah), customer login langsung lihat daftar seluruh pesanan dalam perjalanan tanpa input; (b) tombol "Lacak Pesanan" di `/orders` mengarah ke **detail tracking per pesanan**, bukan ke form; (c) detail tracking customer **session-scoped** (kepemilikan dari sesi, `404` generik — pola `/orders/[id]`), bukan rute publik per nomor pesanan tanpa bukti kepemilikan (nomor pesanan saja bocor keberadaan pesanan; ORDER-04 sengaja mewajibkan nomor + HP). Rute direncanakan: daftar in-transit di `/track-order` (mode customer), detail di `/orders/[id]/tracking`; slot lama SDD bagian 5 dibetulkan. Spesifikasi ORDER-08 ditulis saat PH-06 dimulai (pola ORDER-05/06); indeks fitur `docs/03`, pohon rute `docs/02` bagian 5, dan catatan ORDER-04/ORDER-03 sudah disinkronkan | `docs/01_PRD.md` 2.2/3.1.H, `docs/03` indeks fitur + ORDER-03 bagian 12 + ORDER-04 bagian 3 & 12, `docs/02` bagian 5, `docs/04` bagian 3 & 9.1, `src/components/orders/OrderListItem.tsx` (tombol placeholder) |
| 2026-10-10 | **Input nomor HP dihapus dari form registrasi (AUTH-02).** User: "di daftar akun, karena nomor hp itu opsional, better gausah ada inputnya gasi?". Jejak konsumen `User.phone` sebelum keputusan: prefill "Nomor HP penerima" di checkout (kenyamanan saja), login via nomor (`findUserByPhone`), batas voucher per-HP (`resolveBuyerPhone` → eligibility — cek hanya jalan kalau phone ada, dan phone akun tidak pernah diverifikasi), lacak publik (`findOrderForTracking` cocokkan `user.phone`). Field opsional justru mengundang data palsu — nomor palsu di akun bisa memblokir voucher per-HP milik pemilik nomor asli | Field opsional = friksi + data sampah; 3 dari 4 konsumen bisa digantikan: customer lacak via `/orders` (dan ORDER-08 PH-06 tanpa input), prefill hanya kenyamanan (phone penerima tetap wajib diisi di checkout — itu phone alamat, bukan phone akun), batas per-HP per PRD 5.4 (baris 154, 454) berlaku ke "nomor HP terverifikasi" — hanya phone OTP guest yang terverifikasi; lubang lolos sudah ada hari ini lewat field kosong/isi palsu | **Ya, hapus inputnya** (`RegisterForm.tsx`: state, payload, JSX). API `/api/auth/register` tidak berubah: `registerSchema.phone` sudah `.optional()`, tetap menerima phone dari klien lain (backward compatible); user lama yang sudah punya phone tetap bisa login via nomor. Konsekuensi dicatat: customer baru login via email saja, batas voucher per-HP tidak mengikat customer tanpa phone (kondisi sama seperti field dikosongkan hari ini — bukan lubang baru) | `src/components/auth/RegisterForm.tsx`, `src/lib/auth/validation.ts` (tidak berubah), PRD 5.4 |
| 2026-10-11 | **Keputusan desain UI pemilihan alamat tersimpan di checkout (dasar TASK-72, PH-07).** User: "jika sudah ada alamat tersimpan maka akan menampilkan alamat tersimpan dan jika ada lebih dari 1 alamat tersimpan maka ada component yang perlu ditrigger untuk menampilkan daftar alamat dan memilih alamat yg sesuai. namun jika tidak ada, maka UI saat ini sudah tepat" | Menetapkan bentuk UI integrasi checkout per jumlah alamat tersimpan: tepat satu alamat ditampilkan langsung dengan isian terisi, lebih dari satu lewat komponen pemicu yang membuka daftar alamat untuk dipilih, dan nol alamat tetap memakai UI manual saat ini (`DestinationPicker`) tanpa perombakan | Disetujui sebagai dasar TASK-72 bersama keputusan desain PH-07 lainnya. Guest selalu jatuh ke jalur manual (selaras bagian 12.1: alamat guest tidak termasuk). Detail komponen (bentuk pemicu, posisi daftar, perilaku pilih) ditetapkan saat spesifikasi CUST-01 dan TASK-72 dirinci | `docs/04` bagian 12.1, 12.2 (TASK-72) |


---

## 11. Catatan lanjutan sesi

- **Terakhir dikerjakan:** PH-05 TASK-47 sampai TASK-53 — implementasi dan verifikasi end-to-end selesai (menunggu review). PH-04 sudah **Disetujui** (2026-10-10); kode + dokumen PH-04 belum di-commit. PH-03 sudah di-commit: `e1f5ab9` (kode) + `a0a7961` (docs). Ditambah revisi pasca-persetujuan PH-03 (perbaikan OTP guest + redesign urutan alamat) dan penghapusan `/verify-phone` — lihat bagian 6.8 dan 10; belum di-commit
- **Kondisi pekerjaan (PH-03, riwayat):** PH-02 **sudah di-commit** (`68e5ce8` kode, `f167fa4` dokumentasi). Perubahan PH-03 **belum di-commit**: 14 berkas termodifikasi (`docs/03`, `docs/04`, `prisma/schema.prisma`, `(storefront)/cart/page.tsx`, `api/admin/products/[id]/route.ts`, `api/shipping/route.ts`, `components/auth/OtpVerificationForm.tsx`, `components/cart/CartItemRow.tsx`, `components/cart/CartSummary.tsx`, `components/layout/HeaderUserMenu.tsx`, `lib/auth/otp.ts`, `lib/auth/session.ts`, `lib/cart/queries.ts`, `lib/shipping/validation.ts`) + 20 berkas baru (migrasi `20261009231301_add_orders/`, `(storefront)/checkout/`, `(storefront)/orders/`, `(storefront)/track-order/`, `api/orders/`, `components/cart/CartView.tsx`, `components/checkout/`, `components/orders/`, `components/shipping/`, `lib/orders/`). HEAD `f167fa4`
- **Pemeriksaan terakhir (PH-03):** `pnpm lint` exit 0; `pnpm build` exit 0 (33 rute, termasuk `ƒ /api/orders/create`, `ƒ /api/orders/track`, `ƒ /checkout`, `ƒ /orders`, `◐ /orders/[id]`, `◐ /track-order`); 23 pemeriksaan HTTP terhadap server dev + database Supabase + Redis Upstash — ongkir terfilter, gerbang OTP guest, pembuatan pesanan guest/customer, lacak publik + batas percobaan per IP, anti-overselling dua permintaan bersamaan, pelepasan reservasi kedaluwarsa (idempoten), dan pesanan lintas pengguna (rincian: bagian 6.6). 0 galat tak tertangani di log dev. Data uji dibersihkan (`orders=0`, `orderItems=0`, user `qa.ph03.*`=0, stok seed kaos 25 / sneakers 5, `totalStock` seluruh produk cocok). Pemeriksaan PH-02 sebelumnya: 40 PASS / 0 FAIL (bagian 5.5)
- **Keputusan terakhir:** 2026-10-10 — **PH-04 Disetujui; PH-05 dikerjakan dan siap direview.** User: "lanjutkan". Keputusan PH-05 (bagian 8.2): kalkulasi bertahap (nominal lalu persen dari sisa); stacking default menolak (opt-in lewat matriks kompatibilitas); kuota dijaga di transaksi; `EMAIL_FROM` dari env (default `onboarding@resend.dev`); invoice HTML siap-cetak
- **Langkah berikutnya (setelah instruksi user):**
  1. Review dan approval PH-05; setelah disetujui, mulai PH-06 — Polish MVP (Reports, Config, Shipping Tracking, Cancel/Refund, Admin Order, Pickup, Filter Katalog, Email lanjutan — cakupan diperluas audit 2026-10-10)
  2. Commit perubahan PH-04 + revisi PH-03 + PH-05 — draf pesan disiapkan agent, `git commit` dijalankan user
  3. (PH-05) Isi `EMAIL_FROM` dengan domain terverifikasi Resend bila email harus sampai ke pembeli mana pun (default hanya bisa kirim ke alamat pemilik akun)
  4. (PH-05) Revisi SDD 4.10 (invoice HTML siap-cetak, bukan `@react-pdf/renderer`) saat dokumentasi dirapikan
  5. (Opsional) Ubah `XENDIT_INVOICE_DURATION` (mis. 1800 = 30 menit) bila masa bayar perlu lebih longgar
  6. (PH-01) `SEED_ADMIN_PASSWORD` dev lemah dan **wajib diganti** sebelum produksi
- **Hal yang masih menghalangi:** Tidak ada yang menghalangi PH-05. Butir yang masih terbuka:
  (a) verifikasi webhook dari Xendit asli (tunnel publik / tombol "Test webhook" dashboard) belum dijalankan — verifikasi PH-04 memanggil endpoint webhook langsung ke server dev; (b) unggah berkas Uploadthing
  dengan berkas nyata belum diuji (kunci masih placeholder); (c) `EMAIL_FROM` domain terverifikasi belum diisi sehingga email baru sampai ke alamat pemilik akun Resend; (d) format PDF invoice final menunggu keputusan (saat ini HTML siap-cetak). Pengiriman OTP, kredensial ongkir, dan kredensial Xendit Test Mode sudah lengkap.
- **Catatan teknis yang berguna untuk sesi berikutnya:**
  - Next.js 16 mengganti `middleware.ts` menjadi `proxy.ts`, dan ekspor hasil destrukturisasi (`export const { auth: proxy } = ...`) **tidak** dapat dianalisis Next.js — harus `const { auth } = NextAuth(cfg); export default auth;`
  - Dengan `cacheComponents: true`, data URL (`params`, `searchParams`) wajib diakses di dalam `<Suspense>`
  - `declare module "@auth/core/jwt"` tidak dapat dipakai (pnpm tidak menaruh `@auth/core` di level atas); dipakai tipe lokal + cast di `src/lib/auth/auth.config.ts`
  - Tipe `PageProps<...>` baru dibuat saat `next build`, bukan oleh `tsc` saja
  - `export const instant = false` **tidak** mengubah mode render rute. Diuji di `page.tsx` detail produk: penanda build tetap `◐` (Partial Prerender) dan status produksinya tetap `200`. Fungsinya hanya mengizinkan akses `params`/`searchParams` (runtime data) di luar Suspense agar build tidak gagal validasi instant-navigation — bukan membuat rute jadi blocking secara HTTP. Klaim lama di dokumen ini bahwa ia "dihormati di `layout.tsx`" tidak diuji ulang dan sebaiknya jangan dijadikan acuan
  - **Koreksi 2026-10-10:** penanda `instant = false` **harus dideklarasikan di berkas halaman itu sendiri**. Deklarasi di `src/app/admin/layout.tsx` tidak menutupi halaman anak, sehingga `/admin/brands`, `/admin/categories`, `/admin/products`, `/admin/products/new`, `/admin/products/[id]/edit`, dan `/admin` tetap memunculkan galat validasi instant (uncached data / URL data / redirect) di dev. Setelah penanda ditambahkan di `page.tsx` masing-masing, semua rute bersih `200`/`307` tanpa galat. Perhatikan: halaman `/admin/*` kini tampil `ƒ` (Dynamic) di build, sementara `/admin/products/[id]/edit` tetap `◐`
  - Data URL (`params`, `searchParams`) wajib diakses di dalam `<Suspense>` **kecuali** rute ditandai `instant = false` di berkas halaman — lihat dua butir di atas
  - **Status HTTP `notFound()` bergantung pada apakah streaming sudah dimulai.** Sebelum streaming: `404` asli. Sesudah streaming: tetap `200`, UI not-found tetap dirender, dan Next.js menitipkan `<meta name="robots" content="noindex">` (docs `loading.mdx` bagian "Status codes"). Dengan `cacheComponents: true`, semua rute PPR — shell di-prerender dan dikirim lebih dulu — sehingga `notFound()` di dalam halaman **tidak akan pernah** menghasilkan `404` di produksi. Satu-satunya jalur resmi adalah request-time check di Proxy. **Koreksi (review 2026-10-10):** jalur Proxy itu **tidak wajib** pindah ke runtime Node — Edge bisa melakukan cek keberadaan produk lewat Supabase PostgREST via `fetch` (Edge-safe) dengan `service_role` key di env, jadi opsi `404` asli tetap tersedia kalau nanti dibutuhkan. Untuk PH-01 diputuskan **tidak** dipakai (terima `200` + `noindex`, lihat bagian 4.7)
  - Karena itu, **jangan menyimpulkan hasil dari mode dev.** Di dev rute dirender ulang per request dan `notFound()` justru mengembalikan `404`; perilaku dev dengan produksi berbeda di sini
  - `src/proxy.ts` berjalan di **Edge runtime** dan sengaja bebas Prisma (hanya memakai `authConfig` yang edge-safe). Menambah query database di sana berarti memindahkan proxy ke runtime Node — keputusan arsitektur, bukan perubahan kecil
  - Error boundary (`error.tsx`) adalah Client Component, jadi **UI-nya tidak ada di HTML produksi** — server mengirim kerangka `<html id="__next_error__">` berisi template kosong yang dihidrasi di browser. Yang bisa diverifikasi lewat HTTP: error tertangkap (tanpa crash), `noindex` ikut terkirim, dan pesan server **tidak** bocor ke klien. Detailnya hanya muncul di log server bersama sebuah `digest` yang bisa dipakai mencocokkan laporan pengguna
  - Error boundary yang benar untuk kegagalan pengambilan data adalah prop **`retry`**, bukan `reset`: `retry` me-render ulang children sekaligus mengambil data baru, `reset` hanya membersihkan state boundary
  - `global-error.tsx` menggantikan root layout, jadi ia harus menyediakan `<html>` dan `<body>` sendiri **dan** mengimpor `globals.css` sendiri — stylesheet global tidak diwariskan
  - Jangan pakai `pnpx prisma` — pakai `pnpm db:*`. `prisma migrate dev` menolak berjalan non-interaktif; padanannya `prisma migrate diff --from-empty --to-schema-datamodel ... --script` lalu `prisma migrate deploy`, dan `prisma migrate resolve --applied` untuk database yang sudah berskema
  - Di `.env.local`, variabel yang dikosongkan bernilai `""` (bukan undefined) — pakai `||` bukan `??` saat ingin fallback
  - Next.js membaca environment saat server start. **Koreksi 2026-10-10:** di Next.js 16 dev, mengubah `.env.local` memicu muat ulang otomatis (log dev menampilkan `Reload env: .env.local`) sehingga restart tidak selalu perlu — tetapi tetap restart kalau nilainya tidak ikut berubah (mis. variabel baru tidak terbaca, atau build produksi)
  - **OTP memakai Twilio Verify (`verify.twilio.com/v2`), bukan Messaging (`api.twilio.com/2010-04-01`).** Ini dua produk berbeda yang keduanya memakai kata "SMS" dan "OTP" di Console — sumber kebingungan utama di fase ini. Verify: `client.verify.v2.services(serviceSid).verifications.create({ to, channel })`, lalu `verificationChecks.create({ to, code })`. Service SID berawalan `VA`, Account SID berawalan `AC`; tertukar menghasilkan `20404`/not found
  - **Kalau OTP bermasalah, log yang benar ada di Identity, bukan Communications.** Console → **Identity** → **Verify** → **Logs**. Log di **Communications** → **Messaging** → **Logs** akan selalu kosong karena jalur itu sudah tidak dipakai kode
  - **Akun Trial Verify membuang pesan ke nomor yang belum terverifikasi secara diam-diam** — API tetap menjawab sukses, jadi aplikasi mengembalikan `200` dan UI menampilkan "OTP terkirim" padahal tidak ada yang sampai. Kalau OTP tidak masuk tanpa error apa pun, **periksa daftar Verified Caller IDs lebih dulu**, bukan kodenya. Batasnya 5 nomor per akun, dipakai bersama Verify, Messaging, dan Voice
  - **Tapi jebakan itu TIDAK berlaku untuk `+6285813386371`** — nomor itu sudah terbukti menerima SMS walau `OutgoingCallerIds` kosong. Dugaannya ia nomor pendaftaran akun Twilio yang otomatis diverifikasi. Jadi jangan pakai kekosongan daftar itu sebagai bukti bahwa pengiriman pasti gagal; yang menentukan adalah penerimaan di HP. Untuk nomor uji berikutnya, syarat Verified Caller ID kembali berlaku
  - Daftar nomor terverifikasi dapat dibaca lewat `client.outgoingCallerIds.list()`. Catatan: **Verify tidak menyediakan endpoint untuk membaca riwayat verifikasi** — `GET /v2/Services/{sid}/Verifications` dijawab `405`, dan SDK hanya mengekspos `create` pada resource itu. Jadi satu-satunya catatan hasil uji adalah log aplikasi dan HP tujuan; jangan berencana memverifikasi riwayat OTP hanya dari API Twilio. Trial memberi 40 verifikasi gratis, dan isi pesannya tidak bisa diganti selama masih Trial
  - **WhatsApp, kalau nanti kembali ke Messaging API** (mis. notifikasi pesanan di PH-05): pesan pertama wajib Content Template; teks bebas hanya sah di dalam jendela 24 jam setelah pengguna mengirim pesan lebih dulu. Pelanggarannya dijawab `400 ContentSid Required` (21654) — pesan error itu tidak menyebut kata "template" sama sekali, jadi mudah salah didiagnosis. Cara mengirimnya: `client.messages.create({ from, to, contentSid, contentVariables })`; `contentVariables` adalah **string JSON**, bukan objek, dan `body` tidak disertakan
  - Twilio punya **dua jenis template yang tidak kompatibel**: *Content Template* (Content Editor/Content API) bisa dikirim lewat `ContentSid`; template di Console area *WhatsApp Templates* **tidak bisa** dan harus dikonversi Twilio Support. Template bisa dibuat dan disetujui, lalu pengiriman tetap gagal
  - Akun Twilio Trial: `client.content.v1.contents.list()`, `messaging.twilio.com/v2/Channels/Senders`, dan Messaging Services menjawab `20003: This feature is not available on a Trial account`. Trial baru juga tidak punya nomor sendiri, dan `OutgoingCallerIds` bisa kosong walau nomor pendaftaran tetap bisa menerima — jadi daftar kosong itu bukan bukti pengiriman akan gagal
  - Menguji apakah kode atau penyedia yang salah: kirim `POST` REST langsung ke `api.twilio.com/2010-04-01/Accounts/{sid}/Messages.json` dengan Basic auth. Kalau responsnya identik dengan yang diterima SDK, penyebabnya ada di sisi akun/konfigurasi, bukan di aplikasi
  - Batas kirim OTP adalah 3 per jam per nomor, dan **penghitungnya naik sebelum percobaan pengiriman** — jadi pengiriman yang gagal tetap memakan kuota. Untuk diagnostik, cek dulu `otp:send-limit:{phone}` di Redis sebelum mencoba lagi
  - **Hapus `.next` sebelum `pnpm dev` kalau sebelumnya sudah menjalankan `pnpm build`.** Di Windows, Turbopack panic (`Failed to write app endpoint`, `exit code 0xc0000142`) saat memproses `globals.css` bila folder `.next` berisi sisa output produksi. Gejalanya `GET /` → `500` padahal build produksinya sendiri sukses. Menghapus `.next` lalu start ulang menyelesaikannya
  - `TaskStop` mematikan shell pembungkus `pnpm dev` tetapi **tidak** proses node anaknya; port 3000 tetap terpegang. Matikan lewat PID (`taskkill /PID <pid> /F`) setelah memeriksa `Get-CimInstance Win32_Process -Filter "Name='node.exe'"`. Jangan mematikan semua `node.exe` — sesi Claude Code sendiri berjalan di atas node
  - **Jangan pernah mengklaim server sudah mati tanpa memeriksa port.** `Get-NetTCPConnection -LocalPort 3000 -State Listen` lalu baca `CommandLine` proses induknya: `next dev` berarti dev server, `next start` berarti produksi. Pernah terjadi laporan menyebut server produksi sudah dimatikan padahal port 3000 masih dipegang `next dev` (PID berbeda) — akibatnya saran `pnpm dev` ke user akan gagal `EADDRINUSE`. Periksa dulu, baru menyarankan perintah start
  - **Next.js 16 `cacheComponents`: `crypto.getRandomValues()` dilarang saat prerender.** NextAuth memakai API itu di dalam `auth()`, jadi setiap komponen/halaman yang membaca sesi harus ditandai request-time dengan `await connection()`: di dalam `<Suspense>` untuk komponen (`CartBadge`, `HeaderUserMenu`), dan langsung di body untuk halaman (`CartPage`). `export const instant = false` **tidak** menyelesaikan galat ini — dokumen Next.js menyatakannya eksplisit. Gejalanya overlay galat saat navigasi padahal status HTTP tetap `200`
  - **Keranjang:** guest disimpan di Redis (`cart:guest:{uuid}`, TTL 30 hari) dengan cookie `flexstore_cart` (httpOnly, `SameSite=lax`, `Secure` di produksi); customer disimpan di tabel `cart_items`. Identitas selalu diambil dari sesi/cookie, **tidak pernah** dari body request. Nilai cookie divalidasi harus UUID sebelum dipakai sebagai kunci Redis
  - **RajaOngkir Komerce v1:** pencarian `GET /api/v1/destination/domestic-destination` mengembalikan ID tingkat **kecamatan**. Hitung biaya memakai `POST /api/v1/calculate/domestic-cost`. Endpoint `POST /api/v1/calculate/district/domestic-cost` hanya menerima ID tingkat **district** dari kaskade provinsi/kota/district dan menjawab `422 Origin or Destination not found` bila diberi ID hasil pencarian. Kunci dikirim sebagai header `key`, bukan query param
  - **Ongkir tanpa kredensial atau saat API gagal selalu jatuh ke fallback** tarif flat Rp10.000 (`source: "fallback"`); detail galat hanya masuk log. Jadi fitur keranjang bisa dicoba sebelum kunci diisi
  - **Menguji mode API tanpa mengubah `.env.local`:** set variabel di process env shell sebelum start — `$env:SHIPPING_ORIGIN_DISTRICT_ID="17590"; pnpm dev`. Next.js tidak menimpa environment yang sudah ada, jadi `.env.local` tetap bersih
  - **Verifikasi HTTP di Windows:** `curl.exe` dari PowerShell rawan salah kutip saat mengirim body JSON (muncul "Error formatting a string"). Pakai skrip Node dengan cookie jar manual. Tulis hasil ke file dengan encoding UTF-8 lalu baca — redirect PowerShell default menulis UTF-16 sehingga file dianggap biner oleh pembaca teks
  - **`node -e` di lingkungan ini memunculkan "Debugger listening"** (`NODE_OPTIONS` memuat `--inspect`). Tidak mengganggu hasil, tetapi output panjang lebih aman ditulis ke file
  - **Menambah model Prisma:** jalankan `pnpm db:migrate` lalu `pnpm db:generate`, dan **matikan dev server dulu** — `prisma generate` gagal `EPERM` saat DLL query engine masih dipakai proses dev
  - **Jangan menelan sinyal internal Next.js di dalam `try/catch` route handler.** Next memakai error ber-`digest` (`NEXT_PRERENDER_INTERRUPTED` saat `request.url`/`cookies()` dipakai sebelum prerender selesai, juga `NEXT_REDIRECT`, `NEXT_NOT_FOUND`, `DYNAMIC_SERVER_USAGE`). Wrapper generik yang menangkap semuanya akan mengubah sinyal itu jadi `500`. `withRouteErrors` di `src/lib/utils/api.ts` memakai `isNextControlFlowError` untuk melempar ulang error ber-`digest` `NEXT_*`/`DYNAMIC_SERVER_USAGE`
  - **`prisma.<model>.update` melempar `P2025` kalau barisnya tidak ada** — bukan mengembalikan `null`. Untuk operasi yang boleh gagal lunak (mis. `PATCH` keranjang), pakai `updateMany` lalu periksa `count === 0`. Terbukti: `{"rowExists":false,"result":"THROW","prismaCode":"P2025"}`
  - **Berat paket diambil dari data produk, bukan asumsi, dan tidak ikut di respons.** `ProductVariant.weightGram` (Int, gram, default 1000) diisi admin di form produk; `POST /api/shipping` menghitung `sum(kuantitas x weightGram)` lalu memakainya sebagai kunci cache `ship:cost:{origin}:{destination}:{berat}` dan parameter `weight` ke RajaOngkir. `ShippingQuote` hanya mengembalikan `source`, `cached`, `options`; `weightGram` **tidak** ada di respons. `SHIPPING_WEIGHT_PER_ITEM_GRAM` kini hanya cadangan untuk varian yang beratnya 0, dan berat tidak ditampilkan di storefront (`/cart` tidak memuat baris "Berat paket"). Bukti berat ikut dihitung tanpa membocorkan angkanya: dua keranjang dengan berat berbeda menghasilkan `cached: false` keduanya, sedangkan berat dari body klien diabaikan (kunci tetap sama -> `cached: true`)
  - `prisma migrate dev --name <nama>` berjalan non-interaktif di repo ini selama tidak ada drift atau kehilangan data (menambah kolom ber-default aman) dan sekaligus menjalankan `generate`. Terbukti: `20261009221836_add_variant_weight`
  - **Menambah field wajib ke `productVariantSchema` berarti form admin ikut berubah.** `productSchema` divalidasi di klien (`ProductForm`) sebelum dikirim, jadi `weightGram` harus ada di `VariantRow`, `EMPTY_VARIANT`, payload `safeParse`, dan pemetaan di halaman edit — kalau salah satu tertinggal, semua submit produk gagal `VALIDATION_ERROR`
  - **Pembuatan pesanan (PH-03):** nomor `FS-YYYYMMDD-XXXXXX` memakai tanggal Asia/Jakarta (`Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Jakarta" })` lalu tanda hubung dibuang) + 6 karakter dari alfabet tanpa `I`/`O`/`0`/`1` supaya tidak salah dibaca. Kandidat dicek `findUnique` **sebelum** transaksi, jadi bentrok (sangat jarang) tidak membatalkan transaksi yang sudah mengurangi stok
  - **Reservasi stok atomik tanpa raw SQL:** `updateMany({ where: { id, stock: { gte: qty } }, data: { stock: { decrement: qty } } })` lalu periksa `count === 0` → lempar di dalam `$transaction`. Prisma **tidak bisa** membandingkan dua kolom di `where`, jadi bentuk ini satu-satunya cara atomik yang tersedia. Bukti: dua permintaan bersamaan untuk stok 1 → satu `201`, satu `400 INSUFFICIENT_STOCK`, stok akhir 0
  - **Pelepasan reservasi malas (lazy):** klaim baris memakai `updateMany` bersyarat (`status: "WAITING_PAYMENT"`, `stockReservedUntil: { lt: now }`) → `count === 0` berarti sudah dilepas pihak lain, jadi idempoten. Dipanggil di awal `createOrder` dan di setiap pembacaan pesanan (riwayat, detail, lacak). Tanpa penjadwal: Vercel Cron paket Hobby hanya harian, tidak cocok untuk batas 10 menit
  - **`totalStock` produk dihitung ulang dari jumlah stok varian** setiap kali stok berubah (saat pesanan dibuat dan saat reservasi dilepas) agar katalog tidak basi
  - **Ongkir pada pesanan selalu dihitung ulang di server** dari berat item terpilih; klien hanya mengirim `courierCode` + `service` yang harus cocok dengan opsi hasil hitung server (`INVALID_SHIPPING_METHOD` bila tidak ada). `destinationId` wajib **hanya** kalau API ongkir aktif — tanpa API key tarif flat yang dipakai
  - **SDK Upstash men-JSON-parse nilai saat `get`.** `redis.set(key, "1")` menyimpan byte `1` mentah dan `get` mengembalikannya sebagai **number 1**, bukan string — jadi perbandingan `value === "1"` gagal. Penanda nomor HP terverifikasi kini memakai string non-JSON `"verified"` yang dikembalikan apa adanya. Pelajaran: jangan pakai string numerik sebagai penanda Redis, dan **uji lewat jalur aplikasi**, bukan lewat penulisan REST mentah (REST mentah `JSON.stringify("1")` menyimpan `"1"` dan lolos, sehingga menutupi bug). Terbukti: `{"numeric":1,"numericType":"number","numericEq":false,"word":"verified","wordEq":true}` (bagian 6.8)
  - **`OrderItem.variantId` memakai `onDelete: Restrict`** supaya riwayat pesanan tetap utuh. Menghapus produk yang pernah dipesan menghasilkan `P2003`; handler `DELETE /api/admin/products/[id]` menangkapnya khusus → `409 PRODUCT_IN_USE` (bukan `400 INVALID_REFERENCE` yang menyesatkan)
  - **`searchParams` di `/checkout` diakses langsung dengan `export const instant = false`** di berkas halaman (pola sama seperti halaman admin). Tanpa penanda itu, data URL wajib berada di dalam `<Suspense>`
  - **Nomor pesanan sebagai kunci lacak publik** dipadukan dengan nomor HP (`guestPhone` untuk pesanan guest, `User.phone` untuk pesanan customer). Salah satu tidak cocok → `404` generik; percobaan dibatasi 10 per 10 menit per IP (`track:limit:{ip}` di Redis, IP dari `x-forwarded-for`)
  - **Xendit Invoice API v2 (PH-04):** `POST /v2/invoices` dengan `external_id`, `amount`, `description`, `currency: "IDR"`, dan `invoice_duration` (detik). Respons memuat `id`, `invoice_url`, `expiry_date`. Base URL tetap di kode (`https://api.xendit.co`, sama untuk Test & Live; mode ditentukan prefix kunci `xnd_development_`/`xnd_production_`). Kunci API diuji dengan permission `Money-in products = Write` + `Balance = Read` saja
  - **Basic Auth Xendit:** username = secret key, password kosong. Header: `Authorization: Basic base64(key + ":")`. Webhook diverifikasi lewat header `x-callback-token` (bukan signature HMAC)
  - **Idempotensi webhook:** klaim baris dengan `updateMany({ where: { externalId, status: "PENDING" }, data: { status: "PAID", paidAt } })`; `count === 0` → cek status baris → `ALREADY_PROCESSED`. Tidak butuh penanda Redis; transaksi database sudah cukup
  - **Masa bayar = reservasi stok:** `XENDIT_INVOICE_DURATION` (detik) dipakai untuk `invoice_duration` Xendit dan sebagai `stockReservedUntil` awal; saat invoice dibuat, `stockReservedUntil` diselaraskan ke `expiry_date` respons. Mengubah `.env.local` + restart cukup untuk mengubah 15/30/40 menit tanpa menyentuh kode
  - **Webhook EXPIRED membatalkan pesanan segera** lewat `cancelOrderAndReleaseStock(orderId)` (klaim `updateMany` `status: WAITING_PAYMENT` → `CANCELED` + kembalikan stok), terpisah dari pelepasan malas berbasis waktu
  - **Otorisasi buat pembayaran:** customer dicocokkan dengan `Order.userId`; guest dicocokkan dengan `Order.guestPhone` (nomor HP dinormalisasi oleh `phoneSchema`). Jumlah selalu `Order.total`, tidak pernah dari klien
  - **`NEXT_PUBLIC_APP_URL`** dipakai untuk `success_redirect_url`/`failure_redirect_url` invoice (`/orders/{id}` untuk customer, `/track-order` untuk guest). Bila kosong, redirect tidak dikirim
  - **Cookie jar di skrip uji Node:** `res.headers.getSetCookie()` (Node 19.7+). Simpan pasangan `name=value` saja; nilai kosong berarti hapus cookie

---

## 12. Rincian Fase: PH-07 — Customer Management (MOD-CUST)

> Bagian ini ditempatkan setelah bagian 11, bukan di antara bagian 9 dan 10, agar nomor **bagian 10 ("Perubahan scope dan hambatan") tidak bergeser**. Nomor itu sudah dirujuk oleh `AGENTS.md`, `docs/05`, dan beberapa bagian di `docs/04` sendiri.

### 12.1. Tujuan dan batas

- **Tujuan:** Customer bisa menyimpan alamat (maksimal 5) dan memilihnya saat checkout tanpa mengetik ulang, memesan ulang dari pesanan lama, dan mengelola akunnya (set/reset password, preferensi notifikasi)
- **Termasuk:** 
  - CUST-01 (Alamat Tersimpan — tambah/ubah/hapus + batas 5 alamat), integrasi pemilihan alamat di `/checkout`
  - Lanjutan ORDER-03 (Re-order — PRD 2.2: tombol "Pesan Lagi" di riwayat/detail pesanan yang menambahkan produk pesanan lama ke keranjang, dengan validasi stok/status produk; `docs/03` ORDER-01/02 selama ini mengecualikannya tanpa rumah pengganti)
  - AUTH-04 (Set Password Link — PRD 2.1/2.2/3.1.I/5.7: guest yang mengisi email saat checkout menerima link untuk membuat akun customer; `guestEmail` sudah tersimpan sejak PH-03)
  - AUTH-05 (Password Reset — PRD 4.1: "lupa password" lewat email link)
  - CUST-02 (Notification Preferences — PRD 4.8: customer memilih jenis email yang diterima)
- **Tidak termasuk:** Alamat guest (tetap diisi per pesanan, `Order.guestAddress`), buku alamat toko/pengirim, perubahan bentuk `Order.shippingAddress`, email order shipped/cancel/refund (PH-06)
- **Referensi:** PRD 2.1, PRD 2.2, PRD 3.1.I, PRD 4.1, PRD 4.8, PRD 4.9, PRD 5.7, PRD 5.8, SDD 4.8 (MOD-CUST), SDD 6.2 (`shippingAddress`), `docs/04` bagian 10 (audit 2026-10-10)
- **Prasyarat:** PH-03 + PH-05 disetujui — checkout/`DestinationPicker`/`Order.shippingAddress` dari PH-03, email (Resend) dari PH-05 untuk set/reset password. **Diubah oleh audit 2026-10-10** dari "hanya PH-03, tidak bergantung PH-04..PH-06" karena fitur email baru masuk fase ini
- **Langkah demo:** Login → tambah alamat → checkout → pilih alamat tersimpan → isian alamat terisi otomatis → pesanan dibuat → ubah alamat tersimpan → pesanan lama tidak berubah → "Pesan Lagi" dari pesanan lama → item masuk keranjang → guest isi email saat checkout → terima link set password → akun jadi customer → "Lupa password" → reset lewat email → atur preferensi notifikasi
- **Estimasi:** 3-4 hari (naik dari 1-2 setelah audit 2026-10-10 menambah cakupan)

*Spesifikasi CUST-01 belum ada di `docs/03`; menulisnya adalah langkah pertama fase ini (TASK-67). Spesifikasi AUTH-04, AUTH-05, CUST-02, dan revisi ORDER-03 (re-order) ditulis saat fase ini dimulai.*

### 12.2. Daftar task (rencana)

| ID | Pekerjaan / hasil | Fitur | Bergantung pada | Status | Bukti |
| --- | --- | --- | --- | --- | --- |
| TASK-67 | Tulis spesifikasi CUST-01 di `docs/03` | CUST-01 | - | **Selesai** (2026-10-11) | `docs/03` v1.4: CUST-01, CUST-02, AUTH-04, AUTH-05, ORDER-03B + indeks Phase 7 |
| TASK-68 | Skema Prisma `Address` + `NotificationPreference` (relasi N→1 `User`, label, nama penerima, no. HP, `destinationId`, provinsi/kota/kecamatan/kelurahan/kode pos, alamat lengkap, penanda alamat utama; 5 kolom preferensi notifikasi) + migrasi + `prisma generate` | CUST-01, CUST-02 | TASK-67 | **Selesai** | `prisma/migrations/20261011120000_add_ph07_customer_management/migration.sql`; `prisma migrate deploy` exit 0 |
| TASK-69 | Lib `src/lib/customers/`: Zod schema, batas maksimal 5 alamat ditegakkan di server, query/mutasi milik sendiri, penjaga alamat utama tunggal, preferensi notifikasi | CUST-01, CUST-02 | TASK-68 | **Selesai** | `src/lib/customers/{validation,queries,mutations,view,index}.ts`; bukti 12.4 butir 1-4 |
| TASK-70 | API `/api/customer/addresses` (`GET`/`POST`) + `/[id]` (`PATCH`/`DELETE`) + `/api/customer/notification-preferences` (`GET`/`PATCH`) + Zod sebelum query + penangkap galat | CUST-01, CUST-02 | TASK-69 | **Selesai** | smoke 401 tanpa sesi (12.4 butir 6) |
| TASK-71 | Halaman `/profile`: daftar, tambah, ubah, hapus alamat; penanda alamat utama; preferensi notifikasi | CUST-01, CUST-02 | TASK-70 | **Selesai** | `src/app/(storefront)/profile/page.tsx`, `src/components/customer/{AddressManager,NotificationPreferencesForm}.tsx` |
| TASK-72 | Integrasi `/checkout`: pilih alamat tersimpan → isian terisi otomatis lewat `DestinationPicker`; guest tetap mengetik manual. Bentuk UI tiga keadaan (nol/tepat satu/lebih dari satu alamat tersimpan) | CUST-01 | TASK-71 | **Selesai** | `src/components/checkout/CheckoutForm.tsx`, `src/app/(storefront)/checkout/page.tsx` |
| TASK-73 | Navigasi: menu akun menautkan ke `/profile` (Alamat & Profil) | CUST-01 | TASK-71 | **Selesai** | `src/components/layout/HeaderAccountMenu.tsx` |
| TASK-74 | Re-order: tombol "Pesan Lagi" di `/orders` dan `/orders/[id]` menambahkan varian pesanan lama ke keranjang (validasi stok, produk aktif, varian masih ada) | ORDER-03 (lanjutan) | TASK-70 | **Selesai** | `src/lib/orders/reorder.ts`, `src/app/api/orders/[id]/reorder/route.ts`, `src/components/orders/ReorderButton.tsx`; bukti 12.4 butir 5 |
| TASK-75 | AUTH-04: token + halaman set password untuk guest yang mengisi email saat checkout → akun customer baru (mengikat `guestEmail` yang tersimpan sejak PH-03) | AUTH-04 | TASK-74 | **Selesai** | `src/lib/auth/tokens.ts`, `src/emails/set-password.ts`, `src/lib/notifications/account-emails.ts`, `/api/auth/set-password`, `/set-password` |
| TASK-76 | AUTH-05: alur "Lupa password" (form email → token → halaman set password baru) | AUTH-05 | TASK-75 | **Selesai** | `/api/auth/forgot-password`, `/api/auth/reset-password`, `/forgot-password`, `/reset-password`, `src/emails/password-reset.ts` |
| TASK-77 | CUST-02: preferensi notifikasi customer (pilih jenis email yang diterima; ditegakkan saat kirim di jalur email) | CUST-02 | TASK-75 | **Selesai** | `src/lib/notifications/order-emails.ts` (`shouldSendNotification`); bukti 12.4 butir 4 |
| TASK-78 | Lint + build | Semua | TASK-77 | **Selesai** | `pnpm lint` exit 0; `pnpm build` exit 0; `tsc --noEmit` bersih |
| TASK-79 | Verifikasi exit criteria + laporan review (berhenti, tunggu approval) | Semua | TASK-78 | **Selesai** | bagian 12.4-12.5 |

*Penomoran TASK bersifat global dan berurutan. PH-04 berhenti di TASK-46, PH-05 memakai TASK-47 sampai TASK-53, **PH-06 memakai TASK-54 sampai TASK-66** (dikerjakan lebih dulu, bagian 9.3), jadi PH-07 memakai TASK-67 sampai TASK-79 (diperluas dari TASK-62 oleh audit 2026-10-10, lalu digeser 13 nomor karena PH-06 dikerjakan lebih dulu).*

### 12.3. Exit criteria (rencana)

- [x] Customer bisa menyimpan **maksimal 5 alamat**; percobaan ke-6 ditolak **di server** (kode galat `LIMIT_REACHED`, HTTP 409)
- [x] Customer bisa memilih alamat tersimpan di `/checkout` dan seluruh isian alamat terisi otomatis, termasuk `destinationId` untuk ongkir
- [x] Customer bisa mengubah dan menghapus alamat miliknya sendiri
- [x] Alamat customer lain tidak bisa dibaca, diubah, maupun dihapus (OWASP A01) — dijawab 404 generik
- [x] Menambah/mengubah/menghapus alamat **tidak mengubah pesanan lama** — `Order.shippingAddress` tetap snapshot (tidak ada jalur tulis dari `Address` ke `Order`)
- [x] Guest tetap bisa checkout tanpa menyimpan alamat
- [x] "Pesan Lagi" dari pesanan lama menambahkan item ke keranjang; varian yang sudah tidak ada/stok habis ditolak dengan pesan jelas (tidak ada pesanan yang ikut berubah)
- [x] Guest yang mengisi email saat checkout menerima link set password; setelah diset, akun bisa login dan pesanan guest-nya ikut terikat ke akun baru
- [x] "Lupa password" mengirim link reset ke email terdaftar; token sekali pakai dan berkedaluwarsa
- [x] Preferensi notifikasi ditegakkan saat email dikirim (customer yang menonaktifkan jenis email tidak menerimanya)
- [x] `pnpm lint` exit 0 dan `pnpm build` exit 0

### 12.4. Bukti verifikasi (2026-10-11)

1. **Batas 5 alamat + alamat utama tunggal** (script `tsx` langsung ke lib): buat 5 alamat sukses; ke-6 mengembalikan `LIMIT_REACHED`; hanya 1 `isPrimary`; alamat pertama otomatis utama; `isPrimary: true` pada alamat lain memindahkan penanda (tetap 1); menghapus alamat utama mengangkat alamat tertua berikutnya (tetap 1)
2. **Kepemilikan** (OWASP A01): `updateAddress` dengan `userId` user lain terhadap alamat milik user pertama mengembalikan `NOT_FOUND` (bukan 403)
3. **Token sekali pakai** (AUTH-04/AUTH-05): `consumeSetPasswordToken` pertama mengembalikan payload, panggilan kedua `null`
4. **Preferensi notifikasi** (CUST-02): nilai bawaan semua aktif tanpa baris tersimpan; mematikan `orderConfirmation` membuat `shouldSendNotification` mengembalikan `false` untuk jenis itu, `true` untuk jenis lain, dan `true` untuk guest (`userId = null`)
5. **Re-order** (ORDER-03): `reorderFromOrder` menambahkan item pesanan lama ke keranjang (`added=1`, `skipped=0`); keranjang dikembalikan ke keadaan semula setelah uji
6. **Smoke HTTP** (dev server): `GET`/`POST /api/customer/addresses`, `GET /api/customer/notification-preferences`, `POST /api/orders/<uuid>/reorder` → **401** tanpa sesi; `POST /api/auth/forgot-password` → **200** (selalu, tanpa membocorkan email); `POST /api/auth/set-password` dan `/reset-password` dengan token palsu → **400** `INVALID_TOKEN`; `GET /profile` → **307** (redirect ke login); `GET /login`, `/forgot-password`, `/set-password`, `/reset-password` → **200**
7. **Migrasi + build**: `prisma migrate deploy` exit 0 (migrasi `20261011120000_add_ph07_customer_management`); `prisma generate` exit 0; `pnpm lint` exit 0; `tsc --noEmit` bersih; `pnpm build` exit 0 dengan rute baru (`/profile`, `/set-password`, `/forgot-password`, `/reset-password`, `/api/customer/*`, `/api/auth/{set,forgot,reset}-password`, `/api/orders/[id]/reorder`)

### 12.5. Laporan untuk review (2026-10-11)

- **Status:** PH-07 selesai dikerjakan dan terverifikasi otomatis. **Berhenti, tunggu approval user** (gate bagian 2).
- **Keputusan desain yang diambil saat implementasi:**
  - Preferensi notifikasi memakai tabel `NotificationPreference` (baris per user, dibuat saat pertama disimpan) dengan pembacaan memakai nilai bawaan semua aktif tanpa menulis; penegakan dilakukan di `order-emails.ts` sebelum setiap `sendEmail`, dengan guest (`userId = null`) selalu dikirimi
  - Token set/reset password disimpan di Redis (TTL 24 jam untuk set, 1 jam untuk reset), dihapus saat dibaca (sekali pakai), bukan di cookie maupun tabel
  - Akun hasil AUTH-04 **mengikat pesanan guest lama** dengan `guestEmail` yang sama (`Order.userId` diisi) supaya riwayat tidak hilang; dicatat sebagai keputusan yang menjawab pertanyaan terbuka `docs/04` bagian 12.1
  - Alamat utama tidak bisa "dikosongkan" (hanya penanda `true` yang dihormati); menghapus alamat utama mengangkat alamat tertua berikutnya
  - `PATCH` alamat menerima sebagian field (mis. hanya `isPrimary: true`); `POST` memakai skema penuh
  - Perbaikan di luar cakupan PH-07: tombol placeholder "Lacak Pesanan" dan "Batalkan Pesanan" di `/orders` (warisan PH-06) kini benar-benar menautkan ke `/orders/[id]/tracking` dan `/orders/[id]`
- **Dokumen:** TASK-67 selesai 2026-10-11 — `docs/03` v1.4 memuat CUST-01, CUST-02, AUTH-04, AUTH-05, ORDER-03B (plus revisi bagian batas fitur ORDER-03 soal tombol daftar). `docs/01` dan `docs/02` belum diperbarui untuk PH-06/PH-07.
- **Keterbatasan verifikasi:** uji klik-through browser (pilih alamat di checkout, tombol "Pesan Lagi", alur email set/reset password sampai kotak masuk) belum dijalankan; email produksi tetap bergantung pada domain Resend terverifikasi.
- **Sisa yang belum ditangani (dari PH-06, tidak berubah):** B1 lost update keranjang guest, B3 snapshot harga campur, B4 tanpa rate limit proxy ongkir, C1 item non-aktif ikut dihitung, C2 `getCartItemCount` boros, error 429 destinasi disembunyikan.

---

## 13. Rincian Fase: PH-08 — Site Admin (Platform Configuration)

> Bagian ini ditempatkan setelah bagian 12 dengan alasan yang sama: nomor **bagian 10 ("Perubahan scope dan hambatan") tidak boleh bergeser** karena sudah dirujuk oleh `AGENTS.md`, `docs/05`, dan `docs/04` sendiri.

### 13.1. Tujuan dan batas

- **Tujuan:** Site Admin dapat login dan mengonfigurasi level platform: payment gateway (Xendit), shipping provider (RajaOngkir), akun Store Admin, dan pengaturan platform — menutup kriteria sukses PRD #10
- **Termasuk:** 
  - SITE-01 (Platform Settings — pengaturan platform)
  - SITE-02 (Payment Gateway Configuration — konfigurasi Xendit, PRD 3.1.K)
  - SITE-03 (Shipping Provider Configuration — konfigurasi RajaOngkir, PRD 3.1.K)
  - SITE-04 (User Management — kelola akun Store Admin: buat, nonaktifkan, reset password)
  - Role baru `SITE_ADMIN` di NextAuth + area Site Admin terpisah dari `/admin` (Store Admin), dengan pengecekan role di setiap handler (OWASP A01) — selaras SDD 587 yang memang sudah mendesain `SITE_ADMIN` di enum role (skema saat ini baru `GUEST`, `CUSTOMER`, `STORE_ADMIN`); komentar di `src/lib/auth/session.ts` yang menyitir "PRD 2: role Guest, Customer, Store Admin" ikut diperbarui saat fase ini mendaratkan role-nya
- **Tidak termasuk:** Multi-store (PRD 3.2 — future)
- **Referensi:** PRD 1 (tujuan: pemisahan Site Admin vs Store Admin), PRD 2.4 (Site Admin), PRD 3.1.K, PRD 4.1, PRD 4.12, kriteria sukses PRD #10, SDD 587/696, keputusan bagian 10 (2026-10-10: Site Admin dipastikan ada)
- **Prasyarat:** PH-05 disetujui — NextAuth, area admin, dan pola proteksi role sudah ada sejak PH-01. **Disarankan dikerjakan setelah PH-06** supaya hal yang dikonfigurasi (payment gateway, shipping provider) sudah punya fitur lengkap di sisi Store Admin
- **Langkah demo:** Login Site Admin → buat akun Store Admin baru → nonaktifkan akun Store Admin → ubah konfigurasi payment gateway → ubah konfigurasi shipping provider (termasuk origin) → simpan pengaturan platform → Store Admin login dan bekerja seperti biasa
- **Estimasi:** 2-3 hari

*Task detail dirinci saat PH-08 dimulai. Pertanyaan desain yang harus dijawab saat itu: (a) apakah kunci Xendit/RajaOngkir disimpan di database atau tetap di env (implikasi OWASP A02 — kunci pembayaran di database butuh perlindungan ekstra); (b) apakah area Site Admin memakai prefix rute terpisah atau subdomain; (c) bagaimana akun Site Admin pertama dibuat (seed, seperti admin Store Admin).*

---

**Status:** Implementation Plan v1.0 — **PH-05 siap direview** (2026-10-10). PH-01 sampai PH-04
disetujui. Audit PRD 2026-10-10 (bagian 10) menutup 13 kebutuhan PRD yang belum punya task: PH-06
diperluas (kelola pesanan admin, pickup, email lanjutan, lima laporan, size chart,
template alasan penolakan), PH-07 diperluas (re-order, set password, reset password, preferensi
notifikasi), dan PH-08 dibuat (Site Admin — konfigurasi platform; Site Admin dipastikan ada oleh
user).

**Next steps:**
1. Review dan approval PH-05 (Voucher, Email, Invoice)
2. Commit perubahan PH-04 + revisi PH-03 + PH-05 — draf pesan disiapkan agent, `git commit` dijalankan user
3. Setelah disetujui, mulai PH-06 — Polish MVP (Reports, Config, Shipping Tracking, Cancel/Refund, Admin Order, Pickup, Email lanjutan)
4. Isi `EMAIL_FROM` dengan domain terverifikasi Resend bila email harus sampai ke pembeli mana pun
5. Revisi SDD 4.10 (invoice HTML siap-cetak) saat dokumentasi dirapikan — revisi PRD 2.3/model role sudah selesai 2026-10-10 (bagian 10)
6. Sinkronisasi indeks fitur `docs/03`: fitur terimplementasi yang masih tercatat "Belum dirinci" (PROD-02..05, AUTH-02/03, dsb.) plus ID baru dari audit 2026-10-10 (ORDER-07, SHIP-03, AUTH-04, AUTH-05, CUST-02, SITE-01..04)