import { useState } from "react";
import { Plus, Search, UserCheck } from "lucide-react";
import toast from "react-hot-toast";

import { surplusApi } from "../../../api/surplusApi";
import type { DayScholarDTO } from "../../../types/surplus";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";

export default function DayScholarsPage() {
  const [form, setForm] = useState<DayScholarDTO>({
    name: "",
    collegeId: "",
    phone: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [search, setSearch] = useState("");
  const [found, setFound] = useState<DayScholarDTO | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const saved = await surplusApi.registerDayScholar(form);
      toast.success(`Registered: ${saved.name}`);
      setForm({ name: "", collegeId: "", phone: "" });
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearch = async () => {
    if (!search.trim()) return;
    setNotFound(false);
    setFound(null);
    try {
      const result = await surplusApi.getDayScholarByCollegeId(search.trim());
      setFound(result);
    } catch {
      setNotFound(true);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Day Scholars"
        subtitle="Register and look up day scholars who can claim surplus"
      />

      {/* Register form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4 max-w-xl"
      >
        <h3 className="font-semibold text-slate-900 flex items-center gap-2">
          <Plus size={18} className="text-teal" />
          Register New Day Scholar
        </h3>

        <Input
          label="Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="College ID *"
            value={form.collegeId}
            onChange={(e) => setForm({ ...form, collegeId: e.target.value })}
            required
          />
          <Input
            label="Phone *"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
          />
        </div>

        <Button type="submit" loading={submitting}>
          <UserCheck size={16} /> Register
        </Button>
      </form>

      {/* Lookup */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 max-w-xl">
        <h3 className="font-semibold text-slate-900 mb-4">Find by College ID</h3>

        <div className="flex gap-2">
          <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200">
            <Search size={16} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter college ID"
              className="bg-transparent outline-none flex-1 text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {found && (
          <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-200">
            <p className="font-medium text-green-800">{found.name}</p>
            <p className="text-sm text-green-700 mt-1">
              College ID: {found.collegeId} · Phone: {found.phone} · Claims:{" "}
              {found.claimCount ?? 0}
            </p>
          </div>
        )}

        {notFound && (
          <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-700">
            No day scholar found with that college ID.
          </div>
        )}
      </div>
    </div>
  );
}