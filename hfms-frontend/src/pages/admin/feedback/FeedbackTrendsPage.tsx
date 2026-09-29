import { useEffect, useState } from "react";
import { Star, AlertTriangle, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

import { feedbackApi } from "../../../api/feedbackApi";
import type { LowRatedItem } from "../../../types/feedback";
import PageHeader from "../../../components/common/PageHeader";
import StatCard from "../../../components/common/StatCard";
import Badge from "../../../components/common/Badge";
import EmptyState from "../../../components/common/EmptyState";

export default function FeedbackTrendsPage() {
  const [lowRated, setLowRated] = useState<LowRatedItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLowRated(await feedbackApi.lowRated());
      } catch {
        toast.error("Failed to load feedback trends");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Feedback Trends"
        subtitle="Auto-flagged items with average rating below 3.0"
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Flagged" value={lowRated.length} icon={AlertTriangle} color="amber" />
        <StatCard label="Avg Rating Threshold" value="3.0 ★" icon={Star} color="teal" />
        <StatCard label="Feedback Source" value="Students" icon={MessageSquare} color="blue" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-400">Loading...</div>
        ) : lowRated.length === 0 ? (
          <EmptyState
            icon={Star}
            title="No low-rated items"
            description="Every meal is rating 3.0+ — great job!"
          />
        ) : (
          <div className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">Items to Review</h3>
            <div className="space-y-3">
              {lowRated.map((item) => (
                <div
                  key={item.mealId}
                  className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="text-amber-500" size={20} />
                    <div>
                      <p className="font-medium text-slate-900">{item.mealId}</p>
                      <p className="text-xs text-slate-500">
                        Needs menu review or recipe change
                      </p>
                    </div>
                  </div>
                  <Badge color="red">
                    {item.averageRating?.toFixed(1)} ★
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}