import { apiClient } from "./api";

export type SeatData = {
  _id: string;
  auditoriumId: string;
  seatRow: string;
  seatNumber: number;
  seatType: "VIP" | "COUPLE";
  extraPrice?: number;
  status: "ACTIVE" | "INACTIVE";
};

export const getSeatsByAuditorium = async (auditoriumId: string): Promise<SeatData[]> => {
  return apiClient.get<SeatData[]>(`/seats/auditorium/${auditoriumId}`);
};
