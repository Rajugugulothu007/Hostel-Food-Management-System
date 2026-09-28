import {
  Users,
  Vote,
  CheckSquare,
  Leaf,
  TrendingUp,
  UtensilsCrossed,
} from "lucide-react";

const stats = [
  { label: "Total Students", value: "—", icon: Users, color: "from-teal to-cyan-500" },
  { label: "Today's Votes", value: "—", icon: Vote, color: "from-amber-500 to-orange-500" },
  { label: "Check-Ins", value: "—", icon: CheckSquare, color: "from-green-500 to-emerald-500" },
  { label: "Surplus Today", value: "—", icon: Leaf, color: "from-purple-500 to-pink-500" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Welcome to HFMS Admin — live data will appear here once Phase 4 is built.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-white`}
              >
                <s.icon size={20} />
              </div>
              <TrendingUp size={16} className="text-slate-300" />
            </div>
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Placeholder widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <Vote size={18} className="text-teal" />
            Live Vote Counts
          </h3>
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            Chart coming in Phase 4
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-amber-500" />
            Wastage Trend
          </h3>
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            Line chart coming in Phase 4
          </div>
        </div>
      </div>
    </div>
  );
}