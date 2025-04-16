import { PackageService } from "../service/package-service.js";

export class PackageController {
  static async create(req, res, next) {
    try {
      const request = req.body;
      const response = await PackageService.create(request);

      res.status(201).json({
        status: "success",
        code: 201,
        message: "Paket berhasil ditambahkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req, res, next) {
    try {
      const request = Number(req.params.packageId);
      const response = await PackageService.get(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Paket berhasil didapatkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const request = req.body;
      request.packageId = Number(req.params.packageId);

      const response = await PackageService.update(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Paket berhasil diubah",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const request = Number(req.params.packageId);
      await PackageService.delete(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Paket berhasil dihapus",
      });
    } catch (e) {
      next(e);
    }
  }

  static async fetchAll(req, res, next) {
    try {
      const response = await PackageService.fetchAll();

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Paket berhasil didapatkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
