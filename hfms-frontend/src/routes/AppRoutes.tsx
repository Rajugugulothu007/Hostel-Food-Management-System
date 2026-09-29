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
import WastageAnalyticsPage from "../pages/admin/analytics/WastageAnalyticsPage";
import CostAnalysisPage from "../pages/admin/analytics/CostAnalysisPage";
import FeedbackTrendsPage from "../pages/admin/feedback/FeedbackTrendsPage";
import SurplusLogPage from "../pages/admin/surplus/SurplusLogPage";
import DayScholarsPage from "../pages/admin/surplus/DayScholarsPage";
import NgoQueuePage from "../pages/admin/surplus/NgoQueuePage";

import HomePage from "../pages/student/HomePage";
import VotePage from "../pages/student/VotePage";
import VoteConfirmationPage from "../pages/student/VoteConfirmationPage";
import MyQrPage from "../pages/student/MyQrPage";
import ImpactPage from "../pages/student/ImpactPage";
import MyFeedbackPage from "../pages/student/MyFeedbackPage";
import FeedbackFormPage from "../pages/student/FeedbackFormPage";
import NotificationsPage from "../pages/student/NotificationsPage";
import SurplusTodayPage from "../pages/student/SurplusTodayPage";

export default function AppRoutes() {
  const user = useAuthStore((s) => s.user);

  return (
    <Routes>
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

      <Route path={ROUTES.LOGIN} element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path={ROUTES.SIGNUP} element={<PublicRoute><SignupPage /></PublicRoute>} />

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

        <Route path="students" element={<StudentsListPage />} />
        <Route path="students/new" element={<StudentFormPage />} />
        <Route path="students/:id/edit" element={<StudentFormPage />} />

        <Route path="menu" element={<MenuListPage />} />
        <Route path="menu/new" element={<MenuItemFormPage />} />
        <Route path="menu/:id/edit" element={<MenuItemFormPage />} />

        <Route path="voting" element={<LiveVotingPage />} />
        <Route path="attendance" element={<AttendancePage />} />

        <Route path="analytics/wastage" element={<WastageAnalyticsPage />} />
        <Route path="analytics/cost" element={<CostAnalysisPage />} />
        <Route path="feedback/trends" element={<FeedbackTrendsPage />} />

        <Route path="surplus/log" element={<SurplusLogPage />} />
        <Route path="surplus/day-scholars" element={<DayScholarsPage />} />
        <Route path="surplus/ngo" element={<NgoQueuePage />} />
      </Route>

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
        <Route path="vote" element={<VotePage />} />
        <Route path="confirmation" element={<VoteConfirmationPage />} />
        <Route path="qr" element={<MyQrPage />} />
        <Route path="impact" element={<ImpactPage />} />
        <Route path="feedback" element={<MyFeedbackPage />} />
        <Route path="feedback/new" element={<FeedbackFormPage />} />
        <Route path="notifications" element={<NotificationsPage />} />
        <Route path="surplus" element={<SurplusTodayPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}