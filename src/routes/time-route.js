import express from "express";
import { adminMiddleware, authMiddleware } from "../middleware/middleware.js";
import { TimeController } from "../controller/time-controller.js";

export const timeRoute = express.Router();
timeRoute.post(
  "/v1/time",
  authMiddleware,
  adminMiddleware,
  TimeController.create,
);
timeRoute.delete(
  "/v1/time/:timeId",
  authMiddleware,
  adminMiddleware,
  TimeController.delete,
);
timeRoute.get("/v1/times", TimeController.fetchAll);
