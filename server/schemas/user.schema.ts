import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  avatar?: string;
  role: "CUSTOMER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
  resetPasswordToken?: string;
  resetPasswordExpiresAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {}

const userSchema = new Schema<IUserDocument>(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    // select: false prevents passwordHash from being returned in queries by
    // default — callers must opt in with .select("+passwordHash")
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    role: {
      type: String,
      enum: ["CUSTOMER", "ADMIN"],
      default: "CUSTOMER",
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE"],
      default: "ACTIVE",
    },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export const User =
  mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);