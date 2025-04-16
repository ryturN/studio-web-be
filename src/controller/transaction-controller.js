import { TransactionService } from "../service/transaction-service.js";

export class TransactionController {
  static async create(req, res, next) {
    try {
      const request = req.body;
      const response = await TransactionService.create(request);

      res.status(201).json({
        status: "success",
        code: 201,
        message: "Transaksi berhasil ditambahkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async pay(req, res, next) {
    try {
      const request = req.body;
      request.transactionId = Number(req.params.transactionId);
      const response = await TransactionService.pay(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Bukti pembayaran berhasil dikirim",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async get(req, res, next) {
    try {
      const request = Number(req.params.transactionId);
      const response = await TransactionService.get(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Transaksi berhasil ditemukan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async setValid(req, res, next) {
    try {
      const request = req.body;
      request.transactionId = Number(req.params.transactionId);
      request.transactionDetailId = Number(req.params.transactionDetailId);
      const response = await TransactionService.setValid(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Transaksi berhasil divalidasi",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async setInvalid(req, res, next) {
    try {
      const request = req.body;
      request.transactionId = Number(req.params.transactionId);
      request.transactionDetailId = Number(req.params.transactionDetailId);
      const response = await TransactionService.setInvalid(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Transaksi berhasil divalidasi",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async setPaidOff(req, res, next) {
    try {
      const request = Number(req.params.transactionId);
      const response = await TransactionService.setPaidOff(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Transaksi telah diselesaikan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async getTransactionByReservation(req, res, next) {
    try {
      const request = Number(req.params.reservationId);
      const response =
        await TransactionService.getTransactionByReservation(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Transaksi berhasil ditemukan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async fetchAll(req, res, next) {
    try {
      const response = await TransactionService.fetchAll();

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Transaksi berhasil didapatkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
