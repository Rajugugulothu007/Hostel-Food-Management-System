import type { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: "teal" | "amber" | "green" | "purple" | "blue";
}

const colors = {
  teal: "from-teal to-cyan-500",
  amber: "from-amber-500 to-orange-500",
  green: "from-green-500 to-emerald-500",
  purple: "from-purple-500 to-pink-500",
  blue: "from-blue-500 to-indigo-500",
};

export default function StatCard({ label, value, icon: Icon, color = "teal" }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition">
      <div className="flex items-center justify-between mb-3">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white`}
        >
          <Icon size={20} />
        </div>
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
    </div>
  );
}