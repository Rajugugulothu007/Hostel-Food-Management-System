import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuthStore } from "../store/authStore";

export function useLogout() {
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);

  const requestLogout = () => setShowConfirm(true);

  const confirmLogout = () => {
    logout();
    setShowConfirm(false);
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const cancelLogout = () => setShowConfirm(false);

  return {
    showConfirm,
    requestLogout,
    confirmLogout,
    cancelLogout,
  };
}