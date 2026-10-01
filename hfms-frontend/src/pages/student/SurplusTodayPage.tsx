import { useEffect, useState } from "react";
import { Leaf, Clock, Heart } from "lucide-react";
import toast from "react-hot-toast";

import { surplusApi } from "../../api/surplusApi";
import type { SurplusLogDTO } from "../../types/surplus";
import Badge from "../../components/common/Badge";

export default function SurplusTodayPage() {
  const [items, setItems] = useState<SurplusLogDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setItems(await surplusApi.today());
      } catch {
        toast.error("Failed to load surplus");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Today's Surplus</h2>
        <p className="text-xs text-slate-500 mt-1">
          Free leftovers available for registered day scholars
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <Leaf size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">No surplus today</p>
          <p className="text-xs text-slate-400 mt-1">
            Check back after meals
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Leaf size={16} className="text-green-500" />
                    <p className="font-semibold text-sm text-slate-900 truncate">
                      {item.mealId}
                    </p>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    {item.mealType} · {item.surplusQty} portions
                  </p>
                </div>
                <Badge
                  color={item.disposition === "NGO" ? "green" : "amber"}
                >
                  {item.disposition || "DAY_SCHOLAR"}
                </Badge>
              </div>

              {item.disposition === "DAY_SCHOLAR" && (
                <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 rounded-xl p-2.5">
                  <Clock size={12} />
                  Claim within 20 minutes of surplus being logged
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-start gap-3">
        <Heart size={18} className="text-green-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-green-800">
          Surplus feeds day scholars first, then NGOs. Every claim prevents
          food from being wasted.
        </p>
      </div>
    </div>
  );
}