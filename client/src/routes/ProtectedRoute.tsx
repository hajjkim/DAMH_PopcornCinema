import { Navigate } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

type Props = {
  children: React.ReactNode;
};

export default function ProtectedRoute({ children }: Props) {
  const authed = isAuthenticated();

  if (!authed) {
    return <Navigate to="/auth/login" replace />;
  }

  return <>{children}</>;
}