import multer from "multer";
import { ResponseError } from "../error/response-error.js";

const imageFileFilter = (req, file, cb) => {
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/jpg"];

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ResponseError("error", 400, "Gambar harus berupa png/jpg/jpeg"),
      false,
    );
  }
};

export const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
