import type { ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  loading?: boolean;
  size?: "sm" | "md" | "lg";
}

export default function Button({
  children,
  variant = "primary",
  size = "md",
  loading,
  className = "",
  ...rest
}: Props) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]";

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2.5 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const variants = {
    primary:
      "bg-teal text-white hover:bg-teal/90 shadow-md shadow-teal/20 hover:shadow-lg hover:shadow-teal/30",
    secondary:
      "bg-slate-100 text-slate-800 hover:bg-slate-200 border border-slate-200",
    danger: "bg-red-500 text-white hover:bg-red-600 shadow-md shadow-red-500/20",
    ghost: "text-slate-600 hover:bg-slate-100",
  };

  return (
    <button
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
      disabled={loading || rest.disabled}
      {...rest}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}