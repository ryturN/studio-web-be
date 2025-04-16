import express from "express";
import { authMiddleware } from "../middleware/middleware.js";
import { upload } from "../utils/multer.js";
import { ImageController, SupabaseImageController } from "../controller/image-controller.js";

export const imageRoute = express.Router();
imageRoute.post(
  "/v1/upload",
  authMiddleware,
  upload.array("images", 3),
  SupabaseImageController.upload,
);