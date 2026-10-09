# Implementation Plan — FlexStore

> Fungsi dokumen: mengubah kebutuhan menjadi fase dan task, menentukan urutan serta dependensi, dan mencatat bukti hasil berikut keputusan review. Setiap fase menghasilkan sesuatu yang bisa diperiksa.

## 1. Identitas dan kondisi sekarang

| Isian | Jawaban |
| --- | --- |
| Proyek / target rilis | FlexStore MVP |
| Versi / tanggal rencana | v1.0 / 2026-10-09 |
| Versi PRD, SDD, dan spesifikasi | PRD v1.0, SDD v1.0, Spesifikasi Fitur v1.0 |
| Reviewer / pemilik keputusan gate | Development Team / Product Owner |
| Fase aktif | PH-01 — Foundation (Auth + Product) — **Disetujui** (lihat bagian 4.7). PH-02 belum dimulai |
| Task aktif / terakhir | TASK-14 — Verify PH-01 exit criteria (selesai) |
| Instruksi mulai / lanjut terakhir | User: "mulai phase 1" (2026-10-09), "lanjutkan" (2026-10-09), "sudah bisa saya coba akses?" (2026-10-09), "perbaiki di PH-01" + "error.tsx tambahkan di PH-01" (2026-10-09), "opsi 1 gua setuju" (2026-10-10), "jalankan 1 dan 2 dulu" (2026-10-10) |
| Hambatan saat ini | Tidak ada. Seluruh exit criteria PH-01 selesai (satu butir Uploadthing berstatus "Sebagian", diterima saat approval, tidak memblokir). **PH-01 disetujui**; PH-02 menunggu instruksi mulai |

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
| PH-02 | Shopping Flow (Cart + Shipping) | Add to cart, update/remove cart, calculate shipping cost | MOD-CART (CART-01, CART-02, CART-03), MOD-SHIP (SHIP-01) | PH-01 disetujui | Belum dimulai |
| PH-03 | Checkout (Order Creation) | Guest checkout (OTP), Customer checkout, order history, track order | MOD-ORDER (ORDER-01, ORDER-02, ORDER-03, ORDER-04) | PH-02 disetujui | Belum dimulai |
| PH-04 | Payment Integration | Create payment (Xendit), webhook handler, stock deduction | MOD-PAY (PAY-01, PAY-02) | PH-03 disetujui, Xendit sandbox setup | Belum dimulai |
| PH-05 | Core Features (Voucher + Notification + Invoice) | Apply voucher, voucher CRUD, email notification, invoice PDF | MOD-VOUCH (VOUCH-01, VOUCH-02), MOD-NOTIF (NOTIF-01), MOD-INV (INV-01) | PH-04 disetujui, Resend setup | Belum dimulai |
| PH-06 | Polish MVP (Reports + Config + Advanced) | Sales report, store settings, shipping tracking, cancel/refund order | MOD-SHIP (SHIP-02), MOD-ORDER (ORDER-05, ORDER-06), MOD-REPORT (REPORT-01), MOD-CONFIG (CONFIG-01) | PH-05 disetujui | Belum dimulai |

**Phase Checkpoint:**
- **PH-01:** Admin bisa CRUD products, Customer bisa register/login/view products → Foundation ready
- **PH-02:** User bisa add to cart, calculate shipping → Shopping flow ready
- **PH-03:** User bisa checkout (guest + customer), stock reserved → Checkout ready (no payment)
- **PH-04:** Payment flow, webhook, stock deduction work → Payment integration complete
- **PH-05:** Voucher calculation, email, invoice work → Core features complete
- **PH-06:** Reports, settings, shipping tracking, cancel/refund work → MVP complete

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
| — | Halaman publik | `/`, `/products`, `/login`, `/register`, `/verify-phone` → `200` | Lulus | curl |

**Cacat yang ditemukan dan diperbaiki selama verifikasi:**

| Cacat | Dampak | Perbaikan | Verifikasi |
| --- | --- | --- | --- |
| **Seed membuat admin dengan password kosong** | `.env.local` berisi `SEED_ADMIN_PASSWORD=""`; operator `??` hanya jatuh ke nilai acak untuk `null`/`undefined`, sehingga string kosong dipakai apa adanya. Admin dibuat dengan password kosong dan password acak tidak pernah dicetak | `prisma/seed.ts` memakai `\|\|` + `trim()` dan menolak password kosong. Akun rusak dihapus, seed dijalankan ulang | Password acak sekarang tercetak; login admin berhasil |
| Penolakan akses Uploadthing mengembalikan `500` | Penolakan auth tercatat sebagai error server | `UploadThingError` diberi `code: "FORBIDDEN"` eksplisit (`src/lib/uploadthing/core.ts`) | `500` → `403` |
| Pesan validasi berbahasa Inggris ("Required") | Pesan ke pengguna tidak konsisten | `required_error`/`invalid_type_error` Indonesia di semua schema Zod | `400 "Nama wajib diisi"` |
| `pnpx prisma` tidak membaca `.env.local` | Perintah migrasi di dokumen gagal `P1012` | Script `db:*` dibungkus `dotenv-cli` (termasuk `db:deploy` yang sebelumnya terlewat) | `pnpm db:*` berfungsi |
| Prefix `whatsapp:` ganda pada `TWILIO_WHATSAPP_FROM` menghasilkan alamat `whatsapp:whatsapp:+62...` | Dulu: alamat pengirim tidak valid dengan pesan error yang menyesatkan | **Digantikan, bukan diperbaiki.** Seluruh `deliverOtp` beserta `toWhatsappAddress()` dihapus saat `src/lib/auth/otp.ts` ditulis ulang memakai Twilio Verify. `TWILIO_WHATSAPP_FROM`, `TWILIO_PHONE_NUMBER`, dan `TWILIO_CONTENT_SID` kini tidak dibaca kode mana pun, jadi cacat ini tidak mungkin muncul lagi | 0 referensi ke `deliverOtp`/`toWhatsappAddress` di `src/`; hanya `TWILIO_VERIFY_SERVICE_SID` dan `TWILIO_VERIFY_CHANNEL` yang dibaca |
| `loading.tsx` di level grup `(storefront)` membungkus **semua** halaman storefront dengan skeleton grid produk | `/login`, `/register`, `/verify-phone` menampilkan kerangka produk yang tidak relevan saat memuat | Berkas dihapus. Halaman yang memang butuh loading UI sudah punya boundary `<Suspense>` sendiri | `pnpm build` exit 0; kelima halaman publik tetap `200` |
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
   - Guest OTP: buka `/verify-phone` → isi nomor → Kirim OTP → Verifikasi (**butuh sender Twilio diisi lebih dulu**, kalau kosong endpoint menjawab `502`)
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
- **Termasuk:** CART-01 (Add to Cart), CART-02 (Update Cart), CART-03 (Remove from Cart), SHIP-01 (Calculate Shipping)
- **Tidak termasuk:** Checkout, Order, Payment (PH-03, PH-04)
- **Referensi:** Spesifikasi CART-01, CART-02, CART-03, SHIP-01, SDD 4.3, SDD 4.7
- **Prasyarat:** PH-01 disetujui, RajaOngkir/Biteship API key
- **Langkah demo:** Add product to cart → Update quantity → Remove item → Calculate shipping cost
- **Estimasi:** 2-3 hari

*Task detail dirinci saat PH-01 selesai dan PH-02 dimulai.*

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

*Task detail dirinci saat PH-02 selesai dan PH-03 dimulai.*

---

## 7. Rincian Fase: PH-04 — Payment Integration

### 7.1. Tujuan dan batas

- **Tujuan:** Payment flow works (Xendit), webhook handler updates order/payment status, stock deducted after payment success
- **Termasuk:** PAY-01 (Create Payment), PAY-02 (Webhook Handler)
- **Tidak termasuk:** Refund (PH-06)
- **Referensi:** Spesifikasi PAY-01, PAY-02, SDD 4.5
- **Prasyarat:** PH-03 disetujui, Xendit sandbox account
- **Langkah demo:** Create order → Create payment (Xendit) → Pay via sandbox → Webhook received → Order status updated → Stock deducted
- **Estimasi:** 2-3 hari

*Task detail dirinci saat PH-03 selesai dan PH-04 dimulai.*

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

---

## 9. Rincian Fase: PH-06 — Polish MVP (Reports + Config + Advanced)

### 9.1. Tujuan dan batas

- **Tujuan:** Admin reports work, store settings work, shipping tracking works, cancel/refund order works
- **Termasuk:** SHIP-02 (Shipping Tracking), ORDER-05 (Cancel Order), ORDER-06 (Refund), REPORT-01 (Sales Report), CONFIG-01 (Store Settings)
- **Tidak termasuk:** Advanced analytics, multi-store (future)
- **Referensi:** Spesifikasi SHIP-02, ORDER-05, ORDER-06, REPORT-01, CONFIG-01, SDD 4.7, SDD 4.11, SDD 4.12
- **Prasyarat:** PH-05 disetujui
- **Langkah demo:** Admin view sales report → Update store settings → Customer cancel order → Admin approve refund → Track shipment
- **Estimasi:** 3-4 hari

*Task detail dirinci saat PH-05 selesai dan PH-06 dimulai.*

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
| 2026-10-09 | `export const instant = false` pada `src/app/admin/layout.tsx` | Area admin tidak di-prerender | Area admin seluruhnya butuh autentikasi dan tidak dapat di-prerender; tanpa ini build gagal | `src/app/admin/layout.tsx` |
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

---

## 11. Catatan lanjutan sesi

- **Terakhir dikerjakan:** PH-01 TASK-01 sampai TASK-14 — implementasi dan verifikasi end-to-end selesai
- **Kondisi pekerjaan:** Kode lengkap di working directory; **belum ada repository git**, jadi belum ada commit/branch
- **Pemeriksaan terakhir:** `pnpm lint` exit 0; `pnpm build` exit 0 (22 route); seluruh alur demo dijalankan manual lewat HTTP terhadap database Supabase aktif — termasuk **OTP end-to-end** (kirim `200` + SMS diterima, verifikasi `200 {"verified":true}` dua kali) — ditambah pemeriksaan di **mode produksi** (`pnpm build` + `pnpm start`) untuk soft 404 dan error boundary, karena kedua hal itu hanya sahih di produksi (rincian: bagian 4.5)
- **Keputusan terakhir:** 2026-10-10 — **PH-01 disetujui** (user: "jalankan 1 dan 2 dulu"). Status di section 1 dan 3 → Disetujui; butir Uploadthing dikeluarkan dari daftar butir terbuka. Keputusan soft 404 (opsi 1) dan approval fase tercatat di bagian 4.7. `git init` **ditunda atas permintaan user** ("git init nanti dulu")
- **Langkah berikutnya (setelah instruksi user):**
  1. Mulai PH-02 — Shopping Flow (Cart + Shipping); butuh API key RajaOngkir/Biteship
  2. Inisialisasi repository git dan commit PH-01 sebagai titik awal versi — **ditunda, menunggu perintah user**
  3. Isi `SEED_ADMIN_PASSWORD` di `.env.local` supaya password admin tidak lagi acak setiap seed ulang
  4. Kalau nanti menguji OTP dengan nomor selain `+6285813386371`, daftarkan nomor itu sebagai **Verified Caller ID** di Console Twilio lebih dulu. Untuk nomor yang sekarang dipakai, langkah ini tidak diperlukan — sudah terbukti tembus
- **Hal yang masih menghalangi:** Tidak ada yang menghalangi PH-01 maupun PH-02. Unggah berkas
  Uploadthing dengan berkas nyata belum diuji (kunci API masih placeholder; gerbang autentikasi sudah
  terverifikasi `403`/`200`) — dikeluarkan dari daftar butir terbuka saat approval PH-01 dan diuji
  saat kunci nyata tersedia. Pengiriman OTP sudah **Lulus** dan tidak lagi masuk daftar ini
- **Catatan teknis yang berguna untuk sesi berikutnya:**
  - Next.js 16 mengganti `middleware.ts` menjadi `proxy.ts`, dan ekspor hasil destrukturisasi (`export const { auth: proxy } = ...`) **tidak** dapat dianalisis Next.js — harus `const { auth } = NextAuth(cfg); export default auth;`
  - Dengan `cacheComponents: true`, data URL (`params`, `searchParams`) wajib diakses di dalam `<Suspense>`
  - `declare module "@auth/core/jwt"` tidak dapat dipakai (pnpm tidak menaruh `@auth/core` di level atas); dipakai tipe lokal + cast di `src/lib/auth/auth.config.ts`
  - Tipe `PageProps<...>` baru dibuat saat `next build`, bukan oleh `tsc` saja
  - `export const instant = false` **tidak** mengubah mode render rute. Diuji di `page.tsx` detail produk: penanda build tetap `◐` (Partial Prerender) dan status produksinya tetap `200`. Fungsinya hanya mengizinkan akses `params` (runtime data) di luar Suspense agar build tidak gagal validasi instant-navigation — bukan membuat rute jadi blocking secara HTTP. Klaim lama di dokumen ini bahwa ia "dihormati di `layout.tsx`" tidak diuji ulang dan sebaiknya jangan dijadikan acuan
  - **Status HTTP `notFound()` bergantung pada apakah streaming sudah dimulai.** Sebelum streaming: `404` asli. Sesudah streaming: tetap `200`, UI not-found tetap dirender, dan Next.js menitipkan `<meta name="robots" content="noindex">` (docs `loading.mdx` bagian "Status codes"). Dengan `cacheComponents: true`, semua rute PPR — shell di-prerender dan dikirim lebih dulu — sehingga `notFound()` di dalam halaman **tidak akan pernah** menghasilkan `404` di produksi. Satu-satunya jalur resmi adalah request-time check di Proxy. **Koreksi (review 2026-10-10):** jalur Proxy itu **tidak wajib** pindah ke runtime Node — Edge bisa melakukan cek keberadaan produk lewat Supabase PostgREST via `fetch` (Edge-safe) dengan `service_role` key di env, jadi opsi `404` asli tetap tersedia kalau nanti dibutuhkan. Untuk PH-01 diputuskan **tidak** dipakai (terima `200` + `noindex`, lihat bagian 4.7)
  - Karena itu, **jangan menyimpulkan hasil dari mode dev.** Di dev rute dirender ulang per request dan `notFound()` justru mengembalikan `404`; perilaku dev dengan produksi berbeda di sini
  - `src/proxy.ts` berjalan di **Edge runtime** dan sengaja bebas Prisma (hanya memakai `authConfig` yang edge-safe). Menambah query database di sana berarti memindahkan proxy ke runtime Node — keputusan arsitektur, bukan perubahan kecil
  - Error boundary (`error.tsx`) adalah Client Component, jadi **UI-nya tidak ada di HTML produksi** — server mengirim kerangka `<html id="__next_error__">` berisi template kosong yang dihidrasi di browser. Yang bisa diverifikasi lewat HTTP: error tertangkap (tanpa crash), `noindex` ikut terkirim, dan pesan server **tidak** bocor ke klien. Detailnya hanya muncul di log server bersama sebuah `digest` yang bisa dipakai mencocokkan laporan pengguna
  - Error boundary yang benar untuk kegagalan pengambilan data adalah prop **`retry`**, bukan `reset`: `retry` me-render ulang children sekaligus mengambil data baru, `reset` hanya membersihkan state boundary
  - `global-error.tsx` menggantikan root layout, jadi ia harus menyediakan `<html>` dan `<body>` sendiri **dan** mengimpor `globals.css` sendiri — stylesheet global tidak diwariskan
  - Jangan pakai `pnpx prisma` — pakai `pnpm db:*`. `prisma migrate dev` menolak berjalan non-interaktif; padanannya `prisma migrate diff --from-empty --to-schema-datamodel ... --script` lalu `prisma migrate deploy`, dan `prisma migrate resolve --applied` untuk database yang sudah berskema
  - Di `.env.local`, variabel yang dikosongkan bernilai `""` (bukan undefined) — pakai `||` bukan `??` saat ingin fallback
  - Next.js membaca environment saat server start; setelah mengubah `.env.local`, dev server harus di-restart
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

---

**Status:** Implementation Plan v1.0 — **PH-01 disetujui** (2026-10-10). Pengiriman OTP
**Lulus** end-to-end; soft 404 slug produk diterima apa adanya (opsi 1). PH-02 belum dimulai, menunggu
instruksi user. `git init` ditunda atas permintaan user.

**Next steps:**
1. Perbaiki kredensial Supabase, jalankan migrasi + seed
2. Selesaikan TASK-14 (verifikasi kriteria yang tersisa)
3. Kirim laporan review, tunggu persetujuan sebelum PH-02