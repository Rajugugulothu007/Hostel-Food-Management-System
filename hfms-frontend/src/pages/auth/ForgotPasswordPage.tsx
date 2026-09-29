import { Link } from "react-router-dom";
import AuthLayout from "../../components/layout/AuthLayout";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Reset password"
      subtitle="We'll send you reset instructions"
    >
      <form onSubmit={(e) => e.preventDefault()}>
        <Input
          label="Email or username"
          placeholder="Enter your email or username"
        />
        <Button type="submit" className="w-full" size="lg">
          Send reset link
        </Button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="px-3 bg-white text-xs text-slate-400">
            Remember it?
          </span>
        </div>
      </div>

      <Link
        to="/login"
        className="block w-full text-center px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-medium text-slate-700 hover:bg-slate-50 transition"
      >
        Back to sign in
      </Link>
    </AuthLayout>
  );
}