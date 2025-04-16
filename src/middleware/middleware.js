import jwt from "jsonwebtoken";

export async function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).send({
      status: "error",
      code: 401,
      message: "Token tidak ditemukan",
    });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).send({
        status: "error",
        code: 403,
        message: "Token tidak valid",
      });
    }

    req.user = user;
    next();
  });
}

export async function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).send({
      status: "error",
      code: 403,
      message: "Anda tidak memiliki akses",
    });
  }

  next();
}
