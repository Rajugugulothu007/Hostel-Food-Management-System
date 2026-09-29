import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, Vote, X } from "lucide-react";
import toast from "react-hot-toast";

import { menuApi } from "../../api/menuApi";
import { votingApi } from "../../api/votingApi";
import type { MenuItemDTO } from "../../types/menu";
import { MEAL_TYPES, type MealType } from "../../types/vote";
import { useVoteWindows } from "../../hooks/useVoteWindows";

import MealTabs from "../../components/student/MealTabs";
import MenuItemCard from "../../components/student/MenuItemCard";
import VoteStatusBanner from "../../components/student/VoteStatusBanner";
import Button from "../../components/common/Button";

export default function VotePage() {
  const navigate = useNavigate();
  const windows = useVoteWindows();

  const [mealType, setMealType] = useState<MealType>("BREAKFAST");
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const windowInfo = windows[mealType];

  useEffect(() => {
    (async () => {
      setLoading(true);
      setSelectedId(null);
      try {
        setItems(await menuApi.listByMealType(mealType));
      } catch {
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    })();
  }, [mealType]);

  const handleSubmit = async () => {
    if (!selectedId) return;
    setSubmitting(true);
    try {
      const res = await votingApi.castVote({ mealId: selectedId, mealType });
      toast.success(
        res.status === "CREATED" ? "Vote cast!" : "Vote updated!"
      );
      navigate("/student/confirmation", {
        state: { mealId: selectedId, mealType },
      });
    } catch (err: any) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Vote failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
      setShowConfirm(false);
    }
  };

  const selectedItem = items.find((i) => i.id === selectedId);
  const canVote = windowInfo.isOpen;

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate("/student/home")}
          className="p-2 rounded-lg hover:bg-slate-100 transition"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Vote for your meal</h2>
          <p className="text-xs text-slate-500">
            Pick one item. You can change it any time before the cutoff.
          </p>
        </div>
      </div>

      {/* Meal tabs */}
      <MealTabs
        selected={mealType}
        onChange={setMealType}
        status={Object.fromEntries(
          MEAL_TYPES.map((m) => [m, windows[m]])
        ) as any}
      />

      {/* Status banner */}
      <VoteStatusBanner
        isLocked={windowInfo.isLocked}
        isUpcoming={windowInfo.isUpcoming}
        lockedAt={windowInfo.locksAt}
        opensAt={windowInfo.opensAt}
        votingFor={selectedItem?.itemName}
      />

      {/* Menu list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="animate-pulse h-24 bg-slate-100 rounded-2xl"
            />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center text-slate-400 bg-white rounded-2xl border border-slate-100">
          No menu items for this meal yet.
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <MenuItemCard
              key={item.id}
              id={item.id!}
              name={item.itemName}
              quantity={item.quantity}
              dietaryTags={item.dietaryTags}
              isSelected={selectedId === item.id}
              disabled={!canVote}
              onSelect={() => {
                if (!canVote) {
                  toast.error("Voting is closed for this meal");
                  return;
                }
                setSelectedId(item.id!);
              }}
            />
          ))}
        </div>
      )}

      {/* Sticky submit bar */}
      {items.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 sm:static sm:bottom-0 px-4 sm:px-0">
          <div className="max-w-md mx-auto sm:max-w-none">
            <div className="bg-white sm:bg-transparent border-t sm:border-0 p-4 sm:p-0 shadow-lg sm:shadow-none rounded-t-2xl sm:rounded-none">
              {selectedItem && (
                <div className="flex items-center justify-between mb-2 text-xs">
                  <span className="text-slate-500">Selected:</span>
                  <span className="font-medium text-teal truncate ml-2">
                    {selectedItem.itemName}
                  </span>
                </div>
              )}

              <Button
                onClick={() => setShowConfirm(true)}
                disabled={!selectedId || !canVote}
                loading={submitting}
                className="w-full"
              >
                <Vote size={16} />
                {canVote ? "Cast Vote" : "Voting Closed"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {showConfirm && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <button
              onClick={() => setShowConfirm(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-slate-100"
            >
              <X size={16} className="text-slate-400" />
            </button>

            <div className="w-14 h-14 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-4">
              <Vote size={26} className="text-teal" />
            </div>

            <h3 className="text-center font-semibold text-slate-900 mb-2">
              Confirm your vote
            </h3>
            <p className="text-center text-sm text-slate-500 mb-1">
              You're voting for
            </p>
            <p className="text-center font-semibold text-teal mb-6">
              {selectedItem.itemName}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium text-sm transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-teal text-white hover:bg-teal/90 font-medium text-sm transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <Check size={16} />
                {submitting ? "Sending..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}