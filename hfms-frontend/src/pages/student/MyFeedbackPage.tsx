import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessageSquare, Plus, Star } from "lucide-react";
import toast from "react-hot-toast";
import { feedbackApi } from "../../api/feedbackApi";
import type { FeedbackDTO } from "../../types/feedback";
import Button from "../../components/common/Button";

export default function MyFeedbackPage() {
  const [items, setItems] = useState<FeedbackDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        setItems(await feedbackApi.myFeedback());
      } catch {
        toast.error("Failed to load feedback");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900">My Feedback</h2>
          <p className="text-xs text-slate-500 mt-1">
            Your meal ratings help improve the menu
          </p>
        </div>
        <Button size="sm" onClick={() => navigate("/student/feedback/new")}>
          <Plus size={14} /> Rate
        </Button>
      </div>

      {loading ? (
        <div className="text-center py-8 text-slate-400 text-sm">Loading...</div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <MessageSquare size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm text-slate-500">No feedback yet</p>
          <Button
            className="mt-4"
            size="sm"
            onClick={() => navigate("/student/feedback/new")}
          >
            Rate your first meal
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((f) => (
            <div
              key={f.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-slate-900 truncate">
                    {f.mealId}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {f.mealType}
                  </p>
                </div>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      size={14}
                      className={
                        s <= f.rating
                          ? "fill-amber-400 text-amber-400"
                          : "text-slate-200"
                      }
                    />
                  ))}
                </div>
              </div>
              {f.comment && (
                <p className="text-xs text-slate-600 mt-2 italic">
                  "{f.comment}"
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}