# FlexStore

Platform e-commerce MVP single-store, target pasar Indonesia (UI Bahasa Indonesia, mata uang IDR).

Fitur yang sudah ada (PH-01 sampai PH-10): autentikasi (customer, Store Admin, Site Admin,
guest OTP), CRUD produk (kategori, brand, varian, gambar per varian), katalog dengan pencarian,
filter, dan urutan, keranjang dengan pemilihan item, hitung ongkir (RajaOngkir), checkout guest
dan customer (termasuk alamat tersimpan), pembayaran Xendit (Invoice API + webhook), voucher
(kalkulasi bertahap + CRUD admin), kelola pesanan dan lima laporan penjualan Store Admin,
cancel/refund, pickup, pelacakan pesanan, email transaksional (Resend), invoice siap-cetak,
konfigurasi platform dan akun Store Admin oleh Site Admin, kustomisasi brand oleh Site Admin
(nama, logo, favicon, tagline, palet warna, banner homepage, teks footer), halaman akun mandiri
(`/profile`) plus halaman alamat khusus (`/profile/addresses`), verifikasi email saat ganti
email, dan pusat notifikasi in-app dari ikon lonceng di navbar.

Status fase: **PH-01 sampai PH-10 terimplementasi dan disetujui** (2026-10-11). Bukti verifikasi
per fase ada di `docs/04_IMPLEMENTATION_PLAN.md`; butir yang masih terbuka di luar kode tercatat
di bagian 11 dokumen itu (antaranya uji unggah Uploadthing dengan berkas nyata dan `EMAIL_FROM`
domain terverifikasi).

## Tech stack

| Bagian | Teknologi | Versi di repo |
| --- | --- | --- |
| Framework | Next.js (App Router, Turbopack, cacheComponents/PPR) | 16.4.0 |
| UI | React | 19.3.0 |
| Bahasa | TypeScript | 5.x |
| Styling | Tailwind CSS v4 + shadcn/ui | 4.x |
| Database | PostgreSQL via Supabase | 15+ |
| ORM | Prisma | 5.22 |
| Cache/rate limit | Redis via Upstash | `@upstash/redis` 1.34 |
| Autentikasi | NextAuth v5 (Auth.js) | `5.0.0-beta.25` |
| OTP | Twilio Verify API | `twilio` 5.3 |
| Pembayaran | Xendit (Invoice API v2 + webhook) | via `fetch`, tanpa SDK |
| Email | Resend (HTTP API) | via `fetch`, tanpa SDK |
| Ongkir | RajaOngkir Komerce v1 | via `fetch`, tanpa SDK |
| Upload berkas | Uploadthing | 7.4 |
| Validasi | Zod | 3.24 |
| Manajer paket | pnpm | 12.10.1 |

## Prasyarat

- Node.js 20 atau lebih baru.
- pnpm 12.10.1. Aktifkan lewat `corepack enable pnpm`, atau pasang manual.
- Akun: Supabase (PostgreSQL), Upstash (Redis), Twilio (OTP), Uploadthing (penyimpanan gambar),
  RajaOngkir Komerce (ongkir), Xendit (pembayaran; mode sandbox cukup untuk dev), Resend (email).
- Untuk dev OTP: akun Twilio Trial sudah cukup. Isi pesan tidak dapat diubah dan jumlah verifikasi
  gratis terbatas selama Trial.

## Instalasi

```bash
# 1. Pasang dependency
pnpm install

# 2. Siapkan environment
cp .env.example .env.local
# Windows PowerShell: Copy-Item .env.example .env.local
# Lalu isi .env.local dengan kredensial asli.

# 3. Terapkan skema database dan isi data awal
pnpm db:migrate
pnpm db:seed

# 4. Jalankan dev server
pnpm dev
```

Buka <http://localhost:3000>.

Panduan mengisi setiap kredensial ada di `docs/06_SETUP_KREDENSIAL.md`.

## Environment variables

Semua nilai asli hanya boleh ada di `.env.local`. File itu sudah masuk `.gitignore` dan tidak boleh
di-commit. `.env.example` hanya berisi placeholder.

| Kelompok | Variabel |
| --- | --- |
| Database | `DATABASE_URL`, `DIRECT_URL` |
| Autentikasi | `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST` |
| Redis | `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` |
| Twilio Verify | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_VERIFY_SERVICE_SID`, `TWILIO_VERIFY_CHANNEL` |
| Uploadthing | `UPLOADTHING_TOKEN` |
| Ongkir | `RAJAONGKIR_API_KEY`, `SHIPPING_ORIGIN_DISTRICT_ID`, `SHIPPING_COURIERS` |
| Pembayaran | `XENDIT_SECRET_KEY`, `XENDIT_WEBHOOK_TOKEN`, `XENDIT_INVOICE_DURATION` |
| Email | `RESEND_API_KEY`, `EMAIL_FROM` |
| Aplikasi | `NEXT_PUBLIC_APP_URL` |
| Seed (opsional) | `SEED_ADMIN_EMAIL`, `SEED_ADMIN_NAME`, `SEED_ADMIN_PASSWORD`, `SEED_SITE_ADMIN_EMAIL`, `SEED_SITE_ADMIN_NAME`, `SEED_SITE_ADMIN_PASSWORD` |

Catatan:

- `pnpm db:migrate` memakai `DIRECT_URL` (port 5432). Aplikasi saat berjalan memakai `DATABASE_URL`
  (pooler, port 6543).
- Kalau `SEED_ADMIN_PASSWORD` kosong, seed membuat password acak dan mencetaknya sekali di terminal.
- `SEED_SITE_ADMIN_*` membuat akun Site Admin pertama (area `/site-admin`); password kosong diperlakukan sama seperti admin.
- Store Admin dan Site Admin dipisah ketat: Store Admin hanya `/admin/*`, Site Admin hanya `/site-admin/*`.
- `TWILIO_VERIFY_SERVICE_SID` wajib. Tanpa itu, `/api/otp/send` menjawab `502`.
- `XENDIT_INVOICE_DURATION` (detik) dipakai sebagai masa bayar sekaligus masa reservasi stok.
- Tanpa `RESEND_API_KEY`, email dilewati tanpa galat. Selama `EMAIL_FROM` masih default
  `onboarding@resend.dev`, Resend hanya mengizinkan kirim ke alamat pemilik akun.
- Tanpa `RAJAONGKIR_API_KEY`, hitungan ongkir memakai tarif fallback Rp10.000.

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `pnpm dev` | Jalankan dev server (localhost:3000) |
| `pnpm build` | Type check + build produksi |
| `pnpm start` | Jalankan hasil build produksi |
| `pnpm lint` | ESLint |
| `pnpm db:migrate` | Buat/terapkan migrasi (dev) |
| `pnpm db:deploy` | Terapkan migrasi (produksi) |
| `pnpm db:push` | Sinkron skema tanpa file migrasi |
| `pnpm db:seed` | Isi data awal (Store Admin, Site Admin, kategori, brand, produk) |
| `pnpm db:studio` | Prisma Studio (GUI database) |
| `pnpm db:generate` | Regenerasi Prisma Client |

Jangan panggil `pnpx prisma` langsung. CLI Prisma tidak membaca `.env.local`; script `db:*` sudah
dibungkus `dotenv-cli`.

Unit test dan E2E test belum ada di repo ini. Verifikasi tiap fase dijalankan manual; buktinya
dicatat di `docs/04_IMPLEMENTATION_PLAN.md`.

## Alur demo singkat

1. Guest OTP: tambahkan produk ke keranjang, buka `/checkout`, isi nomor HP, kirim OTP, masukkan
   kode, lalu isi alamat dan buat pesanan.
2. Voucher: masukkan kode voucher di ringkasan checkout (maksimal 2 per transaksi); diskon
   muncul di ringkasan dan di halaman pesanan.
3. Pembayaran: dari halaman pesanan, buat pembayaran lalu selesaikan di halaman Xendit; status
   pesanan berubah saat webhook masuk (dev perlu tunnel publik).
4. Invoice (muncul setelah pembayaran lunas): buka pesanan, klik Lihat Invoice, lalu
   cetak/simpan PDF lewat tombol Cetak.
5. Customer: daftar di `/register`, login di `/login`, kelola alamat tersimpan di
   `/profile/addresses`, atur akun (nama, ganti email wajib verifikasi, ubah password) di
   `/profile`, lihat notifikasi pesanan lewat ikon lonceng di navbar (daftar + preferensi email),
   pesan ulang lewat tombol "Pesan Lagi" di `/orders`, dan atur ulang password lewat
   `/forgot-password`. Lacak pesanan di `/track-order` (guest: nomor pesanan + nomor HP;
   customer: daftar pesanan dalam perjalanan) atau buka detail tracking per pesanan.
6. Store Admin: login memakai `SEED_ADMIN_EMAIL` dan password hasil seed. Kelola produk,
   kategori, brand, dan voucher; kelola pesanan di `/admin/orders` (status, resi, cancel/refund,
   pickup); lihat laporan di `/admin/reports`; atur toko dan template alasan penolakan di
   `/admin/settings` dan `/admin/cancellation-reasons`.
7. Site Admin: login memakai `SEED_SITE_ADMIN_EMAIL`. Di `/site-admin` ada pengaturan platform
   (mode pemeliharaan, pendaftaran), konfigurasi payment/shipping, kelola akun Store Admin, dan
   kustomisasi brand di `/site-admin/brand` (nama, logo, favicon, tagline, palet warna, banner
   homepage, teks footer).
8. Akses kontrol: buka `/admin/products` tanpa login akan dialihkan ke `/login`; Store Admin yang
   membuka `/site-admin` dialihkan ke `/admin`, dan sebaliknya.

## Struktur proyek

```
src/
  app/                 Next.js App Router
    (auth)/            Login, register, lupa/reset password, set password
    (storefront)/      Halaman customer: katalog, detail produk, keranjang, checkout, pesanan,
                       invoice, tracking, profil/alamat, lacak pesanan
    admin/             Panel Store Admin (produk, kategori, brand, voucher, pesanan, laporan,
                       pengaturan, template alasan penolakan)
    site-admin/        Panel Site Admin (pengaturan platform, payment, shipping, brand, akun Store Admin)
    api/               API Routes (auth, otp, cart, customer, shipping, orders, payments,
                       vouchers, admin, site-admin, uploadthing, webhooks)
  components/          Komponen React (admin, auth, cart, checkout, customer, invoices, layout,
                       orders, payments, platform, products, shipping, ui)
  emails/              Template email transaksional
  lib/                 Business logic (auth, brands, cart, categories, config, customers, db, hooks,
                       notifications, orders, payments, platform, products, redis, reports,
                       shipping, uploadthing, utils, vouchers)
prisma/
  schema.prisma        Skema database
  migrations/          Migrasi
  seed.ts              Data awal
docs/                  Dokumen perencanaan dan spesifikasi
public/                Aset statis
```

Detail lengkap: `docs/02_SDD.md` section 5.

## Dokumentasi

| Dokumen | Isi |
| --- | --- |
| `docs/01_PRD.md` | Kebutuhan produk, peran, aturan bisnis, NFR |
| `docs/02_SDD.md` | Rancangan teknis, struktur proyek, keamanan, perintah verifikasi |
| `docs/03_SPESIFIKASI_FITUR.md` | Perilaku fitur, validasi, kriteria penerimaan |
| `docs/04_IMPLEMENTATION_PLAN.md` | Fase, task, bukti verifikasi, keputusan gate |
| `docs/05_INSTRUKSI_AGENT.md` | Aturan kerja agent, termasuk konvensi pesan commit |
| `docs/06_SETUP_KREDENSIAL.md` | Panduan langkah demi langkah mengisi kredensial |
| `AGENTS.md` | Entry point untuk agent (lokal, tidak di-commit) |

## Catatan keamanan

- Jangan pernah menulis kredensial di kode, dokumen, atau pesan commit.
- `dangerouslySetInnerHTML` dilarang tanpa sanitasi.
- Semua API Route memakai validasi Zod dan pemeriksaan peran; Prisma ORM saja (tanpa SQL mentah).
- Detail lebih lanjut: `docs/02_SDD.md` section 10 (OWASP Top 10).

## Lisensi

Repo public (`github.com/Firmxn/flexstore-web`) dan dipakai-ulang mengikuti lisensi
**MIT** (lihat berkas `LICENSE` di root): bebas memakai, mengubah, dan mendistribusikan
sepanjang pemberitahuan copyright dan teks lisensi disertakan, tanpa jaminan apa pun.
Lisensi itu mencakup kode repo ini saja; kredensial dan berkas lingkungan (`.env.local`)
tidak ikut, dan tiap dependensi pihak ketiga memakai lisensinya masing-masing.
