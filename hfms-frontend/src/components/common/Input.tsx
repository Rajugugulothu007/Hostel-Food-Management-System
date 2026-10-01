import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export default function Input({
  label,
  error,
  type = "text",
  className = "",
  ...rest
}: Props) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-slate-700 mb-1.5">
        {label}
      </label>

      <div className="relative">
        <input
          type={inputType}
          className={`w-full px-3 py-2.5 pr-10 text-sm border rounded-lg
            focus:outline-none focus:ring-2 focus:ring-teal focus:border-teal
            transition placeholder:text-slate-400
            ${
              error
                ? "border-red-400 bg-red-50/50"
                : "border-slate-300 bg-white"
            } ${className}`}
          {...rest}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
          {error}
        </p>
      )}
    </div>
  );
}