import { z } from "zod";

export class CategoryValidation {
  static CREATE = z.object({
    name: z
      .string({ required_error: "Nama kategori tidak boleh kosong" })
      .min(3, "Nama minimal 3 karakter")
      .max(255, "Nama maksimal 255 karakter"),
    deskripsi: z
      .string({ required_error: "Deskripsi kategori tidak boleh kosong" })
      .min(3, "Nama minimal 3 karakter")
      .max(255, "Nama maksimal 255 karakter"),
    images: z
      .array(z.string(), {
        required_error: "Gambar tidak boleh kosong",
      })
      .min(1, "Gambar minimal 1")
      .max(3, "Gambar maksimal 3"),
  });

  static UPDATE = z.object({
    categoryId: z
      .number({
        required_error: "ID Kategori tidak boleh kosong",
      })
      .min(1, "ID Kategori tidak boleh kosong")
      .int()
      .positive("ID Kategori harus positif"),
    name: z
      .string({ required_error: "Nama kategori tidak boleh kosong" })
      .min(3, "Nama minimal 3 karakter")
      .max(255, "Nama maksimal 255 karakter"),
    deskripsi: z
      .string({ required_error: "Deskripsi kategori tidak boleh kosong" })
      .min(3, "Nama minimal 3 karakter")
      .max(255, "Nama maksimal 255 karakter"),
    images: z
      .array(z.string(), {
        required_error: "Gambar tidak boleh kosong",
      })
      .min(1, "Gambar minimal 1")
      .max(3, "Gambar maksimal 3"),
  });

  static GET = z.object({
    categoryId: z
      .number({
        required_error: "ID Kategori tidak boleh kosong",
      })
      .min(1, "ID Kategori tidak boleh kosong")
      .int()
      .positive("ID Kategori harus positif"),
  });

  static DELETE = z.object({
    categoryId: z
      .number({
        required_error: "ID Kategori tidak boleh kosong",
      })
      .min(1, "ID Kategori tidak boleh kosong")
      .int()
      .positive("ID Kategori harus positif"),
  });
}
