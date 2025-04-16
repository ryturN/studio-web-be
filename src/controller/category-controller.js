import { CategoryService } from "../service/category-service.js";

export class CategoryController {
  static async create(req, res, next) {
    try {
      const request = req.body;
      const response = await CategoryService.create(request);

      res.status(201).json({
        status: "success",
        code: 201,
        message: "Kategori berhasil ditambahkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req, res, next) {
    try {
      const request = Number(req.params.categoryId);
      const response = await CategoryService.get(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Kategori berhasil didapatkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const request = req.body;
      request.categoryId = Number(req.params.categoryId);

      const response = await CategoryService.update(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Kategori berhasil diubah",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const request = Number(req.params.categoryId);
      await CategoryService.delete(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Kategori berhasil dihapus",
      });
    } catch (e) {
      next(e);
    }
  }

  static async fetchAll(req, res, next) {
    try {
      const response = await CategoryService.fetchAll();

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Kategori berhasil didapatkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getLatest(req, res, next) {
    try {
      const response = await CategoryService.getLatest();

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Kategori terbaru berhasil didapatkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
