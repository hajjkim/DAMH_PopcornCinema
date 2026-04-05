import mongoose, { Schema, Document, model } from "mongoose";

export interface IPromotion {
  code: string;
  title: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxDiscount?: number | null;
  minOrderValue?: number;
  usageLimit?: number | null;
  usedCount?: number;
  applicableTo?: "ALL" | "TICKETS" | "SNACKS" | "BOTH";
  startDate: Date;
  endDate: Date;
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  imageUrl?: string;
}

export interface IPromotionDocument extends IPromotion, Document {}

const promotionSchema = new Schema<IPromotionDocument>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FIXED_AMOUNT"],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: function (this: any, value: number) {
          if (this.discountType === "PERCENTAGE") {
            return value >= 0 && value <= 100;
          }
          return value >= 0;
        },
        message: (props: any) =>
          props.value > 100
            ? "Giá trị phần trăm không được vượt quá 100"
            : "Giá trị giảm không được âm",
      },
    },
    maxDiscount: {
      type: Number,
      default: null,
      min: 0,
    },
    minOrderValue: {
      type: Number,
      default: 0,
      min: 0,
    },
    usageLimit: {
      type: Number,
      default: null,
    },
    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    applicableTo: {
      type: String,
      enum: ["ALL", "TICKETS", "SNACKS", "BOTH"],
      default: "ALL",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "INACTIVE", "EXPIRED"],
      default: "ACTIVE",
    },
    imageUrl: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

promotionSchema.index({ startDate: 1, endDate: 1 });

export const Promotion =
  mongoose.models.Promotion ||
  model<IPromotionDocument>("Promotion", promotionSchema);