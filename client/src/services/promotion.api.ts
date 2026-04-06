import { apiRequest } from "./api";

export type Promotion = {
  _id: string;
  code: string;
  title: string;
  description?: string;
  discountType: "PERCENTAGE" | "FIXED_AMOUNT";
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  startDate: string;
  endDate: string;
  status?: "ACTIVE" | "INACTIVE" | "EXPIRED";
  usageLimit?: number;
  usedCount?: number;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Lấy tất cả khuyến mãi
export const getPromotions = async (): Promise<Promotion[]> => {
  return apiRequest("/promotions", {
    method: "GET",
  });
};

// Lấy chi tiết khuyến mãi
export const getPromotionById = async (id: string): Promise<Promotion> => {
  return apiRequest(`/promotions/${id}`, {
    method: "GET",
  });
};
