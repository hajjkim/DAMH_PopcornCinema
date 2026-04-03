export type CurrentUser = {
  _id?: string;
  id?: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role?: string;
  status?: string;
};

const TOKEN_KEY = "token";
const USER_KEY = "currentUser";

export const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

export const getCurrentUser = (): CurrentUser | null => {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const setCurrentUser = (user: CurrentUser) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth-changed"));
};

export const saveAuth = (token: string, user: CurrentUser) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event("auth-changed"));
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("auth-changed"));
};

export const isAuthenticated = (): boolean => !!getToken();