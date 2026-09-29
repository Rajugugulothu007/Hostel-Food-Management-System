import { useEffect, useState } from "react";
import { TrendingUp, Award, CheckCircle, Leaf, Target } from "lucide-react";
import { attendanceApi } from "../../api/attendanceApi";
import type { CheckInDTO } from "../../types/attendance";
import StatCard from "../../components/common/StatCard";

export default function ImpactPage() {
  const [checkIns, setCheckIns] = useState<CheckInDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Demo student ID — replace with real one from auth
  const studentId = 1;

  useEffect(() => {
    (async () => {
      try {
        setCheckIns(await attendanceApi.studentHistory(studentId));
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const mealsSaved = checkIns.length;
  const checkInRate = checkIns.length > 0 ? 94 : 0; // TODO: compute vs votes
  const rank = 12; // TODO: compute from leaderboard

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Your Impact 🌱</h2>
        <p className="text-xs text-slate-500 mt-1">
          Every vote + check-in helps reduce food waste
        </p>
      </div>

      {/* Big hero stat */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/20 text-center">
        <Leaf size={28} className="mx-auto mb-2" />
        <p className="text-sm opacity-90">You've helped save</p>
        <p className="text-4xl font-bold my-1">{mealsSaved}</p>
        <p className="text-sm opacity-90">meals from waste</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard label="Votes Cast" value={checkIns.length || "—"} icon={CheckCircle} color="teal" />
        <StatCard label="Check-In Rate" value={`${checkInRate}%`} icon={Target} color="green" />
        <StatCard label="Reliability Rank" value={`#${rank}`} icon={Award} color="amber" />
        <StatCard label="This Month" value={mealsSaved} icon={TrendingUp} color="blue" />
      </div>

      {/* Recent check-ins */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-3 border-b">
          <h3 className="font-semibold text-slate-900 text-sm">
            Recent Check-Ins
          </h3>
        </div>

        {loading ? (
          <div className="p-6 text-center text-slate-400 text-sm">Loading...</div>
        ) : checkIns.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-sm">
            No check-ins yet. Show your QR at the mess counter!
          </div>
        ) : (
          <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto">
            {checkIns.slice(0, 10).map((c) => (
              <div key={c.id} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-800">{c.mealId}</p>
                  <p className="text-xs text-slate-500">{c.mealType}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(c.checkInTime).toLocaleDateString([], {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-xs text-slate-400 text-center">
        Rank is calculated from your check-in consistency and vote participation.
      </p>
    </div>
  );
}