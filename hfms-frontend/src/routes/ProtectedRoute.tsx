import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface Props {
  children: React.ReactNode;
  requiredRole?: "ADMIN" | "STUDENT";
}

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin/dashboard" : "/student/home"}
        replace
      />
    );
  }

  return <>{children}</>;
}