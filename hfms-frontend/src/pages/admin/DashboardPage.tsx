import { useEffect, useState } from "react";
import {
  Users,
  Vote,
  CheckSquare,
  Leaf,
  TrendingUp,
  Percent,
} from "lucide-react";
import toast from "react-hot-toast";

import { analyticsApi } from "../../api/analyticsApi";
import type { DashboardSummaryDTO } from "../../types/analytics";
import PageHeader from "../../components/common/PageHeader";
import StatCard from "../../components/common/StatCard";
import WastageLineChart from "../../components/charts/WastageLineChart";
import HeadcountBar from "../../components/charts/HeadcountBar";
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

  usePolling(load, 10000);

  const totalVotes =
    summary?.mealCounts.reduce((s, m) => s + m.votes, 0) ?? 0;
  const totalCheckIns =
    summary?.mealCounts.reduce((s, m) => s + m.checkIns, 0) ?? 0;
  const overallWastage =
    summary && summary.mealCounts.length > 0
      ? summary.mealCounts.reduce((s, m) => s + m.wastagePercent, 0) /
        summary.mealCounts.length
      : 0;

  const wastageLineData =
    summary?.mealCounts.map((m) => ({
      name: m.mealType.charAt(0) + m.mealType.slice(1).toLowerCase(),
      wastage: m.wastagePercent,
    })) ?? [];

  const headcountBarData =
    summary?.mealCounts.map((m) => ({
      name: m.mealType.charAt(0) + m.mealType.slice(1).toLowerCase(),
      value: m.checkIns,
    })) ?? [];

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

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — TOP STATS (3 CARDS)
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          label="Total Votes Today"
          value={totalVotes}
          icon={Vote}
          color="teal"
        />
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
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — CHECK-IN DISTRIBUTION + SUMMARY TABLE
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Check-Ins per Meal — Bar Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <Users size={18} className="text-amber-500" />
              Check-Ins per Meal
            </h3>
          </div>
          {loading ? (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              Loading...
            </div>
          ) : headcountBarData.every((d) => d.value === 0) ? (
            <div className="h-[280px] flex items-center justify-center text-slate-400 text-sm">
              No check-ins yet
            </div>
          ) : (
            <HeadcountBar data={headcountBarData} />
          )}
        </div>

        {/* Today's Summary — Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-900 mb-4">
            Today's Summary
          </h3>
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
                    <td className="py-3 font-medium text-slate-800">
                      {m.mealType}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {m.votes}
                    </td>
                    <td className="py-3 text-right tabular-nums">
                      {m.checkIns}
                    </td>
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
                {(!summary || summary.mealCounts.length === 0) && (
                  <tr>
                    <td
                      colSpan={4}
                      className="py-8 text-center text-slate-400 text-sm"
                    >
                      No data yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — WASTAGE OVERVIEW (CARD + LINE CHART)
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overall Wastage — Stat Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
          {/* Header at TOP-LEFT */}
          <div className="flex items-center gap-2 mb-6">
            <Percent size={18} className="text-amber-500" />
            <h3 className="font-semibold text-slate-900">
              Overall Wastage
            </h3>
          </div>

          {/* Big number centered */}
          <div className="flex-1 flex flex-col justify-center">
            <p
              className={`text-5xl font-bold tabular-nums ${
                overallWastage > 20
                  ? "text-red-500"
                  : overallWastage > 10
                  ? "text-amber-500"
                  : "text-green-600"
              }`}
            >
              {overallWastage.toFixed(1)}%
            </p>
            <p className="text-xs text-slate-500 mt-3">
              Voted vs. actually ate — averaged across all meals
            </p>
          </div>
        </div>

        {/* Wastage % by Meal — Line Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-slate-900 flex items-center gap-2">
              <TrendingUp size={18} className="text-teal" />
              Wastage % by Meal
            </h3>
            <span className="text-xs text-slate-500">
              Voted vs. actually ate
            </span>
          </div>
          {loading ? (
            <div className="h-[240px] flex items-center justify-center text-slate-400 text-sm">
              Loading chart...
            </div>
          ) : wastageLineData.length === 0 ? (
            <div className="h-[240px] flex items-center justify-center text-slate-400 text-sm">
              No data yet
            </div>
          ) : (
            <WastageLineChart data={wastageLineData} />
          )}
        </div>
      </div>
    </div>
  );
}