# FlexStore

Platform e-commerce MVP single-store, target pasar Indonesia (UI Bahasa Indonesia, mata uang IDR).

Fitur yang sudah ada (PH-01): autentikasi (customer + store admin), guest OTP, CRUD produk
(kategori, brand, varian), halaman katalog dan detail produk.

Status fase: **PH-01 disetujui**; PH-02 (cart + shipping) belum dimulai. Peta fase lengkap ada di
`docs/04_IMPLEMENTATION_PLAN.md`.

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
| Upload berkas | Uploadthing | 7.4 |
| Validasi | Zod | 3.24 |
| Manajer paket | pnpm | 12.10.1 |

## Prasyarat

- Node.js 20 atau lebih baru.
- pnpm 12.10.1. Aktifkan lewat `corepack enable pnpm`, atau pasang manual.
- Akun: Supabase (PostgreSQL), Upstash (Redis), Twilio (OTP), Uploadthing (penyimpanan gambar).
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
| Aplikasi | `NEXT_PUBLIC_APP_URL` |
| Seed (opsional) | `SEED_ADMIN_EMAIL`, `SEED_ADMIN_NAME`, `SEED_ADMIN_PASSWORD` |

Catatan:

- `pnpm db:migrate` memakai `DIRECT_URL` (port 5432). Aplikasi saat berjalan memakai `DATABASE_URL`
  (pooler, port 6543).
- Kalau `SEED_ADMIN_PASSWORD` kosong, seed membuat password acak dan mencetaknya sekali di terminal.
- `TWILIO_VERIFY_SERVICE_SID` wajib. Tanpa itu, `/api/otp/send` menjawab `502`.

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
| `pnpm db:seed` | Isi data awal (admin, kategori, brand, produk) |
| `pnpm db:studio` | Prisma Studio (GUI database) |
| `pnpm db:generate` | Regenerasi Prisma Client |

Jangan panggil `pnpx prisma` langsung. CLI Prisma tidak membaca `.env.local`; script `db:*` sudah
dibungkus `dotenv-cli`.

Unit test dan E2E test belum ada di repo ini. Verifikasi PH-01 dijalankan manual.

## Alur demo singkat

1. Guest OTP: buka `/verify-phone`, isi nomor, klik Kirim OTP, lalu masukkan kode.
2. Customer: buka `/register`, daftar, lalu login di `/login`.
3. Admin: login di `/login` memakai `SEED_ADMIN_EMAIL` dan password hasil seed, lalu buka
   `/admin/products` untuk tambah, ubah, dan hapus produk.
4. Customer: buka `/` atau `/products`, klik produk untuk melihat detail.
5. Akses kontrol: buka `/admin/products` tanpa login akan dialihkan ke `/login`.

## Struktur proyek

```
src/
  app/                 Next.js App Router
    (storefront)/      Halaman customer: katalog, detail produk, login, register, verify-phone
    admin/             Panel admin
    api/               API Routes (auth, otp, admin, uploadthing)
  components/          Komponen React (ui, auth, products, admin, layout)
  lib/                 Business logic (auth, products, categories, brands, redis, uploadthing, utils)
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

Repo privat. Belum ada lisensi.
