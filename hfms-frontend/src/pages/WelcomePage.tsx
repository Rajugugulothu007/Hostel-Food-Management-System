import { Link, useNavigate } from "react-router-dom";
import { UtensilsCrossed, Vote, QrCode, TrendingUp, Leaf, Users } from "lucide-react";

export default function WelcomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-navy via-slate-900 to-navy text-white">
      {/* ---------- TOP BAR ---------- */}
      <header className="flex items-center justify-between px-6 py-5 md:px-12">
        <div className="flex items-center gap-2">
          <UtensilsCrossed className="text-teal" size={28} />
          <h1 className="text-xl font-bold tracking-tight">HFMS</h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm rounded-lg border border-white/20 hover:bg-white/10 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 text-sm rounded-lg bg-teal text-white hover:bg-teal/90 transition font-medium"
          >
            Sign Up
          </button>
        </div>
      </header>

      {/* ---------- HERO ---------- */}
      <section className="px-6 md:px-12 pt-12 pb-16 max-w-5xl mx-auto text-center">
        <span className="inline-block px-3 py-1 text-xs rounded-full bg-teal/20 text-teal border border-teal/30 mb-6">
          Smart Mess · Zero Waste
        </span>

        <h2 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
          Right food. <br />
          <span className="text-teal">Right quantity.</span> Zero waste.
        </h2>

        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          HFMS is a vote-driven hostel mess platform. Students vote for what
          they'll eat, the kitchen cooks exactly to demand, and any surplus
          feeds day scholars or NGOs — nothing goes in the bin.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 rounded-lg bg-teal text-white hover:bg-teal/90 font-medium transition"
          >
            Get Started →
          </button>
          <button
            onClick={() => navigate("/signup")}
            className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 font-medium transition"
          >
            Create Account
          </button>
        </div>
      </section>

      {/* ---------- FEATURES ---------- */}
      <section className="px-6 md:px-12 pb-20 max-w-6xl mx-auto">
        <h3 className="text-center text-2xl font-bold mb-10 text-gray-200">
          What you can do
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: Vote,
              title: "Vote for Meals",
              desc: "See today's menu, vote before the cutoff, and change your vote any time.",
            },
            {
              icon: QrCode,
              title: "QR Check-In",
              desc: "Scan your personal QR at the mess counter — instant, frictionless, fair.",
            },
            {
              icon: TrendingUp,
              title: "Track Impact",
              desc: "See how many meals you've helped save and your personal reliability score.",
            },
            {
              icon: UtensilsCrossed,
              title: "Live Menus",
              desc: "Admin updates menus in real time — no more guessing what's for dinner.",
            },
            {
              icon: Users,
              title: "Day Scholar Support",
              desc: "Surplus food is offered to registered day scholars within minutes.",
            },
            {
              icon: Leaf,
              title: "NGO Routing",
              desc: "Unclaimed surplus automatically routes to NGOs for donation.",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-teal/50 transition"
            >
              <feature.icon className="text-teal mb-3" size={28} />
              <h4 className="text-lg font-semibold mb-2">{feature.title}</h4>
              <p className="text-sm text-gray-400">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- FOOTER ---------- */}
      <footer className="text-center text-sm text-gray-500 py-8 border-t border-white/10">
        © {new Date().getFullYear()} HFMS — Hostel Food Management System
        <span className="mx-2">·</span>
        <Link to="/login" className="text-teal hover:underline">
          Login
        </Link>
        <span className="mx-2">·</span>
        <Link to="/signup" className="text-teal hover:underline">
          Sign Up
        </Link>
      </footer>
    </div>
  );
}