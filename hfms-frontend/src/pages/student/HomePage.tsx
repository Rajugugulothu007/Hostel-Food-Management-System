import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  UtensilsCrossed,
  Vote,
  ArrowRight,
  CheckCircle,
  MessageSquare,
} from "lucide-react";
import toast from "react-hot-toast";

import { menuApi } from "../../api/menuApi";
import type { MenuItemDTO } from "../../types/menu";
import { MEAL_TYPES, type MealType } from "../../types/vote";
import { useVoteWindows } from "../../hooks/useVoteWindows";
import { useAuthStore } from "../../store/authStore";

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const windows = useVoteWindows();

  const [selectedMeal, setSelectedMeal] = useState<MealType>("BREAKFAST");
  const [items, setItems] = useState<MenuItemDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const windowInfo = windows[selectedMeal];

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setItems(await menuApi.listByMealType(selectedMeal));
      } catch {
        toast.error("Failed to load menu");
      } finally {
        setLoading(false);
      }
    })();
  }, [selectedMeal]);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const minutesLeft = Math.max(
    0,
    Math.floor((windowInfo.locksAt.getTime() - Date.now()) / 60000)
  );

  return (
    <div className="space-y-5 pb-4">
      {/* Greeting */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-teal to-cyan-600 text-white shadow-lg shadow-teal/20">
        <p className="text-sm opacity-90">
          {greeting}, {user?.username} 👋
        </p>
        <h2 className="text-xl font-bold mt-1">What's for today?</h2>

        {/* Time window badge — shows for ALL states */}
        <div className="mt-3 flex items-center gap-2 text-xs bg-white/15 px-3 py-1.5 rounded-full w-fit">
          <Clock size={12} />
          <span>
            {windowInfo.isLocked
              ? `Closed at ${windowInfo.locksAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : windowInfo.isOpen
              ? `Voting closes at ${windowInfo.locksAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : `Voting opens at ${windowInfo.opensAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`}
          </span>
        </div>
      </div>

      {/* Meal tabs */}
      <div className="flex gap-2">
        {MEAL_TYPES.map((meal) => {
          const info = windows[meal];
          const isActive = selectedMeal === meal;

          return (
            <button
              key={meal}
              onClick={() => setSelectedMeal(meal)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition ${
                isActive
                  ? "bg-teal text-white shadow-md shadow-teal/20"
                  : "bg-white text-slate-600 border border-slate-200"
              }`}
            >
              {meal.charAt(0) + meal.slice(1).toLowerCase()}
              {info.isLocked && (
                <span className="block text-[10px] opacity-70 mt-0.5">
                  Closed
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Menu preview */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-teal" />
            <h3 className="font-semibold text-slate-900 text-sm">
              {selectedMeal.charAt(0) + selectedMeal.slice(1).toLowerCase()} Menu
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            {items.length} {items.length === 1 ? "option" : "options"}
          </span>
        </div>

        {loading ? (
          <div className="p-5 space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="h-4 bg-slate-100 rounded w-1/2" />
                <div className="h-3 bg-slate-100 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No items for this meal yet.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {items.slice(0, 4).map((item) => (
              <div key={item.id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-teal/10 flex items-center justify-center flex-shrink-0">
                  <UtensilsCrossed size={16} className="text-teal" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {item.itemName}
                  </p>
                  {item.quantity && (
                    <p className="text-xs text-slate-500 truncate">
                      {item.quantity}
                    </p>
                  )}
                </div>
              </div>
            ))}
            {items.length > 4 && (
              <p className="px-5 py-3 text-xs text-slate-500 text-center">
                + {items.length - 4} more
              </p>
            )}
          </div>
        )}
      </div>

      {/* Vote CTA */}
      <button
        onClick={() => navigate("/student/vote")}
        disabled={windowInfo.isLocked || windowInfo.isUpcoming}
        className={`w-full p-4 rounded-2xl flex items-center justify-between transition ${
          windowInfo.isLocked || windowInfo.isUpcoming
            ? "bg-slate-200 text-slate-500 cursor-not-allowed"
            : "bg-navy text-white hover:bg-slate-800 shadow-lg shadow-navy/20"
        }`}
      >
        <div className="flex items-center gap-3">
          <Vote size={20} />
          <div className="text-left">
            <p className="font-semibold text-sm">
              {windowInfo.isLocked
                ? "Voting closed"
                : windowInfo.isUpcoming
                ? "Voting hasn't opened"
                : "Cast your vote"}
            </p>
            <p className="text-xs opacity-70">
              {windowInfo.isLocked
                ? "Come back tomorrow"
                : windowInfo.isUpcoming
                ? "Check back soon"
                : "Choose what you want to eat"}
            </p>
          </div>
        </div>
        {!windowInfo.isLocked && !windowInfo.isUpcoming && (
          <ArrowRight size={18} />
        )}
      </button>

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-white border border-slate-100">
          <CheckCircle size={18} className="text-green-500 mb-1" />
          <p className="text-xs text-slate-500">Votes today</p>
          <p className="text-lg font-bold text-slate-900">—</p>
        </div>
        <div className="p-4 rounded-2xl bg-white border border-slate-100">
          <Clock size={18} className="text-amber-500 mb-1" />
          <p className="text-xs text-slate-500">Time left</p>
          <p className="text-lg font-bold text-slate-900">
            {windowInfo.isLocked ? "—" : `${minutesLeft}m`}
          </p>
        </div>
      </div>

      {/* Feedback CTA */}
      <button
        onClick={() => navigate("/student/feedback/new")}
        className="w-full p-4 rounded-2xl border border-slate-200 bg-white flex items-center justify-between hover:border-teal/40 transition"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center">
            <MessageSquare size={18} className="text-amber-500" />
          </div>
          <div className="text-left">
            <p className="font-semibold text-sm text-slate-900">
              Rate your last meal
            </p>
            <p className="text-xs text-slate-500">Help improve the menu</p>
          </div>
        </div>
        <ArrowRight size={18} className="text-slate-400" />
      </button>
    </div>
  );
}