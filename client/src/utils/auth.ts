import { users } from "../data/users";

export const login = (email: string, password: string) => {
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    return user;
  }

  return null;
};

export const getCurrentUser = () => {
  const data = localStorage.getItem("currentUser");
  return data ? JSON.parse(data) : null;
};

export const logout = () => {
  localStorage.removeItem("currentUser");
};