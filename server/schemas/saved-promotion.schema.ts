import { Schema, model } from "mongoose";

const savedPromotionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    promotionId: {
      type: Schema.Types.ObjectId,
      ref: "Promotion",
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Create unique index to prevent duplicate saves
savedPromotionSchema.index({ userId: 1, promotionId: 1 }, { unique: true });

export const SavedPromotion = model("SavedPromotion", savedPromotionSchema);
