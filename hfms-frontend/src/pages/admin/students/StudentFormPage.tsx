import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";

import { userApi } from "../../../api/userApi";
import type { StudentDTO } from "../../../types/student";
import PageHeader from "../../../components/common/PageHeader";
import Button from "../../../components/common/Button";
import Input from "../../../components/common/Input";

const empty: StudentDTO = {
  name: "",
  rollNo: "",
  roomNo: "",
  phone: "",
  email: "",
  active: true,
};

export default function StudentFormPage() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();

  const [form, setForm] = useState<StudentDTO>(empty);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    (async () => {
      try {
        const data = await userApi.getById(Number(id));
        setForm(data);
      } catch {
        toast.error("Student not found");
        navigate("/admin/students");
      } finally {
        setFetching(false);
      }
    })();
  }, [id, isEdit, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isEdit) {
        await userApi.update(Number(id), form);
        toast.success("Student updated");
      } else {
        await userApi.create(form);
        toast.success("Student created");
      }
      navigate("/admin/students");
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Save failed");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="text-slate-400">Loading...</div>;

  return (
    <div className="max-w-2xl">
      <PageHeader
        title={isEdit ? "Edit Student" : "Add Student"}
        subtitle={isEdit ? `Updating student #${id}` : "Register a new student"}
        action={
          <Button
            variant="secondary"
            onClick={() => navigate("/admin/students")}
          >
            <ArrowLeft size={16} /> Back
          </Button>
        }
      />

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4"
      >
        <Input
          label="Full Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Roll Number *"
            value={form.rollNo}
            onChange={(e) => setForm({ ...form, rollNo: e.target.value })}
            disabled={isEdit}
            required
          />
          <Input
            label="Room Number"
            value={form.roomNo || ""}
            onChange={(e) => setForm({ ...form, roomNo: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Phone"
            value={form.phone || ""}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <Input
            label="Email"
            type="email"
            value={form.email || ""}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {isEdit && (
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.active ?? true}
              onChange={(e) => setForm({ ...form, active: e.target.checked })}
              className="w-4 h-4 accent-teal"
            />
            <span className="text-sm text-slate-700">Active</span>
          </label>
        )}

        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" loading={loading}>
            <Save size={16} /> {isEdit ? "Update" : "Create"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/admin/students")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}