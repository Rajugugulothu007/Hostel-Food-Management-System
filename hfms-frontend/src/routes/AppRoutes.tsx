import { Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { ROUTES } from "./paths";

import AdminLayout from "../components/layout/AdminLayout";
import StudentLayout from "../components/layout/StudentLayout";

import WelcomePage from "../pages/WelcomePage";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import DashboardPage from "../pages/admin/DashboardPage";
import StudentsListPage from "../pages/admin/students/StudentsListPage";
import StudentFormPage from "../pages/admin/students/StudentFormPage";
import MenuListPage from "../pages/admin/menu/MenuListPage";
import MenuItemFormPage from "../pages/admin/menu/MenuItemFormPage";
import LiveVotingPage from "../pages/admin/voting/LiveVotingPage";
import AttendancePage from "../pages/admin/attendance/AttendancePage";
import HomePage from "../pages/student/HomePage";

export default function AppRoutes() {
  const user = useAuthStore((s) => s.user);

  return (
    <Routes>
      {/* Root */}
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

      {/* Public */}
      <Route path={ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path={ROUTES.SIGNUP} element={<PublicRoute><SignupPage /></PublicRoute>} />

      {/* Admin */}
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

        {/* Students */}
        <Route path="students" element={<StudentsListPage />} />
        <Route path="students/new" element={<StudentFormPage />} />
        <Route path="students/:id/edit" element={<StudentFormPage />} />

        {/* Menu */}
        <Route path="menu" element={<MenuListPage />} />
        <Route path="menu/new" element={<MenuItemFormPage />} />
        <Route path="menu/:id/edit" element={<MenuItemFormPage />} />

        {/* Live Voting + Attendance */}
        <Route path="voting" element={<LiveVotingPage />} />
        <Route path="attendance" element={<AttendancePage />} />
      </Route>

      {/* Student */}
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

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}