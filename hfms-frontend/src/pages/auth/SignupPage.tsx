import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import toast from "react-hot-toast";

import { authApi } from "../../api/authApi";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "STUDENT">("STUDENT");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (username.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      await authApi.signup({ username, password, role });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err: any) {
      setError(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join HFMS in under a minute"
    >
      <form onSubmit={handleSubmit}>
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
          placeholder="Choose a username"
          autoComplete="username"
          autoFocus
          required
        />

        <Input
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 6 characters"
          autoComplete="new-password"
          required
        />

        <div className="mb-5">
          <label className="block text-xs font-medium text-slate-700 mb-1.5">
            Account type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["STUDENT", "ADMIN"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`py-2.5 rounded-lg text-sm font-medium border-2 transition ${
                  role === r
                    ? "border-teal bg-teal/5 text-teal"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {r === "STUDENT" ? "Student" : "Admin"}
              </button>
            ))}
          </div>
        </div>

        <Button type="submit" loading={loading} className="w-full" size="lg">
          Create account
        </Button>

        <p className="text-[11px] text-slate-400 text-center mt-4 leading-relaxed">
          By creating an account, you agree to HFMS's{" "}
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

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-slate-400">
            Already have an account?
          </span>
        </div>
      </div>

      <Link
        to="/login"
        className="block w-full text-center px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        Sign in
      </Link>
    </AuthLayout>
  );
}