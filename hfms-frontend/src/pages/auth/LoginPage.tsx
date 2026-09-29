import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await authApi.login({ username, password });
      setUser({ username: res.username, role: res.role, token: res.token });
      toast.success("Welcome back!");

      navigate(res.role === "ADMIN" ? "/admin/dashboard" : "/student/home");
    } catch (err: any) {
      const msg = err.response?.data?.error || "Invalid username or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign in" subtitle="Welcome back to HFMS">
      <form onSubmit={handleSubmit}>
        {/* Error banner */}
        {error && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-red-50 border border-red-200 mb-4">
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-red-700">{error}</p>
          </div>
        )}

        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          autoComplete="username"
          autoFocus
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          autoComplete="current-password"
          required
        />

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between mb-4 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-600">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 accent-teal"
              defaultChecked
            />
            Keep me signed in
          </label>

          <Link
            to="/forgot-password"
            className="text-teal hover:underline font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Sign in
        </Button>

        {/* Legal text */}
        <p className="text-[11px] text-slate-400 text-center mt-4 leading-relaxed">
          By signing in, you agree to HFMS's{" "}
          <a href="#" className="text-teal hover:underline">
            Terms of Use
          </a>{" "}
          and{" "}
          <a href="#" className="text-teal hover:underline">
            Privacy Policy
          </a>
          .
        </p>
      </form>

      {/* ---------- DIVIDER + SECONDARY ACTION ---------- */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-slate-400">
            New to HFMS?
          </span>
        </div>
      </div>

      <Link
        to="/signup"
        className="block w-full text-center px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        Create your HFMS account
      </Link>
    </AuthLayout>
  );
}