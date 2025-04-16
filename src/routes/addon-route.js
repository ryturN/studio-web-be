import express from "express";
import { adminMiddleware, authMiddleware } from "../middleware/middleware.js";
import { AddonController } from "../controller/addon-controller.js";

export const addonRoute = express.Router();
addonRoute.post(
  "/v1/addon",
  authMiddleware,
  adminMiddleware,
  AddonController.create,
);
addonRoute.put(
  "/v1/addon/:addonId",
  authMiddleware,
  adminMiddleware,
  AddonController.update,
);
addonRoute.delete(
  "/v1/addon/:addonId",
  authMiddleware,
  adminMiddleware,
  AddonController.delete,
);
addonRoute.get("/v1/addon/:addonId", authMiddleware, AddonController.get);
addonRoute.get("/v1/addons", AddonController.fetchAll);
addonRoute.get(
  "/v1/addons/category/:categoryId",
  authMiddleware,
  AddonController.getAddonByCategory,
);
