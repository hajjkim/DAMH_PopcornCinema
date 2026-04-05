import { apiRequest } from "./api";

export type Movie = {
  _id: string;
  title: string;
  genres: string[];
  duration: number;
  releaseDate: string;
  status: "NOW_SHOWING" | "ENDED" | "COMING_SOON";
  poster?: string;
  description?: string;
  director?: string;
  actors?: string[];
  language?: string;
  rating?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Cinema = {
  _id: string;
  name: string;
  area?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type Auditorium = {
  _id: string;
  cinemaId: {
    _id: string;
    name: string;
  };
  name: string;
  totalRows: number;
  totalColumns: number;
  seatCapacity: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
  updatedAt?: string;
};

// Movie API functions
export const movieAPI = {
  getAll: async (): Promise<Movie[]> => {
    return apiRequest("/movies", { method: "GET" });
  },
  getById: async (id: string): Promise<Movie> => {
    return apiRequest(`/movies/${id}`, { method: "GET" });
  },
  create: async (data: any) => {
    return apiRequest("/movies", { method: "POST", body: JSON.stringify(data) });
  },
  update: async (id: string, data: any) => {
    return apiRequest(`/movies/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  delete: async (id: string) => {
    return apiRequest(`/movies/${id}`, { method: "DELETE" });
  },
};

// Cinema API functions
export const cinemaAPI = {
  getAll: async (): Promise<Cinema[]> => {
    return apiRequest("/cinemas", { method: "GET" });
  },
  getById: async (id: string): Promise<Cinema> => {
    return apiRequest(`/cinemas/${id}`, { method: "GET" });
  },
  create: async (data: any) => {
    return apiRequest("/cinemas", { method: "POST", body: JSON.stringify(data) });
  },
  update: async (id: string, data: any) => {
    return apiRequest(`/cinemas/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  delete: async (id: string) => {
    return apiRequest(`/cinemas/${id}`, { method: "DELETE" });
  },
};

// Auditorium API functions
export const auditoriumAPI = {
  getAll: async (): Promise<Auditorium[]> => {
    return apiRequest("/auditoriums", { method: "GET" });
  },
  getById: async (id: string): Promise<Auditorium> => {
    return apiRequest(`/auditoriums/${id}`, { method: "GET" });
  },
  create: async (data: any) => {
    return apiRequest("/auditoriums", { method: "POST", body: JSON.stringify(data) });
  },
  update: async (id: string, data: any) => {
    return apiRequest(`/auditoriums/${id}`, { method: "PUT", body: JSON.stringify(data) });
  },
  delete: async (id: string) => {
    return apiRequest(`/auditoriums/${id}`, { method: "DELETE" });
  },
};

// Legacy function exports for backward compatibility
export const getMovies = async (): Promise<Movie[]> => {
  return movieAPI.getAll();
};

export const getMovieById = async (id: string): Promise<Movie> => {
  return movieAPI.getById(id);
};
