import { Promotion } from "../schemas/promotion.schema";

type CreatePromotionInput = {
  code: string;
  title: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  usageLimit?: number;
  applicableTo?: string;
  startDate: Date;
  endDate: Date;
  status?: string;
  imageUrl?: string;
};

type UpdatePromotionInput = Partial<CreatePromotionInput>;

export const getAllPromotions = async () => {
  return await Promotion.find().sort({ createdAt: -1 });
};

export const getPromotionById = async (id: string) => {
  const promotion = await Promotion.findById(id);
  if (!promotion) throw new Error("Promotion not found");
  return promotion;
};

export const getPromotionByCode = async (code: string) => {
  const promotion = await Promotion.findOne({ code: code.toUpperCase() });
  if (!promotion) throw new Error("Promotion code not found");
  return promotion;
};

export const getActivePromotions = async () => {
  const now = new Date();
  return await Promotion.find({
    status: "ACTIVE",
    startDate: { $lte: now },
    endDate: { $gte: now },
  }).sort({ createdAt: -1 });
};

export const createPromotion = async (data: CreatePromotionInput) => {
  const existingPromotion = await Promotion.findOne({
    code: data.code.toUpperCase(),
  });

  if (existingPromotion) {
    throw new Error("Promotion code already exists");
  }

  const promotion = await Promotion.create({
    ...data,
    code: data.code.toUpperCase(),
  });

  return promotion;
};

export const updatePromotion = async (id: string, data: UpdatePromotionInput) => {
  const promotion = await Promotion.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });

  if (!promotion) throw new Error("Promotion not found");
  return promotion;
};

export const deletePromotion = async (id: string) => {
  const promotion = await Promotion.findByIdAndDelete(id);
  if (!promotion) throw new Error("Promotion not found");
  return promotion;
};

export const validatePromotionCode = async (
  code: string,
  orderValue: number
) => {
  const promotion = await getPromotionByCode(code);

  const now = new Date();
  if (promotion.startDate > now || promotion.endDate < now) {
    throw new Error("Promotion is not active");
  }

  if (
    promotion.usageLimit &&
    promotion.usedCount >= promotion.usageLimit
  ) {
    throw new Error("Promotion usage limit exceeded");
  }

  if (orderValue < promotion.minOrderValue) {
    throw new Error(
      `Minimum order value of ${promotion.minOrderValue} required`
    );
  }

  return promotion;
};

export const calculateDiscount = async (
  promotionId: string,
  orderValue: number
) => {
  const promotion = await Promotion.findById(promotionId);
  if (!promotion) throw new Error("Promotion not found");

  let discount = 0;

  if (promotion.discountType === "PERCENTAGE") {
    discount = (orderValue * promotion.discountValue) / 100;
    if (promotion.maxDiscount && discount > promotion.maxDiscount) {
      discount = promotion.maxDiscount;
    }
  } else if (promotion.discountType === "FIXED_AMOUNT") {
    discount = promotion.discountValue;
  }

  return Math.min(discount, orderValue);
};

export const incrementUsageCount = async (id: string) => {
  const promotion = await Promotion.findByIdAndUpdate(
    id,
    { $inc: { usedCount: 1 } },
    { new: true }
  );

  if (!promotion) throw new Error("Promotion not found");
  return promotion;
};
