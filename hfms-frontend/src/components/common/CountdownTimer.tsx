import { Clock } from "lucide-react";
import { useCountdown } from "../../hooks/useCountdown";

interface Props {
  target: string | Date;
  label?: string;
}

export default function CountdownTimer({ target, label }: Props) {
  const { days, hours, minutes, seconds, expired } = useCountdown(target);

  if (expired) {
    return (
      <div className="flex items-center gap-2 text-red-600 font-semibold">
        <Clock size={16} /> Voting closed
      </div>
    );
  }

  const parts = [
    { v: days, l: "d" },
    { v: hours, l: "h" },
    { v: minutes, l: "m" },
    { v: seconds, l: "s" },
  ].filter((p) => p.v > 0 || p.l !== "d");

  return (
    <div className="flex items-center gap-2">
      <Clock size={16} className="text-teal" />
      {label && <span className="text-sm text-slate-500">{label}</span>}
      <div className="flex items-center gap-1">
        {parts.map((p, i) => (
          <span key={i} className="flex items-baseline gap-0.5">
            <span className="font-mono font-bold text-slate-900 tabular-nums">
              {String(p.v).padStart(2, "0")}
            </span>
            <span className="text-xs text-slate-500">{p.l}</span>
          </span>
        ))}
      </div>
    </div>
  );
}