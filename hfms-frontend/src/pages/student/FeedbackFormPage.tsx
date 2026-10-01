import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Send, Info, UtensilsCrossed } from "lucide-react";
import toast from "react-hot-toast";

import { feedbackApi } from "../../api/feedbackApi";
import { menuApi } from "../../api/menuApi";
import type { MenuItemDTO } from "../../types/menu";
import Button from "../../components/common/Button";
import { getFoodImage } from "../../utils/foodEmoji";

export default function FeedbackFormPage() {
  const navigate = useNavigate();

  const [eligibleItems, setEligibleItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [mealId, setMealId] = useState("");
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Fetch eligible items = (voted + checked-in today) minus already-rated
  useEffect(() => {
    (async () => {
      try {
        // Step 1: get eligible meal IDs from feedback-service
        const eligible = await feedbackApi.getEligible();
        const eligibleIds = eligible.map((e) => e.mealId);

        if (eligibleIds.length === 0) {
          setEligibleItems([]);
          return;
        }

        // Step 2: fetch full menu details for those IDs
        const allMenu = await menuApi.list();
        const filtered = allMenu.filter((m) => eligibleIds.includes(m.id!));
        setEligibleItems(filtered);
      } catch {
        toast.error("Failed to load eligible items");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealId) return toast.error("Pick a meal first");
    if (rating === 0) return toast.error("Please give a rating");

    const selectedItem = eligibleItems.find((i) => i.id === mealId);

    setSubmitting(true);
    try {
      await feedbackApi.submit({
        mealId,
        mealType: selectedItem!.mealType,
        rating,
        comment,
      });
      toast.success("Thanks for your feedback!");
      navigate("/student/feedback");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Submit failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-slate-400 text-sm">Loading...</div>
    );
  }

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

      {/* No eligible items — empty state */}
      {eligibleItems.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-8 text-center">
          <UtensilsCrossed size={32} className="mx-auto text-slate-300 mb-2" />
          <p className="text-sm font-medium text-slate-700">
            No meals to rate right now
          </p>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            You can only rate meals you've <strong>voted for</strong> and{" "}
            <strong>checked in</strong> for today.
          </p>
          <Button
            className="mt-4"
            size="sm"
            variant="secondary"
            onClick={() => navigate("/student/home")}
          >
            Back to Home
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Info banner */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-teal/5 border border-teal/20">
            <Info size={16} className="text-teal flex-shrink-0 mt-0.5" />
            <p className="text-xs text-teal-800">
              Showing only meals you voted for and checked in today.
            </p>
          </div>

          {/* Item picker — card list with images */}
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-2">
              Which meal?
            </label>
            <div className="space-y-2">
              {eligibleItems.map((item) => {
                const img = item.imageUrl || getFoodImage(item.id);
                const isSelected = mealId === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMealId(item.id!)}
                    className={`w-full p-3 rounded-xl border-2 flex items-center gap-3 text-left transition ${
                      isSelected
                        ? "border-teal bg-teal/5"
                        : "border-slate-200 bg-white hover:border-teal/40"
                    }`}
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0">
                      {img ? (
                        <img
                          src={img}
                          alt={item.itemName}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🍽
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 truncate">
                        {item.itemName}
                      </p>
                      <p className="text-xs text-slate-500">{item.mealType}</p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "bg-teal border-teal"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="w-2 h-2 rounded-full bg-white" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
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
              placeholder="Tell us more..."
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
      )}
    </div>
  );
}