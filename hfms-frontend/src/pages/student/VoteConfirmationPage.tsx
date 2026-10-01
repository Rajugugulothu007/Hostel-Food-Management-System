import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { CheckCircle, Clock, Home, RefreshCw } from "lucide-react";
import { menuApi } from "../../api/menuApi";
import { useVoteWindows } from "../../hooks/useVoteWindows";
import type { MealType } from "../../types/vote";
import Button from "../../components/common/Button";

export default function VoteConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const windows = useVoteWindows();

  const { mealId, mealType } = (location.state as any) || {};

  const [itemName, setItemName] = useState<string>("");
  const [countdown, setCountdown] = useState("");

  const windowInfo = windows[mealType as MealType];

  // Fetch the item name from menu-service
  useEffect(() => {
    if (!mealId) return;
    (async () => {
      try {
        const item = await menuApi.getById(mealId);
        setItemName(item.itemName);
      } catch {
        setItemName(mealId);
      }
    })();
  }, [mealId]);

  // Live countdown to lock
  useEffect(() => {
    if (!windowInfo || !windowInfo.locksAt) return;
    const tick = () => {
      const diff = windowInfo.locksAt.getTime() - Date.now();
      if (diff <= 0) {
        setCountdown("Voting closed");
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setCountdown(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(
          s
        ).padStart(2, "0")}`
      );
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [windowInfo]);

  if (!mealId) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-500">No vote to show.</p>
        <Button onClick={() => navigate("/student/home")} className="mt-4">
          Back Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-6 space-y-6">
      {/* Success animation */}
      <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center animate-in zoom-in-50 duration-300">
        <CheckCircle size={44} className="text-green-500" />
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-slate-900">You're all set!</h2>
        <p className="text-sm text-slate-500 mt-1">
          Your vote has been recorded.
        </p>
      </div>

      {/* Vote card */}
      <div className="w-full p-5 rounded-2xl bg-gradient-to-br from-teal/10 to-cyan-100 border border-teal/20">
        <p className="text-xs text-teal font-medium mb-1">
          {mealType} VOTE
        </p>
        <p className="font-semibold text-slate-900 text-lg">{itemName}</p>
        <p className="text-xs text-slate-500 mt-1 font-mono">{mealId}</p>
      </div>

      {/* Countdown to lock */}
      <div className="w-full p-4 rounded-2xl bg-white border border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <Clock size={14} />
            Change vote closes in
          </div>
          <span className="font-mono font-bold text-slate-900 tabular-nums">
            {countdown || "--:--:--"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="w-full space-y-2">
        <Button
          onClick={() => navigate("/student/vote")}
          className="w-full"
          variant="secondary"
        >
          <RefreshCw size={16} /> Change Vote
        </Button>
        <Button onClick={() => navigate("/student/home")} className="w-full">
          <Home size={16} /> Back to Home
        </Button>
      </div>

      <p className="text-xs text-slate-400 text-center max-w-xs">
        Your vote helps the kitchen cook exactly what's needed — no more
        guessing, no more waste.
      </p>
    </div>
  );
}