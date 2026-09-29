import { useEffect, useState } from "react";
import { TrendingUp, Leaf } from "lucide-react";
import toast from "react-hot-toast";

import { analyticsApi } from "../../../api/analyticsApi";
import type { WastageTrendDTO } from "../../../types/analytics";
import PageHeader from "../../../components/common/PageHeader";
import StatCard from "../../../components/common/StatCard";
import WastageLineChart from "../../../components/charts/WastageLineChart";
import HeadcountBar from "../../../components/charts/HeadcountBar";

export default function WastageAnalyticsPage() {
  const [data, setData] = useState<WastageTrendDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setData(await analyticsApi.getWastage());
      } catch {
        toast.error("Failed to load wastage");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const lineData =
    data?.meals.map((m) => ({
      name: m.mealType.charAt(0) + m.mealType.slice(1).toLowerCase(),
      wastage: m.wastagePercent,
    })) ?? [];

  const barData =
    data?.meals.map((m) => ({
      name: m.mealType.charAt(0) + m.mealType.slice(1).toLowerCase(),
      value: m.checkIns,
    })) ?? [];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wastage Analytics"
        subtitle="Track how much food gets wasted due to no-shows"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          label="Overall Wastage"
          value={`${(data?.overallWastagePercent ?? 0).toFixed(1)}%`}
          icon={TrendingUp}
          color="amber"
        />
        <StatCard
          label="Total Surplus Today"
          value={data?.totalSurplusQty ?? 0}
          icon={Leaf}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">Wastage Trend</h3>
          {loading ? (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              Loading...
            </div>
          ) : (
            <WastageLineChart data={lineData} />
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">Check-Ins per Meal</h3>
          {loading ? (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              Loading...
            </div>
          ) : (
            <HeadcountBar data={barData} />
          )}
        </div>
      </div>
    </div>
  );
}