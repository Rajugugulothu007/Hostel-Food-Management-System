import { create } from "zustand";
import type { AuthUser } from "../types/auth";

interface AuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser) => void;
  logout: () => void;
  isAdmin: () => boolean;
  isStudent: () => boolean;
}

const savedUser = localStorage.getItem("hfms_user");

export const useAuthStore = create<AuthState>((set, get) => ({
  user: savedUser ? JSON.parse(savedUser) : null,

  setUser: (user) => {
    localStorage.setItem("hfms_token", user.token);
    localStorage.setItem("hfms_user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("hfms_token");
    localStorage.removeItem("hfms_user");
    set({ user: null });
  },

  isAdmin: () => get().user?.role === "ADMIN",
  isStudent: () => get().user?.role === "STUDENT",
}));