import { z } from "zod";

export class TransactionValidation {
  static CREATE = z.object({
    reservationId: z
      .number({
        required_error: "ID Reservasi tidak boleh kosong",
      })
      .min(1, "ID Reservasi tidak boleh kosong")
      .int()
      .positive("ID Reservasi harus positif"),
    type: z.enum(["downpayment", "fullpayment"], {
      required_error: "Tipe transaksi tidak boleh kosong",
    }),
  });

  static UPDATE = z.object({
    transactionId: z
      .number({ required_error: "ID Transaksi tidak boleh kosong" })
      .min(1, "ID Transaksi tidak boleh kosong")
      .int()
      .positive("ID Transaksi harus positif"),
    image: z.string({ required_error: "Bukti pembayaran tidak boleh kosong" }),
  });

  static GET = z.object({
    transactionId: z
      .number({ required_error: "ID Transaksi tidak boleh kosong" })
      .min(1, "ID Transaksi tidak boleh kosong")
      .int()
      .positive("ID Transaksi harus positif"),
  });

  static SET_VALID = z.object({
    transactionId: z
      .number({
        required_error: "ID transaksi tidak boleh kosong",
      })
      .min(1, "ID transaksi tidak boleh kosong")
      .int()
      .positive("ID transaksi harus positif"),
    transactionDetailId: z
      .number({
        required_error: "ID detail transaksi tidak boleh kosong",
      })
      .min(1, "ID detail transaksi tidak boleh kosong")
      .int()
      .positive("ID detail transaksi harus positif"),
  });

  static GET_BY_RESERVATION = z.object({
    reservationId: z
      .number({
        required_error: "ID reservasi tidak boleh kosong",
      })
      .min(1, "ID reservasi tidak boleh kosong")
      .int()
      .positive("ID reservasi harus positif"),
  });
}
