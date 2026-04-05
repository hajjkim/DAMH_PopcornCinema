
import jwt from "jsonwebtoken";

export interface JwtPayload {
  userId: string;
  role: string;
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET is missing in .env");
  }

  return secret;
};

export const signAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, getJwtSecret(), { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): JwtPayload => {
  return jwt.verify(token, getJwtSecret()) as JwtPayload;
};
// import jwt, { SignOptions } from "jsonwebtoken";

// export interface JwtPayload {
//   userId: string;
//   userRole?: string;
// }

// export const generateToken = (
//   payload: JwtPayload,
//   secret?: string,
//   expiresIn: SignOptions["expiresIn"] = "24h"
// ): string => {
//   const tokenSecret = secret || process.env.JWT_SECRET;

//   if (!tokenSecret) {
//     throw new Error("JWT_SECRET is not defined in environment variables");
//   }

//   return jwt.sign(payload, tokenSecret, { expiresIn });
// };

// export const verifyToken = (
//   token: string,
//   secret?: string
// ): JwtPayload => {
//   const tokenSecret = secret || process.env.JWT_SECRET;

//   if (!tokenSecret) {
//     throw new Error("JWT_SECRET is not defined in environment variables");
//   }

//   return jwt.verify(token, tokenSecret) as JwtPayload;
// };

// export const decodeToken = (token: string): JwtPayload | null => {
//   try {
//     return jwt.decode(token) as JwtPayload;
//   } catch {
//     return null;
//   }
// };
