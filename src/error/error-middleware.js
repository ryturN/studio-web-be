import { ZodError } from "zod";
import { ResponseError } from "./response-error.js";
import multer from "multer";

/**
 * @type {import('express').ErrorRequestHandler}
 */
export const errorMiddleware = (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ZodError) {
    res
      .status(400) // Using 400 for Bad Request as ZodError doesn't have a 'code' property
      .json({
        status: "error",
        code: 400,
        message: "Validation Error",
        errors: err.errors.map((error) => error.message),
      })
      .end();
  } else if (err instanceof ResponseError) {
    res
      .status(err.code)
      .json({
        status: err.status,
        code: err.code,
        message: err.message,
      })
      .end();
  } else if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      res
        .status(400)
        .json({
          status: "error",
          code: 400,
          message: "Ukuran gambar terlalu besar. Satu gambar maksimal 5MB",
        })
        .end();
    } else if (err.code === "LIMIT_UNEXPECTED_FILE") {
      res
        .status(400)
        .json({
          status: "error",
          code: 400,
          message: "Gambar yang diunggah maksimal 3 gambar",
        })
        .end();
    } else {
      res
        .status(500)
        .json({
          status: err.code,
          code: 500,
          message: err.message,
        })
        .end();
    }
  } else {
    res
      .status(500)
      .json({
        status: "error",
        code: 500,
        message: err.message,
      })
      .end();
  }
};
