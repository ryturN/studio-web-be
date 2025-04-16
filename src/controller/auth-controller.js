import { AuthService } from "../service/auth-service.js";

export class AuthController {
  static async register(req, res, next) {
    try {
      const request = req.body;
      const response = await AuthService.register(request);

      res.status(200).json({
        status: "success",
        code: 201,
        message: "User berhasil didaftarkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async login(req, res, next) {
    try {
      const request = req.body;
      const response = await AuthService.login(request);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "Login berhasil",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }

  static async me(req, res, next) {
    try {
      const request = req.user;
      const response = await AuthService.me(request.id);

      res.status(200).json({
        status: "success",
        code: 200,
        message: "User berhasil didapatkan",
        data: response,
      });
    } catch (e) {
      next(e);
    }
  }
}
