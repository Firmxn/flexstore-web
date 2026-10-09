import bcrypt from "bcryptjs";

const BCRYPT_ROUNDS = 10;

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Dipakai saat user tidak ditemukan, agar waktu respons tidak membocorkan
// apakah identifier terdaftar atau tidak (OWASP A07 - user enumeration).
const DUMMY_HASH =
  "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy";

export function wasteTimeLikeVerify(password: string): Promise<boolean> {
  return bcrypt.compare(password, DUMMY_HASH);
}
