import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { Home, Vote, QrCode, TrendingUp, LogOut, UtensilsCrossed } from "lucide-react";
import { useAuthStore } from "../../store/authStore";

const tabs = [
  { to: "/student/home", label: "Home", icon: Home },
  { to: "/student/vote", label: "Vote", icon: Vote },
  { to: "/student/qr", label: "QR", icon: QrCode },
  { to: "/student/impact", label: "Impact", icon: TrendingUp },
];

export default function StudentLayout() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-slate-50 to-slate-100 flex justify-center">
      {/* Phone-shaped container — full width on mobile, framed on desktop */}
      <div className="w-full sm:max-w-md bg-white min-h-screen flex flex-col shadow-2xl sm:my-6 sm:rounded-3xl sm:overflow-hidden sm:min-h-[calc(100vh-3rem)]">
        {/* Header */}
        <header className="px-5 py-4 border-b bg-gradient-to-r from-navy to-slate-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal to-cyan-500 flex items-center justify-center font-bold">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="text-xs text-gray-300">Welcome back</p>
              <p className="font-semibold">{user?.username}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg hover:bg-white/10 transition"
          >
            <LogOut size={18} />
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 pb-24">
          <Outlet />
        </main>

        {/* Bottom nav */}
        <nav className="sticky bottom-0 border-t bg-white/95 backdrop-blur-sm flex">
          {tabs.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-1 py-3 text-xs font-medium transition-all
                ${
                  isActive
                    ? "text-teal"
                    : "text-slate-500 hover:text-slate-700"
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
                    <tab.icon size={20} />
                  </div>
                  <span>{tab.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
}