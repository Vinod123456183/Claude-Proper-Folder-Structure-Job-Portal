import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;
    let token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized. No token provided",
        success: false,
      });
    }

    const secret = process.env.JWT_SECRET || "your_jwt_secret";
    const decoded = jwt.verify(token, secret) as {
      userId: string;
      role: string;
    }; // 👈 userId not id

    (req as any).user = { id: decoded.userId, role: decoded.role }; // 👈 normalize

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({
      message: "Unauthorized. Invalid token",
      success: false,
    });
  }
};
