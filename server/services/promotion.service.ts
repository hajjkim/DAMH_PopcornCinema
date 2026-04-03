import { Promotion } from "../schemas/promotion.schema";

export const getAllPromotions = async () => {
  return Promotion.find().lean();
};

export const getPromotionById = async (id: string) => {
  return Promotion.findById(id).lean();
};
