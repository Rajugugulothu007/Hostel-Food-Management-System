import { Clock, UtensilsCrossed, Vote } from "lucide-react";

export default function HomePage() {
  return (
    <div className="space-y-5">
      {/* Greeting card */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-teal to-cyan-600 text-white shadow-lg shadow-teal/20">
        <p className="text-sm opacity-90">Good morning 👋</p>
        <h2 className="text-xl font-bold mt-1">What's for breakfast?</h2>
        <p className="text-sm opacity-90 mt-2 flex items-center gap-1.5">
          <Clock size={14} /> Voting closes in 2h 14m
        </p>
      </div>

      {/* Menu preview */}
      <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <UtensilsCrossed size={18} className="text-teal" />
          <h3 className="font-semibold text-slate-900">Today's Menu</h3>
        </div>
        <p className="text-sm text-slate-500">
          Menu and voting coming in Phase 5.
        </p>
      </div>

      {/* Vote CTA */}
      <button className="w-full p-4 rounded-2xl bg-navy text-white flex items-center justify-between hover:bg-slate-800 transition">
        <div className="flex items-center gap-3">
          <Vote size={20} />
          <span className="font-medium">Cast your vote</span>
        </div>
        <span className="text-sm opacity-70">→</span>
      </button>
    </div>
  );
}