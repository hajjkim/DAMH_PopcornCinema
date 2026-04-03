import { apiRequest } from "./api";

export type Promotion = {
  _id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  maxDiscount?: number;
  minOrderValue?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageLimit?: number;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
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
