import { useState, useEffect } from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import {
  LogOut,
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  Vote,
  CheckSquare,
  Menu,
  ChevronLeft,
  Bell,
  Search,
  TrendingUp,
  MessageSquare,
  Leaf,
  UserCheck,
  Heart,
} from "lucide-react";
import { useAuthStore } from "../../store/authStore";
import { useLogout } from "../../hooks/useLogout";
import ConfirmDialog from "../common/ConfirmDialog";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/students", label: "Students", icon: Users },
  { to: "/admin/menu", label: "Menu", icon: UtensilsCrossed },
  { to: "/admin/voting", label: "Live Voting", icon: Vote },
  { to: "/admin/attendance", label: "Attendance", icon: CheckSquare },
  { to: "/admin/analytics/wastage", label: "Wastage", icon: TrendingUp },
  { to: "/admin/feedback/trends", label: "Feedback", icon: MessageSquare },
  { to: "/admin/surplus/log", label: "Surplus", icon: Leaf },
  { to: "/admin/surplus/day-scholars", label: "Day Scholars", icon: UserCheck },
  { to: "/admin/surplus/ngo", label: "NGO Queue", icon: Heart },
];

export default function AdminLayout() {
  const location = useLocation();
  const { user } = useAuthStore();
  const { showConfirm, requestLogout, confirmLogout, cancelLogout } = useLogout();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) setCollapsed(true);
      else setCollapsed(false);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = collapsed ? "w-[76px]" : "w-64";

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* MOBILE OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static top-0 left-0 h-full z-40 ${sidebarWidth} 
                    bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950
                    text-white flex flex-col transition-all duration-300 ease-in-out
                    ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center flex-shrink-0">
              <UtensilsCrossed size={20} />
            </div>
            {!collapsed && (
              <span className="text-lg font-bold whitespace-nowrap">HFMS</span>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex text-gray-400 hover:text-white transition"
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-300 ${
                collapsed ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${
                  isActive
                    ? "bg-gradient-to-r from-teal to-teal/70 text-white shadow-lg shadow-teal/20"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="text-sm font-medium whitespace-nowrap">
                  {item.label}
                </span>
              )}
              {collapsed && (
                <span className="absolute left-full ml-3 px-3 py-1.5 rounded-lg bg-slate-800 text-white text-xs whitespace-nowrap
                                 opacity-0 group-hover:opacity-100 pointer-events-none transition">
                  {item.label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <div
            className={`flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-white/5 transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal to-cyan-500 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {user?.username?.[0]?.toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.username}</p>
                <p className="text-xs text-gray-500">{user?.role}</p>
              </div>
            )}
          </div>

          <button
            onClick={requestLogout}
            className={`mt-2 flex items-center gap-3 w-full px-3 py-2 rounded-xl text-red-400 hover:bg-red-500/10 transition ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut size={18} />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center justify-between px-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition"
            >
              <Menu size={22} className="text-slate-700" />
            </button>

            <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-100 w-72">
              <Search size={16} className="text-slate-400" />
              <input
                placeholder="Search..."
                className="bg-transparent text-sm outline-none flex-1 placeholder:text-slate-400"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg hover:bg-slate-100 transition">
              <Bell size={20} className="text-slate-700" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* LOGOUT CONFIRMATION */}
      <ConfirmDialog
        open={showConfirm}
        title="Confirm Logout"
        message="Are you sure you want to log out of HFMS?"
        confirmText="Yes, Logout"
        cancelText="Cancel"
        variant="danger"
        onConfirm={confirmLogout}
        onCancel={cancelLogout}
      />
    </div>
  );
}