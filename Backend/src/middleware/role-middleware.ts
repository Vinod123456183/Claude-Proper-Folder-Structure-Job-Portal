import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const isStudent = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  if (req.user.role !== "student") {
    return res
      .status(403)
      .json({ message: "Only students can apply for jobs", success: false });
  }

  next();
};

export const isRecruiter = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized", success: false });
  }

  if (req.user.role !== "recruiter") {
    return res.status(403).json({
      message: "Only recruiters can perform this action",
      success: false,
    });
  }

  next();
};
