import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Props {
  isLocked: boolean;
  isUpcoming: boolean;
  lockedAt: Date;
  opensAt: Date;
  votingFor?: string;
}

function useCountdown(target: Date) {
  const [diff, setDiff] = useState(target.getTime() - Date.now());

  useEffect(() => {
    const id = setInterval(() => {
      setDiff(target.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [target]);

  const expired = diff <= 0;
  const total = Math.max(0, diff);

  const hours = Math.floor(total / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);

  return {
    expired,
    hours,
    minutes,
    seconds,
    formatted: `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`,
  };
}

function formatTime(d: Date) {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function VoteStatusBanner({
  isLocked,
  isUpcoming,
  lockedAt,
  opensAt,
  votingFor,
}: Props) {
  // ---------- LOCKED ----------
  if (isLocked) {
    return (
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
        <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm">Voting is closed</p>
          <p className="text-xs text-red-600 mt-1">
            This meal's voting closed at {formatTime(lockedAt)}.
          </p>
        </div>
      </div>
    );
  }

  // ---------- UPCOMING ----------
  if (isUpcoming) {
    return <UpcomingBanner opensAt={opensAt} />;
  }

  // ---------- OPEN ----------
  return <OpenBanner lockedAt={lockedAt} opensAt={opensAt} votingFor={votingFor} />;
}

/* ============== OPEN BANNER with countdown + progress ============== */

function OpenBanner({
  lockedAt,
  opensAt,
  votingFor,
}: {
  lockedAt: Date;
  opensAt: Date;
  votingFor?: string;
}) {
  const { formatted } = useCountdown(lockedAt);

  // Progress: 0% when opens, 100% when closes
  const total = lockedAt.getTime() - opensAt.getTime();
  const elapsed = Date.now() - opensAt.getTime();
  const progress = Math.min(100, Math.max(0, (elapsed / total) * 100));

  const isClosingSoon = lockedAt.getTime() - Date.now() < 15 * 60 * 1000;
  const barColor = isClosingSoon
    ? "from-amber-500 to-red-500"
    : "from-green-500 to-teal";

  return (
    <div className="p-4 rounded-2xl bg-green-50 border border-green-200">
      <div className="flex items-start gap-3">
        <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-green-800 text-sm">
            {votingFor ? `You're voting for ${votingFor}` : "Voting is open"}
          </p>
          <p className="text-xs text-green-700 mt-1">
            Closes at {formatTime(lockedAt)}
          </p>
        </div>
      </div>

      {/* Countdown display */}
      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-green-800 flex items-center gap-1">
          <Clock size={12} />
          {isClosingSoon ? "Closing soon" : "Time remaining"}
        </span>
        <span
          className={`font-mono font-bold tabular-nums text-sm ${
            isClosingSoon ? "text-red-600" : "text-green-800"
          }`}
        >
          {formatted}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mt-2 h-1.5 bg-green-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

/* ============== UPCOMING BANNER ============== */

function UpcomingBanner({ opensAt }: { opensAt: Date }) {
  const { formatted } = useCountdown(opensAt);

  return (
    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200">
      <div className="flex items-start gap-3">
        <Clock size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="font-semibold text-amber-800 text-sm">
            Voting hasn't opened yet
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Opens at {formatTime(opensAt)}
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs font-medium text-amber-800">Opens in</span>
        <span className="font-mono font-bold tabular-nums text-sm text-amber-800">
          {formatted}
        </span>
      </div>
    </div>
  );
}