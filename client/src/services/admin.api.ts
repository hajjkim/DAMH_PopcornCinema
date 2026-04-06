import { apiClient, apiRequest } from "./api";

export const adminAPI = {
  getStats: () => apiClient.get("/admin/stats"),

  getTopMovies: (limit: number = 4) =>
    apiClient.get(`/admin/top-movies?limit=${limit}`),

  getRevenueStats: () => apiClient.get("/admin/revenue-stats"),

  getUsersReport: (params?: {
    role?: string;
    status?: string;
    limit?: number;
    skip?: number;
  }) => {
    const queryString = params
      ? new URLSearchParams(params as any).toString()
      : "";
    return apiClient.get(`/admin/users/report${queryString ? `?${queryString}` : ""}`);
  },

  getMoviesReport: () => apiClient.get("/admin/movies/report"),

  getSnacksReport: () => apiClient.get("/admin/snacks/report"),

  getPaymentsReport: () => apiClient.get("/admin/payments/report"),
};

export const userAPI = {
  getAll: () => apiClient.get("/users"),

  getById: (id: string) => apiClient.get(`/users/admin/${id}`),

  update: (id: string, data: any) => apiClient.put(`/users/admin/${id}`, data),

  delete: (id: string) => apiClient.delete(`/users/admin/${id}`),

  changeRole: (id: string, role: string) =>
    apiClient.patch(`/users/admin/${id}/role`, { role }),

  changeStatus: (id: string, status: string) =>
    apiClient.patch(`/users/admin/${id}/status`, { status }),
};

export const promotionAPI = {
  getAll: () => apiClient.get("/promotions"),

  getActive: () => apiClient.get("/promotions/active"),

  getByCode: (code: string) => apiClient.get(`/promotions/code/${code}`),

  getById: (id: string) => apiClient.get(`/promotions/${id}`),

  validate: (code: string, orderValue: number) =>
    apiClient.post(`/promotions/validate/${code}`, { orderValue }),

  calculateDiscount: (id: string, orderValue: number) =>
    apiClient.post(`/promotions/${id}/calculate-discount`, { orderValue }),

  create: (data: any) => apiClient.post("/promotions", data),

  update: (id: string, data: any) => apiClient.put(`/promotions/${id}`, data),

  updateWithFile: (id: string, data: any, imageFile: File) => {
    const formData = new FormData();
    formData.append("image", imageFile);
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    return apiRequest(`/promotions/${id}`, { method: "PUT", body: formData, auth: true });
  },

  delete: (id: string) => apiClient.delete(`/promotions/${id}`),

  incrementUsage: (id: string) =>
    apiClient.patch(`/promotions/${id}/increment-usage`),
};

export const savedPromotionAPI = {
  getByUser: (userId: string) =>
    apiClient.get(`/saved-promotions/user/${userId}`),

  getCount: (userId: string) =>
    apiClient.get(`/saved-promotions/user/${userId}/count`),

  isSaved: (userId: string, promotionId: string) =>
    apiClient.get(`/saved-promotions/${userId}/${promotionId}/check`),

  save: (userId: string, promotionId: string) =>
    apiClient.post("/saved-promotions", { userId, promotionId }),

  unsave: (userId: string, promotionId: string) =>
    apiClient.delete(`/saved-promotions/${userId}/${promotionId}`),
};

export const cinemaAPI = {
  getAll: () => apiClient.get("/cinemas"),

  getById: (id: string) => apiClient.get(`/cinemas/${id}`),

  create: (data: any) => apiClient.post("/cinemas", data),

  update: (id: string, data: any) => apiClient.put(`/cinemas/${id}`, data),

  delete: (id: string) => apiClient.delete(`/cinemas/${id}`),
};

export const movieAPI = {
  getAll: () => apiClient.get("/movies"),

  getById: (id: string) => apiClient.get(`/movies/${id}`),

  create: (data: any) => apiClient.post("/movies", data),

  update: (id: string, data: any) => apiClient.put(`/movies/${id}`, data),

  updateWithFile: (id: string, data: any, posterFile: File) => {
    const formData = new FormData();
    formData.append("poster", posterFile);
    Object.entries(data).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        formData.append(key, JSON.stringify(value));
      } else if (value !== undefined && value !== null) {
        formData.append(key, String(value));
      }
    });
    return apiRequest(`/movies/${id}`, { method: "PUT", body: formData, auth: true });
  },

  delete: (id: string) => apiClient.delete(`/movies/${id}`),
};

export const showtimeAPI = {
  getAll: () => apiClient.get("/showtimes"),

  getById: (id: string) => apiClient.get(`/showtimes/${id}`),

  create: (data: any) => apiClient.post("/showtimes", data),

  update: (id: string, data: any) => apiClient.put(`/showtimes/${id}`, data),

  delete: (id: string) => apiClient.delete(`/showtimes/${id}`),
};

export const bookingAPI = {
  getAll: () => apiClient.get("/bookings/admin/all"),

  getById: (id: string) => apiClient.get(`/bookings/admin/${id}`),

  getByUser: (userId: string) => apiClient.get(`/bookings/user/${userId}`),

  create: (data: any) => apiClient.post("/bookings", data),

  update: (id: string, data: any) => apiClient.put(`/bookings/admin/${id}`, data),

  delete: (id: string) => apiClient.delete(`/bookings/admin/${id}`),

  cancel: (id: string) => apiClient.patch(`/bookings/${id}/cancel`, {}),
};

export const snackAPI = {
  getAll: () => apiClient.get("/snacks"),

  getById: (id: string) => apiClient.get(`/snacks/${id}`),

  create: (data: any) => apiClient.post("/snacks", data),

  update: (id: string, data: any) => apiClient.put(`/snacks/${id}`, data),

  delete: (id: string) => apiClient.delete(`/snacks/${id}`),
};

export const paymentAPI = {
  getAll: () => apiClient.get("/payments"),

  getById: (id: string) => apiClient.get(`/payments/${id}`),

  getByUser: (userId: string) => apiClient.get(`/payments/user/${userId}`),

  getStats: () => apiClient.get("/payments/stats"),

  create: (data: any) => apiClient.post("/payments", data),

  update: (id: string, data: any) => apiClient.put(`/payments/${id}`, data),

  refund: (id: string, reason: string) =>
    apiClient.post(`/payments/${id}/refund`, { reason }),
};
