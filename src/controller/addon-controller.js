import { AddonService } from "../service/addon-service.js";

export class AddonController {
  static async create(req, res, next) {
    try {
      const request = req.body;
      const response = await AddonService.create(request);

      res.status(201).send({
        status: "success",
        code: 201,
        message: "Tambahan berhasil dibuat",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async update(req, res, next) {
    try {
      const request = req.body;
      request.addonId = Number(req.params.addonId);
      const response = await AddonService.update(request);

      res.status(200).send({
        status: "success",
        code: 200,
        message: "Tambahan berhasil diubah",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const request = Number(req.params.addonId);
      await AddonService.delete(request);

      res.status(200).send({
        status: "success",
        code: 200,
        message: "Tambahan berhasil dihapus",
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req, res, next) {
    try {
      const request = Number(req.params.addonId);
      const response = await AddonService.get(request);

      res.status(200).send({
        status: "success",
        code: 200,
        message: "Tamabahan berhasil ditemukan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async fetchAll(req, res, next) {
    try {
      const response = await AddonService.fetchAll();

      res.status(200).send({
        status: "success",
        code: 200,
        message: "Tambahan berhasil ditemukan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getAddonByCategory(req, res, next) {
    try {
      const request = Number(req.params.categoryId);
      const response = await AddonService.getAddonByCategory(request);

      res.status(200).send({
        status: "success",
        code: 200,
        message: "Tambahan berhasil ditemukan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
