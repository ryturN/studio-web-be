import express from "express";
import { adminMiddleware, authMiddleware } from "../middleware/middleware.js";
import { PackageController } from "../controller/package-controller.js";

export const packageRoute = express.Router();
packageRoute.post(
  "/v1/package",
  authMiddleware,
  adminMiddleware,
  PackageController.create,
);
packageRoute.get(
  "/v1/package/:packageId",
  authMiddleware,
  PackageController.get,
);
packageRoute.put(
  "/v1/package/:packageId",
  authMiddleware,
  adminMiddleware,
  PackageController.update,
);
packageRoute.delete(
  "/v1/package/:packageId",
  authMiddleware,
  adminMiddleware,
  PackageController.delete,
);
packageRoute.get("/v1/packages", PackageController.fetchAll);
