import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

interface Props {
  children: React.ReactNode;
}

export default function PublicRoute({ children }: Props) {
  const user = useAuthStore((s) => s.user);

  if (user) {
    return (
      <Navigate
        to={user.role === "ADMIN" ? "/admin/dashboard" : "/student/home"}
        replace
      />
    );
  }

  return <>{children}</>;
}