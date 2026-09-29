import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Send } from "lucide-react";
import toast from "react-hot-toast";

import { feedbackApi } from "../../api/feedbackApi";
import { menuApi } from "../../api/menuApi";
import type { MenuItemDTO } from "../../types/menu";
import { MEAL_TYPES, type MealType } from "../../types/vote";
import Button from "../../components/common/Button";

export default function FeedbackFormPage() {
  const navigate = useNavigate();

  const [mealType, setMealType] = useState<MealType>("BREAKFAST");
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [mealId, setMealId] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const list = await menuApi.listByMealType(mealType);
        setItems(list);
        setMealId("");
      } catch {
        /* ignore */
      }
    })();
  }, [mealType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealId) return toast.error("Pick a meal first");
    if (rating === 0) return toast.error("Please give a rating");

    setSubmitting(true);
    try {
      await feedbackApi.submit({ mealId, mealType, rating, comment });
      toast.success("Thanks for your feedback!");
      navigate("/student/feedback");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-4">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Rate a Meal</h2>
          <p className="text-xs text-slate-500">
            Your feedback shapes tomorrow's menu
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Meal type */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Which meal?
          </label>
          <div className="flex gap-2">
            {MEAL_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setMealType(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
                  mealType === t
                    ? "bg-teal text-white"
                    : "bg-white text-slate-600 border border-slate-200"
                }`}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Item */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Which item?
          </label>
          <select
            value={mealId}
            onChange={(e) => setMealId(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal text-sm bg-white"
            required
          >
            <option value="">— Select an item —</option>
            {items.map((i) => (
              <option key={i.id} value={i.id}>
                {i.itemName}
              </option>
            ))}
          </select>
        </div>

        {/* Rating */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Your rating
          </label>
          <div className="flex justify-center gap-2 py-3">
            {[1, 2, 3, 4, 5].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setRating(s)}
                onMouseEnter={() => setHovered(s)}
                onMouseLeave={() => setHovered(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  size={36}
                  className={
                    s <= (hovered || rating)
                      ? "fill-amber-400 text-amber-400"
                      : "text-slate-200"
                  }
                />
              </button>
            ))}
          </div>
          {rating > 0 && (
            <p className="text-center text-xs text-slate-500">
              {rating === 5
                ? "Excellent!"
                : rating === 4
                ? "Good"
                : rating === 3
                ? "Okay"
                : rating === 2
                ? "Not great"
                : "Poor"}
            </p>
          )}
        </div>

        {/* Comment */}
        <div>
          <label className="block text-xs font-medium text-slate-700 mb-2">
            Comment (optional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Tell us more about your experience..."
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal text-sm resize-none"
          />
          <p className="text-[10px] text-slate-400 mt-1 text-right">
            {comment.length}/500
          </p>
        </div>

        <Button type="submit" loading={submitting} className="w-full">
          <Send size={16} /> Submit Feedback
        </Button>
      </form>
    </div>
  );
}