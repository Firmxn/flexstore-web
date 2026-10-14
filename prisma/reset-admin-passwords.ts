import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

// Rotasi password akun admin yang SUDAH ada (Store Admin + Site Admin).
//
// `prisma/seed.ts` bersifat create-only: `seedAdmin`/`seedSiteAdmin` hanya
// memanggil `prisma.user.create`, sehingga akun lama tidak pernah diubah
// passwordnya. Skrip ini sengaja sempit — hanya meng-update dua akun yang
// dikenal seed, tidak membuat akun baru, dan tidak pernah mencetak password
// yang diberikan lewat env. Panduan: docs/06 bagian 8, keputusan: docs/04 4.9.
//
// Dua mode:
//   1. Eksplisit — isi RESET_ADMIN_PASSWORD dan RESET_SITE_ADMIN_PASSWORD
//      (wajib berbeda, minimal 12 karakter). Password tidak pernah dicetak.
//   2. Acak — set RESET_GENERATE=true. Password kuat dibuat di sini dan
//      dicetak SEKALI setelah rotasi berhasil; simpan saat itu juga.

const MIN_LENGTH = 12;
const GENERATED_LENGTH_BYTES = 18; // 18 byte -> 24 karakter base64url

function isTruthy(value: string | undefined): boolean {
  return ["1", "true", "yes", "on"].includes((value ?? "").trim().toLowerCase());
}

function generatePassword(): string {
  return randomBytes(GENERATED_LENGTH_BYTES).toString("base64url");
}

function readExplicitPassword(name: string): string | null {
  const value = process.env[name]?.trim();
  if (!value) {
    return null;
  }
  if (value.length < MIN_LENGTH) {
    throw new Error(`${name} minimal ${MIN_LENGTH} karakter.`);
  }
  return value;
}

function readEmail(name: string, fallback: string): string {
  return (process.env[name] ?? "").trim() || fallback;
}

async function main() {
  const generate = isTruthy(process.env.RESET_GENERATE);

  const explicitStore = readExplicitPassword("RESET_ADMIN_PASSWORD");
  const explicitSite = readExplicitPassword("RESET_SITE_ADMIN_PASSWORD");

  if (!explicitStore && !generate) {
    throw new Error(
      "RESET_ADMIN_PASSWORD wajib diisi, atau set RESET_GENERATE=true untuk membuat password acak.",
    );
  }
  if (!explicitSite && !generate) {
    throw new Error(
      "RESET_SITE_ADMIN_PASSWORD wajib diisi, atau set RESET_GENERATE=true untuk membuat password acak.",
    );
  }

  const storeGenerated = !explicitStore;
  const siteGenerated = !explicitSite;

  const storePassword = explicitStore ?? generatePassword();
  let sitePassword = explicitSite ?? generatePassword();

  // Dua akun tidak boleh memakai password yang sama. Nilai acak praktis tidak
  // akan bertabrakan, tetapi tetap dijaga di sini.
  if (storePassword === sitePassword) {
    if (!siteGenerated) {
      throw new Error(
        "Password Store Admin dan Site Admin tidak boleh sama; rotasi dibatalkan.",
      );
    }
    sitePassword = generatePassword();
  }

  // Hash di luar transaksi supaya transaksi tidak menahan koneksi selama bcrypt.
  const storeHash = await hashPassword(storePassword);
  const siteHash = await hashPassword(sitePassword);

  const targets = [
    {
      label: "Store Admin",
      email: readEmail("SEED_ADMIN_EMAIL", "storeadmin@flexstore.local"),
      role: "STORE_ADMIN" as const,
      hash: storeHash,
      generated: storeGenerated,
      password: storePassword,
    },
    {
      label: "Site Admin",
      email: readEmail("SEED_SITE_ADMIN_EMAIL", "siteadmin@flexstore.local"),
      role: "SITE_ADMIN" as const,
      hash: siteHash,
      generated: siteGenerated,
      password: sitePassword,
    },
  ];

  // Semua pemeriksaan dan perubahan berada dalam satu transaksi: bila salah satu
  // akun tidak ditemukan atau role-nya tidak cocok, tidak ada yang berubah.
  await prisma.$transaction(async (tx) => {
    for (const target of targets) {
      const user = await tx.user.findUnique({
        where: { email: target.email },
        select: { id: true, role: true },
      });

      if (!user) {
        throw new Error(
          `Akun ${target.label} (${target.email}) tidak ditemukan; rotasi dibatalkan.`,
        );
      }

      if (user.role !== target.role) {
        throw new Error(
          `Akun ${target.email} bukan ${target.role} (role sekarang ${user.role}); rotasi dibatalkan.`,
        );
      }

      await tx.user.update({
        where: { id: user.id },
        data: { password: target.hash },
      });
    }
  });

  // Baru dicatat setelah transaksi commit. Password yang di-generate dicetak
  // sekali di sini; password yang diberikan lewat env tidak pernah dicetak.
  for (const target of targets) {
    if (target.generated) {
      console.log(
        `Password ${target.label} baru (acak, simpan sekarang): ${target.password}`,
      );
    } else {
      console.log(`Password ${target.label} dirotasi: ${target.email}`);
    }
  }
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(() => {
    void prisma.$disconnect();
  });
