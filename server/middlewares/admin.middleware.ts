import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/jwt";

// Extend Express Request to include user info
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: string;
      };
    }
  }
}

/**
 * Middleware to check if user is authenticated and has ADMIN role
 */
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token is missing" });
    }

    const decoded = verifyAccessToken(token);
    if (!decoded) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded as { userId: string; role: string };
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};

/**
 * Middleware to check if user has ADMIN role
 * Must be used after authenticateToken
 */
export const requireAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user) {
    return res.status(401).json({ message: "User not authenticated" });
  }

  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Access denied: Admin role required" });
  }

  next();
};

/**
 * Combined middleware for admin authentication
 * Usage: router.post("/route", verifyAdminToken, handler)
 */
export const verifyAdminToken = [authenticateToken, requireAdmin];
