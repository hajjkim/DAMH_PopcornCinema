
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token");
};

type RequestOptions = RequestInit & {
  auth?: boolean;
};

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { auth = false, headers, body, ...rest } = options;

  const finalHeaders = new Headers(headers || {});
  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;

  if (!isFormData && !finalHeaders.has("Content-Type")) {
    finalHeaders.set("Content-Type", "application/json");
  }

  if (auth) {
    const token = getAuthToken();
    if (token) {
      finalHeaders.set("Authorization", `Bearer ${token}`);
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...rest,
    headers: finalHeaders,
    body,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export const apiClient = {
  get: <T = any>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "GET", headers, auth: true }),

  post: <T = any>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "POST", body: JSON.stringify(body), headers, auth: true }),

  put: <T = any>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "PUT", body: JSON.stringify(body), headers, auth: true }),

  patch: <T = any>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "PATCH", body: JSON.stringify(body), headers, auth: true }),

  delete: <T = any>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: "DELETE", headers, auth: true }),
};
