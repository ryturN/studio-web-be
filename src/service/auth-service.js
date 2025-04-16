import { Validation } from "../validation/validation.js";
import { AuthValidation } from "../validation/auth-validation.js";
import { prisma } from "../application/db.js";
import { ResponseError } from "../error/response-error.js";
import { bcrypt } from "../application/bcrypt.js";
import jwt from "jsonwebtoken";


export class AuthService {
  static async register(request) {
    const registerRequest = Validation.validate(
      AuthValidation.REGISTER,
      request,
    );

    const isEmailExist = await prisma.user.findUnique({
      where: {
        email: registerRequest.email,
      },
    });

    if (isEmailExist) {
      throw new ResponseError("error", 400, "Email sudah terdaftar");
    }

    const hashPassword = await bcrypt.hash(request.password);

    return prisma.user.create({
      data: {
        name: registerRequest.name,
        email: registerRequest.email,
        phone: registerRequest.phone,
        password: hashPassword,
      },
      select: {
        name: true,
        email: true,
      },
    });
  }

  static async login(request) {
    const loginRequest = Validation.validate(AuthValidation.LOGIN, request);

    const user = await prisma.user.findFirst({
      where: {
        email: loginRequest.email,
      },
    });

    if (!user) {
      throw new ResponseError("error", 400, "Email atau password salah");
    }

    const isPasswordMatch = await bcrypt.verify(
      user.password,
      request.password,
    );

    if (!isPasswordMatch) {
      throw new ResponseError("error", 400, "Email atau password salah");
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    return {
      name: user.name,
      email: user.email,
      token,
    };
  }

  static async me(userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    if (!user) {
      throw new ResponseError("error", 404, "User tidak ditemukan");
    }

    return user;
  }
}
