import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/prisma";
import {
  MAX_ADDRESSES,
  type AddressInput,
  type AddressUpdateInput,
  type NotificationPreferenceInput,
} from "./validation";

// CUST-01 (PH-07): mutasi alamat milik sendiri. Batas 5 alamat dan penjaga
// "hanya satu alamat utama" dijalankan di dalam transaksi supaya tidak ada
// keadaan setengah jadi. Setiap operasi mensyaratkan `userId` pemilik.

export type AddressErrorCode = "LIMIT_REACHED" | "NOT_FOUND";

export type AddressResult =
  | { ok: true; id: string }
  | { ok: false; code: AddressErrorCode; message: string };

class AddressError extends Error {
  constructor(
    readonly code: AddressErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AddressError";
  }
}

export async function createAddress(
  userId: string,
  input: AddressInput,
): Promise<AddressResult> {
  try {
    const created = await prisma.$transaction(async (tx) => {
      const count = await tx.address.count({ where: { userId } });
      if (count >= MAX_ADDRESSES) {
        throw new AddressError(
          "LIMIT_REACHED",
          `Maksimal ${MAX_ADDRESSES} alamat tersimpan`,
        );
      }

      // Alamat pertama otomatis menjadi utama; kalau ditandai utama secara
      // eksplisit, alamat utama lama dilepas.
      const isPrimary = input.isPrimary || count === 0;
      if (isPrimary) {
        await tx.address.updateMany({
          where: { userId },
          data: { isPrimary: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          label: input.label,
          recipientName: input.recipientName,
          phone: input.phone,
          destinationId: input.destinationId ?? null,
          province: input.province,
          city: input.city,
          district: input.district ?? null,
          subdistrict: input.subdistrict ?? null,
          postalCode: input.postalCode ?? null,
          street: input.street,
          note: input.note ?? null,
          isPrimary,
        },
      });
    });

    return { ok: true, id: created.id };
  } catch (error) {
    if (error instanceof AddressError) {
      return { ok: false, code: error.code, message: error.message };
    }
    throw error;
  }
}

export async function updateAddress(
  userId: string,
  addressId: string,
  input: AddressUpdateInput,
): Promise<AddressResult> {
  try {
    await prisma.$transaction(async (tx) => {
      const data: Prisma.AddressUpdateManyMutationInput = {};
      if (input.label !== undefined) data.label = input.label;
      if (input.recipientName !== undefined) data.recipientName = input.recipientName;
      if (input.phone !== undefined) data.phone = input.phone;
      if (input.destinationId !== undefined) data.destinationId = input.destinationId;
      if (input.province !== undefined) data.province = input.province;
      if (input.city !== undefined) data.city = input.city;
      if (input.district !== undefined) data.district = input.district;
      if (input.subdistrict !== undefined) data.subdistrict = input.subdistrict;
      if (input.postalCode !== undefined) data.postalCode = input.postalCode;
      if (input.street !== undefined) data.street = input.street;
      if (input.note !== undefined) data.note = input.note;
      // Alamat utama tidak bisa "dikosongkan": hanya penanda true yang dihormati.
      if (input.isPrimary === true) data.isPrimary = true;

      const updated = await tx.address.updateMany({
        where: { id: addressId, userId },
        data,
      });
      if (updated.count === 0) {
        throw new AddressError("NOT_FOUND", "Alamat tidak ditemukan");
      }

      if (input.isPrimary === true) {
        await tx.address.updateMany({
          where: { userId, NOT: { id: addressId } },
          data: { isPrimary: false },
        });
      }
    });

    return { ok: true, id: addressId };
  } catch (error) {
    if (error instanceof AddressError) {
      return { ok: false, code: error.code, message: error.message };
    }
    throw error;
  }
}

export async function deleteAddress(
  userId: string,
  addressId: string,
): Promise<AddressResult> {
  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.address.findFirst({
        where: { id: addressId, userId },
        select: { isPrimary: true },
      });
      if (!existing) {
        throw new AddressError("NOT_FOUND", "Alamat tidak ditemukan");
      }

      await tx.address.delete({ where: { id: addressId } });

      // Kalau alamat utama dihapus, alamat tertua berikutnya diangkat supaya
      // selalu ada satu alamat utama selama masih ada alamat.
      if (existing.isPrimary) {
        const next = await tx.address.findFirst({
          where: { userId },
          orderBy: { createdAt: "asc" },
          select: { id: true },
        });
        if (next) {
          await tx.address.update({
            where: { id: next.id },
            data: { isPrimary: true },
          });
        }
      }
    });

    return { ok: true, id: addressId };
  } catch (error) {
    if (error instanceof AddressError) {
      return { ok: false, code: error.code, message: error.message };
    }
    throw error;
  }
}

// CUST-02: baris dibuat saat pertama kali disimpan (upsert).
export function updateNotificationPreferences(
  userId: string,
  input: NotificationPreferenceInput,
) {
  return prisma.notificationPreference.upsert({
    where: { userId },
    create: { userId, ...input },
    update: input,
  });
}
