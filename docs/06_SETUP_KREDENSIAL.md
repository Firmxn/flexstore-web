# 06 — Panduan Setup Kredensial

Dokumen ini menjelaskan cara mengisi setiap variabel di `.env.local`. Nilai yang masih
berupa placeholder harus diganti sebelum aplikasi bisa terhubung ke layanan terkait.

**Aturan:** jangan pernah commit `.env.local`. Semua kredensial hanya hidup di file
tersebut (sudah masuk `.gitignore`). `.env.example` hanya berisi nama variabel.

**Urutan pengerjaan yang disarankan:** bagian 1 → 2 → 3 → 4 → 5 → 6 → 7 (Database dulu,
baru layanan lain, terakhir migrasi dan seed).

Setelah semua terisi, jalankan migrasi dan seed:

```powershell
pnpm db:migrate --name init
pnpm db:seed
pnpm dev
```

> **Penting — selalu pakai `pnpm db:*`, bukan `pnpx prisma ...`.**
> Prisma CLI hanya membaca file `.env`, sedangkan proyek ini menyimpan kredensial di
> `.env.local`. Script `db:*` di `package.json` sudah dibungkus `dotenv-cli`
> (`dotenv -e .env.local -- prisma ...`) sehingga `.env.local` ikut terbaca. Memanggil
> `pnpx prisma` langsung akan gagal dengan `P1012: Environment variable not found:
> DIRECT_URL`. Hal yang sama berlaku untuk `prisma studio` dan `prisma db push`.

---

## 1. Database — Supabase (PostgreSQL 15)

1. Buka <https://supabase.com> dan buat akun.
2. **New project**. Isi nama project, pilih region terdekat (mis. `Southeast Asia
   (Singapore)`), lalu isi **Database Password**. Simpan password ini — dipakai di
   langkah berikutnya.
3. Tunggu sampai project selesai dibuat.
4. Buka **Project Settings** (ikon gerigi) → **Database**.
5. Cari bagian **Connection string** → tab **URI**. Akan muncul dua bentuk:

   **a. Connection pooling (untuk `DATABASE_URL`)**

   Pilih mode **Transaction** dan port `6543`. Bentuknya:

   ```text
   postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-0-<REGION>.pooler.supabase.com:6543/postgres?pgbouncer=true
   ```

   **b. Direct connection (untuk `DIRECT_URL`)**

   Pilih **Direct connection**, port `5432`. Bentuknya:

   ```text
   postgresql://postgres.<PROJECT_REF>:<PASSWORD>@aws-0-<REGION>.pooler.supabase.com:5432/postgres
   ```

6. Ganti `<PASSWORD>` dengan Database Password dari langkah 2. Kalau password
   mengandung karakter khusus (`@`, `#`, `/`, `:`), URL-encode dulu
   (contoh `@` menjadi `%40`).

   > **Perhatian:** Supabase menyalin connection string dengan penanda literal
   > `[YOUR-PASSWORD]`. Penanda itu **harus diganti**, termasuk tanda kurung siku.
   > Kalau masih tertinggal, Prisma akan melaporkan
   > `P1001: Can't reach database server` — bukan pesan "password salah" — karena
   > pooler menutup koneksi saat kredensialnya tidak valid. Jadi jangan tertipu oleh
   > pesan P1001: periksa dulu apakah password sudah benar-benar diganti.
   >
   > Dua jebakan yang mudah terjadi:
   >
   > 1. Nilai pengganti masih ikut dibungkus `[...]`. Password yang benar **tanpa**
   >    tanda kurung siku.
   > 2. Password mengandung karakter khusus (`@`, `#`, `/`, `:`, `[`, `]`, `!`).
   >    Karakter itu harus di-URL-encode: `@`→`%40`, `#`→`%23`, `/`→`%2F`,
   >    `:`→`%3A`, `[`→`%5B`, `]`→`%5D`. Password yang mengandung `#` paling
   >    berbahaya karena semua karakter sesudahnya dianggap bagian lain dari URL.
   >
   > Cara cepat memastikan password sudah terbaca utuh: Prisma akan melaporkan
   > `P1001` lagi kalau URL-nya masih salah bentuk. Kalau URL sudah benar tetapi
   > password salah, pesannya berubah menjadi kesalahan autentikasi.

7. Isi `.env.local`:

   ```dotenv
   DATABASE_URL="postgresql://...:6543/postgres?pgbouncer=true"
   DIRECT_URL="postgresql://...:5432/postgres"
   ```

**Kenapa dua URL?** Aplikasi Next.js berjalan serverless sehingga koneksi lewat
connection pooler (`DATABASE_URL`, port 6543). Prisma Migrate butuh koneksi langsung
karena memakai prepared statement yang tidak didukung PgBouncer (`DIRECT_URL`, port
5432). Ini sudah diatur di `prisma/schema.prisma` lewat `directUrl`.

---

## 2. NextAuth — `AUTH_SECRET`

Buat secret acak 32 byte:

```powershell
npx auth secret
```

Atau, tanpa network:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Isi `.env.local`:

```dotenv
AUTH_SECRET="<hasil perintah di atas>"
AUTH_URL="http://localhost:3000"
AUTH_TRUST_HOST="true"
```

`AUTH_SECRET` dipakai NextAuth untuk menandatangani dan mengenkripsi JWT session.
Jangan pakai nilai contoh dan jangan pakai secret yang sama antar environment.

---

## 3. Redis — Upstash

Redis dipakai untuk menyimpan sesi verification OTP (SID), jumlah percobaan
verifikasi, dan rate limit pengiriman OTP — bukan kodenya; kode dibuat dan
dicek di server Twilio.

1. Buka <https://console.upstash.com> dan buat akun.
2. Tab **Redis** → **Create Database**.
3. Isi nama, pilih region terdekat, biarkan tipe default. Klik **Create**.
4. Buka database yang baru dibuat, scroll ke bagian **REST API**.
5. Salin dua nilai berikut ke `.env.local`:

   ```dotenv
   UPSTASH_REDIS_REST_URL="https://<nama-database>.upstash.io"
   UPSTASH_REDIS_REST_TOKEN="<token>"
   ```

**Penting:** yang dibutuhkan adalah **REST API** URL dan token, bukan
`REDIS_URL`/koneksi Redis protocol. Kode memakai `@upstash/redis` yang bekerja lewat
HTTP.

Data yang disimpan (lihat `src/lib/auth/otp.ts`):

| Key | Isi | TTL |
| --- | --- | --- |
| `otp:{phone}` | SID sesi verification Twilio (`VE...`) — **bukan** kodenya; kode dibuat dan disimpan di server Twilio | 5 menit |
| `otp:attempts:{phone}` | Jumlah percobaan verifikasi | 5 menit |
| `otp:send-limit:{phone}` | Jumlah pengiriman OTP | 1 jam |

---

## 4. Twilio — Pengiriman OTP

FlexStore memakai **Twilio Verify**, bukan Messaging API. Bedanya penting:

| | Verify (dipakai) | Messaging (tidak dipakai) |
| --- | --- | --- |
| Endpoint | `verify.twilio.com/v2` | `api.twilio.com/2010-04-01` |
| Yang membuat kode | Server Twilio | Aplikasi (disimpan di Redis) |
| Template pesan | Bawaan Twilio, sudah disetujui operator | Harus dibuat sendiri |
| Aturan template/Content | Tidak ada | Wajib Content Template (hanya jalur Messaging) |

Karena Verify yang menyimpan kode, aplikasi tidak lagi menyimpan kode OTP di
Redis. Redis hanya menyimpan **SID sesi verification** dengan TTL 5 menit, untuk
mempertahankan batas kedaluwarsa 5 menit yang dijanjikan UI (default Verify
sendiri 10 menit). Pemeriksaan kode dilakukan Twilio lewat
`verificationChecks.create`.

> **Kalau OTP tidak terkirim, jangan cari di Communications → Messaging → Logs.**
> Jalur `Messages.json` sudah tidak disentuh kode sama sekali, jadi log di sana
> akan selalu kosong dan menyesatkan. Log yang benar ada di
> **Identity → Verify → Logs**. Ini kekeliruan yang paling mudah terjadi.

### Langkah setup

1. Buka <https://www.twilio.com> dan daftar. Verifikasi email dan nomor HP Anda.
2. Buka **Console Dashboard**. Salin **Account SID** dan **Auth Token**.
3. Buat **Verify Service**: **Identity** → **Verify** → **Services** →
   **Create new Service**. Beri nama bebas, lalu salin **Service SID** yang
   berawalan `VA` (bukan `AC` — `AC` itu Account SID dan tidak akan diterima).
4. Isi `.env.local`:

   ```dotenv
   TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   TWILIO_AUTH_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   TWILIO_VERIFY_SERVICE_SID="VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
   TWILIO_VERIFY_CHANNEL="sms"
   ```

   `TWILIO_VERIFY_CHANNEL` menentukan kanal. Proyek ini memakai `sms` — kanal
   itulah yang wajib diisi dan sudah terbukti terkirim.

5. **Akun Trial: pastikan nomor tujuan boleh menerima.** Nomor yang dipakai
   **mendaftar akun Twilio** sudah otomatis diverifikasi, jadi nomor itu bisa
   langsung dipakai menguji dan **tidak perlu didaftarkan lagi** (terbukti: uji OTP
   ke nomor pendaftaran berhasil walau daftarnya kosong). Untuk nomor uji
   **selain** nomor pendaftaran, buka **Phone Numbers** → **Manage** →
   **Verified Caller IDs** dan tambahkan nomor itu lebih dulu — lihat peringatan
   di bawah.

> **Peringatan penting untuk akun Trial — kegagalan yang tidak bersuara.**
> Akun Trial hanya boleh mengirim verifikasi ke nomor yang sudah terdaftar sebagai
> **Verified Caller ID**. Nomor terverifikasi dibatasi 5 per akun dan dipakai
> bersama oleh Verify, Messaging, dan Voice.
>
> Jebakannya: mengirim ke nomor yang **belum** terverifikasi bisa tetap dijawab
> **sukses** oleh API, tetapi pesannya dibuang diam-diam tanpa pesan error apa pun.
> Aplikasi akan mengembalikan `200` dan UI menampilkan "OTP terkirim", padahal
> tidak ada apa pun yang sampai. Jadi kalau OTP tidak masuk padahal tidak ada error,
> **periksa dulu daftar Verified Caller IDs** sebelum mencurigai kode.
>
> **Satu pengecualian yang mudah menyesatkan:** nomor pendaftaran akun Twilio
> **tidak muncul** di halaman Verified Caller IDs, dan `OutgoingCallerIds` lewat API
> juga kosong untuk nomor itu — tetapi pengiriman tetap berhasil. Jadi daftar yang
> kosong **bukan** bukti bahwa pengiriman akan gagal. Yang menentukan adalah pesan
> benar-benar diterima di HP tujuan.
>
> Untuk mengirim ke nomor mana pun tanpa syarat ini, akun harus di-upgrade.

> **Batasan lain di akun Trial.** Trial memberi **40 verifikasi gratis**; satu unit
> baru terpotong setelah kode berhasil diperiksa. Pesan memakai nomor dan template
> uji bawaan Verify, jadi isi pesannya tidak bisa diganti selama masih Trial. Batas
> ini hilang setelah upgrade.

Kalau `TWILIO_VERIFY_SERVICE_SID` kosong, `startVerification` melempar error dan
endpoint `/api/otp/send` mengembalikan `502 SEND_FAILED`.

---

## 5. Uploadthing — Penyimpanan Gambar Produk

Uploadthing menyimpan gambar produk yang diunggah Store Admin.

1. Buka <https://uploadthing.com> dan daftar (bisa langsung dengan akun GitHub).
2. **Create a new app**, isi nama aplikasi.
3. Buka halaman app tersebut → **API Keys**.
4. Salin token (string panjang yang diawali `eyJ...`) ke `.env.local`:

   ```dotenv
   UPLOADTHING_TOKEN="eyJ..."
   ```

Catatan:

- Batas ukuran file diatur di `src/lib/uploadthing/core.ts` sebesar **4MB per
  gambar**, maksimal **4 gambar** per produk. Uploadthing hanya menerima ukuran
  kelipatan pangkat dua, sehingga 4MB dipakai (spesifikasi PROD-01 menyebut 5MB).
- Endpoint unggah hanya bisa dipakai role `STORE_ADMIN`. Penjagaan ada di
  `middleware()` pada file router tersebut.
- Domain `utfs.io` dan `*.ufs.sh` sudah diizinkan di `next.config.ts` supaya
  `next/image` bisa menampilkan hasil unggahan.

---

## 6. RajaOngkir — Ongkos Kirim

Dipakai fitur SHIP-01 (hitung ongkos kirim). Endpoint yang dipakai adalah **Komerce Shipping
Cost API v1** di `https://rajaongkir.komerce.id`.

| Variabel | Wajib? | Isi |
| --- | --- | --- |
| `RAJAONGKIR_API_KEY` | untuk mode API | API key dari dashboard rajaongkir.komerce.id |
| `SHIPPING_ORIGIN_DISTRICT_ID` | untuk mode API | ID kecamatan asal toko (angka) |
| `SHIPPING_WEIGHT_PER_ITEM_GRAM` | opsional | Cadangan berat per item dalam gram (default `1000`) untuk varian yang beratnya belum diisi |
| `SHIPPING_COURIERS` | opsional | Daftar kurir dipisah titik dua (default `jne:sicepat:jnt`) |

**Tanpa `RAJAONGKIR_API_KEY` atau tanpa `SHIPPING_ORIGIN_DISTRICT_ID`, aplikasi otomatis memakai
tarif flat Rp10.000** (SDD section 9). Jadi fitur keranjang tetap bisa dicoba sebelum kredensial
ini diisi — yang hilang hanya ongkir asli.

### Langkah setup

1. Ambil API key dari dashboard `rajaongkir.komerce.id`, isi `RAJAONGKIR_API_KEY` di `.env.local`.
2. Muat ulang environment. Di Next.js 16 dev, mengubah `.env.local` memicu muat ulang otomatis
   (log menampilkan `Reload env: .env.local`); kalau nilainya tidak ikut berubah, restart dev server.
3. Cari ID kecamatan asal toko lewat aplikasi:
   `GET /api/shipping/cities?search=<nama-kecamatan>` lalu salin nilai `id` yang cocok ke
   `SHIPPING_ORIGIN_DISTRICT_ID`.
4. Pastikan mode API aktif: `POST /api/shipping` dengan body `{"destinationId":"<id tujuan>"}`
   harus mengembalikan `"source":"api"` beserta opsi kurir asli (bukan `"fallback"`).

### Catatan

- API key dikirim sebagai header `key` (bukan query param) dan hanya dipakai di server. Tidak ada
  prefix `NEXT_PUBLIC_`, jadi nilainya tidak ikut ke bundle browser.
- Base URL ditulis tetap di kode (`src/lib/shipping/client.ts`), bukan dari input pengguna (OWASP A10).
- Berat paket dihitung server sebagai `jumlah (kuantitas x ProductVariant.weightGram)`. Berat per
  varian diisi admin di form produk (`/admin/products`), jadi tidak ada asumsi seragam dan customer
  tidak bisa menentukannya. `SHIPPING_WEIGHT_PER_ITEM_GRAM` hanya cadangan untuk varian yang
  beratnya 0/belum diisi. Berat **tidak** ditampilkan ke customer/guest dan **tidak** ikut di
  respons `POST /api/shipping` (hanya `source`, `cached`, `options`); server memakainya sebagai
  kunci cache dan parameter `weight` ke RajaOngkir.
- Pencarian tujuan mengembalikan **ID tingkat kecamatan (subdistrict)**. Karena itu perhitungan biaya
  memakai `POST /api/v1/calculate/domestic-cost`. Endpoint `.../calculate/district/domestic-cost`
  hanya menerima ID tingkat district dari kaskade provinsi/kota/district dan menjawab
  `422 Origin or Destination not found` bila diberi ID hasil pencarian.
- Kalau Redis mati, hitung ongkir tetap jalan — cache dibungkus try/catch (degrade gracefully).

---

## 7. Xendit — Pembayaran

Dipakai fitur PAY-01/PAY-02 (PH-04). Alur: tombol "Bayar Sekarang" → `POST /api/payments/create` →
Xendit Invoice API v2 membuat invoice (hosted page) → pembeli membayar → Xendit memanggil
`POST /api/webhooks/xendit`.

| Variabel | Wajib? | Isi |
| --- | --- | --- |
| `XENDIT_SECRET_KEY` | ya | Secret key dari Xendit Dashboard → Settings → Developers → API Keys |
| `XENDIT_WEBHOOK_TOKEN` | ya | Webhook Verification Token dari Xendit Dashboard → Settings → Webhooks |
| `XENDIT_INVOICE_DURATION` | opsional | Masa bayar invoice **dan** batas reservasi stok, dalam detik (default `900` = 15 menit) |

### Langkah setup

1. Masuk Xendit Dashboard, aktifkan **Test Mode** (kiri atas). Test Mode gratis dan tidak butuh verifikasi bisnis.
2. **Settings → Developers → API Keys → Generate Secret Key.** Beri permission seminimal mungkin:
   `Money-in products = Write`, `Balance = Read`, sisanya `None`. Kunci berawalan `xnd_development_`
   dan **hanya tampil sekali** — salin saat itu juga ke `XENDIT_SECRET_KEY`.
3. **Settings → Webhooks → View Webhook Verification Token.** Salin ke `XENDIT_WEBHOOK_TOKEN`.
4. Isi URL webhook: `https://<host-publik>/api/webhooks/xendit`. Saat dev, pakai tunnel
   (ngrok/cloudflared) karena Xendit hanya menerima HTTPS publik. Alternatif: tombol
   **Test webhook** di dashboard untuk mengirim payload contoh.
5. Muat ulang environment (Next.js 16 dev memuat ulang otomatis saat `.env.local` berubah).

### Catatan

- Base URL `https://api.xendit.co` sama untuk Test dan Live; mode ditentukan prefix kunci.
- Autentikasi Basic: username = secret key, password kosong (`Authorization: Basic base64(key + ":")`).
- Webhook diverifikasi lewat header `x-callback-token` (perbandingan waktu-tetap), bukan signature HMAC.
- Idempotensi memakai klaim baris `Payment` di database, bukan Redis.
- **Stok tidak dikurangi lagi saat pembayaran sukses** — stok sudah dipotong saat pesanan dibuat (PH-03).
  Webhook EXPIRED membatalkan pesanan dan mengembalikan stok.
- Ubah `XENDIT_INVOICE_DURATION` untuk mengatur 15/30/40 menit tanpa mengubah kode (900/1800/2400).

---

## 8. Seed dan Verifikasi

Setelah semua kredensial terisi:

```powershell
pnpm db:migrate --name init
pnpm db:seed
pnpm dev
```

`pnpm db:seed` membuat:

- 1 akun Store Admin (`SEED_ADMIN_EMAIL`, default `storeadmin@flexstore.local`)
- 1 akun Site Admin (`SEED_SITE_ADMIN_EMAIL`, default `siteadmin@flexstore.local`, PH-08)
- 4 kategori dan 3 brand
- 6 produk contoh (5 status `ACTIVE`, 1 `DRAFT`) beserta varian dan gambar

**Password admin:** `pnpm db:seed` memakai `SEED_ADMIN_PASSWORD` dari `.env.local`.
Kalau variabel itu dibiarkan kosong, seed membuat password acak dan mencetaknya satu
kali di terminal — salin saat itu juga, karena tidak ditampilkan lagi. Mengisi
`SEED_ADMIN_PASSWORD` di `.env.local` adalah cara termudah untuk development.

> **Perhatian:** menulis `SEED_ADMIN_PASSWORD=""` sama saja dengan mengosongkannya.
> Seed memperlakukan nilai kosong sebagai "belum diisi" lalu membuat password acak.
> Jadi jangan mengandalkan `SEED_ADMIN_PASSWORD=""` untuk membuat admin tanpa
> password — hal itu tidak mungkin, dan memang disengaja. Untuk memakai password
> pilihan Anda, isi nilainya; untuk membiarkan seed membuat sendiri, hapus barisnya
> atau biarkan kosong lalu salin password acak yang tercetak.

**Kalau akun admin sudah ada, seed tidak mengubah passwordnya.** `pnpm db:seed`
melewati pembuatan admin ketika email di `SEED_ADMIN_EMAIL` sudah terdaftar, jadi
mengubah `SEED_ADMIN_PASSWORD` setelahnya tidak berpengaruh. Seed bersifat
*create-only* dan sengaja tidak dijadikan alat rotasi — untuk mengganti password akun
yang sudah ada, pakai skrip khusus di bagian **"Rotasi password akun admin"** di bawah.

### Akun dan Konfigurasi Site Admin (PH-08)

Sejak PH-08 ada dua peran admin yang terpisah ketat: **Store Admin** (`/admin/*`) dan
**Site Admin** (`/site-admin/*`). Akun Site Admin pertama dibuat oleh seed:

```powershell
SEED_SITE_ADMIN_EMAIL="siteadmin@flexstore.local"
SEED_SITE_ADMIN_NAME="Site Admin"
SEED_SITE_ADMIN_PASSWORD=""
```

- Aturan password sama seperti `SEED_ADMIN_*`: nilai kosong membuat seed menerbitkan password
  acak dan mencetaknya sekali di terminal; mengubah nilainya tidak berpengaruh bila akun
  tersebut sudah ada (`seedSiteAdmin` melewatinya). Rotasi akun yang sudah ada lewat
  `pnpm db:reset-admin-passwords` (lihat bagian di bawah).
- Di area `/site-admin` Site Admin dapat: mengatur mode pemeliharaan dan status pendaftaran
  (`/site-admin/settings`), mengubah konfigurasi Xendit (`/site-admin/payment`), mengubah
  konfigurasi RajaOngkir (`/site-admin/shipping`), dan mengelola akun Store Admin
  (`/site-admin/users`).
- **Rahasia tetap di `.env.local`.** UI platform hanya menampilkan status terisi/tidak terisi;
  Site Admin tidak dapat memindahkan kunci Xendit/RajaOngkir ke database (keputusan OWASP A02,
  `docs/04` bagian 13.2). Sakelar dan mode di UI berlaku sebagai lapisan di atas nilai env.
- Akun Site Admin tambahan tidak dibuat lewat aplikasi, hanya lewat seed (di luar cakupan
  PRD 2.4).

### Rotasi password akun admin (Store Admin dan Site Admin)

Akun yang **sudah terdaftar** tidak dapat diubah passwordnya lewat `pnpm db:seed`.
Untuk merotasi password akun lama (misalnya password dev yang lemah atau bocor), pakai
skrip khusus `pnpm db:reset-admin-passwords`:

```powershell
$env:RESET_ADMIN_PASSWORD="<password Store Admin baru>"
$env:RESET_SITE_ADMIN_PASSWORD="<password Site Admin baru>"
pnpm db:reset-admin-passwords
Remove-Item Env:RESET_ADMIN_PASSWORD
Remove-Item Env:RESET_SITE_ADMIN_PASSWORD
```

Aturan skrip:

- **Satu variabel per peran:** `RESET_ADMIN_PASSWORD` (Store Admin) dan
  `RESET_SITE_ADMIN_PASSWORD` (Site Admin). Keduanya wajib diisi; skrip merotasi kedua
  akun dalam satu transaksi.
- **Kedua password wajib berbeda.** Skrip menolak bila kedua nilai sama persis — dua akun
  tidak boleh memakai password identik.
- Minimal 12 karakter. Pakai password manager. Jangan tulis password ke dokumen, pesan
  commit, atau riwayat terminal.
- Akun dicari berdasarkan `SEED_ADMIN_EMAIL` / `SEED_SITE_ADMIN_EMAIL` (default
  `storeadmin@flexstore.local` / `siteadmin@flexstore.local`) **dan** role yang sesuai.
- **Tidak membuat akun baru.** Bila salah satu akun tidak ditemukan atau role-nya tidak
  cocok, seluruh rotasi dibatalkan tanpa perubahan.
- Skrip tidak pernah mencetak password maupun hash — hanya email dan role yang diubah.
- Setelah selesai, hapus variabel `RESET_*` dari environment. Nilai itu tidak perlu
  disimpan di `.env.local`; kalau tetap ditulis di sana, jangan di-commit.

### Daftar periksa setelah setup

| Yang diperiksa | Cara | Hasil yang diharapkan |
| --- | --- | --- |
| Database tersambung | `pnpm db:migrate --name init` | Migrasi sukses, tabel dibuat |
| Redis tersambung | Buka `/checkout` (guest, keranjang terisi), kirim OTP | Tidak ada error 500, kode masuk |
| Twilio terkirim | Cek HP tujuan | Kode OTP 6 digit diterima |
| Login admin | Buka `/login`, masuk dengan akun seed | Diarahkan ke `/admin/products` |
| Proteksi admin | Buka `/admin/products` tanpa login | Dialihkan ke `/login` |
| Login Site Admin | Buka `/login`, masuk dengan `SEED_SITE_ADMIN_EMAIL` | Diarahkan ke `/site-admin` |
| Proteksi area platform | Buka `/site-admin` sebagai Store Admin, dan `/admin` sebagai Site Admin | Masing-masing dialihkan ke area perannya sendiri |
| Uploadthing | `/admin/products/new`, unggah gambar | Gambar muncul di pratinjau |
| Ongkir mode API | `POST /api/shipping` dengan `destinationId` (isi dulu bagian 6) | `"source":"api"`, daftar kurir asli |
| Ongkir fallback | Kosongkan `RAJAONGKIR_API_KEY` lalu hitung ongkir | `"source":"fallback"`, tarif flat Rp10.000 |
| Xendit siap | Isi `XENDIT_SECRET_KEY` + `XENDIT_WEBHOOK_TOKEN` (bagian 7), lalu klik "Bayar Sekarang" di detail pesanan | Dialihkan ke halaman invoice Xendit |
| Webhook Xendit | Kirim payload `PAID` ke `/api/webhooks/xendit` dengan header `x-callback-token` | `200`, status pesanan jadi PROCESSING |
| Storefront | Buka `/` lalu `/products` | Produk seed tampil |

### Kalau ada masalah

| Gejala | Kemungkinan penyebab |
| --- | --- |
| `P1012: Environment variable not found: DIRECT_URL` | Perintah dijalankan sebagai `pnpx prisma ...`, bukan `pnpm db:*`. Prisma CLI tidak membaca `.env.local` |
| `Can't reach database server` (`P1001`) padahal jaringan normal | Password di `DATABASE_URL`/`DIRECT_URL` masih `[YOUR-PASSWORD]` atau belum di-URL-encode. Pesan P1001 muncul juga untuk kredensial tidak valid, bukan hanya untuk server yang benar-benar mati |
| `Can't reach database server` dan kredensial sudah benar | `DATABASE_URL` salah, atau project Supabase sedang pause |
| `prepared statement already exists` | `DATABASE_URL` memakai port 5432; gunakan port 6543 dengan `?pgbouncer=true` |
| Migrasi gagal padahal `DATABASE_URL` benar | `DIRECT_URL` belum diisi atau salah |
| OTP tidak terkirim, tapi **tidak ada error** dan UI bilang "OTP terkirim" | Penyebab paling mungkin di akun Trial: nomor tujuan belum terdaftar sebagai **Verified Caller ID**, sehingga Twilio membuang pesannya diam-diam sambil tetap menjawab sukses. Cek **Phone Numbers** → **Manage** → **Verified Caller IDs**. Catatan: nomor yang dipakai mendaftar akun Twilio tidak muncul di daftar itu tetapi tetap bisa menerima, jadi daftar kosong belum tentu jadi penyebabnya |
| OTP tidak terkirim, dan log Verify kosong | Log sedang dilihat di tempat yang salah. Jalur `Messages.json` (Communications → Messaging) sudah tidak dipakai kode. Log yang benar: **Identity** → **Verify** → **Logs** |
| `502 SEND_FAILED` | `TWILIO_ACCOUNT_SID`/`TWILIO_AUTH_TOKEN` salah, atau `TWILIO_VERIFY_SERVICE_SID` kosong |
| `502 SEND_FAILED` dengan log `20404` atau "not found" | `TWILIO_VERIFY_SERVICE_SID` bukan milik akun ini, atau tertukar dengan Account SID. Service SID berawalan `VA`, Account SID berawalan `AC` |
| `502 SEND_FAILED` dengan log `60200` | Parameter tidak valid — biasanya nomor tujuan bukan format E.164 (harus diawali `+` dan kode negara) |
| Log Verify memuat `60202` | Percobaan pemeriksaan kode habis untuk sesi itu. Kirim ulang OTP |
| Log Verify memuat `20003: This feature is not available on a Trial account` | Fitur yang dipanggil memang diblokir untuk akun Trial. Untuk OTP, jalur Verify sendiri tetap bisa dipakai selama nomor tujuan terverifikasi |
| Log memuat `21654 ContentSid Required` atau `63016` | Sisa dari jalur Messaging API yang lama. Kalau ini muncul, berarti kode yang berjalan masih versi lama — pastikan `src/lib/auth/otp.ts` memakai `client.verify.v2` |
| Upload gagal | `UPLOADTHING_TOKEN` salah, atau sesi bukan `STORE_ADMIN` |
| `UPSTASH_REDIS_REST_URL belum diisi` | Variabel Redis masih kosong di `.env.local` |
| `POST /api/shipping` menjawab `"source":"fallback"` padahal key sudah diisi | `SHIPPING_ORIGIN_DISTRICT_ID` belum diisi, atau dev server belum di-restart setelah `.env.local` diubah |
| `/api/shipping/cities` menjawab `configured:false` | `RAJAONGKIR_API_KEY` masih kosong di `.env.local` |
| Log memuat `RajaOngkir menjawab 404` atau `422` | Tujuan tidak dikenal, atau ID bukan tingkat yang benar. Perhitungan butuh ID hasil `/api/shipping/cities` (tingkat kecamatan), bukan ID district dari kaskade |
| `502 PAYMENT_PROVIDER_ERROR` | `XENDIT_SECRET_KEY` salah/kosong, atau kunci Test dipakai dengan cara yang tidak sesuai. Detailnya hanya ada di log server |
| Webhook menjawab `401 INVALID_CALLBACK_TOKEN` | `XENDIT_WEBHOOK_TOKEN` tidak sama dengan token di dashboard, atau header `x-callback-token` tidak terkirim |
| Webhook menjawab `503 WEBHOOK_NOT_CONFIGURED` | `XENDIT_WEBHOOK_TOKEN` masih kosong di `.env.local` |

---

## 9. Deploy ke Vercel (produksi)

Repo sudah disiapkan untuk Vercel: `build` menjalankan `prisma generate && next build`, `engines.node`
minimal 20, dan `vercel.json` mengarahkan fungsi ke region `sin1` (Singapore, paling dekat ke
Supabase region dan pengguna Indonesia).

### 9.1. Langkah deploy

1. Buka <https://vercel.com>, login memakai GitHub.
2. **Add New** → **Project** → import repo `flexstore`. Framework terdeteksi Next.js; biarkan
   install/build command bawaan (`pnpm install` lalu `pnpm build`).
3. **Environment Variables** — isi seluruh variabel di tabel 9.2 (scope Production dan Preview).
4. **Deploy**. Tunggu build pertama selesai; kalau gagal, periksa tab Build Logs.
5. Setelah domain jadi, samakan `NEXT_PUBLIC_APP_URL` dan `AUTH_URL` dengan domain itu
   (mis. `https://flexstore.vercel.app`) lalu **Redeploy** — keduanya dibaca saat build.
6. Arahkan webhook Xendit ke `https://<domain>/api/webhooks/xendit` (Xendit Dashboard →
   Developers → Webhooks, section **Invoice** — kolom "Invoice paid"; token harus
   sama dengan `XENDIT_WEBHOOK_TOKEN`).
7. Kalau DB produksi berbeda dari dev: `vercel env pull .env.production.local`, arahkan
   `DATABASE_URL`/`DIRECT_URL` ke DB produksi, lalu `pnpm db:deploy`.

### 9.2. Variabel yang wajib ada di Vercel

| Variabel | Keterangan |
| --- | --- |
| `DATABASE_URL` | pooler Supabase port 6543, sertakan `?pgbouncer=true` |
| `DIRECT_URL` | koneksi langsung port 5432 (dipakai Prisma CLI/migrasi) |
| `AUTH_SECRET` | nilai yang sama dengan dev, atau rotasi baru |
| `AUTH_URL` | `https://<domain-produksi>` (build-time) |
| `AUTH_TRUST_HOST` | `true` |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | cache, rate limit OTP, reservasi stok |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_VERIFY_SERVICE_SID` / `TWILIO_VERIFY_CHANNEL` | OTP SMS |
| `UPLOADTHING_TOKEN` | upload gambar produk |
| `RAJAONGKIR_API_KEY` / `SHIPPING_ORIGIN_DISTRICT_ID` / `SHIPPING_WEIGHT_PER_ITEM_GRAM` / `SHIPPING_COURIERS` | ongkos kirim |
| `XENDIT_SECRET_KEY` / `XENDIT_WEBHOOK_TOKEN` / `XENDIT_INVOICE_DURATION` | pembayaran |
| `RESEND_API_KEY` / `EMAIL_FROM` | email; domain `flexstore.web.id` sudah terverifikasi |
| `NEXT_PUBLIC_APP_URL` | `https://<domain-produksi>` (build-time) |
| `SEED_ADMIN_*` / `SEED_SITE_ADMIN_*` | hanya bila seed dijalankan dari mesin yang membaca env Vercel |

### 9.3. Catatan

- **Kenapa `prisma generate` ada di `build`:** dengan layout pnpm, generate yang hanya berjalan di
  `postinstall` bisa menulis ke `node_modules/.prisma/client` sementara `@prisma/client` membaca
  salinan di dalam virtual store (`.pnpm/@prisma+client@.../node_modules/.prisma/client`) yang
  masih stub — build gagal dengan `has no exported member 'OrderStatus'`. Generate di dalam
  `build` berjalan setelah node_modules selesai di-link, jadi menulis ke lokasi yang benar.
  Sudah diuji dari checkout bersih: `pnpm install` lalu `pnpm build` exit 0.
- **DB sekarang dipakai bersama dev dan produksi.** Data uji ikut tampil di produksi, dan
  migrasi dev langsung berlaku di produksi. Pisahkan dengan project Supabase baru bila ingin
  data produksi bersih (ulangi langkah 9.1 butir 7).
- **Twilio masih Trial** (hanya nomor terverifikasi), **Xendit** sebaiknya tetap sandbox sampai
  verifikasi bisnis selesai.
- **Build memakai commit terakhir di `main`.** Pekerjaan yang belum di-commit tidak ter-deploy.
- **Security headers A05** (CSP, `X-Frame-Options`, `X-Content-Type-Options`) belum dipasang di
  `next.config.ts`.
- **Rollback:** Vercel Dashboard → Deployments → pilih deployment sebelumnya → **Promote to
  Production**.
