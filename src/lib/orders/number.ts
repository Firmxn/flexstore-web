import { randomInt } from "node:crypto";

// Nomor pesanan: FS-YYYYMMDD-XXXXXX (tanggal Asia/Jakarta + 6 karakter acak).
// Alfabet membuang huruf/angka yang mudah tertukar (I, O, 0, 1) supaya nomor
// tidak salah dibaca saat diketik ulang oleh pengguna.
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SUFFIX_LENGTH = 6;

export const ORDER_NUMBER_PATTERN = /^FS-\d{8}-[A-Z0-9]{6}$/;

function jakartaDatePart(date: Date): string {
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
  return formatted.replace(/-/g, "");
}

export function generateOrderNumber(date = new Date()): string {
  let suffix = "";
  for (let index = 0; index < SUFFIX_LENGTH; index += 1) {
    suffix += ALPHABET[randomInt(ALPHABET.length)];
  }
  return `FS-${jakartaDatePart(date)}-${suffix}`;
}
