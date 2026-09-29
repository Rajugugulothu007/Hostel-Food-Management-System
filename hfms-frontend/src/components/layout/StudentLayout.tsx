import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Vote,
  QrCode,
  TrendingUp,
  Bell,
  MessageSquare,
  UtensilsCrossed,
} from "lucide-react";
import ProfileDropdown from "../common/ProfileDropdown";

const tabs = [
  { to: "/student/home", label: "Home", icon: Home },
  { to: "/student/vote", label: "Vote", icon: Vote },
  { to: "/student/qr", label: "QR", icon: QrCode },
  { to: "/student/feedback", label: "Feedback", icon: MessageSquare },
  { to: "/student/impact", label: "Impact", icon: TrendingUp },
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ══════════════════════════════════════════════════════ */}
      {/* DESKTOP HEADER — visible only on lg+ screens          */}
      {/* ══════════════════════════════════════════════════════ */}
      <header className="hidden lg:flex sticky top-0 z-30 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto w-full px-6 h-16 flex items-center justify-between">
          {/* LEFT: Logo + title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal to-cyan-500 flex items-center justify-center text-white">
              <UtensilsCrossed size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 leading-none">HFMS</p>
              <p className="text-base font-bold text-navy leading-tight">
                Student
              </p>
            </div>
          </div>

          {/* CENTER: Desktop nav tabs */}
          <nav className="flex items-center gap-1">
            {tabs.map((tab) => {
              const isActive = location.pathname === tab.to;
              return (
                <NavLink
                  key={tab.to}
                  to={tab.to}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition ${
                    isActive
                      ? "bg-teal text-white shadow-md shadow-teal/20"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`}
                >
                  <tab.icon size={16} />
                  {tab.label}
                </NavLink>
              );
            })}
          </nav>

          {/* RIGHT: Bell + Profile */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/student/notifications")}
              className="relative p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <Bell size={20} className="text-slate-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
            <ProfileDropdown variant="student" />
          </div>
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════ */}
      {/* MOBILE HEADER — visible only below lg                 */}
      {/* ══════════════════════════════════════════════════════ */}
      <header className="lg:hidden sticky top-0 z-30 px-4 py-3 border-b bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal to-cyan-500 flex items-center justify-center text-white">
            <UtensilsCrossed size={16} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 leading-none">HFMS</p>
            <p className="text-sm font-bold text-navy leading-tight">Student</p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => navigate("/student/notifications")}
            className="relative p-2 rounded-lg hover:bg-slate-100 transition"
          >
            <Bell size={18} className="text-slate-700" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>
          <ProfileDropdown variant="student" />
        </div>
      </header>

      {/* ══════════════════════════════════════════════════════ */}
      {/* MAIN CONTENT — narrow on mobile, wider on desktop     */}
      {/* ══════════════════════════════════════════════════════ */}
      <main className="max-w-6xl mx-auto w-full px-4 py-5 pb-24 lg:px-6 lg:py-8 lg:pb-8">
        <Outlet />
      </main>

      {/* ══════════════════════════════════════════════════════ */}
      {/* MOBILE BOTTOM NAV — visible only below lg             */}
      {/* ══════════════════════════════════════════════════════ */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t flex">
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all ${
                isActive ? "text-teal" : "text-slate-500 hover:text-slate-700"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`p-1.5 rounded-lg transition ${
                    isActive ? "bg-teal/10" : ""
                  }`}
                >
                  <tab.icon size={18} />
                </div>
                <span>{tab.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}