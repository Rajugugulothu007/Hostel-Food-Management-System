interface Props {
  children: React.ReactNode;
  color?: "green" | "red" | "amber" | "blue" | "gray";
}

export default function Badge({ children, color = "gray" }: Props) {
  const colors = {
    green: "bg-green-100 text-green-700 border-green-200",
    red: "bg-red-100 text-red-700 border-red-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    gray: "bg-slate-100 text-slate-700 border-slate-200",
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border ${colors[color]}`}
    >
      {children}
    </span>
  );
}