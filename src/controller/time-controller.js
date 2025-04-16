import { TimeService } from "../service/time-service.js";

export class TimeController {
  static async create(req, res, next) {
    try {
      const time = await TimeService.create(req.body);
      return res.status(201).json({
        status: "success",
        code: 201,
        message: "Waktu berhasil ditambahkan",
        data: time,
      });
    } catch (e) {
      next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const time = Number(req.params.timeId);
      await TimeService.delete(time);

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Waktu berhasil dihapus",
      });
    } catch (e) {
      next(e);
    }
  }

  static async fetchAll(req, res, next) {
    try {
      const response = await TimeService.fetchAll();

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Waktu berhasil didapatkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
