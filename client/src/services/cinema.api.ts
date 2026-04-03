import { apiRequest } from "./api";

export type Cinema = {
  _id: string;
  name: string;
  area?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

export const getCinemas = async (): Promise<Cinema[]> => {
  return apiRequest("/cinemas", {
    method: "GET",
  });
};

export const getCinemaById = async (id: string): Promise<Cinema> => {
  return apiRequest(`/cinemas/${id}`, {
    method: "GET",
  });
};
