import { Schema, model } from "mongoose";

const promotionUsageSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    promotionCode: {
      type: String,
      required: true,
      uppercase: true,
    },
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    usedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Index to quickly find if user has used a promotion
promotionUsageSchema.index({ userId: 1, promotionCode: 1 });
promotionUsageSchema.index({ userId: 1 });

export const PromotionUsage = model("PromotionUsage", promotionUsageSchema);
