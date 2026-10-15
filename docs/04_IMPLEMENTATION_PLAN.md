# Implementation Plan — FlexStore

> Fungsi dokumen: mengubah kebutuhan menjadi fase dan task, menentukan urutan serta dependensi, dan mencatat bukti hasil berikut keputusan review. Setiap fase menghasilkan sesuatu yang bisa diperiksa.

## 1. Identitas dan kondisi sekarang

| Isian | Jawaban |
| --- | --- |
| Proyek / target rilis | FlexStore MVP |
| Versi / tanggal rencana | v1.0 / 2026-10-09 |
| Versi PRD, SDD, dan spesifikasi | PRD v1.6, SDD v1.0, Spesifikasi Fitur v2.4 (CART-05 + stok efektif Terimplementasi 2026-10-15) |
| Reviewer / pemilik keputusan gate | Development Team / Product Owner |
| Fase aktif | Tidak ada — MVP selesai. PH-01 sampai PH-10 semua **Disetujui** (2026-10-11 untuk PH-08, PH-09, PH-10; rincian status dan commit per fase di bagian 3): PH-08 `f01a6d2`, PH-09 `1da2b3a`, PH-10 `40dcb41`. Revisi pasca-persetujuan tercatat di bagian 6.8 (PH-03) serta 4.8 dan 4.9 (PH-01); keputusan lanjutan PH-10 di bagian 15.2 |
| Task aktif / terakhir | PH-08 — TASK-80 sampai TASK-96 selesai; verifikasi otomatis lulus (bagian 13.5); uji klik-through lulus 2026-10-11 (bagian 11). Spek `docs/03` v1.5 (SITE-00..SITE-04) ditulis lebih dulu atas permintaan pengguna. PH-09 — spek `docs/03` SITE-05 ditulis lebih dulu (2026-10-11, urutan "dokumen dulu, coding belakangan"); daftar task TASK-97..103 di bagian 14.3; **TASK-97..103 selesai** (implementasi 2026-10-11 + verifikasi otomatis + smoke HTTP 49 pemeriksaan lulus, bagian 14.5); uji klik-through lulus 2026-10-11 (bagian 11). PH-10 — **TASK-104..108 + TASK-110 selesai** (implementasi 2026-10-11; uji klik-through browser lulus — bukti 15.5); TASK-109 selesai (`pnpm build` exit 0, dijalankan pengguna 2026-10-11 + diperbarui di 15.5/15.6) |
| Instruksi mulai / lanjut terakhir | User: "mulai phase 1" (2026-10-09), "lanjutkan" (2026-10-09), "sudah bisa saya coba akses?" (2026-10-09), "perbaiki di PH-01" + "error.tsx tambahkan di PH-01" (2026-10-09), "opsi 1 gua setuju" (2026-10-10), "jalankan 1 dan 2 dulu" (2026-10-10), "jika ada masalah kredensial yang diperlukan, skip dulu, dan lanjutkan coding sampai selesai" (2026-10-10), "oke next lanjut ke phase 4?" (2026-10-10), "lanjutkan" (2026-10-10, memulai PH-05), "kerjakan phase 6" (2026-10-11), "next ph 7" (2026-10-11, menerima PH-06 sekaligus memulai PH-07), "minta dibalik: dokumen dulu, coding belakangan" (2026-10-11, menulis spek PH-07 di `docs/03`), "push ph 7" (2026-10-11, commit + push PH-07 `c20f525`), "next ph 8" (2026-10-11, memulai PH-08), "ini sudah tepat, pengaturan warna juga jangan hanya primary saja ... buat fitur palette warna dan bisa memasukkan kode warna. kustomisasi banner masuk akal? sebelumnya sudah ada rencana untuk banner itu" (2026-10-11, memulai PH-09 — konsep Site Admin direvisi jadi kustomisasi brand; tiga keputusan cakupan tercatat di bagian 14.2), "tambahkan dokumentasi untuk fix, gua mau halaman alat tersimpan hanya fokus untuk alamat, tidak include profil dan notifikasi. kemudian halaman profil akan berdiri sendiri nantinya, sedangkan notifikasi gua mau menambahkan pop up atau dialog yang muncul dari icon notifikasi di navbar" (2026-10-11, PH-10 — lima keputusan UI akun + notifikasi in-app tercatat di bagian 10, spek CUST-03 + NOTIF-02 ditulis), "apa yang lu kerjain? dimana kustomisasi brand nya?" lalu memilih "Bangun sekarang" (2026-10-11, implementasi PH-09 SITE-05 selesai + diverifikasi), "commit terpisah tiap phase, dan lakukan push llangsung ke github" (2026-10-11, commit `f01a6d2` + `1da2b3a` di-push), "ganti email wajib verifikasi ulang, rapikan 3 baris status usang. setelah selesai ada pertanyaan apalagi yang kurang jelas untuk phase 10" (2026-10-11, revisi CUST-03 + perapian status dokumen), "gua approve" + "tuntaskan" + "commit terpisah" + jawaban enam pertanyaan PH-10 (2026-10-11, PH-08/PH-09 disetujui; keputusan lanjutan PH-10 di bagian 15.2 butir 8), "perbaiki nomor 1. dulu" (2026-10-11, revisi pasca-persetujuan PH-01: input gambar varian ditambahkan ke form admin produk), "Ya, mulai PH-10 sekarang" (2026-10-11, implementasi + verifikasi PH-10 selesai; bukti 15.5, laporan 15.6), "approve" (2026-10-11, PH-10 disetujui) |
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
| PH-07 | Customer Management (Akun + Alamat) | Simpan/ubah/hapus alamat (maks 5), pilih alamat saat checkout, pesan lagi dari pesanan lama, set password (guest isi email), reset password, preferensi notifikasi | MOD-CUST (CUST-01, CUST-02), MOD-ORDER (lanjutan ORDER-03), MOD-AUTH (AUTH-04, AUTH-05) | PH-03 + PH-05 disetujui (email untuk set/reset password; diubah dari "hanya PH-03" oleh audit 2026-10-10) | **Disetujui** (2026-10-11, commit `c20f525`) |
| PH-08 | Site Admin (Platform Configuration) | Login Site Admin, kelola akun Store Admin, konfigurasi payment gateway (Xendit), konfigurasi shipping provider (RajaOngkir), pengaturan platform | MOD-SITE (SITE-01, SITE-02, SITE-03, SITE-04), MOD-AUTH (SITE-00) | PH-05 disetujui (disarankan setelah PH-06) | **Disetujui** (2026-10-11) |
| PH-09 | Brand Customization (Identitas + Palet + Banner) | Ganti nama brand, logo, favicon, tagline, palet warna (hex), teks footer, banner homepage dari `/site-admin/brand` tanpa mengubah kode | MOD-CONFIG (SITE-05) | PH-08 disetujui (role SITE-00 + area `/site-admin`) | **Disetujui** (2026-10-11) |
| PH-10 | Akun & Notifikasi (Profil + Alamat + Pusat Notifikasi) | Halaman alamat khusus alamat (`/profile/addresses`), halaman akun mandiri (`/profile`), ikon notifikasi di navbar dengan dialog daftar notifikasi + pengaturan, badge belum dibaca | MOD-CUST (CUST-03, revisi UI CUST-01/CUST-02), MOD-NOTIF (NOTIF-02) | PH-07 disetujui (alamat + preferensi sudah jalan); tidak bergantung PH-08/PH-09 | **Disetujui** (2026-10-11, commit `40dcb41`) |

**Phase Checkpoint:**
- **PH-01:** Admin bisa CRUD products, Customer bisa register/login/view products → Foundation ready
- **PH-02:** User bisa add to cart, calculate shipping → Shopping flow ready
- **PH-03:** User bisa checkout (guest + customer), stock reserved → Checkout ready (no payment)
- **PH-04:** Payment flow, webhook, stock deduction work → Payment integration complete
- **PH-05:** Voucher calculation, email, invoice work → Core features complete
- **PH-06:** Reports (5 laporan PRD 4.11), settings + template alasan penolakan, kelola pesanan admin, shipping tracking, tracking pesanan customer tanpa input data (ORDER-08), cancel/refund, pickup, cakupan voucher per produk/kategori, email lanjutan work → MVP complete
- **PH-07:** Customer bisa menyimpan alamat, memilihnya saat checkout, pesan lagi, set/reset password, atur preferensi notifikasi → fitur akun customer ready
- **PH-08:** Site Admin bisa login dan mengonfigurasi platform (payment gateway, shipping provider, akun Store Admin) → kriteria sukses PRD #10 ready
- **PH-09:** Site Admin bisa mengganti identitas brand (nama, logo, favicon, tagline, palet warna, teks footer) dan banner homepage dari `/site-admin/brand` tanpa mengubah kode → brand customization ready
- **PH-10:** Customer punya halaman akun mandiri, halaman alamat khusus alamat, dan pusat notifikasi in-app (daftar + pengaturan) dari ikon navbar → UI akun customer rapi

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
| TASK-08 | Setup Uploadthing: Image upload, storage | PROD-01 | TASK-01 | Selesai | Gate auth terverifikasi: `403` tanpa sesi, `200` dengan sesi; unggah berkas nyata `productImage` terverifikasi 2026-10-14 lewat UI admin (bukti bagian 4.5) |
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
- [x] Uploadthing image upload works — gate auth terverifikasi (`403` tanpa sesi, `200` dengan sesi); unggah berkas nyata endpoint `productImage` **terverifikasi 2026-10-14** lewat UI admin (bukti bagian 4.5). Butir yang diterima apa adanya saat approval PH-01 (2026-10-10) kini tertutup
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
| — | Uploadthing unggah berkas nyata (`productImage`, 2026-10-14) | UI admin `/admin/products/new`: berkas PNG 247 byte → `POST /api/uploadthing?actionType=upload&slug=productImage` `200` (presigned) → `PUT https://sea1.ingest.uploadthing.com/<key>` `200` → pratinjau `<img alt="Gambar produk 1" src="https://jqvuhozget.ufs.sh/f/rhko4DgxpLVA...">`; URL disajikan `200 image/png 247 bytes`. Gate diuji ulang di produksi tanpa sesi → `403 {"message":"Anda harus masuk terlebih dahulu"}` (bukan `500`, jadi token produksi aktif). Berkas uji dihapus setelah verifikasi lewat `UTApi.deleteFiles` | **Lulus** | browser + network trace + curl |
| — | Uploadthing batas endpoint (2026-10-14) | Dengan sesi admin: 1 berkas 5MB → `400 {"message":"Invalid config: FileSizeMismatch"}`; 5 berkas → `400 {"message":"Invalid config: FileCountMismatch"}` (maks `MAX_PRODUCT_IMAGES` = 4) | Lulus | fetch di browser |
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
  approval PH-01, diuji begitu kunci nyata tersedia. **Diperbarui 2026-10-14: butir ini tertutup** — unggah berkas nyata `productImage` terverifikasi lewat UI admin (bukti bagian 4.5). Pengiriman dan pemeriksaan OTP **sudah tidak
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
   - Admin: login di `/login` dengan `storeadmin@flexstore.local` / password yang tercetak saat `pnpm db:seed` → `/admin/products` → Tambah produk → Edit → Hapus
   - Customer: buka `/` dan `/products` → klik produk → lihat detail
   - Akses kontrol: buka `/admin/products` tanpa login → dialihkan ke `/login`
6. **Masalah / batasan:**
   - **OTP tidak lagi jadi masalah.** Pengiriman dan pemeriksaan sudah terbukti end-to-end (rincian bagian 4.5). Satu catatan yang tetap berlaku untuk uji berikutnya: di akun Trial, kirim ke nomor yang **belum** terverifikasi bisa dijawab sukses oleh API sementara pesannya dibuang diam-diam — jadi kalau nanti ada nomor uji selain `+6285813386371`, pastikan nomor itu terdaftar sebagai Verified Caller ID lebih dulu. Untuk nomor yang sekarang dipakai, syarat itu ternyata tidak menghalangi
   - Unggah gambar Uploadthing belum diuji dengan berkas nyata (kunci API masih placeholder); gerbang autentikasinya sudah terverifikasi `403`/`200`. **Dikeluarkan dari daftar butir terbuka saat approval PH-01** — tidak memblokir, diuji saat kunci nyata tersedia. **Diperbarui 2026-10-14: sudah diuji dan lulus** — unggah berkas nyata `productImage` lewat UI admin (bukti bagian 4.5)
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

### 4.8. Revisi pasca-persetujuan PH-01 (2026-10-11)

PH-01 sudah disetujui, tetapi satu celah yang tercatat saat audit dokumen 2026-10-11 dikerjakan atas permintaan pengguna: **input gambar varian tidak ada di form admin**, padahal `ProductVariant.imageUrl` sudah didukung skema, validasi, mutasi, dan dipakai keranjang. Ini revisi pasca-persetujuan, bukan fase baru.

**Perbaikan:**

- `VariantRow` (payload form) mendapat bidang `imageUrl`; `EMPTY_VARIANT` memakai string kosong, dan payload mengubahnya menjadi `null` supaya lolos validasi opsional `variants[].imageUrl`.
- Komponen baru `VariantImagePicker` (`src/components/admin/VariantImagePicker.tsx`): pratinjau 64px + tombol Unggah/Ganti/Hapus, memakai endpoint Uploadthing `productImage` yang sama dengan galeri (gerbang `STORE_ADMIN` sudah ada, tanpa endpoint baru).
- `ProductForm` menampilkan pemilih itu di tiap baris varian (membentang penuh di bawah baris kolom); halaman edit produk mengisi nilai awal dari `ProductVariant.imageUrl`.
- Tanpa perubahan skema dan tanpa perubahan API: `POST`/`PATCH /api/admin/products` sudah menerima `variants[].imageUrl`.

**Batas yang tetap berlaku:** gambar varian tampil di keranjang (fallback ke gambar produk pertama bila kosong). Halaman detail produk belum menukar galeri mengikuti varian terpilih; itu keputusan terpisah bila diinginkan.

**Verifikasi:** `pnpm exec tsc --noEmit` exit 0; `pnpm exec eslint` pada tiga berkas yang tersentuh exit 0. Uji klik-through (unggah berkas nyata) menyusul bersama butir uji unggah Uploadthing yang masih terbuka (bagian 11).

### 4.9. Revisi pasca-persetujuan PH-01 (2026-10-15)

Password akun admin dev sempat lemah (literal lamanya sudah dihapus dari dokumen) dan `pnpm db:seed` tidak dapat menggantinya: `seedAdmin`/`seedSiteAdmin` hanya memanggil `prisma.user.create`, sehingga akun yang sudah ada dilewati dan passwordnya tidak pernah tersentuh. Rotasi sebelumnya (2026-10-10, bagian 10) memakai skrip sekali pakai `prisma/tmp-reset-admin.ts` yang lalu dihapus — bentuknya tidak dapat diulang secara konsisten.

**Perbaikan:** skrip rotasi permanen `prisma/reset-admin-passwords.ts` + perintah `pnpm db:reset-admin-passwords`.

1. **Hanya meng-update akun yang sudah ada** — tidak pernah membuat akun baru. Akun dicari lewat `SEED_ADMIN_EMAIL` / `SEED_SITE_ADMIN_EMAIL` **dan** role yang diharapkan (`STORE_ADMIN` / `SITE_ADMIN`); bila salah satu tidak cocok, seluruh rotasi dibatalkan dalam satu transaksi.
2. Password dari env per peran: `RESET_ADMIN_PASSWORD` (Store Admin) dan `RESET_SITE_ADMIN_PASSWORD` (Site Admin) — **wajib berbeda**, minimal 12 karakter. Alternatif: set `RESET_GENERATE=true` supaya skrip membuat password acak 24 karakter dan mencetaknya sekali (praktis dan tidak menulis password ke `.env.local`).
3. Memakai helper hash yang sama dengan seed (`hashPassword` dari `src/lib/auth/password.ts`, `BCRYPT_ROUNDS = 10`) supaya tidak ada dua implementasi hashing.
4. Password yang diberikan lewat env tidak pernah dicetak (hanya email dan role yang diubah); password acak mode `RESET_GENERATE` dicetak sekali setelah commit. Hash tidak pernah dicetak.

**Batas:** skrip ini untuk dua akun admin yang dikenal seed, bukan alat reset sembarang user. Reset password customer tetap lewat fitur aplikasi (AUTH-05) dan Store Admin tambahan lewat SITE-04.

**Verifikasi:** `pnpm exec tsc --noEmit` exit 0; `pnpm exec eslint prisma/reset-admin-passwords.ts` exit 0. Jalur tolak diuji tanpa mengubah data (exit 1, pesan jelas): tanpa `RESET_*`/`RESET_GENERATE` → "wajib diisi"; kedua password sama → ditolak; password < 12 karakter → ditolak; email tidak ditemukan → transaksi dibatalkan; email Site Admin sebagai target Store Admin → "bukan STORE_ADMIN" dan rollback. Mode `RESET_GENERATE=true` diuji dengan email tidak ditemukan sehingga password acak tidak tercetak dan tidak ada perubahan. Rotasi Site Admin yang sebenarnya menunggu eksekusi pengguna (butir 9 bagian 11).

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
| Di luar lingkup | Menyimpan pilihan ongkir ke pesanan (PH-03), lacak kiriman (SHIP-02) |
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
7. **Invoice = halaman HTML siap-cetak** (`/orders/[id]/invoice` + `PrintButton` `window.print()`), bukan `@react-pdf/renderer`. Deviasi dari SDD 4.10 (lihat bagian 10). **Revisi 2026-10-11:** tautan "Lihat Invoice" dan halaman invoice hanya tersedia untuk pesanan **lunas** (`payment.status === "PAID"`) — pesanan yang belum dibayar atau dibatalkan sebelum bayar tidak menampilkan invoice (keputusan di bagian 10).

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

### 8.6. Revisi pasca-persetujuan PH-05 (2026-10-11)

PH-05 sudah disetujui, tetapi akses invoice dikoreksi setelah dilaporkan pengguna. Tidak ada fase baru: ini revisi INV-01 di lingkup halaman pesanan (PH-03) + invoice (PH-05). Keputusan lengkap ada di bagian 10.

**Masalah:** tombol "Lihat Invoice" dirender tanpa syarat status di blok Pembayaran `/orders/[id]`, sehingga tepat setelah checkout ia tampil menumpuk di atas tenggat + tombol "Bayar". Pesanan yang dibatalkan sebelum bayar pun masih menawarkan invoice, dan halaman `/orders/[id]/invoice` bisa dibuka lewat URL langsung.

**Keputusan pengguna:** invoice hanya untuk pesanan **lunas**.

**Perbaikan:**

- Tautan "Lihat Invoice" di `/orders/[id]` dirender hanya bila `order.payment?.status === "PAID"`.
- Halaman `/orders/[id]/invoice` menjawab `notFound()` bila status pembayaran bukan `PAID` (URL langsung pun ditolak). Berlaku juga untuk pesanan lunas yang kemudian dibatalkan + refund — bukti transaksinya tetap sah.
- PRD 3.1.I dan 4.10 diberi catatan pembatas (revisi 1.3). Tanpa perubahan skema.

**Verifikasi:** `pnpm exec tsc --noEmit` exit 0; `pnpm exec eslint` pada kedua berkas exit 0. Uji klik-through menunggu pengguna: pesanan belum bayar → tombol tidak ada; pesanan lunas → tombol ada; URL invoice pesanan belum bayar → `404`.

---

## 9. Rincian Fase: PH-06 — Polish MVP (Reports + Config + Advanced)

### 9.1. Tujuan dan batas

- **Tujuan:** Admin reports work, store settings work, shipping tracking works, cancel/refund order works, voucher bisa dibatasi ke produk/kategori tertentu, admin bisa mengelola pesanan dan statusnya, email lanjutan terkirim, customer bisa melacak pesanan tanpa input data (ORDER-08)
- **Termasuk:** 
  - SHIP-02 (Shipping Tracking), ORDER-05 (Cancel Order), ORDER-06 (Refund), REPORT-01 (Sales Report), CONFIG-01 (Store Settings)
  - Lanjutan VOUCH-01 (cakupan voucher: produk eligible, produk dikecualikan, kategori — PRD 5.4 butir 1-3)
  - ORDER-07 (Admin Order Management — ID baru dari audit 2026-10-10: daftar + detail pesanan di `/admin/orders`, ubah status pesanan `SHIPPED`/`COMPLETED` + isi nomor resi, lihat status pembayaran — PRD 2.3/3.1.K/4.4). Tanpa fitur ini tidak ada pemilik transisi pesanan ke `SHIPPED`/`COMPLETED`; SHIP-02/ORDER-05/ORDER-06 di fase ini menggantung padanya sebagai tulang punggung UI admin
  - SHIP-03 (Pickup — PRD 3.1.F/3.1.J/4.7: opsi ambil di toko bila diaktifkan, tanpa ongkir)
  - ORDER-08 (Tracking Pesanan Customer — PRD 2.2/3.1.H: `/track-order` jadi dua jalur — guest isi form nomor pesanan + nomor HP (ORDER-04, tidak berubah), customer login langsung lihat daftar seluruh pesanan dalam perjalanan tanpa input; tombol "Lacak Pesanan" di `/orders` mengarah ke detail tracking per pesanan yang session-scoped, bukan ke form. Keputusan lengkap: bagian 10, baris ORDER-08)
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
| V7 | Unggah berkas nyata endpoint `refundProof` (ORDER-06, diuji 2026-10-14) | Sesi Store Admin: `POST /api/uploadthing?actionType=upload&slug=refundProof` → `200` (presigned) → `PUT sea1.ingest.uploadthing.com` multipart field `file` → `200` → `https://jqvuhozget.ufs.sh/f/rhko4DgxpLVA2twAjKstE8H5qmXwlReAhBrPc9KanNgku1Df` disajikan `200 image/png 247 bytes`; 2 berkas satu permintaan → `400 {"message":"Invalid config: FileCountMismatch"}`; badan mentah (`Content-Type: image/png`) → `415`; produksi tanpa sesi → `403 {"message":"Anda harus masuk terlebih dahulu"}`. Berkas uji dihapus lewat `UTApi.deleteFiles` (`{"success":true,"deletedCount":1}`, 11 → 10 berkas). Jalur UI lengkap terbukti sudah pernah berjalan: refund `FS-20261013-87S2YV` `COMPLETED` + `proofUrl` asli tersaji `200 image/png 22910 bytes` |

Catatan: verifikasi V3-V4 adalah otomatis. Unggah bukti refund (V7) sudah terbukti dengan berkas nyata. Uji klik-through manual sisanya (admin ubah status → resi → email → pickup → tracking customer) **belum dijalankan** dan perlu dilakukan pengguna sebelum approval.

### 9.5. Laporan untuk review

**Status:** PH-06 (SHIP-02, SHIP-03, ORDER-05, ORDER-06, ORDER-07, ORDER-08, REPORT-01, CONFIG-01, lanjutan VOUCH-01/PROD-01/NOTIF-01) selesai dikerjakan, **siap direview**.

**Yang bisa dicoba:**

1. Admin login → **Dasbor** (ringkasan 30 hari + status pesanan) → **Pesanan** (filter status + cari) → buka detail → **Tandai Dikirim** (isi resi) → **Tandai Selesai**.
2. Admin → **Template Alasan** (tambah/ubah/hapus) → **Pengaturan Toko** (informasi, kebijakan, aktifkan pickup).
3. Admin → **Laporan** (5 laporan, rentang tanggal).
4. Customer: `/orders` → tombol **Lacak** pada pesanan → `/orders/[id]/tracking`; atau `/track-order` menampilkan pesanan dalam perjalanan tanpa input.
5. Customer: detail pesanan → **Ajukan Pembatalan** (alasan) → admin **Setujui** (buat refund) atau **Tolak** (pilih template) → admin unggah bukti refund → status refund jadi Selesai.
6. Checkout: bila pickup diaktifkan, muncul pilihan **Ambil di toko** (ongkir 0, cukup nama + HP; label "Ambil di..." memakai `brandName` — lihat bagian 10).
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
| 2026-10-10 | **Riwayat, tidak lagi berlaku: berat paket dihitung seragam** `total kuantitas x SHIPPING_WEIGHT_PER_ITEM_GRAM` (default 1000 gram) | Ongkir belum memperhitungkan berat per produk | Skema produk belum punya kolom berat; ditinjau kembali saat dibutuhkan. Dicatat sebagai pertanyaan terbuka di Spesifikasi SHIP-01. **Digantikan pada hari yang sama** oleh keputusan "Berat paket dipindah ke data produk" (baris di bawah): berat kini per varian (`ProductVariant.weightGram`), env hanya cadangan | `src/lib/shipping/index.ts`, `docs/03` SHIP-01 bagian 13 |
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
| 2026-10-11 | **Halaman detail tracking customer `/orders/[id]/tracking` dibangun (ORDER-08).** User: "tambahkan dulu". Sebelumnya: `/track-order` dual mode (guest form / customer list in-transit via `getInTransitOrdersForUser`) + navbar Link "Lacak" untuk login sudah ada, tetapi semua tombol Lacak (navbar, `/track-order`, daftar pesanan) menunjuk ke rute yang belum ada → 404 | Link Lacak tanpa tujuan; fitur tracking customer setengah jadi | Halaman session-scoped (pola `/orders/[id]`: null → 404 generik, keberadaan pesanan tidak bocor): kop status badge + riwayat milestone dari timestamp nyata (`createdAt`, `Payment.paidAt`, `shippedAt`, `completedAt` — tanpa tabel riwayat status) + kartu pengiriman (kurir, resi `trackingNumber`, ETD, tujuan). Guest tidak berubah: tetap form `/track-order` (ORDER-04). `getTrackingOrderForUser` include `payment`; komentar OrderListItem dibetulkan (tombol Lacak bukan placeholder) | `src/app/(storefront)/orders/[id]/tracking/page.tsx`, `src/lib/orders/admin.ts`, `docs/02` bagian 5 |
| 2026-10-11 | **Validasi nomor HP tidak lagi nyangkut ke +62 — nomor internasional (E.164) diterima.** User: "market memang indonesia, tapi saya udah bilang di prd kalo proyek ini bisa memperluas jangkauan" — merujuk PRD 7.8 (baris 615-617): primary Indonesia + "Future: International payment expansion" | `phoneSchema` sebelumnya refine `^\+62\d{8,11}$` menolak semua nomor luar negeri ("Nomor HP tidak valid") — penghalang jangkauan yang dijanjikan PRD sendiri; semua konsumen (OTP, login via HP, HP penerima, alamat tersimpan, voucher per-HP, lacak guest) nyangkut ke satu schema ini | **Dilebarkan di satu titik** (`phoneSchema`/`normalizePhone`, `src/lib/auth/validation.ts`): format lokal Indonesia tetap nyaman (0812…/62812… → +62), internasional diterima wajib awalan `+` + 8-15 angka (E.164, ITU-T); input tanpa `+` tetap dianggap lokal Indonesia (tanpa `+` negara tak terdeteksi). Penyimpanan tetap ter-normalisasi satu format — konsistensi voucher per-HP, guest access, dan lacak tidak berubah. Catatan ops: Twilio Verify menyerap nomor internasional bila Geo Permissionsnya diaktifkan di konsol — konfigurasi terkredensial, bukan kode | `src/lib/auth/validation.ts` (phoneSchema), PRD 7.8 |
| 2026-10-11 | **Validasi nomor HP dikembalikan Indonesia-only (+62), supersede baris sebelumnya di hari yang sama.** User: "kalo begitu better di bikin login pakai nomor indo dulu deh, karena fokus masih indo, untuk pengembangan inter bisa dicatat dulu dikomentasi yang diperlukan" | Membuka E.164 memancing ekspektasi alur internasional yang belum ada — shipping masih RajaOngkir domestic-only dan payment internasional masih "Future" (PRD 7.8); nomor luar negeri yang lolos validasi jadi janji kosong di checkout | **Refine dikembalikan ke `^\+62\d{8,11}$`** (`phoneSchema`). Infrastruktur tidak dibuang: `normalizePhone` tetap melewatkan `+…` apa adanya, rencana pembukaan (E.164 `/^\+\d{8,15}$/`, kurir JNE/TIKI/POS, Geo Permissions Twilio) dicatat di komentar `normalizePhone` agar tinggal membuka satu refine saat jangkauan internasional diaktifkan. Login domestik tetap nyaman: `0812…`/`62812…` → `+62` | `src/lib/auth/validation.ts` (phoneSchema), PRD 7.8 |
| 2026-10-11 | **`StoreSetting.storeName` dihapus — nama toko tunggal = `brandName`.** User: "better hapus store name kalo kurang berguna, yang masih membutuhkan alihkan ke brand name, ini butuh pembaruan di dokumentasi juga kan". Latar: konsep 1 deployment = 1 brand = 1 store (PRD revisi 1.2) membuat dua nama tidak masuk akal; `storeName` lahir di CONFIG-01 sebelum revisi 1.2 ketika identitas masih di Store Admin dan tidak pernah dievakuasi | Audit pemakaian: `storeName` hanya konsumen nyata label pickup "Ambil di ..." di checkout; identitas di 16+ titik (header, footer, invoice, 7 email, SEO, banner, judul auth) sudah memakai `brand.brandName`. Dua nama = warisan dua era desain dan bisa menyimpang (Store Admin ubah `storeName`, tampilan brand tetap `brandName`) | Field dipangkas dari form + schema + queries + mutasi (`src/lib/config/*`, `StoreSettingsForm.tsx`); label pickup dialihkan ke `brandName` (checkout page sudah `getBrandSetting()`); kolom `store_settings.storeName` di-drop lewat migrasi `20261011160000_drop_store_settings_store_name` (`migrate deploy`). Docs: PRD 2.3 + 3.1.J, SITE-05 bagian 13, catatan desain PH-09 no. 7, bagian 9 no. 6 | `src/lib/config/*`, `src/components/admin/StoreSettingsForm.tsx`, `src/components/checkout/CheckoutForm.tsx`, `src/app/(storefront)/checkout/page.tsx`, `prisma/schema.prisma` |
| 2026-10-11 | **Pola navigasi "kembali" distandardisasi: link back di atas konten lewat `BackLink` komponen; CTA bawah berbahasa maju.** User: "ada yang diletakkan di atas ada juga yang di bawah. menurut lu, hal ini bisa diterima jika harus 'UX first'?" — audit menemukan 5 halaman dengan back link atas dan 2 di bawah (`/orders/[id]` baris 287, `/set-password` baris 48), tiap halaman menyalin `Link` dengan class sendiri | Back link di bawah melanggar ekspektasi navigasi (orientasi & muscle memory = kiri-atas); duplikasi class per halaman = pola "dua nama" yang baru dibersihkan. Pengecualian diperiksa ulang: "Kembali ke halaman masuk" di `/set-password` ternyata recovery CTA di dalam kartu error token — posisinya benar, tidak diubah | **Komponen `src/components/layout/BackLink.tsx`** (Server Component, gaya satu sumber) dipakai di `/profile/addresses`, `/admin/orders/[id]`, `/orders/[id]`, `/orders/[id]/tracking`, `/orders/[id]/invoice`. Tautan bawah `/orders/[id]` dipindah ke atas (customer: "Kembali ke daftar pesanan" → `/orders`; guest: "Lacak pesanan lain" → `/track-order` — keduanya memang tempat datangnya). `/set-password` dibiarkan (recovery in-context) | `src/components/layout/BackLink.tsx` + 5 halaman `page.tsx` |
| 2026-10-11 | **Perluasan pola BackLink ke form admin daun (lanjutan baris BackLink).** User: "boleh 4 itu" — usulan awal 4 halaman: product slug + 2 form produk + 2 form voucher | Audit ulang menemukan `/products/[slug]` **sudah punya breadcrumb** ("Beranda / Produk / nama") — back link di sana justru redundan, dibatalkan. Empat form admin (`products/new`, `products/[id]/edit`, `vouchers/new`, `vouchers/[id]/edit`) adalah daun tanpa jalan pulang selain sidebar | `BackLink` "Kembali ke produk" / "Kembali ke voucher" dipasang di atas `PageHeader` (pola `/admin/orders/[id]`). Daftar kandidat yang TIDAK diberi back link beserta alasannya tercatat di percakapan: daftar/top-level (navbar jadi nav), site-admin (sidebar), auth transaksional (alar linear) | 4 halaman `page.tsx` admin + `(storefront)/checkout` ("Kembali ke keranjang" — user menegaskan setelah keputusan: "bukankah tadi lu bilang di halaman checkout juga?"; item ini memang sempat tercatat opsional lalu tertinggal saat kata "4" dipakai) |
| 2026-10-11 | **Default pemilih alamat tersimpan di checkout = alamat Utama, bukan "Isi manual".** User: "ada fitur alamat utama di sistem ini, namun pada halaman checkout value utamanya malah 'isi manual' bukan 'alamat utama'" | Desain TASK-72 awal: satu alamat → terisi otomatis; lebih dari satu → user memilih sendiri dengan default "Isi manual". Alamat Utama jadi fitur yang tidak bernilai di halaman paling penting — user dengan 5 alamat tetap mengetik ulang tiap checkout meski sudah menandai Utama | `defaultAddress` kini: tepat satu → alamat itu; lebih dari satu → alamat `isPrimary` → seluruh isian (nama, HP, destinasi, alamat) terisi otomatis; "Isi manual" tetap opsi di select, bukan default. Guest tidak berubah | `src/components/checkout/CheckoutForm.tsx` |
| 2026-10-11 | **Simpan alamat manual dari checkout (fitur CUST-01 lanjutan).** User: "jika customer belum memiliki alamat tersimpan dan melakukan pengisian alamat untuk memesan, sediakan fitur untuk save alamat" | Customer yang mengisi alamat manual harus mengetik ulang di `/profile/addresses` — alamat hasil checkout tidak pernah sampai ke daftar | Checkbox "Simpan alamat ini ke daftar alamat saya" + input label, hanya muncul untuk: mode customer (guest tidak punya daftar), fulfillment kirim (pickup tidak punya alamat), isi manual (alamat tersimpan terpilih = tidak perlu), dan daftar < 5 alamat. Simpan berjalan **setelah pesanan sukses**, best-effort ke API `/api/customer/addresses` yang sudah ada — kegagalan (mis. limit keserempetan) tidak membatalkan checkout, API order tidak berubah | `src/components/checkout/CheckoutForm.tsx`, `src/app/(storefront)/checkout/page.tsx` |
| 2026-10-11 | **Keputusan desain UI pemilihan alamat tersimpan di checkout (dasar TASK-72, PH-07).** User: "jika sudah ada alamat tersimpan maka akan menampilkan alamat tersimpan dan jika ada lebih dari 1 alamat tersimpan maka ada component yang perlu ditrigger untuk menampilkan daftar alamat dan memilih alamat yg sesuai. namun jika tidak ada, maka UI saat ini sudah tepat" | Menetapkan bentuk UI integrasi checkout per jumlah alamat tersimpan: tepat satu alamat ditampilkan langsung dengan isian terisi, lebih dari satu lewat komponen pemicu yang membuka daftar alamat untuk dipilih, dan nol alamat tetap memakai UI manual saat ini (`DestinationPicker`) tanpa perombakan | Disetujui sebagai dasar TASK-72 bersama keputusan desain PH-07 lainnya. Guest selalu jatuh ke jalur manual (selaras bagian 12.1: alamat guest tidak termasuk). Detail komponen (bentuk pemicu, posisi daftar, perilaku pilih) ditetapkan saat spesifikasi CUST-01 dan TASK-72 dirinci | `docs/04` bagian 12.1, 12.2 (TASK-72) |
| 2026-10-11 | **Keputusan cakupan PH-09 (jawaban pengguna): palet warna, bukan hanya primary; dan banner homepage.** User mengonfirmasi enam item identitas brand (nama, logo, favicon, tagline, warna, teks footer), lalu: "pengaturan warna juga jangan hanya primary saja yang bisa di atur, buat fitur palette warna dan bisa memasukkan kode warna. kustomisasi banner masuk akal? sebelumnya sudah ada rencana untuk banner itu" — banner memang sudah tercatat di PRD 3.1.J, 4.12, 7.6 sejak awal tetapi tidak pernah diimplementasi (hero homepage masih hardcode di `(storefront)/page.tsx`) | Menentukan jumlah slot warna, ruang lingkup penerapan, dan isi banner | Tiga keputusan user: (a) palet = **9 grup inti / 15 kolom hex** (primary, secondary, accent, background+foreground, muted, border, destructive, success), token `card`/`popover`/`input`/`ring` tetap bawaan; (b) warna berlaku **seluruh aplikasi** (admin ikut, satu override `:root`); (c) banner **lengkap** — gambar (Uploadthing) + judul + teks + tombol (label + link) + sakelar aktif, hero teks default bila mati | `docs/03` SITE-05 bagian 4, 9; `docs/04` bagian 14.2 |
| 2026-10-11 | **Konsep Site Admin direvisi: peran utamanya kustomisasi brand per deployment (1 deployment = 1 brand store), bukan knop infrastruktur.** Pengguna menolak konsep awal PH-08 yang berpusat pada rahasia env + knob operasional; cakupan baru = identitas brand + kelola akun Store Admin, sementara konfigurasi payment/shipping tetap dipertahankan sementara. Pemeriksaan kode menemukan "FlexStore" hardcode di 14 titik TSX + 8 titik TS (UI, metadata, kop invoice, 7 subjek email, footer email, fallback `EMAIL_FROM`) | Identitas brand tidak bisa diubah tanpa mengedit kode; PRD 2.3/3.1.J masih menempatkan logo/banner/warna di tangan Store Admin | **PRD direvisi v1.2:** kustomisasi brand pindah ke bagian 2.4 (Site Admin), 2.3 dirapikan, 3.1.J dan 7.6 diperluas (favicon, tagline, teks footer, palet hex, banner lengkap). Fitur baru **SITE-05** ditulis di `docs/03` (v1.6) + fase **PH-09** di bagian 14 | `docs/01_PRD.md` (revisi 1.2), `docs/03` SITE-05, `docs/04` bagian 3 dan 14 |
| 2026-10-11 | **Detail Uploadthing dan gambar dilengkapi ke `docs/03` (PROD-01); temuan: input gambar varian tidak ada di form admin.** User: "catat detail uploadthing yang seharusnya ada di doc". Pemeriksaan kode: `ProductForm` tidak punya input `imageUrl` varian (`VariantRow` = SKU/nama/harga/stok/berat; payload tidak mengirim field); field hanya terpakai di cart (fallback `product.images[0]`). `sizeChartUrl` juga tidak pernah tercatat di `docs/03` | `docs/03` PROD-01 tidak memuat detail unggahan (endpoint, gerbang, batas 4MB), size chart, maupun `imageUrl` varian — padahal ketiganya didukung kode; PRD 114 melebih kenyataan karena menandai gambar varian sebagai selesai | Ditulis ke PROD-01: baris `sizeChartUrl` dan `variants[].imageUrl`, catatan unggahan Uploadthing, penyimpanan `SIZE_CHART`, serta status UI varian. User memutuskan mencabut centang PRD untuk gambar varian yang belum selesai: `docs/01` bagian 3.1.A dan 7.4 kini menandainya belum selesai; implementasi UI varian tidak termasuk perubahan ini. `UPLOADTHING_TOKEN` sudah terisi (dicek 2026-10-11, 168 karakter), jadi penghalang kunci sudah lewat; unggah berkas nyata tetap belum diuji. **Dicabut lagi pada hari yang sama** oleh baris berikutnya: input gambar varian diimplementasikan, centang PRD dipulihkan | `docs/01` bagian 3.1.A/7.4; `docs/03` PROD-01; `docs/04` bagian 11; `src/components/admin/{ProductForm,ImageUploader}.tsx`, `src/lib/uploadthing/core.ts` |
| 2026-10-11 | **Penyelarasan dokumen dengan implementasi (audit 2026-10-11).** Dipicu permintaan user agar dokumen dicek terhadap kode lalu disamakan | Temuan: `README.md` masih menggambarkan keadaan PH-05; SDD memuat baris usang (`middleware.ts` padahal Next.js 16 memakai `proxy.ts`, dependensi `@react-pdf/renderer`, status Resend "Direncanakan (PH-05)", redaksi "Store Admin or Site Admin", perintah `pnpm test`/`test:e2e` yang tidak ada, nama model `StoreSettings`/`PlatformSettings`/`Shipping`); indeks `docs/03` masih menandai fitur yang sudah jalan sebagai "Draft"/"Belum dirinci" dan belum memuat ORDER-07 serta SHIP-03; `docs/06` belum punya bagian Site Admin; `.env.example` baris `RAJAONGKIR_API_KEY` bersufiks nyasar. | Dokumen drift: agent berikutnya tidak bisa memakai `docs/03` dan `README.md` sebagai sumber kebenaran, pola yang sama dengan audit 2026-10-10 | Diselaraskan 2026-10-11: indeks `docs/03` diberi status "Terimplementasi (PH-XX)", baris ORDER-07 dan SHIP-03 ditambahkan, checkpoint Phase 9 ditulis; README disegarkan ke PH-08; SDD, `docs/06`, `AGENTS.md`, dan `.env.example` ikut dirapikan. **Keputusan user:** bagian rinci fitur yang belum punya spesifikasi `docs/03` (AUTH-02/03, PROD-03/04/05 dari PH-01; VOUCH-01/02, NOTIF-01, INV-01 dari PH-05; SHIP-02/03, ORDER-05..08, REPORT-01, CONFIG-01 dari PH-06) dicatat sebagai **utang dokumentasi** dan ditulis dalam satu batch setelah PH-09 atau saat penutupan MVP, bukan sekarang | `README.md`, `docs/02_SDD.md`, `docs/03_SPESIFIKASI_FITUR.md`, `docs/06_SETUP_KREDENSIAL.md`, `AGENTS.md`, `.env.example` |
| 2026-10-11 | **Perbaikan UI akun customer (keputusan pengguna): halaman alamat dipisah, profil berdiri sendiri, notifikasi jadi dialog dari ikon navbar.** User: "gua mau halaman alat tersimpan hanya fokus untuk alamat, tidak include profil dan notifikasi. kemudian halaman profil akan berdiri sendiri nantinya, sedangkan notifikasi gua mau menambahkan pop up atau dialog yang muncul dari icon notifikasi di navbar" | Kode saat ini menumpuk judul + nama/email + "Alamat Tersimpan" + "Preferensi Notifikasi" dalam satu halaman `/profile`; PRD 4.9 hanya mengatur email sehingga daftar notifikasi in-app belum punya dasar kebutuhan | Lima keputusan pengguna: (a) route alamat `/profile/addresses` — sub-halaman, bisa dibuka langsung tanpa lewat `/profile`; (b) `/profile` jadi halaman akun mandiri berisi info akun saja (nama, email, ubah password) = CUST-03; (c) ikon notifikasi di navbar membuka dialog berisi **daftar notifikasi + pengaturan**; (d) daftar notifikasi **diturunkan dari data pesanan**, tanpa tabel `Notification` baru — lima kejadian: pesanan dibuat & belum dibayar (`WAITING_PAYMENT`), pesanan terkirim pertama kali (`shippedAt`), pesanan sudah tiba (`completedAt`), pesanan dibatalkan sebelum bayar (`canceledAt` tanpa bayar), refund selesai (`Refund.status = COMPLETED`); (e) badge "belum dibaca" memakai penanda `notif:last-seen:{userId}` di Redis (semua-atau-tidak, bukan per entri). PRD direvisi **v1.3** (notifikasi in-app masuk 3.1.I, 4.8, 4.9, 7.7). Fase baru **PH-10** (bagian 15) dengan spek `docs/03` CUST-03 dan NOTIF-02. **Dokumentasi ditulis sekarang, implementasi menyusul** | `docs/01_PRD.md` (revisi 1.3), `docs/02_SDD.md` 4.8/4.9/5, `docs/03` CUST-01/CUST-02/CUST-03/NOTIF-02, `docs/04` bagian 3, 10, 15; `README.md` |
| 2026-10-11 | **Akses invoice dibatasi ke pesanan lunas.** User: "masalah muncul di order/id atau detail order setelah checkout, yang mana belum dibayar tapi sudah muncul tombol 'lihat invoice' tepat di atas tombol 'bayar'" dan "tombol seharusnya muncul ketika lunas saja, bahkan saat pesanan dibatalkan sebelum membayar tetap ada tombol 'lihat invoice'. saya tidak yakin lihat invoice lumrah di saat seperti ini" | Tombol "Lihat Invoice" dirender tanpa syarat status di blok Pembayaran `/orders/[id]`, tepat di atas tenggat + tombol "Bayar" (baris 179-184 vs 185-200) — pembeli melihat "invoice" untuk dokumen yang belum ada, dan pesanan batal sebelum bayar pun masih menawarkannya. Halaman `/orders/[id]/invoice` juga bisa dibuka lewat URL langsung | **Keputusan pengguna:** invoice hanya untuk pesanan **lunas**. Diterapkan: tautan dirender hanya bila `order.payment?.status === "PAID"`; halaman invoice menjawab `notFound()` bila status pembayaran bukan `PAID` (berlaku juga untuk pesanan yang lunas lalu dibatalkan + refund, karena bukti transaksinya tetap sah). PRD 3.1.I dan 4.10 diberi catatan pembatas (revisi 1.3). Tanpa perubahan skema | `src/app/(storefront)/orders/[id]/page.tsx`, `src/app/(storefront)/orders/[id]/invoice/page.tsx`, `docs/01` 3.1.I/4.10, `docs/04` 8.2 |
| 2026-10-11 | **Ganti email customer wajib verifikasi ulang.** User: "ganti email wajib verifikasi ulang" (dalam rangka merinci PH-10) | CUST-03 versi awal menyimpan email baru langsung saat `PATCH /api/customer/profile`, dan justru menaruh "verifikasi ulang email setelah ganti email" di daftar **tidak termasuk** (bagian 12) — alamat salah bisa dipakai tanpa bukti kepemilikan, sementara jalur set-password (PH-07) sudah punya pola token sekali pakai | **Keputusan pengguna:** perubahan email tidak langsung tersimpan. `PATCH` menyimpan permintaan lalu mengirim tautan verifikasi ke email baru; `User.email` baru berubah setelah tautan dibuka (`POST /api/auth/verify-email`). Email lama tetap aktif sampai verifikasi selesai; permintaan baru membatalkan tautan sebelumnya (satu tautan aktif per akun); token di Redis (pola `src/lib/auth/tokens.ts`), TTL 24 jam, batas 3 permintaan/jam; email bentrok saat verifikasi → `409 EMAIL_IN_USE`. Spek CUST-03 direvisi (bagian 4, 5, 6, 7, 8, 9, 10, 11, 12, 13; AC-CUST-03-08..10), PRD direvisi **v1.4**, task baru **TASK-110** di bagian 15.3. Tanpa perubahan skema Prisma | `docs/03` CUST-03, `docs/01` 4.8, `docs/04` 15.1/15.2/15.3/15.4 |
| 2026-10-11 | **Input gambar varian ditambahkan ke form admin produk (revisi PH-01).** User: "perbaiki nomor 1. dulu" — merujuk temuan audit hari yang sama: "input gambar varian tidak ada di form admin" | `ProductForm` hanya mengirim SKU/nama/harga/stok/berat, sehingga `variants[].imageUrl` selalu `null` lewat form meski skema, validasi, mutasi, dan keranjang sudah mendukungnya; PRD 3.1.A/7.4 sudah mencabut centangnya karena itu | Ditambahkan `VariantImagePicker` (satu berkas opsional per baris varian, endpoint Uploadthing `productImage` yang sama dengan galeri) plus bidang `imageUrl` pada `VariantRow`, `EMPTY_VARIANT`, payload form (`""` → `null`), dan nilai awal halaman edit. Tanpa perubahan skema maupun API. Centang PRD 3.1.A dan 7.4 **dipulihkan** (PRD revisi **v1.5**); spek `docs/03` PROD-01 diperbarui (bagian 4, 9, 10, 12) | `src/components/admin/{ProductForm,VariantImagePicker}.tsx`, `src/app/admin/products/[id]/edit/page.tsx`, `docs/01` 3.1.A/7.4, `docs/03` PROD-01, `docs/04` 4.8 |
| 2026-10-12 | **Autocomplete form login disamakan ke standar spec HTML (`username` + `current-password`), supersede keputusan `off`/`new-password`.** User: "coba cek halaman login apakah klaim ini tepat?" (laporan Proton Pass mengira halaman login adalah halaman register), lalu "idealnya 2 atau 3?" | Token `new-password` memang sengaja dipasang kemarin untuk mematikan prefill browser setelah logout (form "lengket"); akibat sampingannya baru ketahuan: semua password manager membaca token itu sebagai sinyal halaman pendaftaran sehingga menawarkan bikin password baru, bukan isi kredensial. Prefill "lengket" sebenarnya urusan setting autofill di sisi pengguna — perilaku yang diharapkan kebanyakan user justru kredensial tersimpan yang mudah diisi | `LoginForm.tsx`: field identifier `autoComplete="off"` → `"username"`, field password `"new-password"` → `"current-password"`, atribut `autoComplete="off"` di tag `<form>` dihapus. Komentar penjelas di-update. Audit seluruh form auth: `RegisterForm`/`ResetPasswordForm`/`SetPasswordForm` tetap `new-password` (memang benar untuk alur buat/password baru), `ChangePasswordForm` sudah `current`+`new`, OTP sudah `one-time-code` — LoginForm satu-satunya outlier | `src/components/auth/LoginForm.tsx` |
| 2026-10-13 | **Sinkronkan README dengan Implementation Plan dan koreksi keterangan "privat".** User menanyakan arti catatan tersisa sesi paralel ("Tinggal dua hal di luar file ini: sinkronkan README FlexStore dengan Implementation Plan (status PH-08 sampai PH-10 dan keterangan \"privat\")") lalu menegaskan repo sudah public (tangkapan layar Danger Zone GitHub) | README masih berkisah sampai PH-08: daftar fitur tanpa hasil PH-09/PH-10, status "PH-08 siap direview; PH-09/PH-10 dalam rencana", alur demo menempatkan preferensi notifikasi di `/profile`, dan bagian Lisensi menulis "Repo privat" padahal `Firmxn/flexstore-web` sudah public | README disegarkan: fitur dan status sampai PH-10 (semua disetujui), alur demo #5 (alamat di `/profile/addresses`, akun di `/profile`, notifikasi lewat ikon lonceng) dan #7 (brand di `/site-admin/brand`), pohon struktur, serta bagian Lisensi kini menyatakan repo public dan belum berlisensi — tanpa berkas LICENSE hak cipta bawaan berlaku; lisensi (mis. MIT) menyusul bila diputuskan. Catatan tersebut diduga catatan serah-terima sesi paralel; `contect.md` di root kosong dan tidak berisi teks itu | `README.md` |
| 2026-10-14 | **Email akun Store Admin di-seed diganti `admin@flexstore.local` → `storeadmin@flexstore.local`** (disamakan pola `siteadmin@...`). User: "ganti jadi storeadmin@flexstore.local biar sama kayak site admin. eh btw sekarang udah di deploy. masih pake .local?" | `.env.local` saja tidak cukup — seed idempoten (skip bila email sudah ada), jadi akun lama di database tetap memakai email lama; nama email lama juga tercatat di beberapa dokumen | `SEED_ADMIN_EMAIL` di `.env.local` diganti; rename database lewat skrip sekali pakai Prisma (id `9b7ba243-...`, skrip dihapus setelah dipakai); fallback default di `prisma/seed.ts` + rujukan di `docs/02`/`docs/06`/`docs/04` diselaraskan. Pertanyaan ".local di produksi" dijawab: TLD `.local` hanya nama login internal (akun admin tidak menerima email — tidak ada kode yang mengirim email ke admin), jadi tidak berpengaruh pada deploy | `.env.local`, `prisma/seed.ts`, `docs/02_SDD.md`, `docs/06_SETUP_KREDENSIAL.md` |
| 2026-10-15 | **Skrip rotasi password akun admin dijadikan permanen** (`prisma/reset-admin-passwords.ts` + `pnpm db:reset-admin-passwords`); menggantikan skrip sekali pakai `prisma/tmp-reset-admin.ts` (2026-10-10) yang bentuknya tidak dapat diulang. Dipicu permintaan user: "bantu gua brainstorming ... password sekarang terlalu lemah" lalu "kerjakan dokumen dulu, lalu skrip" | `seedAdmin`/`seedSiteAdmin` hanya `prisma.user.create`, jadi akun lama tidak pernah diubah passwordnya dan rotasi hanya mungkin lewat skrip manual yang mudah kehilangan bentuknya | **Keputusan:** skrip permanen yang sempit — hanya update akun yang sudah ada (verifikasi email + role, satu transaksi), env per peran `RESET_ADMIN_PASSWORD` / `RESET_SITE_ADMIN_PASSWORD` yang wajib berbeda dan min 12 karakter (atau `RESET_GENERATE=true` untuk password acak 24 karakter yang dicetak sekali), dan tidak membuat akun baru. Memakai helper hash yang sama (`src/lib/auth/password.ts`). Password literal lama (`123456`) dihapus dari dokumen (aturan repo: jangan tulis kredensial). Rotasi Site Admin yang sebenarnya menunggu eksekusi pengguna | `prisma/reset-admin-passwords.ts`, `package.json`, `.env.example`, `docs/06` bagian 8, SDD section 12, `docs/04` bagian 4.9 |
| 2026-10-15 | **CART-05: klik "Keranjang"/"Beli" pada kartu produk multi-varian wajib membuka dialog pemilihan varian.** User: "setiap klik salah satu tombol tersebut dan produk memiliki varian, user bisa memilih varian yang diinginkan. buat opsi pemilihan ini dalam sebuah dialog/popup/modal yang menampilkan sesimpel nama produk, gambar, varian yang bisa dipilih, tidak perlu se detail detail produk. berikan juga 'link' dengan UI seperti 'back link' untuk dapat melihat jika ada size chart atau lainnya. buat dokumentasi dulu" | `ProductCardActions` (baris 8-11) langsung memakai "varian pertama yang stoknya tersedia" — pembeli tidak sempat memilih varian dari katalog/beranda, hanya bisa dari halaman detail | Pola "dokumen dulu, implementasi menyusul" (pola PH-09/PH-10). Spek `docs/03` **CART-05** ditulis (13 bagian + AC-CART-05-01..09): dialog menampilkan nama produk, gambar sampul, daftar varian (stok 0 disabled); CTA "Keranjang" (masuk keranjang, CART-01) dan "Beli" (langsung `/checkout?variantIds=<id>`); produk **satu varian tetap langsung tanpa dialog**; tautan bergaya `BackLink` "Lihat bagan ukuran & detail lengkap" membuka `/products/<slug>` (bagan ukuran tidak diduplikasi di dialog); tanpa API/skema baru; galat server (`INSUFFICIENT_STOCK`) tampil di dalam dialog. Rencana kerja TASK-111..113 di bagian 16 | `src/components/products/{ProductCard,ProductCardActions}.tsx`, komponen baru `src/components/products/VariantPickerDialog.tsx`, `src/components/ui/dialog.tsx`; `docs/03` CART-05, `docs/04` bagian 16 |
| 2026-10-15 | **Produk masih ada di keranjang pembeli tidak boleh dihapus permanen** (diskusi hapus seluruh produk oleh Store Admin). User: "kalo store admin tiba tiba menghapus seluruh produk, apa yang akan terjadi pada produk yang ada di keranjang ataupun sudah dibeli? sudah ada langkah antisipasinya gak?" lalu "oke lakukan dokumentasi dan implementasinya" | Kaskade FK `Product → ProductVariant → CartItem` (`onDelete: Cascade`) menghapus `CartItem` pembeli secara senyap saat produk belum pernah dipesan dihapus; produk yang pernah dipesan sudah aman (`OrderItem.variantId` Restrict + snapshot) | **Keputusan:** delete route memvalidasi terlebih dahulu jumlah `CartItem` yang menunjuk varian produk; bila >0, tolak dengan `409 PRODUCT_IN_CART` beserta jumlah pembeli di pesan galat dan arahkan admin ke jalur lunak status `DISCONTINUED` (pembeli tetap melihat item keranjangnya dalam keadaan disabled "Produk tidak tersedia" via `CartView` status non-`ACTIVE`, tidak terhapus). Perilaku lama dipertahankan untuk produk yang tak punya item keranjang: hapus keras lewat kaskade. Acuan AC-PROD-01-09 + baris kondisi gagal `docs/03` PROD-01. Implementasi commit `d749beb` | `src/app/api/admin/products/[id]/route.ts`, `src/lib/products/mutations.ts` (helper `countCartItemsForProduct`), `docs/03` PROD-01 bagian 7/8/10 |
| 2026-10-15 | **Dialog konfirmasi aplikasi menggantikan `window.confirm` (dokumentasi dulu, belum diimplementasikan).** User: "buatkan UI untuk pesan konfirmasi, misalnya ketika klik 'hapus' pesan konfirmasi masih menggunakan browser default, gue gamau itu. manfaatkan shadcn untuk membuatnya, kemudian pastikan seluruh pesan di sistem menggunakan UI yang selaras itu" | Konfirmasi hapus masih `window.confirm` (dialog bawaan browser): tampilan mengikuti browser/OS, tidak bisa memakai komponen, tidak ter-trap fokus layaknya dialog aplikasi, dan bertabrakan dengan sistem UI yang sudah menyeragamkan galat via `Alert`/`FormErrorAlert` | **Keputusan:** dibuat aturan global `docs/03` bagian 1B "Aturan dialog konfirmasi aplikasi" dengan status **belum diimplementasikan**: komponen konfirmasi di atas shadcn Alert Dialog (atau `Dialog` yang sudah ada), isi standar (judul ringkas, deskripsi 1 baris, tombol "Batal" + tombol aksi destruktif eksplisit, disabled "Memproses...", Escape/backdrop = batal), larangan `window.confirm` baru, dan wajib memakai dialog ini di seluruh sistem. Reorganisasi untuk tukar tiga pemakai (`DeleteButton`, `ProductRowActions`, `TaxonomyManager`) dan mencabut seluruh `window.confirm` dicatat sebagai tindak lanjut implementasi | `docs/03` bagian 1B (baru) |
| 2026-10-15 | **Dropzone unggah gambar seragam (dokumentasi dulu, belum diimplementasikan).** User: "gue pengen UI seperti gambar, untuk upload gambar di sistem ini, baik itu gambar utama, varian, ataupun lainnya. buatkan dokumentasinya dulu dan 'belum diimplementasikan'" (+ gambar referensi: dropzone bergaris putus-putus, ikon awan-unggah, teks "Select a file or drag and drop here.", sub-teks tipe berkas, tombol utama "Browse Image") | Titik unggah saat ini beragam bentuknya: `ImageUploader`, `VariantImagePicker`, unggah bukti refund, dan aset brand masing-masing punya pola tombol/pratinjau sendiri, belum ada dropzone drag-and-drop dan belum ada UI satu tempat | **Keputusan:** dibuat aturan global `docs/03` bagian 1C "Aturan unggah gambar aplikasi (UI seragam, drag-and-drop)" dengan status **belum diimplementasikan**: satu komponen dropzone (kotak `border-dashed` + ikon unggah-awan + teks ajakan "Pilih berkas atau tarik dan lepas ke sini." + sub-teks tipe per endpoint + tombol utama "Browse Image"), seluruh wilayah menerima klik dan drag-and-drop, state dragover, disabled "Mengunggah...", galat lewat pola `FormErrorAlert`, akses keyboard, dan kontrak server Uploadthing tidak berubah (plafon per endpoint tetap: `productImage` 4 MB, `refundProof`, `bannerImage` 4 MB, favicon 2 MB). Enam pemakai dijadwal tukar: `ImageUploader`, `VariantImagePicker`, `AdminOrderActions`, `AssetPicker`/`BrandSettingsForm` | `docs/03` bagian 1C (baru) |
| 2026-10-15 | **Bug ubah status produk gagal "Data terkait tidak ditemukan" (dokumentasi + analisis dulu, perbaikan belum diimplementasikan).** User: "ada masalah ketika gue coba untuk hapus produk yang masih ada di keranjang, muncul pesan (sudah tepat) tapi ketika ganti status produknya menjadi \"discountinued\" gagal dan muncul pesan \"Data terkait tidak ditemukan\". konfirmasi apakah terjadi ketika produk di keranjang saja, atau semua produk ada masalah ketika mengubah statusnya" (+ log Prisma `Foreign key constraint violated: order_items_variantId_fkey` pada `PATCH /api/admin/products/[id]` 400) | `updateProduct` (`src/lib/products/mutations.ts:62-78`) selalu menghapus seluruh varian lalu membuat ulang untuk setiap edit — termasuk ubah status. Produk pernah dipesan gagal selalu: `OrderItem.variantId` Restrict → FK `P2003` → pesan generik `400 INVALID_REFERENCE` ("Data terkait tidak ditemukan", `prisma-error.ts:21-27`). Produk hanya-di-keranjang tidak gagal, tapi varian Cascade `CartItem.variantId` membuat item keranjang terhapus senyap di tiap edit (guard `PRODUCT_IN_CART` hanya di DELETE) | **Konfirmasi kepada user: bukan spesifik produk di keranjang** — semua produk yang pernah dipesan gagal ubah status dengan pesan itu; produk di keranjang (belum dipesan) malah "berhasil" sambil mengosongkan item keranjang diam-diam. Rekomendasi perbaikan: PATCH jangan hapus-buat-ulang varian yang tetap sama (upsert), tolak spesifik dengan SKU saat varian dipakai riwayat, pasang guard `countCartItemsForProduct` di PATCH, dan pertimbangkan endpoint status-saja. Status: **belum diimplementasikan**, acuan `docs/03` PROD-01 bagian 7/8 + AC-PROD-01-10..11 | `docs/03` PROD-01 bagian 7/8/10 (baru), `src/lib/products/mutations.ts` (belum diubah) |
| 2026-10-15 | **Hint format SKU di form admin (implementasi, atas persetujuan pengguna).** User: "ini dulu implementasikan 3. Hint format SKU di form admin" — merujuk temuan audit 2026-10-15: `ProductForm` tidak menampilkan petunjuk format SKU kepada admin | Admin hanya melihat label "SKU" tanpa aturan penulisan; keunikan dan pola `INISIAL-PROD-VARIAN` hanya tersirat di docs | Ditambahkan teks bantuan `text-xs text-muted-foreground` di bawah tiap input SKU baris varian: karakter yang diterima, maks 64, wajib unik antar produk, pola disarankan `INISIAL-PROD-VARIAN`, contoh `KP-30S-M`. Tanpa perubahan API/skema/validasi; keterangan `docs/03` PROD-01 bagian 4 diubah statusnya jadi terimplementasi. **Revisi UI di hari yang sama** atas masukan pengguna ("pesan SKU terlalu panjang dan buat struktur form rusak"): teks bantuan diganti ikon info (`Info` lucide) di samping label SKU, diklik/tahan membuka popover berisi aturan yang sama — komponen baru `src/components/ui/popover.tsx` (Radix `@radix-ui/react-popover` 1.3.1, gaya shadcn mengikuti `dialog.tsx`). Penyempurnaan lanjutan: teks popover dikecilkan (`text-xs`) dan pola dijelaskan sebagai "inisial produk - kode produk - varian" dengan makna contoh (`KP-30S-M` = Kaos Polos 30s, ukuran M) setelah pengguna bertanya arti `INISIAL-PROD-VARIAN` | `src/components/admin/ProductForm.tsx`, `src/components/ui/popover.tsx`, `package.json`; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), uji browser halaman `/admin/products/new` — teks panjang hilang, ikon info tampil, popover terbuka berisi 3 butir aturan, Escape menutup, konsol tanpa galat |
| 2026-10-15 | **Perbaikan stok efektif di kartu produk (massukan pengguna, tangkapan layar kartu "bias").** User: "1. kalo stoknya kosong, kenapa masih ditampilkan? paling minimal tombolnya di disable. 2. UI pesan stok kosong tidak menggunakan konsep UI/UX yang seharusnya" | Diagnosa: DB menunjukkan stok gudang `bias` masih 1, tetapi 1 unit sudah ada di keranjang pembeli; `addToCart` menghitung `remaining = stock - kuantitas di keranjang` (`src/lib/cart/mutations.ts` jalur guest baris 63, customer baris 87) sehingga penolakan "Stok tidak cukup (tersisa 0)" hanya muncul setelah klik, sementara kartu tidak pernah menerima kuantitas keranjang dan tombolnya tetap aktif. Pesan galat kartu juga dirender `<p className="text-xs text-destructive">` mentah, bukan komponen `Alert` | **Keputusan (lumrah, dua keadaan):** halaman beranda/katalog membaca kuantitas keranjang pembeli sekali per render lalu meneruskannya ke kartu; kartu menilai `stok efektif = stock - kuantitas di keranjang`. (a) stok gudang 0 → "Stok habis" (lama); (b) stok gudang > 0 tapi stok efektif 0 → tombol berganti label **"Semua stok ada di keranjang"** — label berbeda supaya pembeli tahu menaikkan jumlah di keranjang (CART-02); (c) lainnya aktif. Dialog CART-05 memakai stok yang sama: baris efektif 0 disabled "Sudah di keranjang". Galat yang masih mungkin (stok berubah di antara render dan klik) dirender komponen `Alert` destruktif, bukan teks merah mentah. Tanpa perubahan API/skema. **Keputusan lanjutan pengguna (2026-10-15, revisi dua kali):** tombol kondisi (b) cukup berlabel **"Keranjang"** dan klik **mengarah langsung ke halaman keranjang dengan highlight baris item** (`/cart?hilite=<variantId>` + efek ring + menggulir ke pandangan) — draf pertama "disabled" dan revisi pertama "dialog isi keranjang" tidak dipakai. Spek: `docs/03` CART-05 bagian 2/4/5/7/8/9/10/11 (AC-CART-05-10..11). Sudah dieksekusi bersama approval (TASK-114) | `src/components/products/{ProductCard,ProductCardActions,VariantPickerDialog}.tsx`, `src/components/products/ProductGrid.tsx`, halaman beranda + katalog, `src/lib/cart/queries.ts`; `docs/03` CART-05, `docs/04` bagian 16 |
| 2026-10-15 | **Dropzone unggah gambar seragam (implementasi, atas persetujuan pengguna).** User: "dropzone dulu" — merujuk keputusan bagian 1C yang sebelumnya berstatus "belum diimplementasikan" | Empat titik unggah masih berpola tombol/file-input masing-masing (`ImageUploader`, `VariantImagePicker`, `AdminOrderActions`, `AssetPicker`), belum ada drag-and-drop | Dibuat `src/components/ui/image-dropzone.tsx` (kotak `border-dashed` + ikon `Upload` berlingkar `muted`, teks "Pilih berkas atau tarik dan lepas ke sini.", sub-teks tipe per endpoint, tombol utama "Browse Image"; dragover `border-primary bg-muted/50`; saat unggah tombol nonaktif + "Mengunggah..."; galat tetap lewat `FormErrorAlert`; keyboard lewat tombol). Keempat pemakai ditukar, kontrak server Uploadthing tidak berubah (endpoint + plafon sama). Status `docs/03` bagian 1C diubah jadi terimplementasi | `src/components/ui/image-dropzone.tsx` (baru), `src/components/admin/{ImageUploader,VariantImagePicker,AdminOrderActions}.tsx`, `src/components/platform/AssetPicker.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), uji browser `/admin/products/new` (3 dropzone tampil, tombol lama hilang, dragover menyala, drop PNG valid sukses unggah, berkas rusak menghasilkan galat `FormErrorAlert`) |
| 2026-10-15 | **Preview unggahan gambar diseragamkan (revisi pengguna atas dropzone).** User: "gue pengen gambar preview nya juga nyesuaiin dropzone ... preview juga harus seragam" | Bentuk preview berbeda-beda: kartu galeri (`ImageUploader`), kotak "Kosong" (`VariantImagePicker`), tanpa preview sama sekali (`AdminOrderActions` — hanya teks "Bukti terunggah."), teks "Belum ada berkas." + ukuran berbeda (`AssetPicker`) | Dibuat `src/components/ui/image-preview.tsx`: kartu seragam (border + `bg-background` + p-2) berisi kotak media `bg-muted` dengan gambar (`object-cover`/`object-contain`) atau placeholder "Belum ada gambar.", tombol "Hapus" pada baris yang sama; ukuran diatur pemanggil lewat `mediaClassName`. Keempat pemakai ditukar; `AssetPicker` mengganti prop `previewClassName` jadi `mediaClassName` + `fit` (logo/favicon `contain`, banner `cover`); bukti refund kini punya preview + Hapus | `src/components/ui/image-preview.tsx` (baru), `src/components/admin/{ImageUploader,VariantImagePicker,AdminOrderActions}.tsx`, `src/components/platform/{AssetPicker,BrandSettingsForm}.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), uji browser `/admin/products/new` — kartu preview kosong seragam, drop PNG valid tampil sebagai kartu preview + tombol Hapus, klik Hapus menghilangkan gambar, konsol tanpa galat |
| 2026-10-15 | **Revisi preview: tanpa teks kosong, bagan ukuran terpusat, varian identik (revisi pengguna).** User: "pada bagan ukuran previewnya \"start\" better coba di center, untuk gambar tiap varian juga ikutin preview dari bagan ukuran ini sama persis, samakan juga state \"belum ada gambar.\"nya disemuanya, better gausah ada \"belum ada gambar\" ga sih? karena udah ada dropzone langsung" | Preview tunggal bagan ukuran menempel di awal kolom grid (kiri), ukuran kartu varian berbeda (`h-24 w-24`), dan empat titik unggah masih memunculkan teks kosong ("Belum ada gambar.", "Kosong", "Belum ada berkas.") yang ganda dengan dropzone | `ImagePreview` kini me-render `null` saat tanpa url (prop `emptyText` dihapus); `ImageUploader` cabang `max === 1` memakai pembungkus `flex justify-center` + kartu `w-40`, galeri tetap grid; `VariantImagePicker` dan `AdminOrderActions` memakai kartu `w-40 mx-auto` identik dengan bagan ukuran; `<p>Belum ada gambar.</p>` galeri dihapus | **Ukuran diseragamkan lagi pada hari yang sama** (user: "ukuran preview lainnya, samain dengan preview gambar utama (yang cenderung lebih besar)"): semua kartu `w-48` (192px) — galeri/bagan ukuran/varian/bukti refund identik, galeri pindah dari grid ke `flex flex-wrap justify-center`, logo/favicon brand ikut `aspect-square w-48`, hanya banner tetap lebar lanskap | `src/components/ui/image-preview.tsx`, `src/components/admin/{ImageUploader,VariantImagePicker,AdminOrderActions}.tsx`, `src/components/platform/{AssetPicker,BrandSettingsForm}.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), uji browser `/admin/products/new` — nol teks kosong, nol teks kosong terkonfirmasi, tiga kartu terukur identik 192px terpusat (galeri, bagan ukuran, varian; delta 0 masing-masing), drop PNG valid tampil + Hapus berfungsi, konsol tanpa galat. **Pengecualian rasio bagan ukuran** (user: "rasionya berbeda, horizontal, karena yang diliat pada storefront juga rasio landscape"): kotak media bagan ukuran `aspect-[4/3] sm:aspect-[16/9]` + `object-contain` meniru storefront — terukur rasio 1.78 pada viewport uji, kartu tetap `w-48` |
| 2026-10-15 | **Ukuran kartu bagan ukuran diperbesar lalu disejajarkan dengan dropzone (revisi pengguna).** User: "preview nya kurang besar sizenya, rasionya sudah ok", lalu "gimana kalo lebar preview di size chart ini selebar dropzonenya" | Kartu bagan ukuran `w-48` (192px) terlalu kecil untuk melihat detail tabel | Kartu bagan ukuran menjadi `w-full max-w-xl` (576px), lalu `w-full` final — persis selebar dropzone (815px terukur pada form produk); rasio `aspect-[4/3] sm:aspect-[16/9]` + `object-contain` tidak berubah, preview lain tetap `w-48` | `src/components/admin/ImageUploader.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error, uji browser — kartu 815px = lebar dropzone 815px, rasio 1.78, `contain`, konsol tanpa galat pada load segar |
| 2026-10-15 | **Dropzone nonaktif saat slot terisi (revisi pengguna).** User: "pada gambar utama (4 gambar) dropzone disable, bagan size juga disable kalo udah ada isinya, sedangkan untuk varian sepertinya berbeda sendiri" | Galeri dan bagan ukuran sudah `disabled` saat penuh, tetapi varian, bukti refund, dan aset brand tetap aktif sehingga isi slot tunggal bisa tertimpa tanpa konfirmasi | Semua slot tunggal kini `disabled={Boolean(url)}`: `VariantImagePicker`, `AdminOrderActions` (bukti refund), `AssetPicker`; sub-teks dropzone berganti jadi "Sudah ada gambar. Hapus dulu untuk mengganti." (galeri: "Galeri penuh (N gambar)..."); penggantian = Hapus dulu lalu unggah | `src/components/admin/{ImageUploader,VariantImagePicker,AdminOrderActions}.tsx`, `src/components/platform/AssetPicker.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error, uji browser — isi 4 galeri + bagan + varian sekaligus: ketiga input `disabled: true` + tombol Browse disabled + teks korek, klik Hapus varian mengaktifkan lagi dropzone, konsol tanpa galat |
| 2026-10-15 | **Bug ubah status produk diperbaiki: upsert varian per SKU (implementasi; rencana docs/03 PROD-01 bagian 8 tuntas).** Rencana 4 poin direalisasikan: (1) `updateProduct` meng-upsert varian per SKU (SKU global unik = kunci identitas) — varian tetap di-update pada barisnya (ID tidak berubah, FK OrderItem/CartItem tak tersentuh untuk edit ringan termasuk ubah status), SKU baru dibuat sebagai varian baru, hanya varian yang benar-benar dibuang yang dihapus; (2) penghapusan varian yang dipakai riwayat pesanan ditolak `409 VARIANT_IN_ORDER` berisi daftar SKU spesifik (bukan pesan generik); (3) penghapusan varian yang masih di keranjang ditolak `409 PRODUCT_IN_CART` dengan jumlah pembeli — guard setara route DELETE; (4) endpoint status-saja TIDAK dibuat — cukup upsert (KISS/YAGNI), ubah status kini menyentuh nol baris varian. Nested write `variants: { create }` di jalur update dihapus (hanya `createProduct` yang memakainya) | Bug: `updateProduct` hapus-buat-ulang varian → produk dipesan selalu gagal `400 INVALID_REFERENCE`, produk di keranjang kehilangan CartItem senyap | Perbaikan pola upsert per SKU + guard berlapis dalam satu transaksi + dua error kelas `VariantInOrderError`/`VariantInCartError` ditangkap route jadi respons spesifik | `src/lib/products/mutations.ts`, `src/app/api/admin/products/[id]/route.ts`, `docs/03` PROD-01 bagian 7/8 + AC-PROD-01-10/11 (diubah jadi terimplementasi); bukti: `tsc` exit 0, `pnpm lint` 0 error, uji API via sesi admin — (a) ubah status produk dipesan + di keranjang (topi-baseball-basic) sukses, ID varian identik sebelum/sesudah, (b) hapus varian dipesan → 409 VARIANT_IN_ORDER "Varian dengan SKU TB-BSC-NVY sudah dipakai pada riwayat pesanan", (c) hapus varian di keranjang (kemeja KF-LP-L) → 409 PRODUCT_IN_CART "keranjang 2 pembeli", (d) ganti SKU varian bersih (parfum) → sukses: varian lain ID tetap, SKU lama terhapus, SKU baru ID baru, (e) CartItem & OrderItem terverifikasi utuh pasca-uji, form edit produk terbuka normal, konsol bersih. Catatan: satu INTERNAL_ERROR teramati sekali saat HMR aktif pasca-edit dan tidak terulang (transient) |
| 2026-10-15 | **Dialog konfirmasi aplikasi menggantikan `window.confirm` (implementasi; aturan docs/03 bagian 1B tuntas).** Keputusan pengguna saat implementasi: dasar `AlertDialog` shadcn (bukan `Dialog`) — "AlertDialog utk konfirmasi"; fokus bawaan Radix jatuh ke tombol batal sehingga aksi destruktif tidak sengaja terpencet | Dibuat `src/components/ui/confirm-dialog.tsx` (`ConfirmDialog`: judul tindakan, deskripsi konsekuensi, tombol "Batal" + aksi destruktif, "Memproses..." dengan dialog terkunci selama permintaan, galat di dalam dialog lewat `FormErrorAlert`, Escape/klik latar = batal) di atas `src/components/ui/alert-dialog.tsx` baru (shadcn AlertDialog; `pnpm add @radix-ui/react-alert-dialog` 1.2.1); tiga pemakai ditukar: `DeleteButton` (prop `confirmMessage` menjadi `confirmTitle` + `confirmDescription`), `ProductRowActions` (galat penolakan hapus pindah ke dalam dialog), `TaxonomyManager` (state `pendingDelete`); seluruh `window.confirm` di kode dicabut; dialog konten biasa tetap `Dialog` | `package.json`, `pnpm-lock.yaml`, `src/components/ui/{alert-dialog,confirm-dialog}.tsx` (baru), `src/components/admin/{DeleteButton,ProductRowActions,TaxonomyManager}.tsx`, `src/app/admin/vouchers/page.tsx`, `docs/03` bagian 1B; bukti: `tsc` exit 0, `pnpm lint` 0 error, uji browser — hapus produk topi (dipesan+di keranjang): dialog tampil, klik konfirmasi, galat 409 "masih ada di keranjang 2 pembeli" tampil di dalam dialog dan dialog tetap terbuka, Escape menutup; hapus kategori uji: dialog judul `Hapus Kategori "Uji Konfirmasi Dialog"?`, sukses — dialog tertutup sendiri dan item hilang; voucher: dialog + tombol Batal menutup tanpa menghapus, konsol bersih |
| 2026-10-15 | **Banner hero PROD-07 dapat berupa gambar (bukan hanya video) + rasio panorama 4:1 mengikuti referensi pengguna.** User: "gua mau bagian video punya rasio kayak gambar ini, kasih pilihan selain video bisa juga gambar" (+ gambar referensi banner panorama bertuliskan judul koleksi) | Banner hero hanya bisa video dengan rasio 16:9, padahal referensi pengguna berupa banner panorama (±4:1) dan sebagian produk lebih cocok pakai gambar | **Keputusan:** (a) kolom baru `Product.heroImageUrl String?` (migrasi `20261015140252_product_hero_image`) — banner hero boleh gambar; hanya satu sumber yang disimpan, form admin memakai pilihan "Tanpa banner / Gambar / Video" yang mengosongkan sumber lain saat diganti, dan storefront memprioritaskan gambar bila keduanya terisi (jaring pengaman); (b) rasio banner (gambar maupun video) jadi `aspect-[4/1]` di layar lebar dan tetap `aspect-video` di ponsel supaya tidak terlalu tipis; (c) sakelar autoplay hanya tampil pada pilihan video | `prisma/schema.prisma` + migrasi `20261015140252_product_hero_image`, `src/lib/products/{validation,mutations}.ts`, `src/components/products/EditorialSections.tsx`, `src/components/admin/{ProductForm,VideoHeroUploader}.tsx`, `src/app/(storefront)/products/[slug]/page.tsx`, `src/app/admin/products/[id]/edit/page.tsx`, `docs/03` PROD-07 bagian 2/4/5/6/10; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), uji browser form admin (pilihan Tanpa banner = tanpa uploader, Gambar = dropzone gambar tanpa sakelar autoplay, Video = unggah video + autoplay tercentang; ketiganya saling eksklusif), nilai data uji dipulihkan |
| 2026-10-15 | **Revisi lanjutan ProductStory: rasio gambar narasi 4:3 → 16:9.** User: "gambar narasi kurang landscape, terakhir kali kayaknya 4:3 kan? kurang gepeng" | Rasio 4:3 masih terasa mendekati kotak; pengguna ingin narasi lebih lanskap | Rasio gambar narasi diubah dari `aspect-[4/3]` menjadi `aspect-video` (16:9) di `EditorialSections`; kolom teks tetap `sm:justify-center` sehingga tinggi kedua kolom sejajar. Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), uji browser rasio gambar 16:9, konsol bersih | `src/components/products/EditorialSections.tsx`, `docs/03` PROD-07 AC-PROD-07-03 |
| 2026-10-15 | **Revisi rasio gambar ProductStory: `aspect-square` jadi `aspect-[4/3]` (agak lanskap).** User: "untuk bagian story image rasionya terlalu kotak coba bikin agak landscape" | Gambar narasi 1:1 terasa kotak dan tidak selaras dengan seksi editorial lain yang lanskap (VideoHero 16:9, Lookbook 16:9) | Rasio gambar narasi jadi 4:3 lewat `aspect-[4/3]`; kolom teks tetap `sm:justify-center` sehingga tinggi kedua kolom sejajar. Bukti: `tsc` exit 0, `pnpm lint` 0 error, uji browser gambar 420x315 (1.333) dengan kolom teks 315 px, konsol bersih | `src/components/products/EditorialSections.tsx`, `docs/03` PROD-07 AC-PROD-07-03 |
| 2026-10-15 | **Revisi Lookbook PROD-07: susunan templat editorial (foto utama membentang + pendamping) dan rasio lanskap serupa VideoHero.** User: "ini contoh template dari seksi editorial yang gua pengen, setidak samaiin rasio video hero nya untuk lookbook juga rasionya serupa, namun boleh sesuaikan susunannya" (+ gambar referensi) | Lookbook sebelumnya grid `aspect-square` 4 kolom (rasio 1:1), tidak menyerupai templat pengguna dan rasionya berbeda dari VideoHero (16:9) | **Keputusan:** susunan meniru templat, jumlah foto 1-4 melentur: 1 foto = satu kartu 16:9 selebar kontainer; 2 foto = dua kartu 16:9 bersebelahan; 3-4 foto = grid dua kolom dengan foto utama di kiri `sm:row-span-2` (tinggi mengikuti kolom pendamping) dan pendamping di kanan (4 foto: dua kartu kecil 16:9 di baris atas + satu kartu lebar 16:9 di bawah; 3 foto: dua kartu 16:9 bertumpuk). Terukur pada 4 foto (kontainer 424 px): tiga kartu tepat 1.778 (16:9) dan kartu utama 1.148 karena membentang dua baris; pada 1 foto 953x536 (16:9) | `src/components/products/EditorialSections.tsx`, `docs/03` PROD-07 bagian 5 + AC-PROD-07-04; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), uji browser 1/2/3/4 foto (struktur dan ukuran sesuai di atas), konsol tanpa galat, data uji dikembalikan |
| 2026-10-15 | **Perbaikan galat simpan produk `P2028`: transaksi Prisma 5 detik habis di tengah simpan.** Log dev dari pengguna: `Invalid tx.product.update() ... Transaction already closed: A query cannot be executed on an expired transaction. The timeout for this transaction was 5000 ms, however 6004 ms passed` pada `PATCH /api/admin/products/[id]` (500) | `updateProduct` menjalankan belasan query berurutan dalam satu transaksi interaktif (baca varian, guard riwayat pesanan + keranjang, upsert varian per SKU, hapus gambar, update produk); koneksi Supabase jauh plus momen server lambat membuat totalnya melewati 5 detik sehingga transaksi ditutup di tengah dan seluruh penyimpanan gagal | **Keputusan:** naikkan batas transaksi jadi `{ timeout: 15_000, maxWait: 10_000 }` — pola query tidak diubah (KISS, tanpa optimasi dini). Bukti: PATCH produk parfum (3 varian, 4 gambar) lewat sesi Store Admin → `200` dalam 1525 ms, role gambar tetap 3 GALLERY + 1 SIZE_CHART setelah simpan ulang | `src/lib/products/mutations.ts` |
| 2026-10-15 | **PROD-07 seksi editorial detail produk (VideoHero, ProductStory, Lookbook) — implementasi; tiga pertanyaan terbuka spek diputus.** User: "lanjutkan" (melanjutkan daftar "belum diimplementasikan", item PROD-07) | Spek `docs/03` PROD-07 sudah ditulis dengan status belum diimplementasikan dan tiga pertanyaan terbuka di bagian 13; halaman detail masih hanya galeri + deskripsi + form beli + tautan bagan ukuran, tanpa video hero, narasi editorial, atau galeri gaya hidup | **Keputusan (jawaban pengguna atas tiga pertanyaan spek):** (a) sumber video = **unggah berkas** lewat endpoint Uploadthing baru `videoHero` (satu berkas, plafon 64 MB, gerbang `STORE_ADMIN`) — bukan sematan YouTube; (b) **autoplay dikontrol admin per produk** (`Product.videoHeroAutoplay`, default `true`) sementara video selalu `muted` + `playsInline`, dan saat autoplay mati video diberi `controls` bawaan serta `loop` mati supaya tetap bisa diputar; (c) **ProductStory tanpa `storyText` jatuh ke `description`** produk sehingga narasi tidak pernah kosong. Tambahan keputusan teknis: galeri menyaring `role === "GALLERY"` (STORY/LOOKBOOK tidak ikut carousel, juga di kartu katalog dan form edit), galat media pada URL mati ditangkap dengan memeriksa `error` di ref callback video (event galat sering terjadi sebelum hidrasi sehingga `onError` React terlewat) lalu diganti bingkai "Video tidak tersedia", dan batas isian editorial (narasi 2000 karakter, STORY maks 1, LOOKBOOK maks 4) tidak pernah memblok simpan | `prisma/schema.prisma` + migrasi `20261015125359_product_editorial_sections`, `src/lib/uploadthing/core.ts`, `src/lib/products/{validation,mutations}.ts`, `src/components/products/EditorialSections.tsx` (baru), `src/components/admin/{VideoHeroUploader.tsx (baru),ProductForm}.tsx`, `src/components/products/ProductCard.tsx`, `src/app/(storefront)/products/[slug]/page.tsx`, `src/app/admin/products/[id]/edit/page.tsx`, `docs/03` PROD-07; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), uji browser form admin (seksi "Seksi Editorial (opsional)" tampil; 1 gambar narasi + 2 lookbook terunggah via dropzone; simpan sukses; DB persis 3 GALLERY + 1 SIZE_CHART + 1 STORY + 2 LOOKBOOK + storyText), storefront `products/parfum-wanita` (urutan Video → Cerita → Lookbook, seksi Cerita dua kolom, Lookbook grid, tanpa video), produk tanpa data editorial (nol seksi — AC-PROD-07-01), video autoplay nyala (`autoPlay`/`muted`/`loop`/`playsInline`, tanpa `controls`, benar-benar diputar: `paused: false`), autoplay mati (`controls: true`, `loop: false`), URL mati → "Video tidak tersedia", konsol bersih; data uji dikembalikan (videoHeroUrl/storyText null, baris STORY/LOOKBOOK dihapus) |
| 2026-10-15 | **Dropzone disembunyikan saat slot penuh (implementasi — item 1 daftar "belum diimplementasikan").** User: "yang 1 sama 3 dulu" | Aturan 1C sebelumnya membuat dropzone tetap dirender dalam keadaan `disabled` plus sub-teks "Sudah ada gambar."/"Galeri penuh (N gambar)." sehingga kotak mati memenuhi form | Keempat pemakai mengganti `disabled={penuh}` menjadi render bersyarat: `ImageUploader` (`urls.length < max`), `VariantImagePicker` (`url ? null`), `AdminOrderActions` (bukti refund), `AssetPicker` (aset brand); sub-teks keadaan penuh gugur; prop `disabled` pada `ImageDropzone` tidak lagi dipakai pemakai mana pun (komponen tetap menerimanya untuk pemakaian lain) | `src/components/admin/{ImageUploader,VariantImagePicker,AdminOrderActions}.tsx`, `src/components/platform/AssetPicker.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama); uji browser `/admin/products/new` — galeri kosong 1 dropzone, unggah 5 berkas nyata ke endpoint `productImage` (200, URL `.ufs.sh` muncul) → dropzone galeri **hilang dari DOM** (0) sementara 5 kartu preview + tombol Hapus tetap ada, klik Hapus → dropzone muncul lagi (1) tanpa reload; unggah 1 berkas ke slot varian → dropzone varian hilang (0, preview 1); form edit parfum (data terisi): bagan ukuran 1 gambar → 0 dropzone, 3 baris varian bergambar → 0 dropzone, seksi editorial 5 gambar → 0 dropzone, galeri 3/5 → 1 dropzone; konsol bersih |
| 2026-10-15 | **Kapasitas galeri produk 4 → 5 gambar utama (implementasi — item 3 daftar "belum diimplementasikan").** User: "yang 1 sama 3 dulu" | `MAX_PRODUCT_IMAGES = 4` membatasi galeri, dan tata letak thumbnail storefront `grid-cols-4` menyisakan satu thumbnail menggantung bila gambar utama berjumlah 5 | Konstanta `4 → 5` (satu baris: ikut menaikkan validasi Zod `.max` **dan** `maxFileCount` endpoint `productImage` karena keduanya mengimpor konstanta yang sama); thumbnail galeri storefront memakai `grid-cols-5` hanya saat tepat 5 slide (`grid-cols-4` tetap untuk ≤4 slide supaya tata letak lama tidak berubah); redaksi `docs/01` PRD 3.1.A ("1 wajib + 4 opsional = maksimal 5 gambar") dan `docs/03` PROD-01 bagian 4 (tabel input, catatan unggahan) disesuaikan | `src/lib/products/validation.ts`, `src/components/products/ProductShowcase.tsx`, `docs/01` PRD 3.1.A, `docs/03` PROD-01 bagian 4; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama); unggah 5 berkas nyata lewat dropzone galeri `/admin/products/new` → 5 kartu preview (plafon endpoint ≥ 5, tidak lagi `FileCountMismatch`); `POST /api/admin/products` 6 gambar → `400 VALIDATION_ERROR field=images "Maksimal 5 gambar"`, 5 gambar → `201` (produk uji `zz-uji-galeri-5`, id `f3b49848-5baf-496b-89d2-12b02f434545`); halaman detail produk uji: 5 thumbnail, kelas grid `grid gap-3 grid-cols-5`, semuanya satu baris (semua `top` 1026 px, tiap thumbnail 163×163 px); produk uji dihapus sendiri (`DELETE` → `200 {deleted:true}`, `GET` → `404`, halaman → `404`); data produk lain tidak disentuh (parfum tetap 3 GALLERY + 1 SIZE_CHART + 1 STORY + 4 LOOKBOOK dan 3 gambar varian) |
| 2026-10-15 | **PROD-06 gambar varian di galeri detail + tautan bagan ukuran dialog (implementasi; docs/03 bagian PROD-06 beserta status tambahan ditandai terimplementasi).** Keputusan implementasi: carousel memakai CSS translate sederhana — `ui/carousel.tsx`/embla tidak dipasang (KISS, tanpa dependensi baru); slide = gambar galeri utama + gambar varian unik yang belum ada; seluruh galeri + form dibungkus client induk baru `ProductShowcase` (state varian terpilih diangkat ke induk lewat penanda `seq`; slide aktif diturunkan murni tanpa `useEffect` — navigasi manual hanya berlaku selama `seq` sama, pilihan varian baru selalu menggeser slide ke gambar varian) | Dibuat `src/components/products/ProductShowcase.tsx` (galeri carousel + `SizeChartTrigger` dialog dalam satu file); `AddToCartForm` menerima `initialVariantId` + `onVariantChange`; halaman `products/[slug]/page.tsx` memakai `ProductShowcase` (children server = kategori/judul/stok/deskripsi) dan section penuh "Bagan Ukuran" dihapus; tautan "Lihat bagan ukuran" `text-sm` underline rata kanan membuka `ui/dialog.tsx` (`object-contain`, konten scroll `max-h-[70vh]`, Escape/tutup) | `src/components/products/ProductShowcase.tsx` (baru), `src/components/cart/AddToCartForm.tsx`, `src/app/(storefront)/products/[slug]/page.tsx`, `docs/03` PROD-06; bukti: `tsc` exit 0, `pnpm lint` 0 error, uji browser `products/parfum-wanita` — 3 slide (SIZE_CHART keluar dari galeri), tautan kanan bawah rata kanan, dialog bagan tampil scroll + `object-contain` + Escape menutup, section H2 "Bagan Ukuran" lenyap, panah next `translateX(-100%)`; uji varian sementara (imageUrl "Morning Grace" diset via Prisma lalu dikembalikan `null`): pilih Morning Grace → `translateX(-300%)`, pilih Fresh Bloom → kembali `0%`, nav manual kalah saat varian berganti (override `seq`), konsol bersih |
| 2026-10-15 | **Pratinjau form admin meniru storefront — susunan dan rasio sama persis per slot (implementasi; keputusan pengguna 2026-10-15).** User: "gua pengen pratinjau yang ada di form admin punya layout sama persis kayak di storefront produk, seksi editorial dan semuanya", dilanjutkan "tidak cuma di seksi editorial saja, namun semuanya", lalu "bagan ukuran juga ikut" | Pratinjau form admin memakai kartu `w-48` seragam (galeri grid kecil, bagan ukuran kotak `aspect-[4/3] sm:aspect-[16/9]`, narasi satu kartu, lookbook kartu seragam) — bentuk yang diatur admin tidak terlihat seperti hasil di halaman produk sehingga komposisi seksi editorial tidak bisa dinilai sebelum simpan | `ImageUploader` menerima `layout` (`single`/`gallery`/`lookbook`) + `mediaClassName`/`fit`/`productName`; `Lookbook`/`LookbookItem` di `EditorialSections.tsx` diekspor dan menerima `renderAction` (tombol Hapus per foto di sudut; storefront tidak mengirim prop itu sehingga tampilannya tidak berubah). Per slot: galeri = gambar utama `aspect-square` besar + strip thumbnail persegi berisi gambar selain yang sedang tampil (`grid-cols-4`, `grid-cols-5` saat 5 kotak; klik thumbnail mengganti utama); banner gambar = `aspect-video sm:aspect-[4/1]` `object-cover`; narasi = gambar 16:9 kolom kiri + textarea kolom kanan (`grid gap-6 sm:grid-cols-2`); bagan ukuran = kotak `aspect-[3/4] max-w-sm` `object-contain` mengikuti dialog storefront (`next/image` 1200×1600) menggantikan kotak horizontal lama; lookbook = komponen storefront dipakai ulang; gambar varian tetap kartu persegi `w-48` (sudah sama). Aturan "dropzone disembunyikan saat slot penuh" tetap berlaku | `src/components/admin/{ImageUploader,ProductForm}.tsx`, `src/components/products/EditorialSections.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama); uji browser form edit parfum — galeri utama 815×815 (1.000) + strip satu baris, bagan ukuran 384×512 (0.750 contain), narasi 378×213 (1.778) gambar kiri + textarea kanan, lookbook 400×349 (1.146) + 192×108 dua buah + 400×225 (1.778), varian 174×174 (1.000), banner gambar setelah unggah berkas uji 798×199 (4.000) dan dropzone-nya hilang; pembanding `/products/parfum-wanita` — galeri utama 865×865, thumbnail 207×207, narasi 420×236 dua kolom `420px 420px`, lookbook 424×370 (1.148) + 204×115 dua buah + 424×239 (1.778), dialog bagan ukuran 607×810 (0.750); lookbook storefront tetap 0 tombol Hapus; konsol bersih |
| 2026-10-15 | **Strip thumbnail galeri tanpa gambar aktif: 5 gambar = 1 besar + 4 kecil (implementasi; koreksi atas laporan pengguna).** User: "di store admin, jadi keliatan malah bisa nambahin 6 gambar karena 1 gambar besar + 5 gambar kecil di bawahnya. padahal harusnya memang cuma 5 gambar utama, sedangkan di storefront 1 gambar besar + 4 gambar kecil" (+ dua tangkapan layar: pratinjau admin dan halaman storefront) | `GalleryPreview` (`ImageUploader`) dan baris thumbnail `ProductGallery` (`ProductShowcase`) merender SEMUA gambar termasuk yang sedang tampil di kotak besar, sehingga 5 gambar tampil sebagai 6 kotak (1 besar + 5 kecil) dan pratinjau terlihat seperti punya slot tambahan | Baris thumbnail kini memuat gambar selain yang sedang tampil (jumlah kotak = jumlah gambar − 1): penanda aktif `aria-current`/`border-foreground ring-2 ring-ring` dicabut karena gambar aktif tidak dirender di baris, klik thumbnail tetap mengganti gambar besar dan slide lama masuk kembali ke baris, grid `grid-cols-4` untuk ≤4 kotak dan `grid-cols-5` saat tepat 5 kotak. Catatan: halaman storefront sebelumnya memang menampilkan 1 besar + 5 kecil untuk 5 gambar (terukur 5 kotak `grid-cols-5`) — dikoreksi supaya sama dengan pratinjau admin | `src/components/admin/ImageUploader.tsx`, `src/components/products/ProductShowcase.tsx`, `docs/03` bagian 1C + PROD-01 bagian 4 + PROD-06; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; produk uji 5 gambar `zz-uji-strip-5` (`POST` 201 → `DELETE` 200 `{deleted:true}` → `GET` 404): storefront 5 slide → 4 kotak `grid gap-3 grid-cols-4` satu baris (top 1026, 207×207 px), gambar besar tidak ada di baris, klik thumbnail → `translateX(-100%)` dan baris berganti ke 1,3,4,5; pratinjau admin produk yang sama: gambar utama 815×815 + 4 kotak satu baris + 5 tombol Hapus, dropzone hilang; parfum (5 GALLERY + 3 gambar varian): pratinjau admin 1 besar + 4 kecil, storefront 8 slide → 7 kotak (`grid-cols-4`, dua baris 4+2) |
| 2026-10-15 | **Pratinjau galeri form admin dikecilkan: container dibatasi `max-w-sm` (implementasi; lanjutan aturan "pratinjau = storefront").** User: "kecilin ukuran container gambar utama di store admin, karena ukuran kelima gambarnya ngikutin container, jadi terlalu memenuhi layar" | Pratinjau galeri di form admin memakai lebar penuh section (~815px) karena `w-full`, sehingga gambar utama 815×815 dan setiap kotak strip 192×192 — ukuran semua gambar mengikuti container selebar itu dan pratinjau memenuhi layar form | `ImageUploader` membatasi lebar root-nya hanya untuk `layout="gallery"`: `w-full max-w-sm` (384px). Tata letak tetap meniru storefront (gambar utama persegi besar + strip thumbnail persegi berisi gambar selain yang sedang tampil), hanya diskalakan; dropzone galeri ikut selebar itu supaya sejajar. Halaman storefront tidak diubah | `src/components/admin/ImageUploader.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; parfum (5 galeri) pratinjau 384×384 + 4 kotak 87×87 satu baris + 5 tombol Hapus; sneakers (2 galeri) 384×384 + 1 kotak 87×87 + dropzone 384×191, tombol Hapus overlay 42×19 tetap masuk di kotak 87px |
| 2026-10-15 | **Gambar Produk dan Bagan Ukuran berdampingan (1 baris 2 kolom) (implementasi; lanjutan penataan form admin).** User: "bikin container yang membungkus gambar produk dan bagan ukuran, jadi 1 baris 2 kolom" | Kedua seksi berdiri sendiri-sendiri sebagai kartu penuh lebar (~865px) sehingga kolom kanan form kosong sementara pratinjau galeri hanya 384px — dua seksi yang saling terkait (gambar utama produk dan bagan ukurannya) tidak terlihat sebagai satu kesatuan dan form jadi panjang | Kedua seksi dibungkus satu `<div className="grid gap-4 md:grid-cols-2">` di `ProductForm`; tiap seksi tetap kartu sendiri dan isinya tidak diubah; menumpuk kembali di layar sempit (`< md`) | `src/components/admin/ProductForm.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; parfum: dua kartu 424px pada baris yang sama (y sama), tinggi sama 634px, galeri 375×375 + 4 kotak 85×85 + 5 tombol Hapus, bagan ukuran 357×447 dari berkas 736×920 (rasio asli); sneakers (2 galeri): kartu 424px sebaris, galeri 375×375 + 1 kotak 85×85 + dropzone 375×191 |
| 2026-10-15 | **Urutan seksi form produk: Varian dipindah ke atas Seksi Editorial (implementasi).** User: "pindahin section varian, agar di atas seksi editorial" | Urutan lama: Informasi Produk → Gambar Produk + Bagan Ukuran → Seksi Editorial → Varian; seksi Varian (data yang paling sering diisi) berada paling bawah, di bawah seksi editorial yang semuanya opsional | Blok seksi Varian dipindah utuh ke posisi sebelum Seksi Editorial: Informasi Produk → Gambar Produk + Bagan Ukuran → Varian → Seksi Editorial → tombol Simpan/Batal. Tidak ada perubahan isi/logika, murni urutan JSX | `src/components/admin/ProductForm.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; blok Varian identik byte-per-byte dengan versi sebelumnya (152 baris, berkas tetap 659 baris); urutan heading terukur di form edit (y Varian 1513 < Editorial 3141); 4 baris varian = 4 varian di DB; tombol Simpan tetap di akhir form |
| 2026-10-15 | **Tombol Hapus pratinjau gambar seragam gaya overlay (implementasi).** User: "image preview (tepatnya tombol hapus) bagan ukuran, varian, dan gambar narasi, gue pengen di samain kayak gambar produk ataupun lookbook" | Dua gaya tombol Hapus gambar bercampur: galeri + lookbook memakai tombol kecil di sudut kanan atas gambar, sedangkan pratinjau satu gambar (bagan ukuran, narasi, banner, varian, bukti refund, aset brand) memakai `Button` ghost sebagai baris terpisah di bawah gambar sehingga tinggi kartunya ikut bergeser | Tombol sudut diekstrak jadi komponen bersama `ImageRemoveButton` (`src/components/ui/image-remove-button.tsx`) yang dipakai `ImageUploader` (galeri + lookbook) dan `ImagePreview` (semua slot satu gambar); baris tombol di `ImagePreview` dihapus, kotak media diberi `relative` sebagai jangkar overlay | `src/components/ui/image-remove-button.tsx` (baru), `src/components/ui/image-preview.tsx`, `src/components/admin/ImageUploader.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; form edit parfum: galeri 5 tombol (utama 48×20, thumbnail 42×19), bagan ukuran 42×19 di sudut gambar 357×447, narasi 42×19 di sudut gambar 378×213, varian 4 tombol 42×19, lookbook 4 tombol 42×19; tidak ada tombol Hapus gambar berposisi static lagi |
| 2026-10-15 | **Ukuran tombol Hapus disamakan + pratinjau satu gambar tanpa kartu berpadding (implementasi; lanjutan tombol Hapus seragam).** User: "samain seluruh ukuran tombol hapusnya, hilangin juga container berborder dan paddingnya, agar benar benar sama kayak gambar produk dan lookbook" | Setelah gaya tombol diseragamkan masih ada dua beda: tombol pada gambar utama galeri lebih besar (48×20 karena override `right-2 top-2 text-xs`) dan `ImagePreview` masih dibungkus kartu `rounded-lg border border-border bg-background p-2` sehingga gambar tidak menempel ke tepi kotak seperti pada galeri/lookbook | Override ukuran pada tombol gambar utama dihapus (semua tombol jadi 42×19) dan pembungkus kartu di `ImagePreview` dihapus - kotak media itu sendiri yang bergaris (`rounded-lg border border-border bg-muted`, radius 10px, padding 0); prop `className` pemanggil digabung ke kotak media lewat `cn` | `src/components/admin/ImageUploader.tsx`, `src/components/ui/image-preview.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; form edit parfum: 15 tombol Hapus gambar semuanya 42×19 (font 10px, padding 2px 6px, radius 4px, right/top 4px); kotak media varian 192×192 `mx-auto`, lookbook 192×108 / 400×349, bagan ukuran 375×468, galeri utama 375×375; semua kotak padding 0px + border 0,8px; tidak ada lagi div `border border-border bg-background p-2` |
| 2026-10-15 | **Lebar pratinjau galeri mengikuti kartu induknya (implementasi; mencabut batas `max-w-sm`).** User: "buat ukuran container content gambar utama di dalam gambar produk untuk nyesuaiin parentnya, karena container content di bagan ukuran berhasil menuhin seluruh container bagan ukuran" | Batas `w-full max-w-sm` (384px) pada akar `ImageUploader` dibuat saat seksi Gambar Produk masih selebar penuh form; setelah kedua seksi berdampingan (grid dua kolom) batas itu membuat kotak gambar utama berhenti di 384px di layar lebar, sedangkan bagan ukuran (`w-full`) memenuhi kartunya - kedua kolom jadi tidak sejajar | Batas lebar pada akar `ImageUploader` dihapus; akar hanya `flex flex-col gap-3` sehingga kotak gambar utama + strip thumbnail mengikuti lebar isi kartu di semua ukuran layar | `src/components/admin/ImageUploader.tsx`, `docs/03` bagian 1C; bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; viewport 1520px CSS (zoom 0,6): sebelum akar 384 / kotak gambar utama 384 vs kotak bagan ukuran 673, sesudah akar 673 / kotak gambar utama 673 = bagan ukuran 673; viewport 912px: kartu 424 (isi 376), akar 375, gambar utama 375, bagan ukuran 375, thumbnail 85×85, tombol Hapus 42×19 |

---

## 11. Catatan lanjutan sesi

- **Terakhir diperbarui:** 2026-10-15 — skrip rotasi password akun admin dijadikan permanen (`pnpm db:reset-admin-passwords`, bagian 4.9) dan seluruh contoh perintah dokumen diseragamkan ke bash (`docs/05` bagian 7). Sebelumnya pada 2026-10-11 — **PH-08 dan PH-09 di-commit & di-push** (`f01a6d2`, `1da2b3a`; lalu dokumen `9aadebf`) dan **Disetujui** oleh pengguna pada 2026-10-11 ("gua approve"); **uji klik-through dituntaskan** pada hari yang sama (bukti di bagian 13.5 dan 14.5 serta butir jalur customer di bawah). Spek `docs/03` SITE-00..SITE-05 ditulis lebih dulu atas permintaan user; di sesi yang sama indeks `docs/03`, README, SDD, `docs/06`, `AGENTS.md`, dan `.env.example` diselaraskan dengan implementasi (audit 2026-10-11, bagian 10). PH-01 sampai PH-07 **Disetujui** — rincian dan bukti per fase di bagian 4 sampai 9 serta 12; commit: PH-06 `3501367`, PH-07 `c20f525` (riwayat lengkap `git log`, konvensi `type(scope)` per fase). Menyusul pada hari yang sama: **PH-10 — Akun & Notifikasi** direncanakan (bagian 15) — spek `docs/03` CUST-03 + NOTIF-02 ditulis, CUST-03 direvisi (ganti email wajib verifikasi ulang, TASK-110) dan enam keputusan lanjutannya dicatat (bagian 15.2 butir 8), implementasi menunggu
- **Kondisi pekerjaan (2026-10-15):** HEAD `f079e77` = `origin/main` setelah `git push`; working tree bersih. Commit setelah 2026-10-11: `dde9270` (email default Store Admin), `5195b62`/`baca360` (dokumen + skrip rotasi password admin), lalu `ac404ec`/`c344f3e`/`f079e77` (mode password acak + perintah terminal diseragamkan ke bash). Rincian sesi 2026-10-11 — dua commit saat itu: `1ad2fff` — dokumen (approval PH-08/PH-09, keputusan lanjutan PH-10, sinkronisasi spek gambar varian) dan `3c4fcee` — kode sesi paralel (Select Radix, `VariantImagePicker`, tracking per pesanan, scrollbar stabil, pemisahan identifier login) atas permintaan pengguna ("commit terpisah"), terpisah dari pekerjaan PH-10. Verifikasi sebelum commit: `pnpm exec tsc --noEmit` exit 0 dan `pnpm lint` exit 0. Dua baris kondisi-pekerjaan lama (riwayat file PH-03 dan pemeriksaannya) dihapus — buktinya lengkap di bagian 6.5 dan 6.6, commit PH-03 `e1f5ab9`/`a0a7961` tercatat di bagian 6.7; commit PH-02 `68e5ce8` (kode) dan `f167fa4` (dokumentasi) disimpan sekali di sini sebagai rujukan singkat karena tidak dicatat di tempat lain
- **Uji klik-through jalur customer (2026-10-11, sesi yang sama):** login customer → tambah alamat lewat `/profile` (pemilih titik tujuan RajaOngkir `GET /api/shipping/cities?search=Jakarta` `200`, provinsi/kota/kecamatan/kelurahan/kode pos terisi otomatis, `POST /api/customer/addresses` `201`) → produk → keranjang (checkbox item + subtotal berubah) → `/checkout?variantIds=...` (alamat tersimpan terisi otomatis plus pemilih "Alamat tersimpan"; tarif kurir muncul: SiCepat HALU `Rp 7.500`, SiCepat REG `Rp 8.000`, J&T EZ `Rp 10.000`) → `POST /api/orders` `201` (12,7 s) → halaman pesanan `WAITING_PAYMENT`. `/orders` menampilkan status + tombol "Batalkan Pesanan"/"Pesan Lagi"; "Pesan Lagi" → `POST /api/orders/[id]/reorder` `200` + pesan "1 item ditambahkan. Lihat keranjang"; `/orders/[id]/invoice` → `404` untuk pesanan belum dibayar (pembatas invoice lunas berlaku di level halaman, bukan hanya tombol); "Lupa Password" → `POST /api/auth/forgot-password` `200` (5,9 s) + pesan generik dan token Redis `auth:reset-password:*` terbentuk (1 kunci). Data uji (akun, pesanan, alamat, baris brand) dihapus dan `Product.totalStock` disinkronkan ulang ke jumlah stok varian. Catatan: `forgot-password` menunggu pengiriman email sebelum menjawab sehingga responsnya 5,9 s — bisa dipindah jadi non-blocking seperti email pesanan bila perlu
- **Keputusan terakhir:** 2026-10-11 — PH-08 dikerjakan dalam satu sesi: spek `docs/03` SITE-00..04 user-request ditulis lebih dulu, baru TASK-80..96 dieksekusi; PH-08 lalu PH-09 di-commit & di-push, kini menunggu review. Keputusan desain pekan ini: UI pemilihan alamat tiga keadaan (dasar TASK-72) dan detail Uploadthing + temuan gambar varian — keduanya di bagian 10, 2026-10-11. Ditambah: PH-10 (Akun & Notifikasi) — lima keputusan pengguna soal pemisahan halaman alamat, halaman akun mandiri, dialog notifikasi dari ikon navbar, daftar notifikasi turunan lima kejadian pesanan, dan badge unread lewat Redis (bagian 10 dan 15). Ditambah lagi: akses invoice dibatasi ke pesanan lunas (bagian 10), ganti email customer wajib verifikasi ulang lewat tautan ke email baru (revisi CUST-03, TASK-110, bagian 15), dan input gambar varian ditambahkan ke form admin produk (revisi pasca-persetujuan PH-01, bagian 4.8)
- **Langkah berikutnya (setelah instruksi user):**
  1. (Selesai 2026-10-11) Review dan approval PH-08 + PH-09 (laporan bagian 13.6 dan 14.6) — pengguna: "gua approve"; uji klik-through dituntaskan (bukti bagian 13.5 dan 14.5)
  2. Kerjakan PH-10 (bagian 15) — spek CUST-03 + NOTIF-02 sudah siap: pindahkan alamat ke `/profile/addresses`, jadikan `/profile` halaman akun mandiri, tambahkan ikon notifikasi + dialog (daftar lima kejadian pesanan + pengaturan preferensi) dengan badge unread, dan alur verifikasi email baru (`/verify-email`, TASK-110)
  3. (Selesai 2026-10-11) Uji unggah Uploadthing dengan berkas nyata — logo, favicon, dan banner terunggah dari `/site-admin/brand` (bukti bagian 14.5)
  4. (Selesai 2026-10-11) Gambar varian: input unggah ditambahkan ke `ProductForm` (`VariantImagePicker`), centang PRD 3.1.A/7.4 dipulihkan (revisi pasca-persetujuan PH-01, bagian 4.8 dan 10)
  5. Isi `EMAIL_FROM` dengan domain terverifikasi Resend agar email sampai ke pembeli mana pun (default hanya bisa kirim ke alamat pemilik akun)
  6. Sinkronisasi dokumen dengan implementasi (audit 2026-10-11) — **selesai**: indeks `docs/03` memakai status "Terimplementasi (PH-XX)" plus baris ORDER-07/SHIP-03, README ke PH-08, sisa baris SDD, `docs/06`, `AGENTS.md`, `.env.example`
  7. Tulis bagian rinci fitur yang belum punya spesifikasi `docs/03` (17 fitur, daftar di bagian 10, 2026-10-11) — satu batch saat penutupan MVP (semua fase sudah disetujui)
  8. (Opsional) Ubah `XENDIT_INVOICE_DURATION` (mis. 1800 = 30 menit) bila masa bayar perlu lebih longgar
  9. (PH-01) Password akun admin dev lemah dan **wajib diganti** sebelum produksi — Store Admin selesai 2026-10-14 (password acak 24 karakter, `.env.local` diperbarui, login dengan password lama ditolak `CredentialsSignin`). **Skrip rotasi permanen `pnpm db:reset-admin-passwords` disiapkan 2026-10-15 (bagian 4.9).** Sisa: `siteadmin@flexstore.local` (SITE_ADMIN) belum dirotasi — eksekusi menunggu pengguna
- **Hal yang masih menghalangi:** tidak ada untuk PH-08. Butir eksternal terbuka:
  (a) verifikasi webhook dari Xendit asli (tunnel publik / tombol "Test webhook" dashboard) belum dijalankan — verifikasi PH-04 memanggil endpoint webhook langsung ke server dev; (b) unggah berkas Uploadthing dengan berkas nyata **sudah diuji** 2026-10-11 lewat `/site-admin/brand` dan 2026-10-14 lewat `productImage` di UI admin (bukti bagian 4.5 dan 14.5) — sisa: aplikasi belum punya endpoint hapus berkas, jadi berkas uji masih tersimpan di Uploadthing tanpa dirujuk (`UTApi.deleteFiles` tersedia di SDK bila nanti dibutuhkan); (c) `EMAIL_FROM` domain terverifikasi belum diisi sehingga email baru sampai ke alamat pemilik akun Resend; (d) format PDF invoice final menunggu keputusan (saat ini HTML siap-cetak). Pengiriman OTP, kredensial ongkir, dan kredensial Xendit Test Mode sudah lengkap.
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
  - **Menguji mode API tanpa mengubah `.env.local`:** set variabel di process env shell sebelum start — `SHIPPING_ORIGIN_DISTRICT_ID="17590" pnpm dev`. Next.js tidak menimpa environment yang sudah ada, jadi `.env.local` tetap bersih
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
- **Dokumen:** TASK-67 selesai 2026-10-11 — `docs/03` v1.4 memuat CUST-01, CUST-02, AUTH-04, AUTH-05, ORDER-03B (plus revisi bagian batas fitur ORDER-03 soal tombol daftar). **Utang `docs/01`/`docs/02` untuk PH-06/PH-07 LUNAS 2026-10-13:** `docs/01` revisi 1.6 (status `CANCEL_REQUESTED`, aturan pembatalan 5.5, refund manual-only 5.6/3.1.G), `docs/02` data dictionary 6.2 (field pemenuhan/pembatalan Order + entitas Address, NotificationPreference, Refund, StoreSetting, CancellationReason), kontrak bagian 8, dan changelog.
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

### 13.2. Keputusan desain (2026-10-11)

Dijawab oleh pengguna saat PH-08 dimulai:

- **(a) Penyimpanan kredensial:** **rahasia tetap di env** (`XENDIT_SECRET_KEY`, `XENDIT_WEBHOOK_TOKEN`, `RAJAONGKIR_API_KEY`, `RESEND_API_KEY`). Database hanya menyimpan knob operasional non-rahasia (mode, durasi invoice, asal ongkir, kurir, berat/item, tarif flat, sakelar) dan UI hanya menampilkan **status ada/belum** kunci (boolean), tidak pernah nilainya. Alasan: OWASP A02 (kriptografi gagal) — menyimpan kunci pembayaran di database menuntut manajemen kunci + rotasi yang tidak sepadan untuk MVP.
  - Jawaban atas pertanyaan "kenapa Site Admin tugasnya konfigurasi": yang dikelola Site Admin bukan rahasia, melainkan **knob operasional level platform** dan **akun Store Admin** — hanya Site Admin yang boleh melihat/mengubahnya (PRD 2.4 melarang Store Admin).
- **(b) Rute:** prefix terpisah `/site-admin/*` (halaman) dan `/api/site-admin/*` (API). Bukan subdomain (ribet di dev lokal) dan bukan sub-bagian `/admin/platform` (melanggar pemisahan PRD 2.4).
- **(c) Akun Site Admin pertama:** lewat seed, pola sama seperti Store Admin — `SEED_SITE_ADMIN_EMAIL` / `SEED_SITE_ADMIN_PASSWORD`; bila password kosong dibuat acak dan dicetak sekali (tidak ada kredensial hardcode).

Keputusan tambahan yang diambil agent (dicatat supaya bisa ditinjau):

- **Pemisahan ketat.** Site Admin tidak boleh mengakses `/admin/*` dan Store Admin tidak boleh mengakses `/site-admin/*`. Ini **menyimpang dari SDD 8** yang menulis `GET /api/admin/products` boleh "Store Admin or Site Admin"; baris SDD itu tidak diadopsi demi pemisahan PRD 2.4. Dicatat juga di `docs/03` SITE-00.
- **Penonaktifan berlaku segera.** Guard API (`requireStoreAdmin`, `requireCustomer`) dan fungsi halaman (`requireStoreAdminPage`, `requireCustomerPage`) membaca ulang `role` + `deactivatedAt` dari database per permintaan, bukan hanya mempercayai JWT (OWASP A07). Menambah satu query PK per permintaan terlindungi.
- **Nilai efektif:** `PlatformSetting` (bila baris ada) → env → bawaan. Baris `PlatformSetting` memakai pola satu baris tetap `id = "default"`, sama seperti `StoreSetting` (PH-06).
- **Reset password Store Admin:** Site Admin menetapkan password baru langsung dari UI (tanpa email), supaya tidak bergantung pada domain Resend terverifikasi.
- **Mode pemeliharaan:** banner di storefront + penolakan pembuatan pesanan (`503 MAINTENANCE`); bukan penguncian seluruh situs (proxy Edge tidak bisa membaca database).
- **`paymentMode`** (`SANDBOX`/`PRODUCTION`) bersifat label/jejak audit; Xendit memakai base URL sama dan membedakan lewat kunci.

### 13.3. Daftar task

| ID | Task | Fitur | Dependensi | Status |
| --- | --- | --- | --- | --- |
| TASK-80 | Skema: `Role.SITE_ADMIN`, `User.deactivatedAt`, model `PlatformSetting`, enum `PlatformPaymentMode`; migrasi | SITE-00..04 | - | Selesai |
| TASK-81 | Seed Site Admin (`SEED_SITE_ADMIN_*`), pola acak bila kosong | SITE-00 | TASK-80 | Selesai |
| TASK-82 | Lib platform: `src/lib/platform/{queries,mutations,users,status,view,validation,index}.ts` (baca/baca-efektif/tulis + Zod) | SITE-01..03 | TASK-80 | Selesai |
| TASK-83 | Auth: `proxy.ts` matcher `/site-admin`, callback `authorized`, `requireSiteAdmin` + `requireSiteAdminPage`, pemeriksaan `deactivatedAt` dari DB di guard + halaman, routing role di `LoginForm` | SITE-00 | TASK-80 | Selesai |
| TASK-84 | API `GET`/`PATCH /api/site-admin/platform-settings` | SITE-01 | TASK-82, 83 | Selesai |
| TASK-85 | API `GET`/`PATCH /api/site-admin/payment-settings` + panel status env (boolean) | SITE-02 | TASK-82, 83 | Selesai |
| TASK-86 | API `GET`/`PATCH /api/site-admin/shipping-settings` + panel status env (boolean) | SITE-03 | TASK-82, 83 | Selesai |
| TASK-87 | API `GET`/`POST /api/site-admin/users` + `PATCH /api/site-admin/users/[id]` (aktif/nonaktif, reset password) | SITE-04 | TASK-83 | Selesai |
| TASK-88 | Resolusi nilai efektif: durasi invoice (payments), asal/kurir/berat/tarif flat (shipping) + penegakan `paymentEnabled`/`shippingEnabled` | SITE-02, 03 | TASK-82 | Selesai |
| TASK-89 | Penegakan platform: `maintenanceMode` (banner + `503` order create), `registrationEnabled` (`403` register + pemberitahuan) | SITE-01 | TASK-82 | Selesai |
| TASK-90 | UI area platform: `src/app/site-admin/layout.tsx`, `Sidebar` platform, dasbor `/site-admin` | SITE-00 | TASK-83 | Selesai |
| TASK-91 | UI `/site-admin/settings` (form pengaturan platform) | SITE-01 | TASK-84, 90 | Selesai |
| TASK-92 | UI `/site-admin/payment` (form + panel status) | SITE-02 | TASK-85, 90 | Selesai |
| TASK-93 | UI `/site-admin/shipping` (form + panel status) | SITE-03 | TASK-86, 90 | Selesai |
| TASK-94 | UI `/site-admin/users` (tabel + form + aksi) | SITE-04 | TASK-87, 90 | Selesai |
| TASK-95 | Routing role storefront: alihkan non-customer ke `/admin` atau `/site-admin` sesuai role (`cart`, `checkout`, `session.ts`, `HeaderAccountMenu`) | SITE-00 | TASK-83 | Selesai |
| TASK-96 | Verifikasi + dokumentasi: exit criteria, bukti, status `docs/03` SITE-00..04 → Terimplementasi | SITE-00..04 | semua | Selesai |

### 13.4. Exit criteria

- [x] `prisma generate` + `prisma migrate deploy` sukses; enum `SITE_ADMIN`, `deactivatedAt`, `PlatformSetting` ada
- [x] Seed membuat akun Site Admin (kredensial dari env; acak bila kosong, dicetak sekali)
- [x] Site Admin login → `/site-admin`; Store Admin tidak bisa `/site-admin`; Site Admin tidak bisa `/admin` (AC-SITE-00-01..06)
- [x] Pengaturan platform tersimpan dan berlaku (AC-SITE-01-01..06)
- [x] Konfigurasi pembayaran tersimpan; durasi efektif dipakai; sakelar menolak pembayaran; nilai kunci tidak pernah terkirim (AC-SITE-02-01..06)
- [x] Konfigurasi ongkir tersimpan; asal/kurir/berat/tarif flat dipakai; sakelar memaksa fallback (AC-SITE-03-01..06)
- [x] Kelola Store Admin: buat, nonaktifkan (berlaku segera), aktifkan, reset password (AC-SITE-04-01..07)
- [x] `tsc --noEmit` bersih, `pnpm lint` exit 0, `pnpm build` exit 0, rute `/site-admin/*` + `/api/site-admin/*` muncul
- [x] Smoke HTTP: 401 tanpa sesi, 403 role salah, 404 target bukan Store Admin, 200 dengan sesi Site Admin
- [x] `docs/03` SITE-00..04 → Terimplementasi; `docs/04` bagian 13.5 bukti + 13.6 laporan review

### 13.5. Bukti verifikasi (2026-10-11)

**Perintah:**

| Perintah | Hasil |
| --- | --- |
| `pnpm exec prisma migrate diff --from-schema-datasource prisma/schema.prisma --to-schema-datamodel prisma/schema.prisma --script -o prisma/_ph08.sql` | exit 0 — isi SQL: `CREATE TYPE "PlatformPaymentMode"`, `ALTER TYPE "Role" ADD VALUE 'SITE_ADMIN'`, `ALTER TABLE "users" ADD COLUMN "deactivatedAt"`, `CREATE TABLE "platform_settings"` |
| File dipindah ke `prisma/migrations/20261011130000_add_ph08_site_admin/migration.sql` lalu `pnpm exec prisma migrate deploy` | exit 0 — `All migrations have been successfully applied.` (11 migrasi) |
| `pnpm exec prisma generate` | exit 0 — Prisma Client v5.22.0 |
| `pnpm exec tsc --noEmit` | exit 0 (bersih) |
| `pnpm lint` | exit 0 |
| `pnpm build` | exit 0 — rute keluar: `/site-admin`, `/site-admin/{settings,payment,shipping,users}`, `/api/site-admin/{platform-settings,payment-settings,shipping-settings,users}`, `/api/site-admin/users/[id]`, `ƒ Proxy (Middleware)` |

**Uji lib (tsx, terhadap database Supabase aktif):** 35 pemeriksaan **lulus**, 0 gagal. Per katup:

- SITE-01: baris `platform_settings` belum ada → bawaan; simpan `{maintenanceMode: true, maintenanceMessage: "Uji pemeliharaan", registrationEnabled: false}` → terbaca ulang lewat `getPublicPlatformStatus`.
- SITE-02: `isPaymentEnabled()` → `false`; `getEffectiveInvoiceDurationSeconds()` → `1800`; `paymentMode` → `PRODUCTION`; sakelar `paymentEnabled: false` membuat `createPaymentForOrder` menjawab `PAYMENT_DISABLED` (pesanan uji `WAITING_PAYMENT` dibuat dan dihapus khusus untuk uji ini, tidak menyentuh data yang ada).
- SITE-03: nilai efektif dari database (`originDistrictId "1234"`, `weightPerItemGram 750`, `flatRateIdr 15000`); `isShippingApiConfigured()` → `false` saat dimatikan; `calculateShippingQuote` → `source: "fallback"` dengan `cost: 15000`.
- SITE-04: `createStoreAdmin` → `role: STORE_ADMIN` dan password terverifikasi `verifyPassword`; email duplikat → `P2002`; `findStoreAdmin(id Site Admin)` → `null` (jalur 404); `updateStoreAdmin(active: false)` → `deactivatedAt` terisi dan `findUserAccessById` melihatnya; `active: true` → kembali `null`; reset password → verifikasi dengan password baru berlaku.
- Pembersihan: baris `platform_settings` dihapus, akun uji dihapus, pengaturan kembali ke bawaan (`maintenanceMode: false`).

**Smoke HTTP (dev server `pnpm dev` + skrip Node dengan cookie jar manual):** 50 pemeriksaan **lulus**, 0 gagal.

- **A (401 tanpa sesi):** keempat `GET /api/site-admin/*` → `401`.
- **B (Store Admin vs platform):** login `storeadmin@flexstore.local` → `GET /api/site-admin/users` `403`, `GET /api/admin/products` `200`, `GET /site-admin` `302` → `/admin`.
- **C (Site Admin):** login `siteadmin@flexstore.local` → `GET /api/site-admin/platform-settings` `200` (field `secrets` hanya boolean, tidak ada nilai kunci), keempat halaman `/site-admin/*` `200`, `GET /admin` `302` → `/site-admin`.
- **D-F (SITE-04):** `POST /api/site-admin/users` `201`; akun baru login → `GET /api/admin/products` `200`; setelah `PATCH {active:false}` → **sesi lama** `GET /api/admin/products` `401` dan login ulang gagal; setelah `{active:true}` + `{password}` → login dengan password baru berhasil.
- **G-H (batas):** email duplikat `409`, target akun Site Admin `404`, id bukan UUID `400`, body kosong `400`.
- **I (SITE-01 pemeliharaan):** storefront `/` tetap `200` **dan** banner berisi pesan pemeliharaan; `POST /api/orders/create` `503` `MAINTENANCE`; `POST /api/auth/register` tetap `200`.
- **J (SITE-01 pendaftaran):** `POST /api/auth/register` `403` `REGISTRATION_DISABLED`; halaman `/register` `200` dan menampilkan "Pendaftaran sedang ditutup"; buka lagi → `200`.
- **K-L (validasi Zod):** `paymentMode` salah `400`, `couriers` salah format `400`, `maintenanceMode: "ya"` `400`.
- **Bersih-bersih:** akun uji terhapus, baris `platform_settings` `0`.

**Data uji yang ditambahkan (persisten):** akun Site Admin `siteadmin@flexstore.local`, id `251881e3-9e99-4a52-b406-a8c5c37a2a7c`, dibuat dengan logika seed yang sama. Password akun ini tidak ditulis di dokumen; rotasinya sejak 2026-10-15 memakai `pnpm db:reset-admin-passwords` (bagian 4.9 dan 10).

**Uji klik-through (browser nyata, dev server `pnpm dev`, 2026-10-11):** tanpa sesi, `/site-admin` → `302` ke `/login?callbackUrl=/site-admin`; setelah login Site Admin, enam halaman dibuka berurutan dan semua render tanpa error — `/site-admin` (Dasbor Platform + panel Status Kunci Rahasia), `/site-admin/settings` (Mode Pemeliharaan, Pendaftaran Publik, `maintenance-message`), `/site-admin/payment`, `/site-admin/shipping`, `/site-admin/users`, `/site-admin/brand`. Sidebar platform tampil di semua halaman; palet brand yang sedang aktif ikut terpakai di area `/site-admin` (lihat bagian 14.5).

### 13.6. Laporan untuk review

1. **Fase dan status:** PH-08 — Site Admin (Platform Configuration), **Disetujui** (2026-10-11; keputusan pengguna: "gua approve")
2. **Hasil yang tersedia:** Role `SITE_ADMIN` + area `/site-admin/*` terpisah dari `/admin` (layout, sidebar platform, dasbor); konfigurasi platform (`PlatformSetting` satu baris) untuk mode pemeliharaan dan status pendaftaran; konfigurasi pembayaran Xendit (sakelar, mode, durasi invoice) dan ongkir RajaOngkir (sakelar, asal, kurir, berat/item, tarif flat) dengan nilai efektif database → env → bawaan; panel status kunci yang hanya menampilkan boolean; kelola akun Store Admin (buat, nonaktifkan/aktifkan, reset password) dengan penegakan status aktif dari database; `prisma/seed.ts` bertambah `seedSiteAdmin`
3. **Task selesai / belum selesai:** TASK-80 sampai TASK-96 **semua selesai** (bagian 13.3)
4. **Verifikasi:** `migrate deploy`, `generate`, `tsc`, `lint`, `build` semuanya exit 0; uji lib 35 pemeriksaan lulus; smoke HTTP 50 pemeriksaan lulus. Rincian di bagian 13.5
5. **Cara mencoba:**
   - `pnpm dev` → buka `http://localhost:3000/login`
   - Login **Site Admin**: `siteadmin@flexstore.local` (password dari `SEED_SITE_ADMIN_PASSWORD` atau hasil rotasi) → dialihkan ke `/site-admin`
   - `/site-admin/shipping`: matikan ongkir, simpan → buka keranjang → checkout → ongkir memakai tarif flat
   - `/site-admin/settings`: aktifkan mode pemeliharaan → banner muncul di halaman toko, checkout ditolak `503`
   - `/site-admin/users`: buat Store Admin baru dengan password yang Anda pilih → login dengan akun itu → kembali ke tab Site Admin → Nonaktifkan → sesi Store Admin langsung `401`
   - `/site-admin/payment`: ubah "Masa bayar invoice" → pesanan baru (bila ada) memakai durasi baru
   - Login **Store Admin**: `storeadmin@flexstore.local` (password dari `SEED_ADMIN_PASSWORD` atau hasil rotasi) → buka `/site-admin` → dialihkan ke `/admin`
6. **Masalah / batasan:**
   - **`pnpm db:seed` tidak dijalankan penuh.** `seedCatalog` menghapus dan membuat ulang varian, sementara `OrderItem` masih merujuk `variantId`; menjalankannya berisiko memutus tautan pesanan. Akun Site Admin dibuat dengan menjalankan fungsi seed yang sama lewat skrip sekali jalan; `seedSiteAdmin()` tetap ada di `prisma/seed.ts` untuk run berikutnya
   - **Rahasia tetap di env.** Artinya Site Admin tidak bisa mengganti kunci Xendit/RajaOngkir dari UI — hanya status keberadaannya. Ini keputusan yang Anda pilih (OWASP A02); untuk MVP satu deployment hal ini cukup
   - **`paymentMode` label saja.** Xendit memakai base URL yang sama; sandbox vs produksi ditentukan oleh kunci, jadi kolom ini jejak audit, bukan pengubah perilaku
   - **Mode pemeliharaan tidak mengunci seluruh situs.** Proxy (Edge) tidak bisa membaca database, jadi yang ditegakkan adalah banner dan penolakan pembuatan pesanan. Pembacaan keranjang, lacak pesanan, dan invoice tetap jalan
   - **Cache ongkir lama tidak dibersihkan massal** saat konfigurasi berubah; nilainya masih terikat TTL 10 menit. Perilaku lama (PH-02) tetap berlaku untuk kunci cache yang sama
   - **Uji klik-through manual lewat browser belum dijalankan** oleh agent (uji memakai HTTP langsung + cookie jar). Yang ingin Anda cek sendiri: keempat halaman platform terbaca benar, dan banner pemeliharaan tampil di layar
   - Pemeriksaan `GET /api/admin/products` saat mematikan akun membaca ulang database per permintaan — tambahan satu query PK. Tidak diukur performanya
7. **Keputusan yang dibutuhkan:**
   - Konfirmasi apakah pemisahan ketat (Site Admin dilarang masuk `/admin`, meski SDD 8 menulis "Store Admin or Site Admin") diterima; jika tidak, perubahan hanya ada di `authorized()` dan guard
   - Konfirmasi apakah pembuatan akun Site Admin tambahan (lewat aplikasi, bukan seed) perlu ditambahkan — sekarang di luar cakupan PRD 2.4
   - Konfirmasi apakah PH-08 disetujui, dan apakah lanjut ke PH-09 (bila ada) atau penutupan MVP

---

## 14. Rincian Fase: PH-09 — Brand Customization (SITE-05)

### 14.1. Tujuan dan batas

- **Tujuan:** Site Admin bisa mengubah identitas brand per deployment lewat UI tanpa menyentuh kode: nama brand, logo, favicon, tagline, palet warna (kode heksadesimal), teks footer, dan banner homepage; semua titik hardcode "FlexStore" diganti nilai dinamis dari `BrandSetting`.
- **Batas:** Sesuai `docs/03` SITE-05 bagian 12 — tanpa kustomisasi halaman bayar Xendit (domain Xendit), token sekunder `card`/`popover`/`input`/`ring` tetap bawaan, tanpa slider multi-banner/promo berjadwal, info toko & kebijakan tetap CONFIG-01 (Store Admin).
- **Prasyarat:** PH-08 disetujui (role `SITE-00` + area `/site-admin`). Fase ini menunggu gate PH-08.
- **Hasil yang bisa dicoba:** Ubah nama/warna/logo/banner di `/site-admin/brand`, reload storefront, `/admin`, halaman invoice — semuanya ikut berubah tanpa rebuild; email berikutnya memakai nama baru.

### 14.2. Keputusan desain (2026-10-11)

1. **Konsep Site Admin direvisi oleh pengguna:** peran utama = kustomisasi brand per deployment (1 deployment = 1 brand store) + kelola akun Store Admin; konfigurasi payment/shipping tetap dipertahankan sementara. PRD direvisi **v1.2** (logo/banner/warna pindah dari bagian 2.3 ke 2.4). Terinci di bagian 10.
2. **Cakupan (jawaban pengguna):** (a) palet = **9 grup inti / 15 kolom hex** — `primary`(+fg), `secondary`(+fg), `accent`(+fg), `background`/`foreground`, `muted`(+fg), `border`, `destructive`(+fg), `success`(+fg); (b) warna berlaku **seluruh aplikasi** (admin ikut); (c) banner **lengkap** — gambar + judul + teks + tombol (label + link) + sakelar aktif, hero teks default bila mati.
3. **Penyimpanan:** model baru `BrandSetting`, satu baris tetap `id = "default"` (pola `PlatformSetting`/`StoreSetting`). Semua kolom nullable + default, sehingga tanpa baris = tampilan persis seperti sekarang; palet sebagian juga sah (hanya kolom terisi yang menimpa).
4. **Penerapan palet:** nilai hex disuntikkan sebagai custom properties React lewat atribut `style` pada `<html>` di root layout — inline style mengalahkan aturan `:root` di `globals.css`. **Tanpa** `dangerouslySetInnerHTML` (ATURAN: XSS/A03); nilai sudah tervalidasi Zod (`^#[0-9A-Fa-f]{6}$`) saat disimpan, jadi tidak ada ruang bagi gaya sembarang.
5. **Pembacaan request-time tanpa mengorbankan PPR:** `getBrandSetting()` memakai `use cache` + `cacheTag("brand-settings")` (bukan `connection()`). Alasannya: `connection()` di root layout membuat **semua** rute yang diprerender gagal build (`Next.js encountered uncached or runtime data during prerendering`), sedangkan cache ber-tag menjaga shell PPR tetap statis. Penyimpanan memanggil `revalidateTag("brand-settings", "max")` **dan** `revalidatePath("/", "layout")`; `revalidatePath` membuat permintaan pertama setelah simpan sudah memakai identitas baru (tanpa jeda stale-while-revalidate satu permintaan). API `GET` dan halaman `/site-admin/brand` sengaja memakai `readBrandSetting()` (tanpa cache) supaya form selalu melihat nilai database.
6. **Unggah gambar:** endpoint Uploadthing baru `brandAsset` (logo + favicon, 2MB) dan `bannerImage` (banner, 4MB), keduanya dengan middleware role `SITE_ADMIN` (pola `productImage`). URL yang disimpan divalidasi hanya host `utfs.io`/`*.ufs.sh` — menutup `javascript:`/domain liar (A03). `next.config.ts` `remotePatterns` sudah mencakup kedua host.
7. **Nama tampilan = `BrandSetting.brandName` — satu-satunya nama.** Awalnya `StoreSetting.storeName` dipertahankan sebagai info toko operasional, tetapi audit pemakaian menunjukkan hanya konsumsinya label pickup "Ambil di ..." di checkout. Supersede keputusan 2026-10-11: field dihapus (kolom DB ikut), label pickup memakai `brandName`.
8. **Titik hardcode yang diganti** (audit 2026-10-11):
   - TSX: `src/app/layout.tsx` (title default/template + `icons` favicon baru + description → tagline), `components/layout/Header.tsx` (nama → logo/teks), `components/layout/Footer.tsx` (nama, tagline, `©`, teks footer), `(auth)/layout.tsx`, `(auth)/login/page.tsx`, `(auth)/register/page.tsx`, `(storefront)/page.tsx` (hero → banner), `(storefront)/products/[slug]/page.tsx` (meta deskripsi), `(storefront)/orders/[id]/invoice/page.tsx` (kop), `admin/layout.tsx`, `admin/products/page.tsx`, `site-admin/layout.tsx`
   - TS: `src/emails/` — 7 subjek (`order-confirmation`, `order-shipped`, `payment-success`, `refund-completed`, `cancellation`, `set-password`, `password-reset`) + isi `set-password`/`password-reset`, footer `src/emails/layout.ts`, dan fallback `EMAIL_FROM` di `src/lib/notifications/config.ts` (kini `"${brandName} <onboarding@resend.dev>"`)
   - `src/lib/site.ts` tetap ada sebagai fallback tagline bila kolom kosong
9. **Email membaca brand saat pengiriman** (bukan disimpan di template); email lama memakai nama lama (jejak histori tidak diubah).

### 14.3. Daftar task

| ID | Deskripsi | Fitur | Depends | Status |
| --- | --- | --- | --- | --- |
| TASK-97 | Skema `BrandSetting` + migrasi Prisma + lib `src/lib/brand/` (`queries` dengan cache ber-tag, `palette` bebas-Prisma untuk client, `validation` Zod, `mutations`, `view`, `index`) + `GET`/`PATCH /api/site-admin/brand` (role check + `withRouteErrors`) | SITE-05 | - | Selesai |
| TASK-98 | Endpoint Uploadthing `brandAsset` (logo + favicon) dan `bannerImage`, middleware `SITE_ADMIN`, `UploadThingError` berkode | SITE-05 | TASK-97 | Selesai |
| TASK-99 | Halaman `/site-admin/brand` + `src/components/platform/BrandSettingsForm` (4 bagian: Identitas, Palet Warna — input hex + color picker + tombol atur ulang, Banner Homepage, Teks Footer) + `AssetPicker` + item nav di `SiteAdminSidebar` | SITE-05 | TASK-97 | Selesai |
| TASK-100 | Penerapan global: root layout (`generateMetadata` — title/template/description/icons) + palet di `<html style>`; `Header` (logo/teks), `Footer` (nama/tagline/teks footer/`©`) | SITE-05 | TASK-97 | Selesai |
| TASK-101 | Ganti sisa hardcode storefront/auth/admin/site-admin + kop invoice + hero homepage menjadi banner dinamis (komponen banner baru di `(storefront)/page.tsx`) | SITE-05 | TASK-100 | Selesai |
| TASK-102 | Email: 7 subjek + isi set/reset password + footer email + fallback `EMAIL_FROM` memakai `brandName` saat kirim | SITE-05 | TASK-97 | Selesai |
| TASK-103 | Verifikasi (`migrate deploy`, `tsc`, `lint`, `build`, uji lib + smoke HTTP), bersihkan data uji, tulis bukti (14.5) dan laporan (14.6) | SITE-05 | TASK-98..102 | Selesai |

### 14.4. Exit criteria

- [x] `PATCH /api/site-admin/brand` menerima data valid → `200`, perubahan berlaku di seluruh rute **tanpa rebuild** (AC-SITE-05-01)
- [x] Store Admin → `403`; tanpa sesi → `401`; hex/URL/link tidak valid → `400 VALIDATION_ERROR` tanpa mengubah data lama (AC-SITE-05-03/04)
- [x] Ubah `primaryColor` → tombol/link aktif berubah warna di storefront **dan** `/admin` (AC-SITE-05-02)
- [x] Endpoint unggah brand menolak role selain Site Admin (`403`) (AC-SITE-05-09)
- [x] Logo, favicon, banner aktif/mati, dan teks footer tampil sesuai AC-05/06/08/10
- [x] `brandName` baru terbaca di header, judul halaman, kop invoice, dan subjek email berikutnya (AC-SITE-05-07)
- [x] `pnpm exec tsc --noEmit`, `pnpm lint`, `pnpm build` exit 0; uji lib + smoke HTTP lulus; data uji dibersihkan
- [x] Bukti verifikasi ditulis di bagian 14.5 dan laporan review di bagian 14.6, lalu **STOP** menunggu keputusan pengguna

### 14.5. Bukti verifikasi (2026-10-11)

**Perintah:**

| Perintah | Hasil |
| --- | --- |
| `pnpm db:deploy` (`prisma migrate deploy`) | exit 0 — 12 migrasi, termasuk `20261011140000_add_ph09_brand_setting` (`CREATE TABLE "brand_settings"`) |
| `pnpm exec prisma generate` | exit 0 — Prisma Client v5.22.0 (sempat `EPERM` karena dev server memegang `query_engine-windows.dll.node`; dev server dihentikan dulu) |
| `pnpm exec tsc --noEmit` | exit 0 (bersih) |
| `pnpm lint` | exit 0 |
| `pnpm build` | exit 0 — rute baru: `/site-admin/brand`, `/api/site-admin/brand`; PPR tetap jalan (`◐ /`, `◐ /products`, `◐ /products/[slug]`, `◐ /orders/[id]/invoice`), `/login` tetap statis (`○`) |

**Smoke HTTP (`next start -p 3001` + skrip Node dengan cookie jar manual):** 49 pemeriksaan **lulus**, 0 gagal.

- **A (tanpa sesi):** `PATCH /api/site-admin/brand` → `401`; `POST /api/uploadthing` tanpa sesi ditolak.
- **B (Site Admin):** login → `GET /site-admin/brand` `200` (judul, bagian Palet Warna, bagian Banner Homepage, tautan sidebar).
- **C (bawaan):** `PATCH {brandName: "FlexStore", bannerEnabled: false}` → hero `Selamat datang di FlexStore`, footer `FlexStore`, tagline bawaan `Toko online terpercaya…` — sama seperti sebelum ada baris `brand_settings`.
- **D (berlaku di seluruh rute):** `PATCH` nama `Toko Uji Brand` + `primaryColor #123456` + `primaryFg #FFFFFF` + `accentColor #ABCDEF` + banner aktif (`Promo Uji Otomatis`, tombol `Beli Sekarang` → `/products`) + tagline/teks footer uji → beranda: nama brand, `<html style="--primary:#123456…">`, judul banner, tautan tombol, teks footer, `<title>Toko Uji Brand</title>`; `/login`: `Masuk ke Toko Uji Brand` + `<title>Masuk | Toko Uji Brand</title>`; invoice pesanan uji: kop `Toko Uji Brand` (tanpa `FlexStore`).
- **E (validasi Zod, 400 `VALIDATION_ERROR`):** `#ZZZZZZ`, `#12345`, `javascript:alert(1)`, `//evil.example.com`, `https://evil.example.com/logo.png`, nama brand kosong, nama > 50 karakter, `bannerEnabled: "ya"`. Lolos: `https://contoh.example.com/promo` dan `https://utfs.io/f/abc123.png`.
- **F (otorisasi):** customer `PATCH`/`GET` → `403`, halaman `/site-admin/brand` → `302`; Store Admin `PATCH` → `403`.
- **Pembersihan:** 3 akun smoke + 1 pesanan uji (`SMOKE-PH09-0001`) + baris `brand_settings` dihapus; storefront kembali ke tampilan bawaan.

**Probe khusus cache/PPR:** dengan `revalidateTag("brand-settings", "max")` saja, permintaan **pertama** setelah simpan masih menyajikan shell lama (stale-while-revalidate), permintaan kedua baru baru. Setelah ditambah `revalidatePath("/", "layout")`, permintaan pertama sudah memakai nama/warna/banner baru (storefront dan `/login`).

**Probe jalur gambar (8 pemeriksaan lulus, 0 gagal):** `PATCH` dengan `logoUrl`/`faviconUrl`/`bannerImageUrl` (`https://utfs.io/f/...`) + banner aktif → header menampilkan `<img src="...logo...">` dengan `alt` nama brand, metadata memuat `rel="icon" href="...favicon..."`, homepage menampilkan gambar + judul banner, `/login` memakai nama baru. Data uji (akun + baris brand) dihapus setelah probe.

**Mode dev (`pnpm dev`, port 3000):** `PATCH` → `200`, tampilan langsung berubah, server tetap hidup. Catatan: build/`prisma generate` tidak boleh jalan bersamaan dengan dev server (mengunci engine Prisma dan `.next`).

**Uji klik-through (browser nyata, dev server `pnpm dev`, 2026-10-11):** tiga berkas gambar nyata (PNG 1x1) diunggah dari `/site-admin/brand` — logo dan favicon lewat `POST /api/uploadthing?actionType=upload&slug=brandAsset`, banner lewat `slug=bannerImage`, masing-masing dilanjutkan `PUT` ke `sea1.ingest.uploadthing.com` dan pratinjau `<img>` muncul dengan URL `https://jqvuhozget.ufs.sh/f/...`. Identitas uji disimpan (`FlexStore Click Test`, tagline `Toko Uji Klik`, `primaryColor #FF6600`, banner aktif dengan judul/teks/label/tautan, teks footer) → `PATCH /api/site-admin/brand` `200` dan toast "Identitas brand tersimpan." (7,4 s). Beranda pada permintaan **pertama** langsung memakai nilai baru: `<title>FlexStore Click Test</title>`, `--primary: #FF6600`, nama + tagline di header, gambar + judul + tombol banner, teks footer, `rel="icon"` ke URL Uploadthing, dan logo `<img alt="FlexStore Click Test">`; palet juga terbaca di area `/site-admin` (`--primary` = `#FF6600`) sehingga berlaku seluruh aplikasi. Dikembalikan ke bawaan lewat `PATCH {brandName: "FlexStore", bannerEnabled: false}` `200` → beranda kembali `<title>FlexStore</title>`, tanpa banner, warna bawaan; baris `brand_settings` dihapus lagi (0 baris). Catatan: tiga berkas uji tetap tersimpan di Uploadthing (tidak ada endpoint hapus) tetapi tidak dirujuk baris mana pun.

### 14.6. Laporan untuk review

1. **Fase dan status:** PH-09 — Brand Customization (SITE-05), **Disetujui** (2026-10-11; keputusan pengguna: "gua approve")
2. **Hasil yang tersedia:** model `BrandSetting` (satu baris `id = "default"`, semua kolom nullable) + migrasi; lib `src/lib/brand/` (`queries` ber-cache tag, `palette` bebas-Prisma, `validation` Zod, `mutations` + invalidasi, `view`, `index`); `GET`/`PATCH /api/site-admin/brand`; endpoint Uploadthing `brandAsset` (logo/favicon 2MB) + `bannerImage` (4MB) dengan middleware `SITE_ADMIN`; halaman `/site-admin/brand` dengan 4 bagian (Identitas, Palet Warna 15 slot + color picker + atur ulang, Banner Homepage, Teks Footer) + `AssetPicker` + nav sidebar; penerapan ke root layout (title/template/description/icons + palet di `<html style>`), Header (logo), Footer, layout auth + login/register, layout admin + daftar produk, layout site-admin, meta deskripsi detail produk, kop invoice, hero homepage (banner dinamis), dan email (7 subjek + isi set/reset password + footer + fallback `EMAIL_FROM`)
3. **Task selesai / belum selesai:** TASK-97 sampai TASK-103 **semua selesai** (bagian 14.3)
4. **Verifikasi:** `migrate deploy`, `generate`, `tsc`, `lint`, `build` exit 0; smoke HTTP 49 pemeriksaan lulus, 0 gagal; probe invalasi cache; mode dev dicek. Rincian di bagian 14.5
5. **Cara mencoba:**
   - `pnpm dev` → `http://localhost:3000/login` → login Site Admin (`siteadmin@flexstore.local`; password dari `SEED_SITE_ADMIN_PASSWORD` atau yang dicetak saat seed)
   - `/site-admin/brand` → ubah nama brand, tagline, unggah logo/favicon, isi palet (mis. Primary `#123456`), aktifkan banner + unggah gambar + judul/tombol, isi teks footer → Simpan
   - Reload beranda: hero/banner, nama di header, warna tombol, footer berubah; buka `/admin` (warna ikut), `/login`, dan invoice pesanan → nama/logo baru
   - Kembalikan ke bawaan: kosongkan semua kolom + matikan banner → tampilan kembali seperti semula
6. **Masalah / batasan:**
   - **Token sekunder tetap bawaan** (`card`, `popover`, `input`, `ring`): kombinasi ekstrem (mis. `background` gelap) bisa menurunkan kontras kartu. Sesuai keputusan cakupan (14.2 butir 2); bisa ditambah nanti bila perlu
   - **Unggah berkas nyata belum diuji end-to-end** (catatan saat review): validasi URL + middleware role sudah diuji lewat HTTP, tetapi unggahan sungguhan butuh browser + `UPLOADTHING_TOKEN`; kotak unggah belum diklik manual. **Diperbarui 2026-10-14: sudah diklik manual** — logo/favicon/banner lewat `/site-admin/brand` (2026-10-11, bagian 14.5) dan galeri produk `productImage` (2026-10-14, bagian 4.5)
   - **`revalidateTag(..., "max")` bersifat stale-while-revalidate**; ditutup dengan `revalidatePath("/", "layout")` supaya permintaan pertama setelah simpan sudah baru. Di dev, cache selalu segar
   - **Email memakai brand saat kirim**, jadi email lama menyimpan nama lama (jejak histori tidak diubah)
   - **Nama tampilan email** hanya berlaku bila `EMAIL_FROM` kosong; bila `EMAIL_FROM` diisi di env, nama di env yang menang
   - **`pnpm db:seed` penuh tetap tidak dijalankan** (alasan sama seperti PH-08)
   - **Uji klik-through browser belum dijalankan** agent; yang sebaiknya Anda cek sendiri: unggah logo/favicon/banner, warna di `/admin`, dan tampilan mobile
7. **Keputusan yang dibutuhkan:**
   - Konfirmasi apakah PH-09 disetujui
   - Konfirmasi urutan commit: PH-08 (masih ter-staging) + dokumen PH-09 + kode PH-09 dalam satu commit, atau dipisah
   - Konfirmasi apakah perlu varian palet gelap (mode gelap) atau cukup satu palet terang seperti sekarang

---

## 15. Rincian Fase: PH-10 — Akun & Notifikasi (Profil + Alamat + Pusat Notifikasi)

### 15.1. Tujuan dan batas

- **Tujuan:** Merapikan UI akun customer: halaman alamat berdiri sendiri dan fokus pada alamat (`/profile/addresses`), `/profile` menjadi halaman akun mandiri (info akun saja), dan notifikasi pindah dari halaman ke dialog yang dibuka dari ikon lonceng di navbar — daftar notifikasi pesanan + pengaturan preferensi email, dengan badge belum dibaca.
- **Termasuk:**
  - CUST-01 (revisi UI) — halaman `/profile/addresses` hanya alamat; tanpa info akun dan preferensi
  - CUST-03 (baru) — halaman `/profile` sebagai halaman akun mandiri: nama, email, ubah password
  - CUST-03 (tambahan) — perubahan email wajib verifikasi ulang: token sekali pakai di Redis + halaman `/verify-email`
  - CUST-02 (revisi UI) — formulir lima preferensi email dipindah dari `/profile` ke dialog notifikasi
  - NOTIF-02 (baru) — ikon lonceng di navbar + dialog berisi daftar notifikasi dan pengaturan, badge belum dibaca
- **Batas:** Sesuai `docs/03` CUST-03 bagian 12 dan NOTIF-02 bagian 12 — tanpa tabel `Notification` baru (daftar diturunkan dari data pesanan), tanpa arsip/baca per entri, tanpa notifikasi realtime, tanpa notifikasi untuk guest/admin, tanpa fitur hapus akun atau foto profil, tanpa verifikasi berjenjang/2FA.
- **Prasyarat:** PH-07 disetujui (alamat + preferensi sudah jalan, API-nya dipakai ulang). Tidak bergantung PH-08/PH-09.
- **Hasil yang bisa dicoba:** Customer membuka `/profile` (hanya info akun), `/profile/addresses` (hanya alamat), dan klik ikon lonceng di navbar untuk melihat daftar notifikasi pesanan lalu mengubah preferensi email dari dialog yang sama. Ganti email di `/profile`, lalu selesaikan verifikasi lewat tautan yang dikirim ke email baru.

### 15.2. Keputusan desain (2026-10-11)

1. **Lima keputusan pengguna** (terinci di bagian 10): route alamat `/profile/addresses`; `/profile` = halaman akun mandiri; ikon notifikasi di navbar membuka dialog berisi daftar + pengaturan; daftar notifikasi diturunkan dari data pesanan; badge belum dibaca lewat Redis.
2. **Lima jenis kejadian notifikasi** (tanpa tabel baru): (a) pesanan dibuat dan belum dibayar (`Order.status = WAITING_PAYMENT`), (b) pesanan terkirim pertama kali (`Order.shippedAt`), (c) pesanan sudah tiba (`Order.completedAt`), (d) pesanan dibatalkan sebelum bayar (`Order.canceledAt` dengan pembayaran bukan `PAID`), (e) refund selesai (`Refund.status = COMPLETED`). Kejadian di luar daftar ini tidak memunculkan notifikasi.
3. **Badge belum dibaca** memakai penanda `notif:last-seen:{userId}` di Redis (pola sama seperti token set/reset password), di-set saat dialog dibuka. Konsekuensi: "belum dibaca" bersifat semua-atau-tidak, bukan per entri; tidak perlu migrasi.
4. **API preferensi dipakai ulang.** Formulir di dialog memakai `GET`/`PATCH /api/customer/notification-preferences` yang sudah ada (CUST-02) dan penegakan `shouldSendNotification` di jalur kirim email tidak berubah. API alamat juga tidak berubah — hanya lokasi halamannya.
5. **Request-time, bukan polling.** Daftar dan badge dihitung saat layout storefront dirender (`await connection()`, pola `CartBadge`/`HeaderUserMenu`, karena Next.js 16 `cacheComponents` melarang `crypto.getRandomValues()` saat prerender). Pembaruan mengikuti reload halaman.
6. **Akses:** ikon dan API hanya untuk Customer login; guest dan role lain tidak melihat ikon; API menjawab `401`/`403` dan selalu membangun daftar dari sesi (tanpa parameter pemilik dari klien).
7. **Verifikasi email (keputusan pengguna 2026-10-11).** Perubahan email tidak langsung tersimpan: `PATCH /api/customer/profile` menyimpan permintaan lalu mengirim tautan verifikasi ke email baru, dan `POST /api/auth/verify-email` baru menerapkan email baru saat tautan dibuka. Token sekali pakai di Redis (pola `src/lib/auth/tokens.ts`), TTL 24 jam, hanya satu tautan aktif per akun (permintaan baru membatalkan tautan lama), dibatasi 3 permintaan per jam per akun. Email lama tetap aktif sampai verifikasi selesai; bila email baru ternyata sudah dipakai akun lain saat verifikasi → `409 EMAIL_IN_USE`. Halaman `/verify-email` boleh dibuka tanpa sesi karena otorisasinya memakai token.
8. **Keputusan lanjutan pengguna (2026-10-11).** (a) Setelah verifikasi email sukses, **sesi diperbarui diam-diam** tanpa memaksa login ulang — penggantian email adalah keinginan pengguna sendiri, jadi tidak adil kalau harus masuk lagi. (b) Judul dan deskripsi notifikasi memakai diksi paling lumrah dan boleh diganti pengguna kapan saja; teks acuan di `docs/03` NOTIF-02 bagian 9. (c) Daftar notifikasi dibatasi **20 entri terbaru**; entri yang lebih lama tidak ditampilkan (bukan dihapus — daftarnya turunan data pesanan). (d) Email verifikasi **selalu dikirim**, tidak tunduk preferensi email CUST-02 (sama seperti email set/reset password). (e) Saat password diganti, password lama langsung tidak berlaku; sesi lain tidak dipaksa logout (di luar cakupan).

### 15.3. Daftar task

| ID | Deskripsi | Fitur | Depends | Status |
| --- | --- | --- | --- | --- |
| TASK-104 | Skema `updateProfileSchema` (nama, email, password) + lib profil customer + `PATCH /api/customer/profile` (role check, Zod sebelum query, `withRouteErrors`, hash password); perubahan email memicu pengiriman tautan verifikasi tanpa menyimpan email baru dulu | CUST-03 | - | Selesai |
| TASK-105 | Halaman `/profile/addresses`: pindahkan `AddressManager` dari `/profile`; tautan dari menu akun; `/profile` dibersihkan dari daftar alamat | CUST-01 | - | Selesai |
| TASK-106 | Halaman `/profile` jadi halaman akun mandiri (kartu Info Akun + Ubah Password + tautan ke `/profile/addresses`), tanpa alamat dan preferensi | CUST-03 | TASK-104, TASK-105, TASK-110 | Selesai |
| TASK-107 | Lib `src/lib/customers/notifications.ts`: turunkan lima kejadian dari `Order`/`Payment`/`Refund` milik pemanggil, hitung unread dari `notif:last-seen:{userId}` (Redis), set penanda + `GET`/`POST /api/customer/notifications` (role check, Zod) | NOTIF-02 | - | Selesai |
| TASK-108 | Komponen `NotificationBell` + dialog (bagian "Notifikasi" dan "Pengaturan") dipasang di `Header`; badge unread; pindahkan `NotificationPreferencesForm` dari `/profile` ke dialog | NOTIF-02, CUST-02 | TASK-107 | Selesai |
| TASK-110 | Token verifikasi email di `src/lib/auth/tokens.ts` (`createEmailChangeToken`/`consumeEmailChangeToken`, satu tautan aktif per akun, TTL 24 jam, batas 3/jam) + halaman `/verify-email` + `POST /api/auth/verify-email` + email verifikasi via Resend (non-blocking, selalu dikirim) + penyegaran sesi diam-diam (`jwt` callback `trigger === "update"`) | CUST-03 | TASK-104 | Selesai |
| TASK-109 | Verifikasi (`tsc`, `lint`, `build`, uji lib + smoke HTTP), bersihkan data uji, tulis bukti (15.5) dan laporan review (15.6) | Semua | TASK-104..108, TASK-110 | Selesai |

### 15.4. Exit criteria

- [x] `/profile/addresses` hanya memuat alamat (CRUD + batas 5 + alamat utama); tanpa info akun dan preferensi (AC-CUST-03-01)
- [x] `/profile` adalah halaman akun mandiri: nama, email, ubah password; email bentrok → `409 EMAIL_IN_USE`, password lama salah → `400 INVALID_PASSWORD` (AC-CUST-03-02..05)
- [x] Ganti email mengirim tautan verifikasi ke email baru; email akun baru berubah setelah verifikasi selesai dan sesi diperbarui diam-diam (tanpa paksa login ulang); token kedaluwarsa/terpakai → `400 TOKEN_INVALID`, email bentrok saat verifikasi → `409 EMAIL_IN_USE` (AC-CUST-03-08..10)
- [x] Guest/Store Admin tidak bisa mengakses API profil (`401`/`403`) (AC-CUST-03-06/07)
- [x] Ikon lonceng tampil hanya untuk Customer login; guest dan role lain tidak melihatnya (AC-NOTIF-02-01, AC-NOTIF-02-08)
- [x] Dialog menampilkan lima jenis kejadian pesanan (maksimal 20 entri terbaru, terbaru dulu) dan tautan ke `/orders/[id]` atau `/orders/[id]/tracking` (AC-NOTIF-02-02..06)
- [x] Badge belum dibaca tampil lalu hilang setelah dialog dibuka (penanda Redis) (AC-NOTIF-02-07)
- [x] Pengaturan di dialog menyimpan lima preferensi dan berlaku pada email berikutnya (aturan CUST-02 tidak berubah) (AC-NOTIF-02-09)
- [x] `pnpm exec tsc --noEmit`, `pnpm lint`, dan `pnpm build` exit 0 (build `BUILD_ID` `-QaYvtqgd1EVMzSAhR4O`, dijalankan pengguna, semua rute PH-10 ada di keluaran); uji klik-through lulus; data uji dibersihkan
- [x] Bukti verifikasi ditulis di bagian 15.5 dan laporan review di bagian 15.6, lalu **STOP** menunggu keputusan pengguna

### 15.5. Bukti verifikasi (2026-10-11)

**Perintah:**

| Perintah | Hasil |
| --- | --- |
| `pnpm add @radix-ui/react-dialog` | exit 0 — dependensi dialog gaya shadcn (`package.json` + `pnpm-lock.yaml`); postinstall `prisma generate` ikut jalan dan sukses walau dev server hidup |
| `pnpm exec tsc --noEmit` | exit 0 (bersih) |
| `pnpm lint` | exit 0 |
| `pnpm build` | exit 0 — dijalankan pengguna 2026-10-11 15:45 (`BUILD_ID` `-QaYvtqgd1EVMzSAhR4O`); keluaran `.next/server/app` memuat seluruh rute PH-10 (`(storefront)/profile`, `(storefront)/profile/addresses`, `(auth)/verify-email`, `api/customer/profile`, `api/customer/notifications`, `api/auth/verify-email`) |

**Data uji:** 1 customer (`ph10.test@flexstore.local`, password `Ph10Test123!`) + 4 pesanan yang dibuat lewat skrip sementara **tanpa menyentuh stok**: `WAITING_PAYMENT` dengan `Payment` (tenggat), `SHIPPED` dengan `trackingNumber` + `shippedAt`, `CANCELED` sebelum bayar, dan `WAITING_PAYMENT` tanpa baris `Payment`.

**Uji klik-through (browser nyata, dev server `pnpm dev` port 3000, 2026-10-11):**

- **Guest:** ikon lonceng tidak ada di beranda (0 elemen); `/profile` dan `/profile/addresses` → `302 /login`; `/verify-email` tanpa token tetap halaman publik dengan pesan "Tautan verifikasi tidak valid atau sudah kedaluwarsa"; `GET`/`POST /api/customer/notifications`, `PATCH /api/customer/profile`, `GET /api/customer/notification-preferences` → `401 UNAUTHORIZED`.
- **Customer:** ikon lonceng tampil dengan badge `3` ("Notifikasi, 3 belum dibaca"). Dialog menampilkan tiga kejadian **terbaru dulu** dengan judul dan tautan persis acuan `docs/03` NOTIF-02 bagian 9: `Menunggu Pembayaran` ("…sebelum 12 Okt 2026, 15.14." → `/orders/[id]`), `Pesanan Dibatalkan` ("…dibatalkan sebelum dibayar." → `/orders/[id]`), `Pesanan Dikirim` ("…Nomor resi TESTRESI123." → `/orders/[id]/tracking`). Badge hilang setelah dialog dibuka (penanda `notif:last-seen:{userId}` terisi). Tab **Pengaturan** merender lima kotak preferensi (semua aktif) + tombol "Simpan Preferensi"; melepas `refundUpdate` lalu menyimpan → pesan "Preferensi disimpan." dan `GET /api/customer/notification-preferences` mengembalikan `refundUpdate: false`.
- **Penanda bertahan + kejadian baru:** satu pesanan baru dibuat setelah dialog ditutup → badge kembali `1`; membuka dialog menampilkan entri baru di paling atas (tanpa tenggat → deskripsi tanpa tanggal) dan badge hilang lagi.
- **`/profile`:** judul "Profil Saya", bagian **Info Akun** (nama + email terisi dari database), **Ubah Password** (3 kolom), dan tautan **Kelola alamat**; tidak ada pengelola alamat dan tidak ada preferensi notifikasi.
- **`/profile/addresses`:** hanya pengelola alamat ("Tambah Alamat") + tautan "Kembali ke profil"; tanpa form akun dan tanpa preferensi.
- **Ganti nama:** isi "Budi Santoso" → `200` + pesan "Perubahan disimpan."; sesi disegarkan **diam-diam** — `GET /api/auth/session` langsung memuat `name: "Budi Santoso"` dan label menu akun di navbar ikut berubah tanpa login ulang.
- **Ganti email:** isi email baru → `200` + pesan "Cek email baru untuk menyelesaikan verifikasi."; token Redis `auth:email-change:{token}` ada dengan TTL 86384 s (24 jam) dan payload `{userId, newEmail}`, sedangkan `User.email` **tetap email lama** sampai verifikasi selesai.
- **Verifikasi email:** halaman `/verify-email?token=…` menampilkan tombol "Verifikasi email" → klik → `200`, pesan "Email berhasil diverifikasi." + "Alamat email akun Anda kini ph10.verified@flexstore.local."; `User.email` berubah di database, kunci token + indeks akun terhapus (sekali pakai), dan sesi disegarkan diam-diam (`GET /api/auth/session` → email baru tanpa login ulang).
- **Token:** dipakai ulang → `400 TOKEN_INVALID`; token salah → `400 TOKEN_INVALID`; body kosong → `400 VALIDATION_ERROR`.
- **Satu tautan aktif:** permintaan ganti email kedua membatalkan tautan pertama (token pertama → `400 TOKEN_INVALID`, token kedua → `200`).
- **Batas 3 permintaan/jam:** permintaan keempat dalam satu jam → `429 RATE_LIMITED` ("Terlalu banyak permintaan, coba lagi nanti").
- **Validasi lain:** email milik akun lain → `409 EMAIL_IN_USE`; password saat ini salah → `400 INVALID_PASSWORD` ("Password saat ini salah"); nama berangka → `400 VALIDATION_ERROR` field `name`; body kosong → `400` "Tidak ada perubahan".
- **Ganti password:** lewat `/profile` → pesan "Password berhasil diubah." dan kolom dikosongkan; login dengan **email baru + password lama gagal**, dengan **email baru + password baru berhasil** (`session.user` terisi) — password lama langsung tidak berlaku.
- **Store Admin:** ikon lonceng tidak tampil di beranda (0 elemen); `GET /api/customer/notifications` dan `PATCH /api/customer/profile` → `403 FORBIDDEN`.
- **Tautan notifikasi:** `/orders/[id]` (Detail Pesanan) dan `/orders/[id]/tracking` (memuat nomor resi) keduanya render benar.
- **Pembersihan:** 1 akun + 4 pesanan + kunci Redis (`auth:email-change-limit:*`, `notif:last-seen:*`) dihapus; seluruh skrip sementara `_tmp-ph10-*.ts` dihapus; stok produk tidak tersentuh (pesanan uji dibuat tanpa mutasi stok).

**Catatan:**

- **`pnpm build` dijalankan oleh pengguna** (2026-10-11; exit 0, `BUILD_ID` `-QaYvtqgd1EVMzSAhR4O` pada 15:45). Diverifikasi dari artefak: keluaran `.next/server/app` memuat seluruh rute PH-10 (`(storefront)/profile`, `(storefront)/profile/addresses`, `(auth)/verify-email`, `api/customer/profile`, `api/customer/notifications`, `api/auth/verify-email`). Galat prerender `/admin/settings` + `/admin/orders/[id]` dari **pekerjaan sesi paralel** yang terlihat di log dev tidak memblokir build produksi milik PH-10.
- **Cache modul Turbopack sempat usang** selama sesi ini: `profileUpdateSchema` terbaca `undefined` oleh route (galat 500) sampai dev server restart, walau `tsc` dan pemanggilan dari skrip `tsx` (baca disk) bersih. Setelah restart, ekspor terbaca normal — artefak cache dev, bukan masalah kode.
- **Email verifikasi berhasil dikirim untuk pengguna nyata.** Awalnya ditolak Resend (`403`, domain uji `resend.dev` hanya boleh kirim ke email pemilik akun). Pengguna memverifikasi domain sendiri di Resend (`flexstore.web.id`, DNS record DKIM/SPF-CNAME/DMARC dipasang di SumoPod; status **Verified** 2026-10-11 17:00) dan menambahkan `EMAIL_FROM="Flex <no-reply@flexstore.web.id>"` di `.env.local`. Uji ulang: `PATCH` ganti email → `200` + `emailVerificationSent`, email masuk ke Gmail penerima (`firmxnsyah35@gmail.com`), tautan di email diklik → `/verify-email` "Email berhasil diverifikasi." + `User.email` berubah di database + `update({})` menyegarkan sesi tanpa login ulang. Batasan ini hilang untuk seluruh email aplikasi (PH-05/PH-07/PH-10).
- **Gangguan Supabase sesaat sempat membuat sesi tidak segar** pada satu percobaan verifikasi (`Can't reach database server at aws-0-ap-southeast-1.pooler.supabase.com:6543` saat `update()`); diulang setelah koneksi normal → segar. Bukan bug kode; pembacaan kontak saat `update()` cukup dipastikan sederhananya gagal-aman jika database tak terjangkau.
- **Judul/deskripsi notifikasi** memakai diksi paling lumrah (keputusan 15.2 butir 8b) dan boleh diganti kapan saja; teks acuan ada di `docs/03` NOTIF-02 bagian 9.

### 15.6. Laporan untuk review

1. **Fase dan status:** PH-10 — Akun & Notifikasi (CUST-01 revisi UI, CUST-02 revisi UI, CUST-03, NOTIF-02), **implementasi + verifikasi selesai 2026-10-11**; **Disetujui 2026-10-11** (pengguna: "approve"), termasuk sambungan 15.7 (perketat input + FormErrorAlert).
2. **Hasil yang tersedia:**
   - **Halaman:** `/profile` (akun mandiri: Info Akun + Ubah Password + tautan alamat), `/profile/addresses` (alamat saja), `/verify-email` (publik, token dari query).
   - **API:** `PATCH /api/customer/profile` (nama/email/password, role check, Zod, `withRouteErrors`), `GET`/`POST /api/customer/notifications` (daftar + penanda dibaca), `POST /api/auth/verify-email` (token sekali pakai).
   - **Lib:** `src/lib/customers/profile.ts` (baca/ubah akun + hash password), `src/lib/customers/notifications.ts` (turunan lima kejadian dari `Order`/`Payment`/`Refund`, batas 20 entri, penanda `notif:last-seen:{userId}`), token email di `src/lib/auth/tokens.ts` (`createEmailChangeToken`/`consumeEmailChangeToken`, satu tautan aktif, TTL 24 jam, batas 3/jam).
   - **UI:** `NotificationBell` (server, hanya customer) + `NotificationDialog` (dua bagian: daftar + `NotificationPreferencesForm` yang dipindah dari `/profile`), `AccountProfileForm`, `ChangePasswordForm`, `VerifyEmailForm`, `src/components/ui/dialog.tsx` (Radix), `AuthProvider` (`SessionProvider` di root layout) + `jwt` callback `trigger === "update"` untuk penyegaran sesi diam-diam, `Header` + `HeaderAccountMenu` ("Profil saya" / "Alamat saya").
   - **Email:** `src/emails/verify-email-change.ts` + `sendEmailChangeVerification` (selalu dikirim, tidak tunduk preferensi CUST-02).
3. **Task selesai / belum selesai:** TASK-104 sampai TASK-110 **semua selesai**, termasuk TASK-109 (verifikasi) sejak `pnpm build` exit 0.
4. **Verifikasi:** `tsc --noEmit`, `lint`, dan `build` exit 0; uji klik-through di server nyata untuk seluruh alur (daftar notifikasi, badge + penanda, preferensi dari dialog, ganti nama/email/password, verifikasi email, token sekali pakai, satu tautan aktif, batas 3/jam, otorisasi guest/admin). Rincian di 15.5.
5. **Cara mencoba:**
   - `pnpm dev` → `http://localhost:3000/login` → login customer (mis. `verify.ph05@flexstore.local`, atau daftar akun baru)
   - Klik **ikon lonceng** di navbar → daftar notifikasi pesanan; tab **Pengaturan** → ubah preferensi email → Simpan
   - `/profile` → ganti nama (sesi ikut segar tanpa login ulang); ganti email → cek tautan `/verify-email?token=…` (di dev, tautan bisa diambil dari Redis `auth:email-change-user:{userId}` karena Resend menolak alamat uji); ubah password lalu coba login dengan password baru
   - `/profile/addresses` → kelola alamat seperti sebelumnya
6. **Masalah / batasan:**
   - Email: setelah domain `flexstore.web.id` terverifikasi di Resend dan `EMAIL_FROM` dipasang, email verifikasi berhasil dikirim dan dikonfirmasi sampai ke Gmail penerima (bukti di 15.5) — batasan domain uji Resend tidak ada lagi
   - Judul/deskripsi notifikasi masih diksi lumrah, menunggu penggantian pengguna bila perlu
   - Komentar/commit: kelebihan penulisan dulu — file sesi paralel (`prisma/schema.prisma`, migrasi `20261011160000_drop_store_settings_store_name`, `src/lib/config/*`, `StoreSettingsForm`, `CheckoutForm`, `HeaderUserMenu`, `checkout/page.tsx`, `docs/01`) kini sudah di-commit sebagai `ea4ea71` + termuat di `40dcb41`; migrasi tercatat sudah diterapkan di database (diperiksa `_prisma_migrations`)
7. **Keputusan yang dibutuhkan:**
   - (Selesai 2026-10-11) PH-10 disetujui — pengguna: "approve"
   - Konfirmasi butir 20 entri: **tidak ditampilkan** (bukan dihapus dari database) — sudah begitu; beri tahu bila maksudnya membuang data

---

### 15.7. Perketat aturan karakter input (permintaan pengguna 2026-10-11)

Permintaan pengguna: "semua field memperketat, misalnya nomor HP tidak boleh memasukkan abjad, begitupula lainnya". Sebelumnya beberapa field longgar: nomor HP **membuang** karakter non-angka lalu tetap lolos (`0812abc345` → `+62812345`), kode pos menerima abjad, nama penerima checkout menerima angka, dan seterusnya.

Yang dikerjakan:

- **Modul aturan bersama baru:** `src/lib/utils/validation.ts` — `phoneSchema`/`normalizePhone`, `personNameSchema`, `regionNameSchema(label)`/`optionalRegionNameSchema(label)`, `postalCodeSchema()`, regex `ADDRESS_LABEL_REGEX`, `STREET_REGEX`, `SKU_REGEX`, `COURIER_CODE_REGEX`, `COURIER_SERVICE_REGEX`, `VOUCHER_CODE_REGEX`, `CONTACT_PHONE_REGEX`, `SOCIAL_HANDLE_REGEX`, `PRODUCT_NAME_REGEX`, `CATEGORY_NAME_REGEX`, `CONTROL_CHARS_REGEX`/`isControlCharFree`, plus filter input klien (`PHONE_INPUT_FILTER`, `POSTAL_CODE_INPUT_FILTER`, `OTP_CODE_INPUT_FILTER`).
- **`src/lib/auth/validation.ts`** tidak lagi mendefinisikan `phoneSchema`/`normalizePhone`/`personNameSchema`; nilainya di-re-export dari modul bersama supaya pemanggil lama (`orders`, `vouchers`, `payments`, `customers`) tidak berubah.
- **Dipasang ke seluruh schema:** alamat customer (label, nama penerima, wilayah, kode pos, jalan), alamat pengiriman + order (nama, kurir, layanan, kode voucher), profil, produk/varian (SKU, nama), kategori, brand, voucher, Store Admin, pengaturan toko (telepon, media sosial, teks), pengaturan platform (nama Store Admin, pesan pemeliharaan), pengaturan brand (nama brand, teks), alasan pembatalan, dan pencarian (produk/voucher/kota). Aturan lengkap: `docs/03` bagian 1A.
- **Sisi klien:** `inputMode` + `pattern` + filter saat mengetik untuk nomor HP/kode pos/kode OTP di `AddressManager`, `CheckoutForm`, `OtpVerificationForm`, `TrackOrderForm`; server tetap penentu akhir (OWASP A03).

Bukti verifikasi (2026-10-11):

- `pnpm exec tsc --noEmit` exit 0; `eslint` pada seluruh berkas validasi yang disentuh bersih (0 error).
- Skrip uji sementara `_tmp-validasi.ts` (dihapus setelah dipakai): **65 kasus lulus / 0 gagal** — menerima nilai wajar (`08123456789`, `0812-3456-789`, `+62 812 3456 7890`, `Budi Santoso`, `DKI Jakarta`, kode pos `40135`, SKU `KAOS-1_2.3`, `Kaos Polos 30s`, `100% Cotton`, `3M Indonesia`, `HEMAT10`, `021-1234567`, `@flexstore.id`, `https://instagram.com/flexstore`) dan menolak nilai tidak wajar (`0812abc345`, `abcdefghij`, `Budi 2`, `12345`, `Jakarta 2`, kode pos `4013`/`ABCDE`, label `@@@`, `Jl. <b>X</b>`, SKU `KAOS 1`, `jne<script>`, `HEMAT 10`, `Kaos <b>`, kategori `123`, `Brand@X`, Store Admin `Admin 1`, telepon `021-abc`, `flex store!`, teks berkarakter kontrol).
- Uji lewat API dengan sesi customer uji: `POST /api/customer/addresses` dengan `phone: "0812abc345"` → `400 VALIDATION_ERROR` field `phone` "Nomor HP hanya boleh berisi angka"; `postalCode: "ABCDE"` → `400` field `postalCode` "Kode pos harus 5 angka"; `city: "Jakarta 2"` → `400` field `city` "Kota/Kabupaten hanya boleh berisi huruf"; alamat valid → `201`. Data uji dihapus setelahnya (0 alamat tersisa).
- Uji di browser: mengetik `0812abc345xy` di field nomor HP alamat menghasilkan nilai `0812345`; mengetik `40A1B35` di kode pos menghasilkan `40135`.

**Sambungan (2026-10-11, permintaan pengguna): pesan kesalahan form langsung digulir ke pandangan.** Pengguna menemukan pesan "Nama hanya boleh berisi huruf" jauh dari tombol Simpan di form Ubah Alamat sehingga harus scroll manual. Solusi: komponen bersama `src/components/ui/form-error-alert.tsx` (`FormErrorAlert`) — begitu pesan muncul/berubah, kontainernya `scrollIntoView` ke tengah viewport (gerak instan). Masukregated ke 29 komponen form yang menampilkan `{error ? <Alert variant="destructive">{error}</Alert> : null}` (alamat, checkout, profil, auth/login/register/OTP, keranjang, pembayaran, notifikasi, dan seluruh formulir admin). Diverifikasi di browser: submit form Ubah Alamat dari posisi bawah halaman → scroll langsung ke tengah dengan pesan di tengah viewport.

Batasan: data lama yang sudah tersimpan tidak divalidasi ulang (aturan berlaku saat tulis berikutnya); nama produk/kategori/brand sengaja tetap mengizinkan angka (mis. "Kaos 30s", "3M") selama mengandung huruf; catatan/deskripsi/tagline/kebijakan hanya dilarang memuat karakter kontrol.


disetujui (PH-07 commit `c20f525`). Spek PH-08 (SITE-00..SITE-04) dan PH-09 (SITE-05) ditulis lebih dulu di `docs/03` v1.5
atas permintaan pengguna, baru diimplementasikan.

**Next steps:**
1. (Selesai 2026-10-11) Review dan approval PH-08 (bagian 13.6) + PH-09 (bagian 14.6) — pengguna: "gua approve"
2. (Selesai 2026-10-11) PH-10 (Akun & Notifikasi, bagian 15) — implementasi + verifikasi + **disetujui pengguna ("approve")**; sambungan 15.7 (perketat validasi + FormErrorAlert) selesai di commit `40dcb41`. Eksternal juga beres: domain `flexstore.web.id` terverifikasi di Resend + `EMAIL_FROM` dipasang, jadi email verifikasi (dan seluruh email aplikasi) sudah sampai ke alamat penerima nyata
3. Isi `EMAIL_FROM` dengan domain terverifikasi Resend bila email harus sampai ke pembeli mana pun
4. (Selesai 2026-10-11) Rapikan dokumentasi yang belum sinkron: baris SDD usang (`middleware.ts` → `proxy.ts`, `@react-pdf/renderer`, status Resend, "Store Admin or Site Admin", nama model, perintah test), README, `docs/06`, `AGENTS.md`, `.env.example`; revisi SDD 4.10 dan PRD juga selesai
5. Tulis bagian rinci 17 fitur yang belum punya spesifikasi `docs/03` (daftar di bagian 10, 2026-10-11) — batch terpisah saat penutupan MVP (semua fase sudah disetujui)
6. (Selesai 2026-10-15) Kerjakan CART-05 (dialog pemilihan varian dari kartu produk) — dokumen + implementasi + verifikasi selesai di hari yang sama (bukti bagian 16.4); status "Terimplementasi (2026-10-15, pasca-MVP)" di indeks `docs/03`

---

## 16. Rencana Kerja: CART-05 — Pemilihan Varian dari Kartu Produk (permintaan pengguna 2026-10-15)

### 16.1. Tujuan dan batas

Klik "Keranjang" / "Beli" pada kartu produk (beranda, katalog, hasil filter/cari) yang punya lebih dari satu varian berstok harus membuka dialog pemilihan varian dulu (nama produk, gambar sampul, daftar varian; CTA "Keranjang" dan "Beli"; tautan bergaya `BackLink` ke `/products/<slug>` untuk bagan ukuran + detail lengkap). Produk dengan satu varian tetap langsung tanpa dialog. Spek lengkap: `docs/03` CART-05 (AC-CART-05-01..09). **Tanpa** perubahan API, skema, atau validasi server — seluruh tulisan keranjang tetap lewat `POST /api/cart` (CART-01).

### 16.2. Daftar task

| ID | Task | Berkas |
| --- | --- | --- |
| TASK-111 | Komponen `VariantPickerDialog` — dialog Radix (`ui/dialog.tsx`): nama + gambar sampul (bukan `SIZE_CHART`), daftar varian (nama, harga `formatRupiah`, "Stok habis" untuk stok 0 disabled), CTA "Keranjang"/"Beli", tautan bergaya `BackLink` "Lihat bagan ukuran & detail lengkap", galat di dalam dialog | `src/components/products/VariantPickerDialog.tsx` (baru) |
| TASK-112 | Integrasi kartu — `ProductCardActions` meneruskan data produk (bukan hanya satu `variantId`), membuka dialog bila varian berstok lebih dari satu, tetap langsung bila satu varian; perilaku "Beli" (`/checkout?variantIds=<id>`) dan "Keranjang" (`router.refresh`) dipertahankan | `src/components/products/ProductCardActions.tsx`, `src/components/products/ProductCard.tsx` |
| TASK-113 | Verifikasi + sinkronisasi dokumen — bukti AC di bagian 16.4, status CART-05 di indeks `docs/03` diperbarui | `docs/03`, `docs/04` |
| TASK-114 | **Stok efektif kartu (perbaikan 2026-10-15, disetujui pengguna):** halaman membaca kuantitas keranjang pembeli (guest Redis / customer `CartItem`) sekali per render, meneruskannya ke `ProductGrid`/`ProductCard`; stok efektif = `stock - kuantitas di keranjang` menentukan (a) tombol kartu: "Stok habis" / "Keranjang" (penuh di keranjang) / aktif, (b) daftar + CTA dialog, (c) galat kartu dirender `Alert` destruktif, (d) semua stok sudah di keranjang → klik menuju halaman keranjang dengan highlight baris varian (`?hilite=...`, keputusan pengguna revisi kedua: label cukup "Keranjang", tanpa dialog) | `ProductCard.tsx`, `ProductCardActions.tsx`, `VariantPickerDialog.tsx`, `ProductGrid.tsx`, beranda + katalog, `src/lib/cart/queries.ts`, `src/components/cart/{CartView,CartItemRow}.tsx` |

### 16.3. Exit criteria

- AC-CART-05-01..09 lulus (uji klik-through browser: multi-varian, satu varian, habis stok, bagan ukuran, guest).
- `pnpm exec tsc --noEmit` dan `pnpm lint` exit 0.
- Tanpa regresi: pengujian klik-lama (produk satu varian) tetap cepat dan tanpa jendela.
- `docs/03` CART-05 status berganti "Terimplementasi" dan bagian 16.4 terisi bukti.

### 16.4. Bukti verifikasi

| Kode | Uji | Hasil |
| --- | --- | --- |
| V1 | `pnpm exec tsc --noEmit` | exit 0 |
| V2 | `pnpm lint` | exit 0 (12 warning `Alert` tak dipakai milik berkas lain, tidak berubah) |
| V3 | Uji klik-through browser (dev server, guest, 2026-10-15) | **Lulus (5 dari 9 AC):** (a) AC-05-01 — klik "Keranjang" pada kartu Kaos Polos Katun Combed 30s (S/M/L) → dialog "Pilih Varian" terbuka: nama produk tampil, 3 radio, varian pertama terpilih bawaan, keranjang tetap kosong; (b) AC-05-02 — pilih varian M lalu "Keranjang" → `POST /api/cart` sukses, keranjang berisi 1 item `SKU KP-30S-M`, dialog menutup; (c) AC-05-09 — Escape menutup dialog tanpa menambah item (itemCount 1 → 1); (d) AC-05-03 — pilih varian L lalu "Beli" → dialihkan ke `/checkout?variantIds=a4e0b627-328c-4eb9-adb4-332c1adfe94e`; (e) AC-05-04 — kartu produk satu varian "bias": klik langsung tanpa dialog (itemCount 2 → 3); (f) AC-05-07 (setengah) — Kaos tanpa gambar `SIZE_CHART` benar tidak menampilkan tautan bagan ukuran. **Tidak teruji (data tidak menyediakan kasusnya):** AC-05-05 (varian stok 0 di daftar — tidak ada produk aktif multi-varian yang campur stok), AC-05-06 (semua varian habis — produk habis tak tampil di katalog), separuh AC-05-07 (kasus multi-varian yang punya bagan ukuran; produk pemilik `SIZE_CHART` saat ini hanya "bias" yang satu varian), AC-05-08 (stok berkurang saat dialog terbuka — jalur server CART-01 tidak berubah). Data uji dibersihkan: keranjang kembali `itemCount: 0` |
| V4 | TASK-114 (stok efektif kartu + tombol "Keranjang") — AC-CART-05-10..11 (browser, guest, 2026-10-15): (a) tambah 1x varian "roha" produk "bias" (stok gudang 1) ke keranjang → kartu berganti satu tombol "Keranjang" (outline, tanpa "Beli"); klik dilanjutkan ke `/cart?hilite=bd7104c1-...` (URL tercobakan) dan baris "bias roha" membawa class highlight `bg-accent/40` + cincin inset warna primary serta efek menggulir ke pandangan (AC-10); (b) keranjang varian M Kaos diisi sampai 25 unit (= stok gudang) → di dialog varian kaos baris M disabled "Sudah di keranjang", baris lain terpilih bawaan dan CTA tetap aktif (AC-11). Data uji dibersihkan: keranjang kembali "Keranjang masih kosong", stok gudang tak berubah (25/30/12/1). Param `hilite` tidak memengaruhi status centang checkout |

### 16.5. Laporan untuk review

**Status:** CART-05 (TASK-111..114) selesai dikerjakan 2026-10-15, `tsc`/`lint` exit 0, uji klik-through: AC-05-01..04, 09, 10, 11 lulus (rincian dan butir tak teruji di bagian 16.4) — **siap direview**. Ditambah TASK-114 atas laporan stok: kartu kini menghitung stok efektif (= stok gudang - kuantitas di keranjang pembeli). Keputusan tampilan pengguna (revisi dua kali): keadaan semua stok sudah di keranjang cukup tombol **"Keranjang"** yang mengarah ke halaman keranjang dengan **highlight + menggulir** baris item varian (`?hilite=...`), tanpa dialog tambahan; galat kartu dirender komponen `Alert` destruktif bukan teks merah mentah. Berkas: `VariantPickerDialog.tsx` (baru), `ProductCardActions.tsx`, `ProductCard.tsx`, `ProductGrid.tsx`, `src/lib/cart/queries.ts`, `src/app/(storefront)/cart/page.tsx`, `CartView.tsx`, `CartItemRow.tsx`, halaman beranda + katalog.
