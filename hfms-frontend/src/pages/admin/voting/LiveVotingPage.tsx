import { useEffect, useState } from "react";
import { Vote, RefreshCw, TrendingUp } from "lucide-react";
import toast from "react-hot-toast";

import { menuApi } from "../../../api/menuApi";
import { votingApi } from "../../../api/votingApi";
import type { MenuItemDTO } from "../../../types/menu";
import { MEAL_TYPES } from "../../../types/menu";
import { usePolling } from "../../../hooks/usePolling";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import VoteBar from "../../../components/common/VoteBar";
import StatCard from "../../../components/common/StatCard";

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
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

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
      // Sort by count descending
      withCounts.sort((a, b) => b.count - a.count);
      setItems(withCounts);
      setLastUpdated(new Date());
    } catch {
      toast.error("Failed to load votes");
    } finally {
      setLoading(false);
    }
  };

  // Reload when meal type changes
  useEffect(() => {
    setLoading(true);
    loadVotes();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mealType]);

  // Poll every 5 seconds
  usePolling(loadVotes, 5000, [mealType]);

  const totalVotes = items.reduce((sum, i) => sum + i.count, 0);
  const max = items[0]?.count ?? 0;
  const topItem = items[0];

  return (
    <div>
      <PageHeader
        title="Live Voting"
        subtitle="Real-time vote counts — updates every 5 seconds"
        action={
          <Button variant="secondary" onClick={loadVotes}>
            <RefreshCw size={16} /> Refresh
          </Button>
        }
      />

      {/* Meal tabs */}
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

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Votes"
          value={totalVotes}
          icon={Vote}
          color={mealColor[mealType]}
        />
        <StatCard
          label="Leading Item"
          value={topItem?.item.itemName.split(" ")[0] || "—"}
          icon={TrendingUp}
          color="green"
        />
        <StatCard
          label="Last Updated"
          value={lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          icon={RefreshCw}
          color="blue"
        />
      </div>

      {/* Vote bars */}
      <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
        <h3 className="font-semibold text-slate-900 mb-5">
          {mealType.charAt(0) + mealType.slice(1).toLowerCase()} Vote Distribution
        </h3>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/3" />
                <div className="h-2.5 bg-slate-100 rounded" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-slate-400 text-center py-8">
            No menu items for this meal yet.
          </p>
        ) : (
          <div className="space-y-4">
            {items.map((v, i) => (
              <VoteBar
                key={v.item.id}
                label={`${v.item.itemName} (${v.item.id})`}
                count={v.count}
                max={max}
                highlight={i === 0}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}