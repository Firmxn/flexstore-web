import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth/password";

const prisma = new PrismaClient();

// Rotasi password akun admin yang SUDAH ada (Store Admin + Site Admin).
//
// `prisma/seed.ts` bersifat create-only: `seedAdmin`/`seedSiteAdmin` hanya
// memanggil `prisma.user.create`, sehingga akun lama tidak pernah diubah
// passwordnya. Skrip ini sengaja sempit — hanya meng-update dua akun yang
// dikenal seed, tidak membuat akun baru, dan tidak pernah mencetak password
// maupun hash. Panduan: docs/06 bagian 8, keputusan: docs/04 bagian 4.9.

const MIN_LENGTH = 12;

function readPassword(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) {
    throw new Error(`${name} wajib diisi (lihat docs/06 bagian 8).`);
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
  const storePassword = readPassword("RESET_ADMIN_PASSWORD");
  const sitePassword = readPassword("RESET_SITE_ADMIN_PASSWORD");

  if (storePassword === sitePassword) {
    throw new Error(
      "Password Store Admin dan Site Admin tidak boleh sama; rotasi dibatalkan.",
    );
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
    },
    {
      label: "Site Admin",
      email: readEmail("SEED_SITE_ADMIN_EMAIL", "siteadmin@flexstore.local"),
      role: "SITE_ADMIN" as const,
      hash: siteHash,
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

  // Baru dicatat setelah transaksi commit, tanpa membocorkan kredensial.
  for (const target of targets) {
    console.log(`Password ${target.label} dirotasi: ${target.email}`);
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
