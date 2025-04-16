import { z } from "zod";

export class ReservationValidation {
  static CREATE = z.object({
    date: z
      .string({ required_error: "Tanggal tidak boleh kosong" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Format tanggal tidak valid",
      }),
    timeId: z
      .number({ required_error: "ID Waktu tidak boleh kosong" })
      .min(1, "ID Waktu tidak boleh kosong")
      .int()
      .positive("ID Waktu harus positif"),
    categoryId: z
      .number({ required_error: "ID Kategori tidak boleh kosong" })
      .min(1, "ID Kategori tidak boleh kosong")
      .int()
      .positive("ID Kategori harus positif"),
    categoryPackageId: z
      .number({ required_error: "ID Paket tidak boleh kosong" })
      .min(1, "ID Paket tidak boleh kosong")
      .int()
      .positive("ID Paket harus positif"),
    addons: z
      .array(
        z.object({
          id: z
            .number({ required_error: "ID Tambahan tidak boleh kosong" })
            .int()
            .positive("ID Tambahan harus positif"),
          quantity: z
            .number({ required_error: "Jumlah tambahan tidak boleh kosong" })
            .min(1, "Jumlah tambahan minimal 1")
            .max(10, "Jumlah tambahan maksimal 10")
            .int()
            .positive("Jumlah tambahan harus positif"),
        }),
        { required_error: "Tambahan tidak boleh kosong" },
      )
      .optional(),
  });

  static GET = z.object({
    reservationId: z.coerce
      .number({ required_error: "ID Reservasi tidak boleh kosong" })
      .min(1, "ID Reservasi tidak boleh kosong")
      .int()
      .positive("ID Reservasi harus positif"),
  });

  static GET_BY_DATE = z.object({
    date: z
      .string({ required_error: "Tanggal tidak boleh kosong" })
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Format tanggal tidak valid",
      }),
  });
}
