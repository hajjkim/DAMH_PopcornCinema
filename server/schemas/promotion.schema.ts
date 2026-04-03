import mongoose, { Schema, Document } from "mongoose";

export interface IPromotion {
  title: string;
  code: string;
  discount: string;
}

export interface IPromotionDocument extends IPromotion, Document {}

const promotionSchema = new Schema<IPromotionDocument>({
  title: { type: String, required: true },
  code: { type: String, required: true },
  discount: { type: String, required: true },
}, { timestamps: true });


export const Promotion =
  mongoose.models.Promotion ||
  mongoose.model<IPromotionDocument>("Promotion", promotionSchema);