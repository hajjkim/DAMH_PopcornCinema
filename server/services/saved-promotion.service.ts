import { SavedPromotion } from "../schemas/saved-promotion.schema";
import { Promotion } from "../schemas/promotion.schema";

export const getSavedPromotionsByUser = async (userId: string) => {
  return await SavedPromotion.find({ userId })
    .populate("promotionId")
    .sort({ savedAt: -1 });
};

export const isSaved = async (userId: string, promotionId: string) => {
  const saved = await SavedPromotion.findOne({ userId, promotionId });
  return !!saved;
};

export const savePromotion = async (userId: string, promotionId: string) => {
  const promotion = await Promotion.findById(promotionId);
  if (!promotion) throw new Error("Promotion not found");

  const existingSave = await SavedPromotion.findOne({
    userId,
    promotionId,
  });

  if (existingSave) {
    throw new Error("Promotion already saved");
  }

  const savedPromotion = await SavedPromotion.create({
    userId,
    promotionId,
    savedAt: new Date(),
  });

  return savedPromotion;
};

export const unsavePromotion = async (userId: string, promotionId: string) => {
  const result = await SavedPromotion.findOneAndDelete({
    userId,
    promotionId,
  });

  if (!result) throw new Error("Saved promotion not found");
  return result;
};

export const removeSavedPromotion = async (id: string) => {
  const result = await SavedPromotion.findByIdAndDelete(id);
  if (!result) throw new Error("Saved promotion not found");
  return result;
};

export const getSavedPromotionCount = async (userId: string) => {
  return await SavedPromotion.countDocuments({ userId });
};
