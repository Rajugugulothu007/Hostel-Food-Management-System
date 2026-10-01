interface Props {
  label: string;
  count: number;
  max: number;
  highlight?: boolean;
}

export default function VoteBar({ label, count, max, highlight }: Props) {
  const pct = max === 0 ? 0 : (count / max) * 100;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-sm">
        <span className={`font-medium ${highlight ? "text-teal" : "text-slate-700"}`}>
          {label}
        </span>
        <span className="text-slate-500 tabular-nums">
          {count} {count === 1 ? "vote" : "votes"}
        </span>
      </div>
      <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            highlight
              ? "bg-gradient-to-r from-teal to-cyan-500"
              : "bg-gradient-to-r from-slate-400 to-slate-500"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}