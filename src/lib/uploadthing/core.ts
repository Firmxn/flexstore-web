import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@/lib/auth";
import { MAX_PRODUCT_IMAGES } from "@/lib/products/validation";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({
    image: {
      // Uploadthing hanya menerima ukuran kelipatan pangkat dua.
      // Spesifikasi PROD-01 menyebut 5MB, dipakai 4MB agar tidak pernah
      // melebihi batas spesifikasi.
      maxFileSize: "4MB",
      maxFileCount: MAX_PRODUCT_IMAGES,
    },
  })
    .middleware(async () => {
      const session = await auth();

      // `UploadThingError` tanpa `code` akan dipetakan ke 500 (INTERNAL_SERVER_ERROR),
      // padahal ini penolakan akses dari klien. `code` harus disebut eksplisit.
      // Uploadthing tidak punya kode 401, jadi FORBIDDEN (403) dipakai untuk keduanya.
      if (!session?.user) {
        throw new UploadThingError({
          code: "FORBIDDEN",
          message: "Anda harus masuk terlebih dahulu",
        });
      }
      if (session.user.role !== "STORE_ADMIN") {
        throw new UploadThingError({
          code: "FORBIDDEN",
          message: "Hanya Store Admin yang dapat mengunggah gambar",
        });
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl, uploadedBy: metadata.userId };
    }),
  // Bukti refund manual (ORDER-06/PRD 5.6): satu berkas gambar per refund.
  refundProof: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async () => {
      const session = await auth();

      if (!session?.user) {
        throw new UploadThingError({
          code: "FORBIDDEN",
          message: "Anda harus masuk terlebih dahulu",
        });
      }
      if (session.user.role !== "STORE_ADMIN") {
        throw new UploadThingError({
          code: "FORBIDDEN",
          message: "Hanya Store Admin yang dapat mengunggah bukti",
        });
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { url: file.ufsUrl, uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
