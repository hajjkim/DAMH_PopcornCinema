
import { apiRequest } from "./api";

export type User = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  status?: string;
};

export type AuthResponse = {
  message?: string;
  token: string;
  user: User;
};

export type UpdateProfileInput = {
  fullName?: string;
  phone?: string;
  avatar?: string;
  avatarFile?: File | null;
};

export async function loginApi(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(
  fullName: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return apiRequest<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName, email, password }),
  });
}

export async function getMyProfile(): Promise<User> {
  return apiRequest<User>("/users/me", {
    method: "GET",
    auth: true,
  });
}

export async function updateMyProfile(payload: UpdateProfileInput): Promise<User> {
  const hasAvatarFile = !!payload.avatarFile;

  if (hasAvatarFile) {
    const formData = new FormData();

    if (payload.fullName !== undefined) formData.append("fullName", payload.fullName);
    if (payload.phone !== undefined) formData.append("phone", payload.phone);
    if (payload.avatarFile) formData.append("avatar", payload.avatarFile);

    return apiRequest<User>("/users/me", {
      method: "PATCH",
      auth: true,
      body: formData,
    });
  }

  return apiRequest<User>("/users/me", {
    method: "PATCH",
    auth: true,
    body: JSON.stringify({
      fullName: payload.fullName,
      phone: payload.phone,
      avatar: payload.avatar,
    }),
  });
}
// import { apiClient } from "./api";

// export const authAPI = {
//   register: (data: { fullName: string; email: string; password: string }) =>
//     apiClient.post("/auth/register", data),

//   login: (data: { email: string; password: string }) =>
//     apiClient.post("/auth/login", data),
// };
