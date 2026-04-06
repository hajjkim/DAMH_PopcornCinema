import { PromotionUsage } from "../schemas/promotion-usage.schema";

/**
 * Record that a user has used a promotion code
 */
export const recordPromotionUsage = async (
  userId: string,
  promotionCode: string,
  bookingId: string
) => {
  return await PromotionUsage.create({
    userId,
    promotionCode: promotionCode.toUpperCase(),
    bookingId,
  });
};

/**
 * Check if a user has already used a specific promotion
 */
export const hasUserUsedPromotion = async (
  userId: string,
  promotionCode: string
): Promise<boolean> => {
  const usage = await PromotionUsage.findOne({
    userId,
    promotionCode: promotionCode.toUpperCase(),
  });
  return !!usage;
};

/**
 * Get all promotion codes used by a user
 */
export const getUserUsedPromotions = async (
  userId: string
): Promise<string[]> => {
  const usages = await PromotionUsage.find({ userId }).distinct("promotionCode");
  return usages;
};

/**
 * Check which promotions a user has already used
 */
export const checkUserPromotionUsage = async (userId: string) => {
  const usedCodes = await getUserUsedPromotions(userId);
  return {
    usedPromotionCodes: usedCodes,
    count: usedCodes.length,
  };
};
