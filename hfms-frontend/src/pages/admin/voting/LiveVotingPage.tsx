import { useEffect, useState } from "react";
import { Vote, TrendingUp, Trophy } from "lucide-react";
import toast from "react-hot-toast";

import { menuApi } from "../../../api/menuApi";
import { votingApi } from "../../../api/votingApi";
import type { MenuItemDTO } from "../../../types/menu";
import { MEAL_TYPES } from "../../../types/menu";
import { usePolling } from "../../../hooks/usePolling";
import PageHeader from "../../../components/common/PageHeader";
import StatCard from "../../../components/common/StatCard";
import { getFoodImage, getFoodStyle } from "../../../utils/foodEmoji";

const mealColor: Record<string, "amber" | "blue" | "green"> = {
  BREAKFAST: "amber",
  LUNCH: "blue",
  DINNER: "green",
};

interface VoteItem {
  item: MenuItemDTO;
  count: number;
}

export default function LiveVotingPage() {
  const [mealType, setMealType] = useState<string>("BREAKFAST");
  const [items, setItems] = useState<VoteItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadVotes = async () => {
    try {
      const menu = await menuApi.listByMealType(mealType);
      const withCounts = await Promise.all(
        menu.map(async (item) => {
          try {
            const res = await votingApi.getLiveCount(item.id!);
            return { item, count: res.count };
          } catch {
            return { item, count: 0 };
          }
        })
      );
      withCounts.sort((a, b) => b.count - a.count);
      setItems(withCounts);
    } catch {
      toast.error("Failed to load votes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    loadVotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealType]);

  usePolling(loadVotes, 5000, [mealType]);

  const totalVotes = items.reduce((sum, i) => sum + i.count, 0);
  const max = items[0]?.count ?? 0;
  const topItem = items[0];

  const topImage = topItem
    ? topItem.item.imageUrl || getFoodImage(topItem.item.id)
    : null;

  return (
    <div>
      <PageHeader
        title="Live Voting"
        subtitle="Real-time vote counts — auto-refreshes every 5 seconds"
      />

      {/* ═══════════════════════════════════════════════════════════
          SECTION 1 — MEAL TABS
          ═══════════════════════════════════════════════════════════ */}
      <div className="flex flex-wrap gap-2 mb-6">
        {MEAL_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => setMealType(t)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
              mealType === t
                ? "bg-teal text-white shadow-md shadow-teal/20"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 2 — TOP STATS (2 CARDS)
          ═══════════════════════════════════════════════════════════ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Total Votes */}
        <StatCard
          label="Total Votes"
          value={totalVotes}
          icon={Vote}
          color={mealColor[mealType]}
        />

        {/* Leading Item — with image */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
          {/* Image thumbnail */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0">
            {topImage ? (
              <img
                src={topImage}
                alt={topItem?.item.itemName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-3xl">
                🍽
              </div>
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Trophy size={14} className="text-amber-500 flex-shrink-0" />
              <p className="text-xs text-slate-500 font-medium">
                Leading Item
              </p>
            </div>
            <p className="text-sm font-bold text-slate-900 truncate">
              {topItem?.item.itemName || "—"}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              {topItem?.count ?? 0} votes
            </p>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          SECTION 3 — VOTE DISTRIBUTION (WITH IMAGES)
          ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-5">
          {mealType.charAt(0) + mealType.slice(1).toLowerCase()} Vote Distribution
        </h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl bg-slate-100" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 rounded w-1/3" />
                  <div className="h-2.5 bg-slate-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No menu items for this meal yet.
          </p>
        ) : (
          <div className="space-y-5">
            {items.map((v, i) => {
              const isWinner = i === 0 && v.count > 0;
              const img = v.item.imageUrl || getFoodImage(v.item.id);
              const style = getFoodStyle(v.item.itemName, v.item.mealType);
              const pct = max === 0 ? 0 : (v.count / max) * 100;

              return (
                <div
                  key={v.item.id}
                  className={`flex items-center gap-4 p-3 rounded-xl transition ${
                    isWinner ? "bg-teal/5 border border-teal/20" : ""
                  }`}
                >
                  {/* Image thumbnail */}
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                    {/* Emoji fallback behind image */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${style.gradient} opacity-40`}
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-2xl">
                      {style.emoji}
                    </div>
                    {img && (
                      <img
                        src={img}
                        alt={v.item.itemName}
                        className="relative w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display =
                            "none";
                        }}
                      />
                    )}

                    {/* Winner crown badge */}
                    {isWinner && (
                      <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-400 flex items-center justify-center shadow-md">
                        <Trophy size={10} className="text-white" />
                      </div>
                    )}
                  </div>

                  {/* Name + quantity + bar + count */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-semibold text-sm truncate ${
                            isWinner ? "text-teal" : "text-slate-800"
                          }`}
                        >
                          {v.item.itemName}
                        </p>
                        {v.item.quantity && (
                          <p className="text-[11px] text-slate-500 truncate">
                            {v.item.quantity}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-900 tabular-nums flex-shrink-0">
                        {v.count}{" "}
                        <span className="text-[10px] text-slate-400 font-normal">
                          {v.count === 1 ? "vote" : "votes"}
                        </span>
                      </span>
                    </div>

                    {/* Bar */}
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isWinner
                            ? "bg-gradient-to-r from-teal to-cyan-500"
                            : "bg-gradient-to-r from-slate-400 to-slate-500"
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}