import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../store/authStore";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await authApi.login({ username, password });
      setUser({ username: res.username, role: res.role, token: res.token });
      toast.success("Logged in!");

      navigate(res.role === "ADMIN" ? "/admin/dashboard" : "/student/home");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-navy p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-navy mb-2">HFMS Login</h1>
        <p className="text-gray-500 mb-6">Hostel Food Management System</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <Button type="submit" loading={loading} className="w-full">
            Login
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          No account?{" "}
          <Link to="/signup" className="text-teal font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}