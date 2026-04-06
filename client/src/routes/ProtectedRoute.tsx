import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentUser } from "../utils/auth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const authed = isAuthenticated();
  const currentUser = getCurrentUser();

  if (!authed) {
    return <Navigate to="/auth/login" replace />;
  }

  // Check if user has ADMIN role
  if (currentUser?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}