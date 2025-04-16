import { z } from "zod";

export class ImageValidation {
  static UPLOAD = z.object({
    entity: z.enum(["category", "transaction"], {
      required_error: "Entity tidak boleh kosong",
    }),
    images: z
      .array(
        z.object({
          originalname: z.string(),
          mimetype: z.string(),
          size: z.number().max(5 * 1024 * 1024, "Ukuran gambar maksimal 5MB"),
          buffer: z.instanceof(Buffer),
        }),
        {
          required_error: "Gambar tidak boleh kosong",
        },
      )
      .min(1, "Gambar yang diunggah minimal 1 gambar")
      .max(3, "Gambar yang diunggah maksimal 3 gambar"),
  });
}
