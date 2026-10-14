# Spesifikasi Fitur â€” FlexStore

> Fungsi dokumen: menjelaskan perilaku setiap fitur secara terperinci, termasuk alur berhasil, validasi, hak akses, kondisi gagal, dan kriteria penerimaan. Task implementasi ditempatkan di Implementation Plan.

## 0. Cara memakai template

- Satu blok spesifikasi untuk satu fitur
- Kelompokkan berdasarkan modul, gunakan ID dari PRD
- Fitur prioritas dirinci penuh; fitur yang belum berspesifikasi ditandai sebagai utang dokumentasi di indeks (lihat catatan indeks bagian 1)
- Rujuk aturan bisnis PRD dan kontrak teknis SDD

## 1. Identitas dan indeks fitur

- **Versi / tanggal:** v2.1 / 2026-10-11
- **Versi PRD / SDD:** PRD v1.6, SDD v1.0
- **Pemilik keputusan:** Development Team

### Indeks Fitur (MVP) â€” Phase Bertahap

| Phase | Modul | ID Fitur | Nama Fitur | Status | Lokasi |
| --- | --- | --- | --- | --- | --- |
| **Phase 1** | **MOD-AUTH** | AUTH-01 | Guest OTP Verification | Terimplementasi (PH-01) | [AUTH-01](#auth-01) |
| | | AUTH-02 | Customer Registration | Terimplementasi (PH-01) | `docs/04` bagian 4 dan 10 |
| | | AUTH-03 | Customer Login | Terimplementasi (PH-01) | `docs/04` bagian 4 dan 10 |
| | **MOD-PROD** | PROD-01 | Product CRUD (Admin) | Terimplementasi (PH-01) | [PROD-01](#prod-01) |
| | | PROD-02 | Product List (Customer) | Terimplementasi (PH-01) | `docs/04` bagian 4 dan 10 |
| | | PROD-03 | Product Detail | Terimplementasi (PH-01) | `docs/04` bagian 4 dan 10 |
| | | PROD-04 | Category Management | Terimplementasi (PH-01) | `docs/04` bagian 4 dan 10 |
| | | PROD-05 | Brand Management | Terimplementasi (PH-01) | `docs/04` bagian 4 dan 10 |
| **Phase 2** | **MOD-CART** | CART-01 | Add to Cart | Terimplementasi (PH-02) | [CART-01](#cart-01) |
| | | CART-02 | Update Cart Item | Terimplementasi (PH-02) | [CART-02](#cart-02) |
| | | CART-03 | Remove from Cart | Terimplementasi (PH-02) | [CART-03](#cart-03) |
| | | CART-04 | Merge Guest Cart on Login (tambahan) | Terimplementasi (PH-02) | [CART-04](#cart-04) |
| | **MOD-SHIP** | SHIP-01 | Calculate Shipping Cost | Terimplementasi (PH-02) | [SHIP-01](#ship-01) |
| **Phase 3** | **MOD-ORDER** | ORDER-01 | Create Order (Guest Checkout) | Terimplementasi (PH-03) | [ORDER-01](#order-01) |
| | | ORDER-02 | Create Order (Customer) | Terimplementasi (PH-03) | [ORDER-02](#order-02) |
| | | ORDER-03 | Order History | Terimplementasi (PH-03) | [ORDER-03](#order-03) |
| | | ORDER-04 | Track Order (Public) | Terimplementasi (PH-03) | [ORDER-04](#order-04) |
| **Phase 4** | **MOD-PAY** | PAY-01 | Create Payment (Xendit) | Terimplementasi | [PAY-01](#pay-01) |
| | | PAY-02 | Webhook Handler (Xendit) | Terimplementasi | [PAY-02](#pay-02) |
| **Phase 5** | **MOD-VOUCH** | VOUCH-01 | Apply Voucher | Terimplementasi | `docs/04` bagian 8 |
| | | VOUCH-02 | Voucher CRUD (Admin) | Terimplementasi | `docs/04` bagian 8 |
| | **MOD-NOTIF** | NOTIF-01 | Send Email Notification | Terimplementasi | `docs/04` bagian 8 |
| | **MOD-INV** | INV-01 | Generate Invoice (HTML siap-cetak) | Terimplementasi | `docs/04` bagian 8 |
| **Phase 6** | **MOD-SHIP** | SHIP-02 | Track Shipment | Terimplementasi (PH-06) | `docs/04` bagian 9 dan 10 |
| | | SHIP-03 | Pickup (Ambil di Toko) | Terimplementasi (PH-06) | `docs/04` bagian 9 dan 10 |
| | **MOD-ORDER** | ORDER-05 | Cancel Order Request | Terimplementasi (PH-06) | `docs/04` bagian 9 dan 10 |
| | | ORDER-06 | Refund (Manual) | Terimplementasi (PH-06) | `docs/04` bagian 9 dan 10 |
| | | ORDER-07 | Admin Order Management (tambahan) | Terimplementasi (PH-06) | `docs/04` bagian 9 dan 10 |
| | | ORDER-08 | Tracking Pesanan Customer | Terimplementasi (PH-06) | `docs/04` bagian 9 dan 10 |
| | **MOD-REPORT** | REPORT-01 | Sales Report (5 laporan PRD 4.11) | Terimplementasi (PH-06) | `docs/04` bagian 9 dan 10 |
| | **MOD-CONFIG** | CONFIG-01 | Store Settings + template alasan penolakan | Terimplementasi (PH-06) | `docs/04` bagian 9 dan 10 |
| **Phase 7** | **MOD-CUST** | CUST-01 | Alamat Tersimpan | Terimplementasi (PH-07); halaman dipindah ke `/profile/addresses` (alamat saja) di PH-10 | [CUST-01](#cust-01) |
| | | CUST-02 | Preferensi Notifikasi | Terimplementasi (PH-07); formulir dipindah ke dialog notifikasi di PH-10 | [CUST-02](#cust-02) |
| | **MOD-AUTH** | AUTH-04 | Set Password (Guest â†’ Customer) | Terimplementasi | [AUTH-04](#auth-04) |
| | | AUTH-05 | Reset Password | Terimplementasi | [AUTH-05](#auth-05) |
| | **MOD-ORDER** | ORDER-03B | Re-order (lanjutan ORDER-03) | Terimplementasi | [ORDER-03B](#order-03b) |
| **Phase 8** | **MOD-AUTH** | SITE-00 | Akses Site Admin (role baru) | Terimplementasi | [SITE-00](#site-00) |
| | **MOD-CONFIG** | SITE-01 | Platform Settings | Terimplementasi | [SITE-01](#site-01) |
| | | SITE-02 | Payment Gateway Configuration (Xendit) | Terimplementasi | [SITE-02](#site-02) |
| | | SITE-03 | Shipping Provider Configuration (RajaOngkir) | Terimplementasi | [SITE-03](#site-03) |
| | | SITE-04 | User Management (Store Admin) | Terimplementasi | [SITE-04](#site-04) |
| **Phase 9** | **MOD-CONFIG** | SITE-05 | Brand Customization (identitas, palet, banner) | Terimplementasi (PH-09, 2026-10-11) | [SITE-05](#site-05) |
| **Phase 10** | **MOD-CUST** | CUST-03 | Profil Akun (halaman mandiri) | Terimplementasi (PH-10, Disetujui; revisi 2026-10-11: ganti email wajib verifikasi) | [CUST-03](#cust-03) |
| | **MOD-NOTIF** | NOTIF-02 | Pusat Notifikasi In-App (ikon navbar) | Terimplementasi (PH-10, Disetujui) | [NOTIF-02](#notif-02) |

**Phase Checkpoint:**
- **Phase 1:** Admin CRUD products, customer register/login/view products âœ“ Foundation ready
- **Phase 2:** Add to cart, calculate shipping âœ“ Shopping flow ready
- **Phase 3:** Create order, stock reservation âœ“ Checkout ready (no payment)
- **Phase 4:** Payment integration, webhook, stock deduction âœ“ Payment flow complete
- **Phase 5:** Voucher, email notification, invoice âœ“ Core features complete
- **Phase 6:** Shipping tracking, cancellation, refund, reports, settings âœ“ MVP complete
- **Phase 7:** Alamat tersimpan, re-order, set/reset password, preferensi notifikasi âœ“ Customer management ready
- **Phase 8:** Akses Site Admin, pengaturan platform, konfigurasi payment/shipping, kelola Store Admin âœ“ platform configuration ready
- **Phase 9:** Kustomisasi brand oleh Site Admin (identitas, palet warna, banner) âœ“ terimplementasi dan disetujui (2026-10-11)
- **Phase 10:** Halaman akun mandiri (`/profile`), halaman alamat khusus (`/profile/addresses`), pusat notifikasi in-app (daftar + pengaturan) lewat ikon navbar - terimplementasi dan disetujui (2026-10-11)

**Catatan indeks:**
- "Terimplementasi (PH-XX)" berarti fitur sudah jalan dan terverifikasi; buktinya ada di `docs/04`.
- Rujukan `docs/04` dipakai untuk fitur yang belum punya bagian rinci di `docs/03` (PH-01:
  AUTH-02/03, PROD-03/04/05; PH-05: VOUCH-01/02, NOTIF-01, INV-01; PH-06: SHIP-02/03,
  ORDER-05..08, REPORT-01, CONFIG-01). Bagian rinci fitur-fitur ini dicatat sebagai utang
  dokumentasi `docs/03` dan akan ditulis dalam satu batch setelah PH-09 atau saat penutupan MVP
  (keputusan di `docs/04` bagian 10).
- CUST-01 dan CUST-02 tetap berstatus "Terimplementasi (PH-07)"; pemindahan UI-nya (alamat ke
  `/profile/addresses`, preferensi ke dialog notifikasi) bersama fitur baru CUST-03 dan NOTIF-02
  dijadwalkan di **PH-10** (keputusan `docs/04` bagian 10 dan 15).

---

## 1A. Aturan karakter input (berlaku semua fitur)

Aturan bersama untuk seluruh input pengguna (customer, Store Admin, Site Admin). Ditegakkan di server lewat Zod (`src/lib/utils/validation.ts`) sebelum menyentuh Prisma (OWASP A03). Karakter yang tidak wajar untuk jenis field-nya **ditolak dengan pesan jelas**, bukan diam-diam dibuang.

| Jenis field | Yang diterima | Contoh ditolak |
| --- | --- | --- |
| Nomor HP | angka + pemisah `+ ( ) - . spasi`; dinormalkan ke +62 + 8-11 angka | `0812abc345` ("Nomor HP hanya boleh berisi angka"), `abcdefghij` |
| Nama orang (registrasi, profil, nama penerima alamat, nama penerima checkout, nama Store Admin) | huruf (termasuk berdiakritik), spasi, `' . -`; wajib ada huruf | `12345`, `Budi 2` |
| Wilayah (provinsi, kota, kecamatan, kelurahan) | huruf, spasi, `' . ( ) / , -`; wajib ada huruf | `Jakarta 2` |
| Kode pos | tepat 5 angka | `4013`, `ABCDE` |
| Label alamat | huruf/angka + `' . / , -`; wajib ada huruf/angka | `@@@` |
| Alamat lengkap | huruf/angka + `' . , / ( ) # & : -` dan baris baru; wajib ada huruf/angka | `Jl. <b>X</b>` |
| SKU varian | huruf/angka + `. _ -` | `KAOS 1` (spasi) |
| Kode kurir / layanan | kode kurir: huruf/angka + `. _ -`; layanan: huruf/angka + spasi `._-<>+=()` | `jne<script>` |
| Kode voucher | huruf/angka + `_ -` | `HEMAT 10`, `HEMAT@10` |
| Nama produk / varian | huruf/angka + `& . , ' ( ) + - / % : !` dan spasi | `Kaos <b>` |
| Nama kategori / brand / nama brand toko | huruf/angka + `& . , ' ( ) -` dan spasi; wajib ada huruf | `123`, `Brand@X` |
| Telepon toko | angka + pemisah, minimal 7 angka (nomor rumah/kantor boleh) | `021-abc` |
| Akun media sosial | handle/URL: `@ A-Z a-z 0-9 . _ - / :`; wajib ada huruf/angka | `flex store!` |
| Catatan, deskripsi, tagline, teks footer, kebijakan, pesan pemeliharaan | bebas kecuali karakter kontrol | teks dengan karakter kontrol |
| Email, password | aturan lama tidak berubah (email valid; password 8-72 karakter) | â€” |

Catatan pelaksanaan:

- Sisi klien menambah `inputMode`, `pattern`, dan filter saat mengetik untuk field angka (nomor HP, kode pos, kode OTP) di `AddressManager`, `CheckoutForm`, `OtpVerificationForm`, dan `TrackOrderForm`. Ini kenyamanan saja; server tetap penentu akhir.
- Semua pesan kesalahan form ditampilkan lewat `FormErrorAlert` (29 komponen form: alamat, checkout, profil, auth, keranjang, pembayaran, notifikasi, dan formulir admin) yang otomatis menggulir halaman ke tengah viewport tepat di pesan saat pesan muncul â€” tanpa scroll manual (permintaan pengguna 2026-10-11).
- Data lama yang sudah tersimpan tidak divalidasi ulang; aturan berlaku saat tulis berikutnya.
- Perubahan ini hasil permintaan pengguna 2026-10-11 ("semua field memperketat, nomor HP tidak boleh abjad") â€” dicatat di `docs/04` bagian 15.7.

---

## <a name="auth-01"></a>AUTH-01 â€” Guest OTP Verification

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-01 â€” Guest OTP Verification |
| Modul | MOD-AUTH |
| Tujuan | Guest verify phone saat checkout untuk mencegah spam/fake order |
| Aktor utama | Guest (belum login) |
| Status | Terimplementasi (PH-01) |
| Referensi PRD | PRD 3.1.C (Guest checkout), PRD 5.7 (Guest Checkout Rules) |
| Referensi SDD | SDD 4.1 (MOD-AUTH), Twilio OTP |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Guest di checkout page, belum verify phone
- **Pemicu:** Guest klik "Send OTP" atau "Verify Phone"
- **Titik masuk:** Checkout form, phone input field
- **Jika tidak terpenuhi:** Tidak bisa proceed checkout

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons jika tidak berhak |
| --- | --- | --- | --- |
| Guest | Send OTP, verify OTP | Own phone only | N/A (public) |
| Customer (logged in) | Skip OTP (already verified) | N/A | N/A |

### 4. Input dan validasi

| Input | Tipe | Wajib | Nilai awal | Validasi | Pesan error |
| --- | --- | --- | --- | --- | --- |
| phone | String | Ya | Empty | Format +62xxx, 10-13 digits | "Nomor HP tidak valid" |
| otpCode | String | Ya | Empty | 6 digits | "Kode OTP tidak valid" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons sistem | Hasil |
| --- | --- | --- | --- |
| 1 | Guest input phone | Validate format | Phone input valid |
| 2 | Guest klik "Send OTP" | Call Twilio Verify, save session SID to Redis (5 min expiry) | "OTP sent to +62xxx" |
| 3 | Guest input OTP code | Check code via Twilio `verificationChecks` | "Phone verified" |
| 4 | Guest proceed checkout | Phone verified flag set | Continue to payment |

### 6. Output dan perubahan data

- **Hasil:** Phone verified, proceed checkout
- **Data dibaca:** Phone number
- **Data dibuat:** Session SID verification (Redis, 5 min TTL), verification flag (session)
- **Kondisi akhir:** Phone verified = true
- **Efek samping:** SMS OTP terkirim via Twilio Verify
- **Setelah reload:** Verification lost (session-based)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Resend OTP | Cancel previous session, create new verification, send again | Old code invalid |
| Expired OTP (5 min) | Show "OTP expired, resend" | Must resend |
| Cancel | Return to cart | No verification |

Tidak berlaku â€” no status transition (single-step verification).

### 8. Kondisi gagal

| Kondisi | Respons | Nasib input | Tindakan |
| --- | --- | --- | --- |
| Invalid phone format | "Nomor HP tidak valid" | Retained | Fix phone |
| Wrong OTP code | "Kode OTP salah" (max 3 attempts) | Retained | Retry or resend |
| OTP expired | "Kode OTP expired" | Clear code | Resend OTP |
| Twilio error | "Gagal kirim OTP, coba lagi" | Retained | Retry send |
| Rate limit (3/hour) | "Terlalu banyak percobaan, tunggu 1 jam" | Blocked | Wait |

### 9. Perilaku UI

- **Halaman:** Checkout page, phone verification section
- **Elemen:** Phone input, "Send OTP" button, OTP code input, "Verify" button

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Phone input enabled, Send OTP button | Input phone, click send |
| Sending OTP | Loading spinner, button disabled | Wait |
| OTP sent | OTP input enabled, countdown timer (5 min) | Input code, verify |
| Verifying | Loading spinner | Wait |
| Verified | Green checkmark, inputs disabled | Proceed checkout |
| Error | Error message near input | Fix and retry |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-AUTH-01-01 | Guest input valid phone | Click "Send OTP" | OTP sent, session SID saved Redis (5 min TTL) |
| AC-AUTH-01-02 | OTP sent | Input correct code, click "Verify" | Phone verified, proceed checkout |
| AC-AUTH-01-03 | OTP sent | Input wrong code 3x | Show "Terlalu banyak percobaan" |
| AC-AUTH-01-04 | OTP sent | Wait 5 min | OTP expired, show "Kode expired" |
| AC-AUTH-01-05 | Phone verified | Reload page | Verification lost (session-based) |
| AC-AUTH-01-06 | Guest | Send OTP 3x in 1 hour | Rate limited, blocked |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | phone: "+628123456789", code: "123456" | Verified | AC-AUTH-01-01, 02 |
| Invalid phone | phone: "081234" | "Nomor HP tidak valid" | Validation |
| Wrong code | code: "999999" | "Kode OTP salah" | AC-AUTH-01-03 |
| Expired | Wait 6 min | "Kode expired" | AC-AUTH-01-04 |

### 12. Batas fitur

- **Termasuk:** OTP send, verify, rate limit
- **Tidak termasuk:** Phone number ownership verification (beyond OTP), customer login OTP (separate feature)
- **Ketergantungan:** Twilio Verify (Trial gratis untuk dev â€” 40 verifikasi; production setelah upgrade akun)

### 13. Pertanyaan terbuka

Tidak ada â€” ready for implementation.

---

## <a name="prod-01"></a>PROD-01 â€” Product CRUD (Store Admin)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PROD-01 â€” Product CRUD (Store Admin) |
| Modul | MOD-PROD |
| Tujuan | Store Admin mengelola produk (create, read, update, delete) |
| Aktor utama | Store Admin |
| Status | Terimplementasi (PH-01) |
| Referensi PRD | PRD 3.1.A (Product Management), PRD 7.4 (Product Config) |
| Referensi SDD | SDD 4.2 (MOD-PROD), Product/ProductVariant schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Store Admin logged in
- **Pemicu:** Click "Add Product" or "Edit Product" or "Delete Product"
- **Titik masuk:** Admin product list page
- **Jika tidak terpenuhi:** Redirect to login, show 403 if not Store Admin

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons jika tidak berhak |
| --- | --- | --- | --- |
| Store Admin | CRUD products | Own store only | N/A |
| Site Admin | None â€” konfigurasi platform (PRD 2.4), bukan produk | None | 403 Forbidden |
| Customer/Guest | None | None | 403 Forbidden |

### 4. Input dan validasi

| Input | Tipe | Wajib | Nilai awal | Validasi | Pesan error |
| --- | --- | --- | --- | --- | --- |
| name | String | Ya | Empty | Max 200 chars, trim | "Nama produk wajib diisi" |
| slug | String | Ya | Auto from name | Unique, lowercase, alphanumeric+dash | "Slug sudah digunakan" |
| description | Text | Tidak | Empty | Max 5000 chars | - |
| categoryId | UUID | Ya | None | Must exist | "Kategori tidak valid" |
| brandId | UUID | Tidak | null | Must exist if provided | "Brand tidak valid" |
| status | Enum | Ya | DRAFT | ACTIVE/INACTIVE/DRAFT/OUT_OF_STOCK/DISCONTINUED | "Status tidak valid" |
| images | URL[] | Ya (min 1) | Empty | Max 4 (`MAX_PRODUCT_IMAGES`), tiap item `{ url, sortOrder? }`, URL valid; berkas diunggah klien ke Uploadthing sebelum simpan (4MB per berkas) | "Minimal 1 gambar" |
| sizeChartUrl | URL | Tidak | "" | URL valid, maks 500 karakter, maks 1 gambar | "URL bagan ukuran tidak valid" |
| variants | Array | Ya | [] | Min 1, SKU unique, price > 0, stock >= 0 | "Minimal 1 variant" |
| variants[].imageUrl | URL | Tidak | null | URL valid, opsional â€” 1 gambar per varian | "URL gambar tidak valid" |

**Catatan unggahan (Uploadthing):**

- Alur: klien mengunggah lebih dulu lewat `useUploadThing` ke endpoint `productImage` di `/api/uploadthing`; server hanya menyimpan URL hasil unggah, bukan berkas. Tiga pemakai endpoint ini: galeri produk lewat `ImageUploader` (hingga 4 berkas), bagan ukuran lewat `ImageUploader max={1}`, dan gambar varian lewat `VariantImagePicker` (satu berkas per baris varian).
- Batas endpoint: maksimal 4 berkas per permintaan unggah, 4MB per berkas, `accept="image/*"` di klien. Gerbang `STORE_ADMIN` â€” tanpa sesi atau role lain menjawab `403 FORBIDDEN` (`src/lib/uploadthing/core.ts`).
- Batas 4MB menggantikan 5MB spesifikasi karena Uploadthing hanya menerima ukuran kelipatan pangkat dua (keputusan `docs/04` bagian 10, 2026-10-09).
- Galat unggah di klien menampilkan "Gagal mengunggah gambar, coba lagi"; tombol unggah bisa dipakai ulang (bagian 8).
- Endpoint terpisah `refundProof` (bukti refund manual, ORDER-06): gambar, maksimal 1 berkas 4MB, gerbang `STORE_ADMIN` sama.
- Status uji: gerbang terverifikasi `403`/`200` sejak PH-01. Unggah berkas nyata endpoint `productImage` **terverifikasi 2026-10-14** lewat UI admin: PNG 247 byte → `POST /api/uploadthing?actionType=upload&slug=productImage` `200` → `PUT sea1.ingest.uploadthing.com` `200` → URL `https://jqvuhozget.ufs.sh/f/...` disajikan `200 image/png 247 bytes`. Batas endpoint ikut terbukti (5MB → `400 FileSizeMismatch`, 5 berkas → `400 FileCountMismatch`), dan gerbang di produksi tanpa sesi → `403`. Bukti: `docs/04` bagian 4.5.
- Status uji endpoint `refundProof` **terverifikasi 2026-10-14** dengan berkas nyata: sesi Store Admin → `POST /api/uploadthing?actionType=upload&slug=refundProof` `200` (presigned) → `PUT sea1.ingest.uploadthing.com` (multipart, field `file`) `200` → URL `https://jqvuhozget.ufs.sh/f/...` disajikan `200 image/png 247 bytes`; dua berkas dalam satu permintaan → `400 FileCountMismatch`; tanpa sesi di produksi → `403`. `PUT` dengan badan mentah (`Content-Type: image/png`) ditolak `415` — ingest hanya menerima `multipart/form-data`. Jalur UI lengkap pernah berjalan: baris refund `FS-20261013-87S2YV` berstatus `COMPLETED` dengan `proofUrl` asli yang tersaji `200 image/png 22910 bytes`. Bukti: `docs/04` bagian 9.4.

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Click "Add Product" | Show form | Form displayed |
| 2 | Fill form, upload images | Validate client-side | Form valid |
| 3 | Click "Save" | Upload images, validate server, create in transaction | Product created |
| 4 | System | Calculate totalStock, save | Product saved |
| 5 | System | Redirect to list | Product appears |

### 6. Output dan perubahan data

- **Hasil:** Product created/updated/deleted
- **Data dibuat:** Product, ProductImage, ProductVariant
- **Bagan ukuran:** disimpan sebagai `ProductImage` dengan `role: SIZE_CHART` (terpisah dari galeri `GALLERY`); gambar varian disimpan di `ProductVariant.imageUrl`
- **Kondisi akhir:** Product exists, totalStock = sum(variants.stock)
- **Setelah reload:** Product persists

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Cancel | Confirm discard, return | No changes |
| Delete with orders | Show error | Soft delete only |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Slug duplicate | "Slug sudah digunakan" | Change slug |
| SKU duplicate | "SKU sudah digunakan" | Change SKU |
| Image upload fail | "Gagal upload" | Retry |
| No variants | "Minimal 1 variant" | Add variant |

### 9. Perilaku UI

- **Halaman:** Admin product form
- **Elemen:** Name, slug, description, category, brand, status, images (4 max), size chart (opsional, maks 1), variants (dynamic)
- **Gambar varian:** setiap baris varian punya pemilih satu gambar opsional (`VariantImagePicker`) â€” pratinjau 64px, tombol Unggah/Ganti, dan Hapus. Unggahan memakai endpoint `productImage` yang sama dengan galeri; bidang kosong dikirim sebagai `null` dan nilai tersimpan di `ProductVariant.imageUrl`. Gambar tampil di keranjang, dengan fallback ke gambar produk pertama bila varian tidak punya gambar. Ditambahkan sebagai revisi PH-01 (2026-10-11, `docs/04` bagian 4.8 dan 10).

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Form enabled | Fill and save |
| Uploading | Progress bar | Wait |
| Saving | Loading spinner | Wait |
| Saved | Success, redirect | View list |
| Error | Error messages | Fix errors |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PROD-01-01 | Store Admin | Fill valid, save | Product created |
| AC-PROD-01-02 | Product exists | Edit, save | Product updated |
| AC-PROD-01-03 | Product, no orders | Delete | Hard deleted |
| AC-PROD-01-04 | Product, has orders | Delete | Soft delete only |
| AC-PROD-01-05 | Admin | Duplicate slug | Error, not saved |
| AC-PROD-01-06 | Admin | 0 variants | Error, not saved |
| AC-PROD-01-07 | Customer/Guest | Access admin | 403 Forbidden |
| AC-PROD-01-08 | Store Admin, baris varian tanpa gambar | Unggah satu gambar pada baris varian lalu simpan | `ProductVariant.imageUrl` terisi; gambar tampil di keranjang |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | name: "Kaos Polos", variants: [{sku: "KP-001", price: 50000, stock: 10}] | Created | AC-PROD-01-01 |
| Duplicate slug | slug: "kaos-polos" (exists) | Error | AC-PROD-01-05 |

### 12. Batas fitur

- **Termasuk:** CRUD single product, images (galeri maks 4 + bagan ukuran opsional), variants (gambar varian opsional via form admin atau API)
- **Tidak termasuk:** Bulk import, structured variant attributes
- **Ketergantungan:** Uploadthing, Category/Brand

### 13. Pertanyaan terbuka

Tidak ada.

---

## <a name="cart-01"></a>CART-01 â€” Add to Cart

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-01 â€” Add to Cart |
| Modul | MOD-CART |
| Tujuan | Guest/Customer menambahkan produk ke cart |
| Aktor utama | Guest, Customer |
| Status | Terimplementasi (PH-02) |
| Referensi PRD | PRD 3.1.B (Shopping Cart) |
| Referensi SDD | SDD 4.3 (MOD-CART), CartItem schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** None (public)
- **Pemicu:** Click "Add to Cart" on product detail or list
- **Titik masuk:** Product detail page, product card
- **Jika tidak terpenuhi:** N/A

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Guest | Add to cart | Own session cart (Redis) | N/A |
| Customer | Add to cart | Own cart (PostgreSQL) | N/A |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| variantId | UUID | Ya | Must exist, stock > 0 | "Produk tidak tersedia" |
| quantity | Int | Ya | >= 1, <= stock available | "Stok tidak cukup" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | User select variant, quantity | Client validate | Input valid |
| 2 | User click "Add to Cart" | Call `/api/cart/validate` (server-side stock check) | Stock sufficient |
| 3 | System | Save CartItem (Redis for guest, PostgreSQL for customer) | Cart updated |
| 4 | System | Show success message, update cart badge | Cart count updated |

### 6. Output dan perubahan data

- **Hasil:** Item added to cart, cart count updated
- **Data dibaca:** ProductVariant (stock, price)
- **Data dibuat:** CartItem (variantId, quantity, price snapshot)
- **Kondisi akhir:** CartItem exists in cart
- **Setelah reload:** Cart persists (Redis session for guest, PostgreSQL for customer)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Item already in cart | Increase quantity | Quantity updated |
| Cancel | Close dialog/drawer | No changes |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Stock insufficient | "Stok tidak cukup (tersisa X)" | Reduce quantity |
| Variant not found | "Produk tidak ditemukan" | Refresh page |
| Product inactive | "Produk tidak tersedia" | Cannot add |
| Redis/DB error | "Gagal menambahkan ke cart" | Retry |

### 9. Perilaku UI

- **Halaman:** Product detail, product card
- **Elemen:** Variant selector, quantity input, "Add to Cart" button, cart badge

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Button enabled | Click to add |
| Adding | Loading spinner | Wait |
| Added | Success message, cart badge +1 | Continue shopping |
| Stock insufficient | Button disabled, show "Stok habis" | Cannot add |
| Error | Error message | Retry |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-CART-01-01 | Guest/Customer, stock available | Add to cart | Item added, cart count +1 |
| AC-CART-01-02 | Item already in cart | Add same variant | Quantity increased |
| AC-CART-01-03 | Stock insufficient | Try add quantity > stock | Error "Stok tidak cukup" |
| AC-CART-01-04 | Product inactive | Try add | Error "Produk tidak tersedia" |
| AC-CART-01-05 | Guest | Add to cart, reload | Cart persists (Redis session) |
| AC-CART-01-06 | Customer | Add to cart, logout, login | Cart persists (PostgreSQL) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | variantId: valid UUID, quantity: 2, stock: 10 | Added | AC-CART-01-01 |
| Insufficient stock | quantity: 10, stock: 5 | Error | AC-CART-01-03 |
| Inactive product | product.status: INACTIVE | Error | AC-CART-01-04 |

### 12. Batas fitur

- **Termasuk:** Add single item, quantity validation, stock check
- **Tidak termasuk:** Update/remove (separate features), apply voucher
- **Ketergantungan:** MOD-PROD (stock data)

### 13. Pertanyaan terbuka

Tidak ada.

---

## <a name="cart-02"></a>CART-02 â€” Update Cart Item

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-02 â€” Update Cart Item |
| Modul | MOD-CART |
| Tujuan | Guest/Customer mengubah jumlah item di cart dari halaman keranjang |
| Aktor utama | Guest, Customer |
| Status | Terimplementasi (PH-02) |
| Referensi PRD | PRD 3.1.B (Shopping Cart) |
| Referensi SDD | SDD 4.3 (MOD-CART), CartItem schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Item sudah ada di cart
- **Pemicu:** Tombol `+`/`-` pada baris item
- **Titik masuk:** Halaman `/cart`
- **Jika tidak terpenuhi:** Baris item tidak dirender, tombol tidak tersedia

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Guest | Ubah jumlah | Own session cart (Redis) | N/A |
| Customer | Ubah jumlah | Own cart (PostgreSQL) | N/A |
| Bukan pemilik cart | Ubah jumlah | Tidak ada â€” identitas diambil dari sesi/cookie, bukan dari body | Cart milik orang lain tidak pernah tersentuh |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| variantId | UUID | Ya | Harus ada di cart dan variannya masih aktif | "Produk tidak ditemukan" |
| quantity | Int | Ya | >= 1, <= stok tersedia | "Jumlah minimal 1", "Stok tidak cukup (tersisa X)" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | User ubah jumlah | `PATCH /api/cart` | Jumlah item diperbarui |
| 2 | System | Hitung ulang subtotal dan jumlah item | Ringkasan diperbarui |
| 3 | System | `router.refresh()` | Daftar item dan badge keranjang ikut terbarui |

### 6. Output dan perubahan data

- **Hasil:** Jumlah item berubah
- **Data dibaca:** CartItem, ProductVariant (stok, harga snapshot)
- **Data diubah:** CartItem.quantity (customer) atau entri di daftar Redis (guest)
- **Kondisi akhir:** Cart konsisten dengan permintaan terakhir
- **Setelah reload:** Perubahan bertahan (Redis untuk guest, PostgreSQL untuk customer)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Jumlah dikurangi sampai 1 | Tombol `-` dinonaktifkan | Tidak ada nilai 0; untuk membuang item dipakai CART-03 |
| Item sudah tidak aktif | Baris menandai "Produk tidak tersedia" dan tombol dinonaktifkan | Item harus dihapus dulu (CART-03) |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Stok berkurang setelah item masuk cart | "Stok tidak cukup (tersisa X)" | Turunkan jumlah |
| Varian/produk sudah tidak aktif | "Produk tidak tersedia" | Hapus item (CART-03) |
| Varian tidak ditemukan | "Produk tidak ditemukan" | Muat ulang halaman |
| Item tidak ada di cart | `404 VARIANT_NOT_FOUND` "Item tidak ada di keranjang" | Muat ulang halaman |
| Body tidak valid | "Varian wajib dipilih" / "Jumlah minimal 1" | Perbaiki input |

### 9. Perilaku UI

- **Halaman:** `/cart`
- **Elemen:** Tombol `+`/`-`, subtotal baris, ringkasan, badge keranjang

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Tombol aktif | Klik untuk mengubah |
| Memproses | Tombol nonaktif, label "Memproses..." | Tunggu |
| Stok tidak cukup | Pesan galat di baris item | Turunkan jumlah |
| Keranjang kosong | Kartu "Keranjang masih kosong" + tautan ke `/products` | Lanjut belanja |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-CART-02-01 | Item ada di cart | Ubah jumlah ke nilai valid | `200`, jumlah dan subtotal berubah |
| AC-CART-02-02 | Item ada di cart | Set jumlah melebihi stok | `400 INSUFFICIENT_STOCK` |
| AC-CART-02-03 | Item ada di cart | Set jumlah 0 atau negatif | `400 VALIDATION_ERROR` |
| AC-CART-02-04 | Guest | Ubah jumlah, muat ulang | Perubahan bertahan (Redis) |
| AC-CART-02-05 | Customer | Ubah jumlah, logout, login | Perubahan bertahan (PostgreSQL) |
| AC-CART-02-06 | Customer, varian aktif yang tidak ada di cart | Ubah jumlah | `404 VARIANT_NOT_FOUND` (bukan `500`) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | quantity: 4, stock: 25 | `200`, quantity 4 | AC-CART-02-01 |
| Melebihi stok | quantity: 999, stock: 25 | `400`, "Stok tidak cukup (tersisa 25)" | AC-CART-02-02 |
| Tidak valid | quantity: 0 | `400`, "Jumlah minimal 1" | AC-CART-02-03 |

### 12. Batas fitur

- **Termasuk:** Ubah jumlah satu item, perhitungan ulang ringkasan
- **Tidak termasuk:** Hapus item (CART-03), ubah varian (harus hapus lalu tambah lagi), hapus semua sekaligus
- **Ketergantungan:** CART-01 (item harus ada), MOD-PROD (stok)

### 13. Pertanyaan terbuka

Tidak ada.

---

## <a name="cart-03"></a>CART-03 â€” Remove from Cart

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-03 â€” Remove from Cart |
| Modul | MOD-CART |
| Tujuan | Guest/Customer membuang satu item dari cart |
| Aktor utama | Guest, Customer |
| Status | Terimplementasi (PH-02) |
| Referensi PRD | PRD 3.1.B (Shopping Cart) |
| Referensi SDD | SDD 4.3 (MOD-CART), CartItem schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Item sudah ada di cart
- **Pemicu:** Tombol "Hapus" pada baris item
- **Titik masuk:** Halaman `/cart`
- **Jika tidak terpenuhi:** Tombol tidak tersedia

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Guest | Hapus item | Own session cart (Redis) | N/A |
| Customer | Hapus item | Own cart (PostgreSQL) | N/A |
| Bukan pemilik cart | Hapus item | Tidak ada â€” identitas diambil dari sesi/cookie, bukan dari body | Cart milik orang lain tidak pernah tersentuh |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| variantId | UUID | Ya | Harus UUID valid | "Varian wajib dipilih" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | User klik "Hapus" | `DELETE /api/cart` | Item dihapus dari cart |
| 2 | System | Hitung ulang subtotal dan jumlah item | Ringkasan diperbarui |
| 3 | System | `router.refresh()` | Daftar item dan badge keranjang ikut terbarui |

### 6. Output dan perubahan data

- **Hasil:** Item hilang dari cart
- **Data dibaca:** CartItem (memastikan item ada di cart pemanggil)
- **Data dihapus:** Baris CartItem (customer) atau entri di daftar Redis (guest)
- **Kondisi akhir:** Cart konsisten dengan permintaan terakhir; `itemCount` berkurang satu
- **Setelah reload:** Item tetap hilang (Redis untuk guest, PostgreSQL untuk customer)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Item terakhir dihapus | Keranjang menjadi kosong | Halaman menampilkan kartu "Keranjang masih kosong" |
| Item sudah tidak ada | `DELETE` tetap dijawab `200` (idempoten) | Cart tidak berubah |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Body tidak valid | `400 VALIDATION_ERROR` "Varian wajib dipilih" | Perbaiki input |
| Varian tidak ditemukan | `404 VARIANT_NOT_FOUND` | Muat ulang halaman |

### 9. Perilaku UI

- **Halaman:** `/cart`
- **Elemen:** Tombol "Hapus" per baris item

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Tombol "Hapus" aktif | Klik untuk membuang item |
| Memproses | Tombol nonaktif, label "Memproses..." | Tunggu |
| Keranjang kosong | Kartu "Keranjang masih kosong" + tautan ke `/products` | Lanjut belanja |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-CART-03-01 | Item ada di cart | Klik "Hapus" | `200`, item hilang dari daftar |
| AC-CART-03-02 | Item terakhir di cart | Klik "Hapus" | `200`, `itemCount: 0`, keranjang kosong |
| AC-CART-03-03 | Guest | Hapus item, muat ulang | Item tetap hilang (Redis) |
| AC-CART-03-04 | Customer | Hapus item, logout, login | Item tetap hilang (PostgreSQL) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Hapus satu | 2 item di cart, hapus 1 | `200`, sisa 1 item | AC-CART-03-01 |
| Hapus terakhir | 1 item di cart, hapus 1 | `200`, `itemCount: 0` | AC-CART-03-02 |

### 12. Batas fitur

- **Termasuk:** Hapus satu item, perhitungan ulang ringkasan
- **Tidak termasuk:** Hapus semua sekaligus, ubah jumlah (CART-02)
- **Ketergantungan:** CART-01 (item harus ada)

### 13. Pertanyaan terbuka

Tidak ada.

---

## <a name="cart-04"></a>CART-04 â€” Merge Guest Cart on Login (tambahan)

> Fitur ini **tambahan di luar indeks PRD**. PRD tidak mencantumkannya sebagai fitur terpisah, tetapi
> perilakunya wajib begitu keranjang guest disimpan di luar akun: tanpa penggabungan, item yang
> ditambahkan sebelum login akan hilang.

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-04 â€” Merge Guest Cart on Login |
| Modul | MOD-CART |
| Tujuan | Isi keranjang guest dipindahkan ke keranjang customer setelah login/registrasi, tanpa kehilangan item |
| Aktor utama | Guest yang baru login/registrasi |
| Status | Terimplementasi (PH-02) |
| Referensi PRD | PRD 3.1.B (Shopping Cart) â€” perilaku turunan |
| Referensi SDD | SDD 4.3 (MOD-CART) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada cookie keranjang guest (`flexstore_cart`) berisi UUID valid
- **Pemicu:** Login sukses (form login) atau registrasi sukses (auto-login)
- **Titik masuk:** `LoginForm`, `RegisterForm`, dan `CartSync` di layout storefront
- **Jika tidak terpenuhi:** Endpoint menjawab `{"merged":0}` tanpa efek samping

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Guest tanpa sesi | Panggil `/api/cart/sync` | Tidak ada | `{"merged":0}` |
| Customer login | Panggil `/api/cart/sync` | Keranjang miliknya sendiri | Item guest digabung |
| Store Admin | Panggil `/api/cart/sync` | Tidak ada | `403 FORBIDDEN` (hanya customer dan guest yang berbelanja) |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| (tidak ada body) | - | - | Identitas customer dari sesi; identitas guest dari cookie dan wajib UUID valid (nilai lain diabaikan, `merged: 0`) | Tidak ada |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | User login/registrasi sukses | Client memanggil `POST /api/cart/sync` | Sesi aktif |
| 2 | System | Baca sesi + cookie guest | Keduanya ada |
| 3 | System | Untuk tiap item guest: lewati jika varian tidak aktif, jumlah dibatasi stok, item digabung ke `cart_items` | Item masuk keranjang customer |
| 4 | System | Hapus kunci Redis `cart:guest:{uuid}` | Keranjang guest kosong |
| 5 | System | Kembalikan `{"merged":N}` | Client `router.refresh()` bila `N > 0` |

### 6. Output dan perubahan data

- **Hasil:** Item keranjang guest pindah ke keranjang customer
- **Data dibaca:** Daftar item guest di Redis, ProductVariant (stok, status)
- **Data dibuat/diubah:** Baris `CartItem` untuk customer (upsert, `price` = snapshot harga saat itu)
- **Data dihapus:** Kunci Redis `cart:guest:{uuid}`
- **Kondisi akhir:** Keranjang guest kosong; keranjang customer berisi gabungan
- **Setelah reload:** Item tetap ada karena tersimpan di PostgreSQL

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Dipanggil dua kali | Keranjang guest sudah dihapus, jadi panggilan kedua no-op | `{"merged":0}` (idempoten) |
| Varian sudah tidak aktif | Item itu dilewati | Item lain tetap digabung |
| Jumlah gabungan melebihi stok | Dibatasi ke stok maksimum | Tidak melebihi stok |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tidak ada sesi | `200 {"merged":0}` | Tidak ada |
| Tidak ada cookie guest | `200 {"merged":0}` | Tidak ada |
| Redis tidak tersedia | Keranjang guest tidak terbaca; login tetap sukses | Login tidak diblokir oleh kegagalan sinkronisasi |

### 9. Perilaku UI

- **Halaman:** Semua halaman storefront (layout), form login, form registrasi
- **Elemen:** Tidak ada UI khusus; sinkronisasi berjalan di latar belakang

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Ada item digabung | Badge keranjang dan isi `/cart` ikut terbarui setelah `router.refresh()` | Lanjut belanja |
| Tidak ada item | Tidak ada perubahan tampilan | - |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-CART-04-01 | Guest punya item di keranjang | Login | Item muncul di keranjang customer, `merged >= 1` |
| AC-CART-04-02 | Guest punya item di keranjang | Registrasi (auto-login) | Item muncul di keranjang customer |
| AC-CART-04-03 | Sudah pernah digabung | Panggil sync lagi | `{"merged":0}`, tidak ada duplikasi |
| AC-CART-04-04 | Guest punya item | Login, logout, login lagi | Item tetap ada (PostgreSQL) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Merge | Guest: 1 item Sneakers x1; customer baru | `{"merged":1}` | AC-CART-04-01 |
| Idempoten | Sync dipanggil ulang | `{"merged":0}` | AC-CART-04-03 |

### 12. Batas fitur

- **Termasuk:** Penggabungan otomatis setelah login/registrasi, idempoten, pembatasan stok
- **Tidak termasuk:** Notifikasi khusus "item digabung", penggabungan antar dua akun customer
- **Ketergantungan:** CART-01 (isi keranjang guest), MOD-AUTH (sesi)

### 13. Pertanyaan terbuka

Tidak ada.

---

## <a name="ship-01"></a>SHIP-01 â€” Calculate Shipping Cost

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SHIP-01 â€” Calculate Shipping Cost |
| Modul | MOD-SHIP |
| Tujuan | Menghitung ongkos kirim dari lokasi toko ke kecamatan tujuan, berdasarkan berat paket |
| Aktor utama | Guest, Customer |
| Status | Terimplementasi (PH-02) |
| Referensi PRD | PRD 3.1.C (Shipping) |
| Referensi SDD | SDD 4.7 (MOD-SHIP), SDD section 9 (timeout + fallback) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Keranjang tidak kosong
- **Pemicu:** User memilih tujuan lalu klik "Hitung Ongkos Kirim"
- **Titik masuk:** Halaman `/checkout` (setelah item dicentang di `/cart`)
- **Jika tidak terpenuhi:** Endpoint menjawab `400 CART_EMPTY`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Guest | Hitung ongkir | Berat dari keranjang guest-nya sendiri | N/A |
| Customer | Hitung ongkir | Berat dari keranjangnya sendiri | N/A |
| Bukan pemilik | Hitung ongkir | Tidak bisa â€” berat dihitung server dari identitas pemanggil | Body `weight` dari klien diabaikan |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| destinationId | String angka | Ya bila mode API aktif | 1-10 digit | "Tujuan wajib dipilih" |
| search (pencarian tujuan) | String | Ya (endpoint cities) | Minimal 3 karakter | "Ketik minimal 3 karakter" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | User mengetik nama kecamatan | `GET /api/shipping/cities?search=...` | Daftar tujuan (id + label + provinsi/kota/kecamatan/kelurahan/kode pos) |
| 2 | User memilih tujuan | Client menyimpan `destinationId` | Tujuan terpilih |
| 3 | User klik "Hitung Ongkos Kirim" | `POST /api/shipping` | Server menghitung berat = jumlah (kuantitas x berat varian); berat varian dibaca dari data produk |
| 4 | System | Panggil RajaOngkir, cache 10 menit per (origin, tujuan, berat) | Daftar opsi kurir |
| 5 | System | Tampilkan opsi; user memilih satu | Total = subtotal + ongkir terpilih |

### 6. Output dan perubahan data

- **Hasil:** `{source, cached, options:[{courier,code,service,description,cost,etd}]}` â€” berat paket **tidak** ikut di respons supaya tidak terbaca customer/guest; berat tetap dipakai server sebagai kunci cache dan parameter RajaOngkir
- **Data dibaca:** Keranjang (kuantitas per item), berat varian dari data produk, pengaturan env (origin, kurir)
- **Data dibuat:** Cache Redis `ship:cost:*` (TTL 10 menit), `ship:search:v2:*` (TTL 5 menit; versi naik saat bentuk entri bertambah field)
- **Kondisi akhir:** Ongkir terhitung; belum ada pesanan yang dibuat (itu PH-03)
- **Setelah reload:** Hasil hitung tidak disimpan di klien; user menghitung ulang bila perlu

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| API key/origin belum diisi | Tarif flat Rp10.000 | `source: "fallback"` |
| API menjawab galat atau timeout (10 detik) | Tarif flat Rp10.000 | `source: "fallback"`, detail galat hanya ke log |
| Permintaan sama diulang | Diambil dari cache | `cached: true` |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Keranjang kosong | `400 CART_EMPTY` | Tambah item dulu |
| Tujuan kosong saat API aktif | `400 VALIDATION_ERROR` "Tujuan wajib dipilih" | Pilih tujuan |
| Tujuan tidak dikenal | Tarif flat (fallback anggun) | Pilih tujuan lain |
| Redis mati | Hitung tetap jalan tanpa cache | Tidak ada |

### 9. Perilaku UI

- **Halaman:** `/cart` (ringkasan)
- **Elemen:** Kolom pencarian tujuan, daftar hasil, tombol hitung, daftar opsi (radio), total

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Mencari | Teks "Mencari tujuan..." | Tunggu |
| API belum aktif | Catatan "API ongkir belum aktif" + tombol "Gunakan Tarif Flat" | Hitung tarif flat |
| Selesai | Daftar opsi kurir dengan harga dan estimasi | Pilih satu |
| Galat | Pesan galat berbahasa Indonesia | Coba lagi |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-SHIP-01-01 | Keranjang berisi, API aktif, tujuan dipilih | Hitung ongkir | Opsi kurir asli, `source: "api"` |
| AC-SHIP-01-02 | Keranjang kosong | Hitung ongkir | `400 CART_EMPTY` |
| AC-SHIP-01-03 | API belum dikonfigurasi | Hitung ongkir | Tarif flat Rp10.000, `source: "fallback"` |
| AC-SHIP-01-04 | API aktif, tujuan kosong | Hitung ongkir | `400 VALIDATION_ERROR` |
| AC-SHIP-01-05 | Permintaan identik diulang dalam 10 menit | Hitung ongkir | `cached: true` |
| AC-SHIP-01-06 | Tujuan tidak dikenal | Hitung ongkir | Tarif flat (tidak ada galat ke pengguna) |
| AC-SHIP-01-07 | Dua keranjang dengan berat varian berbeda, tujuan sama | Hitung ongkir | Kunci cache berbeda (`cached: false` untuk keduanya), membuktikan berat = jumlah (kuantitas x berat varian) ikut dihitung |
| AC-SHIP-01-08 | Body permintaan menyertakan `weight`/`weightGram` dari klien | Hitung ongkir | Nilai dari klien diabaikan; berat tetap dari data produk |
| AC-SHIP-01-09 | Permintaan hitung ongkir berhasil | Hitung ongkir | Respons hanya memuat `source`, `cached`, `options`; tidak ada berat paket |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| API aktif | Keranjang 2 item varian `KP-30S-M` (200 gram), tujuan `16034` | 9 opsi kurir asli, `source: "api"` | AC-SHIP-01-01, AC-SHIP-01-07, AC-SHIP-01-09 |
| Fallback | `RAJAONGKIR_API_KEY` kosong | `cost: 10000`, `source: "fallback"` | AC-SHIP-01-03 |
| Keranjang kosong | Tanpa item | `400 CART_EMPTY` | AC-SHIP-01-02 |

### 12. Batas fitur

- **Termasuk:** Pencarian kecamatan tujuan, hitung ongkir multi-kurir, cache, fallback tarif flat
- **Tidak termasuk:** Simpan pilihan ongkir ke pesanan (PH-03), lacak kiriman (SHIP-02)
- **Sudah termasuk sejak revisi 2026-10-10:** berat per varian (`ProductVariant.weightGram`) — pengganti asumsi berat seragam yang berlaku sebelumnya (bagian 13)
- **Ketergantungan:** MOD-CART (berat dari keranjang), RajaOngkir Komerce API v1 (opsional)

### 13. Pertanyaan terbuka

- Berat paket dihitung dari berat varian (`ProductVariant.weightGram`, gram) yang diisi admin di form produk. `SHIPPING_WEIGHT_PER_ITEM_GRAM` (default 1000) hanya cadangan untuk varian yang beratnya 0/belum diisi. Berat **tidak** ditampilkan ke customer/guest dan **tidak pernah** diterima dari body request.

---

## <a name="order-01"></a>ORDER-01 â€” Create Order (Guest Checkout)

> **Cakupan PH-03:** pembuatan pesanan saja. Pembayaran (Xendit) ada di PH-04, voucher dan email
> konfirmasi ada di PH-05. Karena itu `voucherCodes` dan AC yang bergantung padanya ditandai
> ditunda, dan pesanan dibuat tanpa baris `Payment`.

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-01 â€” Create Order (Guest Checkout) |
| Modul | MOD-ORDER |
| Tujuan | Guest checkout tanpa registrasi, dengan OTP verification |
| Aktor utama | Guest |
| Status | Terimplementasi (PH-03) |
| Referensi PRD | PRD 3.1.C (Checkout & Order), PRD 5.1 (Stock Management), PRD 5.7 (Guest Checkout) |
| Referensi SDD | SDD 4.4 (MOD-ORDER), Order schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Keranjang berisi minimal satu item terpilih, nomor HP guest terverifikasi (AUTH-01)
- **Pemicu:** Klik "Checkout" dari halaman keranjang
- **Titik masuk:** Halaman keranjang `/cart` â†’ `/checkout`
- **Jika tidak terpenuhi:** Keranjang kosong atau tidak ada item terpilih â†’ kembali ke `/cart`; nomor belum terverifikasi â†’ tampilkan langkah OTP

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Guest (nomor terverifikasi) | Buat pesanan | Pesanannya sendiri | - |
| Guest (nomor belum terverifikasi) | Tidak ada | Tidak ada | Tampilkan verifikasi OTP |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| variantIds | String[] | Ya | 1..50 UUID, semuanya harus ada di keranjang pemanggil | "Pilih minimal satu produk" |
| guestPhone | String | Ya (guest) | Format +62xxx **dan** sudah diverifikasi lewat OTP | "Nomor HP belum diverifikasi" |
| guestEmail | String | Tidak | Valid email format | "Email tidak valid" |
| shippingAddress | JSON | Ya | name, phone, street, city, province, postalCode | "Alamat lengkap wajib diisi" |
| destinationId | String | Ya | ID kecamatan hasil pencarian tujuan; **sumber ongkir sekaligus sumber `city`/`province`/`postalCode`** yang diisi otomatis di UI | "Tujuan wajib dipilih" |
| courierCode, service | String | Ya | `courierCode` + `service` harus cocok dengan salah satu opsi hasil hitung server | "Metode pengiriman tidak valid" |
| voucherCodes | String[] | Tidak | **Terimplementasi (PH-05, VOUCH-01)**; maks 2 kode, dihitung ulang server-side | - |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Guest pilih item di `/cart` lalu klik "Checkout" | Halaman `/checkout` dibuka dengan daftar `variantIds` terpilih | Form checkout tampil |
| 2 | Guest verifikasi nomor HP (bila belum) | `POST /api/otp/send` lalu `POST /api/otp/verify` | Nomor ditandai terverifikasi di Redis |
| 3 | Guest pilih kecamatan tujuan | `GET /api/shipping/cities?search=...` | `city`/`province`/`postalCode` terisi otomatis (read-only); alamat lengkap + email (opsional) diisi manual |
| 4 | Guest hitung ongkir dan pilih kurir | `POST /api/shipping` untuk item terpilih | Opsi kurir dan biaya tampil |
| 5 | Guest klik "Buat Pesanan" | `POST /api/orders/create`: kurangi stok (reservasi), buat Order + OrderItem, hapus item terpilih dari keranjang | Pesanan dibuat (Waiting Payment) |
| 6 | System | Tampilkan konfirmasi berisi nomor pesanan dan tautan lacak | Nomor pesanan dan tautan `/track-order` |

### 6. Output dan perubahan data

- **Hasil:** Pesanan dibuat, stok tereservasi, nomor pesanan terbit
- **Data dibaca:** Keranjang (item terpilih), berat varian, harga live varian, tarif ongkir
- **Data dibuat:** Order, OrderItem (snapshot nama produk, nama varian, SKU, harga, berat)
- **Data diubah:** `ProductVariant.stock` dan `Product.totalStock` (turun), keranjang (item terpilih dihapus)
- **Kondisi akhir:** Order status = WAITING_PAYMENT, `stockReservedUntil` = 10 menit
- **Nomor pesanan:** `FS-YYYYMMDD-XXXXXX` (tanggal Asia/Jakarta + 6 karakter acak huruf/angka kapital), unik; dibuat ulang bila bentrok
- **Efek samping:** Tidak ada email (ditunda ke PH-05)
- **Setelah reload:** Pesanan tetap ada; guest bisa lacak lewat nomor pesanan + nomor HP

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Batalkan checkout | Kembali ke keranjang | Tidak ada pesanan dibuat |
| Stok berkurang saat pembuatan pesanan | Tampilkan galat, batalkan seluruh perubahan stok pada transaksi itu | Tidak ada pesanan dibuat |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Nomor HP belum diverifikasi | `403 PHONE_NOT_VERIFIED` "Verifikasi nomor HP terlebih dahulu" | Tampilkan langkah OTP |
| Tidak ada item terpilih | `400 VALIDATION_ERROR` "Pilih minimal satu produk" | Kembali ke `/cart` |
| Item terpilih tidak ada di keranjang | `404 VARIANT_NOT_FOUND` "Produk tidak ditemukan" | Muat ulang `/cart` |
| Stok tidak cukup | `400 INSUFFICIENT_STOCK` "Stok produk X tidak cukup" | Perbarui keranjang; tidak ada pesanan dibuat |
| Produk tidak aktif | `400 PRODUCT_INACTIVE` "Produk tidak tersedia" | Keluarkan item dari pilihan |
| Kurir tidak cocok hasil hitung server | `400 INVALID_SHIPPING_METHOD` "Metode pengiriman tidak valid" | Hitung ulang ongkir |
| Ongkir gagal dihitung | Tarif flat Rp10.000 dipakai (SDD section 9) | Pesanan tetap bisa dibuat |
| Voucher tidak valid | **Ditunda ke PH-05** | - |
| Pembayaran gagal dibuat | **Ditunda ke PH-04** | - |

### 9. Perilaku UI

- **Halaman:** `/checkout`
- **Elemen:** Verifikasi nomor HP (bila belum), email (opsional), form alamat, pemilih tujuan dan kurir, ringkasan pesanan, tombol "Buat Pesanan"

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Form aktif | Isi lalu kirim |
| Menghitung ongkir | Spinner di bagian ongkir | Tunggu |
| Membuat pesanan | Spinner, tombol nonaktif | Tunggu |
| Pesanan dibuat | Halaman konfirmasi berisi nomor pesanan dan tautan lacak | Catat nomor pesanan |
| Galat | Pesan galat | Perbaiki lalu coba lagi |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ORDER-01-01 | Guest, keranjang berisi, nomor HP terverifikasi | Isi form, buat pesanan | Pesanan dibuat (WAITING_PAYMENT), stok berkurang |
| AC-ORDER-01-02 | Guest, nomor HP belum terverifikasi | Buat pesanan | `403 PHONE_NOT_VERIFIED`, tampil langkah OTP |
| AC-ORDER-01-03 | Guest | Buat pesanan memakai voucher | **Lulus (PH-05, VOUCH-01)** |
| AC-ORDER-01-04 | Guest | Buat pesanan saat stok tidak cukup | `400 INSUFFICIENT_STOCK`, tidak ada pesanan, stok tidak berubah |
| AC-ORDER-01-05 | Guest mengisi email | Buat pesanan | **Lulus (PH-05, NOTIF-01)**; email disimpan di pesanan + email konfirmasi dikirim bila `RESEND_API_KEY` ada |
| AC-ORDER-01-06 | Pesanan dibuat, melewati masa bayar (`XENDIT_INVOICE_DURATION`) tanpa pembayaran | Buka riwayat atau lacak pesanan | Reservasi dilepas, stok kembali, status CANCELED |
| AC-ORDER-01-07 | Hanya sebagian item dicentang di `/cart` | Buat pesanan | Hanya item tercentang menjadi OrderItem; item tercentang dihapus dari keranjang, sisanya tetap |
| AC-ORDER-01-08 | Klien mengirim biaya ongkir sendiri di body | Buat pesanan | Biaya dari klien diabaikan; server memakai hasil hitung ulang kurir + layanan terpilih |
| AC-ORDER-01-09 | Dua permintaan bersamaan untuk varian berstok 1 | Keduanya diproses | Hanya satu berhasil; yang lain `400 INSUFFICIENT_STOCK` (tanpa overselling) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | phone `+628123456789` terverifikasi, alamat lengkap, kurir `jne`/`REG`, 1 varian terpilih | Pesanan dibuat, stok turun 1 | AC-ORDER-01-01 |
| Belum verifikasi | `guestPhone` belum diverifikasi | `403 PHONE_NOT_VERIFIED` | AC-ORDER-01-02 |
| Sebagian dipilih | Keranjang 3 item, 1 dicentang | 1 OrderItem; 2 item tetap di keranjang | AC-ORDER-01-07 |
| Voucher | `voucherCodes: ["DISKON10"]` | Ditunda ke PH-05 | AC-ORDER-01-03 |

### 12. Batas fitur

- **Termasuk:** Guest checkout, verifikasi OTP, pemilihan item, reservasi stok, ongkir dari berat varian
- **Tidak termasuk:** Pembayaran (PH-04), voucher (PH-05), email konfirmasi (PH-05), alamat tersimpan (PH-07), re-order
- **Ketergantungan:** AUTH-01 (OTP), MOD-CART, MOD-SHIP

### 13. Pertanyaan terbuka

- Pelepasan reservasi 10 menit memakai **pelepasan malas**: diperiksa saat ada permintaan yang membaca pesanan, bukan lewat penjadwal. Alasan: Vercel Cron di paket Hobby hanya berjalan harian sehingga tidak cocok untuk batas 10 menit, sedangkan pelepasan malas tidak butuh infrastruktur tambahan dan tetap idempoten. Rincian: `docs/04` bagian 6.
- **Selesai di PH-04:** batas reservasi kini sama dengan masa bayar invoice Xendit, diambil dari env `XENDIT_INVOICE_DURATION` (detik). Saat pembayaran dibuat, `stockReservedUntil` diselaraskan ke `expiry_date` invoice sehingga stok tidak dilepas saat pembeli masih bisa membayar.
- Stok dikurangi saat pesanan dibuat lalu dikembalikan saat reservasi kedaluwarsa. PH-04 tidak perlu mengurangi stok lagi saat pembayaran berhasil â€” cukup mengubah status pesanan.

---

## <a name="order-02"></a>ORDER-02 â€” Create Order (Customer)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-02 â€” Create Order (Customer) |
| Modul | MOD-ORDER |
| Tujuan | Customer yang sudah login membuat pesanan tanpa verifikasi OTP (sudah terautentikasi) |
| Aktor utama | Customer |
| Status | Terimplementasi (PH-03) |
| Referensi PRD | PRD 3.1.C (Checkout & Order), PRD 5.1 (Stock Management) |
| Referensi SDD | SDD 4.4 (MOD-ORDER), Order schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login, keranjang berisi minimal satu item terpilih
- **Pemicu:** Klik "Checkout" dari `/cart`
- **Titik masuk:** `/cart` â†’ `/checkout`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`; tidak ada item terpilih â†’ kembali ke `/cart`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Customer (login) | Buat pesanan | Pesanannya sendiri | - |
| Store Admin (login) | Buat pesanan | Tidak ada | `403 FORBIDDEN` (hanya customer dan guest yang berbelanja; admin diarahkan ke `/admin`) |
| Guest tanpa sesi | Buat pesanan | - | `401 UNAUTHORIZED` (pakai jalur ORDER-01) |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| variantIds | String[] | Ya | 1..50 UUID, semuanya ada di keranjang pemanggil | "Pilih minimal satu produk" |
| shippingAddress | JSON | Ya | name, phone, street, city, province, postalCode | "Alamat lengkap wajib diisi" |
| destinationId | String | Ya | ID kecamatan hasil pencarian tujuan | "Tujuan wajib dipilih" |
| courierCode, service | String | Ya | `courierCode` + `service` harus cocok dengan salah satu opsi hasil hitung server | "Metode pengiriman tidak valid" |
| guestPhone, guestEmail | - | Tidak | Tidak dipakai di jalur ini (kontak diambil dari akun dan alamat) | - |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Customer pilih item di `/cart` lalu klik "Checkout" | Halaman `/checkout` dibuka dengan daftar `variantIds` terpilih | Form checkout tampil, nama dan email terisi dari akun |
| 2 | Customer isi alamat | Validasi Zod | Data valid |
| 3 | Customer pilih tujuan dan kurir | `POST /api/shipping` untuk item terpilih | Opsi kurir dan biaya tampil |
| 4 | Customer klik "Buat Pesanan" | `POST /api/orders/create`: kurangi stok (reservasi), buat Order + OrderItem, hapus item terpilih dari keranjang | Pesanan dibuat (Waiting Payment) |
| 5 | System | Tampilkan halaman konfirmasi | Nomor pesanan + tautan `/orders/[id]` |

### 6. Output dan perubahan data

- **Hasil:** Pesanan terhubung ke akun (`Order.userId` terisi), stok tereservasi, nomor pesanan terbit
- **Data dibaca:** Keranjang customer, berat varian, harga live varian, tarif ongkir
- **Data dibuat:** Order, OrderItem (snapshot)
- **Data diubah:** `ProductVariant.stock` dan `Product.totalStock` (turun), `cart_items` (baris terpilih dihapus)
- **Kondisi akhir:** Order status = WAITING_PAYMENT, `stockReservedUntil` = 10 menit
- **Setelah reload:** Pesanan muncul di `/orders` (ORDER-03)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Keranjang juga berisi item yang tidak dicentang | Item itu tidak ikut ke pesanan dan tetap di keranjang | Pesanan hanya berisi item terpilih |
| Ongkir gagal dihitung | Fallback tarif flat Rp10.000 | Pesanan tetap bisa dibuat |
| Sesi berakhir saat mengisi form | `401 UNAUTHORIZED` | Alihkan ke `/login`, keranjang tetap utuh |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` | Alihkan ke `/login` |
| Tidak ada item terpilih | `400 VALIDATION_ERROR` "Pilih minimal satu produk" | Kembali ke `/cart` |
| Item terpilih tidak ada di keranjang | `404 VARIANT_NOT_FOUND` | Muat ulang `/cart` |
| Stok tidak cukup | `400 INSUFFICIENT_STOCK` | Perbarui keranjang; tidak ada pesanan |
| Produk tidak aktif | `400 PRODUCT_INACTIVE` | Keluarkan item dari pilihan |
| Kurir tidak cocok hasil hitung server | `400 INVALID_SHIPPING_METHOD` | Hitung ulang ongkir |

### 9. Perilaku UI

- **Halaman:** `/checkout`
- **Elemen:** Nama dan email dari akun (read-only), form alamat, pemilih tujuan dan kurir, ringkasan pesanan, tombol "Buat Pesanan"

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Form aktif | Isi lalu kirim |
| Membuat pesanan | Spinner, tombol nonaktif | Tunggu |
| Pesanan dibuat | Alihkan ke `/orders/[id]` | Lihat detail pesanan |
| Galat | Pesan galat | Perbaiki lalu coba lagi |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ORDER-02-01 | Customer login, keranjang berisi item terpilih | Buat pesanan | Pesanan dibuat, `userId` terisi, stok turun |
| AC-ORDER-02-02 | Tanpa sesi | Panggil `POST /api/orders/create` | `401 UNAUTHORIZED` |
| AC-ORDER-02-03 | Customer login | Buka `/orders` | Pesanannya muncul di daftar |
| AC-ORDER-02-04 | Customer A login | Buka pesanan milik customer B | `404 NOT_FOUND` (bukan `403`, agar keberadaan pesanan tidak bocor) |
| AC-ORDER-02-05 | Customer login, item terpilih dihapus dari keranjang oleh tab lain | Buat pesanan | `404 VARIANT_NOT_FOUND`, tidak ada pesanan |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | Customer login, 1 varian terpilih, alamat lengkap, kurir `jne`/`REG` | Pesanan dibuat | AC-ORDER-02-01 |
| Tanpa sesi | Cookie sesi dihapus | `401 UNAUTHORIZED` | AC-ORDER-02-02 |
| Pesanan orang lain | ID pesanan customer lain | `404 NOT_FOUND` | AC-ORDER-02-04 |

### 12. Batas fitur

- **Termasuk:** Checkout customer, pemilihan item, reservasi stok, ongkir dari berat varian
- **Tidak termasuk:** Alamat tersimpan (PH-07), pembayaran (PH-04), voucher (PH-05), email (PH-05)
- **Ketergantungan:** MOD-AUTH (sesi), MOD-CART, MOD-SHIP, ORDER-01 (logika pembuatan pesanan yang sama)

### 13. Pertanyaan terbuka

- **Diperbarui 2026-10-10:** alamat tersimpan (maks 5, PRD 5.8) kini punya fase â€” **PH-07 Customer Management** (`docs/04` bagian 12). Sampai fase itu selesai, alamat tetap diisi per pesanan dan disimpan sebagai `shippingAddress` (JSON) di Order, sesuai SDD 6.2.

---

## <a name="order-03"></a>ORDER-03 â€” Order History

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-03 â€” Order History |
| Modul | MOD-ORDER |
| Tujuan | Customer melihat daftar dan detail pesanannya sendiri |
| Aktor utama | Customer |
| Status | Terimplementasi (PH-03) |
| Referensi PRD | PRD 3.1.C (Checkout & Order), PRD 3.1.H (Order Tracking) |
| Referensi SDD | SDD 4.4 (MOD-ORDER), SDD 4.8 (MOD-CUST) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login
- **Pemicu:** Buka `/orders` atau tautan "Pesanan Saya" di menu pengguna
- **Titik masuk:** `/orders`, `/orders/[id]`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Customer login | Lihat daftar dan detail | Hanya pesanan miliknya | - |
| Customer lain | Lihat detail pesanan orang lain | - | `404 NOT_FOUND` |
| Guest tanpa sesi | Lihat riwayat | - | Alihkan ke `/login` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| id (di `/orders/[id]`) | UUID | Ya | Harus UUID valid dan milik pemanggil | `404` halaman tidak ditemukan |
| page | number | Tidak | >= 1, default 1 | - |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Customer buka `/orders` | Lepas reservasi kedaluwarsa, lalu baca pesanan miliknya (terbaru dulu) | Daftar pesanan tampil |
| 2 | Customer klik satu pesanan | Baca pesanan + OrderItem miliknya | Detail tampil (item, alamat, ongkir, total, status) |
| 3 | System | Tampilkan label status bahasa Indonesia dan tanggal (Asia/Jakarta) | Status terbaca |

### 6. Output dan perubahan data

- **Hasil:** Daftar dan detail pesanan
- **Data dibaca:** Order, OrderItem milik pemanggil
- **Data diubah:** Status pesanan kedaluwarsa â†’ CANCELED beserta pengembalian stok (pelepasan malas)
- **Kondisi akhir:** Tidak ada perubahan lain
- **Setelah reload:** Data tetap sama

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Belum ada pesanan | Tampilkan ajakan belanja | Halaman kosong yang informatif |
| Pesanan sudah kedaluwarsa | Status CANCELED setelah pelepasan malas | Stok sudah kembali |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | Alihkan ke `/login` | - |
| ID bukan UUID atau bukan miliknya | Halaman `404` | Kembali ke `/orders` |

### 9. Perilaku UI

- **Halaman:** `/orders`, `/orders/[id]`
- **Elemen:** Daftar pesanan (nomor, tanggal, status, total), tautan detail, detail item dan alamat

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Ada pesanan | Daftar berisi kartu pesanan | Buka detail |
| Tidak ada | Pesan "Belum ada pesanan" + tautan ke `/products` | Belanja |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ORDER-03-01 | Customer punya pesanan | Buka `/orders` | Pesanan tampil, terbaru di atas |
| AC-ORDER-03-02 | Customer punya pesanan | Buka `/orders/[id]` miliknya | Detail lengkap tampil |
| AC-ORDER-03-03 | Customer A | Buka `/orders/[id]` milik customer B | `404` |
| AC-ORDER-03-04 | Tanpa sesi | Buka `/orders` | Dialihkan ke `/login` |
| AC-ORDER-03-05 | Pesanan melewati masa bayar (`XENDIT_INVOICE_DURATION`, belum dibayar) | Buka `/orders` | Status CANCELED, stok sudah kembali |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Ada pesanan | 1 pesanan WAITING_PAYMENT | Tampil di daftar | AC-ORDER-03-01 |
| Milik orang lain | ID pesanan customer lain | `404` | AC-ORDER-03-03 |
| Kedaluwarsa | `stockReservedUntil` terlewat | CANCELED + stok kembali | AC-ORDER-03-05 |

### 12. Batas fitur

- **Termasuk:** Daftar dan detail pesanan customer, pelepasan malas reservasi
- **Tidak termasuk:** Riwayat untuk guest (pakai ORDER-04), pembatalan (ORDER-05, PH-06), lacak pesanan (ORDER-08, PH-06), invoice (PH-05), pembayaran (PH-04), re-order (ORDER-03B). Tombol "Lacak Pesanan" dan "Batalkan Pesanan" di daftar sudah berfungsi (sejak PH-07) menautkan ke `/orders/[id]/tracking` dan `/orders/[id]`
- **Ketergantungan:** ORDER-01/ORDER-02 (data pesanan), MOD-AUTH (sesi)

### 13. Pertanyaan terbuka

Tidak ada.

---

## <a name="order-04"></a>ORDER-04 â€” Track Order (Public)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-04 â€” Track Order (Public) |
| Modul | MOD-ORDER |
| Tujuan | Guest melacak pesanannya tanpa akun, memakai nomor pesanan + nomor HP |
| Aktor utama | Guest |
| Status | Terimplementasi (PH-03) |
| Referensi PRD | PRD 3.1.H (Order Tracking), PRD 5.7 (Guest Checkout) |
| Referensi SDD | SDD 4.4 (MOD-ORDER) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada pesanan dengan nomor pesanan dan nomor HP yang cocok
- **Pemicu:** Buka `/track-order`, isi nomor pesanan + nomor HP
- **Titik masuk:** `/track-order`, `POST /api/orders/track`
- **Jika tidak terpenuhi:** Tampilkan pesan generik (tidak membedakan "nomor salah" dan "pesanan tidak ada")

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Guest | Lacak pesanan | Pesanan dengan nomor + HP yang cocok | - |
| Customer login | Lacak pesanan | ORDER-08 (Terimplementasi): `/track-order` tampilkan daftar pesanan dalam perjalanan tanpa input; tombol Lacak di `/orders` arah ke `/orders/[id]/tracking` | - |
| Siapa pun dengan nomor pesanan tanpa HP yang cocok | Lacak pesanan | - | `404 NOT_FOUND` pesan generik |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| orderNumber | String | Ya | Format `FS-YYYYMMDD-XXXXXX` | "Nomor pesanan tidak valid" |
| phone | String | Ya | Format +62xxx | "Nomor HP tidak valid" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Guest isi nomor pesanan dan nomor HP | `POST /api/orders/track` | Permintaan diproses |
| 2 | System | Lepas reservasi kedaluwarsa, lalu cari pesanan: nomor cocok **dan** (`guestPhone` cocok **atau** `User.phone` cocok) | Pesanan ditemukan |
| 3 | System | Kembalikan status, ringkasan item, ongkir, alamat ringkas, tanggal | Hasil lacak tampil |

### 6. Output dan perubahan data

- **Hasil:** Status pesanan dan ringkasannya
- **Data dibaca:** Order, OrderItem
- **Data diubah:** Status pesanan kedaluwarsa â†’ CANCELED beserta pengembalian stok (pelepasan malas)
- **Kondisi akhir:** Tidak ada perubahan lain
- **Setelah reload:** Hasil lacak tidak disimpan di klien; isi ulang bila perlu

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Nomor pesanan benar, nomor HP salah | Pesan generik | `404 NOT_FOUND` |
| Pesanan sudah kedaluwarsa | Status CANCELED | Stok sudah kembali |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Format tidak valid | `400 VALIDATION_ERROR` | Perbaiki isian |
| Tidak cocok | `404 NOT_FOUND` "Pesanan tidak ditemukan" | Periksa kembali nomor pesanan dan HP |
| Terlalu banyak percobaan | `429 RATE_LIMITED` "Terlalu banyak percobaan, coba lagi nanti" | Tunggu |

### 9. Perilaku UI

- **Halaman:** `/track-order`
- **Elemen:** Input nomor pesanan, input nomor HP, tombol "Lacak", kartu hasil (status, item, ongkir, alamat, tanggal)

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Form aktif | Isi lalu kirim |
| Ditemukan | Kartu hasil tampil | - |
| Tidak ditemukan | Pesan generik | Perbaiki isian |
| Rate limited | Pesan tunggu | Tunggu |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ORDER-04-01 | Pesanan guest ada | Isi nomor pesanan + nomor HP yang benar | Status dan ringkasan tampil |
| AC-ORDER-04-02 | Pesanan guest ada | Isi nomor pesanan benar, nomor HP salah | `404` pesan generik (tidak membocorkan keberadaan pesanan) |
| AC-ORDER-04-03 | - | Isi format tidak valid | `400 VALIDATION_ERROR` |
| AC-ORDER-04-04 | - | Kirim > 10 permintaan dalam 10 menit | `429 RATE_LIMITED` |
| AC-ORDER-04-05 | Pesanan customer (login) | Isi nomor pesanan + nomor HP akun | Pesanan ditemukan (cocok lewat `User.phone`) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Ditemukan | `FS-20261010-AB12CD` + `+628123456789` | Status tampil | AC-ORDER-04-01 |
| Tidak cocok | Nomor pesanan benar, HP salah | `404` generik | AC-ORDER-04-02 |
| Berulang | 11 permintaan cepat | `429` | AC-ORDER-04-04 |

### 12. Batas fitur

- **Termasuk:** Lacak pesanan publik dengan nomor pesanan + HP, pembatasan percobaan
- **Tidak termasuk:** Lacak posisi kurir (SHIP-02), ubah data pesanan, halaman detail tracking customer (pulih di ORDER-08: `/orders/[id]/tracking`)
- **Ketergantungan:** ORDER-01/ORDER-02 (data pesanan), Redis (pembatasan percobaan)

### 13. Pertanyaan terbuka

- Pembatasan percobaan memakai penghitung per alamat IP di Redis (`track:limit:{ip}`, 10 percobaan / 10 menit). Alamat IP diambil dari header `x-forwarded-for` yang diisi proxy platform; di dev nilainya bisa kosong, sehingga pembatasan dilewati secara aman.

---

## <a name="pay-01"></a>PAY-01 â€” Create Payment (Xendit)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PAY-01 â€” Create Payment (Xendit) |
| Modul | MOD-PAY |
| Tujuan | Generate payment invoice via Xendit untuk order |
| Aktor utama | System (triggered after order creation) |
| Status | Terimplementasi (PH-04) |
| Referensi PRD | PRD 3.1.D (Payment), PRD 7.1 (Payment Gateway) |
| Referensi SDD | SDD 4.5 (MOD-PAY), SDD 6.2 (Payment schema) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Pesanan dibuat dengan status WAITING_PAYMENT
- **Pemicu:** Tombol "Bayar Sekarang" (detail pesanan / layar sukses checkout)
- **Titik masuk:** `POST /api/payments/create`
- **Jika tidak terpenuhi:** Pembayaran tidak dibuat

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Customer (sesi) | Buat pembayaran | Pesanan miliknya | `403` bila bukan pemilik |
| Guest (nomor HP) | Buat pembayaran | Pesanan dengan `guestPhone` sama | `403` bila nomor tidak cocok |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| orderId | UUID | Ya | Pesanan ada, pemilik cocok, status = WAITING_PAYMENT | "Pesanan tidak ditemukan" |
| phone | String | Guest | = `Order.guestPhone` (hanya pesanan guest) | "Anda tidak memiliki akses" |

Jumlah (`amount`) tidak diterima dari klien; server memakai `Order.total` (AC-ORDER-01-08).

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Klien panggil `POST /api/payments/create` | Validasi pesanan + otorisasi | Pesanan valid |
| 2 | Server | `POST /v2/invoices` ke Xendit (`invoice_duration` dari env) | Invoice dibuat |
| 3 | Server | Simpan `Payment` (`externalId` = nomor pesanan, status PENDING, `expiresAt`) | Payment tersimpan |
| 4 | Server | Selaraskan `Order.stockReservedUntil` = `expiry_date` invoice | Reservasi selaras |
| 5 | Server | Balas `invoiceUrl` | Klien dialihkan ke halaman Xendit |

### 6. Output dan perubahan data

- **Hasil:** Invoice Xendit dibuat, `invoiceUrl` dikembalikan
- **Data dibaca:** Order
- **Data dibuat:** Payment (externalId, invoiceId, invoiceUrl, status: PENDING, amount, expiresAt)
- **Kondisi akhir:** Payment exists, linked to order
- **Setelah reload:** Payment persists

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Xendit timeout/error | Tidak diulang otomatis | `502 PAYMENT_PROVIDER_ERROR`; klien bisa coba lagi |
| Payment sudah ada | Kembalikan `invoiceUrl` yang sama | Tidak ada duplikat (idempoten) |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Order not found | `404 ORDER_NOT_FOUND` "Pesanan tidak ditemukan" | Periksa orderId |
| Bukan pemilik / nomor guest tidak cocok | `403 FORBIDDEN` | Periksa sesi/nomor |
| Order not WAITING_PAYMENT | `409 ORDER_NOT_PAYABLE` "Pesanan sudah tidak menunggu pembayaran" | Tidak bisa dibuat |
| Xendit API error | `502 PAYMENT_PROVIDER_ERROR` "Gagal membuat pembayaran, coba lagi" | Ulangi |

### 9. Perilaku UI

- **Halaman:** tombol "Bayar Sekarang" di `/orders/[id]` (customer) dan layar sukses checkout (guest + customer).
- **Elemen:** tombol, batas waktu (`stockReservedUntil`), pesan galat.
- **Alur:** klik -> `POST /api/payments/create` -> dialihkan ke halaman invoice Xendit (hosted page menampilkan QRIS/VA/e-wallet).

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Loading | Tombol "Mengalihkan ke pembayaran..." | Tunggu |
| Created | Halaman invoice Xendit | Bayar |
| Error | Pesan galat, tombol bisa dicoba lagi | Ulangi |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PAY-01-01 | Pesanan WAITING_PAYMENT | Buat pembayaran | `200` + `invoiceUrl` Xendit |
| AC-PAY-01-02 | Pembayaran sudah ada | Buat ulang | `200`, `invoiceUrl` sama (idempoten) |
| AC-PAY-01-03 | Setelah dibuat | Reload halaman | Payment tetap ada; `expiresAt` = masa berlaku invoice |
| AC-PAY-01-04 | Pesanan sudah dibayar/dibatalkan | Buat pembayaran | `409 ORDER_NOT_PAYABLE` |
| AC-PAY-01-05 | Bukan pemilik (sesi lain / nomor guest tidak cocok) | Buat pembayaran | `403 FORBIDDEN` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | orderId valid, pemilik cocok | `200` + invoiceUrl | AC-PAY-01-01 |
| Idempoten | orderId sama dipanggil dua kali | invoiceUrl sama | AC-PAY-01-02 |
| Sudah dibayar | order.status: PROCESSING | `409` | AC-PAY-01-04 |

### 12. Batas fitur

- **Termasuk:** Create invoice Xendit (hosted page: QRIS/VA/e-wallet), idempotensi
- **Tidak termasuk:** Webhook (PAY-02), refund, pemilihan metode per-channel
- **Ketergantungan:** Xendit Invoice API v2, ORDER-01

### 13. Pertanyaan terbuka

- Pemilihan metode per-channel (QRIS/VA/e-wallet langsung, tanpa hosted page) ditunda. PH-04 memakai Invoice API; bila dibutuhkan, ganti ke `/v3/payment_requests`.
- Masa bayar diatur `XENDIT_INVOICE_DURATION` (detik). Nilai yang sama menjadi batas reservasi stok.

---

## <a name="pay-02"></a>PAY-02 â€” Webhook Handler (Xendit)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PAY-02 â€” Webhook Handler (Xendit) |
| Modul | MOD-PAY |
| Tujuan | Process Xendit webhook untuk update payment/order status |
| Aktor utama | Xendit (external) |
| Status | Terimplementasi (PH-04) |
| Referensi PRD | PRD 3.1.D (Payment), PRD 5.2 (Payment Rules) |
| Referensi SDD | SDD 4.5 (MOD-PAY), SDD 6.3 (webhook idempotency) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Payment dibuat, pembeli membayar (atau invoice kedaluwarsa)
- **Pemicu:** Xendit POST webhook (invoice callback)
- **Titik masuk:** `POST /api/webhooks/xendit`
- **Jika tidak terpenuhi:** N/A (eksternal)

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Xendit (token valid) | Kirim webhook | Semua pembayaran | `200` |
| Token tidak valid | Tidak ada | Tidak ada | `401` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan |
| --- | --- | --- | --- | --- |
| payload | JSON | Ya | Zod `xenditWebhookSchema` (`id`, `external_id`, `status`) | `400 INVALID_PAYLOAD` |
| x-callback-token | String (header) | Ya | Sama dengan `XENDIT_WEBHOOK_TOKEN` (perbandingan waktu-tetap) | `401 INVALID_CALLBACK_TOKEN` |
| external_id | String | Ya | Payment exists | `404 PAYMENT_NOT_FOUND` |
| status | String | Ya | PAID/SETTLED/EXPIRED | Status lain diabaikan (`200`) |

### 5. Alur berhasil (Payment Success)

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Xendit POST | Terima payload | Webhook diterima |
| 2 | Server | Verifikasi `x-callback-token` | Token valid |
| 3 | Server | Klaim baris `Payment` (PENDING -> PAID) | Idempoten |
| 4 | Server | Ubah `Order` (WAITING_PAYMENT -> PROCESSING) | Status berubah |
| 5 | Server | Balas `200` | Xendit berhenti kirim ulang |

Catatan: **stok tidak dikurangi di sini.** Stok sudah dipotong saat pesanan dibuat (PH-03); webhook PAID hanya mengubah status.

### 6. Output dan perubahan data

- **Hasil:** Status Payment/Order diperbarui. Stok tidak disentuh.
- **Data diubah:** Payment (status, paidAt), Order (status)
- **Kondisi akhir:** Payment = PAID, Order = PROCESSING, stok tetap (sudah dipotong saat pesanan dibuat)
- **Efek samping:** Tidak ada. Email ditunda ke PH-05 (NOTIF-01).

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| EXPIRED | Payment = EXPIRED, Order = CANCELED, stok dikembalikan | Stock released |
| Duplicate PAID | `200`, tidak diproses dua kali | No duplicate |
| Duplicate EXPIRED | `200`, idempoten | No duplicate |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Token salah | `401 INVALID_CALLBACK_TOKEN` | Xendit retry |
| Token belum dikonfigurasi | `503 WEBHOOK_NOT_CONFIGURED` | Log; isi `XENDIT_WEBHOOK_TOKEN` |
| Payment not found | `404 PAYMENT_NOT_FOUND` | Log error |
| Already processed | `200 ALREADY_PROCESSED` (no-op) | Stop retry |
| Payload tidak valid | `400 INVALID_PAYLOAD` | Log |
| DB fail | `500 INTERNAL_ERROR` | Xendit retry |

### 9. Perilaku UI

Tidak berlaku â€” background process.

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PAY-02-01 | Payment PENDING | Webhook PAID | Payment PAID, Order PROCESSING, stok TIDAK berubah |
| AC-PAY-02-02 | Payment PENDING | Webhook EXPIRED | Payment EXPIRED, Order CANCELED, stok dikembalikan |
| AC-PAY-02-03 | Payment PAID | Webhook PAID diulang | `200`, tidak diproses dua kali |
| AC-PAY-02-04 | Webhook | Token salah | `401` |
| AC-PAY-02-05 | Payment sukses | Kirim email | **Lulus (PH-05, NOTIF-01)** |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Success | {external_id: "FS-...", status: "PAID"}, token valid | Order PROCESSING | AC-PAY-02-01 |
| Duplicate | Webhook sama 2x | `200` keduanya, diproses sekali | AC-PAY-02-03 |

### 12. Batas fitur

- **Termasuk:** Webhook PAID/EXPIRED, verifikasi token, idempotensi, pelepasan stok saat EXPIRED
- **Tidak termasuk:** Refund webhook, email (PH-05)
- **Ketergantungan:** PAY-01, MOD-ORDER

### 13. Pertanyaan terbuka

- Idempotensi memakai klaim baris `Payment` di database (`updateMany` bersyarat), bukan penanda Redis. Redis hanya dipakai fitur lain (OTP, keranjang guest, pembatasan lacak).
- `404 PAYMENT_NOT_FOUND` membuat Xendit mengirim ulang webhook untuk pembayaran yang tidak dikenal. Dibiarkan sesuai tabel kondisi gagal; bisa diubah ke `200` bila kebisingan retry mengganggu.

---

## <a name="cust-01"></a>CUST-01 â€” Alamat Tersimpan

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CUST-01 â€” Alamat Tersimpan |
| Modul | MOD-CUST |
| Tujuan | Customer menyimpan alamat (maksimal 5) agar bisa dipilih saat checkout tanpa mengetik ulang |
| Aktor utama | Customer |
| Status | Terimplementasi (PH-07); UI dipisah ke `/profile/addresses` (alamat saja) di PH-10 |
| Referensi PRD | PRD 2.2 (Customer), PRD 4.8 (Customer Management), PRD 5.8 (Customer Address) |
| Referensi SDD | SDD 4.8 (MOD-CUST), SDD 6.2 (`shippingAddress`) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login dengan role Customer
- **Pemicu:** Buka `/profile`, atau memilih alamat tersimpan di `/checkout`
- **Titik masuk:** `/profile`, `/checkout`, `/api/customer/addresses`, `/api/customer/addresses/[id]`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`; role non-customer â†’ alihkan ke `/admin`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Customer login | Baca/tambah/ubah/hapus alamat | Hanya alamat miliknya (`userId` pemanggil) | - |
| Customer lain | Ubah/hapus alamat orang lain | - | `404 NOT_FOUND` |
| Store Admin | Akses API alamat | - | `403 FORBIDDEN` |
| Guest tanpa sesi | Akses API alamat | - | `401 UNAUTHORIZED` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| label | string | Ya | 1-50 karakter | `Label alamat wajib diisi` |
| recipientName | string | Ya | 1-100 karakter | `Nama penerima wajib diisi` |
| phone | string | Ya | Dinormalisasi ke `+62`, 8-11 digit | `Nomor HP tidak valid` |
| destinationId | string | Tidak | Maks 64 karakter (titik tujuan RajaOngkir) | - |
| province | string | Ya | 1-100 karakter | `Provinsi wajib diisi` |
| city | string | Ya | 1-100 karakter | `Kota/Kabupaten wajib diisi` |
| district | string | Tidak | Maks 100 karakter | - |
| subdistrict | string | Tidak | Maks 100 karakter | - |
| postalCode | string | Tidak | Maks 10 karakter | - |
| street | string | Ya | 1-500 karakter | `Alamat lengkap wajib diisi` |
| note | string | Tidak | Maks 500 karakter | - |
| isPrimary | boolean | Tidak | Default `false` | - |

Semua input divalidasi Zod **sebelum** query Prisma. `PATCH` menerima sebagian field (mis. hanya `isPrimary`) dan menolak body kosong (`Tidak ada perubahan`).

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Customer buka `/profile` | Baca alamat miliknya (utama dulu, lalu tertua) | Daftar alamat tampil |
| 2 | Klik "Tambah Alamat", isi form | `POST /api/customer/addresses` | `201`, alamat tersimpan |
| 3 | Pilih titik tujuan | Wilayah (provinsi/kota/kecamatan/kelurahan/kode pos) terisi otomatis dan read-only | Data wilayah konsisten |
| 4 | Klik "Ubah" pada satu alamat | `PATCH /api/customer/addresses/[id]` | `200`, alamat berubah |
| 5 | Klik "Jadikan Utama" | `PATCH` dengan `{ isPrimary: true }` | Hanya satu alamat utama |
| 6 | Klik "Hapus" lalu konfirmasi | `DELETE /api/customer/addresses/[id]` | `200`, alamat hilang |
| 7 | Buka `/checkout` | Pilih alamat tersimpan | Isian alamat + `destinationId` terisi otomatis |

### 6. Output dan perubahan data

- **Hasil:** Daftar alamat tersimpan; alamat terisi di form checkout
- **Data dibaca:** Address milik pemanggil
- **Data diubah:** Address (create/update/delete). `Order.shippingAddress` **tidak** berubah â€” pesanan lama tetap snapshot
- **Kondisi akhir:** Maksimal 5 alamat, tepat satu `isPrimary` selama masih ada alamat
- **Setelah reload:** Daftar alamat tetap sama

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Alamat pertama | Otomatis ditandai utama | `isPrimary = true` |
| Menandai alamat lain utama | Alamat utama lama dilepas | Tetap satu utama |
| Menghapus alamat utama | Alamat tertua berikutnya diangkat | Tetap satu utama (selama masih ada alamat) |
| Checkout dengan 1 alamat | Terisi otomatis saat halaman dibuka | Tanpa memilih |
| Checkout dengan >1 alamat | Pemilih "Alamat tersimpan" muncul | Customer memilih atau "Isi manual" |
| Memilih "Isi manual" | Isian alamat dikosongkan, identitas akun dipertahankan | Isi manual |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` / alihkan ke `/login` | - |
| Role bukan customer | `403 FORBIDDEN` / alihkan ke `/admin` | - |
| Alamat bukan milik pemanggil | `404 NOT_FOUND` | - |
| Alamat ke-6 | `409 LIMIT_REACHED` "Maksimal 5 alamat tersimpan" | Hapus salah satu |
| Input tidak valid | `400 VALIDATION_ERROR` + `field` | Perbaiki isian |

### 9. Perilaku UI

- **Halaman:** `/profile` (bagian "Alamat Tersimpan"), `/checkout` (pemilih alamat)
- **Elemen:** Kartu alamat (label, penanda "Utama", penerima, nomor HP, alamat lengkap, catatan), tombol Ubah/Jadikan Utama/Hapus, form tambah/ubah, pemilih alamat di checkout

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Belum ada alamat | "Belum ada alamat tersimpan" + tombol Tambah | Tambah alamat |
| Sudah 5 alamat | Tombol Tambah nonaktif + keterangan batas | Hapus dulu |
| Konfirmasi hapus | "Hapus alamat ini?" + Ya/Batal | Hapus atau batal |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-CUST-01-01 | Customer login | Tambah alamat valid | `201`, alamat tampil di `/profile` |
| AC-CUST-01-02 | Sudah ada 5 alamat | Tambah alamat ke-6 | `409 LIMIT_REACHED`, alamat tidak bertambah |
| AC-CUST-01-03 | Ada beberapa alamat | Tandai satu sebagai utama | Hanya satu `isPrimary` |
| AC-CUST-01-04 | Alamat utama dihapus | Hapus | Alamat tertua berikutnya menjadi utama |
| AC-CUST-01-05 | Customer A | Ubah/hapus alamat customer B | `404 NOT_FOUND` |
| AC-CUST-01-06 | Ada alamat tersimpan | Buka `/checkout` dan pilih alamat | Isian alamat + `destinationId` terisi |
| AC-CUST-01-07 | Pesanan lama sudah dibuat | Ubah/hapus alamat tersimpan | `Order.shippingAddress` tidak berubah |
| AC-CUST-01-08 | Guest tanpa sesi | Buka `/profile` | Dialihkan ke `/login` |
| AC-CUST-01-09 | Store Admin | Akses `/api/customer/addresses` | `403` |
| AC-CUST-01-10 | Belum ada alamat | Tambah alamat pertama | Otomatis menjadi utama |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Tambah valid | label "Rumah", Cilandak, Jakarta Selatan | Alamat tampil | AC-CUST-01-01 |
| Batas | 5 alamat lalu 1 lagi | `409` | AC-CUST-01-02 |
| Milik orang lain | `userId` berbeda | `404` | AC-CUST-01-05 |
| Checkout | Alamat dengan `destinationId` | Ongkir bisa dihitung tanpa memilih ulang | AC-CUST-01-06 |

### 12. Batas fitur

- **Termasuk:** CRUD alamat customer, batas 5, alamat utama tunggal, pemilihan alamat di checkout, preferensi wilayah dari titik tujuan
- **Tidak termasuk:** Alamat guest (tetap diisi per pesanan), buku alamat toko/pengirim, perubahan bentuk `Order.shippingAddress`, peta titik akurat
- **Ketergantungan:** MOD-AUTH (sesi), SHIP-01 (titik tujuan/ongkir), ORDER-01/ORDER-02 (checkout)

### 13. Pertanyaan terbuka

- Batas 5 alamat ditegakkan dengan `count` di dalam transaksi, bukan constraint unik di database (batas bersifat dinamis). Dua permintaan yang benar-benar bersamaan secara teoretis bisa lolos melewati batas; risiko dinilai rendah dan dicatat di sini.
- Alamat utama tidak bisa "dikosongkan" (hanya penanda `true` yang dihormati) supaya selalu ada satu alamat utama.
- **Direncanakan PH-10 (keputusan pengguna 2026-10-11):** halaman alamat berdiri sendiri di `/profile/addresses` dan hanya berisi alamat â€” tanpa info akun maupun preferensi notifikasi. Spesifikasi di atas tetap menggambarkan kondisi PH-07 sampai PH-10 dikerjakan; API `/api/customer/addresses` tidak berubah.

---

## <a name="cust-02"></a>CUST-02 â€” Preferensi Notifikasi

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CUST-02 â€” Preferensi Notifikasi |
| Modul | MOD-CUST |
| Tujuan | Customer memilih jenis email yang ingin diterima |
| Aktor utama | Customer |
| Status | Terimplementasi (PH-07); formulir dipindah ke dialog notifikasi di PH-10 |
| Referensi PRD | PRD 4.8 (Customer Management), PRD 4.9 (Notification) |
| Referensi SDD | SDD 4.8 (MOD-CUST), SDD 4.9 (MOD-NOTIF) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login Customer
- **Pemicu:** Buka `/profile` bagian "Preferensi Notifikasi"
- **Titik masuk:** `/profile`, `/api/customer/notification-preferences`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Customer login | Baca/ubah preferensi | Miliknya sendiri | - |
| Store Admin | Akses API preferensi | - | `403 FORBIDDEN` |
| Guest tanpa sesi | Akses API preferensi | - | `401 UNAUTHORIZED` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| orderConfirmation | boolean | Ya | - | `Data tidak valid` |
| paymentConfirmation | boolean | Ya | - | `Data tidak valid` |
| shippingUpdate | boolean | Ya | - | `Data tidak valid` |
| cancellationUpdate | boolean | Ya | - | `Data tidak valid` |
| refundUpdate | boolean | Ya | - | `Data tidak valid` |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Customer buka `/profile` | Baca preferensi (baris tersimpan atau nilai bawaan semua aktif) | Form preferensi tampil |
| 2 | Ubah centang, klik "Simpan Preferensi" | `PATCH /api/customer/notification-preferences` | `200`, preferensi tersimpan |
| 3 | Ada email transaksional keluar | Server memeriksa preferensi sebelum kirim | Email dilewati bila dimatikan |

### 6. Output dan perubahan data

- **Hasil:** Preferensi notifikasi tersimpan
- **Data dibaca:** NotificationPreference milik pemanggil
- **Data diubah:** NotificationPreference (upsert baris `userId`)
- **Kondisi akhir:** Baris tersimpan mengikuti pilihan; tanpa baris = semua aktif
- **Setelah reload:** Preferensi tetap sama

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Belum pernah menyimpan | Pakai nilai bawaan semua aktif tanpa menulis baris | Semua jenis dikirimi |
| Customer mematikan satu jenis | Jenis itu dilewati, jenis lain tetap | Sesuai pilihan |
| Guest (tanpa akun) | Tidak punya preferensi | Semua email tetap dikirim |
| Gagal membaca preferensi | Dianggap aktif, email tetap dikirim | Alur tidak terganggu |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` | Masuk dulu |
| Role bukan customer | `403 FORBIDDEN` | - |
| Input tidak lengkap | `400 VALIDATION_ERROR` | Perbaiki isian |

### 9. Perilaku UI

- **Halaman:** `/profile` (bagian "Preferensi Notifikasi")
- **Elemen:** Lima kotak centang (konfirmasi pesanan, konfirmasi pembayaran, info pengiriman, pembatalan, refund) + tombol Simpan

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Berhasil simpan | Pesan "Preferensi disimpan." | - |
| Gagal | Pesan galat | Coba lagi |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-CUST-02-01 | Customer belum pernah menyimpan | Buka `/profile` | Semua jenis aktif |
| AC-CUST-02-02 | Customer mematikan "Konfirmasi pesanan" | Pesanan baru dibuat | Email konfirmasi **tidak** dikirim |
| AC-CUST-02-03 | Customer mematikan "Konfirmasi pesanan" | Pembayaran berhasil | Email pembayaran tetap dikirim |
| AC-CUST-02-04 | Guest tanpa akun | Pesanan dibuat | Email tetap dikirim |
| AC-CUST-02-05 | Store Admin | Akses API preferensi | `403` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Bawaan | Tanpa baris | Semua aktif | AC-CUST-02-01 |
| Matikan satu | `orderConfirmation = false` | Email konfirmasi dilewati | AC-CUST-02-02 |
| Jenis lain | `paymentConfirmation = true` | Email pembayaran dikirim | AC-CUST-02-03 |

### 12. Batas fitur

- **Termasuk:** Preferensi lima jenis email transaksional pesanan, penegakan saat kirim
- **Tidak termasuk:** Preferensi SMS/WhatsApp, email akun (set/reset password) yang selalu dikirim, notifikasi admin
- **Ketergantungan:** MOD-NOTIF (NOTIF-01), MOD-AUTH (sesi)

### 13. Pertanyaan terbuka

- Email set/reset password tidak tunduk pada preferensi ini karena dianggap email keamanan akun yang diminta langsung oleh pengguna; dicatat sebagai keputusan.
- **Direncanakan PH-10 (keputusan pengguna 2026-10-11):** formulir lima kotak centang dipindah dari `/profile` ke dialog yang dibuka dari ikon notifikasi di navbar (NOTIF-02). API `/api/customer/notification-preferences` beserta aturan penegakannya di jalur kirim tidak berubah.

---

## <a name="auth-04"></a>AUTH-04 â€” Set Password (Guest â†’ Customer)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-04 â€” Set Password (Guest â†’ Customer) |
| Modul | MOD-AUTH |
| Tujuan | Guest yang mengisi email saat checkout bisa membuat akun customer lewat tautan set password |
| Aktor utama | Guest dengan email |
| Status | Terimplementasi (PH-07) |
| Referensi PRD | PRD 2.1 (Guest), PRD 2.2 (Customer), PRD 3.1.I, PRD 5.7 (Guest Checkout) |
| Referensi SDD | SDD 4.1 (MOD-AUTH), SDD 4.9 (MOD-NOTIF) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Pesanan guest dibuat dengan `guestEmail` terisi dan email belum terdaftar
- **Pemicu:** Pesanan guest selesai dibuat â†’ server mengirim email "Buat Password"
- **Titik masuk:** `/set-password?token=...`, `POST /api/auth/set-password`
- **Jika tidak terpenuhi:** Email sudah terdaftar â†’ email tidak dikirim

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Siapa pun dengan token | Buka `/set-password` | Token sebagai bukti | - |
| Token tanpa/tidak valid | Kirim password | - | `400 INVALID_TOKEN` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| token | string | Ya | 1-256 karakter, ada di Redis dan belum dipakai | `Tautan tidak valid atau sudah kedaluwarsa` |
| password | string | Ya | 8-72 karakter | `Password minimal 8 karakter` |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Guest checkout mengisi email | Server membuat token (TTL 24 jam) dan mengirim email | Email berisi tautan `/set-password?token=...` |
| 2 | Guest klik tautan | Halaman form password tampil | Isi password + konfirmasi |
| 3 | Kirim | `POST /api/auth/set-password` | Akun Customer dibuat, token dihapus |
| 4 | System | Ikat pesanan guest dengan `guestEmail` sama ke akun baru (`Order.userId`) | Riwayat pesanan tidak hilang |
| 5 | Guest masuk | Login dengan email + password | Akses `/orders`, `/profile` |

### 6. Output dan perubahan data

- **Hasil:** Akun Customer baru + tautan pesanan guest lama
- **Data dibaca:** Token (Redis), Order (`guestEmail`, `guestPhone`, `shippingAddress`)
- **Data diubah:** User (create, password bcrypt), Order.userId (guest lama diikat), token dihapus
- **Kondisi akhir:** Email terdaftar sebagai Customer, pesanan lama tampil di `/orders`
- **Setelah reload:** Sesi tetap sampai logout

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Email sudah terdaftar | Email set password tidak dikirim | Guest diarahkan login biasa |
| Token kedaluwarsa | `400 INVALID_TOKEN` | Minta tautan baru (buat pesanan baru / lupa password) |
| Token dipakai dua kali | Panggilan kedua `400 INVALID_TOKEN` | Token sekali pakai |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Token tidak ada/terpakai | `400 INVALID_TOKEN` | - |
| Email sudah terdaftar | `409 EMAIL_TAKEN` "Email sudah terdaftar, silakan masuk" | Masuk |
| Password tidak valid | `400 VALIDATION_ERROR` | Perbaiki isian |
| Halaman tanpa token | Pesan "Tautan tidak valid" | - |

### 9. Perilaku UI

- **Halaman:** `/set-password`
- **Elemen:** Form password + konfirmasi, pesan sukses + tautan ke `/login`

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Ada token | Form password | Simpan |
| Tanpa token | Pesan tautan tidak valid | Kembali ke login |
| Sukses | "Akun berhasil dibuat" | Masuk |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-AUTH-04-01 | Guest checkout mengisi email baru | Pesanan dibuat | Email "Buat Password" terkirim |
| AC-AUTH-04-02 | Token valid | Kirim password valid | Akun Customer dibuat, `201` |
| AC-AUTH-04-03 | Akun baru dibuat | Login | Bisa masuk, pesanan guest lama tampil di `/orders` |
| AC-AUTH-04-04 | Token sama | Dipakai dua kali | Panggilan kedua `400` |
| AC-AUTH-04-05 | Email sudah terdaftar | Pesanan guest dibuat | Email set password tidak dikirim |
| AC-AUTH-04-06 | Guest checkout tanpa email | Pesanan dibuat | Tidak ada email set password |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Email baru | `guest@contoh.com` | Email terkirim | AC-AUTH-04-01 |
| Token valid | token + password `Rahasia123` | Akun dibuat | AC-AUTH-04-02 |
| Token ganda | token dipakai 2x | `400` kedua | AC-AUTH-04-04 |

### 12. Batas fitur

- **Termasuk:** Token sekali pakai (Redis, TTL 24 jam), halaman set password, pembuatan akun Customer, pengikatan pesanan guest lama
- **Tidak termasuk:** Login otomatis setelah set password, penggabungan keranjang guest, migrasi alamat
- **Ketergantungan:** ORDER-01 (pesanan guest + `guestEmail`), MOD-NOTIF (Resend), MOD-AUTH

### 13. Pertanyaan terbuka

- Keputusan: pesanan guest lama dengan `guestEmail` yang sama **diikat** ke akun baru supaya riwayat tidak hilang (menjawab pertanyaan terbuka di `docs/04` bagian 12.1).
- Token disimpan di Redis, bukan tabel database; konsekuensinya token hilang bila cache dibersihkan, dan pengguna perlu meminta tautan baru.

---

## <a name="auth-05"></a>AUTH-05 â€” Reset Password

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-05 â€” Reset Password |
| Modul | MOD-AUTH |
| Tujuan | Customer yang lupa password bisa membuat password baru lewat tautan email |
| Aktor utama | Customer |
| Status | Terimplementasi (PH-07) |
| Referensi PRD | PRD 4.1 (Authentication), PRD 4.9 (Notification) |
| Referensi SDD | SDD 4.1 (MOD-AUTH), SDD 4.9 (MOD-NOTIF) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Punya akun Customer dengan email
- **Pemicu:** Klik "Lupa password?" di `/login`
- **Titik masuk:** `/forgot-password`, `/reset-password?token=...`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`
- **Jika tidak terpenuhi:** - (selalu dijawab sukses di tahap permintaan)

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Siapa pun | Minta tautan reset | - | `200` (selalu, tanpa membocorkan email) |
| Pemegang token | Set password baru | - | - |
| Token tanpa/tidak valid | Set password | - | `400 INVALID_TOKEN` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| email | string | Ya | Format email, maks 255, lowercase | `Email tidak valid` |
| token | string | Ya | 1-256 karakter, ada di Redis dan belum dipakai | `Tautan tidak valid atau sudah kedaluwarsa` |
| password | string | Ya | 8-72 karakter | `Password minimal 8 karakter` |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Customer isi email di `/forgot-password` | `POST /api/auth/forgot-password` | `200` selalu |
| 2 | System (email terdaftar, punya password, role Customer, tidak kena batas) | Buat token (TTL 1 jam) + kirim email | Email berisi tautan `/reset-password?token=...` |
| 3 | Customer klik tautan | Form password baru tampil | Isi password + konfirmasi |
| 4 | Kirim | `POST /api/auth/reset-password` | Password diperbarui (bcrypt), token dihapus |
| 5 | Customer masuk dengan password baru | Login | Berhasil |

### 6. Output dan perubahan data

- **Hasil:** Password akun diperbarui
- **Data dibaca:** User (email â†’ `id`, `role`), token (Redis)
- **Data diubah:** User.password (bcrypt), token dihapus
- **Kondisi akhir:** Password baru berlaku, token tidak bisa dipakai lagi
- **Setelah reload:** - (sesi lama tidak otomatis dibatalkan)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Email tidak terdaftar | Tetap jawab `200`, tidak kirim email | Keberadaan email tidak bocor |
| Email terdaftar tanpa password | Tidak kirim email | - |
| Melebihi batas (3 permintaan/email/jam) | Tetap `200`, tidak kirim email | Anti-spam kotak masuk |
| Token kedaluwarsa/terpakai | `400 INVALID_TOKEN` | Minta tautan baru |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Email tidak valid | `400 VALIDATION_ERROR` | Perbaiki isian |
| Token tidak valid | `400 INVALID_TOKEN` | Minta tautan baru |
| Password tidak valid | `400 VALIDATION_ERROR` | Perbaiki isian |

### 9. Perilaku UI

- **Halaman:** `/forgot-password`, `/reset-password`
- **Elemen:** Form email, form password + konfirmasi, pesan sukses, tautan ke `/login`

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Permintaan terkirim | "Bila email terdaftar, kami sudah mengirim tautan reset" | Cek email |
| Tanpa token | Pesan tautan tidak valid + tautan minta ulang | Minta ulang |
| Sukses reset | "Password berhasil diubah" | Masuk |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-AUTH-05-01 | Email terdaftar | Minta reset | `200`, email reset terkirim |
| AC-AUTH-05-02 | Email tidak terdaftar | Minta reset | `200`, tidak ada email |
| AC-AUTH-05-03 | Token valid | Set password baru | `200`, password berubah |
| AC-AUTH-05-04 | Password baru | Login | Berhasil |
| AC-AUTH-05-05 | Token sama | Dipakai dua kali | Panggilan kedua `400` |
| AC-AUTH-05-06 | Email sama | Minta reset 4x dalam 1 jam | Permintaan ke-4 tidak mengirim email, tetap `200` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Terdaftar | `customer@contoh.com` | Email terkirim | AC-AUTH-05-01 |
| Tidak terdaftar | `tidak@ada.com` | `200`, tanpa email | AC-AUTH-05-02 |
| Token ganda | token dipakai 2x | `400` kedua | AC-AUTH-05-05 |

### 12. Batas fitur

- **Termasuk:** Permintaan tautan (anti-enumerasi + batas 3/jam), token sekali pakai (Redis, TTL 1 jam), halaman set password baru
- **Tidak termasuk:** Reset lewat SMS/WhatsApp, pembatalan sesi lama, verifikasi identitas tambahan
- **Ketergantungan:** MOD-AUTH, MOD-NOTIF (Resend)

### 13. Pertanyaan terbuka

- Sesi lama tidak dibatalkan setelah reset password (strategi JWT tanpa daftar sesi). Dicatat sebagai keterbatasan; bisa ditambahkan versi token bila perlu.

---

## <a name="order-03b"></a>ORDER-03B â€” Re-order (lanjutan ORDER-03)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-03B â€” Re-order (lanjutan ORDER-03) |
| Modul | MOD-ORDER |
| Tujuan | Customer memesan lagi produk dari pesanan lama dengan satu klik |
| Aktor utama | Customer |
| Status | Terimplementasi (PH-07) |
| Referensi PRD | PRD 2.2 (Customer: Re-order), PRD 3.1.C (Checkout & Order) |
| Referensi SDD | SDD 4.4 (MOD-ORDER), SDD 4.2 (MOD-CART) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login Customer dan pesanan miliknya punya item
- **Pemicu:** Klik tombol "Pesan Lagi" di `/orders` atau `/orders/[id]`
- **Titik masuk:** `/orders`, `/orders/[id]`, `POST /api/orders/[id]/reorder`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ `401`; pesanan bukan miliknya â†’ `404`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Customer login | Pesan lagi | Hanya pesanan miliknya | - |
| Customer lain | Pesan lagi pesanan orang lain | - | `404 NOT_FOUND` |
| Store Admin | Akses API re-order | - | `403 FORBIDDEN` |
| Guest tanpa sesi | Akses API re-order | - | `401 UNAUTHORIZED` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| id (path) | UUID | Ya | UUID valid dan milik pemanggil | `404` `Pesanan tidak ditemukan` |

Tidak ada body. Kuantitas, harga, dan stok **selalu** diambil server dari data terkini, bukan dari pesanan lama.

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Customer klik "Pesan Lagi" | Baca pesanan + item miliknya | - |
| 2 | System | Tiap item divalidasi: varian ada, produk ACTIVE, stok > 0 | Item valid lanjut |
| 3 | System | Tambahkan ke keranjang (kuantitas dibatasi stok) | CartItem bertambah |
| 4 | Selesai | `200 { added, skipped[] }` | Pesan jumlah ditambahkan + tautan `/cart` |

### 6. Output dan perubahan data

- **Hasil:** Item ditambahkan ke keranjang
- **Data dibaca:** Order + OrderItem milik pemanggil, ProductVariant/Product (stok, status)
- **Data diubah:** CartItem (keranjang customer). **Tidak** ada Order baru, stok **tidak** berkurang di sini
- **Kondisi akhir:** Keranjang berisi item yang valid
- **Setelah reload:** Item tetap di keranjang

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Varian sudah tidak ada | Item dilewati | Masuk daftar `skipped` |
| Produk tidak ACTIVE | Item dilewati | Masuk daftar `skipped` |
| Stok 0 | Item dilewati | Masuk daftar `skipped` |
| Stok < kuantitas lama | Kuantitas disesuaikan ke stok tersisa | Masuk `skipped` dengan alasan |
| Sebagian valid | Item valid tetap ditambahkan | `added > 0`, sisanya dilaporkan |
| Semua dilewati | `400 NOTHING_ADDED` | Alasan pertama ditampilkan |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` | Masuk |
| Role bukan customer | `403 FORBIDDEN` | - |
| Pesanan bukan miliknya / ID bukan UUID | `404 NOT_FOUND` | - |
| Tidak ada item yang bisa ditambahkan | `400 NOTHING_ADDED` | Lihat alasan |

### 9. Perilaku UI

- **Halaman:** `/orders` (tombol pada kartu pesanan), `/orders/[id]` (tombol di bawah daftar item)
- **Elemen:** Tombol "Pesan Lagi"; setelah sukses, teks "{n} item ditambahkan" + tautan "Lihat keranjang" dan daftar alasan item yang dilewati

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Sukses | "n item ditambahkan" | Buka `/cart` |
| Sebagian dilewati | Daftar alasan per produk | - |
| Gagal | Pesan galat | Coba lagi |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ORDER-03-06 | Customer punya pesanan dengan varian tersedia | Klik "Pesan Lagi" | Item masuk keranjang, `200` |
| AC-ORDER-03-07 | Varian sudah dihapus/nonaktif | Klik "Pesan Lagi" | Item dilewati, alasan tampil, tidak ada pesanan baru |
| AC-ORDER-03-08 | Stok lebih kecil dari kuantitas lama | Klik "Pesan Lagi" | Kuantitas disesuaikan, alasan tampil |
| AC-ORDER-03-09 | Customer A | Re-order pesanan customer B | `404` |
| AC-ORDER-03-10 | Tanpa sesi | Akses API re-order | `401` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Tersedia | Pesanan 2 item stok cukup | 2 item masuk keranjang | AC-ORDER-03-06 |
| Varian hilang | Item dengan varian dihapus | Dilewati | AC-ORDER-03-07 |
| Stok kurang | Minta 3, stok 1 | 1 masuk, alasan tampil | AC-ORDER-03-08 |

### 12. Batas fitur

- **Termasuk:** Menambah item pesanan lama ke keranjang, validasi stok/status, laporan item dilewati
- **Tidak termasuk:** Membuat pesanan baru, menyalin voucher/ongkir/alamat, checkout otomatis
- **Ketergantungan:** ORDER-03 (data pesanan), CART-01 (add to cart), MOD-AUTH (sesi)

### 13. Pertanyaan terbuka

- Tidak ada. Pesanan lama tidak berubah sama sekali; seluruh validasi harga/stok diulang saat checkout (ORDER-01/ORDER-02).

---

## <a name="site-00"></a>SITE-00 â€” Akses Site Admin (role baru)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-00 â€” Akses Site Admin (role baru) |
| Modul | MOD-AUTH |
| Tujuan | Memisahkan peran level platform (Site Admin) dari level operasional toko (Store Admin) sesuai PRD 2.4 |
| Aktor utama | Site Admin |
| Status | Terimplementasi (PH-08) |
| Referensi PRD | PRD 1, PRD 2.4, PRD 3.1.K, PRD 4.1, PRD 4.12, kriteria sukses PRD #10 |
| Referensi SDD | SDD 6.2 (role enum), SDD 8 (kontrak API) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Akun ber-role `SITE_ADMIN` dibuat lewat seed (`SEED_SITE_ADMIN_EMAIL` / `SEED_SITE_ADMIN_PASSWORD`)
- **Pemicu:** Login di `/login`
- **Titik masuk:** `/site-admin`, `/api/site-admin/*`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Site Admin | Akses `/site-admin/*`, `/api/site-admin/*` | Seluruh konfigurasi platform | - |
| Site Admin | Akses `/admin/*` | - | Alihkan ke `/site-admin` |
| Store Admin | Akses `/site-admin/*` | - | Alihkan ke `/admin` |
| Customer | Akses `/site-admin/*` | - | Alihkan ke `/` |
| Guest | Akses `/site-admin/*` | - | Alihkan ke `/login` |
| Akun nonaktif | Login dan semua API terlindungi | - | Gagal (`401`) |

**Keputusan:** pemisahan ketat. SDD 8 menulis `GET /api/admin/products` boleh "Store Admin or Site Admin"; baris itu **tidak diadopsi** demi pemisahan PRD 2.4 (dicatat di `docs/04` bagian 10).

### 4. Input dan validasi

Tidak ada input. Role dan status aktif dibaca ulang dari database pada setiap permintaan yang dilindungi (bukan hanya dari JWT), supaya penonaktifan akun berlaku segera.

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Site Admin login di `/login` | Form membaca role dari sesi | Dialihkan ke `/site-admin` |
| 2 | Buka `/site-admin` | Layout memeriksa role + status aktif | Dasbor platform tampil |
| 3 | Panggil `/api/site-admin/*` | Guard memeriksa role + status aktif | `200` |

### 6. Output dan perubahan data

- **Hasil:** Akses ke area konfigurasi platform
- **Data dibaca:** User (`role`, `deactivatedAt`)
- **Data diubah:** Tidak ada
- **Kondisi akhir:** Site Admin hanya melihat area platform; Store Admin hanya area toko

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Store Admin sudah login, buka `/site-admin` | Dialihkan | Ke `/admin` |
| Site Admin sudah login, buka `/admin` | Dialihkan | Ke `/site-admin` |
| Customer/Guest buka area platform | Dialihkan | Ke `/` atau `/login` |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401` / alihkan ke `/login` | Masuk |
| Role tidak sesuai | `403` / alihkan | - |
| Akun dinonaktifkan | `401` (sesi lama ditolak pada permintaan berikutnya) | Hubungi Site Admin |

### 9. Perilaku UI

- **Halaman:** `/site-admin` (dasbor), `/site-admin/settings`, `/site-admin/payment`, `/site-admin/shipping`, `/site-admin/users`
- **Elemen:** Sidebar platform dengan penanda "Platform"; menu akun Site Admin

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Login Site Admin | Area platform, tanpa menu operasional toko | Kelola platform |
| Login Store Admin | Area toko, tanpa menu platform | Kelola toko |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-SITE-00-01 | Akun Site Admin | Login | Dialihkan ke `/site-admin` |
| AC-SITE-00-02 | Site Admin login | Buka `/admin` | Dialihkan ke `/site-admin` |
| AC-SITE-00-03 | Store Admin login | Buka `/site-admin` | Dialihkan ke `/admin` |
| AC-SITE-00-04 | Guest/Customer | Buka `/site-admin` | Dialihkan |
| AC-SITE-00-05 | Store Admin dinonaktifkan | Login / panggil `/api/admin/*` | Login gagal; API `401` |
| AC-SITE-00-06 | Pengunjung | Registrasi publik dengan role apa pun | Tidak bisa mendapat `SITE_ADMIN` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Login platform | `siteadmin@flexstore.local` | Masuk `/site-admin` | AC-SITE-00-01 |
| Salah area | Store Admin buka `/site-admin/users` | Dialihkan | AC-SITE-00-03 |
| Nonaktif | Store Admin dinonaktifkan | `401` | AC-SITE-00-05 |

### 12. Batas fitur

- **Termasuk:** Role `SITE_ADMIN`, area `/site-admin`, proteksi proxy + guard + layout, pemeriksaan status aktif dari database
- **Tidak termasuk:** Subdomain, multi-store, Site Admin mengelola operasional toko (produk/pesanan/voucher/laporan)
- **Ketergantungan:** MOD-AUTH (NextAuth), seed

### 13. Pertanyaan terbuka

- Site Admin belum bisa membuat/menonaktifkan sesama Site Admin (PRD 2.4 hanya menyebut kelola Store Admin); akun Site Admin dikelola lewat seed. Dicatat sebagai batas, bukan celah.

---

## <a name="site-01"></a>SITE-01 â€” Platform Settings

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-01 â€” Platform Settings |
| Modul | MOD-CONFIG |
| Tujuan | Site Admin mengatur perilaku level sistem: mode pemeliharaan dan status pendaftaran publik |
| Aktor utama | Site Admin |
| Status | Terimplementasi (PH-08) |
| Referensi PRD | PRD 2.4, PRD 4.12 |
| Referensi SDD | SDD 7 (MOD-CONFIG), SDD 8 (kontrak API) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login Site Admin
- **Pemicu:** Buka `/site-admin/settings`
- **Titik masuk:** `/site-admin/settings`, `GET`/`PATCH /api/site-admin/platform-settings`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`; role lain â†’ `403`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Site Admin | Baca/ubah pengaturan platform | - | - |
| Store Admin | Akses API | - | `403 FORBIDDEN` |
| Customer/Guest | Akses API | - | `401 UNAUTHORIZED` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| maintenanceMode | boolean | Ya | - | `Status pemeliharaan tidak valid` |
| maintenanceMessage | string | Tidak | Maks 300 karakter | `Pesan pemeliharaan maksimal 300 karakter` |
| registrationEnabled | boolean | Ya | - | `Status pendaftaran tidak valid` |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Site Admin buka `/site-admin/settings` | Baca baris `PlatformSetting` (atau nilai bawaan) | Form tampil |
| 2 | Ubah isian, klik Simpan | `PATCH /api/site-admin/platform-settings` | `200`, pengaturan tersimpan |
| 3 | Aktifkan pemeliharaan | Halaman toko menampilkan banner; pembuatan pesanan ditolak | `503 MAINTENANCE` |
| 4 | Matikan pendaftaran | `/register` menampilkan pemberitahuan; API registrasi ditolak | `403 REGISTRATION_DISABLED` |

### 6. Output dan perubahan data

- **Hasil:** Pengaturan platform tersimpan sebagai satu baris tetap (`id = "default"`)
- **Data dibaca:** PlatformSetting
- **Data diubah:** PlatformSetting (upsert)
- **Kondisi akhir:** Banner pemeliharaan dan/atau penutupan pendaftaran aktif
- **Setelah reload:** Pengaturan tetap sama

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Belum ada baris | Nilai bawaan dipakai tanpa menulis apa pun | Pemeliharaan mati, pendaftaran terbuka |
| Pemeliharaan aktif tapi pesan kosong | Pesan bawaan ditampilkan | Banner tetap tampil |
| Pemeliharaan aktif | Keranjang, lacak pesanan, dan invoice tetap bisa diakses | Hanya pembuatan pesanan baru ditolak |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` | Masuk |
| Role bukan Site Admin | `403 FORBIDDEN` | - |
| Input tidak valid | `400 VALIDATION_ERROR` | Perbaiki isian |
| Pesanan dibuat saat pemeliharaan | `503 MAINTENANCE` | Coba lagi nanti |
| Registrasi saat ditutup | `403 REGISTRATION_DISABLED` | Hubungi admin |

### 9. Perilaku UI

- **Halaman:** `/site-admin/settings` (form), `/register` (pemberitahuan), storefront (banner)
- **Elemen:** Dua sakelar (pemeliharaan, pendaftaran) + teks pesan pemeliharaan; banner di header storefront saat pemeliharaan aktif

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Pemeliharaan aktif | Banner peringatan di storefront | - |
| Pendaftaran ditutup | `/register` menampilkan "Pendaftaran sedang ditutup" | - |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-SITE-01-01 | Site Admin login | Simpan pengaturan valid | `200`, nilai tersimpan |
| AC-SITE-01-02 | Pemeliharaan aktif | Buat pesanan dari checkout | `503 MAINTENANCE` |
| AC-SITE-01-03 | Pemeliharaan aktif | Buka halaman toko | Banner pemeliharaan tampil |
| AC-SITE-01-04 | Pendaftaran ditutup | Registrasi customer | `403 REGISTRATION_DISABLED` |
| AC-SITE-01-05 | Pendaftaran ditutup | Buka `/register` | Pemberitahuan tampil |
| AC-SITE-01-06 | Store Admin | PATCH API pengaturan platform | `403` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Pemeliharaan | `{ maintenanceMode: true, maintenanceMessage: "Upgrade malam ini" }` | Banner tampil, order `503` | AC-SITE-01-02 |
| Tutup daftar | `{ registrationEnabled: false }` | Registrasi `403` | AC-SITE-01-04 |

### 12. Batas fitur

- **Termasuk:** Mode pemeliharaan (banner + penolakan pembuatan pesanan), status pendaftaran publik, penyimpanan baris `PlatformSetting`
- **Tidak termasuk:** Mematikan seluruh situs (pembacaan keranjang/lacak/invoice tetap jalan), penjadwalan pemeliharaan, halaman maintenance khusus
- **Ketergantungan:** SITE-00 (role), MOD-ORDER (penolakan pembuatan pesanan), MOD-AUTH (registrasi)

### 13. Pertanyaan terbuka

- Pemeliharaan tidak mengunci seluruh situs karena proxy (Edge) tidak bisa membaca database; yang ditegakkan adalah banner dan penolakan pembuatan pesanan. Bila kelak perlu kunci penuh, perlu flag di cache (Redis) yang bisa dibaca Edge.

---

## <a name="site-02"></a>SITE-02 â€” Payment Gateway Configuration (Xendit)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-02 â€” Payment Gateway Configuration (Xendit) |
| Modul | MOD-CONFIG |
| Tujuan | Site Admin mengatur perilaku pembayaran Xendit tanpa menyimpan rahasia di database |
| Aktor utama | Site Admin |
| Status | Terimplementasi (PH-08) |
| Referensi PRD | PRD 2.4, PRD 3.1.K, PRD 4.12 |
| Referensi SDD | SDD 7 (MOD-CONFIG), SDD 8, SDD 9 (integrasi Xendit) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login Site Admin
- **Pemicu:** Buka `/site-admin/payment`
- **Titik masuk:** `/site-admin/payment`, `GET`/`PATCH /api/site-admin/payment-settings`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`; role lain â†’ `403`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Site Admin | Baca/ubah konfigurasi pembayaran | - | - |
| Store Admin | Akses API | - | `403 FORBIDDEN` |
| Customer/Guest | Akses API | - | `401 UNAUTHORIZED` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| paymentEnabled | boolean | Ya | - | `Status pembayaran tidak valid` |
| paymentMode | enum | Ya | `SANDBOX` atau `PRODUCTION` | `Mode pembayaran tidak valid` |
| invoiceDurationSeconds | number | Ya | Bulat, 60-86400 | `Durasi invoice harus 60-86400 detik` |

Kunci rahasia (`XENDIT_SECRET_KEY`, `XENDIT_WEBHOOK_TOKEN`) **tidak** bisa diubah dari UI; hanya ditampilkan statusnya (ada/belum) secara read-only.

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Site Admin buka `/site-admin/payment` | Baca `PlatformSetting` + status env | Form + panel status tampil |
| 2 | Ubah mode/durasi, klik Simpan | `PATCH /api/site-admin/payment-settings` | `200`, tersimpan |
| 3 | Customer bayar | `POST /api/payments/create` memakai durasi efektif | Invoice Xendit dibuat |
| 4 | Matikan pembayaran | Checkout menampilkan pemberitahuan | `503 PAYMENT_DISABLED` |

### 6. Output dan perubahan data

- **Hasil:** Konfigurasi pembayaran tersimpan di `PlatformSetting`
- **Data dibaca:** PlatformSetting, keberadaan env Xendit (bukan nilainya)
- **Data diubah:** PlatformSetting (`paymentEnabled`, `paymentMode`, `invoiceDurationSeconds`)
- **Kondisi akhir:** Durasi efektif = nilai database (bila baris ada) â†’ env `XENDIT_INVOICE_DURATION` â†’ bawaan 900 detik
- **Setelah reload:** Nilai tetap sama

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Belum ada baris | Nilai dari env/bawaan dipakai | Pembayaran aktif, mode SANDBOX |
| Kunci Xendit kosong | Panel status menandai "belum terkonfigurasi"; pembayaran ditolak | `503 NOT_CONFIGURED` |
| Mode PRODUCTION | Label peringatan di UI | Tidak mengubah base URL (tetap `api.xendit.co`) |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` | Masuk |
| Role bukan Site Admin | `403 FORBIDDEN` | - |
| Input tidak valid | `400 VALIDATION_ERROR` | Perbaiki isian |
| Pembayaran dimatikan | `503 PAYMENT_DISABLED` | Hubungi admin |
| Kunci kosong | `503 NOT_CONFIGURED` | Isi env `XENDIT_SECRET_KEY` |

### 9. Perilaku UI

- **Halaman:** `/site-admin/payment`
- **Elemen:** Sakelar aktif, pilihan mode (sandbox/produksi), isian durasi invoice, panel status read-only untuk kedua kunci

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Mode produksi | Lencana peringatan "Produksi" | - |
| Kunci kosong | Panel "Kunci Xendit belum diisi di env" | Isi `.env.local` |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-SITE-02-01 | Site Admin login | Simpan konfigurasi valid | `200`, nilai tersimpan |
| AC-SITE-02-02 | Durasi diubah ke 1800 | Buat pembayaran | Invoice berlaku 1800 detik |
| AC-SITE-02-03 | Pembayaran dimatikan | Buat pembayaran | `503 PAYMENT_DISABLED` |
| AC-SITE-02-04 | `XENDIT_SECRET_KEY` kosong | Buka halaman | Panel status menandai belum terkonfigurasi |
| AC-SITE-02-05 | Store Admin | PATCH API pembayaran | `403` |
| AC-SITE-02-06 | Nilai rahasia | Baca respons API | Tidak ada nilai kunci yang terkirim (hanya boolean) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Durasi | `{ invoiceDurationSeconds: 1800 }` | Invoice 30 menit | AC-SITE-02-02 |
| Matikan | `{ paymentEnabled: false }` | `503` | AC-SITE-02-03 |

### 12. Batas fitur

- **Termasuk:** Sakelar pembayaran, mode sandbox/produksi, durasi invoice, panel status kunci (read-only)
- **Tidak termasuk:** Menyimpan/mengubah kunci API dari UI (keputusan: rahasia tetap di env, OWASP A02), pemilihan gateway selain Xendit, kunci webhook dari UI
- **Ketergantungan:** SITE-00, MOD-PAY (PH-04)

### 13. Pertanyaan terbuka

- `paymentMode` bersifat label/jejak audit; Xendit memakai base URL yang sama dan membedakan sandbox/produksi lewat kunci. Dicatat supaya tidak dianggap pengubah perilaku.

---

## <a name="site-03"></a>SITE-03 â€” Shipping Provider Configuration (RajaOngkir)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-03 â€” Shipping Provider Configuration (RajaOngkir) |
| Modul | MOD-CONFIG |
| Tujuan | Site Admin mengatur perilaku perhitungan ongkir tanpa menyimpan rahasia di database |
| Aktor utama | Site Admin |
| Status | Terimplementasi (PH-08) |
| Referensi PRD | PRD 2.4, PRD 3.1.K, PRD 4.12 |
| Referensi SDD | SDD 7 (MOD-CONFIG), SDD 9 (integrasi RajaOngkir) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login Site Admin
- **Pemicu:** Buka `/site-admin/shipping`
- **Titik masuk:** `/site-admin/shipping`, `GET`/`PATCH /api/site-admin/shipping-settings`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`; role lain â†’ `403`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Site Admin | Baca/ubah konfigurasi ongkir | - | - |
| Store Admin | Akses API | - | `403 FORBIDDEN` |
| Customer/Guest | Akses API | - | `401 UNAUTHORIZED` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| shippingEnabled | boolean | Ya | - | `Status ongkir tidak valid` |
| originDistrictId | string | Tidak | Maks 64 karakter | `ID asal ongkir maksimal 64 karakter` |
| couriers | string | Ya | 1-200 karakter, format `kode:kode` | `Daftar kurir tidak valid` |
| weightPerItemGram | number | Ya | Bulat, 1-50000 | `Berat per item harus 1-50000 gram` |
| flatRateIdr | number | Ya | Bulat, 0-1000000 | `Tarif flat harus 0-1000000` |

Kunci `RAJAONGKIR_API_KEY` **tidak** bisa diubah dari UI; hanya statusnya ditampilkan (ada/belum).

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Site Admin buka `/site-admin/shipping` | Baca `PlatformSetting` + status env | Form + panel status tampil |
| 2 | Ubah asal/kurir/berat/tarif flat, klik Simpan | `PATCH /api/site-admin/shipping-settings` | `200`, tersimpan |
| 3 | Customer hitung ongkir | Nilai efektif dipakai | Opsi ongkir tampil |
| 4 | Matikan ongkir | Semua perhitungan memakai tarif flat | `source: "fallback"` |

### 6. Output dan perubahan data

- **Hasil:** Konfigurasi ongkir tersimpan di `PlatformSetting`
- **Data dibaca:** PlatformSetting, keberadaan env RajaOngkir
- **Data diubah:** PlatformSetting (`shippingEnabled`, `originDistrictId`, `couriers`, `weightPerItemGram`, `flatRateIdr`)
- **Kondisi akhir:** Nilai efektif = database (bila baris ada) â†’ env â†’ bawaan; cache tarif dibersihkan saat konfigurasi berubah
- **Setelah reload:** Nilai tetap sama

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Belum ada baris | Nilai env/bawaan dipakai | Perilaku PH-02 |
| Ongkir dimatikan | API tidak dipanggil, tarif flat dipakai | `source: "fallback"` |
| Kunci kosong | Tarif flat dipakai | `configured: false` di pencarian tujuan |
| Kuota provider habis | Fallback flat (perilaku PH-02) | Tidak menggagalkan checkout |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` | Masuk |
| Role bukan Site Admin | `403 FORBIDDEN` | - |
| Input tidak valid | `400 VALIDATION_ERROR` | Perbaiki isian |
| Provider gagal | Fallback tarif flat, `200` | - |

### 9. Perilaku UI

- **Halaman:** `/site-admin/shipping`
- **Elemen:** Sakelar aktif, isian ID asal, daftar kurir, berat per item, tarif flat, panel status read-only kunci

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Ongkir dimatikan | Catatan "Tarif flat dipakai untuk semua pengiriman" | - |
| Kunci kosong | Panel "Kunci RajaOngkir belum diisi di env" | Isi `.env.local` |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-SITE-03-01 | Site Admin login | Simpan konfigurasi valid | `200`, nilai tersimpan |
| AC-SITE-03-02 | Asal ongkir diubah | Hitung ongkir | Nilai baru dipakai, cache lama tidak dipakai |
| AC-SITE-03-03 | Ongkir dimatikan | Hitung ongkir | `source: "fallback"` tarif flat |
| AC-SITE-03-04 | Tarif flat diubah | Hitung ongkir saat fallback | Nominal baru |
| AC-SITE-03-05 | Store Admin | PATCH API ongkir | `403` |
| AC-SITE-03-06 | Nilai rahasia | Baca respons API | Tidak ada nilai kunci yang terkirim (hanya boolean) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Ubah asal | `{ originDistrictId: "1234" }` | Ongkir dari asal baru | AC-SITE-03-02 |
| Matikan | `{ shippingEnabled: false }` | Fallback flat | AC-SITE-03-03 |

### 12. Batas fitur

- **Termasuk:** Sakelar ongkir, asal ongkir, daftar kurir, berat per item, tarif flat, panel status kunci (read-only), pembersihan cache tarif saat konfigurasi berubah
- **Tidak termasuk:** Mengubah kunci API dari UI, pemilihan provider selain RajaOngkir, peta/geocoding, kurir per produk
- **Ketergantungan:** SITE-00, SHIP-01 (PH-02), MOD-ORDER

### 13. Pertanyaan terbuka

- Cache tarif lama tidak dihapus massal saat konfigurasi berubah; yang dipakai adalah kunci cache yang menyertakan asal + berat, sehingga nilai lama hanya bertahan sampai TTL (10 menit). Dicatat sebagai keterbatasan.

---

## <a name="site-04"></a>SITE-04 â€” User Management (Store Admin)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-04 â€” User Management (Store Admin) |
| Modul | MOD-CONFIG |
| Tujuan | Site Admin membuat, menonaktifkan/mengaktifkan, dan mereset password akun Store Admin |
| Aktor utama | Site Admin |
| Status | Terimplementasi (PH-08) |
| Referensi PRD | PRD 2.3, PRD 2.4, PRD 4.1 |
| Referensi SDD | SDD 6.2 (User), SDD 8 (kontrak API) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login Site Admin
- **Pemicu:** Buka `/site-admin/users`
- **Titik masuk:** `/site-admin/users`, `GET`/`POST /api/site-admin/users`, `PATCH /api/site-admin/users/[id]`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`; role lain â†’ `403`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Site Admin | Daftar/buat/ubah akun | Hanya akun ber-role `STORE_ADMIN` | - |
| Site Admin | Ubah akun Site Admin | - | `404 NOT_FOUND` |
| Store Admin | Akses API | - | `403 FORBIDDEN` |
| Customer/Guest | Akses API | - | `401 UNAUTHORIZED` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| name | string | Ya (saat buat) | 1-100 karakter | `Nama wajib diisi` |
| email | string | Ya (saat buat) | Format email, maks 200, lowercase | `Email tidak valid` |
| password | string | Ya (saat buat/reset) | 8-72 karakter | `Password minimal 8 karakter` |
| active | boolean | Ya (saat ubah) | - | `Status akun tidak valid` |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Site Admin buka `/site-admin/users` | Baca akun Store Admin | Tabel tampil |
| 2 | Isi form "Tambah Store Admin", klik Simpan | `POST /api/site-admin/users` | `201`, akun dibuat, bisa login |
| 3 | Klik Nonaktifkan pada satu akun | `PATCH /api/site-admin/users/[id]` `{ active: false }` | Akun tidak bisa login |
| 4 | Klik Aktifkan kembali | `PATCH` `{ active: true }` | Akun bisa login lagi |
| 5 | Isi password baru, klik Reset | `PATCH` `{ password: "..." }` | Password diganti (bcrypt) |

### 6. Output dan perubahan data

- **Hasil:** Akun Store Admin dikelola dari satu halaman
- **Data dibaca:** User ber-role `STORE_ADMIN`
- **Data diubah:** User (create; `deactivatedAt`; `password`)
- **Kondisi akhir:** Penonaktifan berlaku segera â€” login gagal dan API/halaman Store Admin ditolak pada permintaan berikutnya
- **Setelah reload:** Daftar dan status tetap sama

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Email sudah dipakai | Ditolak | `409 EMAIL_TAKEN` |
| Store Admin sedang login lalu dinonaktifkan | Permintaan berikutnya ditolak | `401` |
| Reset password akun sendiri (bila kelak Site Admin dikelola) | Ditolak | `403 SELF_TARGET` |
| Akun tidak ada | Ditolak | `404 NOT_FOUND` |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` | Masuk |
| Role bukan Site Admin | `403 FORBIDDEN` | - |
| Email sudah terdaftar | `409 EMAIL_TAKEN` | Pakai email lain |
| Input tidak valid | `400 VALIDATION_ERROR` | Perbaiki isian |
| Target bukan Store Admin | `404 NOT_FOUND` | - |

### 9. Perilaku UI

- **Halaman:** `/site-admin/users`
- **Elemen:** Tabel akun (nama, email, status, dibuat), form tambah, aksi Nonaktifkan/Aktifkan/Reset password

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Sukses buat | Pesan "Store Admin dibuat." | Bagikan kredensial secara aman |
| Sukses reset | Pesan "Password diperbarui." | - |
| Akun nonaktif | Lencana "Nonaktif" | Aktifkan kembali |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-SITE-04-01 | Site Admin login | Buat Store Admin valid | `201`, akun bisa login |
| AC-SITE-04-02 | Email sudah dipakai | Buat akun | `409 EMAIL_TAKEN` |
| AC-SITE-04-03 | Store Admin aktif | Nonaktifkan | Login gagal, `/api/admin/*` `401` |
| AC-SITE-04-04 | Store Admin nonaktif | Aktifkan kembali | Bisa login lagi |
| AC-SITE-04-05 | Store Admin | Reset password | Password baru berlaku, login dengan password baru berhasil |
| AC-SITE-04-06 | Site Admin | Reset password akun Site Admin | `404` |
| AC-SITE-04-07 | Customer | Akses API user management | `401` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Buat | `{ name: "Admin Dua", email: "admin2@flexstore.local", password: "Rahasia123" }` | Akun dibuat | AC-SITE-04-01 |
| Nonaktif | `{ active: false }` | Login gagal | AC-SITE-04-03 |
| Reset | `{ password: "Baru12345" }` | Password berubah | AC-SITE-04-05 |

### 12. Batas fitur

- **Termasuk:** Daftar, buat, nonaktifkan/aktifkan, reset password akun Store Admin, penegakan status aktif dari database
- **Tidak termasuk:** Mengelola akun Site Admin/Customer, pengiriman email kredensial otomatis (kredensial dibagikan manual oleh Site Admin), audit log perubahan akun
- **Ketergantungan:** SITE-00, MOD-AUTH (bcrypt, login)

### 13. Pertanyaan terbuka

- Kredensial akun baru diberikan langsung oleh Site Admin (bukan lewat email) supaya tidak bergantung pada domain Resend terverifikasi. Bila kelak email kredensial diperlukan, bisa memakai ulang alur token AUTH-04.

---

## <a name="site-05"></a>SITE-05 â€” Brand Customization (Identitas, Palet, Banner)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-05 â€” Brand Customization (Identitas, Palet Warna, Banner) |
| Modul | MOD-CONFIG |
| Tujuan | Site Admin mengkustomisasi identitas brand per deployment (1 deployment = 1 brand store): nama, logo, favicon, tagline, palet warna, teks footer, banner homepage â€” tanpa menyentuh kode |
| Aktor utama | Site Admin |
| Status | Terimplementasi (PH-09, 2026-10-11) â€” bukti verifikasi di `docs/04` bagian 14.5, laporan 14.6 |
| Referensi PRD | PRD 2.4 (Brand Customization), PRD 3.1.J (Theme customization MVP), PRD 7.6, PRD 4.12 â€” sesuai revisi PRD v1.2 |
| Referensi SDD | SDD 5 (struktur project), SDD 7 (MOD-CONFIG), SDD 10 (keamanan) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login Site Admin; SITE-00 (role) dan area `/site-admin` dari PH-08 sudah tersedia
- **Pemicu:** Buka `/site-admin/brand`
- **Titik masuk:** `/site-admin/brand`, `GET`/`PATCH /api/site-admin/brand`, endpoint Uploadthing `brandAsset` dan `bannerImage`
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`; role lain â†’ `403`

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Site Admin | Baca/ubah data brand | - | - |
| Site Admin | Unggah logo, favicon, banner | Endpoint `brandAsset`/`bannerImage` | - |
| Store Admin | Akses API brand / unggah via endpoint brand | - | `403 FORBIDDEN` |
| Customer/Guest | Akses API brand | - | `401 UNAUTHORIZED` |

### 4. Input dan validasi

**Identitas:**

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| brandName | string | Ya | 1-50 karakter | `Nama brand wajib diisi` / `Nama brand maksimal 50 karakter` |
| tagline | string | Tidak | Maks 160 karakter | `Tagline maksimal 160 karakter` |
| logoUrl | string | Tidak | URL https, host `utfs.io` / `*.ufs.sh` saja | `Logo harus berupa URL gambar Uploadthing` |
| faviconUrl | string | Tidak | URL https, host `utfs.io` / `*.ufs.sh` saja | `Favicon harus berupa URL gambar Uploadthing` |
| footerText | string | Tidak | Maks 300 karakter | `Teks footer maksimal 300 karakter` |

**Palet warna (15 kolom, semuanya opsional/null = memakai bawaan; format `#RRGGBB`):**

| Grup | Kolom |
| --- | --- |
| Primary | `primaryColor`, `primaryFg` |
| Secondary | `secondaryColor`, `secondaryFg` |
| Accent | `accentColor`, `accentFg` |
| Background | `backgroundColor`, `foregroundColor` |
| Muted | `mutedColor`, `mutedFg` |
| Border | `borderColor` |
| Destructive | `destructiveColor`, `destructiveFg` |
| Success | `successColor`, `successFg` |

- Pesan error semua kolom palet: `Warna harus berupa kode heksadesimal #RRGGBB`
- Token sekunder (`card`, `popover`, `input`, `ring`, `radius`) **tidak** menjadi bagian palet dan selalu memakai bawaan

**Banner homepage:**

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| bannerEnabled | boolean | Ya | - | `Status banner tidak valid` |
| bannerImageUrl | string | Tidak | URL https, host `utfs.io` / `*.ufs.sh` saja | `Gambar banner harus berupa URL Uploadthing` |
| bannerTitle | string | Tidak | Maks 80 karakter | `Judul banner maksimal 80 karakter` |
| bannerText | string | Tidak | Maks 200 karakter | `Teks banner maksimal 200 karakter` |
| bannerButtonLabel | string | Tidak | Maks 40 karakter | `Label tombol maksimal 40 karakter` |
| bannerButtonHref | string | Tidak | Path internal (diawali satu `/`, bukan `//`) atau URL https | `Tautan tombol harus path internal atau URL https` |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Site Admin buka `/site-admin/brand` | Baca baris `BrandSetting` (atau nilai bawaan bila belum ada) | Form tampil per bagian |
| 2 | Ubah nama brand + warna primary, klik Simpan | `PATCH /api/site-admin/brand` | `200`; nama dan warna baru berlaku di seluruh rute setelah reload, tanpa rebuild |
| 3 | Unggah logo lewat form | Uploadthing `brandAsset` â†’ URL disuntikkan ke body PATCH | Header storefront menampilkan gambar (bila kosong: teks nama) |
| 4 | Aktifkan banner + isi gambar/judul/teks/tombol | Simpan | Homepage menampilkan banner lengkap |
| 5 | Isi teks footer | Simpan | Footer menambah paragraf teks tersebut |

### 6. Output dan perubahan data

- **Hasil:** Satu baris `BrandSetting` (`id = "default"`) menampung identitas + palet + banner + teks footer
- **Data dibaca:** BrandSetting
- **Data diubah:** BrandSetting (upsert)
- **Kondisi akhir:** Identitas, palet, dan banner aktif berlaku di storefront, area admin, area site admin, metadata, kop invoice, dan email berikutnya
- **Setelah reload:** Nilai sama; perubahan berlaku tanpa redeploy

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Belum ada baris | Seluruh tampilan memakai bawaan: nama `FlexStore`, `siteDescription`, palet oklch, hero teks default | Tidak ada baris ditulis sampai Site Admin menyimpan |
| Palet diisi sebagian | Hanya kolom non-null yang menimpa variabel CSS; sisanya tetap bawaan | Sebagian warna berubah |
| Banner aktif tapi tanpa gambar | Banner teks dengan latar muted | Banner tetap tampil |
| Banner aktif tanpa judul | Judul bawaan memakai nama brand (`Selamat datang di {brandName}`) | Banner tidak pernah kosong |
| Logo/favicon kosong | Teks nama di header / tanpa ikon tab | Perilaku sama seperti sebelum fitur ini ada |
| footerText kosong | Footer = tampilan sekarang (nama + tagline + `Â©`) | Tidak ada baris tambahan |
| Unggah gagal (Uploadthing) | Form menampilkan pesan galat | URL lama tidak berubah |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` | Masuk |
| Role bukan Site Admin | `403 FORBIDDEN` | - |
| Input tidak valid | `400 VALIDATION_ERROR` | Perbaiki isian |
| Hex palet salah format | `400 VALIDATION_ERROR` | Perbaiki kode warna |
| URL gambar bukan host Uploadthing | `400 VALIDATION_ERROR` | Unggah lewat form, bukan URL manual |
| Unggah oleh role lain | `403` (Uploadthing `FORBIDDEN`) | - |

### 9. Perilaku UI

- **Halaman:** `/site-admin/brand` (empat bagian form: Identitas, Palet Warna, Banner Homepage, Teks Footer); storefront (header, footer, hero); seluruh rute (palet)
- **Elemen:** Setiap slot palet punya input teks hex + color picker yang saling sinkron; tombol `Atur ulang palet` (mengembalikan seluruh kolom ke null/bawaan); sakelar `Aktifkan banner`; unggah gambar (logo, favicon, banner) dengan kotak pratinjau

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Nama brand diubah | Header, footer, judul halaman, kop invoice, subjek email memakai nama baru | - |
| Palet primary diubah | Tombol dan link aktif di storefront **dan** `/admin` berubah warna | - |
| Banner aktif | Hero homepage: gambar (dengan overlay gelap) + judul + teks + tombol CTA | - |
| Banner mati | Hero = teks default seperti tampilan sekarang | - |
| Logo kosong | Header menampilkan teks nama brand | - |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-SITE-05-01 | Site Admin login | Simpan identitas valid | `200`, nama baru tampil di header/footer/judul halaman setelah reload |
| AC-SITE-05-02 | Ubah `primaryColor` | Buka storefront dan `/admin` | Tombol/link aktif memakai warna baru (seluruh aplikasi) |
| AC-SITE-05-03 | Kirim hex tidak valid | `PATCH /api/site-admin/brand` | `400 VALIDATION_ERROR`, data lama tidak berubah |
| AC-SITE-05-04 | Store Admin / tanpa sesi | `PATCH /api/site-admin/brand` | `403` / `401` |
| AC-SITE-05-05 | Logo dikosongkan lalu diisi | Lihat header storefront | Teks nama muncul / gambar muncul |
| AC-SITE-05-06 | Banner aktif + data lengkap | Buka homepage | Banner tampil; sakelar mati â†’ hero default |
| AC-SITE-05-07 | Nama brand diganti | Cek tab browser, halaman invoice, email berikutnya | Judul, kop, subjek memakai nama baru |
| AC-SITE-05-08 | `faviconUrl` diisi | Buka tab halaman | Ikon tab berubah; dikosongkan â†’ tanpa ikon |
| AC-SITE-05-09 | Store Admin panggil endpoint unggah brand | Uploadthing | Ditolak `403` |
| AC-SITE-05-10 | `footerText` diisi lalu dikosongkan | Lihat footer | Paragraf tambahan tampil / footer default |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Ganti nama | `{ brandName: "Toko Ritel Nusantara" }` | Header/footer/invoice/email berubah | AC-SITE-05-01 |
| Palet merah | `{ primaryColor: "#B91C1C", primaryFg: "#FFFFFF" }` | Tombol jadi merah di seluruh aplikasi | AC-SITE-05-02 |
| Banner promo | `{ bannerEnabled: true, bannerTitle: "Promo Oktober", bannerButtonLabel: "Belanja", bannerButtonHref: "/products" }` | Hero homepage berganti | AC-SITE-05-06 |

### 12. Batas fitur

- **Termasuk:** Identitas (nama, tagline, logo, favicon), palet 9 grup hex, banner homepage (gambar + judul + teks + tombol + sakelar), teks footer, penggantian semua titik hardcode "FlexStore" di UI, metadata, kop invoice, dan email
- **Tidak termasuk:** Kustomisasi halaman bayar Xendit (halaman di domain Xendit, bukan deployment ini), token sekunder (`card`, `popover`, `input`, `ring`) yang selalu bawaan, slider multi-banner/promo berjadwal, pengaturan info toko & kebijakan (CONFIG-01)
- **Ketergantungan:** SITE-00 (role), SITE-01 (area `/site-admin`), Uploadthing, MOD-INV (kop invoice), NOTIF-01 (email)

### 13. Pertanyaan terbuka

- Palet berlaku **seluruh aplikasi** termasuk `/admin` (keputusan pengguna 2026-10-11). Bila kelak area admin perlu netral, override dibatasi per route group tanpa mengubah penyimpanan.
- Nama tampilan = `BrandSetting.brandName` **satu-satunya nama** â€” `StoreSetting.storeName` dihapus (keputusan 2026-10-11, `docs/04` bagian 10): 1 deployment = 1 brand = 1 store, dua nama tidak masuk akal. Label pickup di checkout memakai `brandName`.
- Halaman bayar Xendit memakai domain Xendit sehingga tidak bisa ikut dikustom; yang bisa dikustom hanyalah kop invoice di deployment ini.
- Email membaca nama brand saat pengiriman; email yang sudah terkirim memakai nama lama (jejak histori tidak diubah).

---

## <a name="cust-03"></a>CUST-03 â€” Profil Akun (halaman mandiri)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CUST-03 â€” Profil Akun |
| Modul | MOD-CUST |
| Tujuan | Customer melihat dan mengubah data akunnya (nama, email, password) pada halaman mandiri, terpisah dari alamat dan notifikasi |
| Aktor utama | Customer |
| Status | Terimplementasi (PH-10, Disetujui); revisi 2026-10-11: perubahan email wajib verifikasi ulang lewat tautan ke email baru |
| Referensi PRD | PRD 4.8 (Customer Management, revisi 1.4) |
| Referensi SDD | SDD 4.8 (MOD-CUST), SDD 4.1 (MOD-AUTH) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Sesi login dengan role Customer
- **Pemicu:** Buka `/profile` dari menu akun di navbar
- **Titik masuk:** `/profile`, `/api/customer/profile` (rencana); tautan verifikasi email memakai `/verify-email` dan `/api/auth/verify-email` (rencana)
- **Jika tidak terpenuhi:** Tanpa sesi â†’ alihkan ke `/login`; role non-customer â†’ alihkan ke `/admin`. Halaman `/verify-email` boleh dibuka tanpa sesi karena otorisasinya memakai token sekali pakai

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Customer login | Baca/ubah data akun sendiri | Miliknya sendiri (selalu dari sesi) | - |
| Pemilik tautan verifikasi (boleh tanpa sesi) | Menyelesaikan verifikasi email baru | Hanya token valid dan belum terpakai | `400 TOKEN_INVALID` bila token salah atau kedaluwarsa |
| Store Admin / Site Admin | Akses halaman/API | - | Alihkan ke `/admin`; API `403 FORBIDDEN` |
| Guest tanpa sesi | Akses halaman/API | - | Alihkan ke `/login`; API `401 UNAUTHORIZED` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| name | string | Ya | 1-100 karakter | `Nama wajib diisi` |
| email | string | Ya | Format email, unik antar-akun; perubahan email tidak langsung tersimpan (wajib verifikasi) | `Email sudah digunakan` |
| token (tautan verifikasi) | string | Ya (hanya di `/verify-email`) | Token sekali pakai dari Redis, belum kedaluwarsa | `Tautan verifikasi tidak valid atau sudah kedaluwarsa` |
| currentPassword | string | Ya (hanya saat ubah password) | Mengikuti aturan password AUTH-02 | `Password saat ini salah` |
| newPassword | string | Ya (hanya saat ubah password) | Mengikuti aturan password AUTH-02 | `Password tidak memenuhi syarat` |

Semua input divalidasi Zod **sebelum** query Prisma. Angka final aturan password mengikuti skema AUTH-02/AUTH-05 yang sudah berlaku (dicatat saat PH-10 dirinci). Token verifikasi email diverifikasi di server lewat Redis: sekali pakai, TTL 24 jam, dan hanya satu tautan aktif per akun.

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Customer buka `/profile` | Baca data akun dari sesi | Kartu "Info Akun" tampil |
| 2 | Ubah nama lalu Simpan | `PATCH /api/customer/profile` | `200`, nama tersimpan |
| 3 | Ubah email lalu Simpan | `PATCH` yang sama | `200` + `emailVerificationSent`, tautan verifikasi dikirim ke email baru; email akun belum berubah |
| 4 | Buka tautan di email baru lalu klik Verifikasi | `POST /api/auth/verify-email` | `200`, email akun menjadi email baru; sesi diperbarui diam-diam (tanpa paksa login ulang) |
| 5 | Isi password saat ini + password baru lalu Simpan | `PATCH` yang sama | `200`, password berubah |
| 6 | Buka `/profile/addresses` lewat tautan | - | Halaman alamat terbuka; info akun tetap utuh |

### 6. Output dan perubahan data

- **Hasil:** Data akun terbaru; password baru bila diubah; email baru baru berlaku setelah verifikasi selesai
- **Data dibaca:** `User` milik pemanggil; payload token verifikasi di Redis (`{ userId, newEmail }`)
- **Data diubah:** `User.name` dan `User.passwordHash` (langsung); `User.email` (setelah verifikasi); token verifikasi di Redis (sekali pakai, TTL 24 jam)
- **Setelah reload:** Perubahan tetap ada; selama verifikasi belum selesai, email lama tetap dipakai untuk login. Setelah verifikasi sukses, sesi diperbarui diam-diam sehingga email baru langsung dipakai (keputusan pengguna 2026-10-11, tanpa paksa login ulang)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Email tidak diubah | Dianggap sama dengan milik sendiri, bukan bentrok; tanpa kirim tautan | `200` |
| Hanya mengubah nama | Email dan password tidak disentuh | `200` |
| Bagian password dibiarkan kosong | Password tidak berubah | `200` |
| Minta ubah email lagi sebelum verifikasi selesai | Permintaan baru membatalkan tautan sebelumnya (hanya satu tautan aktif per akun) | Hanya tautan terbaru yang berlaku |
| Tautan verifikasi dibuka berkali-kali | Token sudah terpakai dan dihapus | `400 TOKEN_INVALID` |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` / alihkan ke `/login` | - |
| Role bukan customer | `403 FORBIDDEN` / alihkan ke `/admin` | - |
| Input tidak valid | `400 VALIDATION_ERROR` + `field` | Perbaiki isian |
| Email baru sudah dipakai akun lain (saat mengajukan) | `409 EMAIL_IN_USE` | Pakai email lain |
| Email baru sudah dipakai akun lain (saat verifikasi) | `409 EMAIL_IN_USE` | Email tidak berubah; ajukan email lain |
| Tautan verifikasi salah atau kedaluwarsa | `400 TOKEN_INVALID` | Minta tautan baru dari `/profile` |
| Password saat ini salah | `400 INVALID_PASSWORD` | Ulangi |
| Terlalu banyak permintaan ganti email (lebih dari 3 dalam 1 jam per akun) | `429 RATE_LIMITED` | Tunggu lalu ajukan lagi |

### 9. Perilaku UI

- **Halaman:** `/profile` (halaman mandiri) dan `/verify-email` (halaman verifikasi tautan)
- **Elemen:** Kartu "Info Akun" (nama, email, tombol Simpan), kartu "Ubah Password" (password saat ini, password baru, tombol Simpan), tautan ke `/profile/addresses`; `/verify-email` memuat pesan status dan tombol "Verifikasi email"
- **Tidak memuat:** daftar alamat (CUST-01) dan preferensi notifikasi (NOTIF-02) â€” keduanya dipisah

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Berhasil simpan nama | Pesan "Perubahan disimpan." | - |
| Email diubah, menunggu verifikasi | Pesan "Cek email baru untuk menyelesaikan verifikasi." | Buka tautan di email baru |
| Tautan verifikasi dibuka | Halaman `/verify-email` dengan tombol "Verifikasi email" | Klik tombol |
| Verifikasi berhasil | Pesan "Email berhasil diverifikasi." | Login memakai email baru |
| Token tidak valid | Pesan "Tautan verifikasi tidak valid atau sudah kedaluwarsa." + tautan ke `/profile` | Minta tautan baru |
| Gagal | Pesan galat pada field terkait | Perbaiki isian |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-CUST-03-01 | Customer login | Buka `/profile` | Hanya info akun tampil; alamat dan preferensi tidak ada |
| AC-CUST-03-02 | Customer login | Ubah nama lalu simpan | `200`, nama berubah setelah reload |
| AC-CUST-03-03 | Email baru sudah dipakai akun lain | Simpan email baru | `409 EMAIL_IN_USE`, email akun tidak berubah |
| AC-CUST-03-04 | Password saat ini benar | Ubah password | `200`, login dengan password baru berhasil |
| AC-CUST-03-05 | Password saat ini salah | Ubah password | `400 INVALID_PASSWORD` |
| AC-CUST-03-06 | Store Admin | Akses `/api/customer/profile` | `403` |
| AC-CUST-03-07 | Guest tanpa sesi | Buka `/profile` | Dialihkan ke `/login` |
| AC-CUST-03-08 | Customer login | Ubah email lalu simpan | `200` + `emailVerificationSent`; tautan verifikasi terkirim ke email baru; email akun belum berubah |
| AC-CUST-03-09 | Token verifikasi valid | Klik "Verifikasi email" | `200`, email akun menjadi email baru; login dengan email baru berhasil |
| AC-CUST-03-10 | Token kedaluwarsa atau sudah terpakai | Klik "Verifikasi email" | `400 TOKEN_INVALID`, email akun tidak berubah |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Ubah nama | `name: "Budi"` | Tersimpan | AC-CUST-03-02 |
| Email bentrok | `email` milik akun lain | `409` | AC-CUST-03-03 |
| Ubah email | `email: "baru@contoh.com"` (bebas) | Tautan verifikasi terkirim; email lama tetap berlaku | AC-CUST-03-08 |
| Verifikasi email | token valid dari email baru | `User.email` berubah ke email baru | AC-CUST-03-09 |
| Token kedaluwarsa | token lebih dari 24 jam | `400 TOKEN_INVALID` | AC-CUST-03-10 |
| Ubah password | `currentPassword` benar + `newPassword` | Login dengan password baru berhasil | AC-CUST-03-04 |

### 12. Batas fitur

- **Termasuk:** Lihat/ubah nama, ubah email (wajib verifikasi lewat tautan ke email baru), ubah password, tautan ke halaman alamat
- **Tidak termasuk:** Alamat tersimpan (CUST-01), preferensi notifikasi (CUST-02/NOTIF-02), riwayat pesanan (ORDER-03, tetap di `/orders`), hapus akun, foto profil, verifikasi berjenjang/2FA, perubahan email tanpa verifikasi
- **Ketergantungan:** MOD-AUTH (sesi + token Redis), MOD-NOTIF (email verifikasi lewat Resend), Prisma

### 13. Pertanyaan terbuka

- Keputusan pengguna 2026-10-11: **perubahan email wajib verifikasi ulang** lewat tautan sekali pakai ke email baru. Email lama tetap aktif sampai verifikasi selesai; permintaan baru membatalkan tautan sebelumnya. Token disimpan di Redis (pola set/reset password), TTL 24 jam, dan dibatasi 3 permintaan per jam per akun.
- Panjang minimum password mengikuti aturan AUTH-02/AUTH-05 yang sudah berlaku (min 8, maks 72); angka final dicatat pada task PH-10.
- Keputusan pengguna 2026-10-11: saat password diganti, **password lama langsung tidak berlaku**; sesi lain tidak dipaksa logout (di luar cakupan).
- Keputusan pengguna 2026-10-11: setelah verifikasi email, **sesi diperbarui diam-diam** (tidak memaksa login ulang) karena penggantian email adalah keinginan pengguna sendiri.
- Keputusan pengguna 2026-10-11: email verifikasi **selalu dikirim**, tidak tunduk pada preferensi email (CUST-02/NOTIF-02) â€” sama seperti email set/reset password.
- Keputusan pengguna 2026-10-11: halaman profil isinya **info akun saja** â€” riwayat pesanan tetap di `/orders`, alamat di `/profile/addresses`, notifikasi di dialog NOTIF-02.

---

## <a name="notif-02"></a>NOTIF-02 â€” Pusat Notifikasi In-App

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | NOTIF-02 â€” Pusat Notifikasi In-App |
| Modul | MOD-NOTIF |
| Tujuan | Customer melihat aktivitas pesanannya dan mengatur preferensi email lewat dialog yang dibuka dari ikon notifikasi di navbar, dengan penanda belum dibaca |
| Aktor utama | Customer login |
| Status | Terimplementasi (PH-10, Disetujui) |
| Referensi PRD | PRD 3.1.I (revisi 1.3), PRD 4.9 (Notification), PRD 7.7 |
| Referensi SDD | SDD 4.9 (MOD-NOTIF), SDD 4.8 (MOD-CUST, preferensi) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Sesi login dengan role Customer
- **Pemicu:** Klik ikon lonceng notifikasi di navbar
- **Titik masuk:** Navbar storefront (ikon notifikasi), `/api/customer/notifications` (rencana), `/api/customer/notification-preferences` (sudah ada)
- **Jika tidak terpenuhi:** Guest dan role non-customer tidak melihat ikon sama sekali

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Customer login | Lihat daftar + ubah preferensi | Aktivitas akun sendiri (dibangun dari sesi) | - |
| Store Admin / Site Admin | - | - | Ikon tidak ditampilkan; API `403 FORBIDDEN` |
| Guest tanpa sesi | - | - | Ikon tidak ditampilkan; API `401 UNAUTHORIZED` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| Daftar notifikasi | - | - | Hanya baca (tidak menerima input klien) | - |
| Lima kotak preferensi | boolean | Tidak | Skema CUST-02 (`notificationPreferenceSchema`) | `400 VALIDATION_ERROR` |

Daftar notifikasi tidak menerima input dari klien; seluruh isinya diturunkan di server dari data pesanan milik pemanggil.

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Customer klik ikon lonceng | Baca kejadian pesanan terbaru miliknya | Dialog terbuka, daftar notifikasi tampil |
| 2 | (otomatis saat dibuka) | Set penanda `notif:last-seen:{userId}` di Redis | Badge belum dibaca hilang |
| 3 | Pilih bagian "Pengaturan" | Baca preferensi lima jenis email | Lima sakelar tampil sesuai tersimpan |
| 4 | Ubah sakelar lalu Simpan | `PATCH /api/customer/notification-preferences` | `200`, "Preferensi disimpan." |
| 5 | Klik satu notifikasi | - | Dialog tertutup, arahkan ke tautan pesanan |

### 6. Output dan perubahan data

- **Hasil:** Daftar notifikasi (judul, deskripsi, waktu, tautan) + jumlah belum dibaca; preferensi terbaru
- **Data dibaca:** `Order` (`createdAt`, `shippedAt`, `completedAt`, `canceledAt`, `status`), `Payment` (`status`, `paidAt`), `Refund` (`status`, `processedAt`) â€” hanya milik pemanggil
- **Data diubah:** `NotificationPreference` (lima kolom, sama seperti CUST-02), penanda `notif:last-seen:{userId}` di Redis
- **Setelah reload:** Daftar tetap sama sampai ada kejadian baru

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Belum ada kejadian | Dialog menampilkan keadaan kosong | Tanpa notifikasi |
| Gagal membaca preferensi | Dianggap semua aktif (aturan CUST-02) | Sakelar tampil aktif |
| Beberapa kejadian pada pesanan yang sama | Satu entri per jenis kejadian | Tidak ada duplikat |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` | - |
| Role bukan customer | `403 FORBIDDEN` | - |
| Input preferensi tidak valid | `400 VALIDATION_ERROR` | Perbaiki pilihan |

### 9. Perilaku UI

- **Elemen:** Ikon lonceng di navbar (dekat menu akun/keranjang) + dialog (shadcn `Dialog`) dengan dua bagian
- **Bagian "Notifikasi":** daftar terbaru dulu, maksimal 20 entri (judul, deskripsi singkat, waktu, tautan); badge angka menandai jumlah belum dibaca
- **Bagian "Pengaturan":** lima kotak centang preferensi (sama dengan CUST-02) + tombol Simpan
- Ikon hanya tampil untuk Customer login

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Ada kejadian baru | Badge angka pada ikon | Buka dialog |
| Dialog sudah pernah dibuka | Tanpa badge | - |
| Tidak ada notifikasi | "Belum ada notifikasi" | - |

**Judul dan deskripsi tiap kejadian (acuan; boleh diganti kapan saja):**

| Kejadian | Judul | Deskripsi | Tautan |
| --- | --- | --- | --- |
| Belum dibayar | Menunggu Pembayaran | Selesaikan pembayaran pesanan {nomor} sebelum {tenggat}. | `/orders/[id]` |
| Dikirim pertama kali | Pesanan Dikirim | Pesanan {nomor} sedang dalam perjalanan. | `/orders/[id]/tracking` |
| Sudah tiba | Pesanan Tiba | Pesanan {nomor} sudah sampai. Terima kasih sudah berbelanja. | `/orders/[id]/tracking` |
| Batal sebelum bayar | Pesanan Dibatalkan | Pesanan {nomor} dibatalkan sebelum dibayar. | `/orders/[id]` |
| Refund selesai | Refund Selesai | Dana refund pesanan {nomor} sudah diproses. | `/orders/[id]` |

Daftar dibatasi **20 entri terbaru** (urut terbaru dulu); entri yang lebih lama tidak ditampilkan â€” bukan dihapus, karena daftarnya diturunkan dari data pesanan.

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-NOTIF-02-01 | Customer login | Buka storefront | Ikon lonceng tampil, badge bila ada kejadian baru |
| AC-NOTIF-02-02 | Pesanan baru dibuat dan belum dibayar | Buka dialog | Entri "menunggu pembayaran" + tautan pesanan |
| AC-NOTIF-02-03 | Pesanan pertama kali dikirim | Buka dialog | Entri "pesanan dikirim" beserta resi bila ada |
| AC-NOTIF-02-04 | Pesanan sudah tiba | Buka dialog | Entri "pesanan selesai" |
| AC-NOTIF-02-05 | Pesanan dibatalkan sebelum bayar | Buka dialog | Entri "pesanan dibatalkan" |
| AC-NOTIF-02-06 | Refund selesai (batal setelah bayar) | Buka dialog | Entri "refund selesai" |
| AC-NOTIF-02-07 | Ada kejadian baru | Buka dialog sekali | Penanda tersimpan, badge hilang sampai kejadian berikutnya |
| AC-NOTIF-02-08 | Guest atau Store Admin | Buka storefront | Ikon tidak ditampilkan |
| AC-NOTIF-02-09 | Customer mematikan satu preferensi | Simpan di dialog lalu ada email terkait | Email jenis itu dilewati (aturan CUST-02) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Pesanan baru | `status = WAITING_PAYMENT` | Notifikasi "menunggu pembayaran" | AC-NOTIF-02-02 |
| Dikirim | `shippedAt` terisi | Notifikasi "dikirim" | AC-NOTIF-02-03 |
| Tiba | `completedAt` terisi | Notifikasi "selesai" | AC-NOTIF-02-04 |
| Batal sebelum bayar | `canceledAt` terisi, tanpa `paidAt` | Notifikasi "dibatalkan" | AC-NOTIF-02-05 |
| Refund | `Refund.status = COMPLETED` | Notifikasi "refund selesai" | AC-NOTIF-02-06 |

### 12. Batas fitur

- **Termasuk:** Lima jenis kejadian pesanan (maksimal 20 entri terbaru ditampilkan), badge belum dibaca, formulir preferensi lima jenis email
- **Tidak termasuk:** Tabel `Notification` baru (daftar diturunkan dari data pesanan), arsip/hapus per notifikasi, tanda baca per entri, paginasi/daftar lebih dari 20 entri, notifikasi realtime (muncul saat reload/buka dialog, tanpa polling), push/WhatsApp, notifikasi untuk guest dan admin
- **Ketergantungan:** MOD-CUST (CUST-02 preferensi, sesi), MOD-ORDER dan MOD-PAY (data kejadian), Redis (penanda)

### 13. Pertanyaan terbuka

- Lima jenis kejadian (keputusan pengguna 2026-10-11): pesanan dibuat dan belum dibayar, pesanan terkirim pertama kali, pesanan sudah tiba, pesanan dibatalkan sebelum bayar, refund selesai (batal setelah bayar). Kejadian di luar daftar ini tidak memunculkan notifikasi.
- Karena tanpa tabel `Notification`, "belum dibaca" bersifat semua-atau-tidak (satu penanda waktu), bukan per entri; konsekuensinya dijelaskan di bagian 12.
- Perhitungan badge dilakukan saat layout storefront dirender (request-time, `await connection()` pola `CartBadge`); pembaruan mengikuti reload halaman, tanpa polling.
- Judul dan deskripsi tiap kejadian memakai diksi paling lumrah (keputusan pengguna 2026-10-11) dan boleh diganti kapan saja â€” teks acuan di bagian 9. Daftar dibatasi 20 entri terbaru. Sumber waktu memakai kolom yang sudah ada (tanpa migrasi).
- Keputusan pengguna 2026-10-11: email verifikasi perubahan email (CUST-03) **selalu dikirim** dan tidak tunduk pada preferensi di dialog ini (sama seperti email set/reset password).

---

**Status:** Spesifikasi Fitur v2.1 - PH-07, PH-08 (SITE-00..SITE-04), dan PH-09 (SITE-05) terimplementasi dan **Disetujui** (2026-10-11); CUST-03 + NOTIF-02 (Phase 10) **terimplementasi dan Disetujui** (2026-10-11, pengguna: "approve" - bukti `docs/04` bagian 15.5) beserta revisi UI CUST-01/CUST-02. Bagian 1A (aturan karakter input semua field, v2.1) terimplementasi di commit `40dcb41`. Indeks dan bagian status diselaraskan dengan kode pada 2026-10-11 (PH-08 commit `f01a6d2`, PH-09 commit `1da2b3a`).

**Next steps:**
1. Tulis bagian rinci 17 fitur yang belum berspesifikasi (utang dokumentasi; daftar di catatan indeks bagian 1 dan `docs/04` bagian 10)
2. (Selesai 2026-10-11) Tautkan bukti implementasi SITE-05 - PH-09 terimplementasi & disetujui (`docs/04` bagian 14.5)
3. (Selesai 2026-10-11) Tautkan bukti implementasi CUST-03, NOTIF-02, dan revisi UI CUST-01/CUST-02 - PH-10 terimplementasi & disetujui (`docs/04` bagian 15.5)
4. Jaga indeks fitur tetap sinkron setiap fase selesai (pola penyelarasan 2026-10-11)