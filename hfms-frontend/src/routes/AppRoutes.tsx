import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { ROUTES } from "./paths";

import AdminLayout from "../components/layout/AdminLayout";
import StudentLayout from "../components/layout/StudentLayout";

import WelcomePage from "../pages/WelcomePage";           // ← NEW
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import DashboardPage from "../pages/admin/DashboardPage";
import HomePage from "../pages/student/HomePage";

export default function AppRoutes() {
  const user = useAuthStore((s) => s.user);

  return (
    <Routes>
      {/* ---------- WELCOME (root) ---------- */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate
              to={user.role === "ADMIN" ? ROUTES.ADMIN.DASHBOARD : ROUTES.STUDENT.HOME}
              replace
            />
          ) : (
            <WelcomePage />
          )
        }
      />

      {/* ---------- PUBLIC (auth) ---------- */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path={ROUTES.SIGNUP}
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* ---------- ADMIN ---------- */}
      <Route
        path={ROUTES.ADMIN.ROOT}
        element={
          <ProtectedRoute requiredRole="ADMIN">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
      </Route>

      {/* ---------- STUDENT ---------- */}
      <Route
        path={ROUTES.STUDENT.ROOT}
        element={
          <ProtectedRoute requiredRole="STUDENT">
            <StudentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to={ROUTES.STUDENT.HOME} replace />} />
        <Route path="home" element={<HomePage />} />
      </Route>

      {/* ---------- 404 fallback ---------- */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}