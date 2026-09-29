import { useEffect, useState } from "react";
import { Users, Vote, CheckSquare, Leaf, TrendingUp, Award } from "lucide-react";
import toast from "react-hot-toast";

import { analyticsApi } from "../../api/analyticsApi";
import type { DashboardSummaryDTO } from "../../types/analytics";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import WastageLineChart from "../../components/charts/WastageLineChart";
import MealDonutChart from "../../components/charts/MealDonutChart";
import { usePolling } from "../../hooks/usePolling";

export default function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummaryDTO | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const data = await analyticsApi.getDashboard();
      setSummary(data);
    } catch {
      toast.error("Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Refresh every 10 seconds
  usePolling(load, 10000);

  const totalVotes = summary?.mealCounts.reduce((s, m) => s + m.votes, 0) ?? 0;
  const totalCheckIns = summary?.mealCounts.reduce((s, m) => s + m.checkIns, 0) ?? 0;

  const wastageLineData = (summary?.mealCounts ?? []).map((m) => ({
    name: m.mealType.charAt(0) + m.mealType.slice(1).toLowerCase(),
    wastage: m.wastagePercent,
  }));

  const donutData = (summary?.mealCounts ?? []).map((m) => ({
    name: m.mealType,
    value: m.checkIns,
    color:
      m.mealType === "BREAKFAST"
        ? "#F59E0B"
        : m.mealType === "LUNCH"
        ? "#3B82F6"
        : "#22C55E",
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        subtitle={
          summary?.generatedAt
            ? `Last updated: ${new Date(summary.generatedAt).toLocaleTimeString()}`
            : "Loading..."
        }
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Votes Today" value={totalVotes} icon={Vote} color="teal" />
        <StatCard
          label="Total Check-Ins"
          value={totalCheckIns}
          icon={CheckSquare}
          color="green"
        />
        <StatCard
          label="Surplus Today"
          value={summary?.totalSurplusToday ?? 0}
          icon={Leaf}
          color="purple"
        />
        <StatCard
          label="Top Meal"
          value={summary?.topMealToday ?? "—"}
          icon={Award}
          color="amber"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-teal" />
              Wastage % by Meal
            </h3>
            <span className="text-xs text-slate-500">
              Voted vs actually ate
            </span>
          </div>
          {loading ? (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              Loading chart...
            </div>
          ) : wastageLineData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              No data yet
            </div>
          ) : (
            <WastageLineChart data={wastageLineData} />
          )}
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-amber-500" />
              Check-Ins per Meal
            </h3>
          </div>
          {loading ? (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              Loading chart...
            </div>
          ) : donutData.every((d) => d.value === 0) ? (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              No check-ins yet
            </div>
          ) : (
            <MealDonutChart data={donutData} />
          )}
        </div>
      </div>

      {/* Summary table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-900 mb-4">Today's Summary</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-slate-500 uppercase border-b">
              <tr>
                <th className="py-2">Meal</th>
                <th className="py-2 text-right">Votes</th>
                <th className="py-2 text-right">Check-Ins</th>
                <th className="py-2 text-right">Wastage</th>
              </tr>
            </thead>
            <tbody>
              {(summary?.mealCounts ?? []).map((m) => (
                <tr key={m.mealType} className="border-b last:border-0">
                  <td className="py-3 font-medium text-slate-800">{m.mealType}</td>
                  <td className="py-3 text-right tabular-nums">{m.votes}</td>
                  <td className="py-3 text-right tabular-nums">{m.checkIns}</td>
                  <td className="py-3 text-right tabular-nums">
                    <span
                      className={`font-semibold ${
                        m.wastagePercent > 20
                          ? "text-red-500"
                          : m.wastagePercent > 10
                          ? "text-amber-500"
                          : "text-green-600"
                      }`}
                    >
                      {m.wastagePercent.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}