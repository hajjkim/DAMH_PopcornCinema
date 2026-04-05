import mongoose, { Schema, Document, model } from "mongoose";

export interface ISnack {
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category?: "POPCORN" | "DRINK" | "CANDY" | "HOT_FOOD" | "OTHER";
  quantity?: number;
  status?: "ACTIVE" | "INACTIVE" | "OUT_OF_STOCK";
}

export interface ISnackDocument extends ISnack, Document {}

const snackSchema = new Schema<ISnackDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["POPCORN", "DRINK", "CANDY", "HOT_FOOD", "OTHER"],
      default: "OTHER",
    },
    quantity: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "OUT_OF_STOCK"],
      default: "ACTIVE",
    },
  },
  { timestamps: true }
);

export const Snack =
  mongoose.models.Snack || model<ISnackDocument>("Snack", snackSchema);