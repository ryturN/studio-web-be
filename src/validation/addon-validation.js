import { z } from "zod";

export class AddonValidation {
  static CREATE = z.object({
    name: z
      .string({ required_error: "Nama tambahan tidak boleh kosong" })
      .min(3, "Nama tambahan minimal 3 karakter")
      .max(255, "Nama tambahan maksimal 255 karakter"),
    unit: z
      .string({ required_error: "Satuan tidak boleh kosong" })
      .min(1, "Satuan tidak boleh kosong")
      .max(255, "Satuan maksimal 255 karakter"),
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

  static UPDATE = z.object({
    addonId: z
      .number({
        required_error: "ID Addon tidak boleh kosong",
      })
      .min(1, "ID Addon tidak boleh kosong")
      .int()
      .positive("ID Addon harus positif"),
    name: z
      .string({ required_error: "Nama tambahan tidak boleh kosong" })
      .min(3, "Nama tambahan minimal 3 karakter")
      .max(255, "Nama tambahan maksimal 255 karakter"),
    unit: z
      .string({ required_error: "Satuan tidak boleh kosong" })
      .min(1, "Satuan tidak boleh kosong")
      .max(255, "Satuan maksimal 255 karakter"),
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
    addonId: z
      .number({
        required_error: "ID Addon tidak boleh kosong",
      })
      .min(1, "ID Addon tidak boleh kosong")
      .int()
      .positive("ID Addon harus positif"),
  });

  static DELETE = z.object({
    addonId: z
      .number({
        required_error: "ID Addon tidak boleh kosong",
      })
      .min(1, "ID Addon tidak boleh kosong")
      .int()
      .positive("ID Addon harus positif"),
  });

  static GET_BY_CATEGORY = z.object({
    categoryId: z
      .number({
        required_error: "ID Kategori tidak boleh kosong",
      })
      .min(1, "ID Kategori tidak boleh kosong")
      .int()
      .positive("ID Kategori harus positif"),
  });
}
