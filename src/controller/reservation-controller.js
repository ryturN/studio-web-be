import { ReservationService } from "../service/reservation-service.js";

export class ReservationController {
  static async create(req, res, next) {
    try {
      const request = req.body;
      const user = req.user;
      const response = await ReservationService.create(request, user);

      return res.status(201).json({
        status: "success",
        code: 201,
        message: "Reservasi berhasil ditambahkan",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async setSuccess(req, res, next) {
    try {
      const request = req.params.reservationId;
      console.log(request)
      const response = await ReservationService.setSuccess(request);

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Reservasi telah selesai",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async setCancel(req, res, next) {
    try {
      console.log('test')
      const request = req.params.reservationId;
      const response = await ReservationService.setCancel(request);

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Reservasi telah dibatalkan",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async fetchAll(req, res, next) {
    try {
      const response = await ReservationService.fetchAll();

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Reservasi berhasil didapatkan",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReservationByDate(req, res, next) {
    try {
      const request = req.query.date;
      const response = await ReservationService.getReservationByDate(request);

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Reservasi hari ini berhasil didapatkan",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async get(req, res, next) {
    try {
      const request = req.params.reservationId;
      const response = await ReservationService.get(request);

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Reservasi berhasil didapatkan",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }

  static async getReservationByUser(req, res, next) {
    try {
      const user = req.user;
      const response = await ReservationService.getReservationByUser(user.id);

      return res.status(200).json({
        status: "success",
        code: 200,
        message: "Reservasi berhasil didapatkan",
        data: response,
      });
    } catch (error) {
      next(error);
    }
  }
}
