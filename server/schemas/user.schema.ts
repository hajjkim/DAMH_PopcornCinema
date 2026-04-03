import mongoose, { Document, Schema } from "mongoose";

export interface IUser {
  fullName: string;
  email: string;
  passwordHash: string;
  phone?: string;
  avatar?: string;
  role: "CUSTOMER" | "ADMIN";
  status: string;
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
    passwordHash: { type: String, required: true },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    role: { type: String, default: "CUSTOMER" },
    status: { type: String, default: "ACTIVE" },
    resetPasswordToken: { type: String },
    resetPasswordExpiresAt: { type: Date },
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model<IUserDocument>("User", userSchema);