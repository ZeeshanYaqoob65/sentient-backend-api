import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    uid: number;
    username: string;
    utype: number;
    asid?: number;
  };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    ) as any;
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

export const baOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.utype !== 4) {
    return res.status(403).json({ error: "Access denied. BA only." });
  }
  next();
};

export const supervisorOnly = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.utype !== 3) {
    return res.status(403).json({ error: "Access denied. Supervisor only." });
  }
  next();
};
