import express from "express";
import { CategoryController } from "../controller/category-controller.js";
import { adminMiddleware, authMiddleware } from "../middleware/middleware.js";

export const categoryRoute = express.Router();
categoryRoute.post(
  "/v1/category",
  authMiddleware,
  adminMiddleware,
  CategoryController.create,
);
categoryRoute.put(
  "/v1/category/:categoryId",
  authMiddleware,
  adminMiddleware,
  CategoryController.update,
);
categoryRoute.get("/v1/category/:categoryId", CategoryController.get);
categoryRoute.delete(
  "/v1/category/:categoryId",
  authMiddleware,
  adminMiddleware,
  CategoryController.delete,
);
categoryRoute.get("/v1/categories", CategoryController.fetchAll);
categoryRoute.get("/v1/categories/latest", CategoryController.getLatest);
