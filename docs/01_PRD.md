# Product Requirements Document (PRD)
# FlexStore — E-Commerce Platform

**Versi:** 1.5 (Finalized)  
**Tanggal:** 8 Oktober 2026  
**Status:** Finalized — Siap untuk SDD

**Revisi 1.1 (10 Oktober 2026):** model role = 4 (Guest, Customer, Store Admin, Site Admin): bagian 2.4 Site Admin ditambah; baris "3 role utama" (bagian 2) dan "no Site Admin role" (bagian 2.3) dicabut karena bertentangan dengan bagian 1, 3.1.K, 4.1, 4.12, dan kriteria sukses #10. Keputusan tercatat di `docs/04` bagian 10.

**Revisi 1.2 (11 Oktober 2026):** kustomisasi brand (logo, warna, banner) dipindah dari Store Admin (bagian 2.3) ke Site Admin (bagian 2.4) — 1 deployment = 1 brand store, jadi identitas brand adalah urusan deployment, bukan operasional toko. Cakupan theme customization diperluas: favicon, tagline, teks footer, palet warna (input kode heksadesimal), banner homepage lengkap (gambar + judul + teks + tombol). Keputusan tercatat di `docs/04` bagian 10 dan 14.2; spek di `docs/03` SITE-05. Pada tanggal yang sama centang "Variant images" di bagian 3.1.A dan 7.4 dicabut menjadi belum selesai — input gambar varian belum ada di form admin (keputusan `docs/04` bagian 10).

**Revisi 1.3 (11 Oktober 2026):** pusat notifikasi in-app ditambahkan ke bagian 3.1.I, 4.8, 4.9, dan 7.7 — ikon lonceng di navbar membuka dialog berisi daftar notifikasi (diturunkan dari data pesanan, tanpa tabel baru) dan pengaturan preferensi email; badge menandai notifikasi yang belum dilihat. Halaman alamat tersimpan dipisahkan agar fokus pada alamat (`/profile/addresses`), sedangkan `/profile` menjadi halaman akun mandiri (profil saja). Pada tanggal yang sama akses invoice dibatasi hanya untuk pesanan yang sudah lunas — tombol dan halaman invoice tidak tersedia untuk pesanan yang belum dibayar maupun yang dibatalkan sebelum bayar. Keputusan tercatat di `docs/04` bagian 10 dan 15; spek di `docs/03` CUST-01, CUST-02, CUST-03, dan NOTIF-02. Implementasi dijadwalkan pada fase **PH-10**.

**Revisi 1.4 (11 Oktober 2026):** perubahan email customer wajib verifikasi ulang. Saat customer mengganti email di `/profile`, sistem mengirim tautan verifikasi sekali pakai ke email baru, dan `User.email` baru berubah setelah tautan itu dibuka; email lama tetap aktif sampai verifikasi selesai, dan permintaan baru membatalkan tautan sebelumnya. Keputusan tercatat di `docs/04` bagian 10 dan 15; spek di `docs/03` CUST-03. Implementasi dijadwalkan pada fase **PH-10**.

**Revisi 1.5 (11 Oktober 2026):** centang "Variant images" di bagian 3.1.A dan 7.4 dipulihkan. Input unggah gambar per varian kini ada di form admin produk (satu berkas opsional per baris varian, memakai endpoint Uploadthing `productImage` yang sama dengan galeri), dikerjakan sebagai revisi pasca-persetujuan PH-01. Spek diperbarui di `docs/03` PROD-01; keputusan tercatat di `docs/04` bagian 4.8 dan 10.

---

## 1. Tujuan Produk

FlexStore adalah **platform e-commerce single-store yang bersifat generic dan customizable** untuk berbagai brand dan jenis produk.

### Tujuan Utama:
- Menyediakan sistem toko online yang dapat disesuaikan untuk berbagai jenis bisnis retail
- Memisahkan tanggung jawab level sistem (Site Admin) dan level operasional toko (Store Admin)
- Menyediakan alur transaksi yang aman dengan integrasi payment gateway
- Mencegah overselling melalui sistem stock reservation
- Memberikan fleksibilitas voucher/promosi yang dapat dikonfigurasi
- Mendukung checkout untuk guest (dengan verifikasi HP) dan customer terdaftar

### Prinsip Desain:
- **Generic**: Tidak mengunci domain produk tertentu (bukan khusus sepeda, fashion, atau produk spesifik lainnya)
- **Customizable**: Brand dapat menyesuaikan informasi toko dan karakteristik produk
- **Single-store per deployment**: Satu deployment = satu toko/brand
- **Seller-oriented**: Mekanisme discount dan voucher dirancang untuk tetap menguntungkan penjual

---

## 2. Pengguna dan Role

Sistem memiliki **4 role** (single-store MVP):

### 2.1 Guest / Visitor
**Akses:**
- Melihat katalog produk
- Melihat detail produk dan variant
- Search dan filter produk
- Menambahkan produk ke cart
- **Checkout dengan verifikasi nomor HP** (email opsional)
- Tracking order melalui halaman publik (input nomor order + nomor HP)

**Karakteristik:**
- Tidak perlu registrasi untuk browsing dan checkout
- Wajib verifikasi nomor HP saat checkout (mencegah spam dan overselling)
- Jika mengisi email → dapat order confirmation dan link untuk set password (create account)
- Jika tidak mengisi email → tidak ada opsi create account otomatis

### 2.2 Customer / Buyer
**Akses:** Semua akses Guest +
- Order history
- Address management (maksimal 5 alamat)
- Download invoice PDF
- Re-order (tambahkan produk dari order lama ke cart)
- Track shipping status
- Mengajukan pembatalan pesanan
- Tracking order tanpa input data (langsung list order mereka)

**Karakteristik:**
- Harus login untuk akses fitur customer
- Dapat dibuat otomatis dari guest checkout jika guest mengisi email (dapat link set password)
- Dapat registrasi manual

### 2.3 Store Admin
**Tanggung jawab (operasional toko):**
- **Product Management:** Mengelola produk, kategori, brand, variant, harga, stok, images
- **Order Management:** Melihat dan manage orders, approve/reject cancellation (wajib beri alasan jika menolak)
- **Payment Management:** Melihat payment status, memproses refund manual (wajib upload bukti refund)
- **Voucher Management:** CRUD voucher/promosi, stacking rules, usage limits
- **Shipping Management:** Melihat shipping status (tracking dihandle oleh provider API)
- **Reporting:** Sales report, product performance, stock report, order/refund reports
- **Store Configuration:** Store info (alamat, kontak, kebijakan) — nama tampilan toko memakai brand (bagian 2.4), cancellation templates — identitas brand (logo, banner, warna) diatur **Site Admin**, lihat bagian 2.4

**Karakteristik:**
- Full admin access ke `/admin/*` routes
- Tidak ada multi-store management (single-store MVP)
- **NO** payment gateway selection (Xendit fixed)
- **NO** shipping provider selection (RajaOngkir/Biteship fixed)
- **NO** platform-level config di area Store Admin — konfigurasi platform dikelola **Site Admin** (bagian 2.4)

### 2.4 Site Admin

**Tanggung jawab (konfigurasi platform):**
- **Platform Settings:** Pengaturan level sistem
- **Payment Gateway Configuration:** Konfigurasi Xendit
- **Shipping Provider Configuration:** Konfigurasi RajaOngkir/Biteship
- **User Management:** Mengelola akun Store Admin (buat, nonaktifkan, reset password)
- **Brand Customization:** Identitas brand per deployment — nama brand, logo, favicon, tagline, palet warna (kode heksadesimal), teks footer, banner homepage (lihat `docs/03` SITE-05)

**Karakteristik:**
- Akses ke area konfigurasi platform, **terpisah** dari area operasional toko (`/admin/*` milik Store Admin)
- Tidak mengelola operasional toko (produk, pesanan, voucher, laporan) — itu tanggung jawab Store Admin (bagian 2.3)
- Tidak ada multi-store management (single-store MVP)

**Catatan:** Walaupun satu deployment = satu store, pemisahan role ini tetap ada untuk:
- Separation of concern antara konfigurasi sistem vs operasional toko
- Extensibility jika di masa depan ada rencana multi-store

---

## 3. Scope

### 3.1 Yang Termasuk Scope (MVP)

#### A. Catalog & Product Management
- ✅ Produk dengan data: nama, slug, deskripsi, gambar, harga, status, kategori, brand, SKU, stok
- ✅ Product variant (generic: tidak terkunci ke atribut produk tertentu)
- ✅ Kategori produk
- ✅ Brand
- ✅ Product status: Active, Inactive, Draft, Out of Stock, Discontinued
- ✅ Product search dan filter (by name, category, price range, sort)
- ✅ **Product images:** 1 gambar utama (wajib) + 3 gambar tambahan (opsional) = maksimal 4 gambar per produk
- ✅ **Variant images:** Setiap variant bisa punya 1 gambar sendiri; unggah/pilih gambar tersedia di form admin produk dan tampil di keranjang (revisi 1.5)
- ✅ **Size chart / Additional info image:** 1 gambar opsional untuk size chart, spec sheet, nutrition facts, dll
- ✅ **Stock:** Dual tracking
  - Stock per variant (individual tracking per variant)
  - Total stock produk (otomatis sum dari semua variant)

#### B. Shopping Cart
- ✅ Tambah/ubah/hapus item
- ✅ Validasi stok (client-side dan server-side)
- ✅ Validasi harga (server-side)
- ✅ Subtotal calculation

#### C. Checkout & Order
- ✅ Guest checkout (wajib verifikasi nomor HP, email opsional)
- ✅ Customer checkout (harus login)
- ✅ Address management untuk customer (maksimal 5 alamat)
- ✅ Create order
- ✅ Order status: Waiting Payment, Processing, Shipped, Completed, Canceled
- ✅ Stock reservation saat order dibuat
- ✅ Stock release jika payment gagal/expired
- ✅ Stock deduction jika payment berhasil

#### D. Payment
- ✅ Integrasi payment gateway: **Xendit**
- ✅ Payment methods (MVP):
  - **QRIS** (prioritas utama, 0.7%)
  - Virtual Account (Rp4.000 flat per transaksi)
  - E-Wallet: OVO, Dana, LinkAja, ShopeePay (2%)
  - International card (fase berikutnya, 2.9% + Rp2.000)
- ✅ Payment status (terpisah dari order status): Waiting, Paid, Failed, Canceled, Expired
- ✅ Webhook verification dari payment gateway
- ✅ Idempotency untuk mencegah double processing

#### E. Voucher & Promotion
- ✅ Voucher configurable:
  - Produk eligible dan produk yang dikecualikan
  - Kategori (jika diperlukan)
  - Minimum transaksi
  - Periode berlaku
  - Usage limit (kuota total)
  - Batas pemakaian per nomor HP terverifikasi
  - Maksimal potongan (untuk voucher persentase)
- ✅ Voucher stacking compatibility:
  - Kombinasi voucher yang kompatibel
  - Kombinasi voucher yang tidak kompatibel
  - **Maksimum 2 voucher per transaksi**
- ✅ Jenis voucher:
  - Persentase
  - Nominal rupiah
  - Ongkir (menghitung biaya pengiriman secara terpisah)
- ✅ Kalkulasi voucher bertahap (seller-oriented):
  - Voucher persentase dihitung bertahap dari harga sisa
  - Campuran persentase + nominal: nominal dulu, baru persentase
  - Urutan perhitungan konsisten walaupun pembeli input voucher dalam urutan berbeda

#### F. Shipping
- ✅ **Real-time shipping integration** via aggregator (RajaOngkir/Biteship/ShipperID)
- ✅ Automatic shipping cost calculation via API (JNE, SiCepat, J&T, dll)
- ✅ Customer pilih service (REG/YES/OKE/dll) sesuai budget
- ✅ Error handling:
  - Timeout handling (10 detik)
  - Fallback ke flat rate temporary jika API error
  - Retry mechanism
  - Cache hasil API (5-10 menit) untuk alamat yang sama
- ✅ Pickup (jika toko mengaktifkannya)
- ✅ Shipping tracking (jika provider support)

#### G. Cancellation & Refund
- ✅ Pembatalan hanya seluruh pesanan (bukan sebagian produk)
- ✅ Pembatalan hanya bisa dilakukan selama pesanan belum diproses/dikirim
- ✅ Alur pembatalan:
  1. Pembeli mengajukan pembatalan lewat website
  2. Store Admin meninjau
  3. Store Admin menyetujui/menolak (wajib beri alasan jika menolak)
- ✅ Template alasan penolakan:
  - Disediakan oleh sistem
  - Store Admin bisa mengelola (tambah, ubah, nonaktifkan)
  - Admin bisa pilih template atau isi manual
- ✅ Refund setelah pembatalan disetujui:
  - Sistem coba refund otomatis lewat payment gateway (jika didukung)
  - Jika tidak didukung → refund manual oleh Store Admin
- ✅ Refund manual:
  - Store Admin yang melakukan
  - **Wajib upload bukti refund** (screenshot/bukti transfer)
  - Bukti tersimpan di riwayat refund

#### H. Order Tracking
- ✅ Halaman "Track Order" publik:
  - Guest: input nomor order + nomor HP untuk verifikasi
  - Customer: login langsung list order mereka (tanpa input data)
- ✅ Email notification berisi link ke halaman track order
- ✅ Customer bisa track shipping status (jika provider support)

#### I. Invoice & Notification
- ✅ Invoice yang bisa dilihat/dicetak/download PDF — hanya untuk pesanan yang sudah lunas (revisi 1.3)
- ✅ **Email notification:**
  - Order created (order confirmation)
  - Payment successful
  - Order shipped (dengan tracking link)
  - Set password link (untuk guest yang isi email)
  - Cancellation approved/rejected
  - Refund completed (jika approved)
- ✅ **Notifikasi in-app (revisi 1.3):** ikon lonceng di navbar membuka dialog berisi daftar notifikasi pesanan (turunan data pesanan) + pengaturan preferensi email, dengan penanda belum dibaca
- ✅ **OTP verification:** Twilio Verify, kanal **SMS**
  - SMS OTP (dev: Trial gratis — 40 verifikasi; production ~Rp450-600 per SMS)
  - Start dengan Twilio Verify di akun Trial untuk development
  - Upgrade ke production setelah deploy
  - Detail setup: `docs/06_SETUP_KREDENSIAL.md` bagian 4

#### J. Store Customization
- ✅ **Store information display:**
  - Nama (dikelola sebagai brand di bagian 2.4, Site Admin — Store Admin tidak punya field nama terpisah)
  - Alamat
  - Nomor telepon
  - Email
  - About us / Store description
  - Return policy
  - Warranty policy
  - Informasi pickup
  - Social media links (Instagram, Facebook, WhatsApp)
- ✅ **Theme customization (MVP)** — diatur **Site Admin** (bagian 2.4, revisi 1.2):
  - Nama brand + tagline
  - Logo upload + favicon
  - Palet warna (9 grup inti, input kode heksadesimal; berlaku seluruh aplikasi)
  - Teks footer
  - Banner/hero image di homepage (gambar + judul + teks + tombol + sakelar aktif)

#### K. Admin & Reporting
- ✅ **Admin panel framework:** shadcn/ui (React + Tailwind, modern component library)
- ✅ **Store Admin features:**
  - Dashboard
  - Order management
  - Product management
  - Category management
  - Variant management
  - Stock management
  - Voucher/promotion management
  - Payment/order management
  - Shipping management
  - Refund/cancellation management
  - Template alasan penolakan pembatalan
  - Store settings (info toko, theme customization)
  - Sales report (transaksi berhasil, nilai penjualan, produk terjual, stok)
- ✅ **Site Admin features:**
  - Platform configuration
  - Payment gateway configuration (Xendit)
  - Shipping provider configuration
  - User management (Store Admin)
  - Platform settings

### 3.2 Yang Tidak Termasuk Scope (MVP)

❌ Review produk  
❌ Wishlist  
❌ Return policy workflow (beyond info teks)  
❌ Multi-currency  
❌ Multi-language  
❌ Live chat  
❌ Product bundling  
❌ Loyalty program  
❌ Affiliate system  
❌ Marketing automation  
❌ Analytics dashboard advanced  
❌ Mobile app  

### 3.3 Future Enhancements (Post-MVP)

**Phase 2+:**
- International payment (Xendit international card, atau Stripe integration)
- Review produk & rating
- Wishlist
- Advanced theme customization (font selection, custom CSS)
- Product bundling
- Loyalty program
- Multi-language support
- Advanced analytics dashboard
- Mobile app

**Deployment considerations (akan ditentukan di SDD):**
- Hosting environment
- CI/CD pipeline
- Database scaling strategy
- CDN untuk product images

---

## 4. Modul Utama

Gambaran modul tanpa detail teknis (detail teknis masuk SDD):

### 4.1 Authentication & Authorization
- Guest access
- Customer registration dan login
- Admin authentication
- Role-based access control (Guest, Customer, Store Admin, Site Admin)
- Session management
- Password reset
- Phone verification (OTP)

### 4.2 Product Management
- Product CRUD
- Category management
- Brand management
- Variant management
- Stock management
- Product image management
- Product status management

### 4.3 Shopping Cart
- Cart session (guest dan customer)
- Add/update/remove items
- Stock validation
- Price validation
- Cart summary

### 4.4 Order Management
- Create order (guest dan customer)
- Order status tracking
- Stock reservation
- Order history (customer)
- Order detail
- Order cancellation request
- Admin order management

### 4.5 Payment
- Payment gateway integration
- Payment status tracking
- Webhook handling
- Idempotency
- Payment verification
- Refund (otomatis dan manual)

### 4.6 Voucher & Promotion
- Voucher CRUD
- Voucher eligibility rules
- Voucher stacking compatibility
- Voucher usage tracking
- Voucher calculation engine

### 4.7 Shipping
- Shipping provider integration
- Shipping cost calculation
- Shipping tracking
- Pickup option
- Shipping status update

### 4.8 Customer Management
- Customer profile — halaman akun mandiri (`/profile`): nama, email, ubah password; perubahan email wajib verifikasi ulang lewat tautan ke email baru (revisi 1.4)
- Address management (max 5) — halaman khusus alamat (`/profile/addresses`), tanpa info profil maupun preferensi notifikasi (revisi 1.3)
- Order history
- Notification preferences — diakses lewat dialog yang dibuka dari ikon notifikasi di navbar (revisi 1.3)

### 4.9 Notification
- Email notification
- Order confirmation
- Payment confirmation
- Shipping notification
- Tracking link
- Account creation (set password link)
- Notifikasi in-app: ikon lonceng di navbar membuka dialog berisi daftar notifikasi pesanan + pengaturan preferensi email (revisi 1.3)

### 4.10 Invoice
- Invoice generation
- Invoice view
- Invoice PDF download
- Akses hanya setelah pembayaran berhasil; pesanan belum dibayar atau batal sebelum bayar tidak menampilkan invoice (revisi 1.3)

### 4.11 Reporting
- Sales report
- Product performance
- Stock report
- Order report
- Refund report

### 4.12 Store Configuration
- Store information
- Payment gateway settings (Site Admin)
- Shipping provider settings (Site Admin)
- Platform settings (Site Admin)
- Store settings (Store Admin)
- Template alasan penolakan pembatalan (Store Admin)

---

## 5. Aturan Bisnis Utama

### 5.1 Stock Management

**Aturan:**
1. Stock di-reserve saat order dibuat
2. Stock reservation berlaku sampai:
   - Payment berhasil → stock dikurangi secara permanen
   - Payment gagal/expired → stock reservation di-release
3. Validasi stock dilakukan server-side saat:
   - Menambahkan produk ke cart
   - Checkout
   - Create order
4. Client-side validation hanya untuk UX (tidak dipercaya)

**Tujuan:** Mencegah overselling

### 5.2 Payment

**Aturan:**
1. Payment status terpisah dari order status
2. Order dibuat dengan status "Waiting Payment"
3. Payment gateway mengirim webhook saat payment berhasil/gagal
4. Sistem memverifikasi webhook dengan payment gateway (tidak langsung percaya)
5. Idempotency: webhook yang sama tidak boleh diproses dua kali
6. Payment berhasil → order status berubah ke "Processing"
7. Payment gagal/expired → order status berubah ke "Canceled", stock reservation di-release

### 5.3 Voucher Calculation

**Aturan perhitungan:**

#### A. Voucher Persentase
- Dihitung **bertahap** dari harga sisa
- Contoh: Rp100.000 → voucher 10% = Rp90.000 → voucher 20% = Rp72.000
- **Bukan** dasar yang sama: Rp100.000 → (10% + 20%) = Rp70.000 ❌

#### B. Campuran Persentase + Nominal
- **Nominal dulu, baru persentase**
- Contoh: Rp100.000 → voucher Rp10.000 = Rp90.000 → voucher 10% = Rp81.000
- **Bukan** persentase dulu: Rp100.000 → 10% = Rp90.000 → Rp10.000 = Rp80.000 ❌

#### C. Urutan Konsisten
- Sistem menjaga urutan perhitungan tetap sama
- Walaupun pembeli memasukkan kode voucher dalam urutan berbeda

#### D. Voucher Ongkir
- Menghitung biaya pengiriman secara terpisah
- Tidak mempengaruhi kalkulasi voucher produk

**Tujuan:** Perhitungan yang menguntungkan penjual (potongan lebih kecil)

### 5.4 Voucher Configuration

**Per voucher dapat diatur:**
1. Produk eligible (produk yang bisa pakai voucher)
2. Produk yang dikecualikan
3. Kategori (jika diperlukan)
4. Minimum transaksi (minimum belanja)
5. Periode berlaku (tanggal mulai dan berakhir)
6. Usage limit (kuota total voucher)
7. Batas pemakaian per nomor HP terverifikasi
8. Maksimal potongan (untuk voucher persentase)

**Stacking Compatibility:**
- Voucher A + Voucher B = BOLEH / TIDAK (bisa diatur)
- Voucher A + Voucher C = BOLEH / TIDAK (bisa diatur)
- Voucher B + Voucher C = BOLEH / TIDAK (bisa diatur)
- **Bukan** sekadar "maksimal 2 voucher" tanpa aturan kompatibilitas

### 5.5 Cancellation

**Aturan:**
1. Pembatalan hanya untuk **seluruh pesanan** (bukan sebagian produk)
2. Pembatalan hanya bisa dilakukan selama pesanan **belum diproses/dikirim**
3. Alur pembatalan:
   - Pembeli mengajukan pembatalan lewat website
   - Store Admin meninjau
   - Store Admin menyetujui atau menolak
4. Jika Store Admin menolak:
   - **Wajib memberikan alasan**
   - Bisa pilih dari template alasan atau isi manual
   - Template alasan bisa dikelola Store Admin (tambah, ubah, nonaktifkan)
5. Jika Store Admin menyetujui:
   - Sistem coba refund otomatis lewat payment gateway
   - Jika gateway tidak mendukung → refund manual

### 5.6 Refund

**Aturan:**
1. **Refund otomatis** (jika gateway mendukung):
   - Sistem mengirim request refund ke payment gateway
   - Gateway memproses refund
   - Status refund di-update otomatis

2. **Refund manual** (jika gateway tidak mendukung):
   - Store Admin melakukan refund manual (transfer bank, dll)
   - Store Admin **wajib upload bukti refund** (screenshot/bukti transfer)
   - Store Admin menandai refund sebagai berhasil
   - Bukti tersimpan di riwayat refund

3. Status refund terpisah dari status order
4. Refund harus traceable (ada riwayat dan bukti)

### 5.7 Guest Checkout

**Aturan:**
1. Guest **wajib verifikasi nomor HP** (OTP)
2. Email **opsional**:
   - Jika diisi → dapat order confirmation + link set password (create account)
   - Jika tidak diisi → tidak ada opsi create account otomatis
3. Guest yang sudah checkout bisa tracking order lewat:
   - Halaman "Track Order" publik
   - Input nomor order + nomor HP untuk verifikasi
4. Guest tidak punya order history (kecuali jadi customer)

**Tujuan:** Mencegah spam dan delay stock dengan verifikasi HP, sambil tetap memberikan friction rendah untuk checkout

### 5.8 Customer Address

**Aturan:**
1. Customer bisa simpan **maksimal 5 alamat**
2. Customer bisa pilih alamat saat checkout
3. Customer bisa ubah/hapus alamat kapan saja

**Tujuan:** Mencegah spam/data fiktif dengan membatasi jumlah alamat

---

## 6. Non-Functional Requirements (High-Level)

### 6.1 Security

**MVP wajib implement OWASP Top 10 2021 mitigations (details: SDD section 10):**

- **A01 Broken Access Control:** Role-based authorization (Guest/Customer/Admin), server-side checks
- **A02 Cryptographic Failures:** Bcrypt password hashing, HTTPS only, httpOnly cookies, no plaintext secrets
- **A03 Injection:** Prisma ORM (NO raw SQL), Zod validation, escape user input
- **A04 Insecure Design:** Stock reservation, webhook idempotency, OTP rate limiting
- **A05 Security Misconfiguration:** CSP headers, security headers, no debug info in production
- **A06 Vulnerable Components:** `pnpm audit`, Dependabot, pin exact versions
- **A07 Auth Failures:** NextAuth v5, bcrypt password (min 8 chars), OTP verification, session timeout
- **A08 Software & Data Integrity:** Xendit/Twilio webhook signature verification, validate external API responses
- **A09 Security Logging Failures:** Log failed logins, payment events, stock ops (NO log secrets)
- **A10 SSRF:** Whitelist external API domains (RajaOngkir, Biteship, Xendit)

**Additional:**
- **XSS Prevention:** React auto-escapes, no `dangerouslySetInnerHTML` without sanitization
- **CSRF Protection:** NextAuth CSRF tokens, SameSite cookies
- **PCI DSS:** Payment data NOT stored (Xendit handles)
- **Rate Limiting:** OTP send (1 req/min per phone), future: API rate limiting

### 6.2 Performance
- Halaman produk load < 2 detik
- Checkout process responsive
- Stock validation real-time
- Webhook processing < 5 detik

### 6.3 Reliability
- Payment webhook idempotency (tidak boleh double processing)
- Stock reservation mechanism untuk mencegah overselling
- Refund traceable (ada bukti dan riwayat)

### 6.4 Usability
- Guest bisa checkout tanpa registrasi
- Customer bisa track order dengan mudah
- Admin panel intuitif untuk Store Admin
- Clear error messages

---

## 7. Technical Decisions (Keputusan Teknis)

Keputusan teknis yang sudah ditetapkan untuk MVP:

### 7.1 Payment
- ✅ **Gateway:** Xendit
- ✅ **Priority method:** QRIS (0.7%)
- ✅ **Additional methods:** VA (Rp4.000), E-Wallet (2%)
- ✅ **Future:** International card (2.9% + Rp2.000)

### 7.2 Shipping
- ✅ **Method:** Real-time API via aggregator (RajaOngkir/Biteship/ShipperID)
- ✅ **Providers:** JNE, SiCepat, J&T, dll
- ✅ **Fallback:** Flat rate temporary jika API error

### 7.3 OTP/Verification
- ✅ **Provider:** Twilio Verify
- ✅ **Channel:** SMS
- ✅ **Development:** Trial (gratis, 40 verifikasi)
- ✅ **Production:** SMS ~Rp450-600 per SMS

### 7.4 Product Configuration
- ✅ **Images:** 1 utama + 3 tambahan (max 4)
- ✅ **Variant images:** 1 per variant; input unggah tersedia di form admin produk (revisi 1.5)
- ✅ **Size chart:** 1 gambar opsional
- ✅ **Stock:** Dual tracking (per variant + total)

### 7.5 Voucher
- ✅ **Max stacking:** 2 voucher per transaksi
- ✅ **Calculation:** Bertahap, seller-oriented

### 7.6 Theme Customization
- ✅ **MVP scope:** Nama brand, logo, favicon, tagline, teks footer, palet warna (hex), banner/hero homepage — diatur Site Admin (revisi 1.2)
- ✅ **Admin framework:** shadcn/ui (React + Tailwind)

### 7.7 Notification
- ✅ **Email:** Order, payment, shipping, cancellation, refund, set password
- ✅ **In-app (revisi 1.3):** daftar notifikasi pesanan dan pengaturan preferensi email lewat ikon lonceng di navbar, dengan penanda belum dibaca
- ✅ **OTP:** SMS via Twilio Verify

### 7.8 Target Market
- ✅ **Primary:** Indonesia (QRIS, local shipping)
- ✅ **Generic:** Semua jenis produk (fashion, electronics, food, beauty, dll)
- ✅ **Future:** International payment expansion

### 7.9 Project Structure
- ✅ **Convention:** Idiomatic Next.js 16 App Router structure (framework-following best practices)
- ✅ **Rationale:** Familiar structure untuk Next.js ecosystem developers, follow Next.js 16 conventions (file-based routing, Server Components default, Route Groups, API Routes, Turbopack default bundler)
- ✅ **Details:** See SDD section 5 (Project Structure) untuk complete directory tree dan conventions

---

## 9. Success Criteria (Kriteria Sukses)

Produk dianggap berhasil jika:

1. ✅ Guest dapat checkout dengan lancar (verifikasi HP, tanpa registrasi)
2. ✅ Customer dapat melihat order history dan track shipping
3. ✅ Payment gateway terintegrasi dan webhook berfungsi dengan benar
4. ✅ Stock reservation mencegah overselling (tidak ada order dengan stok minus)
5. ✅ Voucher stacking berfungsi sesuai aturan kompatibilitas
6. ✅ Kalkulasi voucher menghasilkan potongan yang menguntungkan penjual
7. ✅ Store Admin dapat menyetujui/menolak pembatalan dengan alasan
8. ✅ Refund manual traceable dengan bukti yang tersimpan
9. ✅ Store Admin dapat mengelola produk, kategori, stok, dan voucher dengan mudah
10. ✅ Site Admin dapat mengkonfigurasi payment gateway dan shipping provider

---

## 10. Timeline & Phases (High-Level)

**Catatan:** Detail implementation plan akan dijelaskan di `04_IMPLEMENTATION_PLAN.md`

### Phase 1: Foundation
- Authentication & Authorization
- Product Management (CRUD, Category, Brand)
- Basic Admin Panel

### Phase 2: Shopping Flow
- Shopping Cart
- Checkout (Guest & Customer)
- Order Management
- Stock Reservation

### Phase 3: Payment Integration
- Payment Gateway Integration
- Webhook Handling
- Payment Verification
- Order Status Update

### Phase 4: Advanced Features
- Voucher & Promotion
- Voucher Stacking
- Shipping Integration
- Invoice Generation

### Phase 5: Cancellation & Refund
- Cancellation Flow
- Refund (Otomatis & Manual)
- Template Alasan Penolakan

### Phase 6: Reporting & Polish
- Sales Report
- Admin Dashboard
- Email Notification
- Order Tracking Page

---

## 11. Risks & Mitigations (High-Level)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Payment gateway webhook tidak reliable | High | Implement retry mechanism dan manual verification fallback |
| Overselling karena race condition | High | Implement stock reservation dengan database transaction |
| Voucher stacking terlalu kompleks | Medium | Start dengan aturan sederhana, iterasi berdasarkan feedback |
| Guest abuse sistem dengan HP palsu | Medium | Implement rate limiting untuk OTP dan blacklist mechanism |
| Refund manual tidak traceable | Medium | Wajibkan upload bukti refund sebelum tandai berhasil |
| Theme customization terlalu kompleks | Low | Start dengan level medium (warna, logo), avoid full theme builder |

---

## 12. Dependencies

### External Services:
- ✅ **Payment gateway:** Xendit (QRIS, VA, E-Wallet)
- ✅ **Shipping aggregator:** RajaOngkir/Biteship/ShipperID (JNE, SiCepat, J&T)
- ✅ **OTP provider:** Twilio Verify (SMS)
- ⚠️ **Email service:** Perlu ditentukan (SendGrid, AWS SES, Mailgun, Resend)
- ⚠️ **File storage:** Perlu ditentukan (AWS S3, Cloudinary, local storage)

### Development Tools:
- ✅ **Admin UI framework:** shadcn/ui (React + Tailwind)
- ⚠️ **Backend framework:** Akan ditentukan di SDD
- ⚠️ **Database:** Akan ditentukan di SDD
- ⚠️ **Hosting:** Akan ditentukan di SDD

---

## 13. Next Steps

### Completed:
1. ✅ Finalisasi business requirements dan keputusan produk
2. ✅ Finalisasi payment gateway (Xendit)
3. ✅ Finalisasi shipping strategy (real-time API)
4. ✅ Finalisasi OTP provider (Twilio)
5. ✅ Finalisasi product images & stock model
6. ✅ Finalisasi voucher stacking rules
7. ✅ Finalisasi theme customization scope
8. ✅ Finalisasi admin panel framework (shadcn/ui)

### Up Next:
1. ⏳ **SDD (Software Design Document)** → `02_SDD.md`
   - Tentukan tech stack (backend framework, database, ORM)
   - Design arsitektur sistem
   - Database schema & ERD
   - API design
   - Project structure
   - Integrasi third-party services

2. ⏳ **Feature Specification** → `03_SPESIFIKASI_FITUR.md`
   - Detail behavior per fitur
   - Input/output specification
   - Validation rules
   - Permission matrix
   - Error handling
   - Acceptance criteria

3. ⏳ **Implementation Plan** → `04_IMPLEMENTATION_PLAN.md`
   - Task breakdown per phase
   - Dependencies
   - Verification criteria
   - Review gates

4. ⏳ **Agent Instructions** → `05_INSTRUKSI_AGENT.md`
   - Coding principles
   - How to follow PRD/SDD/specs
   - Verification steps
   - Review process

5. ⏳ **Implementation** - Phase 1: Foundation

---

**Catatan:**
- ✅ **PRD sudah FINAL** - semua keputusan produk sudah ditetapkan
- ⚠️ **Tech stack** masih perlu ditentukan di SDD (backend, database, hosting)
- ⚠️ **Email service & file storage** masih perlu ditentukan di SDD
- Detail teknis (database schema, API endpoints, project structure) akan dijelaskan di SDD
- Detail perilaku fitur (validasi, error handling, flow) akan dijelaskan di Spesifikasi Fitur
