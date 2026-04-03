import { apiRequest } from "./api";

export type Movie = {
  _id: string;
  title: string;
  poster?: string;
  description?: string;
  director?: string;
  actors?: string;
  genre: string;
  duration: number | string;
  language?: string;
  rating?: string;
  status?: "NOW_SHOWING" | "ENDED" | "COMING_SOON";
  releaseDate?: string;
  createdAt?: string;
  updatedAt?: string;
};

// Lấy tất cả phim
export const getMovies = async (): Promise<Movie[]> => {
  return apiRequest("/movies", {
    method: "GET",
  });
};

// Lấy chi tiết phim
export const getMovieById = async (id: string): Promise<Movie> => {
  return apiRequest(`/movies/${id}`, {
    method: "GET",
  });
};
