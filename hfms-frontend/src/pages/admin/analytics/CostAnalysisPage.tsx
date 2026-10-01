import { TrendingUp, DollarSign, Users } from "lucide-react";
import PageHeader from "../../../components/common/PageHeader";
import StatCard from "../../../components/common/StatCard";

export default function CostAnalysisPage() {
  // Placeholder — actual cost data would come from a new backend service
  const costPerHead = 45;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Cost Analysis"
        subtitle="Per-meal cost estimation (Phase 5 will pull live data)"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Cost per Head" value={`₹${costPerHead}`} icon={DollarSign} color="teal" />
        <StatCard label="Avg Daily Cost" value="₹12,500" icon={TrendingUp} color="amber" />
        <StatCard label="Students Fed" value="—" icon={Users} color="green" />
      </div>

      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-3">Coming Soon</h3>
        <p className="text-sm text-slate-500">
          Cost analysis will be computed from votes + attendance + menu item prices.
        </p>
      </div>
    </div>
  );
}