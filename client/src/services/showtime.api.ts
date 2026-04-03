import { apiRequest } from "./api";

export type Showtime = {
  _id: string;
  movieId: string;
  cinema: string;
  date: string;
  time: string;
  seatLayout: string[];
  createdAt?: string;
  updatedAt?: string;
};

export type SeatStatusResponse = {
  allSeats: string[];
  heldSeats: string[];
  bookedSeats: string[];
};

// Lấy tất cả showtimes
export const getShowtimes = async (): Promise<Showtime[]> => {
  return apiRequest("/showtimes", {
    method: "GET",
  });
};

// Lấy chi tiết showtime
export const getShowtimeById = async (id: string): Promise<Showtime> => {
  return apiRequest(`/showtimes/${id}`, {
    method: "GET",
  });
};

// Lấy danh sách ghế của một showtime
export const getShowtimeSeats = async (showtimeId: string): Promise<Showtime> => {
  return apiRequest(`/showtimes/${showtimeId}/seats`, {
    method: "GET",
  });
};

export const getShowtimeSeatStatus = async (
  showtimeId: string
): Promise<SeatStatusResponse> => {
  return apiRequest(`/showtimes/${showtimeId}/seats`, {
    method: "GET",
  });
};

