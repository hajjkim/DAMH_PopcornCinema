import { apiRequest } from "./api";

export type SeatHold = {
  _id: string;
  showtimeId: string;
  userId: string;
  seats: string[];
  expiresAt: string;
  createdAt?: string;
  updatedAt?: string;
};

export const createSeatHold = async (
  showtimeId: string,
  seats: string[]
): Promise<SeatHold> => {
  return apiRequest("/seat-holds", {
    method: "POST",
    auth: true,
    body: JSON.stringify({ showtimeId, seats }),
  });
};

export const releaseSeatHold = async (id: string): Promise<void> => {
  await apiRequest(`/seat-holds/${id}`, {
    method: "DELETE",
    auth: true,
  });
};

export const getMySeatHold = async (
  showtimeId?: string
): Promise<SeatHold | null> => {
  const params = showtimeId ? `?showtimeId=${showtimeId}` : "";
  return apiRequest(`/seat-holds/me${params}`, {
    method: "GET",
    auth: true,
  });
};
