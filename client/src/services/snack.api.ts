import { apiRequest } from "./api";

export type Snack = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdAt: string;
  updatedAt: string;
};

// Lấy tất cả snacks
export const getSnacks = async (): Promise<Snack[]> => {
  return apiRequest("/snacks", {
    method: "GET",
  });
};
