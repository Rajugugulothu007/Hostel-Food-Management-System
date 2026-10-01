import { useEffect, useState } from "react";
import { Leaf, Send, Heart } from "lucide-react";
import toast from "react-hot-toast";

import { surplusApi } from "../../../api/surplusApi";
import type { SurplusLogDTO } from "../../../types/surplus";
import PageHeader from "../../../components/common/PageHeader";
import Badge from "../../../components/common/Badge";
import EmptyState from "../../../components/common/EmptyState";
import Button from "../../../components/common/Button";

export default function NgoQueuePage() {
  const [queue, setQueue] = useState<SurplusLogDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      setQueue(await surplusApi.ngoQueue());
    } catch {
      toast.error("Failed to load NGO queue");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const markForNgo = async (id: number) => {
    try {
      await surplusApi.markForNgo(id);
      toast.success("Marked for NGO pickup");
      load();
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="NGO Queue"
        subtitle="Surplus marked for NGO donation"
      />

      {loading ? (
        <div className="text-slate-400 py-8">Loading...</div>
      ) : queue.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100">
          <EmptyState
            icon={Heart}
            title="NGO queue is empty"
            description="No surplus is currently marked for NGO pickup."
          />
        </div>
      ) : (
        <div className="space-y-3">
          {queue.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white">
                  <Leaf size={22} />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{item.mealId}</p>
                  <p className="text-sm text-slate-500">
                    {item.mealType} · {item.surplusQty} portions available
                  </p>
                </div>
              </div>
              <Badge color="green">Waiting for pickup</Badge>
            </div>
          ))}
        </div>
      )}

      {/* Instruction card */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="text-sm text-amber-800">
          <strong>Note:</strong> Unclaimed surplus is auto-routed to NGOs when
          the 20-minute day-scholar claim window closes. Mark items manually from
          the Surplus Log page if needed.
        </p>
      </div>
    </div>
  );
}