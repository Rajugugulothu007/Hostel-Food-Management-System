import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

interface Props {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export default function AuthLayout({ title, subtitle, children }: Props) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* ---------- HEADER ---------- */}
      <header className="py-6 flex justify-center">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-teal flex items-center justify-center text-white group-hover:scale-105 transition">
            <UtensilsCrossed size={20} />
          </div>
          <span className="text-2xl font-bold text-navy tracking-tight">
            HFMS
          </span>
        </Link>
      </header>

      {/* ---------- MAIN CARD ---------- */}
      <main className="flex-1 flex items-start justify-center px-4 pb-12">
        <div className="w-full max-w-sm">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">{title}</h1>
            {subtitle && (
              <p className="text-sm text-slate-500 mb-5">{subtitle}</p>
            )}
            {children}
          </div>

          {/* ---------- FOOTER LINKS ---------- */}
          <div className="mt-6 text-center text-xs text-slate-500">
            <div className="flex justify-center gap-4">
              <a href="#" className="hover:text-teal transition">
                Terms
              </a>
              <span className="text-slate-300">·</span>
              <a href="#" className="hover:text-teal transition">
                Privacy
              </a>
              <span className="text-slate-300">·</span>
              <a href="#" className="hover:text-teal transition">
                Help
              </a>
            </div>
            <p className="mt-3 text-slate-400">
              © {new Date().getFullYear()} HFMS — Hostel Food Management System
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}