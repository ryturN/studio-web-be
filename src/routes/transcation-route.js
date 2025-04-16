import express from "express";
import { adminMiddleware, authMiddleware } from "../middleware/middleware.js";
import { TransactionController } from "../controller/transaction-controller.js";

export const transactionRoute = express.Router();
transactionRoute.post(
  "/v1/transaction",
  authMiddleware,
  TransactionController.create,
);
transactionRoute.get(
  "/v1/transactions",
  authMiddleware,
  adminMiddleware,
  TransactionController.fetchAll,
);
transactionRoute.get(
  "/v1/transaction/:transactionId",
  authMiddleware,
  TransactionController.get,
);
transactionRoute.post(
  "/v1/transaction/:transactionId/pay",
  authMiddleware,
  TransactionController.pay,
);
transactionRoute.put(
  "/v1/transaction/:transactionId/valid/:transactionDetailId",
  authMiddleware,
  adminMiddleware,
  TransactionController.setValid,
);
transactionRoute.put(
  "/v1/transaction/:transactionId/invalid/:transactionDetailId",
  authMiddleware,
  adminMiddleware,
  TransactionController.setInvalid,
);
transactionRoute.put(
  "/v1/transaction/:transactionId/paid",
  authMiddleware,
  adminMiddleware,
  TransactionController.setPaidOff,
);
transactionRoute.get(
  "/v1/transaction/reservation/:reservationId",
  authMiddleware,
  TransactionController.getTransactionByReservation,
);
