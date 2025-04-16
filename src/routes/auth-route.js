import express from "express";
import { AuthController } from "../controller/auth-controller.js";
import { authMiddleware } from "../middleware/middleware.js";

export const authRoute = express.Router();
authRoute.post("/v1/register", AuthController.register);
authRoute.post("/v1/login", AuthController.login);
authRoute.get("/v1/me", authMiddleware, AuthController.me);
