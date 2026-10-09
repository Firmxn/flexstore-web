# Spesifikasi Fitur — FlexStore

> Fungsi dokumen: menjelaskan perilaku setiap fitur secara terperinci, termasuk alur berhasil, validasi, hak akses, kondisi gagal, dan kriteria penerimaan. Task implementasi ditempatkan di Implementation Plan.

## 0. Cara memakai template

- Satu blok spesifikasi untuk satu fitur
- Kelompokkan berdasarkan modul, gunakan ID dari PRD
- Fitur prioritas (Phase 1) dirinci penuh, fitur lanjutan status "Belum dirinci"
- Rujuk aturan bisnis PRD dan kontrak teknis SDD

## 1. Identitas dan indeks fitur

- **Versi / tanggal:** v1.1 / 2026-10-10
- **Versi PRD / SDD:** PRD v1.0, SDD v1.0
- **Pemilik keputusan:** Development Team

### Indeks Fitur (MVP) — Phase Bertahap

| Phase | Modul | ID Fitur | Nama Fitur | Status | Lokasi |
| --- | --- | --- | --- | --- | --- |
| **Phase 1** | **MOD-AUTH** | AUTH-01 | Guest OTP Verification | Draft | [AUTH-01](#auth-01) |
| | | AUTH-02 | Customer Registration | Belum dirinci | - |
| | | AUTH-03 | Customer Login | Belum dirinci | - |
| | **MOD-PROD** | PROD-01 | Product CRUD (Admin) | Draft | [PROD-01](#prod-01) |
| | | PROD-02 | Product List (Customer) | Belum dirinci | - |
| | | PROD-03 | Product Detail | Belum dirinci | - |
| | | PROD-04 | Category Management | Belum dirinci | - |
| | | PROD-05 | Brand Management | Belum dirinci | - |
| **Phase 2** | **MOD-CART** | CART-01 | Add to Cart | Draft | [CART-01](#cart-01) |
| | | CART-02 | Update Cart Item | Draft | [CART-02](#cart-02) |
| | | CART-03 | Remove from Cart | Draft | [CART-03](#cart-03) |
| | | CART-04 | Merge Guest Cart on Login (tambahan) | Draft | [CART-04](#cart-04) |
| | **MOD-SHIP** | SHIP-01 | Calculate Shipping Cost | Draft | [SHIP-01](#ship-01) |
| **Phase 3** | **MOD-ORDER** | ORDER-01 | Create Order (Guest Checkout) | Draft | [ORDER-01](#order-01) |
| | | ORDER-02 | Create Order (Customer) | Belum dirinci | - |
| | | ORDER-03 | Order History | Belum dirinci | - |
| | | ORDER-04 | Track Order (Public) | Belum dirinci | - |
| **Phase 4** | **MOD-PAY** | PAY-01 | Create Payment (Xendit) | Draft | [PAY-01](#pay-01) |
| | | PAY-02 | Webhook Handler (Xendit) | Draft | [PAY-02](#pay-02) |
| **Phase 5** | **MOD-VOUCH** | VOUCH-01 | Apply Voucher | Belum dirinci | - |
| | | VOUCH-02 | Voucher CRUD (Admin) | Belum dirinci | - |
| | **MOD-NOTIF** | NOTIF-01 | Send Email Notification | Belum dirinci | - |
| | **MOD-INV** | INV-01 | Generate Invoice PDF | Belum dirinci | - |
| **Phase 6** | **MOD-SHIP** | SHIP-02 | Track Shipment | Belum dirinci | - |
| | **MOD-ORDER** | ORDER-05 | Cancel Order Request | Belum dirinci | - |
| | | ORDER-06 | Refund (Manual) | Belum dirinci | - |
| | **MOD-REPORT** | REPORT-01 | Sales Report | Belum dirinci | - |
| | **MOD-CONFIG** | CONFIG-01 | Store Settings | Belum dirinci | - |

**Phase Checkpoint:**
- **Phase 1:** Admin CRUD products, customer register/login/view products ✓ Foundation ready
- **Phase 2:** Add to cart, calculate shipping ✓ Shopping flow ready
- **Phase 3:** Create order, stock reservation ✓ Checkout ready (no payment)
- **Phase 4:** Payment integration, webhook, stock deduction ✓ Payment flow complete
- **Phase 5:** Voucher, email notification, invoice ✓ Core features complete
- **Phase 6:** Shipping tracking, cancellation, refund, reports, settings ✓ MVP complete

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
| Site Admin | CRUD products | Own store only | N/A |
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
| Store Admin | Panggil `/api/cart/sync` | Keranjang miliknya sendiri | Item guest digabung (role apa pun yang punya sesi) |

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
- **Titik masuk:** Ringkasan di halaman `/cart`
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
| 1 | User mengetik nama kecamatan | `GET /api/shipping/cities?search=...` | Daftar tujuan (id + label) |
| 2 | User memilih tujuan | Client menyimpan `destinationId` | Tujuan terpilih |
| 3 | User klik "Hitung Ongkos Kirim" | `POST /api/shipping` | Server menghitung berat = jumlah (kuantitas x berat varian); berat varian dibaca dari data produk |
| 4 | System | Panggil RajaOngkir, cache 10 menit per (origin, tujuan, berat) | Daftar opsi kurir |
| 5 | System | Tampilkan opsi; user memilih satu | Total = subtotal + ongkir terpilih |

### 6. Output dan perubahan data

- **Hasil:** `{source, cached, options:[{courier,code,service,description,cost,etd}]}` — berat paket **tidak** ikut di respons supaya tidak terbaca customer/guest; berat tetap dipakai server sebagai kunci cache dan parameter RajaOngkir
- **Data dibaca:** Keranjang (kuantitas per item), berat varian dari data produk, pengaturan env (origin, kurir)
- **Data dibuat:** Cache Redis `ship:cost:*` (TTL 10 menit), `ship:search:*` (TTL 5 menit)
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

- **Prasyarat:** Cart has items, phone verified (AUTH-01)
- **Pemicu:** Click "Checkout" from cart
- **Titik masuk:** Cart page
- **Jika tidak terpenuhi:** Redirect to cart if empty, show OTP verification if phone not verified

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Guest (phone verified) | Create order | Own order | N/A |
| Guest (not verified) | None | None | Show OTP verification |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| guestPhone | String | Ya | +62xxx, verified via OTP | "Phone belum diverifikasi" |
| guestEmail | String | Tidak | Valid email format | "Email tidak valid" |
| shippingAddress | JSON | Ya | name, address, city, province, postalCode, phone | "Alamat lengkap wajib diisi" |
| shippingMethod | String | Ya | Must be from calculated options | "Metode pengiriman tidak valid" |
| voucherCodes | String[] | Tidak | Max 2, must be valid and compatible | "Voucher tidak valid" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Guest proceed to checkout | Load cart, calculate shipping options | Checkout form displayed |
| 2 | Guest fill shipping address | Validate address | Address valid |
| 3 | Guest select shipping method | Calculate shipping cost | Cost displayed |
| 4 | Guest apply voucher (optional) | Validate and calculate discount | Discount applied |
| 5 | Guest click "Place Order" | Reserve stock (Redis lock), create order (Waiting Payment), create payment (Xendit) | Order created |
| 6 | System | Redirect to payment page | Payment instructions displayed |

### 6. Output dan perubahan data

- **Hasil:** Order created, payment link, stock reserved
- **Data dibaca:** Cart items, shipping rates, voucher rules
- **Data dibuat:** Order, OrderItem, Payment (Waiting), Shipping, VoucherUsage, Redis stock locks
- **Kondisi akhir:** Order status = WAITING_PAYMENT, stock locked (10 min)
- **Efek samping:** Email sent if guestEmail provided
- **Setelah reload:** Order persists, can track via order number + phone

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Cancel checkout | Return to cart | No order created |
| Stock insufficient during place order | Show error, release partial locks | No order created |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Phone not verified | "Verifikasi nomor HP terlebih dahulu" | Redirect to OTP verification |
| Stock insufficient | "Stok produk X tidak cukup" | Update cart |
| Shipping API error | "Gagal menghitung ongkir, gunakan flat rate" | Use fallback flat rate |
| Voucher invalid | "Kode voucher tidak valid" | Remove voucher |
| Payment creation fail | "Gagal membuat pembayaran, coba lagi" | Retry, release stock locks |

### 9. Perilaku UI

- **Halaman:** Checkout page
- **Elemen:** Phone (verified badge), email (optional), shipping address form, shipping method selector, voucher input, order summary, "Place Order" button

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Normal | Form enabled | Fill and submit |
| Calculating shipping | Loading spinner on shipping section | Wait |
| Placing order | Loading spinner, button disabled | Wait |
| Order created | Redirect to payment page | Pay order |
| Error | Error message | Fix and retry |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-ORDER-01-01 | Guest, cart has items, phone verified | Fill form, place order | Order created (Waiting Payment), stock locked |
| AC-ORDER-01-02 | Guest, phone not verified | Try checkout | Show OTP verification |
| AC-ORDER-01-03 | Guest | Place order with valid voucher | Discount applied correctly (bertahap) |
| AC-ORDER-01-04 | Guest | Place order, stock insufficient | Error, no order created |
| AC-ORDER-01-05 | Guest | Place order with email | Email sent with order confirmation |
| AC-ORDER-01-06 | Guest | Order created, wait 10 min (no payment) | Stock lock released |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid | phone: "+628123456789" (verified), address: complete, shipping: "JNE REG" | Order created | AC-ORDER-01-01 |
| Not verified | phone not verified | Show OTP | AC-ORDER-01-02 |
| With voucher | voucherCodes: ["DISKON10", "ONGKIR50"] | Discount applied | AC-ORDER-01-03 |

### 12. Batas fitur

- **Termasuk:** Guest checkout, OTP verification, stock reservation, voucher (max 2)
- **Tidak termasuk:** Customer checkout (separate), save address, re-order
- **Ketergantungan:** AUTH-01 (OTP), MOD-CART, MOD-VOUCH, MOD-SHIP, MOD-PAY

### 13. Pertanyaan terbuka

Tidak ada.

---

## <a name="pay-01"></a>PAY-01 — Create Payment (Xendit)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PAY-01 — Create Payment (Xendit) |
| Modul | MOD-PAY |
| Tujuan | Generate payment invoice via Xendit untuk order |
| Aktor utama | System (triggered after order creation) |
| Status | Draft |
| Referensi PRD | PRD 3.1.D (Payment), PRD 7.1 (Payment Gateway) |
| Referensi SDD | SDD 4.5 (MOD-PAY), Payment schema |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Order created with status WAITING_PAYMENT
- **Pemicu:** Order creation flow (ORDER-01)
- **Titik masuk:** `/api/payments/create`
- **Jika tidak terpenuhi:** Cannot create payment

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| System (internal) | Create payment | Any order | N/A |
| Guest/Customer (indirect) | Trigger via order | Own order | N/A |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan error |
| --- | --- | --- | --- | --- |
| orderId | UUID | Ya | Order exists, status = WAITING_PAYMENT | "Order tidak valid" |
| paymentMethod | Enum | Ya | QRIS, VIRTUAL_ACCOUNT, E_WALLET | "Metode tidak valid" |
| amount | Decimal | Ya | = order.total | "Amount tidak sesuai" |

### 5. Alur berhasil

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | System call `/api/payments/create` | Validate order | Order valid |
| 2 | System | Call Xendit API (create invoice) | Invoice created |
| 3 | System | Save Payment record (externalId, status: WAITING) | Payment saved |
| 4 | System | Return payment URL | User redirected |

### 6. Output dan perubahan data

- **Hasil:** Payment invoice created, payment URL returned
- **Data dibaca:** Order
- **Data dibuat:** Payment (externalId, method, status: WAITING, amount)
- **Kondisi akhir:** Payment exists, linked to order
- **Setelah reload:** Payment persists

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| Xendit timeout | Retry 1x | If still fail, error |
| Payment exists | Return existing URL | No duplicate |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Order not found | "Order tidak ditemukan" | Check orderId |
| Order not WAITING_PAYMENT | "Order sudah dibayar" | Cannot create |
| Xendit API error | "Gagal membuat pembayaran" | Retry |

### 9. Perilaku UI

- **Halaman:** Payment instructions
- **Elemen:** QR code (QRIS), VA number, amount, expiry timer (24h), instructions

| Kondisi | Tampilan | Tindakan |
| --- | --- | --- |
| Loading | Spinner | Wait |
| Created | Show QR/VA, countdown | Pay |
| Error | Error, retry button | Retry |

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PAY-01-01 | Order (Waiting) | Create payment QRIS | Invoice created, QR shown |
| AC-PAY-01-02 | Order (Waiting) | Create payment VA | VA number shown |
| AC-PAY-01-03 | Payment created | Reload | Payment persists |
| AC-PAY-01-04 | Order paid | Try create | Error "sudah dibayar" |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Valid QRIS | orderId: valid, method: QRIS, amount: 100000 | Payment created | AC-PAY-01-01 |
| Order paid | order.status: PROCESSING | Error | AC-PAY-01-04 |

### 12. Batas fitur

- **Termasuk:** Create payment (QRIS, VA, E-Wallet)
- **Tidak termasuk:** Webhook (PAY-02), refund
- **Ketergantungan:** Xendit API, ORDER-01

### 13. Pertanyaan terbuka

Tidak ada.

---

## <a name="pay-02"></a>PAY-02 — Webhook Handler (Xendit)

### 1. Identitas dan tujuan

| Isian | Jawaban |
| --- | --- |
| ID dan nama | PAY-02 — Webhook Handler (Xendit) |
| Modul | MOD-PAY |
| Tujuan | Process Xendit webhook untuk update payment/order status |
| Aktor utama | Xendit (external) |
| Status | Draft |
| Referensi PRD | PRD 3.1.D (Payment), PRD 5.2 (Payment Rules) |
| Referensi SDD | SDD 4.5 (MOD-PAY), Webhook idempotency |

### 2. Prasyarat dan pemicu

- **Prasyarat:** Payment created, customer paid
- **Pemicu:** Xendit POST webhook
- **Titik masuk:** `/api/webhooks/xendit`
- **Jika tidak terpenuhi:** N/A (external)

### 3. Hak akses

| Role | Tindakan | Cakupan | Respons |
| --- | --- | --- | --- |
| Xendit (verified sig) | Send webhook | Any payment | N/A |
| Invalid sig | None | None | 401 |

### 4. Input dan validasi

| Input | Tipe | Wajib | Validasi | Pesan |
| --- | --- | --- | --- | --- |
| payload | JSON | Ya | Valid Xendit format | "Invalid payload" |
| signature | String (header) | Ya | Xendit signature verify | "Invalid signature" |
| externalId | String | Ya | Payment exists | "Payment not found" |
| status | String | Ya | PAID, EXPIRED, FAILED | "Invalid status" |

### 5. Alur berhasil (Payment Success)

| Langkah | Tindakan | Respons | Hasil |
| --- | --- | --- | --- |
| 1 | Xendit POST | Receive payload | Webhook received |
| 2 | System | Verify signature | Valid |
| 3 | System | Check idempotency (Redis) | Not processed |
| 4 | System | Find Payment by externalId | Found |
| 5 | System | Update Payment = PAID, Order = PROCESSING | Updated |
| 6 | System | Deduct stock, delete locks | Stock updated |
| 7 | System | Send email | Email sent |
| 8 | System | Mark processed (Redis 24h) | Return 200 |

### 6. Output dan perubahan data

- **Hasil:** Payment/order status updated, stock deducted
- **Data diubah:** Payment (status, paidAt), Order (status), ProductVariant (stock), Redis (delete locks)
- **Kondisi akhir:** Payment = PAID, Order = PROCESSING, stock reduced
- **Efek samping:** Email sent, Redis webhook ID saved (24h)

### 7. Alur alternatif

| Kondisi | Perilaku | Hasil |
| --- | --- | --- |
| EXPIRED | Payment/Order = CANCELED, release locks | Stock released |
| FAILED | Payment/Order = CANCELED, release locks | Stock released |
| Duplicate | Check Redis, return 200 | No duplicate |

### 8. Kondisi gagal

| Kondisi | Respons | Tindakan |
| --- | --- | --- |
| Invalid sig | 401 | Xendit retry |
| Payment not found | 404 | Log error |
| Already processed | 200 (no-op) | Stop retry |
| DB fail | 500 | Xendit retry |

### 9. Perilaku UI

Tidak berlaku — background process.

### 10. Kriteria penerimaan

| ID | Kondisi awal | Ketika | Hasil |
| --- | --- | --- | --- |
| AC-PAY-02-01 | Payment (Waiting) | Webhook PAID | Payment/Order updated, stock deducted |
| AC-PAY-02-02 | Payment (Waiting) | Webhook EXPIRED | Payment/Order canceled, stock released |
| AC-PAY-02-03 | Payment (Paid) | Resend webhook | 200, no duplicate |
| AC-PAY-02-04 | Webhook | Invalid sig | 401 |
| AC-PAY-02-05 | Payment success | Check email | Email sent |

### 11. Contoh data

| Skenario | Data | Hasil | Kriteria |
| --- | --- | --- | --- |
| Success | payload: {id: "wh_123", externalId: "order_456", status: "PAID"}, valid sig | Updated, stock deducted | AC-PAY-02-01 |
| Duplicate | Same webhook 2x | 200 both, processed once | AC-PAY-02-03 |

### 12. Batas fitur

- **Termasuk:** Webhook (PAID, EXPIRED, FAILED), idempotency, stock update, email
- **Tidak termasuk:** Refund webhook (separate)
- **Ketergantungan:** PAY-01, MOD-ORDER, MOD-NOTIF

### 13. Pertanyaan terbuka

Tidak ada.

---

**Status:** Draft Spesifikasi Fitur v1.0 complete (6 fitur prioritas dirinci).

**Next steps:**
1. Review spesifikasi dengan team
2. Draft `04_IMPLEMENTATION_PLAN.md`
3. Draft `05_INSTRUKSI_AGENT.md`