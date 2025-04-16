import express from "express";
import { adminMiddleware, authMiddleware } from "../middleware/middleware.js";
import { ReservationController } from "../controller/reservation-controller.js";

export const reservationRoute = express.Router();
reservationRoute.post(
  "/v1/reservation",
  authMiddleware,
  ReservationController.create,
);
reservationRoute.get(
  "/v1/reservations",
  authMiddleware,
  adminMiddleware,
  ReservationController.fetchAll,
);
reservationRoute.patch(
  "/v1/reservation/:reservationId/success",
  authMiddleware,
  adminMiddleware,
  ReservationController.setSuccess,
);
reservationRoute.patch(
  "/v1/reservation/:reservationId/cancel",
  authMiddleware,
  adminMiddleware,
  ReservationController.setCancel,
);
reservationRoute.get(
  "/v1/reservation/date",
  authMiddleware,
  ReservationController.getReservationByDate,
);
reservationRoute.get(
  "/v1/reservation/:reservationId",
  authMiddleware,
  ReservationController.get,
);
reservationRoute.get(
  "/v1/reservations/user",
  authMiddleware,
  ReservationController.getReservationByUser,
);
