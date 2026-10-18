# Spesifikasi Fitur ├óΓé¼ΓÇ¥ FlexStore

> Fungsi dokumen: menjelaskan perilaku setiap fitur secara terperinci, termasuk alur berhasil, validasi, hak akses, kondisi gagal, dan kriteria penerimaan. Task implementasi ditempatkan di Implementation Plan.

## 0. Cara memakai template

- Satu blok spesifikasi untuk satu fitur
- Kelompokkan berdasarkan modul, gunakan ID dari PRD
- Fitur prioritas dirinci penuh; fitur yang belum berspesifikasi ditandai sebagai utang dokumentasi di indeks (lihat catatan indeks bagian 1)
- Rujuk aturan bisnis PRD dan kontrak teknis SDD

## 1. Identitas dan indeks fitur

- **Versi / tanggal:** v2.6 / 2026-10-16
- **Versi PRD / SDD:** PRD v1.6, SDD v1.0
- **Pemilik keputusan:** Development Team

### Indeks Fitur (MVP) ├óΓé¼ΓÇ¥ Phase Bertahap

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
| | | CART-05 | Pemilihan Varian dari Kartu Produk (tambahan pasca-MVP) | Terimplementasi (2026-10-15, pasca-MVP; termasuk stok efektif TASK-114) | [CART-05](#cart-05) |
| | **MOD-SHIP** | SHIP-01 | Calculate Shipping Cost | Terimplementasi (PH-02) | [SHIP-01](#ship-01) |
| **Phase 3** | **MOD-ORDER** | ORDER-01 | Create Order (Guest Checkout) | Terimplementasi (PH-03) | [ORDER-01](#order-01) |
| | | ORDER-02 | Create Order (Customer) | Terimplementasi (PH-03) | [ORDER-02](#order-02) |
| | | ORDER-03 | Order History | Terimplementasi (PH-03) | [ORDER-03](#order-03) |
| | | ORDER-04 | Track Order (Public) | Terimplementasi (PH-03) | [ORDER-04](#order-04) |
| **Phase 4** | **MOD-PAY** | PAY-01 | Create Payment (Xendit) | Terimplementasi (PH-04) | [PAY-01](#pay-01) |
| | | PAY-02 | Webhook Handler (Xendit) | Terimplementasi (PH-04) | [PAY-02](#pay-02) |
| **Phase 5** | **MOD-VOUCH** | VOUCH-01 | Apply Voucher | Terimplementasi (PH-05) | `docs/04` bagian 8 |
| | | VOUCH-02 | Voucher CRUD (Admin) | Terimplementasi (PH-05) | `docs/04` bagian 8 |
| | **MOD-NOTIF** | NOTIF-01 | Send Email Notification | Terimplementasi (PH-05) | `docs/04` bagian 8 |
| | **MOD-INV** | INV-01 | Generate Invoice (HTML siap-cetak) | Terimplementasi (PH-05) | `docs/04` bagian 8 |
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
| | **MOD-AUTH** | AUTH-04 | Set Password (Guest ├óΓÇáΓÇÖ Customer) | Terimplementasi (PH-07) | [AUTH-04](#auth-04) |
| | | AUTH-05 | Reset Password | Terimplementasi (PH-07) | [AUTH-05](#auth-05) |
| | **MOD-ORDER** | ORDER-03B | Re-order (lanjutan ORDER-03) | Terimplementasi (PH-07) | [ORDER-03B](#order-03b) |
| **Phase 8** | **MOD-AUTH** | SITE-00 | Akses Site Admin (role baru) | Terimplementasi (PH-08) | [SITE-00](#site-00) |
| | **MOD-CONFIG** | SITE-01 | Platform Settings | Terimplementasi (PH-08) | [SITE-01](#site-01) |
| | | SITE-02 | Payment Gateway Configuration (Xendit) | Terimplementasi (PH-08) | [SITE-02](#site-02) |
| | | SITE-03 | Shipping Provider Configuration (RajaOngkir) | Terimplementasi (PH-08) | [SITE-03](#site-03) |
| | | SITE-04 | User Management (Store Admin) | Terimplementasi (PH-08) | [SITE-04](#site-04) |
| **Phase 9** | **MOD-CONFIG** | SITE-05 | Brand Customization (identitas, palet, banner) | Terimplementasi (PH-09, 2026-10-11) | [SITE-05](#site-05) |
| **Phase 10** | **MOD-CUST** | CUST-03 | Profil Akun (halaman mandiri) | Terimplementasi (PH-10, Disetujui; revisi 2026-10-11: ganti email wajib verifikasi) | [CUST-03](#cust-03) |
| | **MOD-NOTIF** | NOTIF-02 | Pusat Notifikasi In-App (ikon navbar) | Terimplementasi (PH-10, Disetujui) | [NOTIF-02](#notif-02) |
| Pasca-MVP | **MOD-CART** | CART-05 | Pemilihan Varian dari Kartu Produk (dialog) | Terimplementasi (2026-10-15, pasca-MVP) | [CART-05](#cart-05) |
| Pasca-MVP | **MOD-PROD** | PROD-06 | Gambar Varian di Galeri Detail (carousel) | Terimplementasi 2026-10-15 (termasuk status tambahan bagan ukuran dialog) | [PROD-06](#prod-06) |
| Pasca-MVP | **MOD-PROD** | PROD-07 | Seksi Editorial Detail Produk (VideoHero, ProductStory, Lookbook) | Terimplementasi 2026-10-15 | [PROD-07](#prod-07) |
| Pasca-MVP | **MOD-ADMIN** | ADMIN-DASH-01 | Modernisasi Dashboard Store Admin | Spek ditulis 2026-10-15, belum diimplementasikan | [ADMIN-DASH-01](#admin-dash-01) |
| Pasca-MVP | **MOD-PROD** | PROD-08 | Informasi Tambahan Produk (role `INFO`, label kustom) | Terimplementasi 2026-10-16 (TASK-117; bukti `docs/04` bagian 10) | [PROD-08](#prod-08) |
| Pasca-MVP | **MOD-PROD** | PROD-09 | Varian Berbasis Opsi (kombinasi ukuran/warna) | Spek ditulis 2026-10-16, **BELUM diimplementasikan** | [PROD-09](#prod-09) |
| Pasca-MVP | **MOD-CREDIT** | CREDIT-01 | Saldo Toko (refund ke saldo + pemakaian saat checkout) | Spek ditulis 2026-10-15, belum diimplementasikan | [CREDIT-01](#credit-01) |
| Pasca-MVP | **MOD-CONFIG** | SITE-06 | Mode Gelap (dark theme — trigger tema saat ini placeholder) | Spek ditulis 2026-10-16, **BELUM diimplementasikan** | [SITE-06](#site-06) |
| Pasca-MVP | **MOD-CONFIG** | SITE-07 | Palet Warna Bawaan Tampil + Konsolidasi Token Warna (default hijau tone dashboard; 19 slot pasca-tahap 3) | Spek ditulis 2026-10-17, **Terimplementasi 2026-10-18** (TASK-123 + TASK-124; bukti `docs/04` bagian 17.4) | [SITE-07](#site-07) |
| Pasca-MVP | **MOD-CUST** | WISH-01 | Favorit Produk (wishlist versi penuh; dummy UI sudah ada) | Spek ditulis 2026-10-16, **BELUM diimplementasikan** | [WISH-01](#wish-01) |

**Phase Checkpoint:**
- **Phase 1:** Admin CRUD products, customer register/login/view products ├ó┼ôΓÇ£ Foundation ready
- **Phase 2:** Add to cart, calculate shipping ├ó┼ôΓÇ£ Shopping flow ready
- **Phase 3:** Create order, stock reservation ├ó┼ôΓÇ£ Checkout ready (no payment)
- **Phase 4:** Payment integration, webhook, stock deduction ├ó┼ôΓÇ£ Payment flow complete
- **Phase 5:** Voucher, email notification, invoice ├ó┼ôΓÇ£ Core features complete
- **Phase 6:** Shipping tracking, cancellation, refund, reports, settings ├ó┼ôΓÇ£ MVP complete
- **Phase 7:** Alamat tersimpan, re-order, set/reset password, preferensi notifikasi ├ó┼ôΓÇ£ Customer management ready
- **Phase 8:** Akses Site Admin, pengaturan platform, konfigurasi payment/shipping, kelola Store Admin ├ó┼ôΓÇ£ platform configuration ready
- **Phase 9:** Kustomisasi brand oleh Site Admin (identitas, palet warna, banner) ├ó┼ôΓÇ£ terimplementasi dan disetujui (2026-10-11)
- **Phase 10:** Halaman akun mandiri (`/profile`), halaman alamat khusus (`/profile/addresses`), pusat notifikasi in-app (daftar + pengaturan) lewat ikon navbar - terimplementasi dan disetujui (2026-10-11)

**Catatan indeks:**
- "Terimplementasi (PH-XX)" berarti fitur sudah jalan dan terverifikasi; buktinya ada di `docs/04`.
- Rujukan `docs/04` dipakai untuk fitur yang belum punya bagian rinci di `docs/03`. Bagian rinci PH-01
  (AUTH-02/03, PROD-03/04/05; PROD-03 sebagai fitur storefront), PH-05 (VOUCH-01/02, NOTIF-01, INV-01),
  dan PH-06 (SHIP-02/03, ORDER-05..08, REPORT-01, CONFIG-01) telah ditulis lengkap di dokumen ini
  (ditulis retroaktif dari kode terimplementasi, 2026-10-15) ΓÇö utang dokumentasi untuk 17 fitur itu selesai.
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
| Email, password | aturan lama tidak berubah (email valid; password 8-72 karakter) | ├óΓé¼ΓÇ¥ |

Catatan pelaksanaan:

- Sisi klien menambah `inputMode`, `pattern`, dan filter saat mengetik untuk field angka (nomor HP, kode pos, kode OTP) di `AddressManager`, `CheckoutForm`, `OtpVerificationForm`, dan `TrackOrderForm`. Ini kenyamanan saja; server tetap penentu akhir.
- Semua pesan kesalahan form ditampilkan lewat `FormErrorAlert` (29 komponen form: alamat, checkout, profil, auth, keranjang, pembayaran, notifikasi, dan formulir admin) yang otomatis menggulir halaman ke tengah viewport tepat di pesan saat pesan muncul ├óΓé¼ΓÇ¥ tanpa scroll manual (permintaan pengguna 2026-10-11).
- Data lama yang sudah tersimpan tidak divalidasi ulang; aturan berlaku saat tulis berikutnya.
- Perubahan ini hasil permintaan pengguna 2026-10-11 ("semua field memperketat, nomor HP tidak boleh abjad") ├óΓé¼ΓÇ¥ dicatat di `docs/04` bagian 15.7.

---
## 1B. Aturan dialog konfirmasi aplikasi (berlaku semua fitur)

Aturan bersama untuk seluruh pesan konfirmasi yang menuntut keputusan pengguna (hapus item, tolak pesanan, cabut voucher, dsb). Diambil dari keputusan pengguna 2026-10-15: pesan konfirmasi tidak boleh memakai dialog bawaan browser (`window.confirm`) — tampilan mengikuti browser/OS, tidak bisa diberi komponen, dan tidak selaras dengan sistem UI yang sudah menyeragamkan galat lewat `Alert`/`FormErrorAlert`.

**Status: TERIMPLEMENTASI 2026-10-15** — komponen `src/components/ui/confirm-dialog.tsx` (`ConfirmDialog`) berdiri di atas shadcn `AlertDialog` (`src/components/ui/alert-dialog.tsx`, Radix `@radix-ui/react-alert-dialog`); ketiga pemakai pertama sudah ditukar (`DeleteButton` tombol hapus voucher, `ProductRowActions` aksi baris tabel produk, `TaxonomyManager` hapus kategori/brand) dan seluruh `window.confirm` di kode dicabut. Keputusan pengguna saat implementasi: memakai `AlertDialog` (bukan `Dialog`) sebagai dasar konfirmasi — fokus bawaan Radix jatuh ke tombol batal sehingga aksi destruktif tidak sengaja terpencet; dialog konten biasa (varian CART-05, pusat notifikasi, dst.) tetap memakai `Dialog`.

| Butir | Aturan |
| --- | --- |
| Komponen | Dialog aplikasi di atas shadcn `AlertDialog` (atau `Dialog` `ui/dialog.tsx` yang sudah ada) |
| Isi standar | Judul ringkas menyebut tindakan ("Hapus produk?" / "Tolak pesanan?"), deskripsi satu kalimat yang menjelaskan konsekuensi, tombol "Batal" + tombol aksi destruktif bervariant `destructive` |
| Proses | Tombol aksi nonaktif dengan label "Memproses..." saat permintaan berjalan; galat tampil ke ala dialog dengan pola `FormErrorAlert` |
| Menutup | Escape dan klik latar = batal, sama seperti Dialog yang sudah ada |
| Ketergantungan | `ui/dialog.tsx`/`ui/alert-dialog.tsx` (shadcn), pola `FormErrorAlert` |

Pemakai pertama yang diubah saat implementasi: `DeleteButton` (`window.confirm` di tombol hapus produk varian admin), `ProductRowActions` (aksi baris tabel produk), dan `TaxonomyManager` (hapus kategori/brand); setelah itu seluruh pemakai `window.confirm` lain dicabut satu per satu.

---

## 1C. Aturan unggah gambar aplikasi (UI seragam, drag-and-drop)

Aturan bersama untuk seluruh titik unggah gambar di sistem (galeri produk, bagan ukuran, gambar varian, bukti refund, logo/favicon/banner brand). **Status: terimplementasi (2026-10-15)** — komponen `src/components/ui/image-dropzone.tsx` menggantikan cara pemilihan berkas di keempat pemakai; kontrak server tidak berubah. Keputusan pengguna: "gue pengen UI seperti gambar, untuk upload gambar di sistem ini, baik itu gambar utama, varian, ataupun lainnya" — lampiran referensi: kotak upload bergaris putus-putus dengan ikon awan-unggah, teks ajakan, dan tombol utama "Browse Image".

Bentuk yang diidamkan (komponen konfirmasi visual mengikuti referensi pengguna):

- **Wadah dropzone:** kotak dengan garis pinggir putus-putus (`border-dashed`, sudut membulat, latar netral) yang menampung seluruh isi; seluruh wilayah kotak memakai tombol file dialog (klik di mana saja) dan menerima drag-and-drop file dari luar browser.
- **Ikon:** ikon unggah-awan (`Upload`, terpusat; lingkaran latar `muted` mengikuti punca 1B) di atas teks.
- **Teks ajakan:** kalimat utama "Pilih berkas atau tarik dan lepas ke sini." dan kalimat kedua menyebut berkas yang relevan: "Berkas JPG, PNG, SVG akan diterima." — daftar tipe di teks harus menyesuaikan tipe yang disetujui server per endpoint (lihat butir berikut), bukan teks keras generik.
- **Tombol utama:** satu tombol utama (variant default/primary) berlabel "Browse Image" di dalam dropzone — sama seperti referensi; klik tombol dan klik nama file membuka dialog file yang sama.
- **Saat drag melewati dropzone:** kotak menonjol (latar `muted/50` atau garis pinggir berwarna `primary`) supaya pembeli tahu lepasan akan ditampung.
- **Saat mengunggah:** tombol nonaktif + teks "Mengunggah..."; galat tampil lewat pola `FormErrorAlert`/`Alert` yang sudah ada (bagian 1B), seperti "Gagal unggah" saat ini.
- **Pratinjau dan pengelolaan hasil** (daftar file, hapus, ganti) memakai perilaku yang sudah ada di tiap komponen — UI bagian ini hanya mengganti cara memulihkan berkas ke sistem.
- **Kontrak server TIDAK berubah** — masih Uploadthing berikut endpoint dan plafon yang sudah ada (`src/lib/uploadthing/core.ts`): `productImage` (maks 4 MB, galeri 5 berkas, bagan ukuran dan varian 1 berkas, gambar), `refundProof` (maks 4 MB, 1 berkas), aset brand (`bannerImage` 4 MB, favicon 2 MB — batas masing-masing endpoint). Plafon ukuran/tipe yang dilanggar ditolak server; UI hanya menyaingi dengan menampilkan galatnya rapi.
- **Aksesibilitas:** dropzone punya role tombol/label jelas, aktif keyboard (Enter/Spasi membuka dialog file), fokus terlihat.

**Titik yang diganti saat implementasi (pemakai uploadthing saat ini):** `ImageUploader` (galeri produk maks 5 + bagan ukuran 1), `VariantImagePicker` (satu per baris varian), `AdminOrderActions` (unggah bukti refund), `AssetPicker`/`BrandSettingsForm` (`/site-admin/brand`: logo, favicon, banner). Komponen dasar satu place, mis. `src/components/ui/image-dropzone.tsx` (atau elemen shadcn `Input` file berpakaian), dipakai ulang tanpa menyalin-tempel.

**Ukuran kartu seragam (revisi pengguna lanjutan: "ukuran preview lainnya, samain dengan preview gambar utama"):** semua kartu preview memakai lebar **`w-48` (192px)** — galeri produk, gambar varian, dan bukti refund identik (`w-48`; yang tunggal dibungkus `flex justify-center` atau `mx-auto` agar terpusat), logo dan favicon brand juga `aspect-square w-48` (fit `contain`); hanya gambar banner yang tetap lebar lanskap (`h-28 w-full max-w-md`) karena fungsinya memang panoramik. **Kartu bagan ukuran selebar dropzone (revisi pengguna: "preview nya kurang besar sizenya" lalu "gimana kalo lebar preview di size chart ini selebar dropzonenya"):** kartu bagan ukuran memakai `w-full` — persis selebar dropzone di bawahnya (815px terukur pada form produk), sengaja lebih besar dari preview lain yang `w-48` karena isinya detail tabel. **Pengecualian rasio bagan ukuran (revisi pengguna: "untuk bagan ukuran lebih baik kalo rasionya berbeda, horizontal"):** kartu bagan ukuran (max 1) memakai kotak media `aspect-[4/3] sm:aspect-[16/9]` dengan `object-contain` — meniru persis tampilan storefront (`products/[slug]` bagian "Bagan Ukuran"), karena isinya detail tabel yang tidak boleh terkrop. **(Digantikan 2026-10-15 oleh aturan "pratinjau form admin meniru storefront" di bawah: kartu `w-48` seragam tidak lagi dipakai untuk galeri produk, banner, narasi, bagan ukuran, dan lookbook; gambar varian tetap kartu persegi.)**

**Dropzone nonaktif saat slot terisi (revisi pengguna: "pada gambar utama (4 gambar) dropzone disable, bagan size juga disable kalo udah ada isinya, sedangkan untuk varian sepertinya berbeda sendiri"):** seluruh titik unggah kini berperilaku sama — dropzone nonaktif (input + tombol "Browse Image" disabled, kotak redup) bila slot sudah terisi: galeri penuh 4, bagan ukuran terisi, varian terisi, bukti refund terunggah, dan aset brand terisi. Sub-teks berganti menjelaskan jalan keluar: "Sudah ada gambar. Hapus dulu untuk mengganti." / "Galeri penuh (N gambar). Hapus salah satu untuk mengganti." Penggantian berkas = klik "Hapus" pada kartu preview dulu, lalu unggah lagi. Galeri berpindah dari grid ke `flex flex-wrap justify-center` supaya satu berkas (bagan ukuran) dan banyak berkas (galeri) memakai satu wadah yang sama. **(Digantikan 2026-10-15 oleh aturan "dropzone disembunyikan saat slot penuh" di bawah: slot penuh kini tidak merender dropzone sama sekali, bukan sekadar `disabled`.)**

**Preview seragam (revisi pengguna 2026-10-15: "preview juga harus seragam"):** kartu preview memakai komponen `src/components/ui/image-preview.tsx` di seluruh titik unggah — kotak media netral (`bg-muted`) berisi gambar (`object-cover`/`object-contain` sesuai konteks), tombol "Hapus" pada baris yang sama, ukuran kotak media diatur pemanggil (`mediaClassName`). **Tanpa keadaan kosong:** bila belum ada berkas komponen tidak dirender sama sekali (revisi pengguna: "better gausah ada 'belum ada gambar' ... karena udah ada dropzone langsung") — dropzone di bawahnya sudah menjadi penanda, jadi teks "Belum ada gambar."/"Kosong"/"Belum ada berkas." dihapus dari semua titik. **Preview tunggal terpusat:** bagan ukuran (satu berkas) menampilkan kartu terpusat dalam pembungkus `flex justify-center`, dan preview tiap varian memakai kartu **sama persis** sesuai permintaan pengguna; bukti refund juga sama (lebar kartu `w-48` — lihat butir ukuran kartu seragam di atas). Penggantian: kartu galeri produk (`ImageUploader`), placeholder "Kosong" (`VariantImagePicker`), bukti refund (`AdminOrderActions` — sebelumnya tidak punya preview sama sekali), dan "Belum ada berkas." (`AssetPicker`, ukuran logo/favicon/banner ditentukan `BrandSettingsForm`).

**Bukti implementasi (2026-10-15):** `src/components/ui/image-dropzone.tsx` dibuat (kotak `border-dashed`, ikon `Upload` berlingkar `muted`, teks "Pilih berkas atau tarik dan lepas ke sini.", sub-teks tipe per endpoint, tombol "Browse Image" jalan keyboard; dragover menonjol `border-primary bg-muted/50`; unggahan berjalan `uploading` nonaktif + tombol "Mengunggah..."; galat tetap lewat `FormErrorAlert`). Keempat pemakai ditukar: `ImageUploader`, `VariantImagePicker`, `AdminOrderActions` (bukti refund), `AssetPicker` (dipakai `BrandSettingsForm`). Verifikasi: `tsc` exit 0, `pnpm lint` 0 error, uji browser `/admin/products/new` — 3 dropzone tampil, tombol lama hilang, dragover menyala, drop PNG valid mengunggah sukses (URL `.ufs.sh` muncul di pratinjau galeri), galat berkas rusak tampil lewat `FormErrorAlert`. Uji layar sentuh: sama seperti sebelumnya (klik kotak membuka dialog file). 
**Status tambahan 2026-10-15 — dropzone disembunyikan saat slot penuh (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: "kayaknya gua pengen dropzone dihapus jika gambar pada add product detail sudah penuh/dropzone sudah disable ... daripada cuma disable, di hide saja" (contoh: galeri utama penuh — bukan sekadar dropzone nonaktif, tapi hilang sama sekali sampai salah satu gambar dihapus). Perilaku berlaku untuk **semua dropzone yang sebelumnya berstatus disabled karena penuh**: galeri produk (maksimal `MAX_PRODUCT_IMAGES`), slot informasi/bagan ukuran (maks 1), gambar varian per baris varian (maks 1), bukti refund (maks 1), dan aset brand (logo/favicon per slot, banner). Aturannya:

- **Slot penuh → dropzone tidak dirender** (bukan `disabled`): kotak dropzone hilang dari DOM, yang tersisa kartu preview gambarnya (atau daftar preview galeri). Tidak ada kotak abu-abu yang mati memenuhi form.
- **Slot kosong/sebagian → dropzone tampil normal** (galeri: selama belum mencapai batas), tetap bisa diklik dan menerima drag-and-drop seperti sekarang.
- **Setelah Hapus salah satu gambar → dropzone muncul kembali** di tempatnya (transisi langsung di klien, tanpa reload).
- Sub-teks "Galeri penuh (N gambar). Hapus salah satu untuk mengganti." dan "Sudah ada gambar. Hapus dulu untuk mengganti." yang menemani dropzone **disabled jadi tidak diperlukan lagi** — hilang bersama dropzonnya; informasi "hapus dulu" cukup tersirat dari tombol Hapus di kartu preview.
- Kondisi mengunggah (nonaktif + "Mengunggah..."), dragover, dan galat `FormErrorAlert` tetap persis seperti aturan 1C — hanya keputusan tampil/sembunyi yang berubah.
- **Penerimaan:** isi galeri sampai batas → dropzone tidak ada di DOM (`querySelector` kotak `border-dashed` = nol untuk slot itu), preview tetap utuh; hapus satu gambar → dropzone tampil lagi tanpa reload; slot single (varian/bagan/refund) berisi satu gambar → dropzone hilang, setelah Hapus muncul lagi; nol perubahan pada server Uploadthing. **Bukti verifikasi kode (2026-10-16, sesi dokumentasi):** keempat pemakai memakai pola `url ? null : <dropzone>` — `ImageUploader` (komentar baris 12 dan blok render baris 118: "Slot penuh → dropzone tidak dirender sama sekali (aturan 1C)"), `VariantImagePicker:56`, `AdminOrderActions:101`, `AssetPicker:47`. Rincian: `docs/04` bagian 10 dan bagian 17 (TASK-116).

**Bukti implementasi (2026-10-15):** keempat pemakai dropzone mengganti `disabled={penuh}` menjadi render bersyarat: `ImageUploader` (`urls.length < max`), `VariantImagePicker` (`url ? null`), `AdminOrderActions` (bukti refund), `AssetPicker` (aset brand) — sub-teks "Sudah ada gambar..."/"Galeri penuh..." gugur, prop `disabled` pada `ImageDropzone` tidak lagi dipakai pemakai mana pun. Verifikasi: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), uji browser `/admin/products/new` — slot kosong menampilkan dropzone, setelah satu berkas terunggah dropzone hilang dari DOM dan hanya kartu preview + tombol Hapus tersisa, klik Hapus memunculkan dropzone lagi tanpa reload, konsol bersih. Rincian bukti: `docs/04` bagian 10.

**Status tambahan 2026-10-15 — pratinjau form admin meniru storefront (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: pratinjau di form admin harus punya layout dan rasio sama persis dengan storefront — "tidak cuma di seksi editorial saja, namun semuanya" — termasuk bagan ukuran ("bagan ukuran juga ikut"). `ImageUploader` menerima prop `layout` (`single`/`gallery`/`lookbook`) + `mediaClassName`/`fit`/`productName`; `Lookbook`/`LookbookItem` (`EditorialSections.tsx`) diekspor dan menerima `renderAction` supaya form memakai komponen storefront yang sama (storefront tidak mengirim prop itu sehingga tampilannya tidak berubah). Per slot: galeri = gambar utama persegi besar + strip thumbnail persegi (gambar selain yang sedang tampil — butir berikutnya); banner gambar = `aspect-video sm:aspect-[4/1]` `object-cover`; narasi = gambar 16:9 kolom kiri + textarea kolom kanan (`grid gap-6 sm:grid-cols-2`); bagan ukuran = kotak `aspect-[3/4] w-full max-w-sm mx-auto` `object-contain` mengikuti dialog "Bagan Ukuran" storefront (`next/image` `width={1200} height={1600}`), menggantikan kotak `aspect-[4/3] sm:aspect-[16/9]`; lookbook = komponen storefront; gambar varian tetap kartu persegi `w-48` (rasio sudah sama). Aturan "dropzone disembunyikan saat slot penuh" tetap berlaku. Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), rasio terukur di form edit sama dengan halaman produk (galeri utama 1.000, narasi 1.778, bagan ukuran 0.750, banner gambar 4.000, lookbook 1.146 + 1.778×3, varian 1.000), konsol bersih. Rincian bukti: `docs/04` bagian 10. Batas lebar (keputusan pengguna 2026-10-15: "kecilin ukuran container gambar utama di store admin, karena ukuran kelima gambarnya ngikutin container, jadi terlalu memenuhi layar"): pratinjau galeri di form admin dibatasi `w-full max-w-sm` (384px) sehingga gambar utama 384×384 dan strip thumbnail 87×87, dropzone galeri ikut selebar itu supaya sejajar; halaman storefront tidak dibatasi (tetap penuh). **(Revisi 2026-10-16: kotak bagan ukuran 3:4 di atas diganti rasio asli gambar dan dialog storefront ikut disamakan — lihat paragraf "rasio bagan ukuran disamakan" di bawah.)**

**Status tambahan 2026-10-15 — strip thumbnail tanpa gambar aktif (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: "di store admin, jadi keliatan malah bisa nambahin 6 gambar karena 1 gambar besar + 5 gambar kecil di bawahnya. padahal harusnya memang cuma 5 gambar utama, sedangkan di storefront 1 gambar besar + 4 gambar kecil". Baris thumbnail (pratinjau admin `GalleryPreview` dan galeri storefront `ProductGallery`) kini memuat **semua gambar kecuali yang sedang tampil di kotak besar**, sehingga jumlah kotak = jumlah gambar − 1 (5 gambar = 1 besar + 4 kecil) dan tidak ada gambar yang tampil dua kali. Penanda aktif (`aria-current`, `border-foreground ring-2 ring-ring`) tidak dipakai lagi di baris thumbnail karena gambar aktif tidak dirender di sana — gambar besar sudah menjadi penandanya. Klik thumbnail tetap mengganti gambar besar, dan slide yang tadi tampil masuk kembali ke baris. Lebar grid: `grid-cols-4` untuk ≤4 kotak, `grid-cols-5` saat tepat 5 kotak. Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; produk uji 5 gambar (`zz-uji-strip-5`, dibuat lewat API lalu dihapus: `POST` 201 → `DELETE` 200 `{deleted:true}` → `GET` 404) — storefront 5 slide → 4 kotak `grid gap-3 grid-cols-4` satu baris (207×207 px, gambar besar tidak ada di baris), pratinjau admin gambar utama 815×815 + 4 kotak satu baris dengan 5 tombol Hapus (persis 5 gambar); produk parfum (5 GALLERY + 3 gambar varian): pratinjau admin 1 besar + 4 kecil, storefront 8 slide → 7 kotak (`grid-cols-4`, dua baris 4+2); data pengguna tidak diubah.

**Status tambahan 2026-10-15 — Gambar Produk dan Bagan Ukuran berdampingan, satu baris dua kolom (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: "bikin container yang membungkus gambar produk dan bagan ukuran, jadi 1 baris 2 kolom". Di `ProductForm` kedua seksi (`Gambar Produk` dan `Bagan Ukuran`) dibungkus satu `<div className="grid gap-4 md:grid-cols-2">` sehingga tampil berdampingan dalam satu baris; tiap seksi tetap kartu sendiri (`rounded-xl border border-border bg-background p-6`) dan tata letak di dalamnya tidak berubah (galeri tetap dibatasi `max-w-sm`, bagan ukuran tetap `w-full` rasio asli gambar). Di layar sempit (`< md`) keduanya menumpuk kembali seperti semula. Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; form edit parfum: dua kartu 424px berdampingan pada baris yang sama (y sama), tinggi kedua kartu sama (634px), galeri 375×375 + 4 kotak 85×85 + 5 tombol Hapus, gambar bagan ukuran 357×447 dari berkas 736×920 (rasio asli, tanpa krop); form edit sneakers (2 galeri): kartu 424px sebaris, galeri 375×375 + 1 kotak 85×85 + dropzone 375×191. Rincian bukti: `docs/04` bagian 10.

**Status tambahan 2026-10-15 — urutan seksi form produk: Varian dipindah ke atas Seksi Editorial (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: "pindahin section varian, agar di atas seksi editorial". Urutan seksi form produk (tambah/edit) sekarang: Informasi Produk → Gambar Produk + Bagan Ukuran (satu baris dua kolom) → **Varian** → **Seksi Editorial (opsional)** → tombol Simpan/Batal. Blok Varian (152 baris) dipindah utuh tanpa perubahan isi — dibuktikan identik byte-per-byte terhadap versi sebelumnya (`headLines` = `workLines` = 152, `identik: true`), jumlah baris berkas tetap 659. Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; urutan heading terukur di form edit: Informasi Produk, Gambar Produk, Bagan Ukuran, Varian, Seksi Editorial (opsional); posisi y Varian 1513 < Seksi Editorial 3141; baris varian 4 = 4 varian produk di DB; tombol "Simpan Perubahan" tetap di akhir form. Rincian bukti: `docs/04` bagian 10.

**Status tambahan 2026-10-15 — tombol Hapus pratinjau gambar seragam gaya overlay (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: "image preview (tepatnya tombol hapus) bagan ukuran, varian, dan gambar narasi, gue pengen di samain kayak gambar produk ataupun lookbook". Sebelumnya ada dua gaya: pratinjau galeri dan lookbook memakai tombol kecil "Hapus" yang menempel di sudut kanan atas gambar, sedangkan pratinjau satu gambar (`ImagePreview`: bagan ukuran, narasi, banner, varian, bukti refund, aset brand) memakai `Button` ghost sebagai baris terpisah di bawah gambar sehingga tinggi kartunya ikut bergeser. Tombol sudut itu kini diekstrak menjadi komponen bersama `ImageRemoveButton` (`src/components/ui/image-remove-button.tsx`) dan dipakai `ImageUploader` (galeri + lookbook) sekaligus `ImagePreview` (semua slot satu gambar); baris tombol di `ImagePreview` dihapus sehingga kartunya hanya berisi kotak media + tombol overlay, dan kotak media diberi `relative` sebagai jangkar. Label aksesibilitas tombol: `Hapus gambar utama`, `Hapus gambar N` (thumbnail), `Hapus foto lookbook N`, dan `Hapus gambar` (slot satu gambar). Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; terukur di form edit parfum: galeri 5 tombol (utama 48×20 di `right-2 top-2`, 4 thumbnail 42×19), bagan ukuran 42×19 di sudut gambar 357×447, narasi 42×19 di sudut gambar 378×213, varian 4 tombol 42×19, lookbook 4 tombol 42×19; tidak ada lagi tombol Hapus gambar berposisi static (4 tombol static yang tersisa di seksi Varian adalah tombol hapus baris varian, bukan hapus gambar). Rincian bukti: `docs/04` bagian 10.

**Status tambahan 2026-10-15 — ukuran tombol Hapus disamakan dan pratinjau satu gambar tanpa kartu berpadding (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: "samain seluruh ukuran tombol hapusnya, hilangin juga container berborder dan paddingnya, agar benar benar sama kayak gambar produk dan lookbook". Dua sisa perbedaan dihapus: (a) tombol Hapus pada gambar utama galeri memakai override `right-2 top-2 text-xs` sehingga 48×20 sedangkan tombol lain 42×19 — override itu dihapus, jadi seluruh tombol Hapus gambar berukuran 42×19 (`text-[10px] px-1.5 py-0.5`, `right-1 top-1`, radius 4px); (b) `ImagePreview` tidak lagi dibungkus kartu `rounded-lg border border-border bg-background p-2` — kotak media itu sendiri yang bergaris (`rounded-lg border border-border bg-muted`, radius 10px, padding 0) sehingga bentuknya sama dengan kotak gambar pada pratinjau galeri dan lookbook. Prop `className` pemanggil (mis. `w-48 mx-auto`, `w-full`) digabung ke kotak media lewat `cn` (twMerge) sehingga penempatan tetap berlaku. Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; form edit parfum: 15 tombol Hapus gambar semuanya 42×19; kotak media varian 192×192 `mx-auto`, lookbook 192×108 dan 400×349, bagan ukuran 375×468, galeri utama 375×375, thumbnail 85×90; semua kotak padding 0px dan bergaris 0,8px; tidak ada lagi div `border border-border bg-background p-2` di form. Rincian bukti: `docs/04` bagian 10.

**Status tambahan 2026-10-15 — lebar pratinjau galeri mengikuti kartu induknya (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: "buat ukuran container content gambar utama di dalam gambar produk untuk nyesuaiin parentnya, karena container content di bagan ukuran berhasil menuhin seluruh container bagan ukuran". Batas `w-full max-w-sm` (384px) pada akar `ImageUploader` dihapus — batas itu dibuat saat seksi Gambar Produk masih selebar penuh form; setelah kedua seksi berdampingan (grid dua kolom) batas tersebut membuat kotak gambar utama tidak mengikuti lebar kartunya di layar lebar, sedangkan bagan ukuran (`w-full`) selalu memenuhi kartunya. Akar `ImageUploader` sekarang hanya `flex flex-col gap-3`, sehingga kotak gambar utama dan strip thumbnail mengikuti lebar isi kartu di semua ukuran layar. Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; pada viewport 1520px CSS (disimulasikan dengan zoom 0,6): dengan batas 384 (disimulasikan) akar 384 dan kotak gambar utama 384 sedangkan kotak bagan ukuran 673; setelah batas dihapus akar 673 dan kotak gambar utama 673 = kotak bagan ukuran 673; pada viewport 912px: kartu 424 (isi 376), akar 375, kotak gambar utama 375, kotak bagan ukuran 375, thumbnail 85×85, tombol Hapus 42×19. Rincian bukti: `docs/04` bagian 10.

**Status tambahan 2026-10-15 — jarak tombol Hapus ke border disamakan di seksi Gambar Produk (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: \"kayaknya tombol hapus khusus di gambar produk lebih mepet ke border daripada yang lainnya? coba cek dulu, jika iya baru sesuaikan\". Pengecekan (15 tombol Hapus di form produk; jarak visual diukur sebagai celah terdekat antara sudut tombol yang membulat 4px dan lengkungan border kotak): kotak gambar utama 2,65px — kotak memakai `rounded-xl` (14px) mengikuti carousel storefront sedangkan slot lain `rounded-lg` (10px) sehingga lengkungan sudutnya lebih masuk; thumbnail galeri 3,17px — tombol menempel pada wrapper yang tidak berborder (border ada di tombol di dalamnya) sehingga jaraknya 4px dari sisi luar border sementara slot lain 4,8px karena border induknya 0,8px; slot lain (bagan ukuran, varian, lookbook) 4,30px. Perbaikan: tombol di kotak gambar utama dan di thumbnail galeri digeser ke `right-[5px] top-[5px]`, default slot lain tetap `right-1 top-1`. Hasil ukur: gambar utama 4,06px, thumbnail 4,59px, slot lain 4,30px — selisih maksimal 0,29px (sebelum perbaikan 1,65px). Semua tombol tetap 42×19. Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih. Rincian bukti: `docs/04` bagian 10.

**Status tambahan 2026-10-15 — border radius seluruh kotak gambar disamakan jadi 16px (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: \"karena image preview ini layoutnya sama dengan storefront, harusnya menyamakan seluruh border radius untuk gambar deh, jadi gua pilih 16px dulu aja, terus agak geser tombol 'hapus' agar tidak terlalu mepet karena border radius lebih besar\". Sebelumnya pratinjau admin seragam `rounded-lg` (10px) kecuali kotak gambar utama galeri `rounded-xl` (14px, mengikuti carousel storefront), sementara storefront memakai 14px untuk gambar utama/banner/narasi dan 10px untuk thumbnail. Sekarang seluruh kotak gambar memakai `rounded-2xl` (16px): pratinjau admin (`ImagePreview`, `ImageDropzone`, `ImageUploader` gambar utama + thumbnail, `VideoHeroUploader`), halaman produk storefront (`ProductShowcase` galeri utama + thumbnail, `EditorialSections` narasi/banner gambar/banner video/lookbook), serta gambar produk di kartu produk, dialog varian, keranjang, dan daftar pesanan. Nilai 16px berasal dari `--radius-2xl` bawaan Tailwind (1rem) karena tema hanya menimpa `--radius-sm/md/lg/xl` (`--radius` = 0,625rem). Tombol Hapus ikut digeser karena lengkungan 16px lebih masuk: default `right-1.5 top-1.5` (6px) dan thumbnail galeri `right-[7px] top-[7px]` (wrapper-nya tidak berborder sehingga acuannya beda 0,8px). Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih; form produk: 11 kotak gambar semuanya radius 16px, celah sudut tombol seragam 4,65px (thumbnail 4,93px), tombol tetap 42×19; halaman produk storefront: galeri utama 865×865, banner 424×370, narasi 420×236, lookbook 424×239 dan 204×115, thumbnail 207×207 — semuanya 16px; kartu produk di `/products` 252×252 (16px). Rincian bukti: `docs/04` bagian 10.

**Status tambahan 2026-10-15 — tombol Hapus digeser lagi ke 8px/9px (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: \"tombol hapus masih terlalu mepet kanan atas\" (setelah pergeseran ke 6px/7px). Lengkungan `rounded-2xl` (16px) ternyata masih menyisakan jarak yang terasa mepet pada celah sudut 4,65px, jadi tombol digeser lagi: default `right-2 top-2` (8px, setengah radius) dan thumbnail galeri `right-[9px] top-[9px]` (wrapper-nya tidak berborder sehingga acuannya beda 0,8px). Hasil ukur di form produk: semua tombol 42×19; jarak dari sisi luar border 8,8px (thumbnail 9px) dan celah sudut 7,47px (thumbnail 7,76px) — seragam. Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih. Rincian bukti: `docs/04` bagian 10.
**Status tambahan 2026-10-16 — rasio bagan ukuran disamakan jadi rasio asli gambar di pratinjau admin dan dialog storefront (TERIMPLEMENTASI 2026-10-16):** keputusan pengguna setelah pemeriksaan dokumen: (1) pakai **rasio asli gambar**, bukan kotak 3:4; (2) **ya**, dialog "Bagan Ukuran" storefront ikut disamakan kotaknya; (3) baris spek PROD-03 yang basi ditandai tergantikan. Sisi admin: pratinjau memakai `mediaClassName="w-full"` + `imageClassName="mx-auto max-h-[70vh] w-auto"` (`ImageUploader` dan `ImagePreview` menerima prop `imageClassName`; `max-width: 100%` bawaan membuat gambar mengecil mengikuti lebar kartu tanpa mengubah rasio berkas). Sisi storefront: dialog `SizeChartTrigger` mengganti `width={1200} height={1600}` (kotak tetap 3:4) dengan `width={0} height={0} sizes="100vw"` + `h-auto w-full` sehingga kotaknya mengikuti rasio intrinsik berkas. Hasil ukur: pratinjau admin 375×468 (0.801, gambar 373×467 dari berkas 736×920) dan dialog storefront 607×759 (0.800) — rasio kedua sisi sama dan keduanya tanpa krop/letterbox; wrapper dialog tetap `max-h-[70vh]` + scroll (759 > 452). Bukti: `tsc` exit 0, `pnpm lint` 0 error (12 warning lama), konsol bersih. Rincian bukti: `docs/04` bagian 10.


---

## 1D. Aturan toast notification aplikasi (pengganti pesan sistem) — belum diimplementasikan

Aturan bersama untuk pola pesan umpan balik di seluruh sistem (storefront, admin, site-admin). **Status: belum diimplementasikan** (dokumentasi dulu, 2026-10-15). Keputusan pengguna: "gua pengen menggunakan toast notification/message untuk menggantikan hampir seluruh pesan di sistem" — **rincian implementasi (varian toast, posisi, durasi, gaya, daftar titik yang diganti) akan dilampirkan pengguna pada saat mau implementasi**, jadi bagian ini sengaja dibiarkan ringkas dan TIDAK menentukan pilihan visual.

Ketentuan dasar yang berlaku sejak sekarang sampai implementasi datang:

- **Sasaran: hampir semua pesan sistem** — sukses, gagal, peringatan, dan info — berpindah dari pola sebaris/inline (`FormErrorAlert`, pesan kecil di bawah tombol, dan sejenisnya) menjadi toast global satu komponen (misal `ui/toast.tsx` shadcn atau `sonner`; diputus saat implementasi).
- **Yang TIDAK diganti:** pesan validasi per-field di form (tetap inline dekat input, tetap dari skema `zod`), empty state (pesan kosong seperti "keranjang kosong"), dialog konfirmasi (aturan bagian 1B), dan pesan yang memang konten halaman (mis. badge "Stok habis"). Di luar pengecualian itu, anggap semua titik pesan kandidat toast.
- **Inventaris titik dibuat saat implementasi**: daftar kejadian (berhasil dibuat keranjang, gagal OTP, produk tersimpan, bukti refund terkirim, dan seterusnya) diambil dari pemacek `FormErrorAlert` dan pesan sukses yang ada hari ini, lalu dipetakan satu per satu; pemetaan dicatat di bagian ini atau `docs/04` bagian 10 sebelum eksekusi.
- **Kontrak tampilan menunggu lampiran pengguna** — butir terbuka yang sengaja tidak dipastikan di sini: komponen (toast shadcn vs sonner), posisi di layar, jumlah maksimum bertumpuk, durasi tampil, apakah boleh membawa aksi utama (undo/tautan), dan perilaku saat navigasi halaman.
- **Aksesibilitas:** toast terbaca pembaca layar (`aria-live`/role `status`), bisa ditutup manual, tidak memotong fokus pengguna; pesan yang terikat posisi form (mis. galat field) tetap inline bila toast tidak memadai.

Tindak lanjut: tunggu lampiran detail dari pengguna, lalu bagian ini boleh dipecah menjadi spek implementasi (task + AC) sebelum dieksekusi; status berubah menjadi "Terimplementasi" hanya setelah bukti di `docs/04`.


## 1E. Aturan skeleton dan indikator loading halaman — belum diimplementasikan

Aturan bersama untuk keadaan "sedang memuat" di seluruh halaman (storefront, admin, site-admin). **Status: belum diimplementasikan** (dokumentasi dulu, 2026-10-16). Dipicu pertanyaan pengguna: "skeletonnya bawaan atau bukan, karena kalo bukan maka harus ada penyesuaian agar banyak halaman yang memerlukannya." Jawaban audit: **skeleton bukan bawaan Next.js** — Next hanya menyediakan mekanismenya (fallback `Suspense` yang tampil saat konten di-stream, dan segmen `loading.tsx`), sedangkan tampilan skeleton-nya sendiri ditulis tangan per halaman. Karena itu baru ada di sedikit titik dan halaman lain memerlukan penyesuaian.

**Hasil audit 2026-10-16 (kondisi sekarang):**

- **Sudah punya skeleton (3 titik):** halaman utama `src/app/(storefront)/page.tsx` (`ProductGridSkeleton`, 8 kartu placeholder) sebagai fallback `Suspense` grid rekomendasi; katalog `src/app/(storefront)/products/page.tsx` (`ProductsSkeleton`: baris judul + 8 kartu) sebagai fallback `Suspense` pembungkus seluruh isi halaman; `src/components/layout/Header.tsx` (3 fallback kecil: logo `h-9 w-9`, nama brand `h-9 w-24`, search `h-9 w-64`). `MaintenanceBanner` di layout storefront juga dibungkus `Suspense` tetapi fallback-nya `null` (tanpa tampilan, bukan skeleton).
- **Belum ada skeleton:** semua halaman lain — detail produk `/products/[slug]`, `/cart`, `/checkout`, `/orders` beserta detail/invoice/tracking, `/track-order`, `/profile` beserta addresses, seluruh halaman auth, dan seluruh admin/site-admin. Tidak ada satu pun berkas `loading.tsx` di seluruh `src/app`.
- **Perilaku tanpa skeleton (yang dirasakan pengguna):** pada hard load, halaman menampilkan keadaan kosong sampai render server siap — pada `/products` terukur: skeleton sudah ada di byte 3.432 sedangkan konten asli baru muncul di byte 57.569, jadi halaman ber-skeleton menampilkan placeholder lebih dulu sementara halaman tanpa skeleton mengosongkan layar. Pada navigasi klien, halaman lama tetap tampil sampai payload baru siap, tanpa penanda apa pun (Next.js tidak punya indikator navigasi/progres bawaan).

**Ketentuan saat diimplementasikan:**

- **Sasaran:** setiap halaman yang membaca data request-time (cookie/sesi, `searchParams`, query database) wajib menampilkan tampilan sementara yang mencerminkan kerangka halaman itu, bukan layar kosong.
- **Bentuk skeleton:** meniru kerangka halaman aslinya (judul, baris filter/aksi, kartu atau kolom placeholder `animate-pulse`) dengan **ukuran sama seperti konten aslinya** agar tidak ada lompatan tata letak saat konten datang; gaya mengikuti pola yang sudah ada (`bg-muted/40`, `rounded-xl border border-border`, tinggi kartu `h-72`) supaya seragam dengan homepage dan katalog.
- **Mekanisme per halaman, dua pilihan bawaan Next:** (a) `Suspense` per bagian — bagian yang datanya lambat dipecah sendiri sehingga judul/aksi tampil duluan sementara bagian berat (grid, tabel) yang menunggu; (b) `loading.tsx` per route — satu skeleton untuk seluruh halaman. Pilihan dicatat per halaman saat implementasi; isi skeleton tetap ditulis tangan pada kedua kasus.
- **Shell tetap tampil:** header, footer, dan layout tidak ikut skeleton — hanya isi `<main>` (pola katalog sekarang).
- **Prioritas tahap awal (storefront):** `/cart`, `/checkout`, `/orders` (+ halaman detail), `/products/[slug]`, dan `/profile` — halaman yang paling terasa lambat karena membaca sesi lalu query. Admin/site-admin dan halaman auth menyusul; untuk auth cukup penanda tombol (`LoginForm`/`RegisterForm` sudah memakai label "Memproses..." + tombol nonaktif saat submit) sehingga kebutuhannya berbeda dari skeleton halaman.
- **Aksesibilitas:** skeleton bersifat `aria-hidden` atau wadahnya memakai `aria-busy="true"`, supaya pembaca layar tidak membaca kotak placeholder sebagai konten.

**Pertanyaan terbuka:**

- Perlu indikator global untuk navigasi klien (mis. garis progres tipis di atas layar) sebagai pelengkap skeleton, atau cukup skeleton per halaman?
- Detail produk `/products/[slug]`: skeleton penuh meniru layout galeri + kolom informasi (lebih banyak pekerjaan) atau versi sederhana saja?
- Admin/site-admin masuk tahap berapa, mengingat saat ini semua halaman admin tanpa skeleton?

Tindak lanjut: saat disetujui, pecah menjadi task per kelompok halaman di `docs/04` beserta bukti verifikasinya; status bagian ini berubah menjadi "Terimplementasi" hanya setelah bukti terisi di `docs/04`. Mengikuti pola 1D: dokumentasi dulu, menunggu persetujuan eksekusi.

## <a name="auth-01"></a>AUTH-01 ├óΓé¼ΓÇ¥ Guest OTP Verification

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-01 ├óΓé¼ΓÇ¥ Guest OTP Verification |
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

Tidak berlaku ├óΓé¼ΓÇ¥ no status transition (single-step verification).

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
- **Ketergantungan:** Twilio Verify (Trial gratis untuk dev ├óΓé¼ΓÇ¥ 40 verifikasi; production setelah upgrade akun)

### 13. Pertanyaan terbuka

Tidak ada ├óΓé¼ΓÇ¥ ready for implementation.

---

## <a name="auth-02"></a>AUTH-02 ΓÇö Customer Registration

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-02 ΓÇö Customer Registration |
| Modul | MOD-AUTH |
| Tujuan | Menyediakan pendaftaran akun Customer manual dengan email + password, tanpa verifikasi, langsung berlanjut ke sesi aktif |
| Aktor utama | Pengunjung publik (belum login) |
| Status | Terimplementasi (PH-01) |
| Referensi PRD | PRD 2.2 ("Dapat registrasi manual"), PRD 4.1 |
| Referensi SDD | SDD 10 (OWASP A07 ΓÇö bcrypt, pesan duplikat spesifik), SDD 8 (format respons API seragam) |

Bukti `docs/04` bagian 4.x: TASK-06 ("Selesai ΓÇö `POST /api/auth/register` ΓåÆ `201`, user dibuat, bisa login"), AC-AUTH-02-01; keputusan perubahan scope 2026-10-10 (input nomor HP dihapus dari form registrasi, `docs/04` bagian 10).

### 2. Prasyarat dan pemicu

- **Titik masuk:** link "Daftar sekarang" dari `/login`, atau langsung `/register`
- **Pemicu:** pengunjung mengisi form "Buat Akun {brand.brandName}" lalu klik "Daftar"
- **Jika tidak terpenuhi:** `platform.registrationEnabled = false` ΓåÆ tampil Alert `variant="destructive"` "Pendaftaran sedang ditutup. Silakan coba lagi nanti." (form tidak dirender); API mengembalikan `403 REGISTRATION_DISABLED`

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Pengunjung publik | Registrasi | `POST /api/auth/register` (tanpa sesi) | `403 REGISTRATION_DISABLED` bila pendaftaran ditutup Site Admin |
| Semua role yang sudah login | Registrasi ulang | - | Email/HP duplikat ditolak `409 EMAIL_TAKEN` / `409 PHONE_TAKEN` |

### 4. Input dan validasi

Schema: `registerSchema` (`src/lib/auth/validation.ts`). Catatan: field `phone` tetap ada di schema (`.optional()`, backward compatible) tapi **tidak ada input HP di form** sejak keputusan 2026-10-10.

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| name | String | Ya | `personNameSchema`: trim, 1..100, `PERSON_NAME_REGEX` (`/^[A-Za-z\u00C0-\u024F' .-]+$/`, huruf + `' .-`), harus mengandung huruf | "Nama wajib diisi" / "Nama hanya boleh berisi huruf" / "Nama maksimal 100 karakter" |
| email | String | Ya | trim, lowercase, `.email()`, maks 255 | "Email wajib diisi" / "Email tidak valid" / "Email maksimal 255 karakter" |
| password | String | Ya | min 8, maks 72 | "Password wajib diisi" / "Password minimal 8 karakter" / "Password maksimal 72 karakter" |
| confirmPassword | String (klien) | Ya (klien saja) | dicocokkan di `RegisterForm` sebelum kirim; tidak dikirim ke API | "Konfirmasi password tidak cocok" |
| phone | String (API only) | Tidak | `phoneSchema`: regex `[\d+()\-. ]+`, normalisasi `normalizePhone`, refine `/^\+62\d{8,11}$/` | "Nomor HP wajib diisi" / "Nomor HP tidak valid" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Pengunjung buka `/register` | Halaman membaca `getPlatformSettings()` + `getBrandSetting()` | Form tampil bila pendaftaran terbuka |
| 2 | Klik "Daftar" | `registerSchema.safeParse` di klien; gagal ΓåÆ pesan issue pertama | Tidak ada request keluar |
| 3 | | `POST /api/auth/register` ΓåÆ `201 {"id","name","email"}` | User dibuat, `password` di-hash bcrypt (10 rounds), `role: "CUSTOMER"` |
| 4 | Form lanjut `signIn("credentials", { identifier: email, password, redirect: false })` | Sesi dibuat | Akun langsung login |
| 5 | `POST /api/cart/sync` (dilewati bila gagal, `.catch(() => null)`) | - | Keranjang guest digabung (MOD-CART) |
| 6 | `router.replace("/")` + `router.refresh()` | - | Masuk ke beranda sebagai Customer |

### 6. Output dan perubahan data

- **Data dibuat:** baris `User` (`name`, `email`, `phone` opsional null, `password` hash bcrypt, `role: "CUSTOMER"`) via `createCustomer`
- **Data tidak diubah:** `PlatformSettings.registrationEnabled` hanya dibaca
- **Kondisi akhir:** sesi NextAuth aktif, cookie session terbentuk
- **Setelah reload:** navbar menampilkan akun Customer; akses fitur customer terbuka

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| `registrationEnabled = false` | Halaman menampilkan Alert merah, form disembunyikan | Tidak bisa mendaftar |
| `signIn` gagal sesudah `201` | Pesan "Akun dibuat, silakan masuk lewat halaman login" | Akun tetap ada; user diarahkan ke `/login` |
| Keranjang sync gagal | `.catch(() => null)` ΓÇö diabaikan | Login tetap berhasil |
| Dua request mendaftar email sama bersamaan (race) | Prisma error `P2002` tertangkap, `meta.target` membedakan field | `409 EMAIL_TAKEN` / `409 PHONE_TAKEN` |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Pendaftaran ditutup | `403 REGISTRATION_DISABLED` "Pendaftaran sedang ditutup" | Coba lagi nanti |
| Body bukan JSON / field tidak valid | `400 VALIDATION_ERROR` (pesan Zod issue pertama, `field` berisi path) | Perbaiki form |
| Email sudah dipakai | `409 EMAIL_TAKEN` "Email sudah terdaftar" (`field: "email"`) | Gunakan email lain / login |
| Nomor HP sudah dipakai | `409 PHONE_TAKEN` "Nomor HP sudah terdaftar" (`field: "phone"`) | Gunakan nomor lain |
| Error tak terduga | `500 INTERNAL_ERROR` "Terjadi kesalahan, coba lagi" (detail hanya ke log) | Coba lagi |

### 9. Perilaku UI

- **Halaman:** `/register` (Server Component, `metadata.title = "Daftar"`, `instant = false`)
- **Elemen:** Nama Lengkap (`autoComplete="name"`, max 100), Email (`type="email"`, max 255), Password (min 8, max 72, `autoComplete="new-password"`), Konfirmasi Password, tombol "Daftar" / "Memproses..."

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Form aktif | Isi lalu kirim |
| Kirim | Tombol nonaktif "Memproses..." | Tunggu |
| Duplikat/galat | `FormErrorAlert` dengan pesan API (Bahasa Indonesia) | Perbaiki lalu coba lagi |
| Sukses dan auto-login gagal | Pesan "Akun dibuat, silakan masuk lewat halaman login" | Ke `/login` |
| Sukses penuh | Alihkan ke `/` | Selesai |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-AUTH-02-01 | Pendaftaran terbuka | Submit data valid | `201 {"id","name","email"}`; akun langsung bisa login (sudah diverifikasi via curl, `docs/04` bagian 4.x) |
| AC-AUTH-02-02 | Email sudah terdaftar | Registrasi ulang | `409 EMAIL_TAKEN` "Email sudah terdaftar" |
| AC-AUTH-02-03 | Password 7 karakter | Submit | `400 VALIDATION_ERROR` "Password minimal 8 karakter" |
| AC-AUTH-02-04 | Pendaftaran ditutup | Buka `/register` | Alert "Pendaftaran sedang ditutup...", tanpa form |
| AC-AUTH-02-05 | Password hash tersimpan | Cek DB | Kolom `password` bcrypt (10 rounds), bukan plaintext |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | `{"name":"Customer Uji","email":"customer.uji@example.com","password":"rahasia123"}` | `201` + sesi | AC-AUTH-02-01 |
| Duplikat | email sama dengan akun lain | `409 EMAIL_TAKEN` | AC-AUTH-02-02 |
| Nama tak wajar | `name: "0812xxx"` | `400 VALIDATION_ERROR` "Nama hanya boleh berisi huruf" | - |

### 12. Batas fitur

- **Termasuk:** registrasi email+password, hashing bcrypt, cek duplikat email/HP (cek Prisma + race P2002), auto sign-in setelah daftar, gerbang `registrationEnabled`
- **Tidak termasuk:** verifikasi email (`POST /api/auth/verify-email`, CUST-03/PH-10), OTP nomor HP (AUTH-01), set password dari guest checkout (AUTH-04), lupa/reset password (AUTH-05), field phone di form (dihapus 2026-10-10)
- **Ketergantungan:** MOD-PLATFORM (`getPlatformSettings`), MOD-BRAND (`getBrandSetting` untuk judul kartu), MOD-CART (sync keranjang)

### 13. Pertanyaan terbuka

- Tidak ada (keputusan 2026-10-10 soal input HP sudah tuntas; `phone` di schema API dipertahankan untuk backward compatibility).

**Rujukan kode:**

- `src/app/api/auth/register/route.ts` ΓÇö handler `POST`, kode error exact (`REGISTRATION_DISABLED`, `EMAIL_TAKEN`, `PHONE_TAKEN`), penanganan race P2002.
- `src/lib/auth/validation.ts` ΓÇö `registerSchema` dan semua pesan Zod.
- `src/components/auth/RegisterForm.tsx` ΓÇö alur klien: validasi confirmPassword, auto `signIn`, cart sync, redirect `/`.
- `src/app/(auth)/register/page.tsx` ΓÇö halaman, gerbang `registrationEnabled`, teks Alert.
- `src/lib/auth/queries.ts` ΓÇö `createCustomer` (hash + `role: "CUSTOMER"`), `findUserByEmail`/`findUserByPhone`.
- `src/lib/utils/validation.ts` ΓÇö `PERSON_NAME_REGEX`, `personNameSchema`, `phoneSchema`, `normalizePhone`.

---

## <a name="auth-03"></a>AUTH-03 ΓÇö Customer Login

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-03 ΓÇö Customer Login |
| Modul | MOD-AUTH |
| Tujuan | Autentikasi Customer (dan admin) dengan identifier email atau nomor HP + password, lalu mengarahkan ke halaman sesuai role |
| Aktor utama | Customer; Store Admin dan Site Admin memakai form yang sama |
| Status | Terimplementasi (PH-01) |
| Referensi PRD | PRD 2.2 ("Harus login untuk akses fitur customer"), PRD 4.1 |
| Referensi SDD | SDD 10 (OWASP A07 ΓÇö pesan generik anti-enumeration, bcrypt) |

Bukti `docs/04` bagian 4.x: TASK-04 ("Setup auth: NextAuth.js v5 ... Login admin & customer ΓåÆ `302` + sesi berisi `role`"), TASK-07 ("Login customer ΓåÆ sesi `role: CUSTOMER`"), AC-AUTH-03-01; keputusan 2026-10-12 atribut `autoComplete` (`docs/04` bagian 10).

### 2. Prasyarat dan pemicu

- **Titik masuk:** `/login` (tautan "Daftar sekarang", "Lupa password?"), serta redirect saat mengakses halaman terproteksi
- **Pemicu:** submit form "Masuk ke {brand.brandName}"
- **Jika tidak terpenuhi:** kredensial salah / akun tidak ada / akun `GUEST` / akun dinonaktifkan (`deactivatedAt` terisi) ΓåÆ pesan "Email/No. HP atau password salah"

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Customer dengan password | Login | NextAuth provider `credentials` (`signIn("credentials", { redirect: false })`) | - |
| Akun GUEST | Login | - | Ditolak (`return null` di `authorize`) |
| Akun dinonaktifkan Site Admin | Login | - | Ditolak (`user.deactivatedAt` ΓåÆ null) |

### 4. Input dan validasi

Schema: `loginSchema` (`src/lib/auth/validation.ts`), dipakai di `authorize(credentials)`.

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| identifier | String | Ya | trim, 1..255; mengandung `@` ΓåÆ `{ kind: "email" }` (lowercase); selain itu dicoba dengan `phoneSchema` (normalisasi +62, refine `/^\+62\d{8,11}$/`); keduanya gagal ΓåÆ `kind: "invalid"` | "Email atau nomor HP wajib diisi" / "Format email atau nomor HP tidak valid" |
| password | String | Ya | min 1 | "Password wajib diisi" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Isi identifier + password, klik "Masuk" | `loginSchema.safeParse` di `authorize` | Data valid |
| 2 | System | `findUserByEmail` atau `findUserByPhone` sesuai `kind` (nomor dinormalisasi `normalizePhone` agar cocok format `+62` tersimpan) | User ditemukan |
| 3 | System | `verifyPassword` (bcrypt.compare); bila user tidak punya `password` ΓåÆ `wasteTimeLikeVerify` (hash dummy, anti time-based enumeration) | Password terverifikasi |
| 4 | System | Role bermakna; token JWT berisi `id`, `role`, `name`, `email` (callback `jwt`) | Sesi terbentuk |
| 5 | Klien | `getSession()` ΓåÆ `POST /api/cart/sync` (dilewati bila gagal) | Keranjang guest digabung (CART-04) |
| 6 | Klien | `router.replace(role === "STORE_ADMIN" ? "/admin/products" : role === "SITE_ADMIN" ? "/site-admin" : "/")` + `router.refresh()` | Masuk sesuai role |

### 6. Output dan perubahan data

- **Hasil:** sesi NextAuth (cookie) berisi `{ id, name, email, role }`
- **Data dibaca:** `User` (email/phone/password/role/`deactivatedAt`); tidak ada penulisan data pengguna
- **Setelah reload:** `session.user.role` diakses server; guard (`requireStoreAdmin` dll.) membaca ulang `role` dan `deactivatedAt` dari DB (`findUserAccessById`)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Keranjang guest ada | `POST /api/cart/sync` dipanggil setelah `getSession()` | Digabung ke keranjang customer |
| Role STORE_ADMIN login | Redirect ke `/admin/products` | Panel admin |
| Role SITE_ADMIN login | Redirect ke `/site-admin` | Panel platform |
| Sync keranjang gagal | `.catch(() => null)` ΓÇö diabaikan | Login tetap berhasil |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Identifier/password tidak lolos Zod | `authorize` return `null` ΓåÆ `result.error` | Pesan "Email/No. HP atau password salah" |
| Email/nomor tidak terdaftar | `wasteTimeLikeVerify` lalu `null` (waktu respons seragam, OWASP A07) | Pesan sama generik |
| Password salah | `null` | Pesan sama generik |
| Akun GUEST atau dinonaktifkan | `null` | Pesan sama generik |
| Error jaringan | `catch` ΓåÆ `setError("Terjadi kesalahan, coba lagi")` | Coba lagi |

### 9. Perilaku UI

- **Halaman:** `/login` (metadata title "Masuk"; judul kartu "Masuk ke {brand.brandName}"; deskripsi "Gunakan email atau nomor HP yang terdaftar.")
- **Elemen:** label "Email atau Nomor HP" (`autoComplete="username"`, `maxLength={255}`), "Password" (`type="password"`, `autoComplete="current-password"`), tombol "Masuk" / "Memproses..."

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Form aktif | Isi lalu kirim |
| Kirim | Tombol nonaktif "Memproses..." | Tunggu |
| Salah kredensial | `FormErrorAlert` "Email/No. HP atau password salah" | Coba lagi |
| Berhasil | Redirect sesuai role | Lanjut belanja/admin |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-AUTH-03-01 | Akun Customer valid | Login | `302` ΓåÆ `/`; sesi berisi `name`, `role: "CUSTOMER"`, `id` (diverifikasi via curl, `docs/04` bagian 4.x) |
| AC-AUTH-03-02 | Password salah | Login | Pesan "Email/No. HP atau password salah" ΓÇö tidak membedakan identifier vs password |
| AC-AUTH-03-03 | Akun GUEST (hanya OTP) | Login | Ditolak dengan pesan yang sama |
| AC-AUTH-03-04 | Login via nomor HP "0812-xxx" | Login | Dinormalisasi `+62...`, cocok kolom `phone` |
| AC-AUTH-03-05 | Customer login dengan keranjang guest | Login | `POST /api/cart/sync` dipanggil; item tampil di keranjang |
| AC-AUTH-03-06 | Akun dinonaktifkan (`deactivatedAt` terisi) | Login | Ditolak |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid email | `identifier: "customer.uji@example.com"` + password | Sesi CUSTOMER, redirect `/` | AC-AUTH-03-01 |
| Valid nomor | `identifier: "0812xxxx5678"` + password | Dinormalisasi `+62...`, sesi terbentuk | AC-AUTH-03-04 |
| Salah | password salah | "Email/No. HP atau password salah" | AC-AUTH-03-02 |

### 12. Batas fitur

- **Termasuk:** login credentials email atau nomor HP + password, redirect berbasis role, merge keranjang guest, perlindungan anti-enumeration
- **Tidak termasuk:** login OTP (AUTH-01 guest), lupa/reset password (AUTH-05), set password guest (AUTH-04), penyegaran kontak sesi milik CUST-03 (callback `jwt trigger "update"`, PH-10)
- **Ketergantungan:** NextAuth v5, MOD-CART (CART-04), MOD-BRAND (judul kartu), MOD-PLATFORM (penonaktifan akun SITE-04)

### 13. Pertanyaan terbuka

- Tidak ada.

**Rujukan kode:**

- `src/lib/auth/index.ts` ΓÇö provider `credentials`, `authorize`, callback `jwt`, token `role`/`id`.
- `src/lib/auth/validation.ts` ΓÇö `loginSchema` lengkap dengan transform `{ kind }` dan pesan exact.
- `src/lib/auth/queries.ts` ΓÇö `findUserByEmail` / `findUserByPhone` (pencocokan per kolom).
- `src/lib/auth/password.ts` ΓÇö `verifyPassword`, `wasteTimeLikeVerify`, `BCRYPT_ROUNDS`, `DUMMY_HASH` (alasan anti-enumeration di komentar).
- `src/components/auth/LoginForm.tsx` ΓÇö alur klien `signIn` redirect false, `getSession`, cart sync, redirect role-based, pesan error exact, atribut `autoComplete`.
- `src/app/(auth)/login/page.tsx` ΓÇö halaman Masuk, tautan `/forgot-password` dan `/register`.

---

## <a name="prod-01"></a>PROD-01 ├óΓé¼ΓÇ¥ Product CRUD (Store Admin)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PROD-01 ├óΓé¼ΓÇ¥ Product CRUD (Store Admin) |
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
| Site Admin | None ├óΓé¼ΓÇ¥ konfigurasi platform (PRD 2.4), bukan produk | None | 403 Forbidden |
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
| images | URL[] | Ya (min 1) | Empty | Max 5 (`MAX_PRODUCT_IMAGES`), tiap item `{ url, sortOrder? }`, URL valid; berkas diunggah klien ke Uploadthing sebelum simpan (4MB per berkas) | "Minimal 1 gambar" |
| sizeChartUrl | URL | Tidak | "" | URL valid, maks 500 karakter, maks 1 gambar | "URL bagan ukuran tidak valid" |
| variants | Array | Ya | [] | Min 1, SKU unique, price > 0, stock >= 0 | "Minimal 1 variant" |
| variants[].imageUrl | URL | Tidak | null | URL valid, opsional ├óΓé¼ΓÇ¥ 1 gambar per varian | "URL gambar tidak valid" |

**Aturan SKU (varian):** `variants[].sku` wajib diisi dan divalidasi `productVariantSchema` (`src/lib/products/validation.ts`): hasil `trim`, panjang 1-64 karakter, hanya karakter `[A-Za-z0-9._-]` (`SKU_REGEX` di `src/lib/utils/validation.ts`); pesan UI: "SKU hanya boleh huruf, angka, titik, minus, dan garis bawah". Kolom `ProductVariant.sku` bersifat **`@unique` global** (`prisma/schema.prisma`): satu SKU tidak boleh dipakai ulang oleh produk/varian mana pun, dan pencocokan peka huruf besar-kecil (default Postgres), jadi `kp-001` dan `KP-001` adalah dua baris berbeda. Benturan menyebabkan kegagalan simpan dengan pesan "SKU sudah digunakan" (`POST /api/admin/products`, `PATCH /api/admin/products/[id]`), bukan dibuat unik otomatis.

**Format contoh SKU (konvensi tim, mengikuti seeder `prisma/seed.ts`):** pola `INISIAL-PROD-VARIAN` huruf besar dengan pemisah `-`: `KP-30S-M` (Kaos Polos, Size M), `KF-LP-L` (Kemeja Flanel, Size L), `SN-CV-40` (Sneakers, Size 40), `TB-BSC-BLK` (Topi Baseball Basic, Hitam), `TS-KNV-STD` (Tas, Standard - Khaki). Pola ini konvensi, bukan tuntutan validasi — sistem menerima huruf kecil, titik, atau garis bawah selama karakternya dalam kelompok regex di atas. SKU ditampilkan di halaman pesanan/invoice ("SKU {sku}"), jadi format singkat yang mudah dibaca disarankan; keterangan SKU di bagian ini menjadi acuan penulisan `ProductForm` (label "SKU", teks bebas tanpa masker).

**Status:** terimplementasi (2026-10-15, UI direvisi atas masukan pengguna). Validasi Zod, unique konstrain, dan pesan benturan sudah ada sejak implementasi PROD-01; petunjuk format SKU di form admin kini berupa ikon info di samping label SKU tiap baris varian (`ProductForm`): diklik/tahan membuka popover berisi aturan karakter, batas 64 karakter, keunikan global, dan format disarankan "inisial produk - kode produk - varian" dengan contoh `KP-30S-M` (Kaos Polos 30s, ukuran M; disingkat pola `INISIAL-PROD-VARIAN`) — menggantikan teks bantuan panjang yang merusak tata letak form. Komponen baru `src/components/ui/popover.tsx` (Radix `@radix-ui/react-popover`, gaya shadcn). Tanpa perubahan API/skema. Bukti: `docs/04` bagian 10 (baris 2026-10-15 "Hint format SKU di form admin").
**Catatan unggahan (Uploadthing):**

- Alur: klien mengunggah lebih dulu lewat `useUploadThing` ke endpoint `productImage` di `/api/uploadthing`; server hanya menyimpan URL hasil unggah, bukan berkas. Tiga pemakai endpoint ini: galeri produk lewat `ImageUploader` (hingga 5 berkas), bagan ukuran lewat `ImageUploader max={1}`, dan gambar varian lewat `VariantImagePicker` (satu berkas per baris varian).
- Batas endpoint: maksimal 5 berkas per permintaan unggah, 4MB per berkas, `accept="image/*"` di klien. Gerbang `STORE_ADMIN` ├óΓé¼ΓÇ¥ tanpa sesi atau role lain menjawab `403 FORBIDDEN` (`src/lib/uploadthing/core.ts`).
- Batas 4MB menggantikan 5MB spesifikasi karena Uploadthing hanya menerima ukuran kelipatan pangkat dua (keputusan `docs/04` bagian 10, 2026-10-09).
- Galat unggah di klien menampilkan "Gagal mengunggah gambar, coba lagi"; tombol unggah bisa dipakai ulang (bagian 8).
- Endpoint terpisah `refundProof` (bukti refund manual, ORDER-06): gambar, maksimal 1 berkas 4MB, gerbang `STORE_ADMIN` sama.
- Status uji: gerbang terverifikasi `403`/`200` sejak PH-01. Unggah berkas nyata endpoint `productImage` **terverifikasi 2026-10-14** lewat UI admin: PNG 247 byte ΓåÆ `POST /api/uploadthing?actionType=upload&slug=productImage` `200` ΓåÆ `PUT sea1.ingest.uploadthing.com` `200` ΓåÆ URL `https://jqvuhozget.ufs.sh/f/...` disajikan `200 image/png 247 bytes`. Batas endpoint ikut terbukti (5MB ΓåÆ `400 FileSizeMismatch`, 5 berkas ΓåÆ `400 FileCountMismatch`), dan gerbang di produksi tanpa sesi ΓåÆ `403`. Bukti: `docs/04` bagian 4.5.
- Status uji endpoint `refundProof` **terverifikasi 2026-10-14** dengan berkas nyata: sesi Store Admin ΓåÆ `POST /api/uploadthing?actionType=upload&slug=refundProof` `200` (presigned) ΓåÆ `PUT sea1.ingest.uploadthing.com` (multipart, field `file`) `200` ΓåÆ URL `https://jqvuhozget.ufs.sh/f/...` disajikan `200 image/png 247 bytes`; dua berkas dalam satu permintaan ΓåÆ `400 FileCountMismatch`; tanpa sesi di produksi ΓåÆ `403`. `PUT` dengan badan mentah (`Content-Type: image/png`) ditolak `415` ΓÇö ingest hanya menerima `multipart/form-data`. Jalur UI lengkap pernah berjalan: baris refund `FS-20261013-87S2YV` berstatus `COMPLETED` dengan `proofUrl` asli yang tersaji `200 image/png 22910 bytes`. 
**Status tambahan 2026-10-15 — kapasitas galeri 5 gambar utama (TERIMPLEMENTASI 2026-10-15):** keputusan pengguna: jumlah gambar utama produk dinaikkan dari **4 menjadi 5** ("tambahin 'belum implmentasi' untuk 5 gambar utama (saat ini 4)"). Galeri produk dibatasi konstanta `MAX_PRODUCT_IMAGES` (`src/lib/products/validation.ts`) sebagai sumber tunggal: dipakai skema Zod `images` (`.max(MAX_PRODUCT_IMAGES, \`Maksimal ${MAX_PRODUCT_IMAGES} gambar\`)`) sekaligus `maxFileCount` endpoint Uploadthing `productImage` (`src/lib/uploadthing/core.ts`) lewat import yang sama. **Yang diterapkan:** (a) konstanta `4 → 5` (satu baris, ikut menaikkan plafon endpoint dan pesan validasi otomatis "Maksimal 5 gambar"); (b) `ImageUploader` galeri (default `max`) ikut naik, dan sejak aturan "dropzone disembunyikan saat slot penuh" teks keadaan penuh tidak lagi dirender (dropzone hilang saat gambar ke-5 terisi); (c) tata letak thumbnail galeri di halaman detail storefront: baris thumbnail memuat **gambar selain yang sedang tampil** (keputusan lanjutan 2026-10-15 — lihat status tambahan "strip thumbnail tanpa gambar aktif" di bagian 1C) sehingga jumlah kotak selalu = jumlah gambar − 1; grid `grid-cols-4` untuk ≤4 kotak dan `grid-cols-5` saat tepat 5 kotak supaya tidak ada sisa menggantung; (d) redaksi `docs/01` PRD 3.1.A ("1 wajib + 4 opsional = maksimal 5 gambar") dan teks "hingga 5 berkas" di butir catatan unggahan bagian ini disesuaikan; (e) bukti uji lama (2026-10-14: 5 berkas → `400 FileCountMismatch` pada plafon 4) tidak berlaku lagi — diulang dengan 5 berkas sukses dan 6 berkas ditolak. Tidak ada perubahan skema Prisma/`ProductImage` (baris gambar tidak berbatas jumlah per model), tidak ada endpoint baru. Penerimaan: unggah 5 gambar utama lewat form admin lolos validasi Zod dan endpoint; dropzone galeri hilang saat slot ke-5 terisi; kelima gambar tampil pada galeri detail storefront; ke-6 gambar ditolak dengan pesan "Maksimal 5 gambar". **Bukti verifikasi kode (2026-10-16, sesi dokumentasi):** `MAX_PRODUCT_IMAGES = 5` (`src/lib/products/validation.ts:20`) sebagai sumber tunggal — pesan Zod "Maksimal 5 gambar" dan `maxFileCount` endpoint `productImage` ikut otomatis lewat import di `src/lib/uploadthing/core.ts`; galeri storefront memakai `ProductShowcase` (carousel + thumbnail), tidak bergantung grid 4. Tanpa perubahan skema Prisma. Rincian: `docs/04` bagian 10 dan bagian 17 (TASK-115).

**Status tambahan 2026-10-15 — hapus gambar produk: konfirmasi + cek silang referensi + bersihkan berkas Uploadthing (BELUM diimplementasikan):** keputusan pengguna: "tambah cek silang sekali itu seperti confirm dialog? make sense, sekalian memberikan informasi simpel kalau gambar akan benar-benar terhapus. tambahkan di belum diimplementasikan". Kondisi saat ini: admin menghapus gambar (galeri/bagan ukuran/gambar varian lewat tombol Hapus di form) hanya menghapus URL dari daftar — **berkasnya tetap tersimpan di Uploadthing**; repo tidak memakai `UTApi` sama sekali (tidak ada `deleteFiles` di mana pun), jadi file lama jadi orphan. Rencana perbaikan berlapis:

- **Lapis 1 — konfirmasi di UI:** sebelum baris gambar hilang, tampilkan `ConfirmDialog` (aturan bagian 1B, di atas shadcn AlertDialog) berisi pesan sederhana bahwa tindakan ini menghapus gambar **secara permanen dari penyimpanan**, bukan hanya dari form — tombol destruktif "Hapus Gambar" + "Batal"; Escape/klik latar = batal.
- **Lapis 2 — cek silang di server:** sebelum memanggil `UTApi.deleteFiles([url])`, query sekali apakah URL yang sama masih dipakai entitas lain — `ProductImage.url` produk lain (termasuk role `INFO`) dan `ProductVariant.imageUrl` mana pun. Kalau ada yang masih menunjuk URL itu: **file tidak dihapus** (cukup barisnya lepas dari produk ini), log catatan, permintaan tetap sukses. Kalau referensi nol: `deleteFiles` dijalankan.
- **Urutan aman:** update hapus baris gambar dulu (transaksi tersimpan) baru `deleteFiles` — kalau panggilan Uploadthing gagal/gangguan jaringan, gambar tetap terhapus dari produk dan file lama tersisa sebagai orphan, **permintaan tidak ikut gagal** (log server saja).
- **Ketergantungan baru:** `UTApi` dari `@uploadthing/utapi` (kunci server Uploadthing di env server; tidak ada di klien).
- **Penerimaan:** klik Hapus pada gambar muncul konfirmasi dengan teks permanen; setelah konfirmasi, baris hilang dari form dan `UTApi.deleteFiles` terpanggil (bukti: file tak lagi menyaji `200` di dashboard/UFS Uploadthing); URL yang kebetulan masih dipakai varian/gambar lain tetap hidup dan terhapus dari produk saja; kegagalan Uploadthing tidak merusak simpan produk.
Bukti: `docs/04` bagian 9.4.

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
| Delete with orders | `409 PRODUCT_IN_USE` "Produk tidak bisa dihapus karena sudah pernah dipesan" — FK Restrict `OrderItem.variantId` + snapshot `OrderItem` | Riwayat pesanan tetap utuh |
| Delete while product in shopper carts (belum pernah dipesan) | `409 PRODUCT_IN_CART` "Produk tidak bisa dihapus karena masih ada di keranjang N pembeli" — guard `countCartItemsForProduct` di route DELETE (keputusan 2026-10-15, `docs/04` bagian 10) | Sembunyikan lewat status `DISCONTINUED` |
| Edit (PATCH) membuang varian yang dipakai riwayat pesanan | `409 VARIANT_IN_ORDER` "Varian dengan SKU X, Y sudah dipakai pada riwayat pesanan dan tidak bisa dihapus" — guard `OrderItem` (Restrict) di dalam `updateProduct` (terimplementasi 2026-10-15) | Pertahankan SKU varian tersebut atau buat produk baru |
| Edit (PATCH) membuang varian yang masih di keranjang pembeli | `409 PRODUCT_IN_CART` "Varian yang dihapus masih tersimpan di keranjang N pembeli" — guard `CartItem` (Cascade) di dalam `updateProduct`, sama seperti route DELETE (terimplementasi 2026-10-15) | Pertahankan varian atau minta pembeli menghapusnya dari keranjang |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Slug duplicate | "Slug sudah digunakan" | Change slug |
| SKU duplicate | "SKU sudah digunakan" | Change SKU |
| Image upload fail | "Gagal upload" | Retry |
| No variants | "Minimal 1 variant" | Add variant |

**Status: TERIMPLEMENTASI 2026-10-15** (perbaikan atas bug yang dilaporkan pengguna; bukti `docs/04` bagian 10). Akar masalah lama: `updateProduct` (`src/lib/products/mutations.ts`) untuk sembarang edit — termasuk ubah status — **menghapus seluruh varian lalu membuat ulang**, sehingga ID varian berubah dan (a) produk yang pernah dipesan selalu gagal (`OrderItem.variantId` Restrict → FK P2003 → pesan generik `400 INVALID_REFERENCE` "Data terkait tidak ditemukan"), (b) produk yang hanya ada di keranjang "berhasil" sambil menghapus item keranjang senyap lewat Cascade. Perbaikan: `updateProduct` kini **meng-upsert varian per SKU** (SKU global unik = kunci identitas) — varian yang tetap ada di-update pada barisnya sendiri (ID tidak berubah, FK OrderItem/CartItem tak tersentuh untuk edit ringan seperti ubah status, nama, harga, stok), SKU baru dibuat sebagai varian baru, dan hanya varian yang benar-benar dibuang yang dihapus — melalui guard berlapis (butir 7/8 di bawah). Pola nested-write `variants: { create }` di `product.update` dihapus dari jalur update (hanya `createProduct` yang memakainya).

### 9. Perilaku UI

- **Halaman:** Admin product form
- **Elemen:** Name, slug, description, category, brand, status, images (4 max), size chart (opsional, maks 1), variants (dynamic)
- **Gambar varian:** setiap baris varian punya pemilih satu gambar opsional (`VariantImagePicker`) ├óΓé¼ΓÇ¥ pratinjau 64px, tombol Unggah/Ganti, dan Hapus. Unggahan memakai endpoint `productImage` yang sama dengan galeri; bidang kosong dikirim sebagai `null` dan nilai tersimpan di `ProductVariant.imageUrl`. Gambar tampil di keranjang, dengan fallback ke gambar produk pertama bila varian tidak punya gambar. Ditambahkan sebagai revisi PH-01 (2026-10-11, `docs/04` bagian 4.8 dan 10).

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
| AC-PROD-01-03 | Product belum pernah dipesan dan tidak ada di keranjang pembeli | Delete | Hard delete; `ProductImage` dan `ProductVariant` ikut kaskade |
| AC-PROD-01-04 | Product pernah dipesan | Delete | `409 PRODUCT_IN_USE`, produk tetap ada; riwayat pesanan utuh via snapshot `OrderItem` |
| AC-PROD-01-09 | Product belum pernah dipesan tetapi ada `CartItem` menunjuk variannya | Delete | `409 PRODUCT_IN_CART` dengan jumlah pembeli di pesan; item keranjang dan varian tidak terhapus |
| AC-PROD-01-10 | Product pernah dipesan | Ubah status ke `DISCONTINUED` | Berhasil tanpa menyentuh varian/FK — terimplementasi 2026-10-15 (upsert varian per SKU; ID varian terverifikasi tidak berubah) |
| AC-PROD-01-11 | Product ada di keranjang pembeli | Ubah status ke `DISCONTINUED` via PATCH | Item keranjang tidak terhapus; bila varian diganti, tolak `409 PRODUCT_IN_CART` (terimplementasi 2026-10-15; terverifikasi CartItem utuh setelah status change, dan penghapusan varian di-keranjang tertolak dengan jumlah pembeli pada pesan) |
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

## <a name="prod-03"></a>PROD-03 ΓÇö Product Detail (Storefront)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PROD-03 ΓÇö Product Detail Page (storefront) |
| Modul | MOD-PROD |
| Tujuan | Menampilkan detail produk ACTIVE di storefront: kategori, brand, badge stok, deskripsi, galeri, bagan ukuran, dan AddToCartForm per varian |
| Aktor utama | Guest dan Customer (publik, tanpa sesi) |
| Status | Terimplementasi (PH-01) |
| Referensi PRD | PRD 2.1 ("Melihat detail produk dan variant"), PRD 3.1.A (data produk, gambar, size chart, dual stock) |
| Referensi SDD | SDD 5 (App Router `(storefront)/products/[slug]/page.tsx`), SDD 10 (slug dicek sebelum streaming) |

Bukti `docs/04` bagian 4.x: TASK-13 ("Selesai ΓÇö `/products/kaos-polos-katun-combed-30s` ΓåÆ `200` dengan varian, harga, stok, gambar"), AC-PROD-03-01.

### 2. Prasyarat dan pemicu

- **Titik masuk:** link dari `/products` (PROD-02) atau breadcrumb "Beranda / Produk"
- **Pemicu:** request `GET /products/[slug]`
- **Jika tidak terpenuhi:** `getPublishedProductBySlug` tidak menemukan produk ACTIVE dengan slug itu ΓåÆ `notFound()` ΓåÆ UI not-found; di produksi respons tetap `200` dengan `<meta name="robots" content="noindex">` (PPR + `cacheComponents`; perilaku terdokumentasi di komentar kode dan telah diuji saat build, status produksi tetap 200)

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Publik (Guest/Customer) | Melihat detail | `getPublishedProductBySlug` (Server Component, tanpa API) | `notFound()` bila slug tidak ada / bukan ACTIVE |
| Semua | Melihat produk Draft/Inactive/Discontinued | - | Tidak tampil (filter `status: "ACTIVE"`) |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| slug (path) | String | Ya | Dicocokkan ke kolom `Product.slug` + `status = "ACTIVE"` di `getPublishedProductBySlug` | `notFound()` (UI not-found; judul metadata "Produk tidak ditemukan") |
| Tidak ada input lain | - | - | - | - |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Akses `/products/[slug]` | Server Component | `getProduct = cache(getPublishedProductBySlug)` ΓÇö satu query dibagikan ke `generateMetadata` dan render |
| 2 | `generateMetadata` | `<title>` = `product.name`; description = 160 karakter pertama `product.description`, fallback `Beli {product.name} di {brand.brandName}.` | SEO |
| 3 | Render page | Breadcrumb: Beranda ΓåÆ Produk ΓåÆ `product.name` | Navigasi |
| 4 | Kolom kiri galeri | `images` diurutkan `sortOrder` asc; gambar `role === "SIZE_CHART"` dikeluarkan (PRD 3.1.A: bagan ukuran dipisah); gambar pertama `priority`, sisanya thumbnail grid 4 kolom bila lebih dari 1 | Galeri |
| 5 | Kolom kanan | `{category.name} - {brand.name}` (brand bisa kosong ΓåÆ hanya `category.name`), `h1` nama, Badge: `totalStock > 0` ΓåÆ `variant="secondary"` "Stok tersedia {totalStock}", selain itu `variant="destructive"` "Stok habis"; deskripsi `whitespace-pre-line` | Informasi produk |
| 6 | `AddToCartForm` | `variants` (id, name, sku, `price: Number(variant.price)`, stock) tampil sebagai list radio | Memilih varian lalu add to cart (CART-01) |
| 7 | Bagian "Bagan Ukuran" | `<h2>Bagan Ukuran</h2>` + gambar `aspect-[4/3] sm:aspect-[16/9]`, `object-contain` ΓÇö hanya bila ada image `SIZE_CHART` **(tergantikan 2026-10-15: section penuh ini dihapus, bagan ukuran kini tautan + dialog - lihat status tambahan PROD-06)** | Informasi ukuran |

### 6. Output dan perubahan data

- **Data dibaca:** `Product` + include `category`, `brand`, `images` (order `sortOrder`), `variants` (order `createdAt`); `getBrandSetting()` untuk fallback metadata
- **Data diubah:** tidak ada (read-only); interaksi add to cart adalah urusan CART-01 (`POST /api/cart`)
- **Kondisi akhir:** halaman ter-render; tidak ada mutasi data/cookie
- **Setelah reload:** sama; cache React hanya berlaku per request

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Produk tanpa gambar | Kotak dashed "Tanpa gambar" (aspect-square) | Tetap tampil |
| Produk tanpa deskripsi | Paragraf deskripsi dilewati | Layout tetap rapi |
| Produk tanpa varian | `AddToCartForm` ΓåÆ "Produk belum punya varian." | Tidak bisa di-add |
| Varian dengan stok 0 | Radio `disabled` + opacity-50; varian pertama yang tersedia jadi default terpilih | Tidak bisa dipilih |
| `totalStock = 0` | Badge "Stok habis" | Tetap informatif |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Slug tidak ada / produk non-ACTIVE | `notFound()` ΓåÆ UI not-found (produksi: `200` + noindex, lihat bagian 2) | Kembali ke `/products` |
| Query gagal | Dimpulos error framework Next.js; tidak ada try/catch di level page (pembungkus `withRouteErrors` hanya untuk API Route) | Coba lagi |

### 9. Perilaku UI

- **Halaman:** `/(storefront)/products/[slug]/page.tsx`, `export const instant = false` (PPR; slug dicek sebelum boundary Suspense agar UI not-found dirender dan slug tidak terindeks)
- **Elemen:** breadcrumb, galeri (1 utama + thumbnail), badge stok, deskripsi pre-line, AddToCartForm (radio varian + qty + tombol submit via `POST /api/cart`), bagan ukuran

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Lengkap sesuai langkah 5 | Lanjut belanja |
| Produk tidak ditemukan | not-found page | Kembali |
| Varian stok 0 | Radio redup, disabled | Pilih varian lain |
| Tambah ke keranjang | `POST /api/cart`, `router.refresh()` | Lihat keranjang |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PROD-03-01 | Produk ACTIVE tersedia | Buka `/products/kaos-polos-katun-combed-30s` | `200` dengan varian, SKU, harga, stok, gambar (diverifikasi curl, `docs/04` bagian 4.x) |
| AC-PROD-03-02 | Slug acak | Buka `/products/tidak-ada` | not-found; tidak ada konten produk |
| AC-PROD-03-03 | Produk status Draft | Akses slug-nya | Tidak ditemukan (filter status) |
| AC-PROD-03-04 | Produk dengan image `SIZE_CHART` | Buka detail | Section "Bagan Ukuran" tampil terpisah di bawah **(tergantikan: kini tautan + dialog, PROD-06)** |
| AC-PROD-03-05 | Semua varian `stock = 0` | Buka detail | Badge "Stok habis"; semua radio disabled |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Lengkap | produk ACTIVE, 3 varian (stock 5/2/0), 4 gambar + 1 SIZE_CHART | Galeri 4 + section Bagan Ukuran + badge "Stok tersedia 7" **(tergantikan: section bagan ukuran kini tautan + dialog, PROD-06)** | AC-PROD-03-01 |
| Minimal | hanya varian, tanpa gambar/deskripsi | Layout tetap rapi; AddToCartForm aktif | - |
| Slug salah | `/products/xyz` | not-found | AC-PROD-03-02 |

### 12. Batas fitur

- **Termasuk:** render detail produk ACTIVE, galeri kurasi (size chart dipisah), badge stok dual-tracking, list radio varian, metadata dinamis per nama/deskripsi produk, breadcrumb
- **Tidak termasuk:** review/ulasan, produk terkait/related, logika add-to-cart (CART-01), reservasi stok (ORDER-01/02)
- **Ketergantungan:** PROD-01 (data produk), PROD-02, MOD-BRAND (`getBrandSetting`), CART-01

### 13. Pertanyaan terbuka

- Tidak ada.

**Rujukan kode:**

- `src/app/(storefront)/products/[slug]/page.tsx` ΓÇö seluruh UI detail, `generateMetadata`, galeri + pemisahan SIZE_CHART, badge stok, breadcrumb, `instant = false`.
- `src/lib/products/queries.ts` ΓÇö `getPublishedProductBySlug` (filter ACTIVE) dan `productInclude` (relasi + urutan).
- `src/components/cart/AddToCartForm.tsx` ΓÇö form radio varian, default varian pertama tersedia, `POST /api/cart`.
- `docs/04_IMPLEMENTATION_PLAN.md` bagian 4.x ΓÇö bukti TASK-13 & AC-PROD-03-01.

---

## <a name="prod-06"></a>PROD-06 — Gambar Varian di Galeri Detail (carousel)

### 1. Identitas dan tujuan

Modul: MOD-PROD (tampilan storefront). Dipicu permintaan pengguna 2026-10-15: halaman detail produk saat ini hanya menampilkan galeri gambar utama produk (`Product.images`, maks 4); gambar per varian (`ProductVariant.imageUrl`, diunggah lewat `VariantImagePicker` di PROD-01) tidak pernah tampil ke pembeli selain sebagai thumbnail keranjang, sehingga pembeli tidak bisa melihat tampilan varian yang sebenarnya ia pilih. Tujuannya: bila pembeli memilih varian (radio di `AddToCartForm`), gambar besar di galeri langsung berganti menampilkan gambar varian terpilih; galeri dibuat seperti carousel (satu gambar besar + kontrol geser + thumbnail).

**Status: terimplementasi 2026-10-15** (spek ditulis dan dikerjakan hari yang sama; bukti `docs/04` bagian 10 - baris "PROD-06 gambar varian di galeri detail + tautan bagan ukuran dialog").

### 2. Prasyarat dan pemicu

- Halaman detail (`/(storefront)/products/[slug]`) adalah Server Component dengan `ProductWithRelations` lengkap; varian sudah menyertakan `imageUrl` dari PROD-01.
- Gambar varian bersifat opsional — banyak varian tanpa gambar khusus, dan fallbacknya adalah gambar utama produk.
- Galeri saat ini statis (bagian dari Server Component halaman). Perubahan ini membutuhkan satu client component induk yang membungkus galeri + formulir varian supaya keduanya berbagi state "varian terpilih"; tanpa API baru.

Pemicu: perubahan varian terpilih di halaman detail.

### 3. Entitas terkait

- Baca `Product.images` (galeri, role selain `SIZE_CHART`) dan `ProductVariant.imageUrl`.
- Tanpa tabel, skema, atau API baru; `imageUrl` varian sudah disimpan sejak PROD-01.

### 4. Input, validasi, kegagalan (data)

Tidak ada input baru. Varian tanpa `imageUrl` tidak menimbulkan galat — galeri menampilkan gambar utama produk (fallback, perilaku sama dengan thumbnail keranjang di `CartItemRow`).

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Buka detail produk | render server | Carousel menampilkan gambar utama sebagai slide aktif (bukan `SIZE_CHART`) |
| 2 | Pilih varian yang punya `imageUrl` | state klien | Slide bergeser halus ke gambar varian terpilih; alt gambar menyebut nama varian |
| 3 | Pilih varian lain atau varian tanpa gambar | state klien | Kembali/tetap ke slide gambar utama (fallback) |
| 4 | Klik panah prev/next atau thumbnail | state klien | Slide aktif berpindah manual seperti carousel umumnya |

### 6. Output dan perubahan data

- **Data dibaca:** `Product.images`, `ProductVariant.imageUrl` (tanpa data baru).
- **Data diubah:** tidak ada (read-only) — hanya perpindahan slide di sisi klien.

### 7. Alur alternatif

- Produk satu varian tanpa gambar khusus: perilaku galeri lama dipertahankan (gambar utama + thumbnail).
- Varian tanpa `imageUrl`: tidak menambah slide baru — galeri tetap menampilkan gambar utama, tanpa pesan galat.
- Semua varian habis: galeri tetap tampil; pilihan varian disabled sehingga tidak ada perpindahan gambar.
- Deep link varian lewat URL (`?variant=`) tidak disediakan; varian terpilih bawaan = varian pertama berstok (perilaku `AddToCartForm` yang sudah ada).

### 8. Perilaku kegagalan

| Kondisi | Sumber | Respons |
| --- | --- | --- |
| `imageUrl` varian rusak (URL mati) | `next/image` | Fallback visual tetap secukupnya (bingkai `bg-muted`); tidak mematikan carousel; tanpa teks error besar |
| Produk tanpa gambar utama | render server | Placeholder "Tanpa gambar" seperti sekarang |
| Admin mengubah varian di tab lain | tidak sinkron real-time | Data baru tampil setelah reload/refresh halaman |

### 9. Perilaku UI

- **Galeri** (komponen klien baru, mis. `ProductGallery`): satu gambar besar `aspect-square`, tombol panah kiri/kanan (hanya bila slide lebih dari satu), dan baris thumbnail di bawah berisi slide **selain** yang sedang tampil (5 gambar = 1 besar + 4 kecil; keputusan pengguna 2026-10-15). Pergeseran memakai transisi CSS sederhana (`translate`), tanpa pustaka carousel baru (KISS; pilihan memakai `ui/carousel.tsx` shadcn menjadi keputusan implementasi yang dicatat `docs/04`).
- **Peta gambar varian:** induk klien menghitung `variantImages: Record<variantId, string | null>` dan memegang state "varian terpilih"; memilih varian menggeser slide aktif ke gambar varian, dan kontrol manual mengubah slide aktif seperti biasa.
- **Bagan ukuran** tetap terpisah (tautan, sebagaimana sekarang) — tidak masuk carousel.
- **Alt text:** `{productName}` - `{variantName}` untuk gambar varian; `{productName}` untuk gambar utama.
- Tanpa `dangerouslySetInnerHTML`; gambar lewat `next/image` dengan URL Uploadthing yang sudah dipakai galeri saat ini.

**Status tambahan 2026-10-15 — bagan ukuran bergaya tautan + dialog (TERIMPLEMENTASI 2026-10-15, satu paket dengan galeri varian):** keputusan pengguna berikutnya: tampilan bagan ukuran di detail produk mengikuti pola *BackLink* (teks tautan kecil `text-sm`, garis bawah saat diarahkan) dan ditempatkan **di kanan bawah tombol "Tambah ke Keranjang"** (di bawah `AddToCartForm`, rata kanan). Sekarang ini bagan ukuran dirender section penuh di bawah grid (bagian "Bagan Ukuran" dengan H2) — itu dihapus saat implementasi. Ketika tautan "Lihat bagan ukuran" diklik, muncul **dialog** (`ui/dialog.tsx` yang sudah dipakai CART-05: fokus terjebak, Escape/backdrop = tutup) berisi gambar bagan ukuran (`object-contain`, bisa scroll bila panjang); tanpa re-render halaman maupun navigasi menuju gambar penuh. Konsisten dengan tautan bernama sama di dialog varian CART-05 ("Lihat bagan ukuran & detail lengkap") yang membuka halaman detail — di halaman detail inilah tautan baru ini muncul, jadi jalannya lengkap: keranjang kartu → halaman detail → tautan → dialog bagan. Butir penerimaan tambahan (menyertai AC-PROD-06-01..05): detail dengan gambar `SIZE_CHART` menampilkan tautan di kanan bawah `AddToCartForm` dan tautan itu membuka dialog dengan gambar bagan; detail tanpa bagan ukuran tidak menampilkan tautan sama sekali; section "Bagan Ukuran" penuh di bawah grid lenyap. AC-PROD-06-04 di atas ("bagan tetap terpisah dari carousel") ditinjau ulang oleh implementasi ini — bagan tetap bukan slide carousel, tetapi kotaknya bukan lagi section penuh. **Catatan PROD-08 (2026-10-16):** peran gambar `SIZE_CHART` berganti nama jadi `INFO` dan slotnya menjadi "Informasi Tambahan" dengan label kustom, jadi teks tautan dan judul dialog di atas mengikuti `Product.infoLabel` (default "Informasi Tambahan") — bukan lagi selalu "bagan ukuran".

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PROD-06-01 | Detail produk multi-varian; varian punya `imageUrl` | Pilih varian itu | Gambar besar berganti ke gambar varian dengan transisi halus, tanpa reload halaman |
| AC-PROD-06-02 | Varian tanpa `imageUrl` | Pilih varian itu | Gambar besar tetap/kembali ke gambar utama produk (fallback, tanpa galat) |
| AC-PROD-06-03 | Galeri memuat 2 slide atau lebih | Panah prev/next atau thumbnail diklik | Slide aktif berpindah manual |
| AC-PROD-06-04 | Produk punya gambar `SIZE_CHART` | Klik tautan bagan ukuran | Bagan ukuran tetap terpisah dari carousel |
| AC-PROD-06-05 | Gambar varian rusak (URL mati) | Slide varian tampil | Fallback visual tanpa mematikan carousel |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Varian berimage | varian M kaos polos dengan `imageUrl` | Pilih M, gambar varian tampil sebagai slide aktif | AC-01 |
| Varian tanpa gambar | varian XL tanpa gambar khusus | Tetap gambar utama | AC-02 |
| Kontrol manual | galeri 3 slide | Panah/thumbnail bekerja | AC-03 |
| Bagan ukuran | produk dengan `SIZE_CHART` | Tautan bagan tetap tampil terpisah | AC-04 |

### 12. Batas fitur

- **Termasuk:** galeri detail berupa carousel, perpindahan gambar saat varian dipilih, fallback varian tanpa gambar
- **Tidak termasuk:** penerapan yang sama di halaman lain (kartu katalog, dialog varian CART-05; thumbnail keranjang tetap memakai fallback `imageUrl` yang ada), unggah gambar varian baru (sudah PROD-01), lightbox/zoom, autoplay, deep-link varian, perubahan API/skema
- **Ketergantungan:** PROD-01 (`imageUrl` varian), PROD-03 (halaman detail), client component induk berbagi state varian

### 13. Pertanyaan terbuka

- Pilihan mekanisme carousel: CSS translate sederhana (bawaan) atau `ui/carousel.tsx` shadcn — diputuskan saat implementasi dan dicatat di `docs/04` bagian 10.

**Rujukan kode (saat ini):** `src/app/(storefront)/products/[slug]/page.tsx` (galeri statis); `src/components/cart/AddToCartForm.tsx` (radio varian); `src/components/admin/VariantImagePicker.tsx` (sumber `imageUrl`); `src/lib/cart/queries.ts` (fallback `imageUrl` di thumbnail keranjang).

## <a name="prod-07"></a>PROD-07 — Seksi Editorial Detail Produk (VideoHero, ProductStory, Lookbook)

### 1. Identitas dan tujuan

Modul: MOD-PROD (tampilan storefront + form admin). Dipicu permintaan pengguna 2026-10-15: halaman detail produk ingin punya tiga seksi editorial bergaya situs fashion — **VideoHero** (banner video produk full-width di bawah grid, pada posisi section bagan ukuran saat ini), **ProductStory** (dua kolom: gambar editorial + narasi produk), dan **Lookbook** (galeri foto gaya hidup, 4 foto) — sebagaimana gambar referensi pengguna. **Setiap seksi bisa dihidupkan/mati terpisah (customisable, opsional)**: admin mengisi hanya yang ingin dipakai — VideoHero saja, atau ProductStory + Lookbook, atau VideoHero + Lookbook, atau tidak sama sekali; tidak wajib mengisi ketiganya, dan seksi tanpa data tidak dirender sama sekali.

**Status: terimplementasi 2026-10-15** (spek ditulis dan dikerjakan di hari yang sama; bukti `docs/04` bagian 10). Tiga pertanyaan terbuka bagian 13 diputus saat implementasi: sumber video = unggah berkas Uploadthing `videoHero` (plafon 64 MB), autoplay dikontrol admin per produk (`Product.videoHeroAutoplay`), dan ProductStory tanpa `storyText` jatuh ke `description` produk.

### 2. Prasyarat dan pemicu

- Form produk admin (PROD-01) menambah kelompok input opsional: banner hero (pilih salah satu — gambar atau video), gambar + teks narasi, unggahan lookbook.
- Skema butuh penambahan (migrasi Prisma): `Product.videoHeroUrl String?`, `Product.videoHeroAutoplay Boolean @default(true)`, `Product.heroImageUrl String?`, `Product.storyText String?`, nilai enum baru `ImageRole`: `STORY` (maks 1) dan `LOOKBOOK` (maks 4) di `ProductImage`. Endpoint Uploadthing baru untuk berkas video bila jalur unggah dipilih.
- Tidak ada perubahan alur keranjang/pesanan; seksi murni tampilan.

### 3. Entitas terkait

- `Product` (kolom baru di atas), `ProductImage` (role baru), konfigurasi Uploadthing (`src/lib/uploadthing/core.ts`).
- Storefront membaca relasi yang sudah ada (`getPublishedProductBySlug`) dengan filter role.

### 4. Input, validasi, kegagalan (data)

| Input | Validasi | Pesan |
| --- | --- | --- |
| videoHeroUrl | URL valid; sumber diizinkan (Uploadthing `videoHero` atau sematan YouTube — diputus saat implementasi, bagian 13) | "URL video tidak valid" |
| heroImageUrl | URL valid (alternatif video untuk banner hero; hanya satu sumber yang tersimpan) | "URL gambar hero tidak valid" |
| videoHeroAutoplay | boolean (kontrol admin; hanya berlaku untuk banner video) | - |
| storyText | teks bebas maks 2000 karakter (aturan karakter kontrol bagian 1A) | "Narasi maksimal 2000 karakter" |
| Story/Lookbook | tipe gambar sesuai endpoint Uploadthing gambar yang ada | pesan "Gagal unggah" yang sudah ada |

Tampilan storefront tidak punya input; semua read-only.

### 5. Alur berhasil (tampilan storefront)

| Langkah | Hasil |
| --- | --- |
| Buka detail produk | Seksi dirender sesuai data, urutan tetap: (1) Banner hero full-width di bawah grid pada posisi section bagan ukuran saat ini (bagian beli tetap teratas seperti sekarang — TANPA digeser ke atas halaman) berupa gambar atau video dengan rasio panorama 4:1 di layar lebar (16:9 di ponsel), (2) ProductStory dua kolom (gambar rasio 16:9 di kiri, teks kanan) setelahnya, (3) Lookbook paling bawah dengan susunan editorial (foto utama membentang di kiri + foto pendamping di kanan, rasio lanskap serupa banner hero). Ketiganya di bawah area galeri+beli, bukan di atas produk detail |
| Admin mengisi semua | Ketiga seksi tampil berurutan tanpa menggeser konten beli yang sudah ada |
| Admin mengisi sebagian | Hanya seksi yang berisi data yang tampil |
| Admin tidak mengisi | Halaman persis seperti saat ini (tanpa perubahan visual) |

### 6. Output dan perubahan data

- Admin mengubah: `Product.videoHeroUrl`, `Product.videoHeroAutoplay`, `Product.heroImageUrl`, `Product.storyText`, baris `ProductImage` role `STORY`/`LOOKBOOK`.
- Storefront read-only; tanpa tabel/API baru selain endpoint unggahan video.

### 7. Alur alternatif

- Lookbook kurang dari 4 foto: grid menyusut rapi (1-3 foto tetap boleh).
- Video gagal dimuat (URL mati): fallback visual bingkai `bg-muted`, tanpa mematikan halaman (pola PROD-06).
- Produk DRAFT/arsip: hanya seksi yang datanya ada yang dirender; tidak ada kerangka kosong.

### 8. Perilaku kegagalan

| Kondisi | Sumber | Respons |
| --- | --- | --- |
| URL video rusak/tidak bisa diputar | elemen video/iframe | Fallback visual tanpa galat besar; log server |
| `storyText` kosong tetapi gambar STORY ada | render | Seksi tetap tampil berisi gambar saja (dan sebaliknya) |
| Admin menyimpan tanpa mengisi opsional apa pun | `productSchema` | Simpan tetap lolos; semua field opsional tidak blok |

### 9. Perilaku UI

- **VideoHero:** elemen `<video>` (autoplay muted loop `playsInline`, tanpa suara; poster `aspect-video`) atau sematan iframe YouTube — full-width, diposisikan di bawah grid pada posisi section bagan ukuran saat ini (BUKAN di atas halaman; bagian galeri+beli tetap teratas), tanpa tombol overlay.
- **ProductStory:** grid dua kolom (gambar `aspect-square` kiri, teks `whitespace-pre-line` kanan) mengikuti referensi pengguna; judul kecil opsional memakai nama produk.
- **Lookbook:** grid gambar 4 kolom (1-2 kolom di layar kecil), `object-cover`, lazy load.
- Semua lewat `next/image`/URL yang sudah di-allowlist; tanpa `dangerouslySetInnerHTML`.
- Form admin (PROD-01) menaruh tiga kelompok baru di bawah bagian Bagan Ukuran dengan label jelas "opsional".

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PROD-07-01 | Produk tanpa ketiga isian | Buka detail | Halaman sama seperti saat ini, tanpa seksi kosong |
| AC-PROD-07-02 | Produk dengan banner hero video | Buka detail | Video tampil di bawah grid (posisi section bagan ukuran saat ini), full-width, rasio panorama 4:1 di layar lebar |
| AC-PROD-07-03 | Produk dengan narasi + gambar | Buka detail | Dua kolom gambar+teks tampil setelah bagian beli (gambar rasio lanskap 16:9, tinggi kedua kolom sejajar) |
| AC-PROD-07-04 | Produk dengan 4 foto lookbook | Buka detail | Susunan editorial tampil setelah ProductStory: foto utama membentang + tiga pendamping, rasio lanskap serupa VideoHero |
| AC-PROD-07-05 | Admin mengisi sebagian | Simpan lalu buka detail | Hanya seksi yang diisi yang tampil |
| AC-PROD-07-06 | Produk dengan banner hero gambar | Buka detail | Gambar tampil di posisi dan rasio yang sama dengan banner video (4:1 di layar lebar); gambar diprioritaskan bila kedua sumber terisi |
| AC-PROD-07-07 | Admin memilih jenis banner di form | Pilih Gambar/Video/Tanpa banner | Hanya uploader jenis terpilih yang tampil; pilihan baru mengosongkan sumber lain (tidak ada dua banner bersaing) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Lengkap | video hero + narasi 2 paragraf + gambar STORY + 4 foto LOOKBOOK | Ketiga seksi berurutan | AC-02..04 |
| Hanya narasi | `storyText` + gambar STORY, tanpa video/lookbook | Hanya ProductStory | AC-03, AC-05 |
| Kosong | produk isian lama | Tampilan lama | AC-01 |

### 12. Batas fitur

- **Termasuk:** tiga seksi opsional per produk, migrasi kolom/enum, form admin opsional.
- **Tidak termasuk:** ulasan/review pembeli, produk terkait/rekomendasi, penjadwalan tayang, seksi per kategori/global, A/B layout, perubahan alur beli.
- **Ketergantungan:** PROD-01 (form), PROD-03 (halaman detail), konfigurasi Uploadthing (endpoint video), migrasi Prisma.

### 13. Pertanyaan terbuka

- Sumber video hero: unggah berkas via Uploadthing (butuh endpoint + plafon ukuran video, diputus berapa) atau cukup sematan URL YouTube — keputusan dicatat `docs/04` bagian 10 saat implementasi.
- Autoplay: selalu autoplay-mute (KISS) atau boleh dikontrol admin.
- Apakah ProductStory boleh memakai `description` yang sudah ada bila admin tidak mengisi `storyText` (menghindari duplikasi isi) — keputusan pengguna.

**Rujukan kode (saat ini):** `src/app/(storefront)/products/[slug]/page.tsx` (detail); `src/lib/products/validation.ts` (schema produk); `src/lib/uploadthing/core.ts` (endpoint gambar); `src/components/admin/ImageUploader.tsx` (pola unggah).

---
---
## <a name="prod-04"></a>PROD-04 ΓÇö Category Management (Store Admin)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PROD-04 ΓÇö Category Management (Store Admin) |
| Modul | MOD-PROD |
| Tujuan | CRUD kategori produk di admin (list, tambah, ubah, hapus) untuk pengelompokan produk di storefront |
| Aktor utama | Store Admin |
| Status | Terimplementasi (PH-01) |
| Referensi PRD | PRD 2.3 ("Mengelola produk, kategori, brand, variant..."), PRD 3.1.A ("Kategori produk"), PRD 4.2 |
| Referensi SDD | SDD 5 (route `admin/categories`), SDD 10 (guard OWASP A01) |

Bukti `docs/04` bagian 4.x: TASK-09 ("Selesai ΓÇö `GET /api/admin/categories` dengan sesi ΓåÆ `200`; `401` tanpa sesi. Data seed tampil di form produk").

### 2. Prasyarat dan pemicu

- **Titik masuk:** menu `/admin/categories` (layout admin) dan pemilihan kategori di form produk
- **Pemicu:** Store Admin membuka halaman "Kategori" (deskripsi halaman: "Kategori dipakai untuk mengelompokkan produk di storefront.")
- **Jika tidak terpenuhi:** sesi tidak ada ΓåÆ `401 UNAUTHORIZED` "Anda harus masuk terlebih dahulu"; role bukan STORE_ADMIN (atau akun dinonaktifkan) ΓåÆ `403 FORBIDDEN` "Anda tidak memiliki akses"

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Store Admin | List / tambah / ubah / hapus kategori | `requireStoreAdmin()` (`src/lib/auth/guard.ts`; role + `deactivatedAt` dibaca ulang dari DB per request) | `401 UNAUTHORIZED` / `403 FORBIDDEN` |
| Customer, Guest | - | - | `403 FORBIDDEN` via guard |
| Site Admin | - | - | `403 FORBIDDEN` (guard hanya `STORE_ADMIN`) |

### 4. Input dan validasi

Schema: `categorySchema` / `categoryUpdateSchema` (`src/lib/categories/validation.ts`); `slugSchema` juga dipakai klien (TaxonomyManager) dan brand.

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| name (POST) | String | Ya | 1..100, `CATEGORY_NAME_REGEX` (`/^[A-Za-z0-9\u00C0-\u024F&.,'()\- ]+$/`), harus mengandung huruf | "Nama kategori wajib diisi" / "Nama maksimal 100 karakter" / "Nama kategori memuat karakter yang tidak diizinkan" / "Nama kategori harus mengandung huruf" |
| slug (POST) | String | Ya | `slugSchema`: 1..200, lowercase, regex `/^[a-z0-9]+(?:-[a-z0-9]+)*$/` | "Slug wajib diisi" / "Slug maksimal 200 karakter" / "Slug hanya boleh huruf kecil, angka, dan tanda hubung" |
| name, slug (PATCH `[id]`) | Partial | Tidak | `categoryUpdateSchema = categorySchema.partial()`; body kosong ditolak | Pesan sama dengan POST; body tanpa field ΓåÆ `400 EMPTY_UPDATE` |
| id (path `[id]`) | UUID | Ya | `idSchema = z.string().uuid()` | `400 INVALID_ID` "ID tidak valid" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Buka `/admin/categories` (Server Component) | `getCategories()` di level halaman | Daftar kategori (`orderBy name asc` + `_count.products` sebagai `productCount`) dirender `TaxonomyManager` |
| 2 | Isi Nama Kategori ΓåÆ slug terisi otomatis `slugify` sampai slug diubah manual (`slugTouched`) | - | Form terisi |
| 3 | Klik "Tambah" | Validasi klien (nama kosong ΓåÆ "Nama wajib diisi"; slug via `slugSchema`) | - |
| 4 | | `POST /api/admin/categories` dengan `{ name, slug }` | `201 {"category": {...}}` |
| 5 | Item baru ditambahkan ke daftar (urut leksikal) di klien | - | Kategori muncul |
| 6 | Ubah (edit inline lalu simpan) | `PATCH /api/admin/categories/[id]` | `200 {"category": {...}}` |
| 7 | Hapus (konfirmasi `window.confirm("Hapus Kategori \"...\"?")`) | `DELETE /api/admin/categories/[id]` | `200 {"deleted": true}` |

### 6. Output dan perubahan data

- **Data dibaca:** `Category` + `_count.products` (`getCategories`, orderBy `name: "asc"`)
- **Data dibuat:** baris `Category` (`createCategory` = `prisma.category.create({ data: input })`)
- **Data diubah:** `updateCategory` (`prisma.category.update`); produk yang berelasi tidak ikut diubah
- **Data dihapus:** `deleteCategory` (`prisma.category.delete`); error FK/ketidakadanya data diterjemahkan `prismaErrorResponse` (P2003/P2025)
- **Kondisi akhir:** daftar kategori terbaru tampil; hitungan `productCount` segar setelah reload halaman

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Tidak ada kategori | `<li>` "Belum ada kategori." | Empty state |
| Slug otomatis dari nama dan tidak diubah | `slugify(event.target.value)` saat mengetik nama, hanya sebelum `slugTouched` | Slug konsisten |
| Hapus kategori yang masih direferensikan | `prismaErrorResponse`: P2003 ΓåÆ `400 INVALID_REFERENCE` "Data terkait tidak ditemukan" | Hapus ditolak (FK default `Restrict`; terverifikasi di `schema.prisma` ΓÇö `Product.categoryId` wajib, tanpa `onDelete` eksplisit) |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Sesi tidak ada / akun nonaktif | `401 UNAUTHORIZED` "Anda harus masuk terlebih dahulu" | Login ulang di `/login` |
| Role bukan STORE_ADMIN | `403 FORBIDDEN` "Anda tidak memiliki akses" | - |
| Zod gagal | `400 VALIDATION_ERROR` + pesan exact di bagian 4 | Perbaiki form |
| Nama duplikat (P2002 field `name`) | `409 DUPLICATE` "Nama kategori sudah digunakan" (`field: "name"`) | Ganti nama |
| Slug duplikat (P2002 field `slug`) | `409 DUPLICATE` "Slug sudah digunakan" (`field: "slug"`) | Ganti slug |
| ID bukan UUID | `400 INVALID_ID` "ID tidak valid" | Muat ulang daftar |
| PATCH tanpa field | `400 EMPTY_UPDATE` "Tidak ada data yang diubah" | Isi minimal satu field |
| Data tidak ada (P2025) | `404 NOT_FOUND` "Data tidak ditemukan" | Muat ulang |
| Error tak terduga | `500 INTERNAL_ERROR` "Terjadi kesalahan, coba lagi" | Coba lagi |

### 9. Perilaku UI

- **Halaman:** `/admin/categories` (`PageHeader` title "Kategori", `instant = false`), `TaxonomyManager` dengan `resource="categories"`, `singularLabel="Kategori"`
- **Elemen:** form Tambah (input "Nama Kategori" + "Slug" + tombol "Tambah"), list per kategori dengan `productCount`, edit inline, tombol hapus dengan konfirmasi

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | List + form tampil | CRUD |
| Galat | `FormErrorAlert` dengan pesan API | Perbaiki |
| Submit | Tombol disabled (`submitting`) | Tunggu |
| Hapus | `window.confirm` | Setuju/batal |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PROD-04-01 | Store Admin login | `GET /api/admin/categories` | `200` dengan kategori (`docs/04` bagian 4.x ΓÇö TASK-09) |
| AC-PROD-04-02 | Tanpa sesi | `GET /api/admin/categories` | `401 UNAUTHORIZED` (TASK-09) |
| AC-PROD-04-03 | Nama kategori baru | POST | `201`; tampil di daftar dan di form produk |
| AC-PROD-04-04 | Nama duplikat | POST | `409 DUPLICATE` "Nama kategori sudah digunakan" |
| AC-PROD-04-05 | Kategori lama diubah via inline edit | `PATCH /api/admin/categories/[id]` | `200` + daftar ter-update di klien |
| AC-PROD-04-06 | ID tidak dikenal | `DELETE /api/admin/categories/[id]` | `404 NOT_FOUND` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | `{"name":"Kaos","slug":"kaos"}` | `201 {"category":{...}}` | AC-PROD-04-03 |
| Slug invalid | `{"name":"Kaos","slug":"Kaos!"}` | `400 VALIDATION_ERROR` "Slug hanya boleh huruf kecil, angka, dan tanda hubung" | - |
| Duplikat | slug "kaos" sudah dipakai | `409 DUPLICATE` | AC-PROD-04-04 |

### 12. Batas fitur

- **Termasuk:** CRUD kategori flat (tanpa hierarki/parent), slug manual/otomatis, hitungan produk terkait, UI bersama TaxonomyManager dengan brand
- **Tidak termasuk:** upload ikon kategori, pengurutan manual, delete cascade ke produk, kategori bertingkat
- **Ketergantungan:** MOD-AUTH (guard + sesi), PROD-01 (form produk memakai kategori), unique constraint `name`/`slug` di `schema.prisma` (terverifikasi: `Category.name` dan `Category.slug` ber-`@unique`, diperketat juga oleh penanganan P2002 di route)

### 13. Pertanyaan terbuka

- Tidak ada.

**Rujukan kode:**

- `src/app/api/admin/categories/route.ts` ΓÇö `GET`/`POST`, guard, pesan duplikat exact.
- `src/app/api/admin/categories/[id]/route.ts` ΓÇö `PATCH`/`DELETE`, `idSchema` uuid, `EMPTY_UPDATE`, `INVALID_ID` 400.
- `src/lib/categories/validation.ts` ΓÇö `categorySchema`, `slugSchema`, semua pesan Zod.
- `src/lib/categories/queries.ts` + `mutations.ts` ΓÇö `getCategories` (count), `createCategory`, `updateCategory`, `deleteCategory`.
- `src/components/admin/TaxonomyManager.tsx` ΓÇö UI bersama (komentar "Dipakai bersama oleh PROD-04 (Kategori) dan PROD-05 (Brand)"), slugify, konfirmasi hapus.
- `src/app/admin/categories/page.tsx` ΓÇö Server Component, header "Kategori".
- `src/lib/auth/guard.ts` ΓÇö `requireStoreAdmin`, pesan `unauthorized()`/`forbidden()`.
- `src/lib/utils/prisma-error.ts` ΓÇö mapping P2002/P2003/P2025 + `DUPLICATE` 409.

---

## <a name="prod-05"></a>PROD-05 ΓÇö Brand Management (Store Admin)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PROD-05 ΓÇö Brand Management (Store Admin) |
| Modul | MOD-PROD |
| Tujuan | CRUD brand opsional untuk pelabelan produk; nama brand tampil di storefront detail produk (PROD-03) |
| Aktor utama | Store Admin |
| Status | Terimplementasi (PH-01) |
| Referensi PRD | PRD 2.3 ("Mengelola produk, kategori, brand..."), PRD 3.1.A ("Brand"), PRD 4.2 ("Brand management") |
| Referensi SDD | SDD 5 (route `admin/brands`), SDD 10 (guard) |

Bukti `docs/04` bagian 4.x: TASK-10 ("Selesai ΓÇö `401` tanpa sesi; 3 brand seed tampil di katalog").

### 2. Prasyarat dan pemicu

- **Titik masuk:** `/admin/brands` (menu admin "Brand"; `PageHeader` title "Brand", deskripsi "Brand bersifat opsional pada produk.")
- **Pemicu:** Store Admin membuka halaman atau mengirim operasi CRUD
- **Jika tidak terpenuhi:** `401 UNAUTHORIZED` / `403 FORBIDDEN` sama seperti PROD-04

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Store Admin | List / tambah / ubah / hapus brand | `requireStoreAdmin()` | `401` / `403` |
| Customer/Guest/Site Admin | - | - | `403 FORBIDDEN` |

### 4. Input dan validasi

Schema: `brandSchema` / `brandUpdateSchema` (`src/lib/brands/validation.ts`), memakai `slugSchema` dari validasi kategori.

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| name (POST) | String | Ya | 1..100, `CATEGORY_NAME_REGEX`, harus mengandung huruf | "Nama brand wajib diisi" / "Nama maksimal 100 karakter" / "Nama brand memuat karakter yang tidak diizinkan" / "Nama brand harus mengandung huruf" |
| slug (POST) | String | Ya | Sama dengan `slugSchema` (1..200, lowercase, regex kebab-case) | "Slug wajib diisi" / "Slug maksimal 200 karakter" / "Slug hanya boleh huruf kecil, angka, dan tanda hubung" |
| name, slug (PATCH `[id]`) | Partial | Tidak | `brandUpdateSchema = brandSchema.partial()`; body kosong ditolak | Pesan sama dengan POST; `400 EMPTY_UPDATE` |
| id (path) | UUID | Ya | `z.string().uuid()` | `400 INVALID_ID` "ID tidak valid" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Buka `/admin/brands` | Data diambil `getBrands()` di level halaman | List dirender `TaxonomyManager` dengan `resource="brands"` |
| 2 | Isi Nama Brand, slug terisi otomatis | - | Form terisi |
| 3 | Klik "Tambah" | Validasi klien (nama + slogan) | - |
| 4 | | `POST /api/admin/brands` | `201 {"brand": {...}}` |
| 5 | Ubah / Hapus inline | `PATCH` / `DELETE /api/admin/brands/[id]` | `200` / `200 {"deleted": true}` |
| 6 | Buat/ubah produk | Dropdown brand di form produk (PROD-01) | Brand terpakai pada produk |

### 6. Output dan perubahan data

- **Data dibaca:** `Brand` + `_count.products` (`getBrands()`)
- **Data dibuat/diubah/dihapus:** baris `Brand` (`createBrand`, `updateBrand`, `deleteBrand` ΓÇö bentuk sama dengan fungsi kategori)
- **Kondisi akhir:** brand baru langsung muncul di daftar; produk yang memakai brand tidak berubah otomatis
- **Setelah reload:** daftar fresh (Server Component)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Tidak ada brand | "Belum ada brand." | Empty state |
| Hapus brand yang masih dipakai produk | `Product.brandId` opsional, tanpa `onDelete` eksplisit di `schema.prisma` ΓåÆ default Prisma `SetNull` | Hapus berhasil; produk yang memakainya tetap ada dengan `brandId` null (terverifikasi di `schema.prisma`) |
| Slug tidak diubah manual | `slugify` nama | Slug valid |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Sesi tidak ada | `401 UNAUTHORIZED` | Login ulang |
| Bukan STORE_ADMIN | `403 FORBIDDEN` | - |
| Zod gagal | `400 VALIDATION_ERROR` + pesan exact | Perbaiki |
| Nama brand duplikat (P2002 `name`) | `409 DUPLICATE` "Nama brand sudah digunakan" | Ganti |
| Slug duplikat (P2002 `slug`) | `409 DUPLICATE` "Slug sudah digunakan" | Ganti |
| ID salah format | `400 INVALID_ID` "ID tidak valid" | - |
| PATCH body kosong | `400 EMPTY_UPDATE` "Tidak ada data yang diubah" | Isi field |
| Brand tidak ada (P2025) | `404 NOT_FOUND` "Data tidak ditemukan" | Muat ulang |
| Internal | `500 INTERNAL_ERROR` "Terjadi kesalahan, coba lagi" | Coba lagi |

### 9. Perilaku UI

- **Halaman:** `/admin/brands` (`instant = false`), `TaxonomyManager` dengan `resource="brands"`, `singularLabel="Brand"`
- **Elemen:** form Tambah (label "Nama Brand", "Slug", tombol "Tambah"), list brand dengan `productCount`, edit inline, hapus dengan konfirmasi

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | List + form | CRUD |
| Galat | `FormErrorAlert` | Perbaiki |
| Submit | Tombol disabled | Tunggu |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PROD-05-01 | Store Admin login | `GET /api/admin/brands` | `200` list brand |
| AC-PROD-05-02 | Tanpa sesi | `GET /api/admin/brands` | `401 UNAUTHORIZED` (TASK-10) |
| AC-PROD-05-03 | Brand baru | POST | `201` + tampil di daftar dan katalog |
| AC-PROD-05-04 | Nama duplikat | POST | `409 DUPLICATE` "Nama brand sudah digunakan" |
| AC-PROD-05-05 | 3 brand seed | Buka katalog produk | Brand tampil (`docs/04` bagian 4.x ΓÇö TASK-10) |
| AC-PROD-05-06 | Brand dihapus | DELETE | `200 {"deleted": true}`; produk yang memakainya tetap ada dengan `brandId` null (`SetNull`, terverifikasi di `schema.prisma`) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | `{"name":"Acme","slug":"acme"}` | `201 {"brand": {...}}` | AC-PROD-05-03 |
| Nama tanpa huruf | `{"name":"123","slug":"123"}` | `400 VALIDATION_ERROR` "Nama brand harus mengandung huruf" | - |
| Duplikat | slug sama | `409 DUPLICATE` | AC-PROD-05-04 |

### 12. Batas fitur

- **Termasuk:** CRUD brand flat, slug otomatis/manual, hitungan produk, UI bersama dengan PROD-04
- **Tidak termasuk:** logo brand, deskripsi brand, halaman storefront per brand (brand hanya label), penyesuaian identitas toko (SITE-05, milik Site Admin)
- **Ketergantungan:** MOD-AUTH (guard), PROD-01 (form produk), PROD-03 (display brand di storefront)

### 13. Pertanyaan terbuka

- Tidak ada (perilaku FK hapus brand sudah terverifikasi di `schema.prisma`: `Product.brandId` opsional ΓåÆ default `SetNull`, produk tidak ikut terhapus).

**Rujukan kode:**

- `src/app/api/admin/brands/route.ts` ΓÇö `GET`/`POST`, guard, pesan duplikat exact ("Nama brand sudah digunakan", "Slug sudah digunakan").
- `src/app/api/admin/brands/[id]/route.ts` ΓÇö `PATCH`/`DELETE`, `INVALID_ID`, `EMPTY_UPDATE`, pesan duplikat (bentuk sama dengan kategori).
- `src/lib/brands/validation.ts` ΓÇö `brandSchema`, `brandUpdateSchema`, semua pesan Zod exact.
- `src/lib/categories/validation.ts` ΓÇö `slugSchema` diimpor lintas fitur brand.
- `src/app/admin/brands/page.tsx` ΓÇö Server Component, header "Brand".
- `src/components/admin/TaxonomyManager.tsx` ΓÇö UI bersama.
- `src/lib/utils/prisma-error.ts` ΓÇö mapping P2002/P2003/P2025 + `DUPLICATE` 409.

---

## <a name="cart-01"></a>CART-01 ├óΓé¼ΓÇ¥ Add to Cart

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-01 ├óΓé¼ΓÇ¥ Add to Cart |
| Modul | MOD-CART |
| Tujuan | Guest/Customer menambahkan produk ke cart |
| Aktor utama | Guest, Customer |
| Status | Terimplementasi (PH-02) |
| Referensi PRD | PRD 3.1.B (Shopping Cart) |
| Referensi SDD | SDD 4.3 (MOD-CART), CartItem schema |

**Status tambahan 2026-10-16 — tombol "Buat Pesanan" (semula "Checkout") di halaman detail produk (TERIMPLEMENTASI).** Permintaan pengguna: halaman detail mendapat tombol kedua di samping "Tambah ke Keranjang" yang langsung menuju checkout. Perilaku: `POST /api/cart` dengan kuantitas dari input Jumlah (jalur CART-01 yang sama), lalu `router.push("/checkout?variantIds=<variantId>")` — pola dan tujuan identik dengan tombol "Beli" di dialog varian kartu (CART-05, AC-CART-05-03). Kedua tombol nonaktif saat varian terpilih habis atau ada aksi berjalan; di layar sempit keduanya turun ke baris sendiri (baris aksi `flex-wrap`). Tautan informasi tambahan (PROD-08) ikut dirapatkan dari 20px jadi 8px di bawah baris tombol (keputusan pengguna 2026-10-16). **Revisi label (2026-10-16):** label tombol kedua diganti dari "Checkout" jadi "Buat Pesanan" (permintaan pengguna: "ganti ke buat pesanan") — perilaku tidak berubah, teks menunggu tetap "Memproses...", dan konsisten dengan label submit form checkout ("Buat Pesanan" di `/checkout`). Label ringkasan keranjang ("Checkout (N item)") dan tombol dialog varian ("Beli") tidak diubah.

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
- **Elemen:** Variant selector, quantity input, "Add to Cart" button, tombol "Buat Pesanan" (lihat status tambahan 2026-10-16), cart badge

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

## <a name="cart-02"></a>CART-02 ├óΓé¼ΓÇ¥ Update Cart Item

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-02 ├óΓé¼ΓÇ¥ Update Cart Item |
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
| Bukan pemilik cart | Ubah jumlah | Tidak ada ├óΓé¼ΓÇ¥ identitas diambil dari sesi/cookie, bukan dari body | Cart milik orang lain tidak pernah tersentuh |

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

## <a name="cart-03"></a>CART-03 ├óΓé¼ΓÇ¥ Remove from Cart

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-03 ├óΓé¼ΓÇ¥ Remove from Cart |
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
| Bukan pemilik cart | Hapus item | Tidak ada ├óΓé¼ΓÇ¥ identitas diambil dari sesi/cookie, bukan dari body | Cart milik orang lain tidak pernah tersentuh |

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

## <a name="cart-04"></a>CART-04 ├óΓé¼ΓÇ¥ Merge Guest Cart on Login (tambahan)

> Fitur ini **tambahan di luar indeks PRD**. PRD tidak mencantumkannya sebagai fitur terpisah, tetapi
> perilakunya wajib begitu keranjang guest disimpan di luar akun: tanpa penggabungan, item yang
> ditambahkan sebelum login akan hilang.

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-04 ├óΓé¼ΓÇ¥ Merge Guest Cart on Login |
| Modul | MOD-CART |
| Tujuan | Isi keranjang guest dipindahkan ke keranjang customer setelah login/registrasi, tanpa kehilangan item |
| Aktor utama | Guest yang baru login/registrasi |
| Status | Terimplementasi (PH-02) |
| Referensi PRD | PRD 3.1.B (Shopping Cart) ├óΓé¼ΓÇ¥ perilaku turunan |
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

## <a name="cart-05"></a>CART-05 ΓÇö Pemilihan Varian dari Kartu Produk (dialog)

### 1. Identitas dan tujuan

Modul: MOD-CART (berdekatan MOD-PROD tampilan katalog). Dipicu permintaan pengguna 2026-10-15: tombol "Keranjang" dan "Beli" pada kartu produk (beranda, katalog, hasil cari/filter) saat ini langsung memakai varian pertama yang stoknya tersedia, sehingga pembeli tidak sempat memilih varian. Tujuannya: bila produk punya lebih dari satu varian dengan stok efektif, klik tombol membuka dialog pemilihan varian terlebih dahulu ΓÇö nama produk, gambar, daftar varian; ditambah tautan bergaya *back link* ke halaman detail untuk bagan ukuran dan detail lengkap.

Dua tambahan 2026-10-15 (massukan pengguna kedua dan ketiga, keputusan `docs/04` bagian 10 dan 16):

- **Stok efektif (dilaporkan lewat tangkapan layar kartu "bias"):** kartu tadinya tidak menghitung kuantitas varian yang sudah di keranjang pembeli, sehingga tombol tetap aktif lalu klik ditolak "Stok tidak cukup (tersisa 0)". Kartu kini menilai `stok efektif = stock - kuantitas di keranjang`; bila semua unit sudah di keranjang, tombol "Keranjang" mengarah langsung ke halaman keranjang dengan highlight baris itemnya.
- **Keputusan tampilan:** tombol keadaan itu cukup berlabel "Keranjang" (bukan "Semua stok ada di keranjang"), tanpa dialog tambahan ΓÇö klik menuju halaman keranjang dan men-highlight baris varian (termasuk yang unitnya tinggal satu / *last-only stock*).

### 2. Prasyarat dan pemicu

- Layar memakai `ProductCard`; `canShop` berasal dari `getCartAccess()`. Guest/Customer (dan tanpa sesi) -> `canShop = true`, tombol aktif; role lain mis. admin -> `canShop = false`, blok aksi tetap dirender dengan tombol dalam keadaan **disabled** (revisi pengguna 2026-10-16; sebelumnya blok aksi tidak dirender sama sekali).
- Data varian sudah disertakan server saat render (`ProductWithRelations.variants`), jadi tidak ada API baru.
- Komponen dialog tersedia (`src/components/ui/dialog.tsx`, Radix).
- **Stok efektif:** halaman beranda/katalog membaca kuantitas keranjang pembeli (`getCartQuantities` ΓÇö guest Redis / customer `CartItem`) sekali per render dan meneruskannya ke kartu.

Pemicu: klik tombol "Keranjang" atau "Beli" pada kartu.

### 3. Entitas terkait

Read-only terhadap `ProductVariant` dan gambar `ProductImage` (role `SIZE_CHART` untuk tautan); penulisan data hanya lewat CART-01 (`POST /api/cart`).

### 4. Input, validasi, kegagalan (data)

Tidak ada input baru. Pilihan varian = `variantId` dari dialog; validasi server tetap milik CART-01: cek varian ada, produk tersedia, dan stok cukup (`400 INSUFFICIENT_STOCK` dengan `remaining = stock - kuantitas di keranjang`). Server penentu akhir. Pesan galat yang masih mungkin (stok berubah di antara render dan klik) ditampilkan lewat komponen `Alert` destruktif ΓÇö di dalam dialog lewat `FormErrorAlert`, dan pada kartu satu varian sebagai `Alert` destruktif, bukan teks merah mentah.

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Klik "Keranjang"/"Beli" pada kartu multi-varian | state lokal | Dialog "Pilih Varian" terbuka, varian pertama yang stok efektifnya tersedia terpilih |
| 2 | Pilih varian | state lokal | Ringkasan harga mengikuti varian terpilih |
| 3 | Klik "Keranjang" / "Beli" | `POST /api/cart` | Item masuk keranjang; "Beli" lanjut ke `/checkout?variantIds=...` |
| 4 | Dialog tutup | `router.refresh()` | Kartu segar; kuantitas baru di keranjang ikut mengubah stok efektif |

Pada produk satu varian berstok-efektif, langkah 1 langsung ke langkah 3 tanpa dialog.

### 6. Output dan perubahan data

- **Data diubah:** hanya via CART-01 (keranjang guest Redis / `CartItem` customer), kuantitas 1 per klik.
- **Tidak mengubah:** produk, varian, stok gudang.

### 7. Alur alternatif

- Produk punya **satu varian** yang stok efektifnya tersedia: klik langsung tanpa dialog.
- Klik gambar atau nama produk: menuju detail tanpa dialog.
- Semua varian stok gudang 0: tombol "Stok habis" disabled, tanpa dialog.
- Semua unit varian sudah di keranjang pembeli (stok gudang > 0, stok efektif 0): tombol berganti satu tombol outline berlabel **"Keranjang"**; klik `router.push("/cart?hilite=<variantId>")` ΓÇö halaman keranjang men-highlight baris item varian itu dan menggulirnya ke pandangan (bagian 9), tanpa permintaan ke server.

### 8. Perilaku kegagalan

| Kondisi | Sumber | Respons |
| --- | --- | --- |
| Stok varian berkurang saat dialog terbuka | `POST /api/cart` | `400 INSUFFICIENT_STOCK`, pesan tampil di dalam dialog, dialog tetap terbuka |
| Semua varian stok 0 | ΓÇö | Tombol "Stok habis" disabled, tanpa navigasi |
| Semua unit varian sudah di keranjang pembeli | ΓÇö | Tombol "Keranjang" aktif; klik menuju halaman keranjang dengan highlight, tanpa permintaan ke server |
| Role bukan pembeli | - | Tombol tetap dirender dalam keadaan disabled di seluruh keadaan (revisi pengguna 2026-10-16; sebelumnya tidak dirender); klik tidak berbuat apa pun, tanpa navigasi maupun permintaan ke server |

### 9. Perilaku UI

- **Kartu:** dua tombol `sm` sejajar ("Keranjang" outline, "Beli" default); keadaan penuh di keranjang diganti satu tombol outline "Keranjang". Untuk role bukan pembeli (canShop false) kedua tombol itu - termasuk tombol keadaan penuh - dirender dalam keadaan disabled.
- **Dialog** (`VariantPickerDialog`, `max-w-md`): judul "Pilih Varian"; ringkasan gambar 64px + nama + harga varian terpilih; daftar varian radio dengan harga dan keterangan (`Stok {efektif}` / "Stok habis" / "Sudah di keranjang" untuk yang sudah di keranjang penuh); CTA "Keranjang" dan "Beli" (nonaktif bila varian terpilih tidak berstok efektif atau pending); `FormErrorAlert`; tautan "Lihat bagan ukuran & detail lengkap" hanya bila produk punya gambar `SIZE_CHART`.
- **Halaman keranjang:** parameter `hilite=<variantId>` (dipisah koma bila beberapa) membuat baris `CartItemRow` yang cocok di-highlight (latar `bg-accent/40` + cincin `ring-2 ring-primary`) dan digulir ke tengah pandangan saat pertama tampil; parameter tidak memengaruhi pengecekan item untuk checkout.
- Pilihan kembali ke varian pertama yang tersedia setiap dialog dibuka ulang (remount lewat `key`, bukan setState dalam effect).

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-CART-05-01 | Produk multi-varian | Klik "Keranjang" | Dialog terbuka, daftar varian, varian pertama tersedia terpilih |
| AC-CART-05-02 | Dialog terbuka | Pilih varian, klik "Keranjang" | Item varian terpilih masuk keranjang |
| AC-CART-05-03 | Dialog terbuka | Klik "Beli" | Item masuk keranjang lalu pindah ke `/checkout?variantIds=...` |
| AC-CART-05-04 | Produk satu varian berstok | Klik "Keranjang"/"Beli" | Langsung tanpa dialog |
| AC-CART-05-05 | Varian dengan stok 0 | Lihat daftar | Baris disabled "Stok habis" |
| AC-CART-05-06 | Semua varian habis | Klik tombol | Tidak ada dialog; tombol "Stok habis" disabled |
| AC-CART-05-07 | Produk punya gambar `SIZE_CHART` | Lihat dialog | Tautan "Lihat bagan ukuran & detail lengkap" menuju detail produk |
| AC-CART-05-08 | Dialog terbuka, stok varian berkurang | Klik "Keranjang" | `400 INSUFFICIENT_STOCK`, pesan tampil di-dialog |
| AC-CART-05-09 | Escape / backdrop | Tutup dialog | Tanpa perubahan keranjang |
| AC-CART-05-10 | Semua unit varian sudah di keranjang (stok gudang > 0, stok efektif 0) ΓÇö termasuk unit stok terakhir | Klik tombol kartu | Satu tombol "Keranjang" aktif; klik menuju `/cart?hilite=<variantId>`, baris item varian itu di-highlight dan digulir ke pandangan; tanpa permintaan tulis ke server |
| AC-CART-05-11 | Varian yang semua unitnya sudah di keranjang pembeli | Lihat daftar dialog | Baris disabled berlabel "Sudah di keranjang"; CTA mati bila varian terpilih demikian; baris berstok efektif lain menampilkan `Stok {efektif}` |
| AC-CART-05-12 | Login sebagai role bukan pembeli (Store Admin / Site Admin) | Buka beranda atau katalog | Kartu tetap menampilkan tombol "Keranjang" dan "Beli" dalam keadaan disabled (juga tombol keadaan penuh dan "Stok habis"); klik tidak berbuat apa pun, tanpa dialog, navigasi, maupun permintaan ke server |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Multi-varian | "Kaos Polos Katun Combed 30s" | Dialog dengan radio per varian, harga ikut terpilih | AC-01 |
| Satu varian | produk varian tunggal berstok | Langsung tanpa dialog | AC-04 |
| Habis | varian stok 0 | Baris disabled "Stok habis" | AC-05 |
| Bagan ukuran | produk dengan gambar `role=SIZE_CHART` | Tautan muncul | AC-07 |
| Stok efektif 0 (2026-10-15) | produk "bias" stok gudang 1, 1 unit sudah di keranjang | Tombol "Keranjang" ΓåÆ `/cart?hilite=<id varian roha>`, baris highlight | AC-10 |
| Dialog "Sudah di keranjang" | kaos varian M stok 25, 25 unit di keranjang | Baris M disabled "Sudah di keranjang" | AC-11 |

### 12. Batas fitur

- **Termasuk:** dialog pemilihan varian dari kartu, stok efektif di kartu/dialog, arah ke halaman keranjang dengan highlight bila semua stok sudah di keranjang
- **Tidak termasuk:** kuantitas > 1 per klik (naikkan di halaman keranjang, CART-02), duplikasi bagan ukuran dalam dialog, dialog tambahan untuk keadaan penuh di keranjang, perubahan API/skema
- **Ketergantungan:** CART-01, PROD-05 (gambar `SIZE_CHART`), `ProductCard`/`ProductGrid`, `src/lib/cart/queries.ts` (`getCartQuantities`), halaman keranjang (`CartView`/`CartItemRow`)

### 13. Pertanyaan terbuka

Tidak ada.

**Rujukan kode:**

- `src/components/products/VariantPickerDialog.tsx` ΓÇö dialog pemilihan varian + `stokEfektif` + tipe `CardVariantOption` (kolom `keranjang`).
- `src/components/products/ProductCardActions.tsx` ΓÇö tiga keadaan tombol: stok habis / penuh di keranjang (push `/cart?hilite=...`) / normal (dialog atau langsung).
- `src/components/products/ProductCard.tsx`, `ProductGrid.tsx` ΓÇö penerus `cartQuantities` (angka, bukan `Decimal`, aman lewat props RSC).
- `src/lib/cart/queries.ts` ΓÇö `getCartQuantities(identity)` kuantitas per varian.
- `src/components/cart/CartView.tsx` + `CartItemRow.tsx` ΓÇö penerimaan parameter `hilite` (highlight + menggulir).
- Halaman beranda + katalog ΓÇö `getCartQuantities` sekali per render.

---

## <a name="ship-01"></a>SHIP-01 ├óΓé¼ΓÇ¥ Calculate Shipping Cost

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SHIP-01 ├óΓé¼ΓÇ¥ Calculate Shipping Cost |
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
| Bukan pemilik | Hitung ongkir | Tidak bisa ├óΓé¼ΓÇ¥ berat dihitung server dari identitas pemanggil | Body `weight` dari klien diabaikan |

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

- **Hasil:** `{source, cached, options:[{courier,code,service,description,cost,etd}]}` ├óΓé¼ΓÇ¥ berat paket **tidak** ikut di respons supaya tidak terbaca customer/guest; berat tetap dipakai server sebagai kunci cache dan parameter RajaOngkir
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
- **Sudah termasuk sejak revisi 2026-10-10:** berat per varian (`ProductVariant.weightGram`) ΓÇö pengganti asumsi berat seragam yang berlaku sebelumnya (bagian 13)
- **Ketergantungan:** MOD-CART (berat dari keranjang), RajaOngkir Komerce API v1 (opsional)

### 13. Pertanyaan terbuka

- Berat paket dihitung dari berat varian (`ProductVariant.weightGram`, gram) yang diisi admin di form produk. `SHIPPING_WEIGHT_PER_ITEM_GRAM` (default 1000) hanya cadangan untuk varian yang beratnya 0/belum diisi. Berat **tidak** ditampilkan ke customer/guest dan **tidak pernah** diterima dari body request.

---

## <a name="order-01"></a>ORDER-01 ├óΓé¼ΓÇ¥ Create Order (Guest Checkout)

> **Cakupan PH-03:** pembuatan pesanan saja. Pembayaran (Xendit) ada di PH-04, voucher dan email
> konfirmasi ada di PH-05. Karena itu `voucherCodes` dan AC yang bergantung padanya ditandai
> ditunda, dan pesanan dibuat tanpa baris `Payment`.

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-01 ├óΓé¼ΓÇ¥ Create Order (Guest Checkout) |
| Modul | MOD-ORDER |
| Tujuan | Guest checkout tanpa registrasi, dengan OTP verification |
| Aktor utama | Guest |
| Status | Terimplementasi (PH-03) |
| Referensi PRD | PRD 3.1.C (Checkout & Order), PRD 5.1 (Stock Management), PRD 5.7 (Guest Checkout) |
| Referensi SDD | SDD 4.4 (MOD-ORDER), Order schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Keranjang berisi minimal satu item terpilih, nomor HP guest terverifikasi (AUTH-01)
- **Pemicu:** Klik "Checkout" dari halaman keranjang
- **Titik masuk:** Halaman keranjang `/cart` ├óΓÇáΓÇÖ `/checkout`
- **Jika tidak terpenuhi:** Keranjang kosong atau tidak ada item terpilih ├óΓÇáΓÇÖ kembali ke `/cart`; nomor belum terverifikasi ├óΓÇáΓÇÖ tampilkan langkah OTP

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
- Stok dikurangi saat pesanan dibuat lalu dikembalikan saat reservasi kedaluwarsa. PH-04 tidak perlu mengurangi stok lagi saat pembayaran berhasil ├óΓé¼ΓÇ¥ cukup mengubah status pesanan.

---

## <a name="order-02"></a>ORDER-02 ├óΓé¼ΓÇ¥ Create Order (Customer)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-02 ├óΓé¼ΓÇ¥ Create Order (Customer) |
| Modul | MOD-ORDER |
| Tujuan | Customer yang sudah login membuat pesanan tanpa verifikasi OTP (sudah terautentikasi) |
| Aktor utama | Customer |
| Status | Terimplementasi (PH-03) |
| Referensi PRD | PRD 3.1.C (Checkout & Order), PRD 5.1 (Stock Management) |
| Referensi SDD | SDD 4.4 (MOD-ORDER), Order schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login, keranjang berisi minimal satu item terpilih
- **Pemicu:** Klik "Checkout" dari `/cart`
- **Titik masuk:** `/cart` ├óΓÇáΓÇÖ `/checkout`
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`; tidak ada item terpilih ├óΓÇáΓÇÖ kembali ke `/cart`

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

- **Diperbarui 2026-10-10:** alamat tersimpan (maks 5, PRD 5.8) kini punya fase ├óΓé¼ΓÇ¥ **PH-07 Customer Management** (`docs/04` bagian 12). Sampai fase itu selesai, alamat tetap diisi per pesanan dan disimpan sebagai `shippingAddress` (JSON) di Order, sesuai SDD 6.2.

---

## <a name="order-03"></a>ORDER-03 ├óΓé¼ΓÇ¥ Order History

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-03 ├óΓé¼ΓÇ¥ Order History |
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
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`

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
- **Data diubah:** Status pesanan kedaluwarsa ├óΓÇáΓÇÖ CANCELED beserta pengembalian stok (pelepasan malas)
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

## <a name="order-04"></a>ORDER-04 ├óΓé¼ΓÇ¥ Track Order (Public)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-04 ├óΓé¼ΓÇ¥ Track Order (Public) |
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
- **Data diubah:** Status pesanan kedaluwarsa ├óΓÇáΓÇÖ CANCELED beserta pengembalian stok (pelepasan malas)
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

## <a name="pay-01"></a>PAY-01 ├óΓé¼ΓÇ¥ Create Payment (Xendit)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PAY-01 ├óΓé¼ΓÇ¥ Create Payment (Xendit) |
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

## <a name="pay-02"></a>PAY-02 ├óΓé¼ΓÇ¥ Webhook Handler (Xendit)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PAY-02 ├óΓé¼ΓÇ¥ Webhook Handler (Xendit) |
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

Tidak berlaku ├óΓé¼ΓÇ¥ background process.

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

## <a name="vouch-01"></a>VOUCH-01 ΓÇö Apply Voucher

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | VOUCH-01 ΓÇö Apply Voucher |
| Modul | MOD-VOUCH |
| Tujuan | Pembeli memasukkan kode voucher saat checkout, memperoleh pratinjau diskon yang dihitung server, dan diskon final diterapkan saat pesanan dibuat |
| Aktor utama | Customer (login) dan Guest (keranjang + OTP) di `/checkout` |
| Status | Terimplementasi (PH-05); lanjutan cakupan produk/kategori pada PH-06 |
| Referensi PRD | PRD 5.4 (konfigurasi voucher), PRD 5.3 (mekanisme diskon), PRD 7.5 (maksimal 2 voucher) |
| Referensi SDD | SDD 4.6; bukti `docs/04` bagian 8 (rincian PH-05: keputusan stacking, kuota, pratinjau server) dan bagian 9 (cakupan voucher) |

### 2. Prasyarat dan pemicu

- **Titik masuk:** `/checkout` (dari ORDER-02); input voucher muncul setelah keranjang valid
- **Pemicu:** pembeli mengetik kode lalu klik tombol tambah; setiap perubahan tarif ongkir atau metode pickup memicu validasi ulang (voucher ongkir bergantung tarif terpilih)
- **Jika tidak terpenuhi:** tanpa keranjang/identitas ΓåÆ `403 FORBIDDEN` dari `getCartAccess()`

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Customer / Guest dengan keranjang | Pratinjau diskon voucher | `POST /api/vouchers/validate` (subtotal dihitung server dari keranjang) | `403 FORBIDDEN` bila akses keranjang gagal |
| Guest / Customer | Terapkan diskon final | `POST /api/orders/create` dengan `voucherCodes` (field ORDER-01) | `400 INVALID_VOUCHER` bila kuota lewat di transaksi |
| Store Admin | Membuat/mengelola voucher sumber | VOUCH-02 | - |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| codes | String[] | Tidak (default `[]`) | tiap kode 1..30 karakter, regex `^[A-Za-z0-9_-]+$`; array maksimal 2 | "Kode voucher wajib diisi" / "Kode voucher tidak valid" / "Maksimal 2 voucher per transaksi" |
| variantIds | String[] | Ya | 1..50 UUID item yang ada di keranjang | "Pilih minimal satu produk" / "Terlalu banyak produk dipilih" |
| shippingCost | Number | Tidak (default 0) | 0..1.000.000.000 (hanya untuk pratinjau voucher ongkir) | "Nilai tidak valid" |
| phone | String | Tidak | `phoneSchema`: 1..20 karakter, hanya angka, dinormalisasi | "Nomor HP wajib diisi" / "Nomor HP hanya boleh berisi angka" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Pembeli ketik kode di `/checkout`, klik tambah | `POST /api/vouchers/validate` dengan `codes`, `variantIds`, `shippingCost`, `phone` | Kode masuk daftar chip (maksimal 2) |
| 2 | Server hitung subtotal dari keranjang, bukan dari klien | - | Subtotal bersumber server (OWASP A03/A04) |
| 3 | `resolveVouchers` memeriksa aturan PRD 5.4 | `200 {"valid": true, "subtotal", "discount": {productDiscount, shippingDiscount, totalDiscount, breakdown}, "errors": []}` | Diskon tampil di ringkasan |
| 4 | Pembeli klik "Buat Pesanan" | `POST /api/orders/create` mengirim `voucherCodes`; `createOrder` menghitung ulang semuanya | `Order.discount` terisi, `VoucherUsage` terekam |
| 5 | Server naikkan `usageCount` dengan `updateMany` bersyarat `usageCount < usageLimit` | - | Kuota aman dari pesanan berbarengan |
| 6 | System | - | Ringkasan pesanan menampilkan baris "Diskon voucher" |

### 6. Output dan perubahan data

- **Data dibaca:** keranjang (variantId ΓåÆ quantity), `ProductVariant.price`, `Product.categoryId`, model `Voucher`, `VoucherProduct`, `VoucherCategory`, `VoucherCompatibility`, `VoucherUsage`
- **Data dibuat:** baris `VoucherUsage` (`voucherId`, `orderId`, `phone`, `amount`) ΓÇö hanya jika `breakdown` tidak kosong
- **Data diubah:** `Voucher.usageCount` (+1 per voucher terpakai, dalam transaksi pesanan)
- **Kondisi akhir:** `Order.discount` > 0 bila voucher valid; angka final selalu hasil perhitungan ulang server, bukan angka pratinjau

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Validasi gagal (kode tidak dikenal, kedaluwarsa, dst.) | `resolveVouchers` tetap `200` dengan `valid: false` dan daftar `errors: {code, reason}` | Pesan alasan tampil per chip voucher; angka diskon 0 |
| Beberapa voucher, sebagian tidak valid | Semua voucher ditolak (reject-all), termasuk gagal kombinasi stacking | Tidak ada diskon sebagian |
| Nominal/persentase melebihi dasar yang dicakup | `calculateDiscount` membatasi per voucher dengan total baris yang dicakup | Potongan tidak lebih besar dari dasar |
| Metode pickup / ongkir berubah | Validasi ulang otomatis dengan nilai `shippingCost` baru (0 untuk pickup) | Voucher ongkir sesuai tarif terpilih |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Akses keranjang tidak valid | `403 FORBIDDEN` | Perbaiki sesi/keranjang |
| Body bukan JSON valid / Zod gagal | `400 VALIDATION_ERROR` (pesan persis kolom 4) | Perbaiki input |
| Tidak ada identitas keranjang atau item terpilih kosong | `400 CART_EMPTY` "Keranjang kosong" | Isi keranjang dulu |
| Kuota habis di sela transaksi (`bumped.count === 0`) | `400 INVALID_VOUCHER` "Kuota voucher sudah habis" (di `createOrder`) | Hilangkan voucher; transaksi dibatalkan |
| Kode tidak ditemukan/tidak aktif/belum berlaku/kedaluwarsa | `200 valid:false`; `reason` "Kode voucher tidak ditemukan" / "Voucher tidak aktif" / "Voucher belum berlaku" / "Voucher sudah kedaluwarsa" | Tampilkan di chip |
| Minimal belanja / cakupan / kuota / per-HP / stacking tidak terpenuhi | `reason`: "Minimal belanja {nominal}" / "Voucher tidak berlaku untuk produk di keranjang" / "Kuota voucher sudah habis" / "Voucher sudah dipakai untuk nomor HP ini" / "Tidak bisa digabung dengan {kode}" (default menolak) | Tampilkan di chip |

### 9. Perilaku UI

- **Halaman:** `/checkout`, blok **Voucher** ΓÇö input "Kode voucher", tombol tambah nonaktif saat `voucherLoading`, input kosong, atau kode sudah mencapai 2
- **Keterangan:** "Maksimal 2 voucher per transaksi."
- **Setiap kode dirender sebagai chip** dengan tombol hapus dan pesan `reason` merah per chip bila ada

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Memeriksa voucher | "Memeriksa voucher..." | Tunggu |
| Voucher valid | Baris "Diskon voucher" `-Rp...` di ringkasan; total berkurang | Lanjut buat pesanan |
| Voucher gagal | Pesan `reason` per chip; diskon 0 | Hapus chip / pakai kode lain |
| Slot penuh (2) | Tombol tambah nonaktif | Hapus chip untuk mengganti |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-VOUCH-01-01 | Voucher nominal aktif, keranjang memenuhi min transaksi | Masukkan kode di `/checkout` | Baris "Diskon voucher" muncul dengan angka dari server |
| AC-VOUCH-01-02 | Dua voucher tanpa baris `VoucherCompatibility` | Masukkan keduanya | Keduanya ditolak dengan "Tidak bisa digabung dengan {kode}" (default menolak) |
| AC-VOUCH-01-03 | `usageLimit` tercapai | Pratinjau / buat pesanan | "Kuota voucher sudah habis"; transaksi tidak dibuat |
| AC-VOUCH-01-04 | `usageLimitPerPhone` tercapai untuk nomor HP pembeli | Validasi dengan `phone` | "Voucher sudah dipakai untuk nomor HP ini" |
| AC-VOUCH-01-05 | Voucher hanya berlaku untuk kategori A, keranjang berisi kategori B | Validasi | "Voucher tidak berlaku untuk produk di keranjang" |
| AC-VOUCH-01-06 | Pembeli sudah memasukkan 2 voucher | Klik tambah | Input dibatasi maksimal 2; tombol tambah nonaktif |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Pratinjau valid | `{"codes":["VOUCH10"],"variantIds":["<uuid>"],"shippingCost":10000,"phone":"08123456789"}` | `valid:true`, `totalDiscount` > 0 | AC-VOUCH-01-01 |
| Kode tidak dikenal | `codes: ["SALAH123"]` | `valid:false`, `errors[0].reason` = "Kode voucher tidak ditemukan" | - |
| Lebih dari 2 | `codes: [c1, c2, c3]` | `400 VALIDATION_ERROR` "Maksimal 2 voucher per transaksi" | AC-VOUCH-01-06 |

### 12. Batas fitur

- **Termasuk:** pratinjau voucher server-side, maksimal 2 voucher, breakdown diskon dari server, cakupan produk/kategori (PH-06), kuota per HP, matriks kompatibilitas
- **Tidak termasuk:** CRUD voucher admin (VOUCH-02), penghitungan diskon di sisi klien
- **Ketergantungan:** MOD-CART (keranjang), ORDER-01/ORDER-02 (pembuatan pesanan), VOUCH-02 (sumber data voucher)

### 13. Pertanyaan terbuka

- Tidak ada.

**Rujukan kode:**

- `src/app/api/vouchers/validate/route.ts` ΓÇö endpoint pratinjau, subtotal dihitung server.
- `src/lib/vouchers/eligibility.ts` ΓÇö pemeriksaan aturan PRD 5.4 + pesan `reason`.
- `src/lib/vouchers/calculation.ts` ΓÇö urutan nominal ΓåÆ persentase, cakupan, voucher ongkir terpisah.
- `src/lib/vouchers/validation.ts` ΓÇö `voucherValidateSchema` (kolom 4).
- `src/lib/orders/mutations.ts` ΓÇö penerapan final di `createOrder` + `VoucherUsage` + `usageCount`.
- `src/components/checkout/CheckoutForm.tsx` ΓÇö perilaku UI chip dan pemanggilan validasi.
- `src/lib/orders/validation.ts` ΓÇö `voucherCodes` pada skema order create.

---

## <a name="vouch-02"></a>VOUCH-02 ΓÇö Voucher CRUD (Store Admin)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | VOUCH-02 ΓÇö Voucher CRUD |
| Modul | MOD-VOUCH |
| Tujuan | Store Admin membuat, melihat daftar/detail, mengubah, dan menghapus voucher beserta cakupan produk/kategori dan matriks kompatibilitas stacking |
| Aktor utama | STORE_ADMIN |
| Status | Terimplementasi (PH-05); cakupan produk/kategori di PH-06 |
| Referensi PRD | PRD 5.4 (8 pengaturan per voucher + stacking compatibility) |
| Referensi SDD | SDD 4.6; bukti `docs/04` bagian 8 (TASK-50, uji H1-H24, keputusan stacking default menolak) |

### 2. Prasyarat dan pemicu

- **Titik masuk:** `/admin/vouchers`, `/admin/vouchers/new`, `/admin/vouchers/[id]/edit`
- **Pemicu:** Store Admin membuka daftar, menekan Tambah, memilih voucher untuk edit, atau menjalankan tombol hapus
- **Jika tidak terpenuhi:** tanpa sesi ΓåÆ `401 UNAUTHORIZED` (`requireStoreAdmin` ΓåÆ `unauthorized()`); role salah ΓåÆ `403 FORBIDDEN` (`forbidden()`)

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| STORE_ADMIN | Daftar + detail + buat + ubah + hapus | `GET/POST /api/admin/vouchers`, `GET/PATCH/DELETE /api/admin/vouchers/[id]` | - |
| Customer / Guest / role lain | Akses endpoint mana pun | - | `401` / `403` |
| Akun dinonaktifkan | Semua aksi | `findUserAccessById` memeriksa `deactivatedAt` | `401 UNAUTHORIZED` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| code (body, POST/PATCH) | String | Ya | trim, upperCase, 3..30 karakter, regex `^[A-Z0-9_-]+$` | "Kode voucher wajib diisi" / "Kode minimal 3 karakter" / "Kode hanya boleh huruf, angka, minus, dan garis bawah" |
| type | enum `PERCENTAGE` \| `NOMINAL` \| `SHIPPING` | Ya | `VOUCHER_TYPES` | "Jenis voucher wajib dipilih" / "Jenis voucher tidak valid" |
| discountPercentage | Number | Ya bila PERCENTAGE | 0..100 (moneySchema: 0..1e9) | "Persentase wajib diisi" / "Persentase maksimal 100" |
| discountAmount | Number | Ya bila NOMINAL/SHIPPING | 0..1e9 | "Nominal wajib diisi" |
| maxDiscount | Number | Tidak | 0..1e9 | "Nilai terlalu besar" |
| minTransaction | Number | Tidak (default 0) | 0..1e9 | "Nilai tidak boleh negatif" |
| usageLimit, usageLimitPerPhone | Number \| null | Tidak | int 0..1.000.000 atau null | "Harus bilangan bulat" / "Tidak boleh negatif" |
| validFrom, validUntil | Date (coerce) | Ya | `validUntil > validFrom` | "Tanggal mulai wajib diisi" / "Tanggal akhir harus setelah tanggal mulai" |
| isActive | Boolean | Tidak (default `true`) | boolean | "Status tidak valid" |
| compatibleVoucherIds | UUID[] | Tidak (default `[]`) | maks 50 UUID | "Voucher tidak valid" |
| eligibleProductIds / excludedProductIds | UUID[] | Tidak (default `[]`) | maks 200 UUID | "Produk tidak valid" / "Terlalu banyak produk dipilih" |
| categoryIds | UUID[] | Tidak (default `[]`) | maks 100 UUID | "Kategori tidak valid" / "Terlalu banyak kategori dipilih" |
| id (param) | String | Ya | UUID | `400 INVALID_ID` "ID tidak valid" |
| page, limit, search (GET list) | Number / String | Tidak | pageΓëÑ1, limit 1..100 (default 20), searchΓëñ200 tanpa kontrol karakter | "Kata kunci tidak valid" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Admin buka `/admin/vouchers` | `GET /api/admin/vouchers?page&limit&search` | Daftar voucher terbaru dengan `_count.usages` |
| 2 | Admin pilih Tambah / Edit | `VoucherForm` memuat opsi produk (maks 500), kategori, dan voucher lain (`getVoucherOptions`, `getVoucherScopeOptions`) | Form siap |
| 3 | Admin isi form ΓåÆ simpan | `POST /api/admin/vouchers` atau `PATCH /api/admin/vouchers/[id]` | `201 {voucher}` / `200 {voucher}` |
| 4 | Server transaksional | `createVoucher` / `updateVoucher` (Prisma `$transaction`) | Baris voucher dibuat/diubah, `VoucherCompatibility` dan cakupan diselangkan ulang |
| 5 | Admin hapus | `DELETE /api/admin/vouchers/[id]` | `200 {deleted:true}` |
| 6 | Admin kembali ke daftar | - | Voucher tampil di daftar; status/periode/kuota tercatat |

### 6. Output dan perubahan data

- **Data dibaca:** `Voucher`, `VoucherProduct`, `VoucherCategory`, `VoucherCompatibility`, opsi `Product`/`Category`
- **Data dibuat:** `Voucher`, `VoucherCompatibility` (`voucherAId`, `voucherBId`, `isAllowed: true`), `VoucherProduct` (kind `ELIGIBLE`/`EXCLUDED`), `VoucherCategory`
- **Data diubah:** field `voucherData()` ΓÇö field yang tidak relevan dengan type dikosongkan (mis. `discountAmount = null` pada voucher persentase); sync compat dan scope memakai pola "deleteMany lalu createMany" supaya form menjadi satu-satunya sumber kebenaran; produk eligible menang atas produk yang sama di daftar excluded
- **Data dihapus:** voucher + relasinya (`deleteVoucher`)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| PATCH mengubah kode ke yang sudah dipakai voucher lain | Prisma `P2002` | `409 DUPLICATE` "Kode voucher sudah digunakan" |
| POST dengan kode yang sudah ada | Prisma `P2002` | `409 DUPLICATE` "Kode voucher sudah digunakan" |
| GET/POST dari bukan STORE_ADMIN | - | `401` / `403` |
| GET/PATCH/DELETE ID tidak ada | - | `404 NOT_FOUND` "Voucher tidak ditemukan" |
| Cakupan merujuk data yang tidak ada | Prisma `P2003` | `400 INVALID_REFERENCE` "Data terkait tidak ditemukan" |

### 8. Kondisi gagal

| Kondisi | Kode HTTP | Tindakan |
| --- | --- | --- |
| Tanpa sesi | `401 UNAUTHORIZED` | Login ulang sebagai admin |
| Role bukan STORE_ADMIN | `403 FORBIDDEN` | Cek role |
| Zod gagal | `400 VALIDATION_ERROR` + daftar path persis kolom 4 | Perbaiki input |
| ID param bukan UUID | `400 INVALID_ID` "ID tidak valid" | Perbaiki URL |
| Detail/PATCH/DELETE voucher tidak ada | `404 NOT_FOUND` "Voucher tidak ditemukan" | Muat ulang daftar |
| Kode duplicate | `409 DUPLICATE` "Kode voucher sudah digunakan" | Pakai kode lain |
| Error server tak terduga | `500 INTERNAL_ERROR` "Terjadi kesalahan, coba lagi" (detail hanya ke log, OWASP A09) | Cek log server |

### 9. Perilaku UI

- **Halaman:** `/admin/vouchers` ΓåÆ tombol Tambah dan daftar dengan status aktif; `/admin/vouchers/new` dan `/admin/vouchers/[id]/edit` sama-sama memakai `VoucherForm`
- **Form:** pilih jenis voucher, nilai diskon sesuai jenis, min transaksi, periode, kuota total, kuota per HP, status `isActive`, matriks kompatibilitas, cakupan (produk eligible, produk dikecualikan, kategori)

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Menyimpan | Tombol nonaktif / state loading | Tunggu |
| Validasi gagal | Pesan per field dari Zod | Perbaiki |
| Kode duplicate | "Kode voucher sudah digunakan" | Ganti kode |
| Berhasil | Alihkan/refresh ke daftar; voucher tampil | Lanjut kelola voucher lain |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-VOUCH-02-01 | Admin login | `POST /api/admin/vouchers` dengan payload nominal valid | `201` dan voucher tampil di daftar |
| AC-VOUCH-02-02 | Kode voucher sudah ada | `POST` dengan kode sama | `409 DUPLICATE` "Kode voucher sudah digunakan" |
| AC-VOUCH-02-03 | Admin login | `GET /api/admin/vouchers` | `200` daftar + total, terurut `createdAt desc` |
| AC-VOUCH-02-04 | Customer login | `GET /api/admin/vouchers` | `403 FORBIDDEN` |
| AC-VOUCH-02-05 | Admin login | `PATCH /api/admin/vouchers/[id]` data valid | `200`, compat dan scope terganti utuh |
| AC-VOUCH-02-06 | Admin login, voucher ada | `DELETE /api/admin/vouchers/[id]` | `200 {deleted:true}`; akses berikutnya `404` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Nominal valid | `{"code":"GRATIS10K","type":"NOMINAL","discountAmount":10000,"minTransaction":50000,"validFrom":"2026-10-01","validUntil":"2026-10-31","usageLimit":100,"usageLimitPerPhone":1}` | `201` | AC-VOUCH-02-01 |
| Persentase dengan cap | `{"code":"DISK20","type":"PERCENTAGE","discountPercentage":20,"maxDiscount":50000,"validFrom":"...","validUntil":"..."}` | Voucher dengan batas potongan | AC-VOUCH-02-05 |
| Duplicate | `code: "GRATIS10K"` dikirim kedua kali | `409` "Kode voucher sudah digunakan" | AC-VOUCH-02-02 |

### 12. Batas fitur

- **Termasuk:** CRUD voucher, matriks `VoucherCompatibility` (default menolak), cakupan produk/kategori (`VoucherProduct.kind` `ELIGIBLE`/`EXCLUDED`), kuota total + per HP, batasan `maxDiscount` untuk voucher persentase
- **Tidak termasuk:** penerapan voucher di checkout (VOUCH-01), bulk import/export voucher, arsip/riwayat voucher yang dihapus
- **Ketergantungan:** MOD-AUTH (guard `requireStoreAdmin`), data produk/kategori untuk opsi cakupan

### 13. Pertanyaan terbuka

- Tidak ada.

**Rujukan kode:**

- `src/app/api/admin/vouchers/route.ts`, `src/app/api/admin/vouchers/[id]/route.ts` ΓÇö endpoint CRUD dan kode error.
- `src/lib/vouchers/validation.ts` ΓÇö `voucherSchema`, `voucherListQuerySchema`.
- `src/lib/vouchers/queries.ts` ΓÇö daftar/detail/opsi cakupan.
- `src/lib/vouchers/mutations.ts` ΓÇö transaksi create/update/delete + sync compat/scope.
- `src/lib/utils/prisma-error.ts` ΓÇö P2002 ΓåÆ `409 DUPLICATE` "Kode voucher sudah digunakan".
- `src/app/admin/vouchers/page.tsx`, `src/app/admin/vouchers/new/page.tsx`, `src/app/admin/vouchers/[id]/edit/page.tsx` ΓÇö halaman admin.

---

## <a name="notif-01"></a>NOTIF-01 ΓÇö Send Email Notification

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | NOTIF-01 ΓÇö Send Email Notification |
| Modul | MOD-NOTIF |
| Tujuan | Mengirim email transaksional berisi ringkasan pesanan kepada pembeli pada kejadian pesanan; hanya channel email (lewat HTTP API Resend), tanpa SMS/WhatsApp |
| Aktor utama | System (Server) |
| Status | Terimplementasi (PH-05); email lanjutan (shipped/cancel/refund) pada lanjutan NOTIF-01 di PH-06 |
| Referensi PRD | PRD 3.1.I (notifikasi email) |
| Referensi SDD | SDD 4.9; bukti `docs/04` bagian 8 (keputusan `EMAIL_FROM` dari env, jalur email non-blocking) dan bagian 9 (email shipped/cancel/refund ΓÇö 2 dari 6 jenis jalan sejak PH-05) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** `RESEND_API_KEY` terisi; tanpa nilai itu, `isEmailConfigured()` mengembalikan `false` dan seluruh pengiriman email **dilewati** tanpa menggagalkan alur pesanan/pembayaran (non-blocking, SDD 4.9)
- **Pemicu (tabel kejadian):**

| Kejadian | Fungsi | Template |
| --- | --- | --- |
| Pesanan dibuat | `sendOrderConfirmationEmail(orderId)` (dipanggil di `POST /api/orders/create`) | `buildOrderConfirmationEmail` |
| Pembayaran `PAID` (webhook Xendit / rekonsiliasi) | `sendPaymentSuccessEmail(orderId)` lewat `applyPaidPayment` | `buildPaymentSuccessEmail` |
| Pesanan dikirim (PH-06) | `sendOrderShippedEmail(orderId)` | `buildOrderShippedEmail` |
| Pembatalan disetujui / ditolak (PH-06) | `sendCancellationEmail(orderId, decision)` dengan decision `"approved" | "rejected"` | `buildCancellationEmail` |
| Refund selesai (PH-06) | `sendRefundCompletedEmail(orderId)` | `buildRefundCompletedEmail` |
| (Terkait, bukan pesanan) | `src/lib/notifications/account-emails.ts` ΓÇö email akun | - |

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| System (Server) | Kirim email transaksional | `sendEmail` ΓåÆ `POST https://api.resend.com/emails` dengan `Authorization: Bearer ${RESEND_API_KEY}` | `NOT_CONFIGURED` / `PROVIDER_ERROR` (hanya dicatat di log) |
| Customer | Mengatur preferensi per jenis email | `shouldSendNotification(order.userId, "orderConfirmation")` dst. (PH-07/PH-10) | Preferensi menolak ΓåÆ email tidak dikirim |
| Tidak ada endpoint publik | - | - | - |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| to (SendEmailInput) | String | Ya | `resolveRecipient` = `order.guestEmail ?? order.user?.email`; kosong ΓåÆ fungsi return tanpa kirim | - |
| subject | String | Ya | dibangun template; contoh persis: `Konfirmasi Pesanan ${order.orderNumber} - ${brandName}` | - |
| html | String | Ya | `renderLayout` (heading, intro, bodyHtml, footerHtml = brandName) | - |
| Env `RESEND_API_KEY` | String | Ya (konfigurasi) | `process.env.RESEND_API_KEY?.trim()` tidak boleh kosong | `NOT_CONFIGURED` |
| Env `EMAIL_FROM` | String | Tidak | default `getEmailFrom(brandName)` = `${brandName} <onboarding@resend.dev>` | `PROVIDER_ERROR` dari Resend bila domain belum terverifikasi |
| Env `NEXT_PUBLIC_APP_URL` | String | Tidak | default `"http://localhost:3000"` untuk link `orderUrl` | - |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Kejadian terjadi (mis. pesanan dibuat) | - | Server memanggil fungsi pengiriman |
| 2 | Cek konfigurasi | `isEmailConfigured()` `false` ΓåÆ return | Email dilewati tanpa memengaruhi alur |
| 3 | Muat order + items + user | `prisma.order.findUnique` | Data order + brand dimuat |
| 4 | Tentukan penerima (`resolveRecipient`) | `guestEmail` dulu, lalu `user.email` | Guest pun tetap dapat konfirmasi |
| 5 | Cek preferensi | `shouldSendNotification` | Boleh kirim |
| 6 | Kirim ke Resend | `fetch` `POST` dengan `Authorization: Bearer ${apiKey}` | Respons ok ΓåÆ `{ ok: true }` |
| 7 | Tidak ada perubahan data | - | Alur utama (pesanan/pembayaran) tetap jalan |

### 6. Output dan perubahan data

- **Tidak ada perubahan data** ΓÇö tidak ada tabel log email di database
- **Side effect eksternal:** email terkirim ke penerima; jejak kegagalan hanya di log server `[notifications]`
- **Data dibaca:** `Order` + items + `user.email` (+ `Payment.paidAt`, `Refund` terbaru, `trackingNumber`, `cancelReason`/`cancelRejectionReason`), brand (`getBrandSetting`) untuk nama pengirim dan footer

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Guest checkout | Email tetap terkirim, penerima `guestEmail` | Guest dapat konfirmasi ke email yang diisi saat checkout |
| Pesanan tidak punya user dan email guest | `resolveRecipient` null ΓåÆ return | Tidak ada email terkirim, alur tetap jalan |
| Domain uji Resend (`onboarding@resend.dev`) | Resend hanya menerima kirim ke alamat pemilik akun ΓÇö `403` dicatat sebagai `PROVIDER_ERROR` di log, pesanan tetap `201` (bukti `docs/04` bagian 8, uji H15: jalur email terbukti non-blocking) | Pesanan tetap berhasil |
| User menolak jenis email | `shouldSendNotification` false | Email tidak dikirim |

### 8. Kondisi gagal

| Kondisi | Kode HTTP | Tindakan |
| --- | --- | --- |
| `RESEND_API_KEY` kosong | (bukan HTTP ΓÇö fail-safe) | `NOT_CONFIGURED` dicatat; fungsi return, order diproses seperti biasa |
| Respons Resend non-2xx | (status Resend apa pun; log persis: `[notifications] Resend menolak (${response.status}): ${detail}`) | `PROVIDER_ERROR` dicatat, alur pemanggil tetap jalan |
| Resend tidak bisa dihubungi (network/error) | log `[notifications] Resend gagal dihubungi` | `PROVIDER_ERROR`, tanpa melempar error |
| Handler melempar error apa pun | (try/catch di luar setiap fungsi) | `console.error`, aplikasi tetap jalan ΓÇö detail error hanya di log (OWASP A09) |

### 9. Perilaku UI

- **Tidak ada UI khusus** ΓÇö output berupa email HTML yang diterima pembeli
- **Template teks ringkas (konfirmasi):** heading "Pesanan Diterima", intro "Terima kasih, pesanan Anda sudah kami catat."; nomor pesanan + status + kurir; tabel item; ringkasan "Subtotal" / "Ongkos kirim" / ("Diskon voucher" bila > 0) / "Total"; bila `stockReservedUntil` ada: "Selesaikan pembayaran sebelum {tanggal} agar pesanan tidak dibatalkan otomatis"; tombol/link `Lihat Pesanan & Bayar` ΓåÆ `{appUrl}/orders/{id}`; footer = nama brand

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Order dibuat | Konfirmasi + link `/orders/{id}` | Lanjut bayar |
| Pembayaran PAID | Email pembayaran (nomor pesanan, `total`, `paidAt`, link `/orders/{id}`) | - |
| Shipped (PH-06) | Link pelacakan: user ΓåÆ `/orders/{id}/tracking`; guest ΓåÆ `/track-order` | Lacak |
| Pembatalan approved/rejected (PH-06) | `decision` + `order.cancelReason` / `order.cancelRejectionReason` | - |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-NOTIF-01-01 | Pesanan dibuat (customer atau guest dengan email terisi) | Server menyelesaikan `POST /api/orders/create` | Email terkirim dengan subjek persis `Konfirmasi Pesanan {orderNumber} - {brandName}`; pesanan tetap dibuat walau email gagal |
| AC-NOTIF-01-02 | Webhook Xendit atau rekonsiliasi menerapkan `PAID` | `applyPaidPayment` jalan | Email pembayaran terkirim; webhook tetap sukses |
| AC-NOTIF-01-03 | `RESEND_API_KEY` kosong | Kejadian email mana pun | Tidak ada panggilan Resend; server tidak error |
| AC-NOTIF-01-04 | `RESEND_API_KEY` terisi tetapi Resend menolak (403 domain uji) | Konfirmasi email | Log mencatat `Resend menolak (403)`, respons tetap `201`, order tetap jalan |
| AC-NOTIF-01-05 | Pesanan tanpa `user` dan tanpa `guestEmail` | Kejadian email | Tidak ada eksekusi kirim; tidak error |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Konfirmasi guest | `orderId: "<uuid>"`, `guestEmail` terisi | `to = guestEmail`, subjek `Konfirmasi Pesanan FLEX-0000001 - FlexStore` | AC-NOTIF-01-01 |
| Env default | `RESEND_API_KEY` terisi, `EMAIL_FROM` kosong, `NEXT_PUBLIC_APP_URL` kosong | from `FlexStore <onboarding@resend.dev>`, link `http://localhost:3000/orders/{id}` | bukti `docs/04` bagian 8 |
| Email gagal but non-blocking | Resend menolak 403 | log `[notifications] Resend menolak (403): ...`, order tetap `201` | AC-NOTIF-01-04 |

### 12. Batas fitur

- **Termasuk:** email konfirmasi + pembayaran (PH-05), email shipped/cancel/refund (lanjutan NOTIF-01 PH-06), penerima guest maupun customer
- **Tidak termasuk:** SMS/WhatsApp, email ke admin, editor template, retry/queue (fail-safe saja, bukan job)
- **Terkait tapi di luar NOTIF-01:** NOTIF-02 pusat notifikasi in-app (PH-10)
- **Ketergantungan:** MOD-ORDER (kejadian pesanan), MOD-PAY (kejadian webhook), MOD-CUST (`shouldSendNotification`, PH-07), env `RESEND_API_KEY` / `EMAIL_FROM` / `NEXT_PUBLIC_APP_URL`

### 13. Pertanyaan terbuka

- Tidak ada. (Catatan `docs/04` bagian 8: email produksi butuh domain terverifikasi di Resend via `EMAIL_FROM`; dengan default `onboarding@resend.dev` hanya alamat pemilik akun Resend yang bisa menerima.)

**Rujukan kode:**

- `src/lib/notifications/email.ts` ΓÇö `sendEmail` non-blocking, env `RESEND_API_KEY`, log "Resend menolak".
- `src/lib/notifications/config.ts` ΓÇö `isEmailConfigured`, `getEmailFrom` (`EMAIL_FROM`, default `onboarding@resend.dev`).
- `src/lib/notifications/order-emails.ts` ΓÇö fungsi per kejadian + `resolveRecipient` + `trackingUrlFor`.
- `src/app/api/orders/create/route.ts` ΓÇö pemicu `sendOrderConfirmationEmail` setelah pesanan dibuat.
- `src/lib/payments/mutations.ts` ΓÇö `sendPaymentSuccessEmail` pada `applyPaidPayment`.
- `src/emails/order-confirmation.ts` ΓÇö template teks ringkas + subjek persis.

---

## <a name="inv-01"></a>INV-01 ΓÇö Generate Invoice (HTML siap-cetak)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | INV-01 ΓÇö Generate Invoice |
| Modul | MOD-INV |
| Tujuan | Menyediakan dokumen invoice untuk pesanan yang sudah lunas, dirender sebagai halaman HTML siap-cetak yang bisa disimpan sebagai PDF lewat dialog cetak browser |
| Aktor utama | Customer (login) dan Guest (cookie bertanda-tangan) |
| Status | Terimplementasi (PH-05); revisi akses 2026-10-11: invoice hanya untuk pesanan lunas |
| Referensi PRD | PRD invoice (MOD-INV; rujukan SDD 4.10) |
| Referensi SDD | SDD 4.10 ΓÇö deviasi tercatat: **bukan** `@react-pdf/renderer`, tapi halaman HTML + `window.print()`; bukti `docs/04` bagian 8 (butir 7, deviasi) dan bagian 10 (keputusan "invoice hanya untuk lunas") |

### 2. Prasyarat dan pemicu

- **Titik masuk:** `/orders/[id]` ΓåÆ tombol **Lihat Invoice** (hanya dirender bila `order.payment?.status === "PAID"`), atau URL langsung `/orders/[id]/invoice`
- **Pemicu:** render Server Component (`await connection()`)
- **Jika tidak terpenuhi:** order tidak ditemukan / akses tidak cocok / pembayaran belum `PAID` ΓåÆ `notFound()` (HTTP `404`) ΓÇö URL langsung pun ditolak

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Customer (login) | Lihat invoice pesanannya | `getShopperUser()` + `getOrderDetail(user.id, id)` | Bukan miliknya ΓåÆ `404` (AC-ORDER-02-04) |
| Guest | Lihat invoice pesanannya | `getGuestAccessPhone()` + `getGuestOrderDetail(id, guestPhone)` (cookie bertanda-tangan) | Tidak cocok ΓåÆ `404` |
| Pesanan belum bayar / dibatalkan sebelum bayar / ID salah | Semua | - | `404` dari `notFound()` |
| Pesanan lunas yang kemudian dibatalkan + refund | Lihat invoice (bukti transaksi tetap sah) | `payment.status` masih `PAID` | Tetap bisa diakses (keputusan `docs/04` bagian 10) |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| id (param URL) | String | Ya | harus cocok order milik pemanggil; guest divalidasi lewat `guestPhone` cookie | Tidak cocok ΓåÆ `notFound()` |
| order.payment.status | enum Prisma | Ya (wajib `PAID`) | `order.payment?.status !== "PAID"` ΓåÆ `notFound()` | - |
| order.shippingAddress | JSON | Tidak (bila kosong, field tampil kosong) | field opsional: `name, phone, street, city, province, district, subdistrict, postalCode` | - |
| brand (SITE-05, PH-09) | brand setting | Tidak | `getBrandSetting()` ΓÇö `brandName`, `logoUrl` untuk kop invoice | - |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Pembeli lunas buka `/orders/[id]` | Tombol "Lihat Invoice" tampil | Tautan ke `/orders/[id]/invoice` |
| 2 | Pembeli klik tautan / buka URL langsung | Render page | `200` halaman dengan `metadata.title = "Invoice"` |
| 3 | Page memeriksa akses (aturan sama dengan halaman pesanan) | `getShopperUser` / `getGuestAccessPhone` | Order valid milik pemanggil |
| 4 | Cek `payment?.status === "PAID"` | `notFound()` bila tidak lunas | Hanya pesanan lunas yang bisa dibuka |
| 5 | Halaman menampilkan kop `LUNAS` + rincian | - | Invoice sesuai kolom 9 |
| 6 | Pembeli klik tombol **Cetak / Simpan PDF** | `window.print()` | Dialog cetak browser terbuka; PDF bisa disimpan |

### 6. Output dan perubahan data

- **Tidak ada perubahan data** ΓÇö halaman read-only, tidak ada mutasi
- **Data dibaca:** `Order` (orderNumber, status, subtotal, discount, shippingCost, total, shippingCourier, shippingService, shippingEtd, shippingAddress JSON, createdAt), `OrderItem` (productName, variantName, sku, quantity, price), `Payment.status`, brand setting
- **Output:** halaman HTML dengan varian CSS cetak (`print:*`); elemen navigasi (`BackLink`, tombol cetak) disembunyikan saat mencetak (`print:hidden`)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Pesanan lunas kemudian dibatalkan + refund | `payment.status` tetap `PAID`, halaman tidak menolak (bukti transaksi tetap sah) | Invoice tetap bisa diakses |
| Guest kehilangan cookie akses | `getGuestAccessPhone()` null | `notFound()` |
| `discount` = 0 | Baris "Diskon voucher" disembunyikan | Ringkasan hanya Subtotal / Ongkos kirim / Total |
| `shippingAddress` kosong | Field alamat tampil kosong (tidak crash) | Page tetap dirender |
| Logo brand tidak diatur | Fallback tampilkan nama brand sebagai teks | Kop tetap ada |

### 8. Kondisi gagal

| Kondisi | Kode HTTP | Tindakan |
| --- | --- | --- |
| ID tidak ada di DB | `404` (dari `notFound()`) | Halaman 404 Next.js default |
| Order milik pengguna lain (customer) | `404` (bukan `403`, agar keberadaan tidak bocor ΓÇö AC-ORDER-02-04) | Halaman 404 |
| Guest tanpa cookie yang cocok | `404` | Akses ulang dari halaman pesanan guest |
| Pembayaran belum `PAID` (WAITING_PAYMENT/EXPIRED, atau dibatalkan sebelum bayar) | `404` ΓÇö URL langsung pun ditolak | Bayar pesanan dulu lewat "Bayar Sekarang" (PAY-01) |

### 9. Perilaku UI

- **Halaman:** `/orders/[id]/invoice`, `metadata.title = "Invoice"`
- **Kop:** logo (atau nama brand) di kiri; di kanan: teks status ΓÇö `LUNAS` bila `isPaid`, label status pesanan sebagai cadangan; tanggal `formatDateTime(order.createdAt)`; teks `Invoice {order.orderNumber}`
- **Ditagihkan kepada:** `address.name`, `address.phone`, `address.street`, gabungan koma dari `subdistrict, district, city, province, postalCode` (field kosong dibuang)
- **Pengiriman:** `{courier} - {service}` atau `"-"`, plus `Estimasi {shippingEtd}` bila ada
- **Tabel item:** kolom Item (nama produk + `variantName` + `SKU {item.sku}`) | Qty | Harga (`formatRupiah(price)`) | Jumlah (`formatRupiah(price * quantity)`)
- **Ringkasan:** Subtotal, Diskon voucher (hanya bila > 0, bentuk `-Rp...`), Ongkos kirim, Total (tebal)
- **Cetak:** `PrintButton` (`window.print()` teks tombol "Cetak / Simpan PDF"); kontainer memakai `print:max-w-none print:px-0 print:py-0`; baris `BackLink` + `PrintButton` diberi `print:hidden`

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Pesanan lunas | Invoice penuh + tombol `Cetak / Simpan PDF` + `Kembali ke pesanan` | Cetak/simpan PDF |
| Pesanan belum bayar | `404 NOT_FOUND` | Tidak ada invoice; kembali ke pesanan |
| Tautan di `/orders/[id]` pada pesanan belum lunas | Tombol "Lihat Invoice" tidak dirender | - |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-INV-01-01 | Pesanan lunas milik customer login | Buka `/orders/{id}/invoice` | Invoice tampil dengan kop `LUNAS`, item, dan Total; tombol `Cetak / Simpan PDF` menjalankan `window.print()` |
| AC-INV-01-02 | Pesanan belum dibayar | Buka URL langsung `/orders/{id}/invoice` | `404 NOT_FOUND`; tombol `Lihat Invoice` tidak muncul di `/orders/[id]` |
| AC-INV-01-03 | Pesanan dibatalkan sebelum bayar | Buka URL langsung | `404` ΓÇö invoice hanya sah setelah lunas |
| AC-INV-01-04 | Pesanan lunas milik customer lain | Buka URL invoice | `404` (bukan `403`); keberadaan tidak bocor |
| AC-INV-01-05 | Guest punya cookie akses, pesanan lunas | Buka URL invoice | Invoice tampil |
| AC-INV-01-06 | Pesanan lunas lalu dibatalkan + refund | Buka invoice | Tetap tampil (bukti transaksi tetap sah) |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Invoice tampil | `id: "<uuid-pesanan-lunas>"` | Kop `brand.brandName` + `Invoice FLEX-0000001`, `LUNAS` | AC-INV-01-01 |
| Belum bayar | `payment.status = "PENDING"` | `notFound()` ΓåÆ halaman 404 Next.js | AC-INV-01-02 |
| Pasca-refund | `payment.status = "PAID"`, `Order.status = "CANCELED"` | Invoice tetap tampil | AC-INV-01-06 |

### 12. Batas fitur

- **Termasuk:** akses lewat sesi customer / cookie guest, filter `payment.status === "PAID"`, cetak lewat `window.print()` + CSS `print:*`, tautan `Lihat Invoice` di `/orders/[id]` hanya untuk lunas, kop memakai `getBrandSetting` (SITE-05)
- **Tidak termasuk:** PDF yang dibangkitkan server (`@react-pdf/renderer` ditolak sebagai deviasi tercatat), invoice untuk pesanan belum lunas, lampiran PDF di email
- **Ketergantungan:** ORDER (data Order/OrderItem), PAY-01 (`Payment.status` untuk keputusan lunas), SITE-05 (`getBrandSetting` untuk logo + nama brand di kop)

### 13. Pertanyaan terbuka

- Tidak ada.

**Rujukan kode:**

- `src/app/(storefront)/orders/[id]/invoice/page.tsx` ΓÇö halaman, `notFound()`, filter pembayaran lunas, brand, field yang tampil.
- `src/components/invoices/PrintButton.tsx` ΓÇö tombol "Cetak / Simpan PDF" dengan `window.print()`.
- `src/app/(storefront)/orders/[id]/page.tsx` ΓÇö tautan "Lihat Invoice" dirender hanya bila `order.payment?.status === "PAID"`.
- `src/lib/orders` (`getOrderDetail`, `getGuestOrderDetail`, `getGuestAccessPhone`) ΓÇö aturan akses customer vs guest.

---

## <a name="ship-02"></a>SHIP-02 ΓÇö Track Shipment

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SHIP-02 ΓÇö Track Shipment |
| Modul | MOD-SHIP |
| Tujuan | Membuat pelanggan (customer dan guest) bisa melihat status perjalanan pesanan: nomor resi dari Store Admin, kurir/layanan, dan riwayat milestone (dibuat ΓåÆ dibayar ΓåÆ dikirim ΓåÆ selesai), tanpa membuka keberadaan pesanan ke pihak luar |
| Aktor utama | Customer (login), Guest (publik, dengan nomor pesanan + nomor HP) |
| Status | Terimplementasi (PH-06) |
| Referensi PRD | 2.2 ("Track shipping status", "Tracking order tanpa input data"), 4.9 ("Tracking link") |
| Referensi SDD | 4.7 (shipping), 5 (rute `/api/orders/track`, `/orders/[id]/tracking`, `/track-order`) |

### 2. Prasyarat dan pemicu

- Sumber data: pesanan memasuki status `SHIPPED` via ORDER-07 (admin isi `trackingNumber`); field `Order.trackingNumber`, `shippedAt`, `shippingCourier`, `shippingService`, `shippingEtd`.
- Pemicu guest: membuka `/track-order` lalu mengirim form lacak (`POST /api/orders/track`).
- Pemicu customer: membuka `/track-order` (daftar pesanan dalam perjalanan) atau tombol **Lacak** di `/orders` menuju `/orders/[id]/tracking`.

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Guest (publik) | Lacak via form | Kepemilikan dibuktikan dengan pasangan `orderNumber` + `phone` yang cocok (`guestPhone` atau nomor HP akun customer) | Data salah ΓåÆ `404 NOT_FOUND` "Pesanan tidak ditemukan" (generik, `AC-ORDER-04-02`); >10 percobaan/IP/10 menit ΓåÆ `429 RATE_LIMITED` |
| Customer (login) | Daftar pesanan dalam perjalanan + detail tracking | Sesi (`getShopperUser`), query dibatasi `userId` | Pesanan bukan miliknya / ID bukan UUID ΓåÆ `notFound()` (404 generik) |
| Admin | Tidak memakai jalur ini; admin memakai `/admin/orders` (ORDER-07) | - | - |

### 4. Input dan validasi

Endpoint `POST /api/orders/track`, body divalidasi dengan `trackOrderSchema` (`src/lib/orders/validation.ts`):

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| orderNumber | String | Ya | `.trim().toUpperCase().regex(ORDER_NUMBER_PATTERN)` ΓÇö pola `/^FS-\d{8}-[A-Z0-9]{6}$/` (`src/lib/orders/number.ts`) | "Nomor pesanan wajib diisi" / "Nomor pesanan tidak valid" |
| phone | String | Ya | `phoneSchema`: min 1, maks 20 karakter, `PHONE_CHARS_REGEX`, dinormalisasi ke `+62ΓÇª`, refine `/^\+62\d{8,11}$/` | "Nomor HP wajib diisi" / "Nomor HP hanya boleh berisi angka" / "Nomor HP tidak valid" / "Nomor HP maksimal 20 karakter" |

Detail tracking per pesanan (halaman `/orders/[id]/tracking`) tidak menerima input selain parameter rute `id`.

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Guest buka `/track-order`, isi nomor pesanan + nomor HP, klik "Lacak Pesanan" | `POST /api/orders/track` | Form tampil; customer login tidak melihat form (hanya daftar) |
| 2 | Server | Validasi Zod, lalu `allowTrackAttempt(getClientIp(request))` (Redis, kunci `track:limit:<ip>`, maks 10/600 detik) | Dibatasi atau lanjut |
| 3 | Server | `findOrderForTracking(orderNumber, phone)` ΓÇö `prisma.order.findFirst({ where: { orderNumber, OR: [{ guestPhone: phone }, { user: { phone } }] }, include: { items: true } })` | Pesanan cocok |
| 4 | Server | `apiSuccess({ order: {...} })` | Status, ringkasan biaya, kurir/layanan/ETD, alamat, item dikembalikan (tanpa `userId`/`guestEmail`) |
| 5 | Client | Kartu hasil dirender di `TrackOrderForm` | Pelanggan melihat status dan detail pesanan |
| 6 | Customer login | Buka `/orders/[id]/tracking` | Riwayat Perjalanan (4 milestone dengan waktu nyata) + kartu Pengiriman (kurir, nomor resi, estimasi, tujuan) |

### 6. Output dan perubahan data

- **Hasil:** Tampilan status perjalanan; tidak ada perubahan data pesanan.
- **Data dibaca:** Order (status, `createdAt`, subtotal, `shippingCost`, discount, total, `shippingCourier`, `shippingService`, `shippingEtd`, `shippingAddress`, `trackingNumber`, `shippedAt`, `payment.paidAt`, items) ΓÇö hanya-baca.
- **Data dibuat/diubah:** Tidak ada. `releaseExpiredReservations()` dipanggil sebagai efek samping housekeeping di awal query.
- **Data dibuat di sisi rate limit:** kunci Redis `track:limit:<ip>` dengan `INCR` + `EXPIRE` 600 detik.
- **Catatan:** riwayat hanya milestone dengan waktu nyata (tanpa tabel riwayat status di schema).

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Customer login membuka `/track-order` | Form disembunyikan; server memanggil `getInTransitOrdersForUser(user.id)` ΓÇö `PROCESSING`/`SHIPPED` milik user, urut `createdAt` desc | Daftar "Pesanan Dalam Perjalanan" dengan tombol "Lacak" ke `/orders/[id]/tracking` |
| Tidak ada pesanan dalam perjalanan | Teks "Tidak ada pesanan yang sedang diproses atau dikirim." | Bagian kosong informatif |
| Redis gagal / tidak ada IP | `allowTrackAttempt` menangkap error, catat log `[orders] pembatasan lacak gagal, dilewati`, kembalikan `true` | Fitur tetap jalan (degrade gracefully) |
| Pesanan belum memiliki resi | Tracking page menampilkan `-` untuk nomor resi; detail pesanan menampilkan resi hanya bila ada | Tampilan tetap konsisten |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Body tidak valid (Zod gagal) | `400 VALIDATION_ERROR` (pesan per field bagian 4) | Perbaiki isian form |
| Lebih dari 10 percobaan / 10 menit per IP | `429 RATE_LIMITED` ΓÇö "Terlalu banyak percobaan, coba lagi nanti" | Tunggu jendela waktu |
| `orderNumber` benar tapi `phone` tidak cocok | `404 NOT_FOUND` ΓÇö "Pesanan tidak ditemukan" (sama persis dengan pesanan tidak ada) | Cek ulang data; keberadaan pesanan tidak bocor |
| Customer membuka pesanan milik lain | Halaman `notFound()` (404) | Tidak ada tindakan |
| Terjadi error server | Ditangani `withRouteErrors` | Tanggapan galat generik |

### 9. Perilaku UI

- **Halaman:** `/track-order` (judul "Lacak Pesanan", metadata `{ title: "Lacak Pesanan" }`, `export const instant = false`).
- **Komponen:** `TrackOrderForm` (`src/components/orders/TrackOrderForm.tsx`) ΓÇö input `track-order-number` (placeholder `FS-20261010-AB12CD`), `track-phone` (filter `PHONE_INPUT_FILTER`), tombol "Lacak Pesanan" / "Mencari...".

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal (guest) | Form kosong | Isi lalu kirim |
| Mencari | Tombol "Mencari...", disabled | Tunggu |
| Ditemukan | Kartu hasil: nomor pesanan, waktu, badge status, daftar item, Subtotal/Ongkir/Total, "Kirim ke ..." | Baca |
| Galat | `FormErrorAlert` dengan pesan dari server | Perbaiki lalu coba lagi |
| Customer login | Section "Pesanan Dalam Perjalanan" + list dengan `OrderStatusBadge` | Klik "Lacak" |
| Detail tracking | `/orders/[id]/tracking`: "Riwayat Perjalanan" (maks 4 milestone) + "Pengiriman" | Baca |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-SHIP-02-01 | Pesanan `PROCESSING` menjadi `SHIPPED` dengan resi (ORDER-07) | Customer buka `/orders/[id]/tracking` | Milestone "Dikirim" + nomor resi tampil |
| AC-SHIP-02-02 | Guest punya pesanan dengan nomor HP yang sama | `POST /api/orders/track` dengan pasangan cocok | `200`, status + item + total dikembalikan tanpa `userId`/`guestEmail` |
| AC-SHIP-02-03 | Nomor HP salah | `POST /api/orders/track` | `404 NOT_FOUND` "Pesanan tidak ditemukan", pesan sama dengan "pesanan tidak ada" |
| AC-SHIP-02-04 | 10 percobaan gagal dari IP yang sama | Percobaan ke-11 | `429 RATE_LIMITED` "Terlalu banyak percobaan, coba lagi nanti" |
| AC-SHIP-02-05 | Customer login membuka `/track-order` | Halaman dimuat | Daftar pesanan `PROCESSING`/`SHIPPED` tanpa input; tanpa form |
| AC-SHIP-02-06 | Customer A membuka `/orders/<id-milik-B>/tracking` | Halaman dimuat | 404 generik |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Lacak valid | `{ "orderNumber": "FS-20261010-AB12CD", "phone": "08123456789" }` | `200 { order: { orderNumber, status, subtotal, shippingCost, discount, total, shippingCourier, shippingService, shippingEtd, shippingAddress, items[] } }` | AC-SHIP-02-02 |
| Nomor pesanan salah format | `orderNumber: "ABC123"` | `400 VALIDATION_ERROR` "Nomor pesanan tidak valid" | AC-SHIP-02-03 |
| Detail customer | `/orders/<uuid>/tracking` | Riwayat: "Pesanan dibuat" ΓåÆ "Pembayaran diterima" ΓåÆ "Dikirim" ΓåÆ "Selesai" | AC-SHIP-02-01 |

### 12. Batas fitur

- **Termasuk:** resi + kurir + milestone dari data internal (tampilan), lacak publik guest, daftar in-transit customer, rate limit IP.
- **Tidak termasuk:** integrasi real-time ke sistem pelacakan kurir (RajaOngkir/cek resi langsung), riwayat checkpoint kurir pihak ketiga, notifikasi SMS.
- **Ketergantungan:** ORDER-07 (admin memasukkan nomor resi, transisi `PROCESSING` ΓåÆ `SHIPPED`), MOD-ORDER (status pesanan), Redis (rate limit, degrade gracefully), email shipped (NOTIF-01 lanjutan).

### 13. Pertanyaan terbuka

- Tidak ada.

**Rujukan kode:**

- `src/app/api/orders/track/route.ts` ΓÇö endpoint `POST /api/orders/track`: validasi, rate limit, pencarian, pesan 404 generik.
- `src/lib/orders/validation.ts` ΓÇö `trackOrderSchema` dan pesan errornya.
- `src/lib/orders/number.ts` ΓÇö `ORDER_NUMBER_PATTERN = /^FS-\d{8}-[A-Z0-9]{6}$/`.
- `src/lib/orders/queries.ts` ΓÇö `findOrderForTracking` (pasangan nomor pesanan + HP).
- `src/lib/orders/rate-limit.ts` ΓÇö `allowTrackAttempt`, `getClientIp`, kunci `track:limit:<ip>`.
- `src/lib/orders/admin.ts` ΓÇö `getInTransitOrdersForUser`, `getTrackingOrderForUser`, `markOrderShipped` (sumber resi).
- `src/app/(storefront)/track-order/page.tsx` ΓÇö halaman dua jalur guest/customer.
- `src/app/(storefront)/orders/[id]/tracking/page.tsx` ΓÇö detail tracking session-scoped, milestone.
- `src/components/orders/TrackOrderForm.tsx` ΓÇö form lacak guest dan kartu hasil.
- `docs/04_IMPLEMENTATION_PLAN.md` bagian 9.4/9.5 ΓÇö bukti verifikasi PH-06 dan laporan review.

---

## <a name="ship-03"></a>SHIP-03 ΓÇö Pickup / Ambil di Toko

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SHIP-03 ΓÇö Pickup / Ambil di Toko |
| Modul | MOD-SHIP |
| Tujuan | Menyediakan metode pemenuhan pesanan tanpa pengiriman: pembeli memilih "Ambil di toko" di checkout, tanpa kurir/tujuan dan tanpa ongkir, bila opsi diaktifkan Store Admin |
| Aktor utama | Customer dan Guest (checkout), Store Admin (pengatur) |
| Status | Terimplementasi (PH-06) |
| Referensi PRD | 3.1.F ("Ambil di toko"), 3.1.J, 4.7 |
| Referensi SDD | 4.7 (shipping), 4.11 (config), 5 (rute `/checkout`, `/api/orders/create`), 6.2 (status `Order.fulfillment`) |

### 2. Prasyarat dan pemicu

- `StoreSetting.pickupEnabled = true` (diatur di `/admin/settings`, CONFIG-01); opsi pickup tampil di `/checkout` hanya bila `getPickupSettings().enabled`.
- Pemicu: pembeli memilih fulfillment `PICKUP` pada checkout, lalu mengirim `POST /api/orders/create` dengan `fulfillment: "PICKUP"`.

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Customer (login) | Membuat pesanan pickup | Sesi (`getCartAccess`) | Opsi tidak tampil bila pickup nonaktif |
| Guest (OTP terverifikasi) | Membuat pesanan pickup | `guestPhone` + penanda `isPhoneVerified` di Redis | `403 PHONE_NOT_VERIFIED` bila belum verifikasi |
| Admin | Membuat pesanan pickup | - | Tidak ada; admin bukan pembeli (jalur checkout menolak role lain) |
| Store Admin | Mengaktifkan pickup + isi info | `requireStoreAdmin()` di `/api/admin/settings` | `401` tanpa sesi (bukti `docs/04` bagian 9.4 V6) |

### 4. Input dan validasi

Bagian dari `orderCreateSchema` (`src/lib/orders/validation.ts`); eksak:

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| fulfillment | Enum `"DELIVERY" \| "PICKUP"` | Tidak (default `"DELIVERY"`) | `z.enum(FULFILLMENT_METHODS)`, `FULFILLMENT_METHODS = ["DELIVERY", "PICKUP"]` | "Metode pemenuhan tidak valid" |
| variantIds | UUID[] | Ya | min 1, maks 50 | "Pilih minimal satu produk" / "Terlalu banyak produk dipilih" / "Varian tidak valid" |
| address | `shippingAddressSchema` | Ya (subset) | `name` (`personNameSchema`) dan `phone` (`phoneSchema`) wajib; untuk PICKUP hanya nama + nomor HP yang dipakai ΓÇö `street`/`city`/`province`/`postalCode` opsional | "Nama wajib diisi", "Nomor HP wajib diisi", dsl. |
| destinationId, courierCode, service | - | Tidak untuk PICKUP | `superRefine` hanya mewajibkan field kurir/alamat lengkap bila `fulfillment === "DELIVERY"`; komentar eksak: "Pickup tidak butuh kurir maupun alamat lengkap (SHIP-03)" | - |

Di `POST /api/orders/create`: kewajiban `destinationId` ("Tujuan wajib dipilih") dilewati bila `isPickup`.

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Store Admin aktifkan pickup di `/admin/settings` | `PATCH /api/admin/settings` | `pickupEnabled = true`, `pickupInfo` tersimpan |
| 2 | Pembeli buka `/checkout` | Halaman membaca `getPickupSettings()` + brand | Radio "Ambil di toko" tampil dengan label "Ambil di {brandName}", alamat toko, telepon, info |
| 3 | Pembeli pilih "Ambil di toko" | `handleFulfillment("PICKUP")`: `setShipping(null)`, voucher ongkir divalidasi ulang dengan tarif 0 | Ongkir kosong; permintaan tarif kurir tidak dibuat |
| 4 | Pembeli kirim form | `POST /api/orders/create` dengan `fulfillment: "PICKUP"` | Validasi Zod lolos tanpa field kurir/tujuan |
| 5 | Server | `createOrder`: `isPickup` ΓåÆ `shippingCost = 0`, `courier`, `service`, `etd` tetap `null`; langkah `calculateShippingQuote` dan pencocokan opsi kurir di-skip | Ongkir nol (PRD 3.1.F) |
| 6 | Server | Reservasi stok, pesanan dibuat dengan `fulfillment = PICKUP`, voucher tetap boleh dipakai | `201`, pesanan status `WAITING_PAYMENT` |

### 6. Output dan perubahan data

- **Hasil:** Order dengan `fulfillment = PICKUP`, `shippingCost = 0`, `shippingCourier`/`shippingService`/`shippingEtd` = `null`, alamat hanya menyimpan nama + nomor HP.
- **Data dibaca:** keranjang, varian, store settings (`getPickupSettings`), brand (`getBrandSetting`).
- **Data dibuat:** Order + OrderItem seperti jalur DELIVERY.
- **Data diubah:** `ProductVariant.stock`/`Product.totalStock` turun (reservasi sama seperti jalur biasa); item keranjang terpilih dihapus.
- **Kondisi akhir:** total = subtotal ΓêÆ diskon voucher (tanpa ongkir).

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Pickup nonaktif (`pickupEnabled = false`) | Radio pickup tidak dirender di `CheckoutForm` | Pembeli hanya bisa DELIVERY |
| Voucher ongkir dipilih lalu beralih ke PICKUP | Voucher divalidasi ulang dengan `cost 0` (`validateVouchers(voucherCodes, 0)`) | Voucher ongkir tidak menimbulkan potongan tanpa tarif |
| Guest pickup tetap wajib OTP | `isPhoneVerified(guestPhone)` dicek di route | `403 PHONE_NOT_VERIFIED` bila belum |
| Pickup dipilih lalu kembali ke DELIVERY | `handleFulfillment("DELIVERY")` memulihkan validasi voucher dengan tarif tersimpan | Keadaan form kembali konsisten |

### 8. Kondisi gagal

| Kondisi | Kode HTTP / respons | Tindakan |
| --- | --- | --- |
| Body tidak valid | `400 VALIDATION_ERROR` ΓÇö pesan Zod per field | Perbaiki isian |
| Telah masuk tanpa sesi/akses keranjang | `403` ΓÇö `forbidden()` | Masuk sebagai customer/guest |
| Keranjang kosong | `400 CART_EMPTY` ΓÇö "Keranjang kosong" | Isi keranjang |
| Stok tidak cukup | `400 INSUFFICIENT_STOCK` ΓÇö "Stok {productName} tidak cukup" | Perbarui keranjang |
| Voucher ditolak | `400 INVALID_VOUCHER` ΓÇö alasan pertama dari server | Hapus/ganti voucher |
| Mode pemeliharaan | `503 MAINTENANCE` | Coba lagi nanti |

### 9. Perilaku UI

- **Halaman admin:** `/admin/settings` ΓÇö judul "Pengaturan Toko", deskripsi "Informasi toko, kebijakan, dan opsi ambil di toko."; `StoreSettingsForm` memuat checkbox `pickupEnabled` dan textarea `store-pickup-info` ("Informasi pickup", maks 1000 karakter).
- **Halaman pembeli:** `/checkout` ΓÇö `CheckoutForm` bagian radio (DELIVERY/PICKUP); kartu pickup menampilkan "Ambil di {pickup.brandName}", `pickup.storeAddress`, `pickup.storePhone`, `pickup.info`.
- **Halaman pesanan:** `/orders/[id]` ΓÇö judul bagian berganti menjadi "Ambil di Toko"; baris Alamat/Pengiriman/resi disembunyikan; resi tidak pernah diisi di jalur pickup. Detail admin `/admin/orders/[id]` menampilkan bagian sama.

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Pickup aktif + dipilih | Ongkos kirim Rp0 di ringkasan; kartu pengiriman tidak diminta | Isi nama + HP, kirim |
| Pickup aktif, belum dipilih | Tampilan DELIVERY normal | Pilih sesuai kebutuhan |
| Pickup nonaktif | Opsi tidak ada | - |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-SHIP-03-01 | Pickup aktif | Checkout, pilih "Ambil di toko", kirim | `201`, Order `fulfillment = PICKUP`, `shippingCost = 0` |
| AC-SHIP-03-02 | Pickup aktif | `POST /api/orders/create` tanpa `courierCode`/`destinationId` | Tidak ada validasi kurir/tujuan; pesanan dibuat |
| AC-SHIP-03-03 | Pickup nonaktif | Checkout | Opsi pickup tidak tampil |
| AC-SHIP-03-04 | Pesanan pickup dibuat | Customer buka `/orders/[id]` | Bagian "Ambil di Toko", tanpa baris alamat lengkap/kurir |
| AC-SHIP-03-05 | Pickup aktif dengan `pickupInfo` | Checkout | Info toko (alamat, telepon, info) tampil di kartu pickup |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Pickup valid | `{ "fulfillment": "PICKUP", "variantIds": ["<uuid>"], "address": { "name": "Budi Santoso", "phone": "08123456789" }, "voucherCodes": [] }` | `201`, order pickup tanpa ongkir | AC-SHIP-03-01/02 |
| Pengaturan pickup | `PATCH /api/admin/settings` `{ "pickupEnabled": true, "pickupInfo": "Jam penjemputan 09.00-17.00", ... }` | Tersimpan di `store_settings` | AC-SHIP-03-03/05 |

### 12. Batas fitur

- **Termasuk:** toggle pickup di pengaturan toko, opsi di checkout, ongkir 0 + tanpa kurir, alamat minimal nama + HP, tampilan detail pesanan sesuai fulfillment.
- **Tidak termasuk:** stok khusus "in-store", jadwal/konfirmasi waktu pengambilan, notifikasi "pesanan siap diambil" terpisah (email memakai jalur NOTIF-01 yang ada), penanda "ambil di toko" pada invoice.
- **KONFIGURASI:** label pickup memakai `brandName` (keputusan `storeName` dihapus ΓÇö `docs/04` bagian 10, catatan 2026-10-11); `storeName` di-drop dari `store_settings` (migrasi `20261011160000_drop_store_settings_store_name`).
- **Ketergantungan:** CONFIG-01 (aktor pengatur), MOD-ORDER (pembuatan pesanan), MOD-VOUCH (validasi ulang voucher), MOD-AUTH (sesi, OTP guest).

### 13. Pertanyaan terbuka

- Tidak ada.

**Rujukan kode:**

- `src/lib/orders/validation.ts` ΓÇö `FULFILLMENT_METHODS`, `orderCreateSchema` + `superRefine` field opsional untuk pickup.
- `src/lib/orders/mutations.ts` ΓÇö `createOrder`: `isPickup` ΓåÆ ongkir 0, kurir/tujuan skip.
- `src/app/api/orders/create/route.ts` ΓÇö lewati kewajiban `destinationId` untuk pickup; pesan galat per jalur.
- `src/components/checkout/CheckoutForm.tsx` ΓÇö `handleFulfillment`, kartu "Ambil di {brandName}".
- `src/app/(storefront)/checkout/page.tsx` ΓÇö membaca `getPickupSettings()` + brand untuk props pickup.
- `src/lib/config/queries.ts` / `validation.ts` / `mutations.ts` ΓÇö `pickupEnabled`, `pickupInfo`, validasi, upsert.
- `src/components/admin/StoreSettingsForm.tsx` ΓÇö UI toggle + informasi pickup.
- `src/app/(storefront)/orders/[id]/page.tsx`, `src/app/admin/orders/[id]/page.tsx` ΓÇö tampilan detail sesuai `fulfillment`.
- `prisma/schema.prisma` ΓÇö `FulfillmentMethod { DELIVERY, PICKUP }`, `Order.fulfillment`, `StoreSetting`.
- `docs/04_IMPLEMENTATION_PLAN.md` bagian 9.2 (keputusan pickup no. 9), 9.4 (V4/V6), 9.5 (butir 6) ΓÇö bukti `docs/04` bagian 9.

---

## <a name="order-05"></a>ORDER-05 ΓÇö Cancel Order Request

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-05 ΓÇö Cancel Order Request (pengajuan + peninjauan pembatalan pesanan) |
| Modul | MOD-ORDER |
| Tujuan | Pembeli (customer/guest) mengajukan pembatalan seluruh pesanan dengan alasan wajib; pesanan masuk status `CANCEL_REQUESTED` untuk ditinjau Store Admin: disetujui (stok kembali, refund dibuat bila sudah dibayar) atau ditolak (status kembali + alasan wajib) |
| Aktor utama | Customer (login), Guest (akses pesanan via cookie), Store Admin (tinjau) |
| Status | Terimplementasi (PH-06) |
| Referensi PRD | PRD 5.5 (revisi 1.6), 3.1.G, 2.3 |
| Referensi SDD | SDD 4.7, SDD 10 (A01/A03) |

### 2. Prasyarat dan pemicu

- **Titik masuk:** halaman `/orders/[id]` (customer/guest) ΓÇö kartu "Pembatalan" dirender hanya saat `order.status` adalah `WAITING_PAYMENT` atau `PROCESSING`
- Pesanan customer: sesi login `CUSTOMER`; guest: cookie `flexstore_guest_access` bertanda HMAC berisi nomor HP terverifikasi (TTL 24 jam)
- Pemicu: klik tombol "Ajukan Pembatalan" pada `CancelOrderForm`, lalu kirim form alasan
- Aksi tinjauan admin dipicu dari `/admin/orders/[id]` saat status `CANCEL_REQUESTED`

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Customer (login) | `POST /api/orders/[id]/cancel` | Sesi `auth()` | Bukan `CUSTOMER` ΓåÆ `403 FORBIDDEN`; bukan pemilik pesanan ΓåÆ `404 NOT_FOUND` |
| Guest (cookie akses) | `POST /api/orders/[id]/cancel` | `getGuestAccessPhone()` | `order.userId` tidak null, cookie tidak sah/kedaluwarsa, atau `guestPhone` tak sama ΓåÆ `404 NOT_FOUND` |
| Store Admin | `PATCH /api/admin/orders/[id]` (`APPROVE_CANCEL` / `REJECT_CANCEL`) | `requireStoreAdmin()` (guard) | Tanpa sesi/akun nonaktif ΓåÆ `401 UNAUTHORIZED`; role lain ΓåÆ `403 FORBIDDEN` |
| Site Admin | Tinjau pembatalan | - | Tidak ada jalur (guard hanya `STORE_ADMIN`) |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| id (path) | String UUID | Ya | `z.string().uuid()` | "ID tidak valid" (`400 INVALID_ID`) |
| reason | String | Ya | `orderCancelRequestSchema`: trim, min 3, max 300 | "Alasan pembatalan wajib diisi"; "Alasan pembatalan minimal 3 karakter"; "Alasan pembatalan maksimal 300 karakter" (`400 VALIDATION_ERROR`) |
| action (`APPROVE_CANCEL`) | Literal | Ya | Discriminated union `adminOrderActionSchema`, tanpa field lain | - |
| action (`REJECT_CANCEL`) + rejectionReason | String | Ya | trim, min 3, max 300 | "Alasan penolakan wajib diisi"; "Alasan penolakan minimal 3 karakter"; "Alasan penolakan maksimal 300 karakter" |

### 5. Alur berhasil (pengajuan + peninjauan)

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Pembeli buka `/orders/[id]`, klik "Ajukan Pembatalan" | Form textarea "Alasan pembatalan" tampil | Form aktif |
| 2 | Kirim form | `POST /api/orders/[id]/cancel` | `200 { ok: true }`; `updateMany` bersyarat `status in [WAITING_PAYMENT, PROCESSING]` ΓåÆ status `CANCEL_REQUESTED`, `cancelRequestedAt` terisi, `cancelReason` tersimpan, `cancelRejectionReason` dinolkan |
| 3 | Store Admin buka `/admin/orders/[id]` | Panel "Setujui Pembatalan" + form "Tolak Pembatalan" (template atau manual) tampil | Semua aksi via `PATCH /api/admin/orders/[id]` |
| 4 | Admin klik "Setujui Pembatalan" | `cancelRequestedOrderAndReleaseStock`: klaim `status = CANCEL_REQUESTED` ΓåÆ `CANCELED` + `canceledAt`, stok varian dikembalikan dan `totalStock` disinkronkan | Pesanan berstatus Dibatalkan; email pembatalan "approved" terkirim |
| 5 | Jika `payment.status === "PAID"` | Baris `Refund` dibuat jika belum ada: `amount = order.total`, `method = MANUAL`, `status = PENDING` | Refund muncul di kartu "Refund Menunggu Bukti" (jejak ORDER-06) |
| 6 | Admin tolak (`REJECT_CANCEL`) | Klaim `status = CANCEL_REQUESTED` ΓåÆ status kembali `PROCESSING` (sudah dibayar) atau `WAITING_PAYMENT` (belum); `cancelRejectionReason` tersimpan | Email pembatalan "rejected" terkirim berisi alasan |

### 6. Output dan perubahan data

- **Data dibaca:** Order (`total`, `payment.status`, `userId`, `guestPhone`)
- **Data diubah (pengajuan):** `Order.status = CANCEL_REQUESTED`, `cancelRequestedAt`, `cancelReason`, `cancelRejectionReason = null`
- **Data diubah (setuju):** `Order.status = CANCELED`, `canceledAt`; `ProductVariant.stock` (increment) dan `Product.totalStock` (dihitung ulang) dalam satu transaksi
- **Data dibuat (setuju):** baris `Refund` (`PENDING`) bila pesanan sudah dibayar
- **Data diubah (tolak):** `Order.status` kembali ke `PROCESSING`/`WAITING_PAYMENT`, `cancelRejectionReason` terisi
- **Email:** `sendCancellationEmail(orderId, "approved" | "rejected")` ΓÇö hormati preferensi `cancellationUpdate`

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Guest cookie kedaluwarsa saat mengisi alasan | `getGuestAccessPhone()` ΓåÆ `null` | `404 "Pesanan tidak ditemukan"` |
| Pesanan sudah diproses/dikirim dll. | `updateMany` klaim 0 baris | `409 INVALID_STATUS "Pesanan tidak bisa dibatalkan pada status ini"` |
| Admin menolak pada status bukan `CANCEL_REQUESTED` | Klaim 0 baris | `409 INVALID_STATUS "Tidak ada pengajuan pembatalan yang menunggu tinjauan"` |
| Baris refund sudah ada saat setujui | `findFirst` dulu, tidak membuat duplikat | Satu refund saja per pesanan |
| Template alasan kosong | UI menampilkan "Belum ada template alasan. Tambahkan di menu Template Alasan." | Admin beralih mode manual |

### 8. Kondisi gagal

| Kondisi | Kode HTTP | Tindakan |
| --- | --- | --- |
| UUID path tidak valid (`/cancel`) | `400 INVALID_ID "ID tidak valid"` | Perbaiki ID |
| Body tidak sesuai schema | `400 VALIDATION_ERROR` (pesan per-field bagian 4) | Perbaiki isian |
| Bukan pemilik / cookie tak sah / pesanan tidak ada | `404 NOT_FOUND "Pesanan tidak ditemukan"` | Status generik agar keberadaan pesanan tidak bocor |
| Bukan role `CUSTOMER` (Admin/Site Admin dengan sesi) | `403 FORBIDDEN "Anda tidak memiliki akses"` | Gunakan akun customer |
| Status tidak bisa dibatalkan | `409 INVALID_STATUS "Pesanan tidak bisa dibatalkan pada status ini"` (kode string exact dari kode; alias `ORDER_NOT_CANCELLABLE` tidak dipakai) | Refresh halaman, cek status |
| Penolakan tanpa `rejectionReason` / <3 karakter | `400 VALIDATION_ERROR` | Pilih template / isi manual |

### 9. Perilaku UI

- **Halaman:** `/orders/[id]` ΓÇö kartu "Pembatalan" (tombol "Ajukan Pembatalan" ΓåÆ form textarea, tombol "Kirim Pengajuan"/"Batal"); kartu "Pengajuan Pembatalan" saat `CANCEL_REQUESTED` (menampilkan `cancelReason`); kartu "Pembatalan Ditolak" saat `cancelRejectionReason` terisi
- **Halaman admin:** `/admin/orders/[id]` ΓÇö panel "Aksi" `AdminOrderActions` ketika status `CANCEL_REQUESTED`

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Form tertutup | Tombol "Ajukan Pembatalan" | Klik untuk membuka form |
| Mengirim | Tombol "Mengirim..." nonaktif | Tunggu |
| Sukses | `router.refresh()` | Kartu "Pengajuan Pembatalan" muncul |
| Galat | `FormErrorAlert` dengan pesan dari server | Perbaiki lalu kirim ulang |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ORDER-05-01 | Pesanan `WAITING_PAYMENT` milik customer | Ajukan pembatalan dengan alasan >3 karakter | Status `CANCEL_REQUESTED`, alasan tersimpan |
| AC-ORDER-05-02 | Pesanan sudah dibayar, `CANCEL_REQUESTED` | Admin setujui | Status `CANCELED`, stok varian + `totalStock` kembali, baris `Refund PENDING` nominal total terbentuk |
| AC-ORDER-05-03 | Pesanan `CANCEL_REQUESTED` belum dibayar | Admin tolak dengan alasan | Status kembali `WAITING_PAYMENT`, `cancelRejectionReason` tampil, email penolakan |
| AC-ORDER-05-04 | Pesanan `SHIPPED` | Ajukan pembatalan | `409 INVALID_STATUS`, form tidak tersedia |
| AC-ORDER-05-05 | Customer A login | Ajukan pembatalan pesanan milik customer B | `404 NOT_FOUND` |
| AC-ORDER-05-06 | Guest dengan cookie akses | Ajukan pembatalan pesanan `guestPhone` miliknya | Pengajuan berhasil tanpa login |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Pengajuan | `POST /api/orders/<uuid>/cancel` body `{ "reason": "salah pilih ukuran" }` | `200 { "ok": true }` | AC-ORDER-05-01 |
| Setujui | `PATCH /api/admin/orders/<uuid>` body `{ "action": "APPROVE_CANCEL" }` | Status Dibatalkan + refund PENDING | AC-ORDER-05-02 |
| Tolak manual | `PATCH /api/admin/orders/<uuid>` body `{ "action": "REJECT_CANCEL", "rejectionReason": "Stok sudah disiapkan" }` | Status kembali + alasan tersimpan | AC-ORDER-05-03 |

### 12. Batas fitur

- **Termasuk:** Pengajuan pembatalan seluruh pesanan (customer + guest), status `CANCEL_REQUESTED`, peninjauan setuju/tolak, pengembalian stok, baris refund otomatis saat sudah dibayar, email pembatalan, template + alasan manual penolakan
- **Tidak termasuk:** Pembatalan parsial per produk (PRD 5.5 butir 1), pembatalan otomatis oleh cron (pembebasan stok lazy), refund dana itu sendiri (ORDER-06)
- **Dependensi:** ORDER-07 (UI aksi admin), ORDER-06 (penyelesaian refund), MOD-AUTH (sesi/cookie akses guest), MOD-NOTIF (email + preferensi `cancellationUpdate`), CONFIG-01 (template alasan)

### 13. Pertanyaan terbuka

- Tidak ada.

**Rujukan kode:**

- `src/app/api/orders/[id]/cancel/route.ts` ΓÇö endpoint pengajuan pembeli, otorisasi customer/guest, kode error exact.
- `src/lib/orders/admin.ts` ΓÇö `requestOrderCancellation`, `approveCancellation`, `rejectCancellation`.
- `src/lib/orders/reservations.ts` ΓÇö `cancelRequestedOrderAndReleaseStock` (pindah status + restore stock idempoten).
- `src/lib/orders/admin-validation.ts` ΓÇö `orderCancelRequestSchema` dan aksi `APPROVE_CANCEL`/`REJECT_CANCEL`.
- `src/components/orders/CancelOrderForm.tsx` ΓÇö UI pengajuan di `/orders/[id]`.
- `src/app/(storefront)/orders/[id]/page.tsx` ΓÇö kartu Pembatalan / Pengajuan Pembatalan / Pembatalan Ditolak.
- `src/lib/notifications/order-emails.ts` ΓÇö `sendCancellationEmail` (approved/rejected).
- `src/lib/orders/guest-access.ts` ΓÇö cookie akses guest HMAC `flexstore_guest_access`.
- `docs/01_PRD.md` bagian 5.5 ΓÇö aturan pembatalan revisi 1.6.
- `docs/04_IMPLEMENTATION_PLAN.md` bagian 9.5 ΓÇö bukti PH-06 selesai dikerjakan.

---

## <a name="order-06"></a>ORDER-06 ΓÇö Refund Manual

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-06 ΓÇö Refund Manual |
| Modul | MOD-ORDER |
| Tujuan | Store Admin memproses refund manual (transfer luar gateway), wajib mengunggah bukti transfer, lalu menandai refund selesai; status refund terpisah dari status pesanan dan selalu traceable |
| Aktor utama | Store Admin |
| Status | Terimplementasi (PH-06) |
| Referensi PRD | PRD 5.6 (revisi 1.6 ΓÇö refund otomatis lewat gateway "belum diimplementasikan di MVP"; `Refund.method` disediakan di skema), 2.3, 3.1.G |
| Referensi SDD | SDD 4.7, 4.12, SDD 10 (A07/A08) |

### 2. Prasyarat dan pemicu

- **Titik masuk:** `/admin/orders/[id]`, kartu "Refund Menunggu Bukti" ΓÇö dirender untuk tiap refund berstatus `PENDING`
- Baris refund berasal dari ORDER-05 (setuju pembatalan untuk pesanan `payment.status === "PAID"`, nominal = `order.total`, `method MANUAL`, `status PENDING`); commit `0a2f57b` hanya menambah bukti uji unggah `refundProof` di `docs/03`/`docs/04`, bukan perubahan skema
- Pemicu: admin unggah gambar bukti ΓåÆ `useUploadThing("refundProof")` ΓåÆ klik "Tandai Refund Selesai"

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Store Admin | `PATCH /api/admin/orders/[id]` (`COMPLETE_REFUND`) | `requireStoreAdmin()` (role + `deactivatedAt` dicek ulang dari DB) | Tanpa sesi ΓåÆ `401 UNAUTHORIZED`; role lain ΓåÆ `403 FORBIDDEN` |
| Store Admin | Unggah bukti `POST /api/uploadthing` slug `refundProof` | Middleware `refundProof` | Tanpa sesi ΓåÆ `403 "Anda harus masuk terlebih dahulu"`; bukan `STORE_ADMIN` ΓåÆ `403 "Hanya Store Admin yang dapat mengunggah bukti"` |
| Customer/Guest | Refund sendiri | - | Tidak ada jalur; hanya melihat riwayat refund di `/orders/[id]` |
| Site Admin | Aksi refund | - | `403 FORBIDDEN` (guard hanya `STORE_ADMIN`) |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| action | Literal `COMPLETE_REFUND` | Ya | Discriminated union `adminOrderActionSchema` | - |
| refundId | String UUID | Ya | `z.string().uuid("Refund tidak valid")` | "Refund tidak valid" (`400 VALIDATION_ERROR`) |
| proofUrl | String URL | Ya (wajib bukti) | trim, `.url("Bukti refund tidak valid")`, max 500 | "Bukti refund wajib diunggah"; "Bukti refund tidak valid"; "URL bukti terlalu panjang" |
| note | String | Tidak | trim, max 500 | "Catatan tidak valid"; "Catatan maksimal 500 karakter" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Admin buka `/admin/orders/[id]` | Kartu "Refund Menunggu Bukti" list refund `PENDING` | Form "Bukti refund (gambar)" + "Catatan (opsional)" tampil |
| 2 | Admin pilih berkas gambar (`accept="image/*"`) | Presign + unggah ke Uploadthing (`refundProof`: gambar, maks 4 MB, 1 berkas) | `proofUrl` terisi dari `serverData.url`; status "Bukti terunggah." |
| 3 | Admin isi catatan (opsional) dan klik "Tandai Refund Selesai" | `PATCH /api/admin/orders/[id]` body `COMPLETE_REFUND` | `updateMany` bersyarat `id = refundId, status PENDING` ΓåÆ `status COMPLETED`, `proofUrl`, `note`, `processedAt = now()` |
| 4 | System | `sendRefundCompletedEmail(orderId)` ambil refund terbaru (`take 1`, orderBy `createdAt desc`) | Email refund berisi `orderNumber`, `amount`, `note`, hormati preferensi `refundUpdate` |
| 5 | Pembeli buka `/orders/[id]` | Kartu "Refund" per baris: "Selesai" (COMPLETED), "Gagal" (FAILED), "Menunggu Bukti" selainnya | Riwayat refund terlihat |

### 6. Output dan perubahan data

- **Data dibaca:** `Refund` (id, status, amount, orderId, `createdAt`)
- **Data diubah:** `Refund.status = COMPLETED`, `proofUrl` (URL Uploadthing), `note`, `processedAt`
- **Data dibuat:** tidak ada (baris `Refund` berasal dari ORDER-05); status pesanan TIDAK berubah (refund terpisah dari status order, PRD 5.6 butir 3)
- **Eksternal:** berkas bukti tersimpan di Uploadthing; aplikasi hanya menyimpan `proofUrl`
- **Email:** `buildRefundCompletedEmail` lewat `sendRefundCompletedEmail`

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Klik "Tandai Refund Selesai" tanpa unggah | Validasi klien di `RefundCompleteForm` | Error "Unggah bukti refund terlebih dahulu" |
| Unggahan gagal | `onUploadError` | Error "Gagal mengunggah bukti refund" |
| Refund sudah `COMPLETED`/`FAILED` atau tidak ada | `updateMany` klaim 0 baris | `409 INVALID_STATUS "Refund sudah diproses atau tidak ditemukan"` |
| `refundId` bukan UUID | Guard awal `isUuid` | `NOT_FOUND "Refund tidak ditemukan"` ΓåÆ HTTP 404 |
| 2 berkas dalam satu permintaan unggah | Ditolak Uploadthing (`FileCountMismatch`) | `400 "Invalid config: FileCountMismatch"` (bukti `docs/04` bagian 9.4 V7) |

### 8. Kondisi gagal

| Kondisi | Kode HTTP | Tindakan |
| --- | --- | --- |
| UUID path tidak valid | `400 INVALID_ID "ID tidak valid"` | Perbaiki ID |
| Body tidak sesuai schema | `400 VALIDATION_ERROR` (pesan bagian 4) | Perbaiki isian |
| Tanpa sesi / akun dinonaktifkan | `401 UNAUTHORIZED "Anda harus masuk terlebih dahulu"` | Login Store Admin |
| Bukan `STORE_ADMIN` | `403 FORBIDDEN "Anda tidak memiliki akses"` | Gunakan akun admin toko |
| Unggah bukti tanpa sesi | `403 "Anda harus masuk terlebih dahulu"` | Login dulu |
| `refundId` tidak ditemukan | `404 NOT_FOUND "Refund tidak ditemukan"` | Periksa refund |
| Refund sudah diproses | `409 INVALID_STATUS "Refund sudah diproses atau tidak ditemukan"` | Refresh detail pesanan |

### 9. Perilaku UI

- **Halaman admin:** `/admin/orders/[id]` ΓÇö kartu "Refund Menunggu Bukti" (form per refund), kartu "Refund" (riwayat semua refund dengan label Selesai/Gagal/Menunggu Bukti)
- **Halaman pembeli:** `/orders/[id]` ΓÇö kartu "Refund" (nominal + badge status; tidak menampilkan bukti/catatan)

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Sedang unggah | "Mengunggah..." | Tunggu |
| Bukti terunggah | "Bukti terunggah." | Isi catatan, tombol "Tandai Refund Selesai" aktif |
| Menyimpan | "Menyimpan..." | Tunggu |
| Sukses | `router.refresh()` | Badge refund menjadi "Selesai" |
| Galat | `FormErrorAlert` | Perbaiki lalu ulang |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ORDER-06-01 | Refund `PENDING` | Unggah gambar + tandai selesai | `status COMPLETED`, `proofUrl` + `processedAt` tersimpan, email terkirim |
| AC-ORDER-06-02 | Refund `PENDING` | Coba tandai selesai tanpa bukti | Ditahan di klien: "Unggah bukti refund terlebih dahulu"; server menolak `proofUrl` kosong dengan `400 VALIDATION_ERROR` |
| AC-ORDER-06-03 | Refund sudah `COMPLETED` | Tandai selesai lagi | `409 INVALID_STATUS "Refund sudah diproses atau tidak ditemukan"` |
| AC-ORDER-06-04 | Sesi Store Admin, unggah bukti nyata | `POST /api/uploadthing?slug=refundProof` | Presigned 200 ΓåÆ PUT berkas 200, URL `...ufs.sh/...` disajikan `200 image/png`; produksi tanpa sesi `403` (bukti `docs/04` bagian 9.4 V7) |
| AC-ORDER-06-05 | Pesanan dibatalkan, sudah dibayar | Pembeli buka `/orders/[id]` | Baris refund dengan nominal `total` terlihat pada kartu Refund |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Refund pending | `Refund { orderId, amount = order.total, method: MANUAL, status: PENDING }` | Kartu "Refund Menunggu Bukti" | AC-ORDER-06-01 |
| Bukti terunggah | `https://jqvuhozget.ufs.sh/f/rhko4DgxpLVA2twAjKstE8H5qmXwlReAhBrPc9KanNgku1Df` | `proofUrl` tersimpan, disajikan `image/png` | AC-ORDER-06-04 |
| Body API | `{ "action": "COMPLETE_REFUND", "refundId": "<uuid>", "proofUrl": "<ufs url>", "note": "Transfer BCA #123" }` | `200 { "ok": true }` | AC-ORDER-06-01 |

### 12. Batas fitur

- **Termasuk:** Refund manual satu nominal penuh per pesanan, wajib bukti unggahan (Uploadthing `refundProof`), status refund PENDING/COMPLETED/FAILED terpisah dari status pesanan, email refund selesai
- **Tidak termasuk:** Refund otomatis lewat gateway (PRD 5.6 butir 1 ΓÇö jalurnya hanya enumerasi `RefundMethod AUTOMATIC` di skema; belum diimplementasikan di MVP), penandaan refund FAILED lewat UI, refund parsial
- **Dependensi:** ORDER-05 (sumber pembuatan baris refund), ORDER-07 (UI detail admin), Uploadthing + sesi, MOD-NOTIF (email refund + preferensi `refundUpdate`)

### 13. Pertanyaan terbuka

- Tidak ada.

**Rujukan kode:**

- `src/lib/orders/admin.ts` ΓÇö `completeRefund` (klaim bersyarat + email).
- `src/lib/orders/admin-validation.ts` ΓÇö discriminated union aksi `COMPLETE_REFUND` dan aturan `proofUrl`.
- `src/app/api/admin/orders/[id]/route.ts` ΓÇö endpoint PATCH, pemetaan `NOT_FOUND`ΓåÆ404 / lainnyaΓåÆ409.
- `src/components/admin/AdminOrderActions.tsx` ΓÇö `RefundCompleteForm`, unggah via `useUploadThing("refundProof")`.
- `src/lib/uploadthing/core.ts` ΓÇö middleware `refundProof` (STORE_ADMIN, 4 MB, 1 gambar).
- `prisma/schema.prisma` ΓÇö model `Refund`, enum `RefundMethod`/`RefundStatus`.
- `src/lib/notifications/order-emails.ts` ΓÇö `sendRefundCompletedEmail`.
- `src/app/(storefront)/orders/[id]/page.tsx` ΓÇö kartu Refund sisi pembeli.
- `docs/04_IMPLEMENTATION_PLAN.md` bagian 9.4 V7 ΓÇö bukti uji unggah nyata; commit `0a2f57b` menambah bukti itu ke dokumen.

---

## <a name="order-07"></a>ORDER-07 ΓÇö Admin Order Management

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-07 ΓÇö Admin Order Management |
| Modul | MOD-ORDER |
| Tujuan | Store Admin mencari, memfilter, dan mengelola pesanan: mengubah status `PROCESSING ΓåÆ SHIPPED` dengan nomor resi, `SHIPPED ΓåÆ COMPLETED`, serta meninjau pembatalan (ORDER-05) dan refund (ORDER-06) dari satu daftar + satu detail |
| Aktor utama | Store Admin |
| Status | Terimplementasi (PH-06) |
| Referensi PRD | PRD 2.3, 3.1.K, 4.4; audit `docs/04` bagian 10 (2026-10-10, ORDER-07 ID baru dari audit 13-kebutuhan) |
| Referensi SDD | SDD 5 (struktur rute admin), SDD 10 (A01/A03) |

### 2. Prasyarat dan pemicu

- **Titik masuk:** menu admin ΓåÆ `/admin/orders` (daftar), klik "Detail" ΓåÆ `/admin/orders/[id]`
- Semua aksi per pesanan lewat satu endpoint `PATCH /api/admin/orders/[id]` dengan discriminated union `action`
- Pemicu transisi: `PROCESSING` ΓåÆ form "Nomor resi" ΓåÆ "Tandai Dikirim"; `SHIPPED` ΓåÆ tombol "Tandai Selesai"; `CANCEL_REQUESTED` ΓåÆ panel pembatalan; refund `PENDING` ΓåÆ form bukti
- Halaman admin menandai `instant = false` (blocking route Next.js 16 cacheComponents)

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Store Admin | Lihat `/admin/orders`, `/admin/orders/[id]`; aksi `SHIP`, `COMPLETE`, `APPROVE_CANCEL`, `REJECT_CANCEL`, `COMPLETE_REFUND` | Guard `requireStoreAdmin()` (role + status aktif dari DB, bukan hanya JWT) | Tanpa sesi ΓåÆ `401 UNAUTHORIZED`; akun dinonaktifkan ΓåÆ `401 UNAUTHORIZED`; role lain (termasuk Site Admin, Customer) ΓåÆ `403 FORBIDDEN` |
| Site Admin | Kelola pesanan | - | `403 FORBIDDEN` (guard hanya `STORE_ADMIN`) |
| Customer | Semua aksi admin | - | `403 FORBIDDEN` |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| status (query daftar) | Enum | Tidak | `ORDER_STATUS_FILTERS = [WAITING_PAYMENT, PROCESSING, SHIPPED, COMPLETED, CANCEL_REQUESTED, CANCELED]` | Query invalid ΓåÆ fallback `{ page: 1, limit: 20 }` (tanpa filter) |
| search (query daftar) | String | Tidak | trim, maks 100 | Fallback tanpa filter |
| page, limit (query daftar) | Number | Tidak | `z.coerce.number().int().min(1)`; limit maks 100, default 20 (halaman membekukan `PAGE_SIZE = 20`) | Fallback |
| id (path) | UUID | Ya | `z.string().uuid()` | `400 INVALID_ID "ID tidak valid"` |
| action `SHIP` + trackingNumber | String | Ya (untuk SHIP) | trim, min 3, maks 50, regex `^[A-Za-z0-9-]+$` | "Nomor resi wajib diisi"; "Nomor resi minimal 3 karakter"; "Nomor resi maksimal 50 karakter"; "Nomor resi hanya boleh huruf, angka, dan minus" |
| action `COMPLETE` | Literal | Ya | Tanpa field tambahan | - |
| (aksi lain) | - | - | `APPROVE_CANCEL` / `REJECT_CANCEL` / `COMPLETE_REFUND` (rincian ORDER-05/06) | - |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Admin buka `/admin/orders` | `listAdminOrders`: filter status, pencarian `OR` (orderNumber, guestPhone, user.email, user.name), urut `createdAt desc`, paginasi | Tabel kolom Nomor, Tanggal, Pembeli, Total, Status, Pembayaran, Aksi |
| 2 | Klik chip status / isi pencarian + "Terapkan" | Navigasi `?status=...&search=...` | Daftar terfilter dengan bar "Semua" + 6 status |
| 3 | Klik "Detail" | `/admin/orders/[id]` ΓåÆ `getAdminOrderDetail` (include items, payment, refunds, user) + `listCancellationReasons({ activeOnly: true })`; UUID invalid ΓåÆ `notFound()` | Detail: Item, Alamat/Ambil di Toko, Pengiriman (jika ada resi), Pembatalan (alasan/alasan penolakan), Pembeli, Pembayaran, Refund, panel Aksi |
| 4 | Status `PROCESSING`: isi nomor resi, klik "Tandai Dikirim" | `PATCH` `SHIP` ΓåÆ `markOrderShipped` klaim `updateMany { id, status: PROCESSING }` ΓåÆ `SHIPPED`, `trackingNumber`, `shippedAt` | Email "Pesanan Dikirim" (`buildOrderShippedEmail` berisi resi, kurir, layanan, tautan pelacakan) |
| 5 | Status `SHIPPED`: klik "Tandai Selesai" | `PATCH` `COMPLETE` ΓåÆ `markOrderCompleted` klaim `SHIPPED` ΓåÆ `COMPLETED`, `completedAt` | Badge status "Selesai" |
| 6 | Klik paginasi "Sebelumnya"/"Selanjutnya" | `?page=n` | Penanda "X pesanan - halaman n dari y" |

### 6. Output dan perubahan data

- **Data dibaca:** Order + OrderItem + Payment + Refund + User; template alasan penolakan (CONFIG-01)
- **Data diubah oleh SHIP:** `Order.status = SHIPPED`, `trackingNumber`, `shippedAt`
- **Data diubah oleh COMPLETE:** `Order.status = COMPLETED`, `completedAt`
- **Kondisi akhir:** setiap transisi klaim via `updateMany` bersyarat status lama; dua permintaan berbarengan menghasilkan satu transisi saja
- **Tidak ada perubahan data** oleh browse/filter daftar (read-only)
- **Email:** kirim saat SHIP (preferensi `shippingUpdate`), APPROVE/REJECT (`cancellationUpdate`), COMPLETE_REFUND (`refundUpdate`)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Tidak ada pesanan yang cocok | Panel "Belum ada pesanan yang cocok." | Daftar kosong, tetapi tetap bisa memfilter ulang |
| `SHIP` pesanan bukan `PROCESSING` | Klaim 0 baris | `409 INVALID_STATUS "Hanya pesanan berstatus Diproses yang bisa dikirim"` |
| `COMPLETE` pesanan bukan `SHIPPED` | Klaim 0 baris | `409 INVALID_STATUS "Hanya pesanan berstatus Dikirim yang bisa diselesaikan"` |
| UUID path invalid di halaman detail | `notFound()` | Halaman 404 tanpa query DB |
| Reservasi `WAITING_PAYMENT` kedeluwarsa | `getAdminOrderDetail` memanggil `releaseExpiredReservations()` (lazy) | Pembebasan dibatasi `RELEASE_BATCH = 20` per panggilan |

### 8. Kondisi gagal

| Kondisi | Kode HTTP | Tindakan |
| --- | --- | --- |
| Tanpa sesi / akun dinonaktifkan | `401 UNAUTHORIZED "Anda harus masuk terlebih dahulu"` | Login Store Admin |
| Bukan `STORE_ADMIN` | `403 FORBIDDEN "Anda tidak memiliki akses"` | Gunakan akun admin toko |
| UUID path tidak valid | `400 INVALID_ID "ID tidak valid"` | Perbaiki ID |
| Body tidak sesuai schema | `400 VALIDATION_ERROR` (pesan per-field bagian 4) | Perbaiki isian |
| Transisi status salah | `409 INVALID_STATUS` (pesan exact per aksi, bagian 7) | Refresh detail, cek status |
| Pesanan tidak ditemukan | `404 NOT_FOUND "Pesanan tidak ditemukan"` | Kembali ke `/admin/orders` |

### 9. Perilaku UI

- **Halaman:** `/admin/orders` (daftar, `PageHeader` "Pesanan" dengan deskripsi "Kelola status pesanan, pengiriman, pembatalan, dan refund."), `/admin/orders/[id]` (detail + panel "Aksi" `AdminOrderActions`)

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| `status PROCESSING` | Form "Nomor resi" + tombol "Tandai Dikirim" | Isi resi, kirim |
| `status SHIPPED` | Tombol "Tandai Selesai" | Selesaikan pesanan |
| Sedang aksi | "Memproses..." tombol nonaktif | Tunggu |
| Sukses | `router.refresh()` | Status + kartu diperbarui |
| Galat | `FormErrorAlert` | Perbaiki lalu ulang |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ORDER-07-01 | Pesanan berbayar `PROCESSING` | `PATCH SHIP` + resi valid | Status `SHIPPED`, `trackingNumber`+`shippedAt` tersimpan, email terkirim |
| AC-ORDER-07-02 | Pesanan `SHIPPED` | `PATCH COMPLETE` | Status `COMPLETED`, `completedAt` terisi |
| AC-ORDER-07-03 | Pesanan `PROCESSING` | `COMPLETE` langsung | `409 INVALID_STATUS` "Hanya pesanan berstatus Diproses yang bisa dikirim" |
| AC-ORDER-07-04 | Customer/Site Admin login | `PATCH /api/admin/orders/[id]` | `403 FORBIDDEN` |
| AC-ORDER-07-05 | Pesanan dengan nomor/nama/email/HP tertentu | `GET /admin/orders?search=...` | Pesanan keluar di daftar |
| AC-ORDER-07-06 | Resi berisi spasi/simbol | `PATCH SHIP` | `400 VALIDATION_ERROR "Nomor resi hanya boleh huruf, angka, dan minus"` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Filter status | `GET /admin/orders?status=CANCEL_REQUESTED` | Chip aktif "Pengajuan Pembatalan", daftar sesuai | AC-ORDER-07-05 |
| Aksi kirim | `PATCH /api/admin/orders/<uuid>` body `{ "action": "SHIP", "trackingNumber": "JNE-12345678" }` | `200 { "ok": true }` | AC-ORDER-07-01 |
| Pencarian | `GET /admin/orders?search=FS-2026` | Pesanan nomor itu muncul | AC-ORDER-07-05 |

### 12. Batas fitur

- **Termasuk:** Daftar + filter + pencarian + paginasi pesanan, detail penuh pesanan, transisi `PROCESSING ΓåÆ SHIPPED` (dengan resi) dan `SHIPPED ΓåÆ COMPLETED`, panel tinjau pembatalan + refund (ORDER-05/ORDER-06), email shipped, status pembayaran read-only di detail
- **Tidak termasuk:** Edit isi pesanan/item, ubah alamat pengiriman, ubah status pembayaran manual, pembuatan refund baru manual (refund lahir dari ORDER-05), export CSV; agregat status `countOrdersByStatus` dipakai di dashboard `/admin` (`src/app/admin/page.tsx`), bukan di daftar `/admin/orders` (terverifikasi dari kode)
- **Dependensi:** ORDER-05 (tinjau pembatalan), ORDER-06 (penyelesaian refund), CONFIG-01 (template alasan), SHIP-02 (data resi), MOD-AUTH guard, webhook Xendit (sumber transisi pembayaran `PAID`/`EXPIRED`)

### 13. Pertanyaan terbuka

- Dashboard agregasi `countOrdersByStatus` (`src/lib/orders/admin.ts`) dikonsumsi di dashboard `/admin` (`src/app/admin/page.tsx`, terverifikasi), bukan di halaman daftar `/admin/orders` ΓÇö bukan bloker, hanya catatan konsistensi.

**Rujukan kode:**

- `src/app/admin/orders/page.tsx` ΓÇö daftar, filter bar status, form pencarian, paginasi.
- `src/app/admin/orders/[id]/page.tsx` ΓÇö detail + panel Aksi + label PAYMENT/REFUND.
- `src/components/admin/AdminOrderActions.tsx` ΓÇö UI aksi SHIP/COMPLETE.
- `src/app/api/admin/orders/[id]/route.ts` ΓÇö endpoint PATCH discriminated union.
- `src/lib/orders/admin.ts` ΓÇö `listAdminOrders`, `getAdminOrderDetail`, `markOrderShipped`, `markOrderCompleted`.
- `src/lib/orders/admin-validation.ts` ΓÇö skema list + union + `trackingNumberSchema`.
- `src/lib/auth/guard.ts` ΓÇö `requireStoreAdmin` resolusi role dari DB.
- `docs/04_IMPLEMENTATION_PLAN.md` bagian 9.1/10 ΓÇö keputusan ORDER-07 dari audit 2026-10-10.

---

## <a name="order-08"></a>ORDER-08 ΓÇö Tracking Pesanan Customer

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-08 ΓÇö Tracking Pesanan Customer |
| Modul | MOD-ORDER |
| Tujuan | Customer login melacak pesanan tanpa input data: `/track-order` menampilkan daftar seluruh pesanan dalam perjalanan (`PROCESSING`/`SHIPPED`), dan detail tracking per pesanan session-scoped di `/orders/[id]/tracking` dari tombol Lacak. Guest tetap memakai jalur ORDER-04 |
| Aktor utama | Customer (login); Store Admin sebagai sumber data resi (via ORDER-07) |
| Status | Terimplementasi (PH-06) |
| Referensi PRD | PRD 2.2 ("Track shipping status", "Tracking order tanpa input data"), 3.1.H; `docs/04` bagian 10 keputusan ORDER-08 (2026-10-10) |
| Referensi SDD | SDD 5 (rute session-scoped), SDD 10 (A01) |

### 2. Prasyarat dan pemicu

- **Titik masuk:** navbar link "Lacak", `/orders` (kartu "Pelacakan" dengan tombol "Lihat Pelacakan" di `/orders/[id]`), atau langsung `/track-order`
- Customer harus punya sesi (`getShopperUser()`); tanpa sesi ΓåÆ jalur guest ORDER-04 (form nomor pesanan + nomor HP, `POST /api/orders/track`, rate limit Redis 10 percobaan / 10 menit per IP)
- Detail tracking hanya untuk order milik user itu (`findFirst { id, userId }`); bukan UUID atau bukan miliknya ΓåÆ `null` ΓåÆ `notFound()` 404 generik

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Customer (login) | Buka `/track-order` ΓÇö daftar in-transit via `getInTransitOrdersForUser` | Query `findMany { userId, status in [PROCESSING, SHIPPED] }` | Tanpa sesi ΓåÆ daftar tidak dirender, jalur guest tampil |
| Customer (login) | Buka `/orders/[id]/tracking` ΓÇö `getTrackingOrderForUser` | Query `findFirst { id, userId }` | Bukan pemilik / UUID invalid / tanpa sesi ΓåÆ `404` generik (keberadaan pesanan tidak bocor) |
| Guest | Buka `/track-order` | Form `TrackOrderForm` (ORDER-04) | Melebihi 10 percobaan/10 menit per IP: `429 RATE_LIMITED "Terlalu banyak percobaan, coba lagi nanti"` |
| Store Admin | Sesi admin tidak memakai halaman ini | - | Guard admin dijalankan di endpoint ORDER-07 |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| id (path `/orders/[id]/tracking`) | UUID | Ya | `isUuid` di lib; hasil null ΓåÆ 404; tidak ada skema body | 404 generik (`notFound()`) |
| (customer) | - | Tidak | **Tanpa input data** ΓÇö kepemilikan dari sesi (keputusan `docs/04` bagian 10) | - |
| orderNumber, phone (hanya jalur guest ORDER-04) | String | Ya | `trackOrderSchema`: orderNumber trim + `toUpperCase()` + regex `ORDER_NUMBER_PATTERN`; phone dari `phoneSchema` | "Nomor pesanan wajib diisi"; "Nomor pesanan tidak valid"; pesan phone dari `phoneSchema` (`400 VALIDATION_ERROR`) |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Customer buka `/track-order` | SSR: `getShopperUser()` ΓåÆ `getInTransitOrdersForUser(user.id)` (menjalankan `releaseExpiredReservations` dulu) | Section "Pesanan Dalam Perjalanan": nomor pesanan + tanggal (`formatDateTime`), `OrderStatusBadge`, tombol "Lacak" per baris ΓåÆ `/orders/[id]/tracking` |
| 2 | Klik "Lacak" | `/orders/[id]/tracking` | `getTrackingOrderForUser(user.id, id)` include `items` + `payment` |
| 3 | Halaman render kop | `orderNumber`, `formatDateTime(createdAt)`, `OrderStatusBadge` | Identitas pesanan |
| 4 | Block "Riwayat Perjalanan" | Milestone dari timestamp nyata: "Pesanan dibuat" (`createdAt`), "Pembayaran diterima" (`Payment.paidAt`), "Dikirim" (`shippedAt`), "Selesai" (`completedAt`) | Timeline tanpa tabel riwayat status |
| 5 | Block "Pengiriman" | Kurir (`shippingCourier - shippingService`), "Nomor resi" (`trackingNumber` atau "-"), Estimasi (`shippingEtd`), Tujuan (alamat JSON dirangkai) | Info pengiriman lengkap |
| 6 | Buka `/orders/[id]` | Kartu "Pelacakan" menampilkan `Resi <kurir> <layanan>: <resi>` atau teks "Riwayat status pesanan sejak dibuat hingga selesai." | Jejak menuju halaman tracking |

### 6. Output dan perubahan data

- **Hasil:** informasi status + riwayat pesanan; TIDAK ada mutasi data
- **Data dibaca:** Order milik user (`items`, `payment`, `shippedAt`, `completedAt`, `trackingNumber`, `shippingCourier/Service/Etd`, `shippingAddress`); daftar in-transit dengan `items.variant.product.images` (1 gambar, `sortOrder asc`)
- **Data dibuat/diubah:** tidak ada; efek samping baca: `releaseExpiredReservations()`
- **Reaktivitas:** halaman status dinamis ΓåÆ `await connection()` + `instant = false`
- **Data sensitif tidak dikembalikan:** jalur guest (`POST /api/orders/track`) memetakan field terpilih saja ΓÇö `userId`/`guestEmail` tidak ikut

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Customer tanpa pesanan in-transit | "Tidak ada pesanan yang sedang diproses atau dikirim." | Form guest tetap disembunyikan |
| Status `PROCESSING` belum dikirim | Timeline hanya s.d. "Pembayaran diterima"; Nomor resi "-" | Pesanan tetap terlacak |
| Guest tanpa sesi | Form `TrackOrderForm` ORDER-04 tampil | Alur publik tidak berubah (keputusan eksplisit `docs/04` bagian 10) |
| Buka `/orders/[id]/tracking` tanpa login | `getShopperUser()` ΓåÆ null | `notFound()` |
| IP tidak terbaca (dev tanpa proxy) / Redis gagal | `allowTrackAttempt` return true (degrade gracefully) | Fitur tetap jalan |

### 8. Kondisi gagal

| Kondisi | Kode HTTP | Tindakan |
| --- | --- | --- |
| Bukan UUID di path tracking | 404 (`notFound()`, tanpa kode API) | Periksa link |
| Pesanan milik customer lain | 404 generik | - |
| Body guest tidak sesuai `trackOrderSchema` | `400 VALIDATION_ERROR` | Perbaiki isian |
| Kombinasi nomor pesanan + HP salah / pesanan tidak ada | `404 NOT_FOUND "Pesanan tidak ditemukan"` (nomor salah dan tidak ada tidak dibedakan, AC-ORDER-04-02) | ulangi |
| Percobaan melebihi 10/10 menit per IP | `429 RATE_LIMITED "Terlalu banyak percobaan, coba lagi nanti"` | Tunggu |

### 9. Perilaku UI

- **Halaman:** `/track-order` (dual mode), `/orders/[id]/tracking` (detail session-scoped)

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Customer + ada in-transit | List baris pesanan + tombol "Lacak" | Klik menuju `/orders/[id]/tracking` |
| Customer + kosong | "Tidak ada pesanan yang sedang diproses atau dikirim." | - |
| Buka `/orders/[id]/tracking` tanpa login | `notFound()` | - |
| Sedang aksi | "Memproses..." tombol nonaktif | Tunggu |
| Galat | `FormErrorAlert` | Perbaiki lalu ulang |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ORDER-08-01 | Customer login, pesanan `PROCESSING`/`SHIPPED` | Buka `/track-order` | Daftar in-transit + tombol "Lacak" muncul tanpa form input |
| AC-ORDER-08-02 | Customer login, pesanannya `SHIPPED` dengan resi | Buka `/orders/[id]/tracking` | Timeline Dikirim + Nomor resi + kurir tampil |
| AC-ORDER-08-03 | Customer A login | Buka tracking pesanan customer B | 404 generik |
| AC-ORDER-08-04 | Order guest, no sesi | Buka `/track-order` | Form ORDER-04 tampil, daftar in-transit tidak |
| AC-ORDER-08-05 | Guest | `POST /api/orders/track` kombinasi nomor+HP | Klien guest masih dapat data terpilih + rate limit |
| AC-ORDER-08-06 | Customer login, pesanan sudah menempuh beberapa milestone | Buka tracking | Timeline milestone tampil, tanpa tabel riwayat status |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Daftar in-transit | Customer login, 1 pesanan `PROCESSING`, 1 `SHIPPED` | 2 baris di `/track-order` | AC-ORDER-08-01 |
| Detail | `/orders/<uuid>/tracking`, `trackingNumber: "JNE-12345678"` | Timeline + "Nomor resi" terisi | AC-ORDER-08-02 |
| Milestone | `createdAt` + `Payment.paidAt` + `shippedAt` | 3 entry timeline dengan waktu | AC-ORDER-08-02 |

### 12. Batas fitur

- **TERMASUK:** Daftar in-transit customer (`getInTransitOrdersForUser`), detail tracking session-scoped (`getTrackingOrderForUser`, `/orders/[id]/tracking`), timeline milestone berbasis timestamp nyata, tombol Lacak di navbar + `/orders` + `/track-order`, email shipped membawa tautan jalur sesuai tipe pembeli (`trackingUrlFor`)
- **TIDAK TERMASUK:** Trace perjalanan paket via API kurir / webhook kurir (hanya data resi yang diinput admin), riwayat status dari tabel khusus, tracking publik tanpa bukti kepemilikan, notifikasi push saat status berganti (lihat jalur email NOTIF-01)
- **DEPENDENSI:** ORDER-07 (sumber `trackingNumber`/`shippedAt`), ORDER-03 (tautan di `/orders/[id]`), ORDER-04 (jalur guest yang tetap), MOD-AUTH (sesi), Redis (rate limit, hanya jalur guest)

### 13. Pertanyaan terbuka

- Integrasi real-time tracking kurir (RajaOngkir/Biteship dipakai hanya untuk ongkir, bukan tracking webhook) ΓÇö TIDAK TERMASUK di MVP dan belum ada fase penggantinya.

**Rujukan kode:**

- `src/app/(storefront)/track-order/page.tsx` ΓÇö dual mode guest form / customer daftar in-transit.
- `src/app/(storefront)/orders/[id]/tracking/page.tsx` ΓÇö detail session-scoped + `getMilestones`.
- `src/lib/orders/admin.ts` ΓÇö `getInTransitOrdersForUser`, `getTrackingOrderForUser`.
- `src/app/api/orders/track/route.ts` ΓÇö jalur publik ORDER-04 + pemetaan field terpilih.
- `src/lib/orders/validation.ts` ΓÇö `trackOrderSchema`.
- `src/lib/orders/rate-limit.ts` ΓÇö `allowTrackAttempt` (10/10 menit per IP).
- `src/app/(storefront)/orders/[id]/page.tsx` ΓÇö kartu "Pelacakan" + kartu resi.
- `src/lib/notifications/order-emails.ts` ΓÇö `trackingUrlFor` (link email split customer/guest).
- `docs/04_IMPLEMENTATION_PLAN.md` bagian 10 (baris ORDER-08) ΓÇö keputusan dual mode + session-scoped; bagian 9.4/9.5 ΓÇö bukti PH-06.

---

## <a name="report-01"></a>REPORT-01 ΓÇö Sales Report (5 Laporan PRD 4.11)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | REPORT-01 ΓÇö Sales Report (lima laporan PRD 4.11) |
| Modul | MOD-REPORT |
| Tujuan | Menyajikan 5 laporan PRD 4.11 di `/admin/reports`: Laporan Penjualan, Kinerja Produk, Laporan Stok, Laporan Pesanan, Laporan Refund ΓÇö dengan filter rentang tanggal |
| Aktor utama | Store Admin |
| Status | Terimplementasi (PH-06) |
| Referensi PRD | 4.11 (sales report, product performance, stock report, order report, refund report) |
| Referensi SDD | 4.7 (report), 5 (rute `/admin/reports`) |

### 2. Prasyarat dan pemicu

- Admin masuk; pemicu: membuka `/admin/reports` atau mengirim form filter tanggal (GET `?from=&to=`).
- Data sumber: Order + Payment (`PAID`), OrderItem, Product, Refund.

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Store Admin | Lihat 5 laporan + filter rentang | Sesi admin (server component) | Tanpa sesi: redirect login |
| Customer / Guest | Lihat laporan | - | Tidak ada jalur |

### 4. Input dan validasi

Filter di `/admin/reports` dari `searchParams`, diparse `parseDate` (tanpa schema Zod ΓÇö nilai tidak valid diabaikan):

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| from | String `yyyy-MM-dd` (query) | Tidak | Diparse `new Date(`${value}T00:00:00.000Z`)`; `NaN` ΓåÆ `undefined` | Tidak ada pesan; default dipakai |
| to | String `yyyy-MM-dd` (query) | Tidak | Diparse dengan akhir hari `T23:59:59.999Z`; `NaN` ΓåÆ `undefined` | Tidak ada pesan |
| (bawaan) | - | - | `resolveReportRange`: tanpa `from`/`to` ΓåÆ `to = now`, `from = to ΓêÆ 30 hari` | - |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Admin buka `/admin/reports` | `getReportBundle({ from, to })` ΓÇö `Promise.all` 5 query | 5 bagian dirender |
| 2 | Laporan Penjualan | `getSalesReport`: Order `createdAt` dalam rentang, `status != CANCELED`, `payment.status = PAID` | Kartu ringkas: Transaksi, Subtotal, Ongkir, Diskon, Total |
| 3 | Kinerja Produk | `getProductPerformanceReport`: OrderItem dari order layar sama, agregasi per `productName::variantName` | Tabel Produk/Varian/Terjual/Pendapatan, urut kuantitas desc, maks 50 baris |
| 4 | Laporan Stok | `getStockReport`: semua produk, `orderBy totalStock asc`, `lowStock = totalStock <= LOW_STOCK_THRESHOLD (5)` | Tabel + Badge "Stok menipis"/"Aman"; jumlah menipis di badge header |
| 5 | Laporan Pesanan | `getOrderReport`: `prisma.order.groupBy({ by: ["status"] })` dalam rentang | Tabel status (`OrderStatusBadge`) + jumlah |
| 6 | Laporan Refund | `getRefundReport`: `Refund` dalam rentang, agregasi per status | Tabel Status/Jumlah/Nilai; label `PENDING`="Menunggu Bukti", `COMPLETED`="Selesai", `FAILED`="Gagal" |
| 7 | Admin ubah rentang | Submit form (`action="/admin/reports"`, tombol "Terapkan") | Halaman dirender ulang dengan rentang baru |

### 6. Output dan perubahan data

- **Hasil:** tampilan laporan; tidak ada tulis ke database.
- **Data dibaca:** Order, OrderItem, Product (+ `variants.stock`), Refund ΓÇö agregasi di JavaScript atas baris hasil Prisma (tanpa raw SQL, komentar eksak "cukup untuk skala MVP"); rentang eksak dikembalikan dalam `report.range`.
- **Data dibuat/diubah:** tidak ada.
- **Catatan skala:** tanpa paginasi halaman ΓÇö tabel produk/stok dibatasi `.slice(0, 50)` di UI; laporan penjualan/pesanan/refund digabung seluruhnya.

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Belum ada produk terjual | Teks "Belum ada produk terjual pada rentang ini." | Bagian kosong informatif |
| Belum ada pesanan / refund | Teks "Belum ada pesanan pada rentang ini." / "Belum ada refund pada rentang ini." | Bagian kosong |
| Tanggal tidak valid / kosong | `parseDate` mengabaikan | Rentang default (30 hari terakhir) dipakai |
| Stok menipis ada | Badge `variant="destructive"` "{n} menipis" di samping judul bagian 3 | Penanda cepat |

### 8. Kondisi gagal

| Kondisi | Kode HTTP | Tindakan |
| --- | --- | --- |
| Error Prisma/koneksi | 500 generik (halaman server component `instant = false`) | Muat ulang setelah database sehat |
| Tanpa sesi admin | Redirect ke login (guard admin) | Masuk sebagai admin |
| Nilai `from`/`to` rusak | Tidak ada kode HTTP (diam diabaikan) | Rentang default dipakai |

### 9. Perilaku UI

- **Halaman:** `/admin/reports` ΓÇö `PageHeader` judul "Laporan", deskripsi "Penjualan, kinerja produk, stok, pesanan, dan refund." (`export const instant = false`).
- **Komponen:** `PageHeader`, `Input` (`report-from`, `report-to`, `type="date"`), `Table` (shadcn), `Badge`, `OrderStatusBadge`, `formatRupiah`, `Intl.DateTimeFormat("id-ID", { dateStyle: "medium" })`.

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Pertama kali | Rentang default 30 hari, 5 bagian bila data ada | Baca |
| Mengubah rentang | Tombol "Terapkan" mengirim GET | Render ulang |
| Bagian 1 | 5 kartu ringkas grid | Baca |
| Bagian 2-5 | Tabel + teks kosong | Baca |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-REPORT-01-01 | Order `PAID` dan order `WAITING_PAYMENT` dalam rentang | Buka `/admin/reports` | Laporan Penjualan hanya menghitung order dibayar, bukan `CANCELED` |
| AC-REPORT-01-02 | Dua produk terjual dengan kuantitas beda | Buka bagian 2 | Daftar urut kuantitas desc dengan nilai pendapatan per varian |
| AC-REPORT-01-03 | Produk dengan `totalStock <= 5` | Buka bagian 3 | Badge "Stok menipis" tampil; lainnya "Aman" |
| AC-REPORT-01-04 | Pesanan berbagai status | Buka bagian 4 | Jumlah per status cocok dengan data rentang |
| AC-REPORT-01-05 | Refund `PENDING` + `COMPLETED` | Buka bagian 5 | Jumlah + nilai per status dengan label Indonesia |
| AC-REPORT-01-06 | Rentang kosong (tanpa data) | Buka `/admin/reports` | Rentang default 30 hari dipakai; bagian kosong informatif, tanpa error |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Rentang eksplisit | `/admin/reports?from=2026-09-01&to=2026-09-30` | Laporan dirender rentang 1-30 Sep 2026 | AC-REPORT-01-06 |
| Ringkasan penjualan | `{ count: 3, subtotal: 450000, shipping: 45000, discount: 50000, total: 445000 }` | 5 kartu laporan penjualan | AC-REPORT-01-01 |
| Refund | `PENDING` 1 x Rp250.000, `COMPLETED` 1 x Rp150.000 | 2 baris tabel refund | AC-REPORT-01-05 |

### 12. Batas fitur

- **Termasuk:** 5 laporan agregat sesuai rentang, agregasi JavaScript tanpa raw SQL, badge stok menipis dengan ambang `LOW_STOCK_THRESHOLD = 5`.
- **Tidak termasuk:** ekspor CSV/PDF, grafik/chart, perbandingan rentang ganda, drill-down ke pesanan, laporan per kurir/kategori.
- **Ketergantungan:** MOD-ORDER (data pesanan), MOD-PAYMENT (status `PAID`), ORDER-06 (model Refund + status), MOD-PROD (`Product.totalStock`).

### 13. Pertanyaan terbuka

- Perlu diperiksa: pesan 500 eksak yang muncul saat error Prisma/koneksi dari `/admin/reports` ΓÇö belum ada uji tercatat di `docs/04` bagian 9.4; sementara itu respons dianggap error generik server component.

**Rujukan kode:**

- `src/lib/reports/queries.ts` ΓÇö 5 query laporan + `getReportBundle` + `resolveReportRange` + `LOW_STOCK_THRESHOLD = 5`.
- `src/lib/reports/index.ts` ΓÇö barrel ekspor.
- `src/app/admin/reports/page.tsx` ΓÇö UI 5 bagian, form filter, label refund, slice 50.
- `docs/01_PRD.md` bagian 4.11 ΓÇö daftar 5 laporan.
- `docs/04_IMPLEMENTATION_PLAN.md` bagian 9.3 (TASK-59 "REPORT-01: lima laporan"), 9.5 (butir 3) ΓÇö bukti `docs/04` bagian 9.

---

## <a name="config-01"></a>CONFIG-01 ΓÇö Store Settings + Template Alasan Penolakan

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CONFIG-01 ΓÇö Store Settings + Template Alasan Penolakan |
| Modul | MOD-CONFIG |
| Tujuan | Store Admin mengelola informasi toko (email, telepon, alamat, tentang, kebijakan, pickup, media sosial) dan CRUD template alasan penolakan pembatalan yang bisa dipilih admin saat menolak pengajuan pembatalan |
| Aktor utama | Store Admin |
| Status | Terimplementasi (PH-06) |
| Referensi PRD | 3.1.G, 4.12 ("Store settings (Store Admin)", "Template alasan penolakan pembatalan"), 5.5 |
| Referensi SDD | 4.11 (config), 5 (rute `/admin/settings`, `/admin/cancellation-reasons`, `/api/admin/settings`), 6.2 (`StoreSetting`, `CancellationReason`) |

### 2. Prasyarat dan pemicu

- Admin masuk; model `StoreSetting` (satu baris `id = "default"`, `STORE_SETTINGS_ID`) dan `CancellationReason` (`prisma/schema.prisma`: `text`, `isActive` default `true`, `sortOrder` default `0`).
- Pemicu: membuka `/admin/settings` (pengaturan) dan `/admin/cancellation-reasons` (template alasan); template dipakai ORDER-06 saat menolak pembatalan.

### 3. Hak akses

| Aktor | Aksi | Sumber | Exception |
| --- | --- | --- | --- |
| Store Admin | GET/PATCH `/api/admin/settings`, CRUD `/api/admin/cancellation-reasons` | `requireStoreAdmin()` | `401` tanpa sesi (bukti `docs/04` bagian 9.4 V6) |
| Site Admin | Pengaturan platform terpisah | - | Di luar fitur ini (payment/shipping/platform = Site Admin, fase PH-08) |
| Customer / Guest | - | - | Tidak ada jalur |

### 4. Input dan validasi

`storeSettingsSchema` (`src/lib/config/validation.ts`) ΓÇö PATCH `/api/admin/settings` (semua opsional kecuali `pickupEnabled` bawaan):

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| storeEmail | String | Tidak | email + maks 200, atau "" | "Email toko tidak valid" |
| storePhone | String | Tidak | maks 30, `CONTACT_PHONE_REGEX` (`/^[\d+()\-. ]+$/`), minimal 7 digit | "Nomor telepon hanya boleh berisi angka", "Nomor telepon minimal 7 angka" |
| storeAddress | String | Tidak | maks 300, tanpa control char | "Alamat toko maksimal 300 karakter", dsl. |
| aboutUs / returnPolicy / warrantyPolicy | String | Tidak | maks 2000 | "Tentang toko maksimal 2000 karakter", "Kebijakan pengembalian ...", "Kebijakan garansi ..." |
| pickupEnabled | Boolean | Tidak (default `false`) | `z.boolean` | "Status pickup tidak valid" |
| pickupInfo | String | Tidak | maks 1000 | "Informasi pickup maksimal 1000 karakter" |
| socialInstagram / socialFacebook / socialWhatsapp | String | Tidak | maks 200, `SOCIAL_HANDLE_REGEX` (handle `@toko.id` atau URL profil), harus ada alfanumerik | "Akun media sosial maksimal 200 karakter", "Akun media sosial hanya boleh berisi huruf, angka, dan tanda @ . _ - / :", "Akun media sosial harus mengandung huruf atau angka" |

`cancellationReasonSchema`:

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| text | String | Ya | min 3, maks 300, harus ada alfanumerik, tanpa control char | "Alasan wajib diisi", "Alasan minimal 3 karakter", "Alasan maksimal 300 karakter", "Alasan harus mengandung huruf atau angka", "Alasan memuat karakter yang tidak diizinkan" |
| isActive | Boolean | Tidak (default `true`) | `z.boolean` | "Status tidak valid" |
| sortOrder | Int (coerce) | Tidak (default `0`) | 0..999 | "Urutan tidak boleh negatif", "Urutan terlalu besar", "Urutan harus bilangan bulat" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Admin buka `/admin/settings` | `getStoreSettings()` (server) | Form terisi; baris belum ada ΓåÆ `DEFAULT_STORE_SETTINGS` (tanpa menulis DB) |
| 2 | Admin simpan | `PATCH /api/admin/settings` ΓåÆ `updateStoreSettings` (Prisma upsert `id = "default"`) | `200 { settings }` |
| 3 | Admin buka `/admin/cancellation-reasons` | `listCancellationReasons()` (urut `sortOrder asc`, `createdAt asc`) | Daftar template dirender |
| 4 | Admin tambah | `POST /api/admin/cancellation-reasons` ΓåÆ `createCancellationReason` | `201 { reason }` |
| 5 | Admin ubah | `PATCH /api/admin/cancellation-reasons/[id]` ΓåÆ `updateCancellationReason` | `200 { ok: true }` |
| 6 | Admin hapus | `DELETE /api/admin/cancellation-reasons/[id]` ΓåÆ `deleteCancellationReason` | `200 { deleted: true }` |
| 7 | Template dipakai | `/admin/orders/[id]`, status `CANCEL_REQUESTED` ΓåÆ `AdminOrderActions` menerima `cancellationReasons` dari `listCancellationReasons({ activeOnly: true })` | Admin memilih mode "template" atau "manual"; `PATCH /api/admin/orders/[id]` `{ action: "REJECT_CANCEL", rejectionReason }` menyimpan `cancelRejectionReason` di Order |

### 6. Output dan perubahan data

- **Hasil:** pengaturan toko tersimpan sebagai satu baris `store_settings`; template tersimpan di `cancellation_reasons (text, isActive, sortOrder, createdAt, updatedAt)`.
- **Data dibaca:** `getStoreSettings`, `getPickupSettings` (dipakai SHIP-03), `listCancellationReasons`.
- **Data dibuat/diubah:** `storeSetting.upsert`, `cancellationReason.create/updateMany/deleteMany`.
- **Konsumsi di situs:** kebijakan/informasi toko tampil di footer, invoice, dan bagian terkait (SITE-05 / PH-09); pickup menyala/mati di checkout (`src/lib/config/queries.ts`); penolakan pembatalan mengalirkan `cancelRejectionReason` ke pembeli (`sendCancellationEmail(orderId, "rejected")`).

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Baris `store_settings` belum ada | `getStoreSettings` mengembalikan `DEFAULT_STORE_SETTINGS` | Pembacaan tanpa efek samping |
| Tidak ada template saat reject | `rejectTemplate` default ""; admin harus pakai mode "manual" dan isi alasan | Validasi server menolak < 3 karakter |
| Nonaktifkan template (`isActive: false`) | Tetap disimpan, tidak muncul di dropdown penolakan (`activeOnly: true`) | Riwayat penolakan lama tidak berubah |
| Template dihapus | Baris hilang; penolakan lama tetap menyimpan teks di `Order.cancelRejectionReason` | Riwayat aman |
| Akses tanpa sesi | `401` oleh `requireStoreAdmin` | Masuk sebagai admin |

### 8. Kondisi gagal

| Kondisi | Kode HTTP | Tindakan |
| --- | --- | --- |
| Body tidak valid | `400 VALIDATION_ERROR` (pesan Zod bagian 4) | Perbaiki isian |
| Tanpa sesi admin | `401` | Masuk sebagai admin |
| ID bukan UUID | `400 INVALID_ID` ΓÇö "ID tidak valid" | - |
| PATCH/DELETE template tidak ada | `404` ΓÇö "Template alasan tidak ditemukan" | Refresh daftar |
| Update gagal (`updateMany` count 0) | `404` "Template alasan tidak ditemukan" | Refresh |

### 9. Perilaku UI

- **Halaman:** `/admin/settings` ΓÇö "Pengaturan Toko", deskripsi "Informasi toko, kebijakan, dan opsi ambil di toko." dengan `StoreSettingsForm` (memanggil `/api/admin/settings`; komentar di kode: label pickup memakai `brandName`, tidak ada field "nama toko" ΓÇö keputusan hapus `storeName`).
- **Halaman:** `/admin/cancellation-reasons` ΓÇö "Template Alasan", deskripsi "Alasan penolakan pembatalan yang bisa dipilih Store Admin." dengan `CancellationReasonManager` (form tambah, baris ubah + nonaktif, hapus).

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Form + daftar | Isi, simpan |
| Menyimpan | Tombol submitting state | Tunggu |
| Galat validasi | Pesan per field | Perbaiki |
| Reject di `/admin/orders/[id]` | `Select` "Sumber alasan" ("Pilih template" / "Isi manual") + dropdown `reject-template` atau input `reject-manual` | Pilih mode, klik "Tolak Pembatalan" |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-CONFIG-01-01 | Admin login, settings belum pernah disimpan | `GET /api/admin/settings` | `200` dengan nilai bawaan (`pickupEnabled: false`, sisanya null) |
| AC-CONFIG-01-02 | Admin login | `PATCH /api/admin/settings` valid | `200`, nilai tersimpan setelah `upsert` |
| AC-CONFIG-01-03 | Admin login, `storePhone: "abc"` | `PATCH /api/admin/settings` | `400 VALIDATION_ERROR` "Nomor telepon hanya boleh berisi angka" |
| AC-CONFIG-01-04 | Template aktif tersimpan | Admin menolak pembatalan dengan mode template | `cancelRejectionReason` di Order berisi teks template; email penolakan terkirim |
| AC-CONFIG-01-05 | Template nonaktif | Dropdown penolakan di `/admin/orders/[id]` | Tidak muncul (hanya `listCancellationReasons({ activeOnly: true })`) |
| AC-CONFIG-01-06 | Template tersimpan | `DELETE /api/admin/cancellation-reasons/<uuid>` | `200 { deleted: true }` |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Simpan settings | `{ "storeEmail": "halo@toko.id", "storePhone": "021-1234567", "storeAddress": "Jl. Mawar No. 1, Jakarta", "aboutUs": "...", "returnPolicy": "...", "warrantyPolicy": "...", "pickupEnabled": true, "pickupInfo": "Jam 09.00-17.00", "socialInstagram": "@toko.id", "socialFacebook": "", "socialWhatsapp": "628123456789" }` | `200 { settings }` | AC-CONFIG-01-02 |
| Template baru | `POST /api/admin/cancellation-reasons` `{ "text": "Stok tidak tersedia saat pengajuan", "sortOrder": 1 }` | `201`, muncul di dropdown penolakan | AC-CONFIG-01-04 |

### 12. Batas fitur

- **Termasuk:** pengaturan informasi toko, kebijakan, pickup, media sosial (3 akun); CRUD template alasan + nonaktifkan + urutan; pemakaian template di ORDER-06 (REJECT_CANCEL).
- **Tidak termasuk:** payment gateway settings, shipping provider settings, platform settings ΓÇö milik Site Admin (PH-08); batas jumlah template tidak ada di kode dan tidak diwajibkan PRD (terverifikasi dari `docs/01_PRD.md` bagian 4.12 dan 5.5, keduanya hanya mengatur kelola template tanpa batasan jumlah); nama toko (nama tunggal dari brand, keputusan `docs/04` bagian 10 tanggal 2026-10-11).
- **Ketergantungan:** SHIP-03 (`pickupEnabled`/`pickupInfo`), ORDER-06 (REJECT_CANCEL + `cancelRejectionReason`), MOD-AUTH (`requireStoreAdmin`).

### 13. Pertanyaan terbuka

- Batas jumlah template alasan (PRD 5.5): kode tidak membatasi jumlah baris `cancellation_reasons`; terverifikasi dari `docs/01_PRD.md` bagian 4.12 dan 5.5 bahwa PRD tidak mensyaratkan batasan jumlah, jadi perilaku kode dianggap sesuai.
- Tidak ada pertanyaan lain.

**Rujukan kode:**

- `src/lib/config/validation.ts` ΓÇö `storeSettingsSchema` + `cancellationReasonSchema` (judul komentar file: "CONFIG-01 (PH-06)").
- `src/lib/config/queries.ts` ΓÇö `STORE_SETTINGS_ID`, `DEFAULT_STORE_SETTINGS`, `getStoreSettings`, `getPickupSettings`, `listCancellationReasons`.
- `src/lib/config/mutations.ts` ΓÇö `updateStoreSettings` (upsert), `create/update/deleteCancellationReason`.
- `src/app/api/admin/settings/route.ts` ΓÇö `GET`/`PATCH` dengan `requireStoreAdmin`.
- `src/app/api/admin/cancellation-reasons/route.ts` dan `[id]/route.ts` ΓÇö CRUD template (pesan "Template alasan tidak ditemukan").
- `src/app/admin/settings/page.tsx`, `src/app/admin/cancellation-reasons/page.tsx` ΓÇö halaman admin.
- `src/components/admin/StoreSettingsForm.tsx`, `src/components/admin/CancellationReasonManager.tsx` ΓÇö UI form + manager.
- `src/components/admin/AdminOrderActions.tsx` ΓÇö pemakaian template di REJECT_CANCEL (mode template/manual).
- `prisma/schema.prisma` ΓÇö model `StoreSetting` dan `CancellationReason`.
- `docs/04_IMPLEMENTATION_PLAN.md` bagian 9.3 (TASK-55), 9.4 (V6), 9.5 (butir 2), bagian 10 (hapus `storeName` 2026-10-11) ΓÇö bukti `docs/04` bagian 9/10.

---

## <a name="cust-01"></a>CUST-01 ├óΓé¼ΓÇ¥ Alamat Tersimpan

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CUST-01 ├óΓé¼ΓÇ¥ Alamat Tersimpan |
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
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`; role non-customer ├óΓÇáΓÇÖ alihkan ke `/admin`

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
- **Data diubah:** Address (create/update/delete). `Order.shippingAddress` **tidak** berubah ├óΓé¼ΓÇ¥ pesanan lama tetap snapshot
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
- **Direncanakan PH-10 (keputusan pengguna 2026-10-11):** halaman alamat berdiri sendiri di `/profile/addresses` dan hanya berisi alamat ├óΓé¼ΓÇ¥ tanpa info akun maupun preferensi notifikasi. Spesifikasi di atas tetap menggambarkan kondisi PH-07 sampai PH-10 dikerjakan; API `/api/customer/addresses` tidak berubah.

---

## <a name="cust-02"></a>CUST-02 ├óΓé¼ΓÇ¥ Preferensi Notifikasi

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CUST-02 ├óΓé¼ΓÇ¥ Preferensi Notifikasi |
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
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`

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

## <a name="auth-04"></a>AUTH-04 ├óΓé¼ΓÇ¥ Set Password (Guest ├óΓÇáΓÇÖ Customer)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-04 ├óΓé¼ΓÇ¥ Set Password (Guest ├óΓÇáΓÇÖ Customer) |
| Modul | MOD-AUTH |
| Tujuan | Guest yang mengisi email saat checkout bisa membuat akun customer lewat tautan set password |
| Aktor utama | Guest dengan email |
| Status | Terimplementasi (PH-07) |
| Referensi PRD | PRD 2.1 (Guest), PRD 2.2 (Customer), PRD 3.1.I, PRD 5.7 (Guest Checkout) |
| Referensi SDD | SDD 4.1 (MOD-AUTH), SDD 4.9 (MOD-NOTIF) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Pesanan guest dibuat dengan `guestEmail` terisi dan email belum terdaftar
- **Pemicu:** Pesanan guest selesai dibuat ├óΓÇáΓÇÖ server mengirim email "Buat Password"
- **Titik masuk:** `/set-password?token=...`, `POST /api/auth/set-password`
- **Jika tidak terpenuhi:** Email sudah terdaftar ├óΓÇáΓÇÖ email tidak dikirim

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

## <a name="auth-05"></a>AUTH-05 ├óΓé¼ΓÇ¥ Reset Password

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-05 ├óΓé¼ΓÇ¥ Reset Password |
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
- **Data dibaca:** User (email ├óΓÇáΓÇÖ `id`, `role`), token (Redis)
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

## <a name="order-03b"></a>ORDER-03B ├óΓé¼ΓÇ¥ Re-order (lanjutan ORDER-03)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-03B ├óΓé¼ΓÇ¥ Re-order (lanjutan ORDER-03) |
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
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ `401`; pesanan bukan miliknya ├óΓÇáΓÇÖ `404`

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

## <a name="site-00"></a>SITE-00 ├óΓé¼ΓÇ¥ Akses Site Admin (role baru)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-00 ├óΓé¼ΓÇ¥ Akses Site Admin (role baru) |
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
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`

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

## <a name="site-01"></a>SITE-01 ├óΓé¼ΓÇ¥ Platform Settings

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-01 ├óΓé¼ΓÇ¥ Platform Settings |
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
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`; role lain ├óΓÇáΓÇÖ `403`

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

## <a name="site-02"></a>SITE-02 ├óΓé¼ΓÇ¥ Payment Gateway Configuration (Xendit)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-02 ├óΓé¼ΓÇ¥ Payment Gateway Configuration (Xendit) |
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
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`; role lain ├óΓÇáΓÇÖ `403`

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
- **Kondisi akhir:** Durasi efektif = nilai database (bila baris ada) ├óΓÇáΓÇÖ env `XENDIT_INVOICE_DURATION` ├óΓÇáΓÇÖ bawaan 900 detik
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

## <a name="site-03"></a>SITE-03 ├óΓé¼ΓÇ¥ Shipping Provider Configuration (RajaOngkir)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-03 ├óΓé¼ΓÇ¥ Shipping Provider Configuration (RajaOngkir) |
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
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`; role lain ├óΓÇáΓÇÖ `403`

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
- **Kondisi akhir:** Nilai efektif = database (bila baris ada) ├óΓÇáΓÇÖ env ├óΓÇáΓÇÖ bawaan; cache tarif dibersihkan saat konfigurasi berubah
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

## <a name="site-04"></a>SITE-04 ├óΓé¼ΓÇ¥ User Management (Store Admin)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-04 ├óΓé¼ΓÇ¥ User Management (Store Admin) |
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
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`; role lain ├óΓÇáΓÇÖ `403`

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
- **Kondisi akhir:** Penonaktifan berlaku segera ├óΓé¼ΓÇ¥ login gagal dan API/halaman Store Admin ditolak pada permintaan berikutnya
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

## <a name="site-05"></a>SITE-05 ├óΓé¼ΓÇ¥ Brand Customization (Identitas, Palet, Banner)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SITE-05 ├óΓé¼ΓÇ¥ Brand Customization (Identitas, Palet Warna, Banner) |
| Modul | MOD-CONFIG |
| Tujuan | Site Admin mengkustomisasi identitas brand per deployment (1 deployment = 1 brand store): nama, logo, favicon, tagline, palet warna, teks footer, banner homepage ├óΓé¼ΓÇ¥ tanpa menyentuh kode |
| Aktor utama | Site Admin |
| Status | Terimplementasi (PH-09, 2026-10-11) ├óΓé¼ΓÇ¥ bukti verifikasi di `docs/04` bagian 14.5, laporan 14.6 |
| Referensi PRD | PRD 2.4 (Brand Customization), PRD 3.1.J (Theme customization MVP), PRD 7.6, PRD 4.12 ├óΓé¼ΓÇ¥ sesuai revisi PRD v1.2 |
| Referensi SDD | SDD 5 (struktur project), SDD 7 (MOD-CONFIG), SDD 10 (keamanan) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login Site Admin; SITE-00 (role) dan area `/site-admin` dari PH-08 sudah tersedia
- **Pemicu:** Buka `/site-admin/brand`
- **Titik masuk:** `/site-admin/brand`, `GET`/`PATCH /api/site-admin/brand`, endpoint Uploadthing `brandAsset` dan `bannerImage`
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`; role lain ├óΓÇáΓÇÖ `403`

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
| 3 | Unggah logo lewat form | Uploadthing `brandAsset` ├óΓÇáΓÇÖ URL disuntikkan ke body PATCH | Header storefront menampilkan gambar (bila kosong: teks nama) |
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
| footerText kosong | Footer = tampilan sekarang (nama + tagline + `├é┬⌐`) | Tidak ada baris tambahan |
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
| AC-SITE-05-06 | Banner aktif + data lengkap | Buka homepage | Banner tampil; sakelar mati ├óΓÇáΓÇÖ hero default |
| AC-SITE-05-07 | Nama brand diganti | Cek tab browser, halaman invoice, email berikutnya | Judul, kop, subjek memakai nama baru |
| AC-SITE-05-08 | `faviconUrl` diisi | Buka tab halaman | Ikon tab berubah; dikosongkan ├óΓÇáΓÇÖ tanpa ikon |
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
- Nama tampilan = `BrandSetting.brandName` **satu-satunya nama** ├óΓé¼ΓÇ¥ `StoreSetting.storeName` dihapus (keputusan 2026-10-11, `docs/04` bagian 10): 1 deployment = 1 brand = 1 store, dua nama tidak masuk akal. Label pickup di checkout memakai `brandName`.
- Halaman bayar Xendit memakai domain Xendit sehingga tidak bisa ikut dikustom; yang bisa dikustom hanyalah kop invoice di deployment ini.
- Email membaca nama brand saat pengiriman; email yang sudah terkirim memakai nama lama (jejak histori tidak diubah).

---

## <a name="cust-03"></a>CUST-03 ├óΓé¼ΓÇ¥ Profil Akun (halaman mandiri)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CUST-03 ├óΓé¼ΓÇ¥ Profil Akun |
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
- **Jika tidak terpenuhi:** Tanpa sesi ├óΓÇáΓÇÖ alihkan ke `/login`; role non-customer ├óΓÇáΓÇÖ alihkan ke `/admin`. Halaman `/verify-email` boleh dibuka tanpa sesi karena otorisasinya memakai token sekali pakai

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
- **Tidak memuat:** daftar alamat (CUST-01) dan preferensi notifikasi (NOTIF-02) ├óΓé¼ΓÇ¥ keduanya dipisah

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
- Keputusan pengguna 2026-10-11: email verifikasi **selalu dikirim**, tidak tunduk pada preferensi email (CUST-02/NOTIF-02) ├óΓé¼ΓÇ¥ sama seperti email set/reset password.
- Keputusan pengguna 2026-10-11: halaman profil isinya **info akun saja** ├óΓé¼ΓÇ¥ riwayat pesanan tetap di `/orders`, alamat di `/profile/addresses`, notifikasi di dialog NOTIF-02.

---

## <a name="notif-02"></a>NOTIF-02 ├óΓé¼ΓÇ¥ Pusat Notifikasi In-App

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | NOTIF-02 ├óΓé¼ΓÇ¥ Pusat Notifikasi In-App |
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
- **Data dibaca:** `Order` (`createdAt`, `shippedAt`, `completedAt`, `canceledAt`, `status`), `Payment` (`status`, `paidAt`), `Refund` (`status`, `processedAt`) ├óΓé¼ΓÇ¥ hanya milik pemanggil
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

Daftar dibatasi **20 entri terbaru** (urut terbaru dulu); entri yang lebih lama tidak ditampilkan ├óΓé¼ΓÇ¥ bukan dihapus, karena daftarnya diturunkan dari data pesanan.

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
- Judul dan deskripsi tiap kejadian memakai diksi paling lumrah (keputusan pengguna 2026-10-11) dan boleh diganti kapan saja ├óΓé¼ΓÇ¥ teks acuan di bagian 9. Daftar dibatasi 20 entri terbaru. Sumber waktu memakai kolom yang sudah ada (tanpa migrasi).
- Keputusan pengguna 2026-10-11: email verifikasi perubahan email (CUST-03) **selalu dikirim** dan tidak tunduk pada preferensi di dialog ini (sama seperti email set/reset password).


## <a name="admin-dash-01"></a>ADMIN-DASH-01 — Modernisasi Dashboard Store Admin

### 1. Identitas dan tujuan

Modul: MOD-ADMIN. Dashboard saat ini di `/admin` menampilkan empat ringkasan operasional dan jumlah pesanan per status. Tujuan peningkatan ini: memberi Store Admin ringkasan yang lebih modern dan bisa ditindaklanjuti, tanpa menjadikan dashboard pengganti laporan lengkap.

**Status: spek ditulis 2026-10-15, BELUM diimplementasikan.** Ini dokumentasi cakupan awal; detail visual (gaya grafik, warna, layout final) dapat diputuskan saat implementasi.

### 2. Prasyarat dan pemicu

- Store Admin login membuka `/admin`; akses tetap mengikuti guard/layout admin yang sudah ada.
- Ringkasan dan tindakan mengarah ke halaman operasional terkait; sumber laporan yang sudah ada dipakai ulang bila definisi datanya cocok.
- Fitur ini hanya mengubah dashboard. Laporan lengkap tetap berada di `/admin/reports`.

### 3. Hak akses

| Aktor | Hak |
| --- | --- |
| Store Admin | Melihat ringkasan untuk tokonya dan membuka tautan tindakan |
| Role lain / tanpa sesi | Mengikuti perlindungan akses admin yang sudah berlaku; tidak mendapat data dashboard |

### 4. Input dan filter

| Input | Validasi/perilaku |
| --- | --- |
| Periode | Pilihan cepat: hari ini, 7 hari, 30 hari; rentang tanggal khusus opsional |
| Perubahan periode | Memperbarui KPI, grafik, pesanan terbaru, dan produk terlaris secara konsisten |
| Rentang khusus tidak valid | Tolak atau fallback aman; jangan menjalankan query dengan tanggal tidak valid/terbalik |

Zona waktu dan apakah batas tanggal mencakup hari kalender penuh diputuskan sebelum implementasi, lalu dicatat di `docs/04` bagian 10. Default awal yang disarankan: 30 hari terakhir, agar selaras dengan dashboard saat ini.

### 5. Alur berhasil

| Langkah | Hasil |
| --- | --- |
| Store Admin membuka dashboard | Periode default tampil beserta KPI dan ringkasan terkini |
| Admin memilih periode cepat / rentang khusus | Semua panel berbasis periode diperbarui memakai rentang yang sama |
| Admin memilih kartu tindakan atau pesanan | Berpindah ke daftar/detail terkait |
| Admin memilih tautan laporan lengkap | Membuka `/admin/reports` |

### 6. Isi dashboard

1. **Filter periode** — hari ini, 7 hari, 30 hari, serta rentang tanggal khusus.
2. **Kartu KPI + perbandingan tren** — nilai penjualan, jumlah transaksi, rata-rata nilai pesanan, dan jumlah pesanan menunggu pembayaran; tampilkan perubahan dibanding periode sebelumnya yang setara. Definisi nilai penjualan mengikuti REPORT-01 (pesanan dibayar, tidak dibatalkan); rata-rata = nilai penjualan dibagi transaksi, dengan keadaan kosong yang aman saat transaksi nol.
3. **Grafik tren** — grafik penjualan dan jumlah pesanan per hari dalam periode terpilih; label/tip menampilkan tanggal dan nilai. Rentang yang sangat panjang boleh dikelompokkan setelah keputusan implementasi.
4. **Perlu tindakan** — pintasan berjumlah untuk pesanan perlu dikirim (PROCESSING), pengajuan pembatalan (CANCEL_REQUESTED), dan stok menipis, masing-masing membuka daftar terkait. Pengingat refund hanya ditambahkan bila alur/status refund yang ada menunjukkan tindakan admin yang masih tertunda.
5. **Pesanan terbaru** — daftar ringkas 5–10 pesanan terbaru: nomor pesanan, pembeli, total, status, waktu; setiap baris membuka detail pesanan.
6. **Produk terlaris** — 5 produk teratas pada periode berdasarkan unit terjual, dengan jumlah unit dan nilai penjualan; nama membuka produk terkait bila rute admin tersedia.

### 7. Data dan aturan agregasi

- Gunakan ulang definisi laporan penjualan / kinerja produk dari REPORT-01 agar angka dashboard konsisten dengan `/admin/reports`.
- Jumlah pesanan per status tetap tersedia sebagai ringkasan/pintasan seperti dashboard saat ini.
- Tren membandingkan periode terpilih dengan periode sebelumnya yang sama panjang; periode kosong atau tanpa data menampilkan nol/keadaan kosong, bukan error.
- Untuk pesanan terbaru, periode filter tidak menyembunyikan daftar operasional kecuali keputusan implementasi menetapkan demikian; label panel harus menjelaskan cakupannya.
- Query tetap melalui Prisma dan data hanya untuk konteks toko yang berhak diakses; tanpa raw SQL.

### 8. Perilaku gagal dan keadaan kosong

| Kondisi | Tampilan/perilaku |
| --- | --- |
| Belum ada penjualan pada periode | KPI nol, grafik keadaan kosong yang jelas, tanpa pembagian nol |
| Tidak ada pesanan terbaru | Empty state ringkas |
| Tidak ada produk terjual | Empty state pada panel produk terlaris |
| Satu panel gagal dimuat | Tampilkan fallback/error yang tidak menghilangkan panel lain bila memungkinkan; jangan tampilkan data palsu sebagai nol tanpa penanda |
| Rentang filter tidak valid | Pesan validasi yang jelas dan tidak menjalankan query rentang invalid |

### 9. Perilaku UI

- Urutan yang disarankan: filter periode → KPI → grafik + perlu tindakan → pesanan terbaru + produk terlaris.
- Tata letak responsif; tabel/list tetap dapat dibaca pada layar sempit tanpa overflow halaman.
- Grafik memiliki label yang dapat dipahami tanpa mengandalkan warna saja, legenda/tooltip yang jelas, serta fallback aksesibel bila grafik tidak dapat dirender.
- Kartu tindakan dan baris pesanan punya affordance klik/fokus keyboard yang jelas.
- Pilihan pustaka grafik dan detail visual diputuskan saat implementasi; jangan menambah dependensi sebelum dibutuhkan.

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ADMIN-DASH-01-01 | Store Admin login | Buka `/admin` | Filter periode, KPI, grafik, daftar tindakan, pesanan terbaru, produk terlaris tampil |
| AC-ADMIN-DASH-01-02 | Ada data pada periode | Pilih periode berbeda | KPI dan grafik berubah konsisten mengikuti periode |
| AC-ADMIN-DASH-01-03 | Ada data pembanding | Lihat kartu KPI | Perubahan terhadap periode sebelumnya yang setara ditampilkan |
| AC-ADMIN-DASH-01-04 | Ada pesanan PROCESSING/CANCEL_REQUESTED atau stok menipis | Buka panel tindakan | Jumlah benar dan setiap pintasan menuju daftar terkait |
| AC-ADMIN-DASH-01-05 | Ada pesanan | Klik baris pesanan terbaru | Detail pesanan yang benar terbuka |
| AC-ADMIN-DASH-01-06 | Ada item terjual pada periode | Buka panel produk terlaris | Maksimal 5 produk diurut berdasarkan unit terjual |
| AC-ADMIN-DASH-01-07 | Periode tanpa penjualan/pesanan | Buka dashboard | Keadaan nol/kosong informatif; tanpa NaN atau error |
| AC-ADMIN-DASH-01-08 | Layar sempit | Buka dashboard | Semua panel tetap terbaca dan dapat digunakan |
| AC-ADMIN-DASH-01-09 | User bukan Store Admin | Akses dashboard | Perlindungan akses tetap berlaku dan data tidak bocor |

### 11. Batas fitur

- **Termasuk:** modernisasi halaman dashboard Store Admin, filter periode, KPI/tren, grafik, tindakan, pesanan terbaru, produk terlaris.
- **Tidak termasuk:** mengganti/menghapus `/admin/reports`, ekspor laporan, notifikasi realtime, target/forecast bisnis, perbandingan lintas toko, atau perubahan workflow pesanan.
- **Ketergantungan:** REPORT-01, ORDER-07, data stok produk, halaman admin produk/pesanan yang sudah ada.

### 12. Pertanyaan terbuka

- Rentang periode kustom: batas kalender menurut zona waktu toko atau zona waktu browser?
- Pesanan terbaru selalu global-terbaru atau mengikuti periode yang dipilih?
- Apakah perlu kartu metrik refund setelah definisi status refund pending dikonfirmasi?
- Pustaka grafik dan visual final dipilih saat implementasi.

**Rujukan kode saat ini:** `src/app/admin/page.tsx` (dashboard), `src/lib/orders/admin.ts` (jumlah status), `src/lib/reports/queries.ts` (agregat laporan), `src/app/admin/reports/page.tsx`.

---

## <a name="prod-08"></a>PROD-08 — Informasi Tambahan Produk (ganti "SIZE_CHART", label kustom)

### 1. Identitas dan tujuan

Modul: MOD-PROD (form admin + storefront). Dipicu permintaan pengguna 2026-10-15: slot gambar "Bagan Ukuran" saat ini terlalu sempit namanya — pada produk yang tidak butuh size chart, slot itu diproyeksikan untuk keterangan tambahan lain (bahan yang digunakan, efek/cara perawatan, dan sejenisnya). Dibutuhkan nama yang universal plus label judul yang bisa dikustomisasi admin per produk.

**Status: terimplementasi 2026-10-16** (spek ditulis 2026-10-15, dikerjakan 2026-10-16 sebagai TASK-117; bukti `docs/04` bagian 10). Keputusan pengguna: nama role baru **`INFO`**, default label **"Informasi Tambahan"**, label bisa diubah admin saat add/edit produk.

**Status tambahan 2026-10-16 (TERIMPLEMENTASI, satu paket dengan tautan + dialog PROD-06).** Bagian 5 dan bagian 9 baris "section tampil di bawah grid" **tidak berlaku lagi**: storefront tidak merender section penuh, melainkan tautan kecil di kanan bawah form beli yang membuka dialog (PROD-06). Yang dipakai dari spek ini: slot di form admin berjudul **"Informasi Tambahan (opsional)"** dengan input "Label judul (opsional)" di atas slot gambar (maks 40 karakter; input dibatasi `maxLength` di UI, sedangkan penolakan "Label maksimal 40 karakter" tetap dijaga Zod di API), role gambar `INFO`, kolom `Product.infoLabel`, dan **judul tautan + judul dialog mengikuti label** (`infoLabel ?? "Informasi Tambahan"`). Pertanyaan terbuka bagian 13 soal teks tautan CART-05 diputus **opsi A (ikut label)**: "Lihat `<label>` & detail lengkap" — label dialirkan `ProductCard` → `ProductCardActions` → `VariantPickerDialog`. Field kode `sizeChartUrl` ikut di-rename jadi `infoUrl` (keputusan pengguna 2026-10-16) supaya identifier tidak menyesatkan; kontrak Uploadthing dan jumlah slot (maks 1) tidak berubah. Migrasi enum memakai `ALTER TYPE ... RENAME VALUE` sehingga baris gambar `SIZE_CHART` yang sudah ada otomatis menjadi `INFO` tanpa drop/backfill.

### 2. Prasyarat dan pemicu

- Form add/edit produk admin (PROD-01) punya section yang saat ini berjudul "Bagan Ukuran" dengan slot gambar maksimal 1.
- Perubahan skema (migrasi Prisma):
  - Rename nilai enum `ImageRole.SIZE_CHART` → `INFO` (migrasi `ALTER TYPE ... RENAME VALUE`, data baris lama ikut).
  - Kolom baru `Product.infoLabel String?` (nullable, tanpa default) — menyimpan label judul kustom.
- Tidak ada perubahan endpoint Uploadthing, struktur `ProductImage`, atau alur keranjang/pesanan.

### 3. Entitas terkait

- `ProductImage` (`role: INFO`, sebelumnya `SIZE_CHART`), `Product.infoLabel` (baru), `ProductForm` (form admin), halaman detail `/(storefront)/products/[slug]`, tautan di dialog CART-05.

### 4. Input, validasi, kegagalan (data)

| Input | Validasi | Pesan |
| --- | --- | --- |
| infoLabel (teks label) | trim, maks 40 karakter, karakter kontrol dibersihkan (aturan bagian 1A) | "Label maksimal 40 karakter" |
| infoLabel kosong | diperbolehkan (opsional) | Fallback ke default "Informasi Tambahan" |
| Gambar slot | mengikuti aturan yang ada (endpoint, plafon, dropzone bagian 1C) | "Gagal unggah" yang sudah ada |

### 5. Alur berhasil

| Langkah | Hasil |
| --- | --- |
| Admin buka add/edit produk | Section tampil berjudul "Informasi Tambahan", berisi input label (opsional, placeholder "Informasi Tambahan") + slot gambar maksimal 1 (dropzone, disabled saat terisi) |
| Admin isi label lalu simpan | `Product.infoLabel` tersimpan; `ProductImage` slot disimpan dengan `role: INFO` |
| Admin simpan tanpa label | `infoLabel = null` |
| Buka detail produk dengan gambar INFO | Section tampil di bawah grid (posisi section bagan ukuran saat ini), judul memakai label produk (atau "Informasi Tambahan" bila null) — **digantikan 2026-10-16:** tautan "Lihat <label>" di kanan bawah form beli membuka dialog (PROD-06), bukan section penuh |
| Admin hapus gambarnya saja | Section tidak dirender; label tetap tersimpan |

### 6. Output dan perubahan data

- **Diubah:** `Product.infoLabel`; baris `ProductImage.role` memakai `INFO` (bukan `SIZE_CHART`).
- **Tidak diubah:** kontrak Uploadthing, jumlah slot (maks 1), posisi section di halaman detail, perilaku tautan dialog CART-05 selain teksnya.

### 7. Alur alternatif

- Produk tanpa gambar `INFO`: section tidak dirender apa pun isi `infoLabel`-nya.
- Produk dengan gambar tapi tanpa label: judul default "Informasi Tambahan".
- Data lama (gambar `SIZE_CHART` sudah ada): setelah rename enum, baris menjadi `INFO` otomatis dan tampil persis seperti sebelumnya dengan judul default.

### 8. Perilaku kegagalan

| Kondisi | Sumber | Respons |
| --- | --- | --- |
| Label > 40 karakter / karakter kontrol | validasi Zod di form | "Label maksimal 40 karakter", simpan ditolak |
| Gambar slot sudah ada, admin unggah lagi | UI | Dropzone disabled (aturan 1C), ganti = Hapus dulu |
| Referensi kode masih memuat `SIZE_CHART` saat implementasi setengah jalan | build/lint | Gagal build → tuntaskan ganti seluruh pemakaian (`AddToCartForm`, halaman PROD-03, queries) dalam satu task |

### 9. Perilaku UI

- **Form admin:** judul section "Bagan Ukuran" → **"Informasi Tambahan"**; tambah satu input teks "Label judul (opsional)" di atas slot gambar; helper text menjelaskan fungsinya (mis. "Bahan, perawatan, size chart — tampil sebagai judul section di halaman produk").
- **Storefront:** judul section = `infoLabel ?? "Informasi Tambahan"`; isi (gambar) dan posisi tidak berubah — **direvisi 2026-10-16:** judulnya jadi teks tautan "Lihat <label>" dan judul dialog (bukan judul section; posisi tetap di kanan bawah form beli).
- **Dialog CART-05:** teks tautan "Lihat bagan ukuran & detail lengkap" — opsi A: mengikuti label ("Lihat <label> & detail lengkap"); opsi B: tetap generik. Putuskan saat implementasi dan catat di `docs/04` bagian 10. **Diputus 2026-10-16: opsi A.**

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PROD-08-01 | Produk baru, label diisi "Bahan & Perawatan" | Simpan lalu buka detail | Section tampil berjudul "Bahan & Perawatan" |
| AC-PROD-08-02 | Produk dengan gambar INFO, tanpa label | Buka detail | Section tampil berjudul "Informasi Tambahan" |
| AC-PROD-08-03 | Produk lama (gambar `SIZE_CHART` sebelum migrasi) | Buka detail setelah migrasi | Tampil sama seperti sebelumnya, judul default |
| AC-PROD-08-04 | Admin isi 41 karakter | Simpan | Ditolak "Label maksimal 40 karakter" |
| AC-PROD-08-05 | Admin upload gambar | Buka form edit lagi | Gambar tampil pada slot, dropzone disabled, label terisi kembali |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Size chart | label null, gambar `INFO` | Judul "Informasi Tambahan", gambar tampil | AC-02, AC-03 |
| Bahan | label "Bahan & Perawatan", gambar `INFO` | Judul kustom | AC-01 |
| Kosong | tanpa gambar | Section hilang | bagian 7 |

### 12. Batas fitur

- **Termasuk:** rename role, kolom label, judul kustom di form + storefront + (opsional) tautan CART-05.
- **Tidak termasuk:** multiple slot gambar informasi (masih maks 1), field teks isi (bukan gambar), label per kategori, perubahan posisi section.
- **Ketergantungan:** PROD-01 (form), PROD-03 (halaman detail), CART-05 (tautan), 1C (dropzone).

### 13. Pertanyaan terbuka

- Teks tautan di dialog CART-05 ikut label atau tetap generik (bagian 9) — **diputus 2026-10-16: ikut label (opsi A).**
- Maksimum slot gambar informasi: tetap 1 atau 2-3 (mis. size chart + bahan berdampingan) — bila nanti butuh, slot tambahan adalah keputusan terpisah.
- Label perlu ikut tampil di tabel daftar produk admin — rekomendasi: tidak (KISS).

**Rujukan kode (saat ini):** `prisma/schema.prisma` (enum `ImageRole`); `src/lib/products/mutations.ts` (penyusunan gambar slot); `src/lib/products/validation.ts` (`sizeChartUrl`); `src/components/admin/ProductForm.tsx` (section); `src/app/(storefront)/products/[slug]/page.tsx` (render section); `src/components/cart/VariantPickerDialog.tsx` (tautan CART-05).

---

## <a name="prod-09"></a>PROD-09 — Varian Berbasis Opsi (kombinasi ukuran/warna)

### 1. Identitas dan tujuan

Modul: MOD-PROD (form admin, katalog, detail produk, keranjang, checkout, pesanan). Dipicu permintaan pengguna 2026-10-16 setelah melihat produk sandal gunung perlu 12 baris varian untuk enam ukuran × dua warna: pola saat ini meminta admin memasukkan satu baris datar untuk setiap kombinasi, sehingga bertambah cepat dan mudah ada kombinasi yang terlewat.

**Status: SPEK DITULIS 2026-10-16, BELUM DIIMPLEMENTASIKAN.** Kode, skema, migrasi, dan data tidak diubah oleh penulisan spek ini. Rekomendasi pola: admin mendefinisikan opsi dan nilainya; sistem membentuk kombinasi sebagai varian konkret. Varian konkret tetap diperlukan karena SKU, stok, harga, berat, dan gambar bisa berbeda untuk setiap kombinasi.

### 2. Prasyarat dan pemicu

- PROD-01 yang ada menggunakan `ProductVariant` datar; setiap baris memiliki SKU unik global, harga, stok, berat, serta gambar opsional.
- Produk dapat mempunyai satu atau lebih opsi, misalnya `Ukuran: 39, 40, 41, 42, 43, 44` dan `Warna: Hitam, Hijau`.
- Hanya kombinasi yang memang dibuat/diaktifkan admin yang dijual; generator kombinasi tidak boleh memaksa semua kombinasi matematis tersedia bila sebagian tidak diproduksi.
- Opsi/nilai opsi adalah cara menyusun dan menampilkan varian, bukan pengganti identitas varian yang sudah dipakai CartItem/OrderItem.

### 3. Entitas terkait dan arah desain

Rancangan relasional yang direkomendasikan (nama final dapat disesuaikan saat implementasi):

- `ProductOption`: `id`, `productId`, `name`, `sortOrder` (contoh: Ukuran, Warna).
- `ProductOptionValue`: `id`, `optionId`, `value`, `sortOrder` (contoh: 39, Hitam).
- Relasi nilai opsi ke varian (mis. `ProductVariantOptionValue`): satu `ProductVariant` memilih tepat satu nilai dari setiap opsi produk yang dipakainya. Kombinasi nilai untuk satu produk harus unik.
- `ProductVariant` tetap menyimpan `sku`, `price`, `stock`, `weightGram`, `imageUrl`; atribut kombinasi dapat diambil lewat relasi opsi. `variant.name` lama tetap tersedia selama transisi dan untuk snapshot/kompatibilitas, tidak dijadikan sumber untuk mem-parsing opsi.
- Kunci kombinasi harus memiliki constraint/validasi server agar dua varian produk yang sama tidak mempunyai pilihan opsi identik.

Alternatif JSON atau menyimpan `Size`/`Color` sebagai kolom tetap tidak dipilih sebagai default: struktur relasional lebih mudah memvalidasi nilai, membuat kombinasi unik, dan diperluas ke opsi lain tanpa migrasi kolom per jenis.

### 4. Input admin dan validasi

| Input | Validasi yang direncanakan | Perilaku |
| --- | --- | --- |
| Nama opsi | wajib, trim, unik dalam satu produk, panjang dibatasi | Contoh `Ukuran`, `Warna` |
| Nilai opsi | minimal satu nilai per opsi, trim, unik tanpa membedakan spasi pinggir | Contoh `39`, `40`, `Hitam`, `Hijau` |
| Kombinasi varian | tiap varian memilih satu nilai untuk setiap opsi aktif; kombinasi duplikat ditolak | Tabel kombinasi dibuat otomatis dari nilai opsi, lalu admin dapat mengecualikan kombinasi yang tidak tersedia |
| SKU | tetap wajib dan unik global; tidak dibuat diam-diam tanpa kontrol admin | Admin mengisi SKU per kombinasi atau memakai generator pratinjau yang tetap dapat diedit |
| Harga, stok, berat, gambar varian | mengikuti aturan PROD-01 saat ini | Nilai dapat diedit per kombinasi |
| Batas kombinasi | harus dibatasi dan ditampilkan sebelum generator membuat tabel besar | Nilai maksimum diputus sebelum implementasi; cegah ledakan kombinasi (mis. puluhan/ratusan baris) |

### 5. Alur admin yang direncanakan

1. Admin menambah opsi (mis. Ukuran dan Warna) lalu mengisi nilai masing-masing.
2. UI menampilkan pratinjau jumlah kombinasi potensial sebelum membuatnya.
3. Admin memilih apakah membuat seluruh kombinasi atau mengecualikan kombinasi tertentu.
4. Sistem membentuk satu baris varian per kombinasi terpilih; kolom tabel memuat kombinasi (mis. `39 / Hitam`), SKU, harga, stok, berat, dan gambar.
5. Admin bisa mengedit SKU/stok/harga/berat/gambar per baris tanpa mengetik ulang nama kombinasi.
6. Menambah nilai opsi menawarkan pembuatan varian baru yang terbentuk; varian yang sudah ada tidak dihapus atau di-reset otomatis.
7. Menghapus opsi/nilai atau kombinasi yang sudah dipakai `CartItem`/`OrderItem` mengikuti guard PROD-01: riwayat order tidak boleh rusak, item keranjang tidak boleh terhapus senyap; tampilkan konflik spesifik dan pertahankan baris terkait.

### 6. Perilaku customer yang direncanakan

- Halaman detail memilih opsi bertahap (untuk fashion lazimnya warna lalu ukuran; urutan dapat mengikuti `sortOrder`).
- Nilai yang tidak mempunyai varian aktif/stok efektif untuk pilihan sebelumnya ditampilkan disabled, bukan bisa dipilih lalu gagal saat submit.
- Harga/stok/gambar varian diperbarui berdasarkan kombinasi konkret yang cocok.
- Tombol tambah ke keranjang nonaktif sampai kombinasi valid dipilih; request mengirim `variantId` seperti saat ini, bukan nama opsi buatan klien.
- Kartu katalog, dialog CART-05, galeri PROD-06, cart, checkout, invoice, dan pesanan tetap beroperasi atas `ProductVariant`/snapshot yang sama. Tampilan opsi hanya menggantikan label datar bila atribut tersedia.
- Produk satu opsi (mis. warna saja) dan produk tanpa opsi tetap didukung; varian tanpa opsi adalah kompatibilitas bagi produk lama/non-fashion.

### 7. Migrasi dan kompatibilitas data (wajib non-destruktif)

- Tidak mengubah atau membuat ulang `ProductVariant.id` yang ada; `CartItem.variantId` dan `OrderItem.variantId` tetap menunjuk baris yang sama.
- Tidak menebak atau mem-parse teks `ProductVariant.name` lama seperti `"Size 40 - Hitam"` secara otomatis — format lama tidak konsisten dan parsing dapat salah mengubah data jual.
- Varian lama tetap sah tanpa atribut opsi; admin dapat mengonversi produk satu per satu melalui alur eksplisit yang mempertahankan SKU/ID dan meminta pemetaan opsi. Bila pemetaan ambigu, pertahankan varian lama apa adanya dan minta admin memilih.
- Snapshot `OrderItem.variantName`/`sku` tidak ditulis ulang; invoice/riwayat pesanan tetap menampilkan informasi saat transaksi.
- Migrasi skema harus additive dan dapat di-deploy tanpa menghapus data lama. Backfill opsi hanya dijalankan pada pemetaan yang telah ditinjau/eksplisit.
- API cart dan order tetap menerima ID varian dan membaca opsi dari database; jangan percaya nama/atribut kombinasi yang dikirim browser.

### 8. Kriteria penerimaan awal

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PROD-09-01 | Produk baru, opsi Ukuran 6 nilai × Warna 2 nilai | Admin buat kombinasi | Pratinjau 12; sistem membuat maksimal 12 varian, satu per kombinasi terpilih |
| AC-PROD-09-02 | Sebagian kombinasi tidak dijual | Admin mengecualikan kombinasi | Kombinasi itu tidak dibuat/aktif dan tidak dapat dipilih customer |
| AC-PROD-09-03 | Kombinasi dibuat | Admin mengisi SKU duplikat | Penyimpanan ditolak oleh aturan SKU global PROD-01 |
| AC-PROD-09-04 | Customer belum memilih semua opsi | Buka detail | Tombol beli nonaktif; belum ada `variantId` yang bisa ditambahkan |
| AC-PROD-09-05 | Warna dipilih | Beberapa ukuran tidak punya varian tersedia | Ukuran tidak tersedia disabled; ukuran tersedia tetap dapat dipilih |
| AC-PROD-09-06 | Kombinasi valid dipilih | Tambah ke keranjang | Varian konkret yang benar (ID/SKU/price/stock) masuk melalui API cart yang ada |
| AC-PROD-09-07 | Varian lama sudah berada di cart dan order | Migrasi/konversi opsi | ID varian dan referensi tetap; snapshot order tidak berubah |
| AC-PROD-09-08 | Nama varian lama tidak mengikuti pola baku | Migrasi | Sistem tidak mem-parse otomatis; produk tetap berfungsi sampai admin memetakan secara eksplisit |
| AC-PROD-09-09 | Kombinasi terpilih masih ada di cart atau order | Admin menghapus kombinasi/nilai | Guard PROD-01 menolak tindakan yang merusak referensi; tidak ada penghapusan senyap |
| AC-PROD-09-10 | Jumlah nilai menghasilkan kombinasi melebihi batas | Admin meminta generate | Sistem mencegah operasi dan menjelaskan batas sebelum membuat varian |

### 9. Batas cakupan awal

- **Termasuk:** opsi per produk, generator kombinasi terbatas, pengecualian kombinasi, tabel pengelolaan nilai SKU/stok/harga/berat/gambar, pemilih opsi storefront, migrasi additive, kompatibilitas cart/order.
- **Tidak termasuk tanpa keputusan baru:** inventori per lokasi, matrix import/export spreadsheet, opsi bebas tanpa batas, harga bertingkat per nilai (mis. semua warna punya tambahan harga otomatis), personalisasi teks, swatch gambar per nilai warna yang terpisah dari `ProductVariant.imageUrl`.
- **Ketergantungan:** PROD-01, PROD-03, CART-01, CART-05, PROD-06, validasi stok/reservasi PH-03, guard varian pada `CartItem`/`OrderItem`.

### 10. Pertanyaan terbuka sebelum implementasi

- Berapa batas opsi per produk, nilai per opsi, dan total kombinasi (rekomendasi awal: 3 opsi, 20 nilai per opsi, 100 kombinasi — wajib dicek dengan admin UX dan batas server)?
- Apakah UI customer memilih opsi bertahap, atau menampilkan semua kombinasi sebagai daftar (rekomendasi: bertahap; ukuran yang tidak tersedia dinonaktifkan)?
- Apakah warna perlu swatch warna/gambar per nilai, di samping gambar per varian yang sudah ada?
- SKU dibuat manual untuk setiap kombinasi atau ada generator pola yang dapat diedit (rekomendasi: generator opsional + edit manual, validasi global tetap)?
- Saat opsi diubah setelah produk dipakai, bagaimana UI konversi dan konflik referensi ditampilkan?
- Perlukah UI varian datar lama tetap tersedia untuk produk tanpa opsi (rekomendasi: ya, agar produk sederhana dan migrasi bertahap tidak dipaksa)?

**Rujukan kode saat ini:** `prisma/schema.prisma` (`ProductVariant`, `CartItem`, `OrderItem`); `src/components/admin/ProductForm.tsx`; `src/lib/products/{validation,mutations}.ts`; `src/components/products/AddToCartForm.tsx`; `src/components/cart/VariantPickerDialog.tsx`; `src/lib/cart/`; `src/lib/orders/`.

---

## <a name="credit-01"></a>CREDIT-01 — Saldo Toko (Store Credit: refund ke saldo + pemakaian saat checkout)

### 1. Identitas dan tujuan

Modul: MOD-CREDIT (baru). Dipicu permintaan pengguna 2026-10-15: "gua tertarik sama refund ke saldo toko/store credit deh, buatin implementasinya" (dipilih alur lengkap: "Refund ke saldo + saldo bisa dipakai bayar"); keputusan berikutnya memilih **dokumentasi dulu, eksekusi menyusul setelah approval**. Tujuan: saat refund disetujui, admin bisa memilih mengembalikan dana ke **Saldo Toko** pembeli (tanpa transfer bank, tanpa biaya keluar); saldo lalu bisa dipotong waktu checkout pembelian berikutnya — pola umum web store Indonesia (pengembalian berupa saldo/voucher).

**Status: spek ditulis 2026-10-15, BELUM diimplementasikan** (pola "dokumen dulu", keputusan pengguna). Status berubah hanya setelah implementasi selesai dan bukti terisi di `docs/04`.

### 2. Prasyarat dan pemicu

- Akun **Customer login** — saldo melekat pada `User.id`; **guest checkout tidak punya saldo** (refund guest tetap jalur manual transfer seperti sekarang, ORDER-06).
- Refund manual ORDER-06 tetap berlaku; fitur ini **menambah satu opsi tujuan**, bukan menggantinya.
- Tabel baru + kolom `Order.creditUsed`; tanpa perubahan skema pembayaran Xendit.

### 3. Entitas terkait

- **Baru:** `StoreCreditTransaction { id, userId (index), amount Decimal(12,2) signed, type (enum CreditTxType: REFUND_IN | SPEND | ORDER_REVERSAL), orderId? , note?, createdAt }` — saldo = `SUM(amount)` per user (buku besar/ledger, bukan kolom saldo telanjang; setiap perubahan meninggalkan jejak audit).
- Diubah: `Order.creditUsed Decimal(12,2) @default(0)` — catatan berapa saldo dipakai di pesanan itu.
- Terkait: ORDER-06 (approve refund), ORDER-01/02 (checkout), PAY-01 (pembuatan pembayaran Xendit).

### 4. Input, validasi, kegagalan (data)

| Input | Validasi | Pesan |
| --- | --- | --- |
| Pilihan tujuan refund (admin) | literal `BANK_TRANSFER` \| `STORE_CREDIT`; default `BANK_TRANSFER` | "Pilih tujuan refund" |
| amount refund ke saldo | sama dengan jumlah refund, > 0, tidak melebihi refund | "Jumlah refund tidak valid" |
| Pakai saldo (customer, checkout) | angka 0..saldo tersedia, ≤ total belanja sebelum ongkir/voucher | "Saldo tidak mencukupi" |
| Race (dua checkout bersamaan) | `SELECT ... FOR UPDATE`/transaksi Prisma — saldo tidak boleh negatif | "Saldo tidak mencukupi", checkout ditolak |

### 5. Alur berhasil

| Langkah | Hasil |
| --- | --- |
| Admin approve refund dengan tujuan `STORE_CREDIT` | Baris `REFUND_IN` dibuat (amount = refund), saldo pembeli bertambah; **tombol "unggah bukti" gugur** — tidak ada transfer keluar, `proofUrl` boleh null |
| Customer checkout | Kotak "Gunakan Saldo Toko (Rp …)" (centang, default mati) tersedia bila saldo > 0 |
| Saldo dipakai | `creditUsed` tercatat di Order, baris `SPEND` dibuat (amount negatif), total yang dibayar via Xendit berkurang |
| Sisa > 0 | Invoice Xendit untuk sisa, alur PAY-01 sisa berjalan normal |
| Order dibatalkan setelah dibayar | Proporsi `creditUsed` dikembalikan otomatis lewat baris `ORDER_REVERSAL` (approve pembatalan), proporsi cash tetap jalur manual ORDER-06 |
| Customer lihat riwayat | Halaman ringkas: saldo sekarang + daftar transaksi (masuk/pakai/balik) |

### 6. Output dan perubahan data

- **Saldo berubah** hanya lewat tiga tipe baris ledger (REFUND_IN, SPEND, ORDER_REVERSAL) — tanpa mutasi langsung.
- `Order.creditUsed` terisi saat checkout memakai saldo.
- Email: opsional notifikasi "Saldo masuk Rp …" — diputus saat implementasi (ikuti preferensi CUST-02 bila ada).

### 7. Alur alternatif

- Guest checkout: opsi saldo tidak dirender sama sekali.
- Saldo 0: kotak pakai saldo tidak tampil.
- Saldo < total: dipakai sebagian (sisa dibayar Xendit); sisa pembayaran wajib > 0 kecuali keputusan bagian 13.
- Refund tujuan `BANK_TRANSFER`: perilaku persis ORDER-06 hari ini (bukti wajib).

### 8. Perilaku kegagalan

| Kondisi | Respons |
| --- | --- |
| Checkout bersamaan menguras saldo sama | Satu transaksi berhasil; satu ditolak "Saldo tidak mencukupi" (kunci baris saldo dalam transaksi) |
| Pembatalan order yang tidak pernah pakai saldo | `ORDER_REVERSAL` tidak dibuat (amount 0) |
| Refund `STORE_CREDIT` untuk guest | Opsi tidak tersedia; admin tetap `BANK_TRANSFER` |

### 9. Perilaku UI

- **Form refund admin (`AdminOrderActions`):** dua pilihan tujuan (radio): "Transfer Bank — wajib unggah bukti" (default, perilaku lama) dan "Saldo Toko — langsung masuk akun pembeli"; memilih Saldo Toko melepas kewajiban bukti, konfirmasi lewat `ConfirmDialog` (bagian 1B) "Dana akan masuk sebagai Saldo Toko pembeli?".
- **Checkout (`CheckoutForm`):** kotak/cakram "Gunakan Saldo Toko (Rp …)" + angka yang akan dipakai; subtotal/total ikut berkurang sebelum pembuatan invoice Xendit.
- **Halaman saldo customer** di `/profile` (atau `/profile/credit`): kartu saldo + tabel riwayat.
- Galat tetap pola 1A/`FormErrorAlert`.

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-CREDIT-01-01 | Refund disetujui ke Saldo Toko | Selesai | Saldo bertambah persis jumlah refund; baris `REFUND_IN` ada; tanpa upload bukti |
| AC-CREDIT-01-02 | Saldo Rp100.000, belanja Rp150.000 + ongkir | Centang pakai saldo | Total ke Xendit Rp50.000 + ongkir; `creditUsed = 100.000`; baris `SPEND` |
| AC-CREDIT-01-03 | Pesanan poin 02 dibatalkan admin | Approve pembatalan | Saldo kembali Rp100.000 (`ORDER_REVERSAL`); cash tetap manual |
| AC-CREDIT-01-04 | Guest di checkout | Buka /checkout | Tidak ada opsi saldo |
| AC-CREDIT-01-05 | Saldo 0 | Buka /checkout | Tidak ada opsi saldo |
| AC-CREDIT-01-06 | Dua tab checkout bersamaan pakai saldo penuh | Submit bersamaan | Tidak bisa minus; satu sukses satu ditolak |
| AC-CREDIT-01-07 | Customer | Buka /profile | Saldo + riwayat tampil benar |

### 11. Contoh data

| Skenario | Ledger | Hasil | Kriteria |
| --- | --- | --- | --- |
| Refund 75.000 | REFUND_IN +75.000 | Saldo 75.000 | AC-01 |
| Pakai 50.000 | SPEND -50.000 | Saldo 25.000 | AC-02 |
| Batal order pemakaian 50.000 | ORDER_REVERSAL +50.000 | Saldo 75.000 | AC-03 |

### 12. Batas fitur

- **Termasuk:** ledger saldo, refund ke saldo (customer login), pemakaian saat checkout, pengembalian otomatis saat pembatalan, riwayat.
- **Tidak termasuk:** top-up manual admin, kadaluarsa saldo, transfer antar pengguna, penarikan tunai/withdraw, expired promo, refund sebagian per item.
- **Ketergantungan:** ORDER-06, ORDER-01/02, PAY-01, aturan 1A/1B/1D.

### 13. Pertanyaan terbuka

- **Total nol setelah saldo:** pembelian lunas penuh saldo — pesanan langsung `PAID` tanpa invoice Xendit (rekomendasi KISS) atau tetap lewat invoice Rp0 (gak didukung Xendit, tidak disarankan)? Diputus implementasi, dicatat `docs/04`.
- Ongkir termasuk pemotongan saldo atau hanya subtotal produk? (rekomendasi: total semua biaya — ongkir+produk−voucher, asal ≥ 0).
- Nomor invoice/refund menampilkan pemakaian saldo sebagai baris tersendiri.
- Email notifikasi saldo masuk: ikut preferensi email mana (CUST-02) atau selalu dikirim?

**Rujukan kode (saat ini):** `prisma/schema.prisma` (Refund, Order); `src/components/admin/AdminOrderActions.tsx` (form refund); `src/app/(storefront)/checkout/page.tsx` + `CheckoutForm` (checkout); `src/lib/orders/mutations.ts` (approve refund + pembatalan); `src/lib/payments/xendit.ts` (pembuatan invoice).

---

## <a name="site-06"></a>SITE-06 — Mode Gelap (Dark Theme)

### 1. Identitas dan tujuan

Modul: MOD-CONFIG (lanjutan SITE-05). Dipicu permintaan pengguna 2026-10-15 saat redesign sidebar: "ada trigger untuk ganti theme juga (dummy dulu)". Trigger sudah terpasang di sidebar admin dan site-admin (`ThemeToggle`), tetapi berstatus placeholder: ikon Sun/Moon berputar dan preferensi ditulis ke cookie `flexstore_theme_preview`, sementara **warna tidak berubah apa pun** — `globals.css` belum punya palet varian `.dark`.

**Status: spek ditulis 2026-10-16, BELUM diimplementasikan** (pola "dokumen dulu"; penandaan diminta pengguna 2026-10-16: "ya tandain ke belum implementasi"). Status berubah menjadi "Terimplementasi" hanya setelah task implementasi selesai dan bukti terisi di `docs/04`.

### 2. Prasyarat dan pemicu

- `ThemeToggle` sudah ada dan wiring-nya disiapkan: komentar di `src/components/layout/ThemeToggle.tsx` menyatakan cukup menyetel class pada `<html>` begitu token dark tersedia.
- Cookie preferensi sudah ditulis (`flexstore_theme_preview`, max-age 1 tahun, SameSite=Lax). Cookie dipilih di atas localStorage (keputusan yang sama dengan sidebar ringkas) karena dibaca server pada request pertama sehingga tanpa flash tema.
- Pemicu saat ini: tombol "Tema" di sidebar admin dan site-admin.

### 3. Rancangan

- `globals.css` mendapat pasangan varian `.dark` (palet shadcn `dark` bawaan di atas token terang yang sudah ada).
- Class `dark` pada `<html>`: dibaca dari cookie `flexstore_theme_preview` saat render server (dengan `suppressHydrationWarning` pada `<html>`, praktik bawaan Next.js), lalu diperbarui oleh `ThemeToggle` lewat pengaturan class + penulisan cookie.
- Karena class menempel di `<html>`, tema berlaku **global**: storefront, admin, dan site-admin dalam satu sakelar.
- Tanpa perubahan API, skema, atau data.

### 4. Kriteria penerimaan (ringkas)

- Klik "Tema" -> seluruh halaman (storefront, admin, site-admin) berpindah ke palet gelap tanpa reload; muat ulang mempertahankan pilihan lewat cookie; kembali terang memulihkan palet semula.
- Tidak ada FOUC tema (server sudah mengirim class yang benar sejak HTML pertama).

### 5. Batas fitur

- Bukan personalisasi per halaman — satu preferensi global per peramban.
- Tidak mengubah warna brand (palet brand SITE-05 tetap terpisah dari terang/gelap).

### 6. Pertanyaan terbuka

- Posisi pemicu pembeli: cukup sidebar admin/site-admin saja, atau tombol juga di header storefront?
- Palet gelap: shadcn default atau diolah mengikuti warna brand (SITE-05)?
- Sebelum cookie ada, ikut sistem (`prefers-color-scheme`) atau default terang?

### 7. Berkas yang disentuh (perkiraan)

`src/app/globals.css`, `src/components/layout/ThemeToggle.tsx`, `src/app/layout.tsx` (baca cookie -> class `<html>`), `docs/03` bagian ini.

---

## <a name="site-07"></a>SITE-07 — Palet Warna Bawaan Tampil & Konsolidasi Token Warna

Modul: MOD-CONFIG (lanjutan SITE-05, PH-09). Ditulis 2026-10-17 atas permintaan pengguna: "harus ada langkah buat optimalin fungsi dari palet warna ini" dan warna default harus langsung tampil di form kustomisasi agar lebih jelas. **Status: Terimplementasi 2026-10-18 dan **Disetujui** (commit `671f941`: TASK-123 + TASK-124 + slot palet 19 + popover petunjuk berbahasa awam); pertanyaan terbuka #1 ditutup lima tahap - tahap 2..3: `warning`/`info` beserta foreground-nya jadi slot palet ke-16..19 (19 slot); tahap 4-5: revisi bawaan `warningColor` hingga pengguna memilih kuning terang `#FACC15` + varian tulisan otomatis `text-warning-strong` (color-mix); #2 (email) dan #3 (set gelap SITE-06) tetap terbuka. Bukti di `docs/04` bagian 17.4.**

## 1. Latar

- SITE-05 memetakan slot palet (`BrandSetting` `schema.prisma`, `String?`, format `#RRGGBB`) ke CSS variables lewat `brandCssVariables()` (`src/lib/brand/palette.ts`) yang disuntikkan `<html>` di `src/app/layout.tsx`. Sejak SITE-07 (revisi 2026-10-18, lihat bagian 4 catatan render): slot berjumlah **17** (15 slot SITE-05 + `warningColor`/`infoColor` dari keputusan lanjutan pengguna) dan `brandCssVariables()` selalu mengirim seluruhnya — slot terisi memakai kustomisasi admin, slot kosong memakai `DEFAULT_PALETTE` — sehingga warna bawaan benar-benar dirender, bukan lagi jatuh ke oklch `:root` `globals.css` (nilai oklch itu kini hanya fallback CSS bila JS layout gagal). Konsekuensi tercatat: `<html>` selalu memuat 17 inline style, dan kelak SITE-06 (mode gelap) harus memperhitungkan inline style ini karena menimpa aturan `.dark`.
- Latar 1 (form): `BrandSettingsForm` memakai fallback `values[field.key] || "#000000"` — slot kosong tampil hitam, bukan warna yang benar-benar berlaku. Admin tidak tahu nilai bawaan mana yang sedang dipakai untuk mengubahnya.
- Latar 2 (cakupan): banyak komponen memakai kelas Tailwind hardcode yang tidak lihat palet brand: `OrderStatusBadge`, badge status di daftar pesanan admin, `CancelOrderForm`, `GuestOrderNotice`, `WishlistButton` (hati `fill-red-500`), `CatalogFilterBar` (`hover:text-red-500`), `MaintenanceBanner`. Kustomisasi palet mengubah tombol/link via token, tetapi warna-warna tersebut tidak ikut.
- Latar 3 (token di luar palet): `card`, `popover`, `input`, `ring` sengaja tidak masuk slot palet (keputusan SITE-05).

## 2. Keputusan (pengguna, 2026-10-17)

| Butir | Keputusan |
| --- | --- |
| Sumber warna bawaan | **Konstanta kode** (`DEFAULT_PALETTE` di `src/lib/brand/palette.ts`, modul bebas Prisma/Next — aman diimpor Client Component). DB tidak disentuh; `BrandSetting` tetap menyimpan kustomisasi admin saja (null = pakai bawaan) |
| Warna bawaan | **Hijau tone dashboard** (`DASHBOARD_GREEN_DEFAULTS`, `src/lib/admin/dashboard-tokens.ts`) untuk slot yang tersedia; slot di luar itu memakai konversi hex dari oklch bawaan `globals.css` |
| Cakupan fase | TASK-123 + TASK-124 = fase PH-11 (`docs/04` bagian 17) |
| Sekali nilai bawaan tampil | Form memakai nilai bawaan sebagai fallback tampilan, simpan tetap null sampai admin mengubah. **Revisi 2026-10-18 (lanjutan pendapat pengguna: "default primarynya hijau? ... kenapa masih hitam seperti di awal? pas milih warna di palette dan di save baru warnanya berubah"):** bawaan kini juga **dirender** — `brandCssVariables()` menggugat slot kosong ke `DEFAULT_PALETTE` sehingga aplikasi tampil hijau tone dashboard sejak awal tanpa harus menyimpan apa pun; sebelumnya slot kosong jatuh ke oklch gelap `:root` sehingga "bawaan" form tidak sama dengan render. Keputusan konsisten dengan tujuan awal SITE-07 ("warna yang benar-benar berlaku") |

## 3. Konstanta `DEFAULT_PALETTE`

Satu sumber kebenaran di `src/lib/brand/palette.ts`. Nilai dari `DASHBOARD_GREEN_DEFAULTS` diambil langsung (primary, foreground/muted/border/accent); slot yang tidak ada di fallback itu memakai konversi OKLCH → sRGB hex dari nilai bawaan `globals.css` (secondary oklch 0.97/0.205, destructive oklch 0.577 0.245 27.325, success oklch 0.596 0.145 163.225).

| Slot | Nilai bawaan |
| --- | --- |
| `primaryColor` | `#36745B` |
| `primaryFg` | `#FFFFFF` |
| `secondaryColor` | `#F5F5F5` |
| `secondaryFg` | `#171717` |
| `accentColor` | `#EDF4EF` |
| `accentFg` | `#202725` |
| `backgroundColor` | `#FCFCFD` |
| `foregroundColor` | `#202725` |
| `mutedColor` | `#F3F4F4` |
| `mutedFg` | `#77807B` |
| `borderColor` | `#E7EAE8` |
| `destructiveColor` | `#E7000B` |
| `destructiveFg` | `#FFFFFF` |
| `successColor` | `#009966` |
| `successFg` | `#FFFFFF` |
| `warningColor` | `#FACC15` |
| `warningFg` | `#202725` |
| `infoColor` | `#1447E6` |
| `infoFg` | `#FFFFFF` |

Catatan (perbarui 2026-10-18, tiga tahap + dua revisi bawaan): slot berjumlah **19**; `warningColor`/`infoColor` ditambahkan sesuai keputusan pengguna (bagian 6 tahap 2, migrasi `20261017184206_brand_warning_info_slots`), lalu `warningFg`/`infoFg` menyusul dengan migrasi `20261018063829_brand_warning_info_fg_slots` (tahap 3: mengikuti pola pasangan warna+teks destructive/success). Revisi bawaan `warningColor` dua kali: `#BB4D00` (amber-700) dianggap "coklat", diganti `#A65F00` (yellow-700) dan tetap dinilai "masih coklat", akhirnya pengguna memilih **kuning terang `#FACC15`** (kandidat G halaman perbandingan visual; kontras sebagai teks hanya 1.49:1), sehingga teks badge/banner memakai varian gelap otomatis `--warning-strong` = `color-mix(in oklab, var(--warning) 65%, black)` (kontras ~4,8-5,5:1, mengikuti kustomisasi admin). Bawaan `warningFg` ikut `#FFFFFF` → `#202725` karena latar kuning terang (satu-satunya fg bawaan gelap; pemakai tunggal yang terlihat kuning terang tetap bintang rating `text-warning` di kartu produk). `card`, `popover`, `input`, `ring` tetap di luar palet (keputusan lama SITE-05). Konversi OKLCH → sRGB dihitung dengan rumus standar (inverse OKLab → LMS → linear sRGB → gamma). `#E7000B` sama dengan red-600 Tailwind v4; `#009966` adalah konversi hex dari success oklch bawaan; `#1447E6` konversi hex blue-700.

## 4. Perilaku form `/site-admin/brand`

**TASK-123.**

- Tampilan: slot kosong mencapai nilai bawaan — `values[field.key] || DEFAULT_PALETTE[field.key]` menggantikan fallback `#000000` sekarang.
- Simpan: semantik tidak berubah — slot yang tidak disentuh tetap tersimpan `""`/null = pakai bawaan; admin bisa mengubah dan menyimpan warna kustom dimana pun.
- "Atur Ulang Palet": saat ini mengosongkan semua slot; perilaku tidak berubah, hanya tampilan yang kembali menunjukkan warna bawaan (bukan lagi hitam).
- **Render (revisi 2026-10-18 atas pendapat pengguna):** slot kosong juga dikirim ke `<html>` dengan nilai `DEFAULT_PALETTE` lewat `brandCssVariables()` — aplikasi memakai warna bawaan hijau tone dashboard saat palet belum diatur, dan kustomisasi admin tetap menang bila ada. Efek samping tercatat: `<html>` selalu memuat 19 inline variabel (kelak memengaruhi rancangan SITE-06 mode gelap).
- **Popover petunjuk slot (tambahan pengguna 2026-10-18, "berikan juga popover di setiap palette warna biar user tau warna apa yang mereka ubah"):** setiap slot palet punya tombol ikon `Info` di samping label yang membuka popover dengan pola serupa popover "Ketentuan SKU" di `ProductForm` (komponen `ui/popover`, trigger ikon kecil `h-5 w-5`, konten `w-64 text-xs`): judul label slot, penjelasan "dipakai buat apa" dari `PALETTE_INFO` (`src/lib/brand/palette.ts`, sumber tunggal), dan pratinjau bawaan berupa swatch mini + nilai hex `DEFAULT_PALETTE`. Revisi atas pendapat pengguna: teks `PALETTE_INFO` ditulis dalam **bahasa awam** tanpa kode status/kolom database. Tanpa perubahan skema/DB; murni tampilan form.
- Modul `helpdesk` dan "ilustrasi warna"? tidak ada. **Perbarui dua tahap 2026-10-18:** (a) awal TASK-123 tidak ada perubahan skema; (b) lanjutan keputusan pengguna → ada migrasi additive `20261017184206_brand_warning_info_slots` (`warningColor`/`infoColor`), tanpa perubahan kolom lama. Bukti: uji UI + `tsc`/`lint` + uji Zod/DB roundtrip (bagian 10 `docs/04`).

## 5. Konsolidasi warna hardcode ke token (TASK-124)

Seluruh komponen pemberit warna status/info/peringatan agar mengikuti token CSS variables:

| Berkas | Warna saat ini hardcode | Token |
| --- | --- | --- |
| `src/components/orders/OrderStatusBadge.tsx` | `bg-amber-100`, `bg-blue-100`, `bg-green-100`, `bg-red-100`, separator lainnya per status | `destructive` = merah, `success` = hijau, status netral = `muted`; warna kuning/biru menunggu keputusan terbuka #1 |
| Badge status di daftar pesanan admin | Mengikuti `OrderStatusBadge` | Sama |
| `src/components/orders/CancelOrderForm.tsx` | `bg-red-50 text-red-700 border-red-200` | `destructive/10 text-destructive border-destructive/20` |
| `src/components/orders/GuestOrderNotice.tsx` | `bg-amber-50 text-amber-950 border-amber-200` | Menunggu keputusan #1 |
| `src/components/products/WishlistButton.tsx` | `fill-red-500 text-red-500` | `fill-destructive text-destructive` |
| `src/components/products/CatalogFilterBar.tsx` | `hover:text-red-500` | `hover:text-destructive` |
| `src/components/layout/MaintenanceBanner.tsx` | `bg-amber-50 border-amber-300` | Menunggu keputusan #1 |
| Kotak teks lain kuning/biru | Inventarisasi saat eksekusi (`grep` `bg-amber-*`, `bg-blue-*`, `bg-green-*`, `bg-red-*`, `text-amber-*`, dst. di `src/`) | Mengikuti tabel token |

Aturan: 1 kelas `*-{warna}-{100..950}` mengikuti token yang semantically closest: merah = `destructive`, hijau = `success`, hitam/abu-abu = `muted`/`fg`, kuning/biru = token `warning`/`info` (keputusan #1 lima tahap; tahap 2..3 menjadikannya slot palet ke-16..19 lengkap dengan pasangan foreground, bisa dikustom Site Admin; tahap 4-5 merevisi bawaan warning hingga `#FACC15`, dengan tulisan memakai varian gelap otomatis `text-warning-strong`).

**Realisasi TASK-124 (2026-10-18)** — hasil `grep` inventarisasi penuh menemukan dua file di luar tabel atas (ditandai "Kotak teks lain"): tombol Pelacakan biru di `src/app/(storefront)/orders/[id]/page.tsx` → `info/10 text-info border-info/20 hover:bg-info/20`, dan bintang rating `text-amber-500` di `ProductCard` → `text-warning`. Peta final `OrderStatusBadge`: `WAITING_PAYMENT` + `CANCEL_REQUESTED` → `warning` (oranye ikut kuning — "menunggu tindakan"), `PROCESSING` + `SHIPPED` → `info` (indigo ikut biru), `COMPLETED` → `success`, `CANCELED` → `destructive`. `GuestOrderNotice`: teks prosa `text-foreground`, aksen `border-warning/20 bg-warning/10 text-warning`; sub-kartu salinan `bg-card/70` (ganti `bg-white/70`). `MaintenanceBanner` → `border-warning/20 bg-warning/10 text-warning`. `CancelOrderForm` + hover versi (tint 10/20). Lukisan `email` (`src/emails/*`) tetap hardcode — pertanyaan #2 masih terbuka. Ruang `dashboard-v2` (prototipe ADMIN-DASH-01, belum di-commit) tidak tersentuh — scope PH-12.

## 6. Pertanyaan terbuka

1. Warna kuning/biru (status `WAITING_PAYMENT` kuning, `PROCESSING` biru, `SHIPPED` biru) — token cukup memakai `secondary`/`muted`, atau kasih slot `warning`/`info` baru di palet? **Ditutup 2026-10-18 dua tahap.**
   - **Tahap 1 (keputusan pengguna, opsi "Token CSS warning+info"):** token `--warning` (oklch 0.555 0.163 48.998 = amber-700) + `--info` (oklch 0.488 0.243 264.376 = blue-700) beserta `-foreground` putih di `globals.css`; pola pemakaian tint `bg-{token}/10` + `border-{token}/20` + `text-{token}`.
   - **Tahap 2 (keputusan pengguna, "kalo untuk warna success atau danger biasanya bisa dikustom maka dua itu harusnya bisa juga"):** keduanya diangkat menjadi slot palet — kolom `warningColor`/`infoColor` di `BrandSetting` (migrasi `20261017184206_brand_warning_info_slots`), slot ke-16/17 (`PALETTE_FIELDS` label "Warning"/"Info"), nilai bawaan `DEFAULT_PALETTE` = konversi hex oklch yang sama (`#BB4D00`, `#1447E6`; konversi tervalidasi dengan reproduksi `#E7000B`/`#009966`). Zod `optionalHex` untuk keduanya; Site Admin kini bisa kustom warning/info dari form. Awalnya `warningFg`/`infoFg` dianggap belum perlu (fg `--*-foreground` tetap putih dari `globals.css`, belum ada pemakai solid).
   - **Tahap 3 (revisi pengguna, "success dan destructive punya warna untuk text, harusnya warning dan info juga"):** `warningFg`/`infoFg` juga diangkat menjadi slot (slot ke-18/19, migrasi `20261018063829_brand_warning_info_fg_slots`), sehingga palet 19 slot dengan pasangan warna+teks lengkap mengikuti pola destructive/success. Bawaan fg keduanya `#FFFFFF` (pemakaian solid `bg-warning`/`bg-info`); pemakaian tint tetap memakai token warna itu sendiri sebagai teks.
   - **Tahap 4 (revisi pengguna, "warna default untuk warning sepertinya kurang terasa kuning, lebih ke coklat"):** bawaan `warningColor` diubah dari `#BB4D00` (amber-700, hue oranye) ke `#A65F00` (yellow-700 Tailwind v4, `oklch(0.554 0.135 66.442)`) — kulit kuning emas, bukan brown. Tanpa migrasi (ini perubahan nilai bawaan di `DEFAULT_PALETTE` + token `--warning` `globals.css`, bukan skema). Kandidat yang lebih terang (yellow-600 `#D18700`) ditolak karena kontras teks hanya 2.87:1 di latar terang dan 2.94:1 dengan fg putih.
   - **Tahap 5 (revisi lanjutan, "kuning #A65F00 masih terlalu coklat" → pengguna memilih kandidat G "#FACC15 kuning paling terang" dari halaman perbandingan visual yang ditunjukkan):** bawaan `warningColor` = `#FACC15`, token `--warning` = `oklch(0.8606 0.1731 91.94)` (= hex itu). Konsekuensi: sebagai teks kontrasnya hanya 1.49:1, sehingga dipakai tekstual memakai varian gelap otomatis **`--warning-strong` = `color-mix(in oklab, var(--warning) 65%, black)`** (kelas `text-warning-strong`) — mengikuti kustomisasi admin, jadi warna slot apa pun tetap menghasilkan teks terbaca. Komponen teks warning dipindah ke `text-warning-strong` (`OrderStatusBadge`, `MaintenanceBanner`, `GuestOrderNotice`); satu-satunya pemakai warna terang yang tersisa adalah bintang rating (`text-warning` di `ProductCard`, sengaja). Bawaan `warningFg` diubah `#FFFFFF` → `#202725` (teks di atas latar kuning sangat terang; satu-satunya fg bawaan gelap). Tanpa migrasi.
   - **Popover berbahasa awam (revisi atas "status pada popover juga pakai bahasa user awam jangan penulisan untuk developer"):** teks `PALETTE_INFO` ditulis ulang tanpa kode status/kolom database (`WAITING_PAYMENT` dsb. diganti "pesanan yang masih menunggu", dst.).
2. Email (`src/emails/*`, warna hex inline) mengikuti palet web? CATATAN: email client tidak membaca CSS variables root page — alternatifnya hanya inline style yang dibentuk dari data palet DB di server saat mengirim email. Belum diputuskan.
3. Set warna bawaan kedua untuk mode gelap (SITE-06) didesain sekaligus di TASK-123 atau menyusul SITE-06?

## 7. AC (draf, final saat implementasi)

| AC | Aksi | Skenario | Hasil yang diharapkan |
| --- | --- | --- | --- |
| AC-SITE-07-01 | Buka `/site-admin/brand`, palet belum diatur | Site Admin | Slot palet tampil warna bawaan tabel bagian 3 (19 slot pasca-tahap 3; bukan hitam `#000000`) |
| AC-SITE-07-02 | Ubah `primaryColor` ke `#B91C1C` lalu simpan | Buka storefront + `/admin` | Tombol/link merah (AC-SITE-05-02 tetap); slot lain masih bawaan |
| AC-SITE-07-03 | Tekan "Atur Ulang Palet" lalu simpan | Buka form | Slot tampil warna bawaan; `BrandSetting` kolom palet kembali `null` |
| AC-SITE-07-04 | TASK-124 selesai, ubah `primaryColor` | Buka halaman storefront + admin | Badge status, banner maintenance, notifikasi guest, hati favorit, tombol batal mengikuti warna token (`destructive`/`success`/`muted`) |
| AC-SITE-07-05 | `grep` hardcode warna pasca-TASK-124 | Cari `bg-(amber|blue|green|red)-` di `src/` | Tidak ada di komponen yang telah dikonsolidasi (kecuali alasan yang didokumenkan) |

## 8. TASK

| ID | Isi | Spek |
| --- | --- | --- |
| TASK-123 | `DEFAULT_PALETTE` + perilaku tampilan/simpan/reset form brand | bagian 2, 3, 4 |
| TASK-124 | Konsolidasi komponen hardcode ke token | bagian 5 |

## <a name="wish-01"></a>WISH-01 — Favorit Produk (wishlist versi penuh)

### 1. Identitas dan tujuan

Modul: MOD-CUST. Dipicu permintaan pengguna 2026-10-16: "tambahin fitur dummy whishlist/favorite, tambahini icon love aja di kanan atas tiap card produk", dilanjutkan "maksud gue cukup sampai UI nya aja dulu" — jadi **versi dummy sudah terpasang**, versi penuh belum. PRD mencoret Wishlist dari cakupan MVP (`docs/01`, "Luar cakupan MVP: Wishlist"), sehingga versi penuh berada di antrean pasca-MVP.

**Status: spek ditulis 2026-10-16, BELUM diimplementasikan** (pola "dokumen dulu"; penandaan diminta pengguna 2026-10-16: "ya tandain ke belum implementasi"). Status berubah menjadi "Terimplementasi" hanya setelah task implementasi selesai dan bukti terisi di `docs/04`.

### 2. Kondisi sekarang (dummy — sudah terimplementasi)

- Ikon hati di kanan atas `ProductCard` (`src/components/products/WishlistButton.tsx`): klik toggle outline <-> merah, `aria-pressed`, `aria-label` "Tambah <produk> ke favorit" / "Hapus <produk> dari favorit".
- Status disimpan di localStorage kunci `flexstore_wishlist` (daftar productId) dan dibaca lewat `useSyncExternalStore` — tanpa API, tanpa tabel, tanpa migrasi. Sifatnya per peramban: tidak sinkron antar perangkat dan hilang bila data situs dibersihkan. Bukti implementasi: `docs/04` bagian 10, baris "Favorit dummy".

### 3. Rancangan versi penuh (belum diimplementasikan)

- Tabel `WishlistItem` (`userId`, `productId`, `createdAt`; unique `(userId, productId)`) + migrasi additive — tidak menyentuh `ProductVariant`/`OrderItem`/keranjang.
- API: `POST /api/wishlist` (toggle) dan `GET /api/wishlist` (daftar), divalidasi Zod (`productId` wajib) di atas gerbang sesi ala `getCartAccess` (A01/A03, tanpa raw SQL).
- Halaman daftar favorit di area akun (`/profile/favorit` atau tab tambahan di profil); ikon hati di kartu/detail kini membaca status dari server untuk customer.
- Setelah login, riwayat favorit tamu digabung ke akun mengikuti pola CART-04 (merge keranjang) — bila pertanyaan terbuka pertama dijawab ya.

### 4. Kriteria penerimaan (ringkas)

- Customer menekan hati di dua perangkat berbeda -> keduanya menampilkan status sama setelah muat ulang.
- Daftar favorit menampilkan produk yang ditandai; batal dari halaman daftar -> hati di katalog ikut kosong.
- Tamu tetap bisa menandai (localStorage) tanpa galat.

### 5. Pertanyaan terbuka

- Tamu: localStorage dipertahankan lalu digabung saat login (pola CART-04), atau favorit khusus akun login saja?
- Perlu badge jumlah favorit di header (bersanding dengan badge keranjang)?
- Produk non-ACTIF/dihapus dari daftar favorit: disembunyikan otomatis atau ditandai?

### 6. Ketergantungan

AUTH (sesi customer), PROD-02/PROD-03 (kartu dan detail tempat hati dipasang), CART-04 bila merging tamu dipilih.

---

**Status:** Spesifikasi Fitur v2.4 - PH-07, PH-08 (SITE-00..SITE-04), dan PH-09 (SITE-05) terimplementasi dan **Disetujui** (2026-10-11); CUST-03 + NOTIF-02 (Phase 10) **terimplementasi dan Disetujui** (2026-10-11, pengguna: "approve" - bukti `docs/04` bagian 15.5) beserta revisi UI CUST-01/CUST-02. Bagian 1A (aturan karakter input semua field, v2.1) terimplementasi di commit `40dcb41`. Indeks dan bagian status diselaraskan dengan kode pada 2026-10-11 (PH-08 commit `f01a6d2`, PH-09 commit `1da2b3a`). Ditambah 2026-10-15: CART-05 (dialog pemilihan varian dari kartu produk + stok efektif TASK-114) - **Terimplementasi** (spesifikasi ditulis lalu dikerjakan di hari yang sama; bukti `docs/04` bagian 16.4; keputusan di bagian 10 dan 16). Ditambah 2026-10-15: 17 spesifikasi rinci (AUTH-02/03, PROD-03/04/05, VOUCH-01/02, NOTIF-01, INV-01, SHIP-02/03, ORDER-05..08, REPORT-01, CONFIG-01) ditulis retroaktif dari kode terimplementasi - utang dokumentasi bagian rinci di catatan indeks bagian 1 tuntas. Ditambah 2026-10-15 malam: PROD-07 (seksi editorial VideoHero/ProductStory/Lookbook) ditulis baru dan PROD-06 mendapat status tambahan (bagan ukuran bergaya tautan + dialog di kanan bawah tombol beli); PROD-06 beserta status tambahannya **terimplementasi 2026-10-15** (bukti `docs/04` bagian 16), PROD-07 **terimplementasi 2026-10-15** (bukti `docs/04` bagian 10). Ditambahkan ADMIN-DASH-01 (modernisasi dashboard Store Admin), status belum diimplementasikan. PROD-08 (role `INFO` pengganti `SIZE_CHART` + label kustom default "Informasi Tambahan") ditulis, status belum diimplementasikan. CREDIT-01 (Saldo Toko: refund ke saldo + pemakaian saat checkout) ditulis, status belum diimplementasikan, menunggu approval pengguna. Ditambah 2026-10-16: SITE-06 (Mode Gelap, lanjutan trigger tema placeholder) dan WISH-01 (Favorit Produk versi penuh, dummy UI sudah ada) ditulis dengan status belum diimplementasikan; indeks PROD-08 dan badan PROD-06 dikoreksi karena statusnya basi. Ditambah 2026-10-18: SITE-07 **terimplementasi** (TASK-123 + TASK-124; bukti `docs/04` bagian 17.4; pertanyaan terbuka #1 ditutup lima tahap — tahap slot-nya `warning`/`info` beserta foreground-nya menjadi slot palet ke-16..19, migrasi `20261017184206_brand_warning_info_slots` + `20261018063829_brand_warning_info_fg_slots`, palet 19 slot; tahap lainnya merevisi bawaan `warningColor` sampai pengguna memilih kuning terang `#FACC15` (riwayat: amber-700 → yellow-700 → FACC15) dengan tulisan badge otomatis digelapkan `text-warning-strong`).

**Next steps:**
1. (Selesai 2026-10-15) Tulis bagian rinci 17 fitur yang belum berspesifikasi (utang dokumentasi) ΓÇö blok rinci AUTH-02/03, PROD-03/04/05, VOUCH-01/02, NOTIF-01, INV-01, SHIP-02/03, ORDER-05..08, REPORT-01, CONFIG-01 kini ada di dokumen ini
2. (Selesai 2026-10-11) Tautkan bukti implementasi SITE-05 - PH-09 terimplementasi & disetujui (`docs/04` bagian 14.5)
3. (Selesai 2026-10-11) Tautkan bukti implementasi CUST-03, NOTIF-02, dan revisi UI CUST-01/CUST-02 - PH-10 terimplementasi & disetujui (`docs/04` bagian 15.5)
4. Jaga indeks fitur tetap sinkron setiap fase selesai (pola penyelarasan 2026-10-11)
5. (Selesai 2026-10-15) Tulis + implementasikan CART-05 ΓÇö dialog pemilihan varian dari kartu produk
6. (Selesai 2026-10-15) TASK-114 ΓÇö stok efektif di kartu; tombol "Keranjang" pada keadaan semua stok sudah di keranjang mengarah ke halaman keranjang dengan highlight baris item (keputusan pengguna)
