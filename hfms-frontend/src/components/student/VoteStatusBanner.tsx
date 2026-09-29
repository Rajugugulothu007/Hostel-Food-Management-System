import { AlertCircle, CheckCircle, Clock } from "lucide-react";

interface Props {
  isLocked: boolean;
  isUpcoming: boolean;
  lockedAt: Date;
  opensAt: Date;
  votingFor?: string;
}

export default function VoteStatusBanner({
  isLocked,
  isUpcoming,
  lockedAt,
  opensAt,
  votingFor,
}: Props) {
  if (isLocked) {
    return (
      <div className="p-4 rounded-2xl bg-red-50 border border-red-200 flex items-start gap-3">
        <AlertCircle size={20} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-red-800 text-sm">Voting is closed</p>
          <p className="text-xs text-red-600 mt-1">
            This meal's voting closed at{" "}
            {lockedAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            .
          </p>
        </div>
      </div>
    );
  }

  if (isUpcoming) {
    return (
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <Clock size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-amber-800 text-sm">
            Voting hasn't opened yet
          </p>
          <p className="text-xs text-amber-600 mt-1">
            Opens at{" "}
            {opensAt.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            .
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl bg-green-50 border border-green-200 flex items-start gap-3">
      <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-green-800 text-sm">
          {votingFor ? `You're voting for ${votingFor}` : "Voting is open"}
        </p>
        <p className="text-xs text-green-700 mt-1">
          Closes at{" "}
          {lockedAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
          .
        </p>
      </div>
    </div>
  );
}