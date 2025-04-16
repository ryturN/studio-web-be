import express from "express";
import { ReviewController } from "../controller/review-controller.js";
import { adminMiddleware, authMiddleware } from "../middleware/middleware.js";

export const reviewRoute = express.Router();
reviewRoute.post("/v1/review", authMiddleware, ReviewController.create);
reviewRoute.get(
  "/v1/review/:reservationId",
  authMiddleware,
  ReviewController.get,
);
reviewRoute.get(
  "/v1/reviews",
  authMiddleware,
  adminMiddleware,
  ReviewController.fetchAll,
);
reviewRoute.get("/v1/reviews/some", ReviewController.fetchSome);
