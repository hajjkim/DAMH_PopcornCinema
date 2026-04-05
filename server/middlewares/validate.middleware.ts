import { Request, Response, NextFunction } from "express";

export interface ValidationError {
  field: string;
  message: string;
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateRequired = (
  value: any,
  fieldName: string
): ValidationError | null => {
  if (!value || (typeof value === "string" && value.trim() === "")) {
    return {
      field: fieldName,
      message: `${fieldName} is required`,
    };
  }
  return null;
};

export const validateRegister = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { fullName, email, password } = req.body;
  const errors: ValidationError[] = [];

  // Check required fields
  if (validateRequired(fullName, "fullName")) {
    errors.push({ field: "fullName", message: "Full name is required" });
  }
  if (validateRequired(email, "email")) {
    errors.push({ field: "email", message: "Email is required" });
  }
  if (validateRequired(password, "password")) {
    errors.push({ field: "password", message: "Password is required" });
  }

  // Validate email format
  if (email && !validateEmail(email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  // Validate password strength
  if (password && !validatePassword(password)) {
    errors.push({
      field: "password",
      message: "Password must be at least 6 characters long",
    });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};

export const validateLogin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  const errors: ValidationError[] = [];

  if (validateRequired(email, "email")) {
    errors.push({ field: "email", message: "Email is required" });
  }
  if (validateRequired(password, "password")) {
    errors.push({ field: "password", message: "Password is required" });
  }

  if (email && !validateEmail(email)) {
    errors.push({ field: "email", message: "Invalid email format" });
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
};
