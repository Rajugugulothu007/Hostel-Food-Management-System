import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Props {
  data: { name: string; wastage: number }[];
}

export default function WastageLineChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={280}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="wastageLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#14B8A6" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
        <XAxis dataKey="name" stroke="#94A3B8" fontSize={12} />
        <YAxis
          stroke="#94A3B8"
          fontSize={12}
          tickFormatter={(v) => `${v}%`}
          domain={[0, "dataMax + 10"]}
        />
        <Tooltip
          contentStyle={{
            borderRadius: 12,
            border: "1px solid #E2E8F0",
            fontSize: 12,
          }}
          formatter={(v: number) => [`${v.toFixed(1)}%`, "Wastage"]}
        />
        <Line
          type="monotone"
          dataKey="wastage"
          stroke="url(#wastageLine)"
          strokeWidth={3}
          dot={{ r: 4, fill: "#14B8A6" }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}