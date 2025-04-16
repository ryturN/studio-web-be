import { ReviewService } from "../service/review-service.js";

export class ReviewController {
  static async create(req, res, next) {
    try {
      const request = req.body;
      const review = await ReviewService.create(request, req.user);

      return res.status(201).json({
        status: "success",
        code: 201,
        message: "Review berhasil dibuat",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req, res, next) {
    try {
      const request = Number(req.params.reservationId);
      const review = await ReviewService.get(request, req.user);

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Review berhasil didapatkan",
        data: review,
      });
    } catch (error) {
      next(error);
    }
  }

  static async fetchAll(req, res, next) {
    try {
      const reviews = await ReviewService.fetchAll();

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Review berhasil didapatkan",
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  }

  static async fetchSome(req, res, next) {
    try {
      const reviews = await ReviewService.fetchSome();

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Review berhasil didapatkan",
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  }
}
