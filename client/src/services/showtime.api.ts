import { apiRequest } from "./api";

export type Showtime = {
  _id: string;
  movieId: string;
  movieTitle?: string; // Movie title (if available)
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

// Transform backend showtime format to frontend format
const transformShowtime = (backendShowtime: any): Showtime | null => {
  // Skip if showtime or movieId is null/undefined (broken reference)
  if (!backendShowtime || !backendShowtime.movieId) {
    return null;
  }

  const startTime = new Date(backendShowtime.startTime);
  const date = startTime.toISOString().slice(0, 10);
  const time = `${String(startTime.getHours()).padStart(2, "0")}:${String(startTime.getMinutes()).padStart(2, "0")}`;
  const cinema = backendShowtime.auditoriumId?.cinemaId?.name || "Unknown Cinema";
  const movieId = typeof backendShowtime.movieId === "object" 
    ? backendShowtime.movieId._id 
    : backendShowtime.movieId;
  const movieTitle = backendShowtime.movieId?.title;

  return {
    _id: backendShowtime._id,
    movieId,
    movieTitle,
    cinema,
    date,
    time,
    seatLayout: [], // Placeholder
    createdAt: backendShowtime.createdAt,
    updatedAt: backendShowtime.updatedAt,
  };
};

// Lấy tất cả showtimes
export const getShowtimes = async (): Promise<Showtime[]> => {
  const response = await apiRequest("/showtimes", {
    method: "GET",
  });
  
  // Transform backend format to frontend format, filter out invalid showtimes
  return response
    .map(transformShowtime)
    .filter((showtime: Showtime | null): showtime is Showtime => showtime !== null);
};

// Lấy chi tiết showtime
export const getShowtimeById = async (id: string): Promise<Showtime> => {
  const response = await apiRequest(`/showtimes/${id}`, {
    method: "GET",
  });
  
  const result = transformShowtime(response);
  if (!result) {
    throw new Error("Invalid showtime data");
  }
  return result;
};

// Lấy danh sách ghế của một showtime
export const getShowtimeSeats = async (showtimeId: string): Promise<Showtime> => {
  const response = await apiRequest(`/showtimes/${showtimeId}/seats`, {
    method: "GET",
  });
  
  const result = transformShowtime(response);
  if (!result) {
    throw new Error("Invalid showtime data");
  }
  return result;
};

export const getShowtimeSeatStatus = async (
  showtimeId: string
): Promise<SeatStatusResponse> => {
  return apiRequest(`/showtimes/${showtimeId}/seats`, {
    method: "GET",
  });
};

