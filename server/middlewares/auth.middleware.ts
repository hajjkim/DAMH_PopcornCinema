
import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { User } from "../schemas/user.schema";

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const token = authHeader.split(" ")[1];
    const payload = verifyAccessToken(token);

    const user = await User.findById(payload.userId);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    if (user.status !== "ACTIVE") {
      res.status(403).json({ message: "User account is inactive" });
      return;
    }

    (req as any).auth = {
      userId: user.id,
      role: user.role,
    };

    (req as any).user = user;

    next();
  } catch (error) {
    console.error("Auth error:", error instanceof Error ? error.message : error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const auth = (req as any).auth;

    if (!auth) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const allowed = roles.map((r) => String(r).toUpperCase());
    const userRole = String(auth.role || "").toUpperCase();

    if (!allowed.includes(userRole)) {
      res.status(403).json({ message: "Forbidden" });
      return;
    }

    next();
  };
};
