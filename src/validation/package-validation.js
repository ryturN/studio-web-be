import { z } from "zod";

export class PackageValidation {
  static CREATE = z.object({
    name: z
      .string({ required_error: "Nama paket tidak boleh kosong" })
      .min(3, "Nama paket minimal 3 karakter")
      .max(255, "Nama paket maksimal 255 karakter"),
    description: z
      .string({ required_error: "Deskripsi paket tidak boleh kosong" })
      .min(3, "Deskripsi minimal 3 karakter")
      .max(1000, "Deskripsi maksimal 1000 karakter"),
    price: z
      .number({
        required_error: "Harga tidak boleh kosong",
      })
      .min(1000, "Harga minimal Rp1.000")
      .max(3000000, "Harga maksimal Rp3.000.000")
      .int()
      .positive("Harga harus positif"),
    categoryId: z
      .number({
        required_error: "ID Kategori tidak boleh kosong",
      })
      .min(1, "ID Kategori tidak boleh kosong")
      .int()
      .positive("ID Kategori harus positif"),
  });

  static GET = z.object({
    packageId: z
      .number({ required_error: "ID Paket tidak boleh kosong" })
      .min(1, "ID Paket tidak boleh kosong")
      .int()
      .positive("ID Kategori harus positif"),
  });

  static UPDATE = z.object({
    packageId: z
      .number({ required_error: "ID Paket tidak boleh kosong" })
      .min(1, "ID Paket tidak boleh kosong")
      .int()
      .positive("ID Kategori harus positif"),
    name: z
      .string({ required_error: "Nama paket tidak boleh kosong" })
      .min(3, "Nama paket minimal 3 karakter")
      .max(255, "Nama paket maksimal 255 karakter"),
    description: z
      .string({ required_error: "Deskripsi paket tidak boleh kosong" })
      .min(3, "Deskripsi minimal 3 karakter")
      .max(1000, "Deskripsi maksimal 1000 karakter"),
    price: z
      .number({
        required_error: "Harga tidak boleh kosong",
      })
      .min(1000, "Harga minimal Rp1.000")
      .max(3000000, "Harga maksimal Rp3.000.000")
      .int()
      .positive("Harga harus positif"),
    categoryId: z
      .number({
        required_error: "ID Kategori tidak boleh kosong",
      })
      .min(1, "ID Kategori tidak boleh kosong")
      .int()
      .positive("ID Kategori harus positif"),
  });

  static DELETE = z.object({
    packageId: z
      .number({ required_error: "ID Paket tidak boleh kosong" })
      .min(1, "ID Paket tidak boleh kosong")
      .int()
      .positive("ID Kategori harus positif"),
  });
}
