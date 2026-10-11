# Spesifikasi Fitur — FlexStore

> Fungsi dokumen: menjelaskan perilaku setiap fitur secara terperinci, termasuk alur berhasil, validasi, hak akses, kondisi gagal, dan kriteria penerimaan. Task implementasi ditempatkan di Implementation Plan.

## 0. Cara memakai template

- Satu blok spesifikasi untuk satu fitur
- Kelompokkan berdasarkan modul, gunakan ID dari PRD
- Fitur prioritas (Phase 1) dirinci penuh, fitur lanjutan status "Belum dirinci"
- Rujuk aturan bisnis PRD dan kontrak teknis SDD

## 1. Identitas dan indeks fitur

- **Versi / tanggal:** v1.4 / 2026-10-11
- **Versi PRD / SDD:** PRD v1.1, SDD v1.0
- **Pemilik keputusan:** Development Team

### Indeks Fitur (MVP) — Phase Bertahap

| Phase | Modul | ID Fitur | Nama Fitur | Status | Lokasi |
| --- | --- | --- | --- | --- | --- |
| **Phase 1** | **MOD-AUTH** | AUTH-01 | Guest OTP Verification | Draft | [AUTH-01](#auth-01) |
| | | AUTH-02 | Customer Registration | Belum dirinci | - |
| | | AUTH-03 | Customer Login | Belum dirinci | - |
| | **MOD-PROD** | PROD-01 | Product CRUD (Admin) | Draft | [PROD-01](#prod-01) |
| | | PROD-02 | Product List (Customer) | Terimplementasi | `docs/04` bagian 4 dan 10 |
| | | PROD-03 | Product Detail | Belum dirinci | - |
| | | PROD-04 | Category Management | Belum dirinci | - |
| | | PROD-05 | Brand Management | Belum dirinci | - |
| **Phase 2** | **MOD-CART** | CART-01 | Add to Cart | Draft | [CART-01](#cart-01) |
| | | CART-02 | Update Cart Item | Draft | [CART-02](#cart-02) |
| | | CART-03 | Remove from Cart | Draft | [CART-03](#cart-03) |
| | | CART-04 | Merge Guest Cart on Login (tambahan) | Draft | [CART-04](#cart-04) |
| | **MOD-SHIP** | SHIP-01 | Calculate Shipping Cost | Draft | [SHIP-01](#ship-01) |
| **Phase 3** | **MOD-ORDER** | ORDER-01 | Create Order (Guest Checkout) | Draft | [ORDER-01](#order-01) |
| | | ORDER-02 | Create Order (Customer) | Draft | [ORDER-02](#order-02) |
| | | ORDER-03 | Order History | Draft | [ORDER-03](#order-03) |
| | | ORDER-04 | Track Order (Public) | Draft | [ORDER-04](#order-04) |
| **Phase 4** | **MOD-PAY** | PAY-01 | Create Payment (Xendit) | Terimplementasi | [PAY-01](#pay-01) |
| | | PAY-02 | Webhook Handler (Xendit) | Terimplementasi | [PAY-02](#pay-02) |
| **Phase 5** | **MOD-VOUCH** | VOUCH-01 | Apply Voucher | Terimplementasi | `docs/04` bagian 8 |
| | | VOUCH-02 | Voucher CRUD (Admin) | Terimplementasi | `docs/04` bagian 8 |
| | **MOD-NOTIF** | NOTIF-01 | Send Email Notification | Terimplementasi | `docs/04` bagian 8 |
| | **MOD-INV** | INV-01 | Generate Invoice (HTML siap-cetak) | Terimplementasi | `docs/04` bagian 8 |
| **Phase 6** | **MOD-SHIP** | SHIP-02 | Track Shipment | Belum dirinci | - |
| | **MOD-ORDER** | ORDER-05 | Cancel Order Request | Belum dirinci | - |
| | | ORDER-06 | Refund (Manual) | Belum dirinci | - |
| | | ORDER-08 | Tracking Pesanan Customer | Belum dirinci (PH-06) | `docs/04` bagian 10 (keputusan 2026-10-10) |
| | **MOD-REPORT** | REPORT-01 | Sales Report | Belum dirinci | - |
| | **MOD-CONFIG** | CONFIG-01 | Store Settings | Belum dirinci | - |
| **Phase 7** | **MOD-CUST** | CUST-01 | Alamat Tersimpan | Terimplementasi | [CUST-01](#cust-01) |
| | | CUST-02 | Preferensi Notifikasi | Terimplementasi | [CUST-02](#cust-02) |
| | **MOD-AUTH** | AUTH-04 | Set Password (Guest → Customer) | Terimplementasi | [AUTH-04](#auth-04) |
| | | AUTH-05 | Reset Password | Terimplementasi | [AUTH-05](#auth-05) |
| | **MOD-ORDER** | ORDER-03B | Re-order (lanjutan ORDER-03) | Terimplementasi | [ORDER-03B](#order-03b) |

**Phase Checkpoint:**
- **Phase 1:** Admin CRUD products, customer register/login/view products ✓ Foundation ready
- **Phase 2:** Add to cart, calculate shipping ✓ Shopping flow ready
- **Phase 3:** Create order, stock reservation ✓ Checkout ready (no payment)
- **Phase 4:** Payment integration, webhook, stock deduction ✓ Payment flow complete
- **Phase 5:** Voucher, email notification, invoice ✓ Core features complete
- **Phase 6:** Shipping tracking, cancellation, refund, reports, settings ✓ MVP complete
- **Phase 7:** Alamat tersimpan, re-order, set/reset password, preferensi notifikasi ✓ Customer management ready

---

## <a name="auth-01"></a>AUTH-01 — Guest OTP Verification

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-01 — Guest OTP Verification |
| Modul | MOD-AUTH |
| Tujuan | Guest verify phone saat checkout untuk mencegah spam/fake order |
| Aktor utama | Guest (belum login) |
| Status | Draft |
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

Tidak berlaku — no status transition (single-step verification).

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
- **Ketergantungan:** Twilio Verify (Trial gratis untuk dev — 40 verifikasi; production setelah upgrade akun)

### 13. Pertanyaan terbuka

Tidak ada — ready for implementation.

---

## <a name="prod-01"></a>PROD-01 — Product CRUD (Store Admin)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PROD-01 — Product CRUD (Store Admin) |
| Modul | MOD-PROD |
| Tujuan | Store Admin mengelola produk (create, read, update, delete) |
| Aktor utama | Store Admin |
| Status | Draft |
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
| Site Admin | None — konfigurasi platform (PRD 2.4), bukan produk | None | 403 Forbidden |
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
| images | File[] | Ya (min 1) | Empty | Max 4, JPG/PNG, 5MB each | "Minimal 1 gambar" |
| variants | Array | Ya | [] | Min 1, SKU unique, price > 0, stock >= 0 | "Minimal 1 variant" |

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
- **Elemen:** Name, slug, description, category, brand, status, images (4 max), variants (dynamic)

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

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | name: "Kaos Polos", variants: [{sku: "KP-001", price: 50000, stock: 10}] | Created | AC-PROD-01-01 |
| Duplicate slug | slug: "kaos-polos" (exists) | Error | AC-PROD-01-05 |

### 12. Batas fitur

- **Termasuk:** CRUD single product, images, variants
- **Tidak termasuk:** Bulk import, structured variant attributes
- **Ketergantungan:** Uploadthing, Category/Brand

### 13. Pertanyaan terbuka

Tidak ada.

---

## <a name="cart-01"></a>CART-01 — Add to Cart

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-01 — Add to Cart |
| Modul | MOD-CART |
| Tujuan | Guest/Customer menambahkan produk ke cart |
| Aktor utama | Guest, Customer |
| Status | Draft |
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

## <a name="cart-02"></a>CART-02 — Update Cart Item

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-02 — Update Cart Item |
| Modul | MOD-CART |
| Tujuan | Guest/Customer mengubah jumlah item di cart dari halaman keranjang |
| Aktor utama | Guest, Customer |
| Status | Draft |
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
| Bukan pemilik cart | Ubah jumlah | Tidak ada — identitas diambil dari sesi/cookie, bukan dari body | Cart milik orang lain tidak pernah tersentuh |

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

## <a name="cart-03"></a>CART-03 — Remove from Cart

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-03 — Remove from Cart |
| Modul | MOD-CART |
| Tujuan | Guest/Customer membuang satu item dari cart |
| Aktor utama | Guest, Customer |
| Status | Draft |
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
| Bukan pemilik cart | Hapus item | Tidak ada — identitas diambil dari sesi/cookie, bukan dari body | Cart milik orang lain tidak pernah tersentuh |

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

## <a name="cart-04"></a>CART-04 — Merge Guest Cart on Login (tambahan)

> Fitur ini **tambahan di luar indeks PRD**. PRD tidak mencantumkannya sebagai fitur terpisah, tetapi
> perilakunya wajib begitu keranjang guest disimpan di luar akun: tanpa penggabungan, item yang
> ditambahkan sebelum login akan hilang.

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CART-04 — Merge Guest Cart on Login |
| Modul | MOD-CART |
| Tujuan | Isi keranjang guest dipindahkan ke keranjang customer setelah login/registrasi, tanpa kehilangan item |
| Aktor utama | Guest yang baru login/registrasi |
| Status | Draft |
| Referensi PRD | PRD 3.1.B (Shopping Cart) — perilaku turunan |
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

## <a name="ship-01"></a>SHIP-01 — Calculate Shipping Cost

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | SHIP-01 — Calculate Shipping Cost |
| Modul | MOD-SHIP |
| Tujuan | Menghitung ongkos kirim dari lokasi toko ke kecamatan tujuan, berdasarkan berat paket |
| Aktor utama | Guest, Customer |
| Status | Draft |
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
| Bukan pemilik | Hitung ongkir | Tidak bisa — berat dihitung server dari identitas pemanggil | Body `weight` dari klien diabaikan |

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

- **Hasil:** `{source, cached, options:[{courier,code,service,description,cost,etd}]}` — berat paket **tidak** ikut di respons supaya tidak terbaca customer/guest; berat tetap dipakai server sebagai kunci cache dan parameter RajaOngkir
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
- **Tidak termasuk:** Simpan pilihan ongkir ke pesanan (PH-03), lacak kiriman (SHIP-02), berat per produk (dipakai berat per varian)
- **Ketergantungan:** MOD-CART (berat dari keranjang), RajaOngkir Komerce API v1 (opsional)

### 13. Pertanyaan terbuka

- Berat paket dihitung dari berat varian (`ProductVariant.weightGram`, gram) yang diisi admin di form produk. `SHIPPING_WEIGHT_PER_ITEM_GRAM` (default 1000) hanya cadangan untuk varian yang beratnya 0/belum diisi. Berat **tidak** ditampilkan ke customer/guest dan **tidak pernah** diterima dari body request.

---

## <a name="order-01"></a>ORDER-01 — Create Order (Guest Checkout)

> **Cakupan PH-03:** pembuatan pesanan saja. Pembayaran (Xendit) ada di PH-04, voucher dan email
> konfirmasi ada di PH-05. Karena itu `voucherCodes` dan AC yang bergantung padanya ditandai
> ditunda, dan pesanan dibuat tanpa baris `Payment`.

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-01 — Create Order (Guest Checkout) |
| Modul | MOD-ORDER |
| Tujuan | Guest checkout tanpa registrasi, dengan OTP verification |
| Aktor utama | Guest |
| Status | Draft |
| Referensi PRD | PRD 3.1.C (Checkout & Order), PRD 5.1 (Stock Management), PRD 5.7 (Guest Checkout) |
| Referensi SDD | SDD 4.4 (MOD-ORDER), Order schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Keranjang berisi minimal satu item terpilih, nomor HP guest terverifikasi (AUTH-01)
- **Pemicu:** Klik "Checkout" dari halaman keranjang
- **Titik masuk:** Halaman keranjang `/cart` → `/checkout`
- **Jika tidak terpenuhi:** Keranjang kosong atau tidak ada item terpilih → kembali ke `/cart`; nomor belum terverifikasi → tampilkan langkah OTP

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
- Stok dikurangi saat pesanan dibuat lalu dikembalikan saat reservasi kedaluwarsa. PH-04 tidak perlu mengurangi stok lagi saat pembayaran berhasil — cukup mengubah status pesanan.

---

## <a name="order-02"></a>ORDER-02 — Create Order (Customer)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-02 — Create Order (Customer) |
| Modul | MOD-ORDER |
| Tujuan | Customer yang sudah login membuat pesanan tanpa verifikasi OTP (sudah terautentikasi) |
| Aktor utama | Customer |
| Status | Draft |
| Referensi PRD | PRD 3.1.C (Checkout & Order), PRD 5.1 (Stock Management) |
| Referensi SDD | SDD 4.4 (MOD-ORDER), Order schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login, keranjang berisi minimal satu item terpilih
- **Pemicu:** Klik "Checkout" dari `/cart`
- **Titik masuk:** `/cart` → `/checkout`
- **Jika tidak terpenuhi:** Tanpa sesi → alihkan ke `/login`; tidak ada item terpilih → kembali ke `/cart`

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

- **Diperbarui 2026-10-10:** alamat tersimpan (maks 5, PRD 5.8) kini punya fase — **PH-07 Customer Management** (`docs/04` bagian 12). Sampai fase itu selesai, alamat tetap diisi per pesanan dan disimpan sebagai `shippingAddress` (JSON) di Order, sesuai SDD 6.2.

---

## <a name="order-03"></a>ORDER-03 — Order History

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-03 — Order History |
| Modul | MOD-ORDER |
| Tujuan | Customer melihat daftar dan detail pesanannya sendiri |
| Aktor utama | Customer |
| Status | Draft |
| Referensi PRD | PRD 3.1.C (Checkout & Order), PRD 3.1.H (Order Tracking) |
| Referensi SDD | SDD 4.4 (MOD-ORDER), SDD 4.8 (MOD-CUST) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login
- **Pemicu:** Buka `/orders` atau tautan "Pesanan Saya" di menu pengguna
- **Titik masuk:** `/orders`, `/orders/[id]`
- **Jika tidak terpenuhi:** Tanpa sesi → alihkan ke `/login`

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
- **Data diubah:** Status pesanan kedaluwarsa → CANCELED beserta pengembalian stok (pelepasan malas)
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

## <a name="order-04"></a>ORDER-04 — Track Order (Public)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-04 — Track Order (Public) |
| Modul | MOD-ORDER |
| Tujuan | Guest melacak pesanannya tanpa akun, memakai nomor pesanan + nomor HP |
| Aktor utama | Guest |
| Status | Draft |
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
| Customer login | Lacak pesanan | Sama seperti guest; jalur khusus customer — daftar pesanan dalam perjalanan tanpa input — direncanakan di ORDER-08 (PH-06), sementara pakai `/orders` | - |
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
- **Data diubah:** Status pesanan kedaluwarsa → CANCELED beserta pengembalian stok (pelepasan malas)
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
- **Tidak termasuk:** Lacak posisi kurir (SHIP-02, PH-06), ubah data pesanan, daftar tracking khusus customer tanpa input (ORDER-08, PH-06)
- **Ketergantungan:** ORDER-01/ORDER-02 (data pesanan), Redis (pembatasan percobaan)

### 13. Pertanyaan terbuka

- Pembatasan percobaan memakai penghitung per alamat IP di Redis (`track:limit:{ip}`, 10 percobaan / 10 menit). Alamat IP diambil dari header `x-forwarded-for` yang diisi proxy platform; di dev nilainya bisa kosong, sehingga pembatasan dilewati secara aman.

---

## <a name="pay-01"></a>PAY-01 — Create Payment (Xendit)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PAY-01 — Create Payment (Xendit) |
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

## <a name="pay-02"></a>PAY-02 — Webhook Handler (Xendit)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PAY-02 — Webhook Handler (Xendit) |
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

Tidak berlaku — background process.

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

## <a name="cust-01"></a>CUST-01 — Alamat Tersimpan

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CUST-01 — Alamat Tersimpan |
| Modul | MOD-CUST |
| Tujuan | Customer menyimpan alamat (maksimal 5) agar bisa dipilih saat checkout tanpa mengetik ulang |
| Aktor utama | Customer |
| Status | Terimplementasi (PH-07) |
| Referensi PRD | PRD 2.2 (Customer), PRD 4.8 (Customer Management), PRD 5.8 (Customer Address) |
| Referensi SDD | SDD 4.8 (MOD-CUST), SDD 6.2 (`shippingAddress`) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login dengan role Customer
- **Pemicu:** Buka `/profile`, atau memilih alamat tersimpan di `/checkout`
- **Titik masuk:** `/profile`, `/checkout`, `/api/customer/addresses`, `/api/customer/addresses/[id]`
- **Jika tidak terpenuhi:** Tanpa sesi → alihkan ke `/login`; role non-customer → alihkan ke `/admin`

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
- **Data diubah:** Address (create/update/delete). `Order.shippingAddress` **tidak** berubah — pesanan lama tetap snapshot
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

---

## <a name="cust-02"></a>CUST-02 — Preferensi Notifikasi

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | CUST-02 — Preferensi Notifikasi |
| Modul | MOD-CUST |
| Tujuan | Customer memilih jenis email yang ingin diterima |
| Aktor utama | Customer |
| Status | Terimplementasi (PH-07) |
| Referensi PRD | PRD 4.8 (Customer Management), PRD 4.9 (Notification) |
| Referensi SDD | SDD 4.8 (MOD-CUST), SDD 4.9 (MOD-NOTIF) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Ada sesi login Customer
- **Pemicu:** Buka `/profile` bagian "Preferensi Notifikasi"
- **Titik masuk:** `/profile`, `/api/customer/notification-preferences`
- **Jika tidak terpenuhi:** Tanpa sesi → alihkan ke `/login`

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

---

## <a name="auth-04"></a>AUTH-04 — Set Password (Guest → Customer)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-04 — Set Password (Guest → Customer) |
| Modul | MOD-AUTH |
| Tujuan | Guest yang mengisi email saat checkout bisa membuat akun customer lewat tautan set password |
| Aktor utama | Guest dengan email |
| Status | Terimplementasi (PH-07) |
| Referensi PRD | PRD 2.1 (Guest), PRD 2.2 (Customer), PRD 3.1.I, PRD 5.7 (Guest Checkout) |
| Referensi SDD | SDD 4.1 (MOD-AUTH), SDD 4.9 (MOD-NOTIF) |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Pesanan guest dibuat dengan `guestEmail` terisi dan email belum terdaftar
- **Pemicu:** Pesanan guest selesai dibuat → server mengirim email "Buat Password"
- **Titik masuk:** `/set-password?token=...`, `POST /api/auth/set-password`
- **Jika tidak terpenuhi:** Email sudah terdaftar → email tidak dikirim

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

## <a name="auth-05"></a>AUTH-05 — Reset Password

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | AUTH-05 — Reset Password |
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
- **Data dibaca:** User (email → `id`, `role`), token (Redis)
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

## <a name="order-03b"></a>ORDER-03B — Re-order (lanjutan ORDER-03)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | ORDER-03B — Re-order (lanjutan ORDER-03) |
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
- **Jika tidak terpenuhi:** Tanpa sesi → `401`; pesanan bukan miliknya → `404`

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

**Status:** Spesifikasi Fitur v1.4 — PH-07 (CUST-01, CUST-02, AUTH-04, AUTH-05, ORDER-03B) terimplementasi.

**Next steps:**
1. Review spesifikasi dengan team
2. Draft `04_IMPLEMENTATION_PLAN.md`
3. Draft `05_INSTRUKSI_AGENT.md`